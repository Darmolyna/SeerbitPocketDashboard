import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import SubPocketDashboardPage from "./subPocketDashboardPage";
import PrimaryPocketDashboardPage from "../primaryPocketDashboard/primaryPocketDashboardPage";
import LoginPage from "../login/loginPage";


/* NAVIGATION */
Given("I am logged into the Sub Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.expose('baseUrl');

    cy.visit(url);

    LoginPage.enterSubPocketEmail();
    LoginPage.enterSubPocketPassword();
    LoginPage.clickSignIn();
    //cy.wait(5000)
}
);

Then("I should see the Dashboard title", () => {
    SubPocketDashboardPage.elements.dashboardTitle().should("be.visible");
});

Then("I should see the Your Balances section", () => {
    SubPocketDashboardPage.elements.yourBalances().should("be.visible");

    SubPocketDashboardPage.validateAllSubPocketCards();
});


// PERFORMANCE SECTION
Then("I should see the Performance section", () => {
    SubPocketDashboardPage.validatePerformanceSection();

});

// POCKET BALANCE SECTION

Then("I should see the Pocket Balance section", () => {
    SubPocketDashboardPage.validatePocketBalanceSection();
});


//RECENT TRANSACTIONS SECTION


Then("I should see the Recent Transactions section", () => {
    PrimaryPocketDashboardPage.elements.recentTransactionsSection().should("be.visible");
});

Then("I should see a list of recent transactions", () => {

    SubPocketDashboardPage.validateTransactionRows();

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
