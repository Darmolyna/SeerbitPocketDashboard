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
    //cy.wait(5000)
}
);

Then("I should see the Dashboard title", () => {
    PrimaryPocketDashboardPage.elements.primaryPocketTag().should("be.visible");
});

Then("I should see the Your Balances section", () => {
    PrimaryPocketDashboardPage.elements.yourBalances().should("be.visible");

    PrimaryPocketDashboardPage.validateAllPocketCards();
});

Then("I should see the Quick Actions section", () => {
    PrimaryPocketDashboardPage.validateQuickActionsSection()

});

Then("I should see the Exchange Rates section", () => {
    PrimaryPocketDashboardPage.elements.exchangeRateCard().should("be.visible");
});

Then("I should see the Recent Transactions section", () => {
    PrimaryPocketDashboardPage.elements.recentTransactionsSection().should("be.visible");
});

Then("I should see the Home menu", () => {
    PrimaryPocketDashboardPage.elements.homeMenu().should("be.visible");
});

Then("I should see the Transactions menu", () => {
    PrimaryPocketDashboardPage.elements.transactionsMenu().should("be.visible");
});

Then("I should see the Accounts menu", () => {
    PrimaryPocketDashboardPage.elements.accountsMenu().should("be.visible");
});

Then("I should see the Audit Log menu", () => {
    PrimaryPocketDashboardPage.elements.auditLogMenu().should("be.visible");
});

Then("I should see the Send Money menu", () => {
    PrimaryPocketDashboardPage.elements.sendMoneyMenu().should("be.visible");
});

Then("I should see the Settings menu", () => {
    PrimaryPocketDashboardPage.elements.settingsMenu().should("be.visible");
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

// Exchange Rates




// Then("I should see the Exchange Rates section", () => {

//     ExchangeRatesPage.elements.exchangeRateTitle()
//         .should("be.visible");

// });

Then("I should see the Currency and Rate headers", () => {

    PrimaryPocketDashboardPage.elements.currencyHeader()
        .should("be.visible");

    PrimaryPocketDashboardPage.elements.rateHeader().should("be.visible");

});

Then("every currency should have a corresponding exchange rate", () => {

    PrimaryPocketDashboardPage.elements.exchangeRateCard().should("be.visible");

});

When("I click on See all our rates", () => {

    PrimaryPocketDashboardPage.clickSeeAllRates();

});

Then("I should be redirected to the Exchange Rates page", () => {


    cy.url().should("include", "/exchange-rate");
    PrimaryPocketDashboardPage.elements.exchangeRatePageHeader();
});

Then("I validate that every currency conversion row should contain valid data in Exchange rate page", () => {
    cy.wait(5000)

    PrimaryPocketDashboardPage.validateCurrencyConversionTable();

});


// RECENT TRANSACTIONS
Then("I should see a list of recent transactions", () => {

    PrimaryPocketDashboardPage.validateTransactionRows();

});


Then("each transaction should display valid information", () => {

    PrimaryPocketDashboardPage.validateTransactionRows();

});


When("I click the See all transactions button", () => {

    PrimaryPocketDashboardPage.clickSeeAllTransactions();

});


Then("I should be redirected to the Transactions page", () => {

    PrimaryPocketDashboardPage.validateNavigationToTransactions()

});