import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "./LoginPage";

Given("I navigate to the login page", () => {
    const url = Cypress.expose('baseUrl');
    cy.viewport(1800, 1000);
    cy.visit(url);

    LoginPage.verifyLoginPageLoaded();
});

When("I enter my email {string}", (email) => {
    LoginPage.enterEmail(email);
});

When("I enter my password {string}", (password) => {
    LoginPage.enterPassword(password);
});

When("I click the Sign In button", () => {
    LoginPage.clickSignIn();
});

When("I click the Forgot Password link", () => {
    LoginPage.clickForgotPassword();
});

When("I click the password visibility icon", () => {
    LoginPage.clickPasswordToggle();
});

Then("I should be redirected to the dashboard", () => {
    LoginPage.verifyDashboard();
});

Then("I should see a login error message", () => {
    LoginPage.verifyLoginError();
});

Then("I should be redirected to the Forgot Password page", () => {
    LoginPage.verifyForgotPasswordPage();
});

Then("the password should become visible", () => {
    LoginPage.verifyPasswordVisible();
});