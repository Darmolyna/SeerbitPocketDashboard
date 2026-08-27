import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import SubPocketFundingPage from "./transactions-funding-subpocketPage";
import LoginPage from "../login/loginPage";


Given("I am logged into the Sub Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.expose('baseUrl');

    cy.visit(url);

    LoginPage.enterSubPocketEmail();
    LoginPage.enterSubPocketPassword();
    LoginPage.clickSignIn();
}
);

Then("I navigate to the Funding Transactions page", () => {
    SubPocketFundingPage.clickTransactionMenu();
    SubPocketFundingPage.ensureFundingTabActive();
});


Then("I should see the Funding Transactions page", () => {

    SubPocketFundingPage.validateFundingPage();

});


Then("the funding transactions table should display the correct columns and rows", () => {

    SubPocketFundingPage.validateTransactionTable();

});


When("I search using an existing payment reference", () => {

    SubPocketFundingPage.captureFirstPaymentReference();

});


Then("only funding transactions matching the reference should be displayed", () => {

    SubPocketFundingPage.validateSearchResultReference();

});


When("I search using a non-existent payment reference {string}", (reference) => {

    SubPocketFundingPage.searchPaymentReference(reference);

});


Then("no funding transactions should be displayed", () => {

    SubPocketFundingPage.validateNoTransactionsMessage();

});


When("I filter funding transactions using {string} date range",
    (dateRange) => {

        SubPocketFundingPage.clickFilter();

        if (dateRange === "No Filter") {
            return;
        }

        if (dateRange !== "Empty Result") {

            SubPocketFundingPage.selectDateRange(dateRange);
            SubPocketFundingPage.clickApplyFilter();

        }

    }
);


Then(
    "only funding transactions within the selected {string} range should be displayed",
    (dateRange) => {

        SubPocketFundingPage.validateAllTransactionPages(dateRange);

    }
);


Then("I should be able to copy the payment reference", () => {

    SubPocketFundingPage.clickFirstCopyButton();

    SubPocketFundingPage.validatePaymentReferenceCopy();

});


When("I export funding transactions", () => {

    SubPocketFundingPage.clickExport();

});


Then("the transactions export should start successfully", () => {

    SubPocketFundingPage.validateExportStarted();

});


Then("each funding transaction should display valid source, amount, status, balance and date information", () => {

    SubPocketFundingPage.validateTransactionRowInfo();

});


Then("the funding transactions table should display valid pagination controls", () => {

    SubPocketFundingPage.validatePaginationControls();

})