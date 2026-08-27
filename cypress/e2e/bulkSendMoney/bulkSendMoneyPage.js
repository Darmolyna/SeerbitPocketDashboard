class BulkSendMoneyPage {

    elements = {
        bulkTab: () => cy.contains("a", "Bulk"),
        singleTab: () => cy.contains("a", "Single"),

        sourcePocketDropdown: () =>
            cy.get("img[alt='flag']")
                .first()
                .closest("div.flex")
                .parent()
                .closest("button"),

        pocketDropdownOptions: () =>
            cy.get(".absolute.z-20 button"),

        uploadInput: () => cy.get('input[type="file"]'),

        uploadSuccessMessage: () => cy.contains("File uploaded:"),

        otpInputs: () =>
            cy.get('input[inputmode="numeric"][maxlength="1"]'),
    };

    openSendMoney() {
        cy.get('a[href="/send-money/bulk"]').click();
    }

    openBulkTab() {
        cy.url().then((url) => {
            if (!url.includes("/send-money/bulk")) {
                this.elements.bulkTab().click();
            }
        });
    }

    selectBankTransfer() {
        cy.contains("button", "Bank transfer").click();
    }

    selectSubPocket() {
        cy.contains("button", "Sub pocket").click();
    }

    selectPrimaryPocket(pocketId) {
        this.elements.sourcePocketDropdown().click();

        this.elements.pocketDropdownOptions()
            .contains(pocketId)
            .click();
    }

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

    verifyContinueButtonDisabled() {
        cy.contains("button", "Continue")
            .should("be.disabled");
    }

    verifyContinueButtonEnabled() {
        cy.contains("button", "Continue")
            .should("not.be.disabled");
    }

    clickContinue() {
        cy.contains("button", "Continue").first().click();
    }

    verifyTransactionDetailsPageDisplayed() {
        cy.contains("h1", "Transactions details", { timeout: 15000 })
            .should("be.visible");
    }

    verifyTransactionSummaryDisplayed() {
        cy.contains("span", "Valid:", { timeout: 15000 })
            .should("be.visible");

        cy.contains("span", "Invalid:", { timeout: 15000 })
            .should("be.visible");
    }

    captureTransactionCharge() {
        cy.contains("div", "Transaction Charge", { timeout: 15000 })
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

        cy.contains("div", "Amount", { timeout: 15000 })
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

        cy.contains("div", "Total Amount", { timeout: 15000 })
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

    clickContinueOnConfirmation() {
        cy.contains("button", "Continue").last().click();
    }

    validateOtpPage() {
        cy.contains("h2", "Enter One Time Passcode", { timeout: 15000 })
            .should("be.visible");

        cy.contains("Please enter the 6-digit OTP sent to", { timeout: 15000 })
            .should("be.visible");

        cy.get('input[inputmode="numeric"][maxlength="1"]')
            .should("have.length", 6);
    }

    enterOtp(otp) {
        const otpArray = otp.split("");

        cy.get('input[inputmode="numeric"][maxlength="1"]')
            .each(($input, index) => {
                cy.wrap($input).type(otpArray[index]);
            });
    }

    clickContinueAfterOtp() {
        cy.contains("button", "Continue").last().click();
    }

    validateSuccessfulTransaction() {
        cy.contains(/Payment Successful!|Transaction Successful|Your transaction has been completed successfully|Transaction has been processed/, { timeout: 30000 })
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                const status = text.includes("Successful") ? "Successful" : "Failed";
                cy.wrap(status).as("transactionStatus");
                cy.log(`Transaction status from success page: ${status}`);
            });

        cy.contains("button", "View Transaction History", { timeout: 30000 })
            .should("be.visible")
            .and("not.be.disabled");

        cy.document({ timeout: 15000 }).then((doc) => {
            const text = doc.body.innerText || doc.body.textContent;
            const refMatch = text.match(/([A-Z]{2,3}-S\d{5,})/);
            if (refMatch) {
                cy.wrap(refMatch[1]).as("paymentReference");
                cy.log(`Payment reference: ${refMatch[1]}`);
            } else {
                cy.log(`No payment reference found (first 500 chars): ${text.substring(0, 500)}`);
            }
        });
    }

    validateBalanceDebited() {
        cy.get("@totalAmount").then((totalAmount) => {
            cy.get("@transactionCharge").then((transactionCharge) => {
                const transactionAmount = totalAmount - transactionCharge;
                cy.log(`Derived transaction amount: ${totalAmount} - ${transactionCharge} = ${transactionAmount}`);

                cy.contains("p", "Amount Transferred", { timeout: 30000 })
                    .should("be.visible")
                    .parent()
                    .contains("p", /₦/)
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

    clickViewTransactionHistory() {
        cy.contains("button", "View Transaction History")
            .should("be.visible")
            .and("not.be.disabled")
            .click();
    }

    validateDisbursementPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions");

        cy.contains("h1", "Transactions", { timeout: 30000 })
            .should("be.visible");

        cy.contains("button", "Disbursement", { timeout: 15000 })
            .should("be.visible");
    }

    validateTransactionInDisbursementTable() {
        cy.get("table.min-w-full", { timeout: 30000 })
            .should("be.visible");

        cy.get("@paymentReference").then((ref) => {
            const refPrefix = ref.substring(0, 12);
            cy.log(`Verifying transaction in disbursement table for ref: ${ref}`);

            cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
                .should("be.visible")
                .clear()
                .type(refPrefix);

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
        });
    }

    validatePaymentReferenceInDisbursementTable() {
        cy.get("@paymentReference").then((ref) => {
            const refPrefix = ref.substring(0, 12);
            cy.get("table.min-w-full tbody tr")
                .first()
                .within(() => {
                    cy.get("td")
                        .eq(2)
                        .invoke("text")
                        .then((text) => {
                            cy.log(`Payment reference in disbursement table: ${text.trim()}, expected prefix: ${refPrefix}`);
                            expect(text.trim()).to.include(refPrefix);
                        });
                });
        });
    }

    validateTransactionStatusInDisbursementTable() {
        cy.get("@transactionStatus").then((status) => {
            cy.get("table.min-w-full tbody tr")
                .first()
                .within(() => {
                    cy.get("td")
                        .eq(3)
                        .invoke("text")
                        .then((text) => {
                            cy.log(`Status in disbursement table: ${text.trim()}, expected: ${status}`);
                            expect(text.trim()).to.equal(status);
                        });
                });
        });
    }

    validateAmountInDisbursementTable() {
        cy.get("@transactionCharge").then((transactionCharge) => {
            cy.get("@totalAmount").then((totalAmount) => {
                cy.get("@paymentReference").then((ref) => {
                    cy.get("@transactionStatus").then((status) => {
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

        cy.contains("button", "Print Receipt", { timeout: 15000 })
            .should("be.visible");

        cy.contains("button", "Download Receipt", { timeout: 15000 })
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

                    cy.get("main", { timeout: 15000 })
                        .find(".text-4xl")
                        .should("be.visible")
                        .invoke("text")
                        .should("match", /NGN\s*[\d,.]+/);

                    cy.get("main")
                        .find(".inline-flex")
                        .should("be.visible")
                        .and("contain.text", "Successful");

                    cy.get("main span.font-mono", { timeout: 15000 })
                        .first()
                        .should("be.visible")
                        .invoke("text")
                        .then((primaryRef) => {
                            expect(primaryRef.trim()).to.equal(ref);
                        });

                    cy.get("main span.font-mono", { timeout: 15000 })
                        .eq(1)
                        .should("be.visible")
                        .invoke("text")
                        .should("have.length.greaterThan", 0)
                        .then((txId) => {
                            cy.wrap(txId.trim()).as("transactionId");
                        });

                    this.validateTransactionField("Sender Information", "Sender Name");
                    this.validateTransactionField("Sender Information", "Account Number", sourcePocket);
                    this.validateTransactionField("Sender Information", "Bank Name");

                    this.validateTransactionField("Transaction Details", "Transaction ID");
                    this.validateTransactionField("Transaction Details", "Transaction Type", "TRANSFER");
                    this.validateTransactionField("Transaction Details", "Date and Time");
                    this.validateTransactionField("Transaction Details", "Payment Channel");
                    this.validateTransactionField("Transaction Details", "Narration", `Debited:${sourcePocket}`);

                    this.validateTransactionField("Breakdown of Amounts", "Transfer Amount");

                    this.validateTransactionField("Receiver Information", "Receiver Name");
                    this.validateTransactionField("Receiver Information", "Account Number", destinationPocket);
                    this.validateTransactionField("Receiver Information", "Bank Name");
                });
            });
        });
    }

    captureTransactionDetails() {
        cy.get("main", { timeout: 15000 })
            .find(".text-4xl")
            .should("be.visible")
            .invoke("text")
            .then((text) => {
                cy.wrap(text.trim()).as("capturedAmount");
                cy.log(`Captured amount: ${text.trim()}`);
            });

        cy.get("@paymentReference").then((ref) => {
            cy.wrap(ref).as("capturedReference");
            cy.log(`Captured reference: ${ref}`);
        });

        this.getTransactionSection("Sender Information")
            .within(() => {
                cy.contains("span", "Sender Name")
                    .closest("div.flex")
                    .within(() => {
                        cy.get("span").last()
                            .invoke("text")
                            .then((text) => {
                                cy.wrap(text.trim()).as("capturedSender");
                                cy.log(`Captured sender: ${text.trim()}`);
                            });
                    });
            });

        this.getTransactionSection("Receiver Information")
            .within(() => {
                cy.contains("span", "Receiver Name")
                    .closest("div.flex")
                    .within(() => {
                        cy.get("span").last()
                            .invoke("text")
                            .then((text) => {
                                cy.wrap(text.trim()).as("capturedReceiver");
                                cy.log(`Captured receiver: ${text.trim()}`);
                            });
                    });
            });

        this.getTransactionSection("Transaction Details")
            .within(() => {
                cy.contains("span", "Narration")
                    .closest("div.flex")
                    .within(() => {
                        cy.get("span").last()
                            .invoke("text")
                            .then((text) => {
                                cy.wrap(text.trim()).as("capturedDescription");
                                cy.log(`Captured description: ${text.trim()}`);
                            });
                    });
            });

        cy.get("@transactionStatus").then((status) => {
            cy.wrap(status).as("capturedStatus");
            cy.log(`Captured status: ${status}`);
        });
    }

    validatePrintReceipt() {
        cy.contains("button", "Print Receipt", { timeout: 15000 })
            .should("be.visible")
            .and("not.be.disabled");
    }

    validateDownloadReceipt() {
        cy.get("@capturedAmount").then((amount) => {
            cy.get("@capturedReference").then((reference) => {
                cy.get("@capturedSender").then((sender) => {
                    cy.get("@capturedReceiver").then((receiver) => {
                        cy.get("@capturedDescription").then((description) => {
                            cy.get("@capturedStatus").then((status) => {
                                cy.log(`Validating receipt against: amount=${amount}, ref=${reference}, sender=${sender}, receiver=${receiver}, desc=${description}, status=${status}`);

                                cy.contains("button", "Download Receipt", { timeout: 15000 })
                                    .should("be.visible")
                                    .and("not.be.disabled")
                                    .click();

                                cy.task("getLatestDownloadedFile", ".pdf").then((filePath) => {
                                    cy.task("parsePdf", filePath).then((receiptText) => {
                                        cy.log(`PDF text (first 500 chars): ${receiptText.substring(0, 500)}`);

                                        const normalizedText = receiptText.replace(/\s+/g, "");
                                        const normalizedAmount = amount.replace(/\s+/g, "");
                                        const normalizedReference = reference.replace(/\s+/g, "");
                                        const normalizedSender = sender.replace(/\s+/g, "");
                                        const normalizedReceiver = receiver.replace(/\s+/g, "");
                                        const normalizedStatus = status.replace(/\s+/g, "");

                                        expect(normalizedText).to.contain(normalizedAmount);
                                        expect(normalizedText).to.contain(normalizedReference);
                                        expect(normalizedText).to.contain(normalizedSender);
                                        expect(normalizedText).to.contain(normalizedReceiver);
                                        expect(normalizedText).to.contain(normalizedStatus);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    goBackToDisbursementTable() {
        cy.go("back");

        cy.url({ timeout: 30000 }).should("include", "/transactions");

        cy.get("table.min-w-full", { timeout: 30000 })
            .should("be.visible");

        cy.contains("h1", "Transactions", { timeout: 30000 })
            .should("be.visible");
    }

    validateChargeInDisbursementTable() {
        cy.get("table.min-w-full", { timeout: 30000 })
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

    validateChargePaymentReferenceInDisbursementTable() {
        cy.get("@paymentReference").then((ref) => {
            const chargePrefix = ref.replace("JIN-", "Charge-").substring(0, 15);
            cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
                .should("be.visible")
                .clear()
                .type("Charge-");

            cy.get("table.min-w-full tbody tr")
                .first()
                .within(() => {
                    cy.get("td")
                        .eq(2)
                        .invoke("text")
                        .then((text) => {
                            cy.log(`Charge reference in disbursement table: ${text.trim()}, expected prefix: ${chargePrefix}`);
                            expect(text.trim()).to.include(chargePrefix);
                        });
                });
        });
    }

    validateChargeTransactionStatusInDisbursementTable() {
        cy.get("@transactionStatus").then((status) => {
            cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
                .should("be.visible")
                .clear()
                .type("Charge-");

            cy.get("table.min-w-full tbody tr")
                .first()
                .within(() => {
                    cy.get("td")
                        .eq(3)
                        .invoke("text")
                        .then((text) => {
                            cy.log(`Charge status in disbursement table: ${text.trim()}, expected: ${status}`);
                            expect(text.trim()).to.equal(status);
                        });
                });
        });
    }

    validateChargeAmountInDisbursementTable() {
        cy.get("@transactionCharge").then((transactionCharge) => {
            cy.get("@paymentReference").then((ref) => {
                cy.get("@transactionStatus").then((status) => {
                    const chargePrefix = ref.replace("JIN-", "Charge-").substring(0, 15);
                    cy.log(`Expected charge reference prefix: ${chargePrefix}`);

                    cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
                        .should("be.visible")
                        .clear()
                        .type("Charge-");

                    cy.get("table.min-w-full tbody tr")
                        .first()
                        .within(() => {
                            cy.get("td")
                                .eq(0)
                                .invoke("text")
                                .then((text) => {
                                    const match = text.match(/NGN\s*([\d,.]+)/);
                                    if (match) {
                                        const tableCharge = parseFloat(match[1].replace(/,/g, ""));
                                        cy.log(`Charge amount in disbursement table: ${tableCharge}`);
                                        expect(tableCharge).to.equal(transactionCharge);
                                    }
                                });
                        });
                });
            });
        });
    }

    validateBalanceAfterChargeInDisbursementTable() {
        cy.get("@balanceBefore").then((balanceBefore) => {
            cy.get("@transactionCharge").then((transactionCharge) => {
                const expectedBalance = balanceBefore - transactionCharge;
                cy.log(`Expected balance after charge: ${balanceBefore} - ${transactionCharge} = ${expectedBalance}`);

                cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
                    .should("be.visible")
                    .clear()
                    .type("Charge-");

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
                                    cy.log(`Balance after charge in disbursement table: ${tableBalance}`);
                                    expect(tableBalance).to.equal(expectedBalance);
                                }
                            });
                    });
            });
        });
    }

    clickChargePaymentReferenceLink() {
        cy.get('input[placeholder="Search reference"]', { timeout: 15000 })
            .should("be.visible")
            .clear()
            .type("Charge-");

        cy.get("table.min-w-full tbody tr")
            .first()
            .within(() => {
                cy.get("td")
                    .eq(2)
                    .find("a")
                    .first()
                    .invoke("attr", "href")
                    .then((href) => {
                        const baseUrl = Cypress.env("baseUrl") || Cypress.expose("baseUrl");
                        cy.visit(`${baseUrl}${href}`);
                    });
            });
    }

    validateChargeDetailsPage() {
        cy.url({ timeout: 30000 }).should("include", "/transactions/");

        cy.get("h2", { timeout: 60000 }).contains("Sender Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Receiver Information")
            .should("be.visible");

        cy.get("h2", { timeout: 15000 }).contains("Transaction Details")
            .should("be.visible");

        cy.contains("button", "Print Receipt", { timeout: 15000 })
            .should("be.visible");

        cy.contains("button", "Download Receipt", { timeout: 15000 })
            .should("be.visible");
    }

    validateChargeDetailsInformation() {
        this.validateTransactionField("Transaction Details", "Transaction Type", "FEE");
        this.validateTransactionField("Sender Information", "Sender Name");
        this.validateTransactionField("Receiver Information", "Account Number", "SEERBIT");
    }

    validateInvalidOtpError() {
        cy.get("p", { timeout: 30000 })
            .contains(/invalid otp|Invalid OTP|OTP.*invalid|otp.*failed|OTP verification failed|Verification failed/)
            .should("be.visible");
    }

    validateSamePocketTransferError() {
        cy.contains("Payment Failed!", { timeout: 30000 }).should("be.visible");
        cy.get("p", { timeout: 15000 }).contains("Same pocket transfer not allowed").should("be.visible");
    }
}

export default new BulkSendMoneyPage();
