import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import PrimaryPocketFundingPage from "./transactions-funding-primaryPage";
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
Then("I navigate to the Funding Transactions page", () => {
    PrimaryPocketFundingPage.clickTransactionMenu()
});


Then("I should see the Funding Transactions page", () => {

    PrimaryPocketFundingPage.validateFundingPage();

});


When("I search using a Pocket ID {string}", (pocketId) => {

    PrimaryPocketFundingPage.searchPocketId(pocketId);

});


Then(
    "I should see {string} for Pocket ID {string}",
    (result, pocketId) => {

        PrimaryPocketFundingPage.validateSearchResults(
            result,
            pocketId
        );

    }
);


When("I search transactions using a payment reference", () => {

    PrimaryPocketFundingPage.captureFirstPaymentReference();

});


Then("only transactions matching the payment reference should be displayed", () => {

    PrimaryPocketFundingPage.validatePaymentReferenceResults();

});


When("I filter transactions using {string} date range",
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
    "only transactions within the selected {string} range should be displayed",
    (dateRange) => {

        PrimaryPocketFundingPage.validateAllTransactionPages(dateRange);

    }
);


Then("I should be able to copy the payment reference", () => {

    PrimaryPocketFundingPage.clickFirstCopyButton();

    PrimaryPocketFundingPage.validatePaymentReferenceCopy();

});


When("I export funding transactions", () => {

    PrimaryPocketFundingPage.clickExport();

});


Then("the transactions export should start successfully", () => {

    PrimaryPocketFundingPage.validateExportStarted();

})
