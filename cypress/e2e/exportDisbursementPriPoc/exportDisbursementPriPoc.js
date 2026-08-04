import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import ExportDisbursementPriPocPage from "./exportDisbursementPriPocPage";

import LoginPage from "../login/loginPage";


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
Then("I navigate to the Disbursement Transactions page", () => {
    cy.wait(2000)

    ExportDisbursementPriPocPage.clickDisbursementMenu()
});

Then("I clcik the Export Transactions button", () => {
    ExportDisbursementPriPocPage.clickExportTransactionsButton()
});

When("I select the Today date range", () => {

    ExportDisbursementPriPocPage.selectDateRange("Today");

});

When("I select {string} rows", (rows) => {

    ExportDisbursementPriPocPage.selectRows(rows);

    ExportDisbursementPriPocPage.validateSelectedRows(rows);

});

When("I select the Yesterday date range", () => {

    ExportDisbursementPriPocPage.selectDateRange("Yesterday");

});

When("I select the Weekly date range", () => {

    ExportDisbursementPriPocPage.selectDateRange("Weekly");

});

When("I select the Monthly date range", () => {

    ExportDisbursementPriPocPage.selectDateRange("Monthly");

});

Then("the Export button should be enabled", () => {

    ExportDisbursementPriPocPage.validateDateSelected();
    ExportDisbursementPriPocPage.validateExportState();

});

When("I export the transactions", () => {

    ExportDisbursementPriPocPage.clickExportIfAvailable();

});

Then("the transaction file should be downloaded", () => {

    ExportDisbursementPriPocPage.validateDownloadedFile();

});