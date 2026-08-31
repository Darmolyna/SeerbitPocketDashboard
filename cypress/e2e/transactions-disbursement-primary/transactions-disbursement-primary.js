import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import PrimaryPocketDisbursementPage from "./transactions-disbursement-primaryPage";
import PrimaryPocketFundingPage from "../transactions-funding-primary/transactions-funding-primaryPage";
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
    PrimaryPocketDisbursementPage.clickDisbursementMenu()
});


Then("I should see the Disbursement Transactions page", () => {

    PrimaryPocketDisbursementPage.validateFundingPage();

});


When("I search using a Pocket ID {string}", (pocketId) => {

    PrimaryPocketDisbursementPage.searchPocketId(pocketId);

});


When("I search using a payment reference {string}", (reference) => {

    PrimaryPocketDisbursementPage.searchPaymentReference(reference);

});


Then(
    "I should see disbursement matching payment reference {string}",
    (reference) => {

        PrimaryPocketDisbursementPage.validatePaymentReferenceResults(reference);

    }
);


Then(
    "I should see {string} for Pocket ID {string}",
    (result, pocketId) => {

        PrimaryPocketDisbursementPage.validateSearchResults(
            result,
            pocketId
        );

    }
);


When("I filter disbursement transactions using a payment reference", () => {

    PrimaryPocketDisbursementPage.clickFilter();

    //Add filter selections here once date/payment reference modal is available

});


Then("only Disbursement transactions matching the payment reference should be displayed", () => {

    cy.get("table tbody tr")
        .should("have.length.greaterThan", 0);

});


When("I filter disbursement transactions using {string} date range",
    (dateRange) => {

        PrimaryPocketDisbursementPage.clickFilter();


        if (dateRange === "No Filter") {
            return;
        }


        if (dateRange !== "Empty Result") {

            PrimaryPocketDisbursementPage.selectDateRange(dateRange);
            PrimaryPocketDisbursementPage.clickApplyFilter();

        }

    }
);


Then(
    "only Disbursement transactions within the selected {string} range should be displayed",
    (dateRange) => {

        PrimaryPocketDisbursementPage.validateAllTransactionPages(dateRange);

    }
);


Then("I should be able to copy the payment reference", () => {

    PrimaryPocketDisbursementPage.clickFirstCopyButton();

    PrimaryPocketDisbursementPage.validatePaymentReferenceCopy();

});


When("I export disbursement transactions", () => {

    PrimaryPocketDisbursementPage.clickExport();

});


Then("the disbursement transactions export should start successfully", () => {

    PrimaryPocketDisbursementPage.validateExportStarted();

});


When("I export {string} disbursement transaction rows", (rows) => {

    PrimaryPocketDisbursementPage.exportTransactionRows(rows);

});


Then(
    "the disbursement export should contain exactly {string} rows",
    (rows) => {

        PrimaryPocketDisbursementPage.validateExportedRowCount(rows);

    }
);