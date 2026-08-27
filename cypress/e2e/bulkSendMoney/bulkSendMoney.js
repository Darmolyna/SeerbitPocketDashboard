import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import BulkSendMoneyPage from "./bulkSendMoneyPage";
import LoginPage from "../login/loginPage";

Given("I am logged into the Primary Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.env("baseUrl") || Cypress.expose("baseUrl");
    cy.visit(url);
    LoginPage.enterPrimaryPocketEmail();
    LoginPage.enterPrimaryPocketPassword();
    LoginPage.clickSignIn();
    cy.url().should("not.include", "/login", { timeout: 30000 });
});

When("I navigate to the Send Money page", () => {
    BulkSendMoneyPage.openSendMoney();
});

When("I navigate to bulk column", () => {
    BulkSendMoneyPage.openBulkTab();
});

Then("I should see the Send Money page title", () => {
    cy.contains("h1", "Send Money", { timeout: 15000 }).should("exist");
});

Then("I should see the Bulk and Single tabs", () => {
    cy.contains("a", "Bulk", { timeout: 15000 }).should("be.visible");
    cy.contains("a", "Single", { timeout: 15000 }).should("be.visible");
});

Then("the Bulk tab should be active", () => {
    cy.contains("a", "Bulk")
        .should("be.visible");
});

Then("the Bank transfer type should be selected", () => {
    cy.contains("button", "Bank transfer")
        .should("be.visible");
});

Then("I should see the Transfer type section", () => {
    cy.contains("h3", "Transfer type", { timeout: 15000 }).should("be.visible");
});

When("I select Bank Transfer to Send Money", () => {
    BulkSendMoneyPage.selectBankTransfer();
});

When("I select Sub Pocket to Send Money", () => {
    BulkSendMoneyPage.selectSubPocket();
});

When("I select {string} as the source pocket", (pocketId) => {
    BulkSendMoneyPage.selectPrimaryPocket(pocketId);
});

When("I store the source pocket balance", () => {
    BulkSendMoneyPage.storeBalanceBeforeTransaction();
});

When("I upload the {string} file", (fileName) => {
    BulkSendMoneyPage.uploadFile(fileName);
});

Then("the {string} file should be uploaded successfully", (fileName) => {
    BulkSendMoneyPage.verifyFileUploaded();
    BulkSendMoneyPage.verifyFileUploadedSuccessfully(fileName);
});

Then("the Continue button should be disabled", () => {
    BulkSendMoneyPage.verifyContinueButtonDisabled();
});

Then("the Continue button should be enabled", () => {
    BulkSendMoneyPage.verifyContinueButtonEnabled();
});

When("I click Continue", () => {
    BulkSendMoneyPage.clickContinue();
});

Then("the transaction details page should be displayed", () => {
    BulkSendMoneyPage.verifyTransactionDetailsPageDisplayed();
});

Then("the transaction summary should be displayed", () => {
    BulkSendMoneyPage.verifyTransactionSummaryDisplayed();
});

Then("I should capture the transaction charge", () => {
    BulkSendMoneyPage.captureTransactionCharge();
});

When("I click Continue on bulk confirmation page", () => {
    BulkSendMoneyPage.clickContinueOnConfirmation();
});

Then("I should see the OTP verification page", () => {
    BulkSendMoneyPage.validateOtpPage();
});

When("I enter the OTP {string}", (otp) => {
    BulkSendMoneyPage.enterOtp(otp);
});

Then("all OTP fields should be filled", () => {
    BulkSendMoneyPage.elements.otpInputs()
        .each(($input) => {
            cy.wrap($input)
                .invoke("val")
                .should("not.be.empty");
        });
});

When("I click Continue after OTP", () => {
    BulkSendMoneyPage.clickContinueAfterOtp();
});

Then("I should see a successful transaction page", () => {
    BulkSendMoneyPage.validateSuccessfulTransaction();
});

Then("I should see the correct balance was debited", () => {
    BulkSendMoneyPage.validateBalanceDebited();
});

When("I click the View Transaction History button", () => {
    BulkSendMoneyPage.clickViewTransactionHistory();
});

Then("I should see the Transactions disbursement page", () => {
    BulkSendMoneyPage.validateDisbursementPage();
});

Then("the disbursement table should contain the transaction", () => {
    BulkSendMoneyPage.validateTransactionInDisbursementTable();
});

Then("the payment reference in the disbursement table should match the success page", () => {
    BulkSendMoneyPage.validatePaymentReferenceInDisbursementTable();
});

Then("the transaction status in the disbursement table should match the success page", () => {
    BulkSendMoneyPage.validateTransactionStatusInDisbursementTable();
});

Then("the amount in the disbursement table should be correct", () => {
    BulkSendMoneyPage.validateAmountInDisbursementTable();
});

Then("the balance in the disbursement table should be correct", () => {
    BulkSendMoneyPage.validateBalanceInDisbursementTable();
});

When("I click the transaction payment reference link", () => {
    BulkSendMoneyPage.clickTransactionPaymentReferenceLink();
});

Then("I should see the transaction details page", () => {
    BulkSendMoneyPage.validateTransactionDetailsPage();
});

Then("the transaction details should show correct information", () => {
    BulkSendMoneyPage.validateTransactionDetailsInformation();
});

Then("I capture the transaction details from the page", () => {
    BulkSendMoneyPage.captureTransactionDetails();
});

Then("the Print Receipt button should be visible", () => {
    BulkSendMoneyPage.validatePrintReceipt();
});

Then("the Download Receipt button should be visible", () => {
    BulkSendMoneyPage.validateDownloadReceipt();
});

When("I navigate back to the disbursement table", () => {
    BulkSendMoneyPage.goBackToDisbursementTable();
});

Then("the disbursement table should contain the charge", () => {
    BulkSendMoneyPage.validateChargeInDisbursementTable();
});

Then("the charge payment reference in the disbursement table should match the success page", () => {
    BulkSendMoneyPage.validateChargePaymentReferenceInDisbursementTable();
});

Then("the charge transaction status in the disbursement table should match the success page", () => {
    BulkSendMoneyPage.validateChargeTransactionStatusInDisbursementTable();
});

Then("the charge amount in the disbursement table should be correct", () => {
    BulkSendMoneyPage.validateChargeAmountInDisbursementTable();
});

Then("the balance after charge in the disbursement table should be correct", () => {
    BulkSendMoneyPage.validateBalanceAfterChargeInDisbursementTable();
});

When("I click the charge payment reference link", () => {
    BulkSendMoneyPage.clickChargePaymentReferenceLink();
});

Then("I should see the charge details page", () => {
    BulkSendMoneyPage.validateChargeDetailsPage();
});

Then("the charge details should show correct information", () => {
    BulkSendMoneyPage.validateChargeDetailsInformation();
});

Then("I should see the invalid OTP error message", () => {
    BulkSendMoneyPage.validateInvalidOtpError();
});
