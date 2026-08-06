class BulkSendMoneyPage {

    elements = {

        sendMoneyMenu: () =>
            cy.get('a[href="/send-money/bulk"]'),

        bulkTab: () =>
            cy.contains("a", "Bulk"),

        bankTransferButton: () =>
            cy.get("button")
                .contains("span", "Bank transfer")
                .parent("button"),

        subPocketButton: () =>
            cy.get("button")
                .contains("span", "Sub pocket")
                .parent("button"),

        pocketDropdown: () =>
            cy.get('form button[type="button"]').first(),

        pocketOptions: () =>
            cy.get('.absolute.z-20 button'),

        uploadInput: () =>
            cy.get('input[type="file"]'),

        uploadSuccessMessage: () =>
            cy.contains("File uploaded:"),

        continueButton: () =>
            cy.contains("button", "Continue"),

        continueButton: () =>
            cy.contains("button", "Continue").last(),

        transactionsDetailsTitle: () =>
            cy.contains("h1", "Transactions details"),

        transactionFileName: () =>
            cy.contains("div", "File name")
                .parent()
                .find("div.text-\\[18px\\]"),

        validTransactionCount: () =>
            cy.contains("span", "Valid:"),

        invalidTransactionCount: () =>
            cy.contains("span", "Invalid:")

    };


    openSendMoney() {

        this.elements.sendMoneyMenu().click();

    }


    openBulkTab() {

        this.elements.bulkTab().click();

    }


    selectBankTransfer() {

        this.elements.bankTransferButton()
            .click();

    }


    selectSubPocket() {

        this.elements.subPocketButton()
            .click();

    }


    selectPrimaryPocket(pocketId) {

        this.elements.pocketDropdown()
            .click();

        this.elements.pocketOptions()
            .contains(pocketId)
            .click();

    }

    clickContinue() {

        this.elements.continueButton()
            .click();

    }



    uploadFile(fileName) {

        this.elements.uploadInput()
            .selectFile(
                `cypress/fixtures/${fileName}`,
                { force: true }
            );

    }


    verifyFileUploaded() {

        this.elements.uploadInput()
            .should("have.prop", "files")
            .its("length")
            .should("eq", 1);

    }

    verifyFileUploadedSuccessfully(fileName) {

        this.elements.uploadSuccessMessage()
            .should("be.visible")
            .and("contain.text", "File uploaded:")
            .and("contain.text", fileName);

    }


    verifyContinueButtonEnabled() {

        this.elements.continueButton()
            .should("not.be.disabled");

    }

    verifyTransactionDetailsPageDisplayed() {

        this.elements.transactionsDetailsTitle()
            .should("be.visible");

    }


    verifyTransactionSummaryDisplayed() {

        this.elements.validTransactionCount()
            .should("contain.text", "Valid:");

        this.elements.invalidTransactionCount()
            .should("contain.text", "Invalid:");

    }

}


export default new BulkSendMoneyPage();