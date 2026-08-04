import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import BulkSendMoneyPage from "./bulkSendMoneyPage";
import LoginPage from "../login/loginPage";


Given("I am logged into the Primary Pocket Dashboard", () => {

    cy.viewport(1800, 1000);

    const url = Cypress.expose('baseUrl');

    cy.visit(url);

    LoginPage.enterPrimaryPocketEmail();
    LoginPage.enterPrimaryPocketPassword();
    LoginPage.clickSignIn();

    cy.wait(5000);

});


When("I navigate to the send Money section", () => {

    BulkSendMoneyPage.openSendMoney();

});


When("I click bulk section", () => {

    BulkSendMoneyPage.openBulkTab();

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


When("I select {string} as the transfer type", (transferType) => {

    BulkSendMoneyPage.selectTransferType(transferType);

});


When("I upload the {string} file", (fileName) => {

    BulkSendMoneyPage.uploadFile(fileName);

});


Then("the {string} file should be uploaded successfully", (fileName) => {

    BulkSendMoneyPage.verifyFileUploaded();
    BulkSendMoneyPage.verifyFileUploadedSuccessfully(fileName);

});


Then("the Continue button should be enabled", () => {

    BulkSendMoneyPage.verifyContinueButtonEnabled();

});