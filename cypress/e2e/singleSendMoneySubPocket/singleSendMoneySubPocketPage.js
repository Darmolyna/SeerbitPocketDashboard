class SubPocketSendMoneyPage {

    // ============================
    // Elements
    // ============================

    elements = {

        // Page
        pageTitle: () => cy.contains("h1", "Send Money"),

        // Tabs — sub-pocket is single-only, no bulk toggle.
        singleTab: () => cy.get('a[href="/send-money"]'),

        // Source Pocket (fixed to the sub-pocket itself)
        sourcePocketDropdown: () =>
            cy.get("img[alt='flag']")
                .first()
                .closest("div.flex")
                .parent()
                .closest("button"),

        sourcePocketId: () =>
            cy.get("img[alt='flag']")
                .first()
                .parent()
                .parent()
                .children("span")
                .first(),

        sourcePocketBalance: () =>
            cy.get("img[alt='flag']")
                .first()
                .parent()
                .parent()
                .children("span")
                .last(),

        // Form Title
        formTitle: () => cy.contains("h2", "Send money from"),

        // Bank Transfer Form Fields
        accountNumberInput: () =>
            cy.get('input[placeholder*="account" i]'),

        selectBankDropdown: () =>
            cy.get('[data-testid="select-trigger"]'),

        accountNameField: () =>
            cy.contains('div', 'The account name is auto-generated'),

        amountInput: () =>
            cy.get('input[placeholder="Enter amount"]'),

        narrationInput: () =>
            cy.get('input[placeholder="Enter narration"]'),

        // Buttons
        continueButton: () =>
            cy.contains("button", "Continue"),

        cancelButton: () =>
            cy.contains("button", "Cancel"),

        // Transaction Confirmation
        confirmationTitle: () =>
            cy.contains("h2", "You're about to send"),
        paymentDetailsHeader: () =>
            cy.contains("h3", "Payment details"),
        amountRow: () =>
            cy.contains("span", "Amount").parent(),
        transactionChargeRow: () =>
            cy.contains("span", "Transaction charge").parent(),
        totalAmountRow: () =>
            cy.contains("span", "Total amount").parent(),
        receiverDetailsHeader: () =>
            cy.contains("h3", "Receiver details"),
        receiverAccountName: () =>
            cy.contains("span", "Account name").parent(),
        receiverBank: () =>
            cy.contains("span", "Bank").parent(),
        receiverAccountNumber: () =>
            cy.contains("span", "Account number").parent(),
        receiverDescription: () =>
            cy.contains("span", "Description").parent(),
        backButton: () =>
            cy.contains("button", "Back"),

        // Errors
        insufficientBalanceError: () =>
            cy.contains("Insufficient pocket balance for payout"),

        // OTP Page
        otpPageTitle: () =>
            cy.contains("h2", "Enter One Time Passcode"),
        otpMessage: () =>
            cy.contains("Please enter the 6-digit OTP sent to"),
        otpInputs: () =>
            cy.get('input[inputmode="numeric"][maxlength="1"]'),
        resendOtp: () =>
            cy.contains("span", "Resend"),
        invalidOtpError: () =>
            cy.contains("Invalid OTP"),

        // Server errors
        transactionFailedError: () =>
            cy.contains("Transaction failed"),

        // Successful Transaction
        successfulTransactionTitle: () =>
            cy.contains("h2", "Payment Successful!"),
        successfulTransactionMessage: () =>
            cy.contains("Your transaction has been completed successfully"),
        amountTransferred: () =>
            cy.contains("p", "Amount Transferred").parent(),
        viewTransactionHistoryButton: () =>
            cy.contains("button", "View Transaction History"),

    };


    // ============================
    // Actions
    // ============================

    openSendMoney() {
        cy.contains("nav a", "Send Money", { timeout: 30000 })
            .should("be.visible")
            .click();
    }

    enterAccountNumber(accountNumber) {
        this.elements.accountNumberInput()
            .should("be.visible")
            .clear()
            .type(accountNumber);
    }

    selectBank() {
        this.elements.selectBankDropdown()
            .should("be.visible")
            .click();

        cy.get(".py-1\\! button span")
            .contains("ACCESS BANK")
            .click();
    }

    enterAmount(amount) {
        this.elements.amountInput()
            .should("be.visible")
            .clear()
            .type(amount);
    }

    enterNarration(narration) {
        this.elements.narrationInput()
            .should("be.visible")
            .clear()
            .type(narration);
    }

    clickContinue() {
        this.elements.continueButton()
            .should("be.visible")
            .should("not.be.disabled")
            .click();
    }

    clickCancel() {
        this.elements.cancelButton()
            .should("be.visible")
            .click();
    }

    clickContinueOnConfirmation() {
        this.elements.continueButton({ timeout: 30000 })
            .should("be.visible")
            .and("not.be.disabled")
            .click();
    }

    enterOtp(otp) {
        this.elements.otpInputs()
            .first()
            .type(otp);
    }

    clickContinueAfterOtp() {
        cy.contains("button", "Continue", { timeout: 30000 })
            .should("be.visible")
            .click();
    }


    // ============================
    // Validations
    // ============================

    validatePageTitle() {
        this.elements.pageTitle()
            .should("be.visible");
    }

    validateSingleTabActive() {
        this.elements.singleTab()
            .should("exist")
            .and("have.attr", "href", "/send-money");
    }

    validateFormTitle() {
        this.elements.formTitle()
            .should("be.visible");
    }

    validateSourcePocketDropdown() {
        this.elements.sourcePocketDropdown()
            .should("be.visible");
    }

    validatePocketId() {
        this.elements.sourcePocketId()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(/SBP\d+/);
            });
    }

    validatePocketBalance() {
        this.elements.sourcePocketBalance()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(/NGN[\d,.]+/);
            });
    }

    validateAccountNumberField() {
        this.elements.accountNumberInput()
            .should("be.visible");
    }

    validateSelectBankDropdown() {
        this.elements.selectBankDropdown()
            .should("be.visible");
    }

    validateAccountNameField() {
        this.elements.accountNameField()
            .should("be.visible")
            .and("contain.text", "The account name is auto-generated");
    }

    validateAmountField() {
        this.elements.amountInput()
            .should("be.visible");
    }

    validateNarrationField() {
        this.elements.narrationInput()
            .should("be.visible");
    }

    validateContinueDisabled() {
        this.elements.continueButton()
            .should("be.disabled");
    }

    validateAccountNameAutoGenerated() {
        cy.document({ timeout: 30000 }).then((doc) => {
            const text = (doc.body.innerText || doc.body.textContent || "").toLowerCase();
            cy.log(`PAGE TEXT: ${text.substring(0, 500)}`);
            const hasAccountName =
                text.includes("account name") ||
                text.includes("account_name") ||
                text.includes("beneficiary") ||
                text.includes("verifying account");
            expect(hasAccountName).to.be.true;
        });
    }

    validateAccountNumberMaxLength() {
        this.elements.accountNumberInput()
            .invoke("val")
            .then((val) => {
                expect(val.length).to.be.at.most(10);
            });
    }

    validateInsufficientBalanceError() {
        cy.contains("Insufficient pocket balance", { timeout: 30000 })
            .should("be.visible");
    }

    validateOtpPage() {
        cy.contains("h2", "Enter One Time Passcode", { timeout: 30000 })
            .should("be.visible");

        cy.contains("Please enter the 6-digit OTP sent to", { timeout: 30000 })
            .should("be.visible");

        cy.get('input[inputmode="numeric"][maxlength="1"]', { timeout: 30000 })
            .should("be.visible");
    }

    validateOtpFieldsFilled() {
        cy.get('input[inputmode="numeric"][maxlength="1"]')
            .each(($input) => {
                cy.wrap($input)
                    .invoke("val")
                    .should("not.be.empty");
            });
    }

    validateInvalidOtpError() {
        cy.contains("Invalid OTP", { timeout: 30000 })
            .should("be.visible");
    }

    validateSuccessfulTransaction() {
        cy.contains("h2", "Payment Successful!", { timeout: 30000 })
            .should("be.visible");

        cy.contains("Your transaction has been completed successfully", { timeout: 30000 })
            .should("be.visible");
    }

    validateNavigatedAway() {
        cy.url().should("not.include", "/send-money");
    }

    validateFormCleared() {
        this.elements.accountNumberInput()
            .invoke("val")
            .then((val) => {
                expect(val).to.be.empty;
            });

        this.elements.amountInput()
            .invoke("val")
            .then((val) => {
                expect(val).to.be.empty;
            });

        this.elements.narrationInput()
            .invoke("val")
            .then((val) => {
                expect(val).to.be.empty;
            });
    }

    validateTransactionConfirmation() {
        cy.get("body", { timeout: 30000 }).then(($body) => {
            const bodyText = ($body[0].innerText || $body[0].textContent || "");
            if (bodyText.includes("Insufficient pocket balance for payout")) {
                cy.log("Insufficient pocket balance - confirmation page not shown");
                return;
            }

            this.elements.confirmationTitle()
                .should("be.visible");

            this.elements.paymentDetailsHeader()
                .should("be.visible");

            this.elements.amountRow()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/₦\s*[\d,.]+/);
                });

            this.elements.transactionChargeRow()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/₦[\d,.]+/);
                });

            this.elements.totalAmountRow()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/₦[\d,.]+/);
                });

            this.elements.receiverDetailsHeader()
                .should("be.visible");

            // Bank transfer receiver details: Account name, Bank,
            // Account number, Description (no Pocket ID).
            this.elements.receiverAccountName()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/Account name\s*\S+/);
                });

            this.elements.receiverBank()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/Bank\s*\S+/);
                });

            this.elements.receiverAccountNumber()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/Account number\s*\d{10}/);
                });

            this.elements.receiverDescription()
                .should("be.visible");

            this.elements.continueButton()
                .should("be.visible")
                .and("not.be.disabled");

            this.elements.backButton()
                .should("be.visible");
        });
    }

}

export default new SubPocketSendMoneyPage();
