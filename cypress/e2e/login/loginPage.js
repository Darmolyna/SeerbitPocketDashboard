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
    completeOtpVerification(account) {
        this.elements.otpHeading().should('be.visible')

        const secret = this.resolveTotpSecret(account)
        // Remember the secret so later steps (e.g. the transaction
        // Authenticator prompt) can reuse it without re-resolving the account.
        this.currentTotpSecret = secret
        cy.task('generateTotp', secret).then((otp) => {
            cy.log(`Using Google Authenticator code: ${otp}`)
            this.enterOtp(otp)
            this.clickVerify()
        })
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