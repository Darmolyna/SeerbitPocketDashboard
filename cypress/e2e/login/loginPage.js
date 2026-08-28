class LoginPage {

    //=========================================
    // Selectors
    //=========================================

    elements = {

        emailInput: () => cy.get('input[name="email"]'),

        passwordInput: () => cy.get('input[name="password"]'),

        signInButton: () => cy.contains('button', 'Sign In'),

        forgotPasswordLink: () => cy.contains('Forgot Password?'),

        // passwordToggle: () =>
        //     cy.get('button[type="button"]'),

        loginHeading: () => cy.contains('Sign to your account'),

        welcomeText: () =>
            cy.contains('Welcome back, please enter your details'),

    }


    //=========================================
    // Actions
    //=========================================

    visit() {
        cy.visit('https://develop.d1vg8wvg97d1gx.amplifyapp.com/')
    }

    enterEmail(email) {
        this.elements.emailInput()
            .clear()
            .type(email)
    }

    enterPassword(password) {
        this.elements.passwordInput()
            .clear()
            .type(password)
    }

    enterPrimaryPocketEmail() {
        this.elements.emailInput()
            .clear()
            .type('test@seerbit.com')
    }

    enterPrimaryPocketPassword() {
        this.elements.passwordInput()
            .clear()
            .type('Test@1234')
    }

    enterSubPocketEmail() {
        this.elements.emailInput()
            .clear()
            .type('ayomide.afolabi@seerbit.com')
    }

    enterSubPocketPassword() {
        this.elements.passwordInput()
            .clear()
            .type('Password@@1')
    }

    clickSignIn() {
        this.elements.signInButton().click()
    }

    clickForgotPassword() {
        this.elements.forgotPasswordLink().click()
    }

    clickPasswordToggle() {
        this.elements.passwordToggle().click()
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

    // verifyPasswordVisible() {
    //     this.elements.passwordInput()
    //         .should('have.attr', 'type', 'text')
    // }

    // verifyPasswordHidden() {
    //     this.elements.passwordInput()
    //         .should('have.attr', 'type', 'password')
    // }

}

export default new LoginPage();