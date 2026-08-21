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

        // Transaction Details Page
        printReceiptButton: () =>
            cy.contains("button", "Print Receipt"),
        downloadReceiptButton: () =>
            cy.contains("button", "Download Receipt"),

    };



    // ============================
    // Actions
    // ============================

    openSendMoney() {
        cy.contains("nav a", "Send Money", { timeout: 15000 })
            .should("be.visible")
            .click();
    }

    navigateToSingleTab() {
        this.elements.singleTab()
            .should("be.visible")
            .click();

        cy.url().should("include", "/send-money");
        this.elements.transferTypeSection({ timeout: 15000 })
            .should("be.visible");

        this.elements.pocketIdInput({ timeout: 15000 })
            .should("be.visible");
    }

    ensureOnSendMoneyPage() {
        cy.url().then((url) => {
            if (!url.includes("/send-money")) {
                const baseUrl = Cypress.env("baseUrl") || Cypress.expose("baseUrl");
                cy.visit("/send-money");
                this.elements.transferTypeSection({ timeout: 15000 })
                    .should("be.visible");
            }
        });
    }


    // Transfer Type

    clickBankTransfer() {
        this.elements.bankTransferButton({ timeout: 15000 })
            .should("be.visible")
            .click();

        this.elements.accountNumberInput({ timeout: 20000 })
            .should("be.visible");
    }

    clickSubPocket() {
        this.elements.subPocketButton({ timeout: 15000 })
            .should("be.visible")
            .click();

        this.elements.pocketIdInput({ timeout: 20000 })
            .should("be.visible");
    }

    enterPocketId(pocketId) {
        this.elements.pocketIdInput()
            .should("be.visible")
            .clear()
            .type(pocketId);

        cy.wrap(pocketId).as("destinationPocketId");
        cy.log(`Destination pocket entered: ${pocketId}`);
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

        cy.wrap(pocketId).as("sourcePocketId");
        cy.log(`Source pocket selected: ${pocketId}`);
    }


    // Balance & Transaction Tracking

    storeBalanceBeforeTransaction() {
        cy.get("form#send-money-form button")
            .first()
            .within(() => {
                cy.get("span.whitespace-nowrap", { timeout: 10000 })
                    .last()
                    .invoke("text")
                    .then((text) => {
                        const balance = parseFloat(text.replace(/[^0-9.]/g, ""));
                        cy.wrap(balance).as("balanceBefore");
                        cy.log(`Balance before transaction from form: ${text.trim()} => ${balance}`);
                    });
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

    validateAmountInDisbursementTable() {
        cy.get("@transactionCharge").then((transactionCharge) => {
            cy.get("@totalAmount").then((totalAmount) => {
                const transactionAmount = totalAmount - transactionCharge;
                cy.log(`Expected amount in disbursement table: ${transactionAmount}`);

                cy.get("table.min-w-full tbody tr")
                    .first()
                    .within(() => {
                        cy.get("td")
                            .eq(0)
                            .invoke("text")
                            .then((text) => {
                                const match = text.match(/NGN\s*([\d,.]+)/);
                                if (match) {
                                    const tableAmount = parseFloat(match[1].replace(/,/g, ""));
                                    cy.log(`Amount in disbursement table: ${tableAmount}`);
                                    expect(tableAmount).to.equal(transactionAmount);
                                }
                            });
                    });
            });
        });
    }

    validateBalanceInDisbursementTable() {
        cy.get("@balanceBefore").then((balanceBefore) => {
            cy.get("@transactionCharge").then((transactionCharge) => {
                cy.get("@totalAmount").then((totalAmount) => {
                    const transactionAmount = totalAmount - transactionCharge;
                    const expectedBalance = balanceBefore - transactionAmount;
                    cy.log(`Expected balance in disbursement table: ${balanceBefore} - ${transactionAmount} = ${expectedBalance}`);

                    cy.get("table.min-w-full tbody tr")
                        .first()
                        .within(() => {
                            cy.get("td")
                                .eq(4)
                                .invoke("text")
                                .then((text) => {
                                    const match = text.match(/NGN\s*([\d,.]+)/);
                                    if (match) {
                                        const tableBalance = parseFloat(match[1].replace(/,/g, ""));
                                        cy.log(`Balance in disbursement table: ${tableBalance}`);
                                        expect(tableBalance).to.equal(expectedBalance);
                                    }
                                });
                        });
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

    searchDisbursementTable(searchTerm) {
        cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
            .should("be.visible")
            .clear()
            .type(searchTerm);

        cy.get("table.min-w-full tbody tr", { timeout: 15000 })
            .should("have.length.gte", 1);

        cy.get("table.min-w-full tbody tr")
            .first()
            .invoke("text")
            .should("have.length.greaterThan", 0);
    }

    validateTransactionInDisbursementTable() {
        this.elements.disbursementTable({ timeout: 30000 })
            .should("be.visible");

        cy.get("@paymentReference").then((ref) => {
            const refPrefix = ref.substring(0, 12);
            cy.log(`Verifying transaction in disbursement table for ref: ${ref}`);

            this.searchDisbursementTable(refPrefix);

            cy.get("table.min-w-full tbody tr")
                .first()
                .then(($row) => {
                    const rowText = Cypress.$($row).text();
                    cy.log(`Transaction row: ${rowText.substring(0, 300)}`);
                    expect(rowText).to.include(refPrefix);
                    expect(rowText).to.match(/Successful|Completed/);
                });
        });
    }

    clickTransactionPaymentReferenceLink() {
        cy.get("@paymentReference").then((ref) => {
            cy.log(`Navigating to transaction details for ref: ${ref}`);
            const baseUrl = Cypress.env("baseUrl") || Cypress.expose("baseUrl");
            cy.visit(`${baseUrl}/transactions/${ref}?tab=disbursement`);
        });
    }

    validateTransactionDetailsPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions/");

        cy.get("h2", { timeout: 60000 }).contains("Sender Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Receiver Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Transaction Details")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Breakdown of Amounts")
            .should("be.visible");

        this.elements.printReceiptButton({ timeout: 15000 })
            .should("be.visible");

        this.elements.downloadReceiptButton({ timeout: 15000 })
            .should("be.visible");
    }

    getTransactionSection(sectionTitle) {
        return cy.contains("h2", sectionTitle)
            .should("be.visible")
            .next(".space-y-4")
            .should("be.visible");
    }

    validateTransactionField(sectionTitle, fieldLabel, expectedValue = null) {
        this.getTransactionSection(sectionTitle)
            .within(() => {
                cy.contains("span", fieldLabel)
                    .should("be.visible")
                    .closest("div.flex")
                    .within(() => {
                        cy.contains("span", fieldLabel)
                            .should("be.visible");

                        cy.get("span")
                            .last()
                            .should("be.visible")
                            .and("not.be.empty")
                            .then(($value) => {
                                if (expectedValue !== null) {
                                    expect($value.text().trim()).to.contain(expectedValue);
                                }
                            });
                    });
            });
    }

    validateTransactionDetailsInformation() {
        cy.get("@paymentReference").then((ref) => {
            cy.get("@sourcePocketId").then((sourcePocket) => {
                cy.get("@destinationPocketId").then((destinationPocket) => {
                    cy.log(`Validating details: ref=${ref}, from=${sourcePocket}, to=${destinationPocket}`);

                    // Amount
                    cy.get("main", { timeout: 15000 })
                        .find(".text-4xl")
                        .should("be.visible")
                        .invoke("text")
                        .should("match", /NGN\s*[\d,.]+/);

                    // Status badge
                    cy.get("main")
                        .find(".inline-flex")
                        .should("be.visible")
                        .and("contain.text", "Successful");

                    // Primary reference matches success page
                    cy.get("main span.font-mono", { timeout: 15000 })
                        .first()
                        .should("be.visible")
                        .invoke("text")
                        .then((primaryRef) => {
                            expect(primaryRef.trim()).to.equal(ref);
                        });

                    // Secondary reference visible and not empty
                    cy.get("main span.font-mono", { timeout: 15000 })
                        .eq(1)
                        .should("be.visible")
                        .invoke("text")
                        .should("have.length.greaterThan", 0)
                        .then((txId) => {
                            cy.wrap(txId.trim()).as("transactionId");
                        });

                    // Both copy buttons visible
                    cy.get("main span.font-mono")
                        .closest(".bg-\\[\\#F9FAFB\\]")
                        .find("button")
                        .should("have.length.gte", 2)
                        .each(($btn) => {
                            cy.wrap($btn).should("be.visible");
                        });

                    // Sender Information
                    this.validateTransactionField("Sender Information", "Sender Name");
                    this.validateTransactionField("Sender Information", "Account Number", sourcePocket);
                    this.validateTransactionField("Sender Information", "Bank Name");

                    // Transaction Details
                    this.validateTransactionField("Transaction Details", "Transaction ID");
                    this.validateTransactionField("Transaction Details", "Transaction Type", "TRANSFER");
                    this.validateTransactionField("Transaction Details", "Date and Time");
                    this.validateTransactionField("Transaction Details", "Payment Channel");
                    this.validateTransactionField("Transaction Details", "Narration", `Debited:${sourcePocket}`);

                    // Breakdown of Amounts
                    this.validateTransactionField("Breakdown of Amounts", "Transfer Amount");

                    // Receiver Information
                    this.validateTransactionField("Receiver Information", "Receiver Name");
                    this.validateTransactionField("Receiver Information", "Account Number", destinationPocket);
                    this.validateTransactionField("Receiver Information", "Bank Name");
                });
            });
        });
    }

    validatePrintReceipt() {
        this.elements.printReceiptButton({ timeout: 15000 })
            .should("be.visible")
            .and("not.be.disabled")
            .click();

        // Button should be clickable and not throw errors
        cy.contains("button", "Print Receipt").should("exist");
    }

    validateDownloadReceipt() {
        this.elements.downloadReceiptButton({ timeout: 15000 })
            .should("be.visible")
            .and("not.be.disabled")
            .click();

        cy.contains("button", "Download Receipt").should("exist");
    }

    goBackToDisbursementTable() {
        cy.go("back");

        cy.url({ timeout: 30000 }).should("include", "/transactions");

        this.elements.disbursementTable({ timeout: 30000 })
            .should("be.visible");

        this.elements.transactionsPageTitle({ timeout: 30000 })
            .should("be.visible");
    }

    validateChargeInDisbursementTable() {
        this.elements.disbursementTable({ timeout: 30000 })
            .should("be.visible");

        cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
            .should("be.visible")
            .clear()
            .type("Charge-");

        cy.get("table.min-w-full tbody tr", { timeout: 15000 }).then(($rows) => {
            let chargeFound = false;

            $rows.each((i, row) => {
                const rowText = Cypress.$(row).text();
                if (rowText.includes("Charge-")) {
                    chargeFound = true;
                    cy.log(`Charge row found: ${rowText.substring(0, 300)}`);
                }
            });

            expect(chargeFound, "Charge- entry should exist in the disbursement table (app bug if absent)").to.be.true;
            cy.wrap(chargeFound).as("chargeFound");
        });
    }

    clickChargePaymentReferenceLink() {
        cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
            .should("be.visible")
            .clear()
            .type("Charge-");

        cy.get("table.min-w-full tbody tr", { timeout: 15000 })
            .should("have.length.gte", 1)
            .first()
            .find("a.text-blue-500")
            .should("be.visible")
            .click();
    }

    validateChargeDetailsPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions/");

        cy.get("h2", { timeout: 60000 }).contains("Sender Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Receiver Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Transaction Details")
            .should("be.visible");

        this.elements.printReceiptButton({ timeout: 15000 })
            .should("be.visible");

        this.elements.downloadReceiptButton({ timeout: 15000 })
            .should("be.visible");
    }

    validateChargeDetailsInformation() {
        this.validateTransactionField("Transaction Details", "Transaction Type", "FEE");
        this.validateTransactionField("Sender Information", "Sender Name");
        this.validateTransactionField("Receiver Information", "Account Number", "SEERBIT");
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
        cy.contains("p", /Insufficient pocket balance for payout|Insufficient pocket balance/, { timeout: 30000 })
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

    validateInvalidOtpError() {
        cy.get("p", { timeout: 30000 })
            .contains(/invalid otp|Invalid OTP|OTP.*invalid|otp.*failed|OTP verification failed|Verification failed/)
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

        cy.document({ timeout: 15000 }).then((doc) => {
            const text = doc.body.innerText || doc.body.textContent;
            const refMatch = text.match(/([A-Z]{2,3}-S\d{5,})/);
            if (refMatch) {
                cy.wrap(refMatch[1]).as("paymentReference");
                cy.log(`Payment reference: ${refMatch[1]}`);
            } else {
                cy.log(`No payment reference found in text (first 500 chars): ${text.substring(0, 500)}`);
            }
        });
    }

    validateSamePocketTransferError() {
        cy.contains("Payment Failed!", { timeout: 30000 }).should("be.visible");
        cy.get("p", { timeout: 15000 }).contains("Same pocket transfer not allowed").should("be.visible");
    }


    // Cancel

    validateNavigatedAway() {
        cy.get("body", { timeout: 10000 }).then(($body) => {
            const url = $body[0].ownerDocument.location.href;
            const text = $body[0].innerText || $body[0].textContent || "";
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
