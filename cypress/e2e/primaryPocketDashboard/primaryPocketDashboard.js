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
    PrimaryPocketDashboardPage.validateQuickActionsSection({ timeout: 10000 });

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

// Quick Actions
When("I click the send money button", () => {
    PrimaryPocketDashboardPage.clickSendMoney();
});

Then("I should see the send money page", () => {
    PrimaryPocketDashboardPage.verifySendMoneyPage();

    cy.go("back");
});

When("I click the convert funds button", () => {
    PrimaryPocketDashboardPage.clickConvertFunds();
});

Then("I should see the convert funds page", () => {
    // PrimaryPocketDashboardPage.verifyConvertFundsPage();

    // cy.go("back");
});

When("I click the create a sub pocket button", () => {
    PrimaryPocketDashboardPage.clickCreateSubPocket();
});

Then("I should see the create a sub pocket page", () => {
    PrimaryPocketDashboardPage.verifyCreateSubPocketPage();
});