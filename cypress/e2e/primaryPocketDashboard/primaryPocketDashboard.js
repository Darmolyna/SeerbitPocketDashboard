import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PrimaryPocketDashboardPage from "./primaryPocketDashboardPage";
import LoginPage from "../login/loginPage";


/* NAVIGATION */
Given("I am logged into the Primary Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.expose('baseUrl');

    cy.visit(url);

    LoginPage.enterPrimaryPocketEmail();
    LoginPage.enterPrimaryPocketPassword();
    LoginPage.clickSignIn();
    cy.wait(5000)
}
);

Then("I should see the Dashboard title", () => {
    PrimaryPocketDashboardPage.elements.dashboardTitle({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Your Balances section", () => {
    PrimaryPocketDashboardPage.elements.yourBalances({ timeout: 10000 }).should("be.visible");

    PrimaryPocketDashboardPage.validateAllPocketCards();
});

Then("I should see the Quick Actions section", () => {
    PrimaryPocketDashboardPage.elements.quickActions({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Exchange Rates section", () => {
    PrimaryPocketDashboardPage.elements.exchangeRates({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Recent Transactions section", () => {
    PrimaryPocketDashboardPage.elements.recentTransactions({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Home menu", () => {
    PrimaryPocketDashboardPage.elements.homeMenu({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Transactions menu", () => {
    PrimaryPocketDashboardPage.elements.transactionsMenu({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Accounts menu", () => {
    PrimaryPocketDashboardPage.elements.accountsMenu({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Audit Log menu", () => {
    PrimaryPocketDashboardPage.elements.auditLogMenu({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Send Money menu", () => {
    PrimaryPocketDashboardPage.elements.sendMoneyMenu({ timeout: 10000 }).should("be.visible");
});

Then("I should see the Settings menu", () => {
    PrimaryPocketDashboardPage.elements.settingsMenu({ timeout: 10000 }).should("be.visible");
});

When("I click Send Money Quick Action", () => {
    PrimaryPocketDashboardPage.clickSendMoneyQuickAction({ timeout: 10000 });
});

Then("I should be redirected to the Send Money page", () => {
    cy.url({ timeout: 10000 }).should("include", "/send-money");
});

When("I click Transactions menu", () => {
    PrimaryPocketDashboardPage.clickTransactions({ timeout: 10000 });
});

Then("I should navigate to Transactions page", () => {
    cy.url().should("include", "/transactions");
});

When("I click Accounts menu", () => {
    PrimaryPocketDashboardPage.clickAccounts({ timeout: 10000 });
});

Then("I should navigate to Accounts page", () => {
    cy.url().should("include", "/businesses");
});

When("I click Audit Log menu", () => {
    PrimaryPocketDashboardPage.clickAuditLog({ timeout: 10000 });
});

Then("I should navigate to Audit Log page", () => {
    cy.url().should("include", "/audit-log");
});

When("I click Settings menu", () => {
    PrimaryPocketDashboardPage.clickSettings();
});

Then("I should navigate to Settings page", () => {
    cy.url().should("include", "/settings");
});

When("I click Logout", () => {
    PrimaryPocketDashboardPage.clickLogout();
});

Then("I should be redirected to Login page", () => {
    cy.url().should("include", "/login");
});