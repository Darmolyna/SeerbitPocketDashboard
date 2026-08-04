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
            cy.contains("button", "Continue")

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

}


export default new BulkSendMoneyPage();