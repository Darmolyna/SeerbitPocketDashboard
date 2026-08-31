import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import SubPocketDisbursementPage from "./transactions-disbursement-subpocketPage";
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

Then("I navigate to the Disbursement Transactions page", () => {
    SubPocketDisbursementPage.clickTransactionMenu();
    SubPocketDisbursementPage.ensureDisbursementTabActive();
});


Then("I should see the Sub Pocket Disbursement Transactions page", () => {
    SubPocketDisbursementPage.validateDisbursementPage();
});


Then("the disbursement transactions table should display the correct columns and rows", () => {
    SubPocketDisbursementPage.validateTransactionTable();
});


When("I search using a payment reference {string}", (reference) => {
    SubPocketDisbursementPage.searchPaymentReference(reference);
});


Then(
    "I should see disbursement matching payment reference {string}",
    (reference) => {
        SubPocketDisbursementPage.validateSearchByPaymentReference(reference);
    }
);


When("I search using a non-existent disbursement reference {string}", (reference) => {
    SubPocketDisbursementPage.searchPaymentReference(reference);
});


Then("no disbursement transactions should be displayed", () => {
    SubPocketDisbursementPage.validateNoTransactionsMessage();
});


When("I filter disbursement transactions using {string} date range",
    (dateRange) => {

        SubPocketDisbursementPage.clickFilter();

        if (dateRange === "No Filter") {
            return;
        }

        if (dateRange !== "Empty Result") {

            SubPocketDisbursementPage.selectDateRange(dateRange);
            SubPocketDisbursementPage.clickApplyFilter();

        }

    }
);


Then(
    "only disbursement transactions within the selected {string} range should be displayed",
    (dateRange) => {

        SubPocketDisbursementPage.validateAllTransactionPages(dateRange);

    }
);


Then("I should be able to copy the payment reference", () => {

    SubPocketDisbursementPage.clickFirstCopyButton();

    SubPocketDisbursementPage.validatePaymentReferenceCopy();

});


When("I export disbursement transactions", () => {

    SubPocketDisbursementPage.clickExport();

});


Then("the disbursement transactions export should start successfully", () => {

    SubPocketDisbursementPage.validateExportStarted();

});


Then("each disbursement transaction should display valid beneficiary, amount, status, balance and date information", () => {

    SubPocketDisbursementPage.validateTransactionRowInfo();

});


Then("the disbursement transactions table should display valid pagination controls", () => {

    SubPocketDisbursementPage.validatePaginationControls();

})
