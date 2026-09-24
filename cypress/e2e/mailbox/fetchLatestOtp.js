// Microsoft Graph based OTP fetcher, run in the Node process via
// `cy.task("fetchLatestOtp", ...)`. This replaces the previous IMAP-based
// implementation (and the older fragile browser flow that visited
// outlook.office.com with cy.origin() blocks).
//
// IMAP basic authentication is disabled at the Microsoft 365 tenant level
// ("Logging in is disabled on this server"), so this helper talks to the
// Microsoft Graph API using modern OAuth2 authentication instead:
//
//   - Token:   OAuth2 "Resource Owner Password Credentials" flow against
//              https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
//   - Mail:    GET https://graph.microsoft.com/v1.0/me/messages
//
// Environment variables (loaded by dotenv in cypress.config.js; injected as
// GitHub Actions secrets in CI; never exposed to the test browser):
//
//   MAIL_USERNAME    mailbox address, e.g. blessing.olaiya@seerbit.com
//   MAIL_PASSWORD    the mailbox password (plain password - no 2FA app password)
//   MAIL_CLIENT_ID   Azure AD application (client) ID of the registered app
//   MAIL_TENANT_ID   Azure AD directory (tenant) ID - required: ROPC only works
//                    against a specific tenant endpoint, not /common
//   MAIL_CLIENT_SECRET  optional - only needed if the app registration is
//                    confidential. For ROPC a public client (no secret) works.
//
// The registered app must have the delegated "Mail.Read" API permission granted
// (admin or self-service consent) so the user can read their own mailbox.
const SLEEP_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Map the most common Azure AD error codes to actionable messages. The token
// endpoint returns an `error_codes` array; error[0] is the most specific code.
const TOKEN_ERROR_HINTS = {
    50126: "the username or password is incorrect",
    70016: "the application was not found - check MAIL_CLIENT_ID and MAIL_TENANT_ID",
    7000215: "the client secret is invalid or expired - check MAIL_CLIENT_SECRET",
    65001: "the Mail.Read permission has not been consented - ask an Azure AD admin to grant API permission/consent for the app",
    50053: "the account is locked - sign in to the mailbox in a browser to unlock it",
    50076: "multi-factor authentication is required, which ROPC cannot complete interactively - confirm MFA is truly disabled on the mailbox, or use MAIL_CLIENT_SECRET",
    50079: "the user must complete interactive sign-in once (MFA/terms are pending) - sign in to the mailbox in a browser",
    53003: "access is blocked by a Conditional Access policy - ask the tenant admin to allow this app/flow",
    50034: "the user could not be found in the directory - check MAIL_USERNAME",
    90033: "the app or user is blocked by Security Defaults for this flow - ask the tenant admin",
    900561: "the requested scope is invalid for the client - no code change should be needed, but confirm the Graph M365 app is configured with Mail.Read",
    70011: "the requested scope is invalid - confirm the app only requests Mail.Read",
    70001: "the application or resource was not found in the tenant - check MAIL_TENANT_ID / MAIL_CLIENT_ID",
};

function describeTokenFailure(statusCode, body) {
    const codes = Array.isArray(body.error_codes) ? body.error_codes : [];
    const primary = codes[0];
    const hint = primary ? TOKEN_ERROR_HINTS[primary] : null;

    const summary = hint
        ? hint
        : body.error_description
            ? String(body.error_description).split(".")[0]
            : "unknown reason";

    const parts = [`Microsoft login failed (HTTP ${statusCode}): ${summary}.`];
    if (primary) {
        parts.push(`Azure AD error code: ${primary}.`);
    }
    return parts.join(" ");
}

// Exchange a username/password for a Graph access token using the OAuth2
// Resource Owner Password Credentials flow. Node 18+ has a global fetch, so no
// MSAL/axios dependency is needed.
async function acquireAccessToken() {
    const username = process.env.MAIL_USERNAME;
    const password = process.env.MAIL_PASSWORD;
    const clientId = process.env.MAIL_CLIENT_ID;
    const tenantId = process.env.MAIL_TENANT_ID || "common";
    const clientSecret = process.env.MAIL_CLIENT_SECRET;

    if (!username || !password) {
        throw new Error(
            "MAIL_USERNAME / MAIL_PASSWORD environment variables are required to fetch the OTP. " +
            "Set them in a local .env file or as GitHub Actions secrets."
        );
    }
    if (!clientId) {
        throw new Error(
            "MAIL_CLIENT_ID environment variable is required to fetch the OTP via Microsoft Graph. " +
            "Register an app in Entra/Azure AD (App registrations) with the delegated Mail.Read " +
            "permission, then copy its Application (client) ID into .env (or as a GitHub secret)."
        );
    }
    if (!tenantId || tenantId === "common") {
        throw new Error(
            "MAIL_TENANT_ID environment variable is required: the OAuth2 password (ROPC) flow is " +
            "only supported against a specific tenant endpoint, not /common. Copy the Directory " +
            "(tenant) ID from the same Azure AD app registration into .env (or as a GitHub secret)."
        );
    }

    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", clientId);
    params.append("username", username);
    params.append("password", password);
    params.append("scope", "https://graph.microsoft.com/Mail.Read offline_access");
    if (clientSecret) {
        params.append("client_secret", clientSecret);
    }

    let response;
    try {
        response = await fetch(
            `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString(),
                signal: AbortSignal.timeout(15000),
            }
        );
    } catch (err) {
        throw new Error(`Could not reach the Microsoft login endpoint: ${err.message}`);
    }

    let body = {};
    try {
        body = await response.json();
    } catch (err) {
        /* non-JSON error body - fall through to the status-based message below */
    }

    if (!response.ok || !body.access_token) {
        throw new Error(describeTokenFailure(response.status, body));
    }

    return body.access_token;
}

// List the most recent messages for the authenticated user, newest first.
async function listMessages(token, sinceISO) {
    const filter = `receivedDateTime ge ${sinceISO}`;
    const url =
        "https://graph.microsoft.com/v1.0/me/messages" +
        "?$select=id,subject,from,receivedDateTime,body,hasAttachments" +
        `&$orderby=receivedDateTime desc&$top=25&$filter=${encodeURIComponent(filter)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        let body = {};
        try {
            body = await response.json();
        } catch (err) {
            /* ignore */
        }
        const detail = body.error && body.error.message ? `: ${body.error.message}` : "";
        throw new Error(`Graph API returned HTTP ${response.status}${detail}`);
    }

    const payload = await response.json();
    return payload.value || [];
}

function messageText(message) {
    const subject = message.subject || "";
    const rawBody = (message.body && message.body.content) || "";
    const textBody = String(rawBody).replace(/<[^>]*>/g, " ");
    return [subject, textBody].filter(Boolean).join(" ");
}

function extractOtp(text, term) {
    const primaryMatch = text.match(
        /(?:one\s*time\s*passcode|otp|passcode|verification\s*code)[^0-9]{0,40}?(\d{6})/i
    );
    if (primaryMatch) {
        return primaryMatch[1];
    }
    // Fallback: any bare 6-digit token in a message that already matches the
    // sender/subject term (e.g. "Seerbit").
    const bareMatch = text.match(/\b\d{6}\b/);
    return bareMatch ? bareMatch[0] : null;
}

async function fetchLatestOtp({ term = "Seerbit", timeout = 90000 } = {}) {
    const startTime = Date.now();
    const deadline = startTime + timeout;
    // Look back up to 24h so the recency filter below does the real work.
    const since = new Date(startTime - 24 * 60 * 60 * 1000).toISOString();

    // Authenticate up front: config/consent problems surface immediately
    // instead of being masked by a 90s "no OTP email" timeout. The token is
    // valid for ~1h, so it is reused across the polling loop below.
    let accessToken = await acquireAccessToken();
    console.log(`[fetchLatestOtp] Authenticated to Microsoft Graph for ${process.env.MAIL_USERNAME}`);
    let code = null;

    while (Date.now() < deadline && !code) {
        try {
            let messages;
            try {
                messages = await listMessages(accessToken, since);
            } catch (err) {
                if (/HTTP 401/.test(err.message)) {
                    // Expired/revoked token - refresh once and retry this cycle.
                    accessToken = await acquireAccessToken();
                    messages = await listMessages(accessToken, since);
                } else {
                    // Transient Graph failure (throttling, network) - retry next cycle.
                    console.warn(`[fetchLatestOtp] attempt failed: ${err.message}`);
                    await sleep(SLEEP_MS);
                    continue;
                }
            }

            for (const message of messages) {
                const received = message.receivedDateTime
                    ? new Date(message.receivedDateTime).getTime()
                    : null;
                if (received && received < startTime - 60000) {
                    continue; // stale - already existed before this test run started
                }

                const from = message.from && message.from.emailAddress
                    ? message.from.emailAddress.address
                    : "";
                const text = messageText(message);
                const haystack = `${from} ${message.subject || ""} ${text}`.toLowerCase();

                if (!haystack.includes(term.toLowerCase())) {
                    continue;
                }

                const match = extractOtp(text, term);
                if (match) {
                    code = match;
                    break;
                }
            }
        } catch (err) {
            console.warn(`[fetchLatestOtp] attempt failed: ${err.message}`);
        }

        if (!code) {
            await sleep(SLEEP_MS);
        }
    }

    if (!code) {
        throw new Error(
            `No ${term} OTP email was found in the mailbox (${process.env.MAIL_USERNAME}) within ${timeout}ms. ` +
            "The email may not have been sent, or MAIL_USERNAME/MAIL_PASSWORD point at the wrong mailbox."
        );
    }

    return code;
}

module.exports = { fetchLatestOtp, acquireAccessToken, listMessages };