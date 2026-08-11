import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import ExportTransactionsPriPocPage from "./exportTransactionsPriPocPage";
import LoginPage from "../login/loginPage";
import PrimaryPocketFundingPage from "../transactions-funding-primary/transactions-funding-primaryPage";


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
Then("I navigate to the Funding Transactions page", () => {
    cy.wait(5000)

    ExportTransactionsPriPocPage.clickTransactionMenu()
});

Then("I clcik the Export Transactions button", () => {
    ExportTransactionsPriPocPage.clickExportTransactionsButton()
});

When("I select the Today date range", () => {

    ExportTransactionsPriPocPage.selectDateRange("Today");

});

When("I select {string} rows", (rows) => {

    ExportTransactionsPriPocPage.selectRows(rows);

    ExportTransactionsPriPocPage.validateSelectedRows(rows);

});

When("I select the Yesterday date range", () => {

    ExportTransactionsPriPocPage.selectDateRange("Yesterday");

});

When("I select the Weekly date range", () => {

    ExportTransactionsPriPocPage.selectDateRange("Weekly");

});

When("I select the Monthly date range", () => {

    ExportTransactionsPriPocPage.selectDateRange("Monthly");

});

Then("the Export button should be enabled", () => {

    ExportTransactionsPriPocPage.validateDateSelected();
    ExportTransactionsPriPocPage.validateExportState();

});

When("I export the transactions", () => {

    ExportTransactionsPriPocPage.clickExportIfAvailable();
    cy.wait(5000)

});

Then("the transaction file should be downloaded", () => {

    ExportTransactionsPriPocPage.validateDownloadedFile();

});



Then("I navigate to the Disbursement Transactions page", () => {
    cy.wait(2000)

    ExportTransactionsPriPocPage.clickDisbursementMenu()
});