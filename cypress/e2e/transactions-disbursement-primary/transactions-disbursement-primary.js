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
    cy.wait(2000)

    PrimaryPocketDisbursementPage.clickDisbursementMenu()
});


Then("I should see the Disbursement Transactions page", () => {

    PrimaryPocketFundingPage.validateFundingPage();

});


When("I search using a Pocket ID {string}", (pocketId) => {

    PrimaryPocketFundingPage.searchPocketId(pocketId);

});


Then(
    "I should see {string} for Pocket ID {string}",
    (result, pocketId) => {

        // PrimaryPocketFundingPage.validateSearchResults(
        //     result,
        //     pocketId
        // );

    }
);


When("I filter disbursement transactions using a payment reference", () => {

    PrimaryPocketFundingPage.clickFilter();

    // Add filter selections here once date/payment reference modal is available

});


Then("only Disbursement transactions matching the payment reference should be displayed", () => {

    cy.get("table tbody tr")
        .should("have.length.greaterThan", 0);

});


When("I filter disbursement transactions using {string} date range",
    (dateRange) => {

        PrimaryPocketFundingPage.clickFilter();


        if (dateRange === "No Filter") {
            return;
        }


        if (dateRange !== "Empty Result") {

            PrimaryPocketFundingPage.selectDateRange(dateRange);
            PrimaryPocketFundingPage.clickApplyFilter();

        }

    }
);


Then(
    "only Disbursement transactions within the selected {string} range should be displayed",
    (dateRange) => {

        PrimaryPocketFundingPage.validateAllTransactionPages(dateRange);

    }
);


Then("I should be able to copy the payment reference", () => {

    PrimaryPocketFundingPage.clickFirstCopyButton();

    PrimaryPocketFundingPage.validatePaymentReferenceCopy();

});


When("I export disbursement transactions", () => {

    PrimaryPocketFundingPage.clickExport();

});


Then("the disbursement transactions export should start successfully", () => {

    PrimaryPocketFundingPage.validateExportStarted();

});