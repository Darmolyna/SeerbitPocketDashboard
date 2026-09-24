// Quick sanity check for the Microsoft Graph mailbox setup used by
// cypress.task("fetchLatestOtp"). Authenticates with the credentials in .env
// and lists the 5 most recent emails in the mailbox so you can confirm the
// app registration (MAIL_CLIENT_ID / MAIL_TENANT_ID), consent and password are
// all configured correctly before running the send-money tests.
//
// Lives outside cypress/e2e so the cucumber preprocessor step-definition glob
// (cypress/e2e/mailbox/**) never tries to bundle this Node-only script with
// esbuild (it requires dotenv -> node:path/os/crypto, which fail to resolve).
//
// Usage: node scripts/check-mail.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { acquireAccessToken, listMessages } = require("../cypress/e2e/mailbox/fetchLatestOtp");

async function main() {
    const token = await acquireAccessToken();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const messages = await listMessages(token, since);
    console.log(`Connected. ${messages.length} messages in the last 24h:`);
    for (const m of messages.slice(0, 5)) {
        const from = m.from && m.from.emailAddress ? m.from.emailAddress.address : "?";
        console.log(`  - ${m.receivedDateTime}  from ${from}: ${(m.subject || "").slice(0, 70)}`);
    }
}

if (require.main === module) {
    main().catch((err) => {
        console.error(`Mail check FAILED:\n${err.message}`);
        process.exit(1);
    });
}