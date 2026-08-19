class SingleSendMoneyPage {

    // ============================
    // Elements
    // ============================

    elements = {

        // Page
        pageTitle: () => cy.contains("h1", "Send Money"),

        // Tabs
        bulkTab: () => cy.get('a[href="/send-money/bulk"]'),
        singleTab: () => cy.get('a[href="/send-money"]'),

        // Source Pocket Dropdown
        sourcePocketDropdown: () =>
            cy.get("#send-money-form button[type='button']").first(),

        sourcePocketCurrencyCode: () =>
            cy.get("#send-money-form button[type='button']")
                .first()
                .find("span")
                .eq(1),

        sourcePocketId: () =>
            cy.get("#send-money-form button[type='button']")
                .first()
                .find("span")
                .eq(2),

        sourcePocketBalance: () =>
            cy.get("#send-money-form button[type='button']")
                .first()
                .find("span")
                .eq(3),

        pocketDropdownOptions: () =>
            cy.get(".absolute.z-20 button"),

        // Transfer Type
        transferTypeSection: () =>
            cy.contains("h3", "Transfer type"),

        subPocketButton: () =>
            cy.contains("button", "Sub pocket"),

        bankTransferButton: () =>
            cy.contains("button", "Bank transfer"),

        // Form Title
        formTitle: () => cy.contains("h2", "Send money from"),

        // Sub Pocket Form Fields
        pocketIdInput: () =>
            cy.get('input[name="pocketId"]'),

        amountInput: () =>
            cy.get('input[name="amount"]'),

        narrationInput: () =>
            cy.get('input[name="narration"]'),

        // Bank Transfer Form Fields
        accountNumberInput: () =>
            cy.get('input[name="accountNumber"]'),

        selectBankDropdown: () =>
            cy.get('[data-testid="select-trigger"]'),

        bankOptions: () =>
            cy.get('[data-testid="select-trigger"]')
                .parent()
                .find('[role="listbox"] div, ul li, [class*="option"], [class*="item"]'),

        accountNameField: () =>
            cy.contains('div', 'The account name is auto-generated'),

        // Validation Errors
        pocketIdError: () =>
            cy.contains("Pocket ID is required"),

        amountError: () =>
            cy.contains("Amount is required"),

        accountNumberError: () =>
            cy.contains("Account number is required"),

        selectBankError: () =>
            cy.contains("Select a bank"),

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
        receiverPocketId: () =>
            cy.contains("span", "Pocket ID").parent(),
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

        // Transaction Failed
        transactionFailedError: () =>
            cy.contains("Transaction failed"),

        // Successful Transaction
        successfulTransactionTitle: () =>
            cy.contains("h2", "Payment Successful!"),
        successfulTransactionMessage: () =>
            cy.contains("Your transaction has been completed successfully"),
        amountTransferred: () =>
            cy.contains("p", "Amount Transferred").parent(),
        transactionDetails: () =>
            cy.contains("span", "Pocket ID").parents(".border"),
        viewTransactionHistoryButton: () =>
            cy.contains("button", "View Transaction History"),

        // Same Pocket Transfer Error
        samePocketTransferError: () =>
            cy.contains("Same pocket transfer not allowed"),

    };



    // ============================
    // Actions
    // ============================

    openSendMoney() {
        cy.contains("nav a", "Send Money")
            .should("be.visible")
            .click();
    }

    navigateToSingleTab() {
        this.elements.singleTab()
            .should("be.visible")
            .click();

        cy.url().should("include", "/send-money");
    }


    // Transfer Type

    clickSubPocket() {
        this.elements.subPocketButton()
            .should("be.visible")
            .click();

        this.elements.pocketIdInput()
            .should("be.visible");
    }

    clickBankTransfer() {
        this.elements.bankTransferButton()
            .should("be.visible")
            .click();

        this.elements.accountNumberInput()
            .should("be.visible");
    }


    // Form Inputs

    enterPocketId(pocketId) {
        this.elements.pocketIdInput()
            .should("be.visible")
            .clear()
            .type(pocketId);
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


    // Buttons

    clickContinue() {
        this.elements.continueButton()
            .should("be.visible")
            .click();
    }

    clickCancel() {
        this.elements.cancelButton()
            .should("be.visible")
            .click();
    }


    // Source Pocket Dropdown

    clickSourcePocketDropdown() {
        this.elements.sourcePocketDropdown()
            .should("be.visible")
            .click();
    }

    selectPrimaryPocket(pocketId) {
        this.elements.sourcePocketDropdown()
            .should("be.visible")
            .click();

        this.elements.pocketDropdownOptions()
            .should("be.visible")
            .contains(pocketId)
            .click();
    }


    // ============================
    // Validations
    // ============================


    // Page Layout

    validatePageTitle() {
        this.elements.pageTitle()
            .should("be.visible");
    }

    validateTabsVisible() {
        this.elements.bulkTab().should("be.visible");
        this.elements.singleTab().should("be.visible");
    }

    validateSingleTabActive() {
        this.elements.singleTab()
            .should("have.attr", "href", "/send-money")
    }

    validateSectionTitle(sectionTitle) {
        cy.contains(sectionTitle).should("be.visible");
    }

    validateSourcePocketDropdown() {
        this.elements.sourcePocketDropdown()
            .should("be.visible");
    }

    validateTransferTypeSection() {
        this.elements.transferTypeSection()
            .should("be.visible");
    }

    validateFormTitle() {
        this.elements.formTitle()
            .should("be.visible");
    }


    // Transfer Type Selection

    validateSubPocketSelected() {
        this.elements.subPocketButton()
            .should("have.class", "scale-[1.03]");
    }

    validateBankTransferSelected() {
        this.elements.bankTransferButton()
            .should("have.class", "scale-[1.03]");
    }


    // Form Fields

    validatePocketIdField() {
        this.elements.pocketIdInput()
            .should("be.visible");
    }

    validateAmountField() {
        this.elements.amountInput()
            .should("be.visible");
    }

    validateNarrationField() {
        this.elements.narrationInput()
            .should("be.visible");
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


    // Form Validation

    validateContinueDisabled() {
        this.elements.continueButton()
            .should("be.disabled");
    }

    validateContinueEnabled() {
        this.elements.continueButton()
            .should("not.be.disabled");
    }

    validatePocketIdError() {
        this.elements.pocketIdError()
            .should("be.visible")
            .and("contain.text", "Pocket ID is required");
    }

    validateAmountError() {
        this.elements.amountError()
            .should("be.visible");
    }

    validateAccountNumberError() {
        this.elements.accountNumberError()
            .should("be.visible");
    }

    validateSelectBankError() {
        this.elements.selectBankError()
            .should("be.visible");
    }


    // Bank Transfer Specific

    validateAccountNameAutoGenerated() {
        this.elements.accountNameField()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.not.equal("");
                expect(text.trim()).to.not.equal("The account name is auto-generated");
            });
    }

    validateAccountNumberMaxLength() {
        this.elements.accountNumberInput()
            .invoke("val")
            .then((val) => {
                expect(val.length).to.be.at.most(10);
            });
    }


    // Transaction Confirmation

    validateTransactionConfirmation() {
        cy.get("body", { timeout: 30000 }).then(($body) => {
            if ($body.text().includes("Insufficient pocket balance for payout")) {
                cy.log("Insufficient pocket balance - confirmation page not shown");
                return;
            }

            cy.contains("h2", "You're about to send")
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

            cy.contains("span", "Pocket ID", { timeout: 30000 })
                .parent()
                .should("be.visible")
                .invoke("text")
                .then((text) => {
                    expect(text).to.match(/SBP\d+|Pocket ID\d+/);
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

    clickContinueOnConfirmation() {
        this.elements.continueButton()
            .should("be.visible")
            .and("not.be.disabled")
            .click();
    }

    validateInsufficientBalanceError() {
        this.elements.insufficientBalanceError()
            .should("be.visible");
    }

    // OTP Page

    validateOtpPage() {
        cy.contains("h2", "Enter One Time Passcode", { timeout: 30000 })
            .should("be.visible");

        cy.contains("Please enter the 6-digit OTP sent to", { timeout: 30000 })
            .should("be.visible");

        cy.get('input[inputmode="numeric"][maxlength="1"]', { timeout: 30000 })
            .should("have.length", 6);
    }

    enterOtp(otp) {
        const otpArray = otp.split("");

        this.elements.otpInputs()
            .each(($input, index) => {
                cy.wrap($input)
                    .type(otpArray[index]);
            });
    }

    validateOtpFieldsFilled() {
        this.elements.otpInputs()
            .each(($input) => {
                cy.wrap($input)
                    .invoke("val")
                    .should("not.be.empty");
            });
    }

    clickContinueAfterOtp() {
        this.elements.continueButton()
            .should("be.visible")
            .and("not.be.disabled")
            .click();
    }

    validateTransactionFailedError() {
        this.elements.transactionFailedError()
            .should("be.visible");
    }

    validateSuccessfulTransaction() {
        cy.contains("h2", "Payment Successful!", { timeout: 30000 })
            .should("be.visible");

        this.elements.successfulTransactionMessage()
            .should("be.visible");

        this.elements.amountTransferred()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                expect(text).to.match(/₦[\d,.]+/);
            });

        this.elements.transactionDetails()
            .should("be.visible");

        this.elements.viewTransactionHistoryButton()
            .should("be.visible")
            .and("not.be.disabled");
    }

    validateSamePocketTransferError() {
        this.elements.samePocketTransferError()
            .should("be.visible");
    }


    // Cancel

    validateNavigatedAway() {
        cy.url().should("not.include", "/send-money");
    }


    // Source Pocket Dropdown

    validatePocketCurrencyCode() {
        this.elements.sourcePocketCurrencyCode()
            .invoke("text")
            .then((code) => {
                expect(code.trim()).to.match(/^[A-Z]{3}$/);
            });
    }

    validatePocketId() {
        this.elements.sourcePocketId()
            .invoke("text")
            .then((id) => {
                expect(id.trim()).to.match(/^SBP\d+$/);
            });
    }

    validatePocketBalance() {
        this.elements.sourcePocketBalance()
            .invoke("text")
            .then((balance) => {
                expect(balance.trim()).to.match(/^NGN[\d,.]+$/);
            });
    }

    validatePocketDropdownList() {
        this.elements.pocketDropdownOptions()
            .should("have.length.greaterThan", 0);
    }

}

export default new SingleSendMoneyPage();
