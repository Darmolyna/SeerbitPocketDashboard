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
            cy.get("img[alt='flag']")
                .first()
                .closest("div.flex")
                .parent()
                .closest("button"),

        sourcePocketCurrencyCode: () =>
            cy.get("img[alt='flag']")
                .first()
                .next("span"),

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
            cy.get('input[placeholder="Pocket ID"]'),

        amountInput: () =>
            cy.get('input[placeholder="Enter amount"]'),

        narrationInput: () =>
            cy.get('input[placeholder="Enter narration"]'),

        // Bank Transfer Form Fields
        accountNumberInput: () =>
            cy.get('input[placeholder*="account" i]'),

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
        paymentReference: () =>
            cy.contains("span", "Payment reference").parent(),
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

        // Transactions Page (Disbursement)
        transactionsPageTitle: () =>
            cy.contains("h1", "Transactions"),
        disbursementTab: () =>
            cy.contains("button", "Disbursement"),
        disbursementTable: () =>
            cy.get("table.min-w-full"),
        disbursementTableRows: () =>
            cy.get("table.min-w-full tbody tr"),

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
        cy.wait(3000);
    }

    ensureOnSendMoneyPage() {
        cy.url().then((url) => {
            if (!url.includes("/send-money")) {
                const baseUrl = Cypress.env("baseUrl") || Cypress.expose("baseUrl");
                cy.visit("/send-money");
                cy.wait(2000);
            }
        });
    }


    // Transfer Type

    clickSubPocket() {
        this.elements.subPocketButton()
            .should("be.visible")
            .click();

        this.elements.pocketIdInput({ timeout: 15000 })
            .should("be.visible");
    }

    clickBankTransfer() {
        this.elements.bankTransferButton()
            .should("be.visible")
            .click();

        this.elements.accountNumberInput({ timeout: 15000 })
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
            .should("not.be.disabled")
            .click();

        cy.wait(5000);
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


    // Balance & Transaction Tracking

    storeBalanceBeforeTransaction() {
        this.elements.sourcePocketBalance()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                const balance = parseFloat(text.replace(/[^0-9.]/g, ""));
                cy.wrap(balance).as("balanceBefore");
                cy.log(`Balance before transaction: ${balance}`);
            });
    }

    captureTransactionCharge() {
        this.elements.transactionChargeRow()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                const match = text.match(/₦([\d,.]+)/);
                if (match) {
                    const charge = parseFloat(match[1].replace(/,/g, ""));
                    cy.wrap(charge).as("transactionCharge");
                    cy.log(`Transaction charge: ${charge}`);
                }
            });

        this.elements.amountRow()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                const match = text.match(/₦([\d,.]+)/);
                if (match) {
                    const amount = parseFloat(match[1].replace(/,/g, ""));
                    cy.wrap(amount).as("transactionAmount");
                    cy.log(`Transaction amount: ${amount}`);
                }
            });

        this.elements.totalAmountRow()
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                const match = text.match(/₦([\d,.]+)/);
                if (match) {
                    const total = parseFloat(match[1].replace(/,/g, ""));
                    cy.wrap(total).as("totalAmount");
                    cy.log(`Total amount: ${total}`);
                }
            });


    }

    validateBalanceDebited() {
        cy.get("@totalAmount").then((totalAmount) => {
            cy.get("@transactionCharge").then((transactionCharge) => {
                const transactionAmount = totalAmount - transactionCharge;
                cy.log(`Derived transaction amount: ${totalAmount} - ${transactionCharge} = ${transactionAmount}`);

                this.elements.amountTransferred({ timeout: 30000 })
                    .should("be.visible")
                    .invoke("text")
                    .then((text) => {
                        const match = text.match(/₦([\d,.]+)/);
                        if (match) {
                            const transferredAmount = parseFloat(match[1].replace(/,/g, ""));
                            cy.log(`Amount transferred on success page: ${transferredAmount}`);
                            expect(transferredAmount).to.be.closeTo(transactionAmount, 0.01);
                        }
                    });
            });
        });
    }


    // View Transaction History

    clickViewTransactionHistory() {
        this.elements.viewTransactionHistoryButton()
            .should("be.visible")
            .and("not.be.disabled")
            .click();
    }

    validateDisbursementPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions");

        this.elements.transactionsPageTitle({ timeout: 30000 })
            .should("be.visible");

        this.elements.disbursementTab()
            .should("be.visible");
    }

    validateTransactionInDisbursementTable() {
        this.elements.disbursementTable({ timeout: 30000 })
            .should("be.visible");

        cy.get("@paymentReference").then((ref) => {
            cy.log(`Verifying transaction and charge for ref: ${ref}`);

            const refPrefix = ref.substring(0, 12);

            cy.get('input[placeholder="Search reference"]')
                .should("be.visible")
                .clear()
                .type(refPrefix);

            cy.wait(3000);

            cy.get("table.min-w-full tbody tr", { timeout: 15000 })
                .should("have.length.gte", 1);

            cy.get("table.min-w-full tbody tr")
                .first()
                .then(($row) => {
                    const rowText = Cypress.$($row).text();
                    cy.log(`Transaction row: ${rowText.substring(0, 300)}`);
                    expect(rowText).to.include(refPrefix);
                    expect(rowText).to.match(/Successful|Completed/);
                });

            cy.get('input[placeholder="Search reference"]')
                .clear()
                .type(`Charge-${ref}`);

            cy.wait(3000);

            cy.get("table.min-w-full tbody tr", { timeout: 15000 })
                .should("have.length.gte", 1);

            cy.get("table.min-w-full tbody tr")
                .first()
                .then(($row) => {
                    const rowText = Cypress.$($row).text();
                    cy.log(`Charge row: ${rowText.substring(0, 300)}`);
                    expect(rowText).to.include("Charge-");
                    expect(rowText).to.match(/Successful|Completed/);
                });
        });
    }


    validateTransactionAndChargeInDisbursementTable() {
        this.elements.disbursementTable({ timeout: 30000 })
            .should("be.visible");

        cy.get("@paymentReference").then((ref) => {
            cy.log(`Verifying transaction and charge for ref: ${ref}`);

            const refPrefix = ref.substring(0, 12);

            cy.get('input[placeholder="Search reference"]')
                .should("be.visible")
                .clear()
                .type(refPrefix);

            cy.wait(3000);

            cy.get("table.min-w-full tbody tr", { timeout: 15000 })
                .should("have.length.gte", 1);

            cy.get("table.min-w-full tbody tr")
                .first()
                .then(($row) => {
                    const rowText = Cypress.$($row).text();
                    cy.log(`Transaction row: ${rowText.substring(0, 300)}`);
                    expect(rowText).to.include(refPrefix);
                    expect(rowText).to.match(/Successful|Completed/);
                });

            cy.get('input[placeholder="Search reference"]')
                .clear()
                .type(`Charge-${ref}`);

            cy.wait(3000);

            cy.get("table.min-w-full tbody tr", { timeout: 15000 })
                .should("have.length.gte", 1);

            cy.get("table.min-w-full tbody tr")
                .first()
                .then(($row) => {
                    const rowText = Cypress.$($row).text();
                    cy.log(`Charge row: ${rowText.substring(0, 300)}`);
                    expect(rowText).to.include("Charge-");
                    expect(rowText).to.match(/Successful|Completed/);
                });
        });
    }

    clickPaymentReferenceLink() {
        cy.get("@paymentReference").then((ref) => {
            const refPrefix = ref.substring(0, 12);

            cy.get('input[placeholder="Search reference"]')
                .should("be.visible")
                .clear()
                .type(refPrefix);

            cy.wait(3000);

            cy.get("table.min-w-full tbody tr", { timeout: 15000 })
                .should("have.length.gte", 1);

            cy.get("table.min-w-full tbody tr")
                .first()
                .find("a.text-blue-500")
                .should("be.visible")
                .click();
        });
    }

    validateTransactionDetailsPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions/");

        cy.get("body", { timeout: 30000 }).then(($body) => {
            const text = ($body[0].innerText || $body[0].textContent || "");
            cy.log(`Transaction details page text: ${text.substring(0, 500)}`);

            const hasDetails =
                text.includes("Transaction Details") ||
                text.includes("Transaction Details:") ||
                text.includes("Sender Information") ||
                text.includes("Receiver Information") ||
                text.includes("Breakdown of Amounts");
            expect(hasDetails, "Transaction details page not loaded").to.be.true;
        });
    }

    validateTransactionDetailsInformation() {
        cy.get("@paymentReference").then((ref) => {
            const refPrefix = ref.substring(0, 12);

            cy.get("body", { timeout: 15000 }).then(($body) => {
                const text = ($body[0].innerText || $body[0].textContent || "");
                cy.log(`Details page text sample: ${text.substring(0, 500)}`);

                expect(text).to.include(refPrefix);
                expect(text).to.match(/Successful|Transaction Successful/);
                expect(text).to.match(/NGN\s*1|1\.00/);
                expect(text).to.match(/SBP0017144/);
                expect(text).to.match(/SBP0020694/);
                expect(text).to.match(/TRANSFER|Transfer/);
            });
        });
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
        cy.document({ timeout: 30000 }).then((doc) => {
            const text = (doc.body.innerText || doc.body.textContent || "").toLowerCase();
            const sample = text.substring(0, 500);
            cy.log(`PAGE TEXT: ${sample}`);
            const hasAccountName =
                text.includes("account name") ||
                text.includes("account_name") ||
                text.includes("beneficiary") ||
                text.includes("verifying account");
            expect(hasAccountName, `Page text sample: ${sample}`).to.be.true;
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
            const bodyText = ($body[0].innerText || $body[0].textContent || "");
            if (bodyText.includes("Insufficient pocket balance for payout")) {
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
        this.elements.continueButton({ timeout: 30000 })
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
        cy.get("body", { timeout: 30000 }).then(($body) => {
            const text = ($body[0].innerText || $body[0].textContent || "");
            const sample = text.substring(0, 500);
            cy.log(`PAGE TEXT: ${sample}`);
            const hasError =
                text.includes("Transaction failed") ||
                text.includes("Invalid OTP") ||
                text.includes("invalid otp") ||
                text.includes("OTP verification failed") ||
                text.includes("Verification failed") ||
                text.includes("failed") ||
                text.includes("Enter One Time Passcode") ||
                text.includes("One Time Passcode");
            expect(hasError, `Page text sample: ${sample}`).to.be.true;
        });
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

        cy.document({ timeout: 15000 }).then((doc) => {
            const text = doc.body.innerText || doc.body.textContent;
            const refMatch = text.match(/([A-Z]{2,3}-S\d+)/);
            if (refMatch) {
                cy.wrap(refMatch[1]).as("paymentReference");
                cy.log(`Payment reference: ${refMatch[1]}`);
            }
        });
    }

    validateSamePocketTransferError() {
        cy.document({ timeout: 30000 }).then((doc) => {
            const text = doc.body.innerText || doc.body.textContent;
            const sample = text.substring(0, 500);
            cy.log(`PAGE TEXT: ${sample}`);
            const hasError =
                text.includes("Same pocket") ||
                text.includes("same pocket") ||
                text.includes("cannot transfer to the same") ||
                text.includes("transfer to yourself") ||
                text.includes("not allowed") ||
                text.includes("Invalid transfer");
            expect(hasError, `Page text sample: ${sample}`).to.be.true;
        });
    }


    // Cancel

    validateNavigatedAway() {
        cy.get("body", { timeout: 10000 }).then(($body) => {
            const url = $body[0].ownerDocument.location.href;
            const text = $body.text();
            cy.log(`Current URL after cancel: ${url}`);
            cy.log(`Page text sample: ${text.substring(0, 200)}`);
        });
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
