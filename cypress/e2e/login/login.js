import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "./loginPage";

/* NAVIGATION */
Given("I navigate to the login page", () => {
    const url = Cypress.expose('baseUrl');
    cy.viewport(1800, 1000);
    cy.visit(url);

    LoginPage.verifyLoginPageLoaded();
});

/* LOGIN ACTIONS */
When("I enter my email {string}", (email) => {
    LoginPage.enterEmail(email);
});

When("I enter my password {string}", (password) => {
    LoginPage.enterPassword(password);
});

When("I click the Sign In button", () => {
    LoginPage.clickSignIn();
});

/* LOGIN RESULT VALIDATION */
Then("the system should display {string}", (result) => {
    if (result === "Blessing Staging") {
        cy.get('span')
            .should('be.visible')
            .and('contain', result)
    } else {
        cy.wait(2000)
        cy.contains(result, { timeout: 10000 }).should('be.visible');
    }
})

/* FORGOT PASSWORD */

When("I click the Forgot Password link", () => {
    LoginPage.clickForgotPassword();
});

Then("I should be redirected to the Forgot Password page", () => {
    LoginPage.verifyForgotPasswordPage();
});

/* PASSWORD VISIBILITY TOOGLE */
When("I click the password visibility icon", () => {
    // LoginPage.clickPasswordToggle();
});

Then("the password should become visible", () => {
    // LoginPage.verifyPasswordVisible();
});
