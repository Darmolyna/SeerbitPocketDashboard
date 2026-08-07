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

        // continueButton: () =>
        //     cy.contains("button", "Continue").last(),

        transactionsDetailsTitle: () =>
            cy.contains("h1", "Transactions details"),

        transactionFileName: () =>
            cy.contains("div", "File name")
                .parent()
                .find("div.text-\\[18px\\]"),

        validTransactionCount: () =>
            cy.contains("span", "Valid:"),

        invalidTransactionCount: () =>
            cy.contains("span", "Invalid:"),

        pageTitle: () =>
            cy.contains("h2", "Enter One Time Passcode"),

        otpMessage: () =>
            cy.contains("Please enter the 6-digit OTP sent to"),

        otpInputs: () =>
            cy.get('input[inputmode="numeric"][maxlength="1"]'),

        otpContainer: () =>
            cy.get("div.flex.justify-center.gap-1"),

    };
    ///
    ////

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

    validateOtpPage() {
        this.elements.pageTitle()
            .should("be.visible")
            .and("have.text", "Enter One Time Passcode");

        this.elements.otpMessage()
            .should("be.visible")
            .and("contain.text", "Please enter the 6-digit OTP sent to");

        this.elements.otpInputs()
            .should("have.length", 6)
            .each(($input) => {
                cy.wrap($input)
                    .should("be.visible")
                    .and("have.attr", "maxlength", "1");
            });
    }

    ///
    ///

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

    enterOtp(otp) {
        const otpArray = otp.split("");

        this.elements.otpInputs()
            .each(($input, index) => {
                cy.wrap($input)
                    .type(otpArray[index]);
            });
    }

    validateOtpPage() {

        this.elements.pageTitle()
            .should("be.visible")
            .and("contain.text", "Enter One Time Passcode");

        this.elements.otpMessage()
            .should("be.visible")
            .and("contain.text", "Please enter the 6-digit OTP sent to");

        this.elements.otpInputs()
            .should("have.length", 6);
    }

}


export default new BulkSendMoneyPage();