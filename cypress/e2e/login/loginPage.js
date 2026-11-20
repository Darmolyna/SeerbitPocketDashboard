import credentials from "../../support/credentials";

class LoginPage {

    //=========================================
    // Selectors
    //=========================================

    // The email most recently typed via enterEmail(), used to look up the
    // matching account's TOTP secret when no account is passed explicitly.
    lastEmail = null;

    // TOTP secret resolved for the account that logged in, reused by later
    // Authenticator prompts (e.g. transaction authorisation).
    currentTotpSecret = null;

    elements = {

        emailInput: () => cy.get('input[name="email"]'),

        passwordInput: () => cy.get('input[name="password"]'),

        signInButton: () => cy.contains('button', 'Sign In'),

        forgotPasswordLink: () => cy.contains('Forgot Password?'),

        // Eye icon: sibling of the password input inside its field wrapper.
        // The wrapping button collapses (absolute-positioned SVG), so target
        // the SVG itself, which is the part the user clicks.
        passwordToggle: () =>
            this.elements.passwordInput()
                .parent()
                .find('button[type="button"] svg'),

        loginHeading: () => cy.contains('Sign to your account'),

        welcomeText: () =>
            cy.contains('Welcome back, please enter your details'),

        otpHeading: () =>
            cy.contains('h4', 'Enter verification code', { timeout: 30000 }),

        otpInputs: () =>
            cy.get('input[inputmode="numeric"][maxlength="1"]'),

        verifyButton: () => cy.contains('button', 'Verify'),

    }


    //=========================================
    // Actions
    //=========================================

    visit() {
        cy.visit('https://develop.d1vg8wvg97d1gx.amplifyapp.com/')
    }

    enterEmail(email) {
        this.lastEmail = email
        this.elements.emailInput()
            .clear()
            .type(email)
    }

    enterPassword(password) {
        this.elements.passwordInput()
            .clear()
            .type(password)
    }

    clickSignIn() {
        this.elements.signInButton().click()
    }

    clickForgotPassword() {
        this.elements.forgotPasswordLink().click()
    }

    clickPasswordToggle() {
        this.elements.passwordToggle().click({ force: true })
    }

    enterOtp(otp) {
        this.elements.otpHeading().should('be.visible')
        const digits = String(otp).split('')
        this.elements.otpInputs()
            .should('have.length', 6)
            .each(($input, index) => {
                cy.wrap($input).type(digits[index])
            })
    }

    clickVerify() {
        this.elements.verifyButton()
            .should('not.be.disabled')
            .click()
    }

    // Resolve the Google Authenticator secret for the account being logged in.
    // Prefers an explicit account name ("primary"/"sub"); otherwise falls back
    // to matching the email last typed via enterEmail().
    resolveTotpSecret(account) {
        if (account) {
            const entry = credentials[`${account}Pocket`]
            if (!entry || !entry.totpSecret) {
                throw new Error(
                    `No TOTP secret configured for the "${account}" pocket. ` +
                    `Set totpSecret in cypress/support/credentials.js (${account}Pocket).`
                )
            }
            return entry.totpSecret
        }

        const match = Object.values(credentials).find(
            (entry) => entry.email === this.lastEmail
        )
        if (!match || !match.totpSecret) {
            throw new Error(
                `No TOTP secret configured for ${this.lastEmail || "the login email"}. ` +
                "Set totpSecret in cypress/support/credentials.js."
            )
        }
        return match.totpSecret
    }

    // Pocket now uses Google Authenticator (TOTP) as the second factor, so the
    // 6-digit code is generated from the account's shared secret instead of
    // being read from the mailbox.
    // Google Authenticator (TOTP) login. A code is generated immediately
    // before every login attempt, a code is never submitted twice, and if
    // the code is rejected as already used, Cypress waits for the next
    // valid 30s window and retries with a fresh, unused code.
    _TOTP_PERIOD_SECONDS = 30;

    // Maximum login attempts; every attempt uses a fresh, unused OTP.
    _MAX_OTP_ATTEMPTS = 5;

    completeOtpVerification(account) {
        this.elements.otpHeading().should('be.visible');

        const secret = this.resolveTotpSecret(account);
        // Remember the secret so later steps (e.g. the transaction
        // Authenticator prompt) can reuse it without re-resolving the account.
        this.currentTotpSecret = secret;

        // Every OTP we submit; a code must never be submitted twice.
        const submittedOtps = new Set();
        let attempts = 0;

        // Observe the verify-mfa response so a replay ("already used")
        // error can be detected; the app flow itself is left unchanged.
        cy.intercept('POST', '**/authenticate/verify-mfa').as('verifyMfa');

        const waitNextTotpWindow = () =>
            cy.wait(this._msUntilNextTotpWindow());

        // Generate a code and guarantee it differs from every OTP already
        // submitted: if this window's code was already used, wait for the
        // next valid window and generate a new one.
        const generateUniqueOtp = () =>
            cy.task('generateTotp', secret).then((otp) => {
                if (submittedOtps.has(otp)) {
                    cy.log(
                        'Generated OTP is a duplicate of a previously submitted code; waiting for the next window'
                    );
                    return waitNextTotpWindow()
                        .then(() => cy.task('generateTotp', secret))
                        .then((nextOtp) =>
                            submittedOtps.has(nextOtp)
                                ? waitNextTotpWindow().then(() =>
                                    cy.task('generateTotp', secret)
                                )
                                : nextOtp
                        );
                }
                return otp;
            });

        const submitOtp = () =>
            generateUniqueOtp().then((otp) => {
                // Requirement: never submit the same OTP more than once.
                submittedOtps.add(otp);
                attempts += 1;

                if (attempts > this._MAX_OTP_ATTEMPTS) {
                    throw new Error(
                        'MFA login failed: authentication code was already used repeatedly'
                    );
                }

                // Requirement: do not log the actual OTP code.
                cy.log(`Submitting Google Authenticator code (attempt ${attempts})`);

                this.enterOtp(otp);
                this.clickVerify();

                cy.wait('@verifyMfa', { timeout: 20000 }).then((interception) => {
                    const response = interception.response || {};
                    const status = response.statusCode;
                    const bodyText = JSON.stringify(response.body || '').toLowerCase();

                    cy.get('body').then(($body) => {
                        const domText = $body.text().toLowerCase();

                        const isReplayFailure =
                            domText.includes('authentication code already used') ||
                            domText.includes('code already used') ||
                            domText.includes('authentication code already been used') ||
                            (typeof status === 'number' &&
                                status >= 400 &&
                                /already used|already been used|already submitted|code already|replay/i.test(bodyText));

                        if (!isReplayFailure) {
                            // Success or non-replay failure: proceed as before.
                            return;
                        }

                        if (attempts >= this._MAX_OTP_ATTEMPTS) {
                            throw new Error(
                                'MFA login failed: authentication code was already used repeatedly'
                            );
                        }

                        cy.log(
                            'Authentication code already used (replay detected); generating a new code'
                        );

                        // Wait for the next valid window, then retry with a
                        // fresh OTP that differs from the submitted ones.
                        return waitNextTotpWindow().then(() => submitOtp());
                    });
                });
            });

        submitOtp();
    }

    // Returns the ms until the next TOTP window starts.
    _msUntilNextTotpWindow() {
        const periodMs = this._TOTP_PERIOD_SECONDS * 1000;
        const nowMs = Date.now();
        const msToNextWindow = Math.floor(nowMs / periodMs) * periodMs + periodMs - nowMs;
        // Small buffer so the generated code is already valid when typed.
        return msToNextWindow + 500;
    }


    //=========================================
    // Validations
    //=========================================

    verifyLoginPageLoaded() {
        this.elements.loginHeading().should('be.visible')
        this.elements.welcomeText().should('be.visible')
        this.elements.emailInput().should('be.visible')
        this.elements.passwordInput().should('be.visible')
        this.elements.signInButton().should('be.visible')
    }

    verifyForgotPasswordPage() {
        cy.url().should('include', 'forgot-password')
        this.elements.forgotPasswordLink().should('be.visible')
    }

    verifyPasswordVisible() {
        this.elements.passwordInput()
            .should('have.attr', 'type', 'text')
    }

    verifyPasswordHidden() {
        this.elements.passwordInput()
            .should('have.attr', 'type', 'password')
    }

}

export default new LoginPage();