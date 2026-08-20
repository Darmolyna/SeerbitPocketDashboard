import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import SingleSendMoneyPage from "./singleSendMoneyPage";
import LoginPage from "../login/loginPage";


/* NAVIGATION */
Given("I am logged into the Primary Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.expose('baseUrl');

    cy.visit(url);

    LoginPage.enterPrimaryPocketEmail();
    LoginPage.enterPrimaryPocketPassword();
    LoginPage.clickSignIn();
});

Given("I navigate to the Send Money page", () => {
    SingleSendMoneyPage.openSendMoney();
    SingleSendMoneyPage.validateTransferTypeSection();
});

Given("I navigate to single column", () => {
    SingleSendMoneyPage.navigateToSingleTab();
});


/* ============================
   PAGE LOAD & LAYOUT
   ============================ */

Then("I should see the Send Money page title", () => {
    SingleSendMoneyPage.validatePageTitle();
});

Then("I should see the Bulk and Single tabs", () => {
    SingleSendMoneyPage.validateTabsVisible();
});

Then("the Single tab should be active", () => {
    SingleSendMoneyPage.validateSingleTabActive();
});

Then("I should see the {string} section", (sectionTitle) => {
    SingleSendMoneyPage.validateSectionTitle(sectionTitle);
});

Then("I should see the source pocket dropdown", () => {
    SingleSendMoneyPage.validateSourcePocketDropdown();
});

Then("I should see the Transfer type section", () => {
    SingleSendMoneyPage.validateTransferTypeSection();
});


/* ============================
   TRANSFER TYPE TOGGLE
   ============================ */

Then("the Sub pocket transfer type should be selected", () => {
    SingleSendMoneyPage.validateSubPocketSelected();
});

Then("the Bank transfer type should be selected", () => {
    SingleSendMoneyPage.validateBankTransferSelected();
});

When("I click the Bank transfer button", () => {
    SingleSendMoneyPage.clickBankTransfer();
});

When("I click the Sub pocket button", () => {
    SingleSendMoneyPage.clickSubPocket();
});

When("I select the primary pocket {string}", (pocketId) => {
    SingleSendMoneyPage.selectPrimaryPocket(pocketId);
});

When("I store the source pocket balance", () => {
    SingleSendMoneyPage.storeBalanceBeforeTransaction();
});

Then("I should capture the transaction charge", () => {
    SingleSendMoneyPage.captureTransactionCharge();
});

Then("I should see the correct balance was debited", () => {
    SingleSendMoneyPage.validateBalanceDebited();
});

When("I click the View Transaction History button", () => {
    SingleSendMoneyPage.clickViewTransactionHistory();
});

Then("I should see the Transactions disbursement page", () => {
    SingleSendMoneyPage.validateDisbursementPage();
});

Then("the disbursement table should contain the transaction", () => {
    SingleSendMoneyPage.validateTransactionInDisbursementTable();
});

When("I click the transaction payment reference link", () => {
    SingleSendMoneyPage.clickTransactionPaymentReferenceLink();
});

Then("I should see the transaction details page", () => {
    SingleSendMoneyPage.validateTransactionDetailsPage();
});

Then("the transaction details should show correct information", () => {
    SingleSendMoneyPage.validateTransactionDetailsInformation();
});

Then("the Print Receipt button should be visible", () => {
    SingleSendMoneyPage.validatePrintReceipt();
});

Then("the Download Receipt button should be visible", () => {
    SingleSendMoneyPage.validateDownloadReceipt();
});

When("I navigate back to the disbursement table", () => {
    SingleSendMoneyPage.goBackToDisbursementTable();
});

Then("the disbursement table should contain the charge", () => {
    SingleSendMoneyPage.validateChargeInDisbursementTable();
});

When("I click the charge payment reference link", () => {
    SingleSendMoneyPage.clickChargePaymentReferenceLink();
});

Then("I should see the charge details page", () => {
    SingleSendMoneyPage.validateChargeDetailsPage();
});

Then("the charge details should show correct information", () => {
    SingleSendMoneyPage.validateChargeDetailsInformation();
});


/* ============================
   FORM FIELDS
   ============================ */

Then("I should see the Pocket ID input field", () => {
    SingleSendMoneyPage.validatePocketIdField();
});

Then("I should see the Amount input field", () => {
    SingleSendMoneyPage.validateAmountField();
});

Then("I should see the Narration input field", () => {
    SingleSendMoneyPage.validateNarrationField();
});

Then("I should see the Account number input field", () => {
    SingleSendMoneyPage.validateAccountNumberField();
});

Then("I should see the Select bank dropdown", () => {
    SingleSendMoneyPage.validateSelectBankDropdown();
});

Then("I should see the Account name field", () => {
    SingleSendMoneyPage.validateAccountNameField();
});


/* ============================
   FORM ACTIONS
   ============================ */

When("I enter pocket ID {string}", (pocketId) => {
    SingleSendMoneyPage.enterPocketId(pocketId);
});

When("I enter amount {string}", (amount) => {
    SingleSendMoneyPage.enterAmount(amount);
});

When("I enter narration {string}", (narration) => {
    SingleSendMoneyPage.enterNarration(narration);
});

When("I enter account number {string}", (accountNumber) => {
    SingleSendMoneyPage.enterAccountNumber(accountNumber);
});

When("I select a bank", () => {
    SingleSendMoneyPage.selectBank();
});

When("I click the Continue button", () => {
    SingleSendMoneyPage.clickContinue();
});

When("I click the Cancel button", () => {
    SingleSendMoneyPage.clickCancel();
});


/* ============================
   FORM VALIDATION
   ============================ */

Then("the Continue button should be disabled", () => {
    SingleSendMoneyPage.validateContinueDisabled();
});

Then("I should see the Pocket ID required error", () => {
    SingleSendMoneyPage.validatePocketIdError();
});

Then("I should see the amount required error", () => {
    SingleSendMoneyPage.validateAmountError();
});

Then("I should see the Account number required error", () => {
    SingleSendMoneyPage.validateAccountNumberError();
});

Then("I should see the Select bank required error", () => {
    SingleSendMoneyPage.validateSelectBankError();
});


/* ============================
   BANK TRANSFER SPECIFIC
   ============================ */

Then("the account name should be auto-generated", () => {
    SingleSendMoneyPage.validateAccountNameAutoGenerated();
});

Then("the account number field should contain only 10 digits", () => {
    SingleSendMoneyPage.validateAccountNumberMaxLength();
});


/* ============================
   TRANSACTION CONFIRMATION
   ============================ */

Then("I should see the transaction confirmation page", () => {
    SingleSendMoneyPage.validateTransactionConfirmation();
});

When("I click the Continue button on confirmation page", () => {
    SingleSendMoneyPage.clickContinueOnConfirmation();
});

Then("I should see the same pocket transfer not allowed error", () => {
    SingleSendMoneyPage.validateSamePocketTransferError();
});


/* ============================
   OTP VERIFICATION
   ============================ */

Then("I should see the OTP verification page", () => {
    SingleSendMoneyPage.validateOtpPage();
});

When("I enter the OTP {string}", (otp) => {
    SingleSendMoneyPage.enterOtp(otp);
});

Then("all OTP fields should be filled", () => {
    SingleSendMoneyPage.validateOtpFieldsFilled();
});

When("I click the Continue button after OTP", () => {
    SingleSendMoneyPage.clickContinueAfterOtp();
});

Then("I should see the invalid OTP error message", () => {
    SingleSendMoneyPage.validateInvalidOtpError();
});

Then("I should see a successful transaction page", () => {
    SingleSendMoneyPage.validateSuccessfulTransaction();
});

Then("I should see the same pocket transfer error", () => {
    SingleSendMoneyPage.validateSamePocketTransferError();
});


/* ============================
   CANCEL
   ============================ */

Then("I should be navigated away from the send money form", () => {
    SingleSendMoneyPage.validateNavigatedAway();
});


/* ============================
   SOURCE POCKET DROPDOWN
   ============================ */

Then("the source pocket should display a currency code", () => {
    SingleSendMoneyPage.validatePocketCurrencyCode();
});

Then("the source pocket should display a pocket ID", () => {
    SingleSendMoneyPage.validatePocketId();
});

Then("the source pocket should display a balance", () => {
    SingleSendMoneyPage.validatePocketBalance();
});

When("I click the source pocket dropdown", () => {
    SingleSendMoneyPage.clickSourcePocketDropdown();
});

Then("I should see a list of available pockets", () => {
    SingleSendMoneyPage.validatePocketDropdownList();
});
