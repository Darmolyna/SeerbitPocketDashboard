
class ExportTransactionsPriPocPage {

    elements = {

        transactionMenu: () =>
            cy.get("nav a", { timeout: 30000 })
                .contains("Transactions", { timeout: 30000 }),

        disbursementMenu: () =>
            cy.contains("button", "Disbursement"),

        exportTransactionsButton: () =>
            cy.contains("div", "Export Transactions"),

        modal: () =>
            cy.contains("h2", "Export transactions"),

        dateRangeInput: () =>
            cy.get('[data-picker="date-range"] input'),

        datePickerIcon: () =>
            cy.get('[data-picker="date-range"] svg[aria-label="calendar"]'),

        rowDropdown: () =>
            cy.get("select"),

        exportButton: () =>
            cy.contains("button", /^Export$/),

        cancelButton: () =>
            cy.contains("button", "Cancel"),

        okButton: () =>
            cy.contains("button", "OK"),

        selectedColumns: () =>
            cy.get(".grid button"),

        calendar: () =>
            cy.get(".rs-picker-box"),

        calendarStart: () =>
            cy.get('[data-testid="calendar-start"]'),

        calendarEnd: () =>
            cy.get('[data-testid="calendar-end"]'),

        noTransactionsMessage: () =>
            cy.get("p")
                .contains("No transactions found for the selected date range")

    };


    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    clickTransactionMenu() {

        this.elements.transactionMenu()
            .should("be.visible", { timeout: 15000 })
            .click();

    }


    clickDisbursementMenu() {

        this.elements.transactionMenu()
            .should("be.visible", { timeout: 10000 })
            .click();

        this.elements.disbursementMenu()
            .should("be.visible", { timeout: 10000 })
            .click();

    }


    clickExportTransactionsButton() {

        this.elements.exportTransactionsButton()
            .should("be.visible")
            .click();

    }


    validateExportModal() {

        this.elements.modal()
            .should("be.visible");

        this.elements.dateRangeInput()
            .should("be.visible");

        this.elements.rowDropdown()
            .should("be.visible");

        this.elements.exportButton()
            .should("be.disabled");

    }


    openCalendar() {

        this.elements.datePickerIcon()
            .click();

        this.elements.calendar()
            .should("be.visible");

    }


    selectRows(rows) {

        this.elements.rowDropdown()
            .select(rows);

    }


    selectDateRange(range) {

        this.openCalendar();

        switch (range) {

            case "Today":

                cy.contains("button", "Today")
                    .click();

                break;


            case "Yesterday":

                cy.contains("button", "Yesterday")
                    .click();

                break;


            case "Weekly":

                cy.contains("button", "Last 7 Days")
                    .click();

                break;


            case "Monthly":

                this.selectPreviousMonth();

                break;

        }

    }


    selectPreviousMonth() {

        const today = new Date();

        const start = new Date(today);

        start.setMonth(today.getMonth() - 1);

        this.elements.calendarStart()
            .find('[aria-label="Previous month"]')
            .click();

        this.elements.calendarEnd()
            .find('[aria-label="Previous month"]')
            .click();

        cy.get(
            `.rs-calendar-table-cell[title^="${this.formatDate(start)}"]`
        )
            .first()
            .click();

        cy.get(
            `.rs-calendar-table-cell[title^="${this.formatDate(today)}"]`
        )
            .last()
            .click();

        this.elements.okButton()
            .click();

    }


    clickExport() {

        this.elements.exportButton()
            .should("be.visible")
            .should("not.be.disabled")
            .click();

    }


    /*
    |--------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
    */

    clickExportIfAvailable() {

        const noTransactionsMessage =
            "No transactions found for the selected date range";

        cy.get("body", { timeout: 30000 })
            .then(($body) => {

                /*
                 * IMPORTANT:
                 * Check for the error message BEFORE clicking Export.
                 *
                 * If the application has already displayed the message,
                 * do not click Export and do not attempt to check downloads.
                 */

                if ($body.find("p").filter((_, el) =>
                    Cypress.$(el)
                        .text()
                        .trim()
                        .includes(noTransactionsMessage)
                ).length > 0) {

                    cy.log(
                        "No transactions found. Export will not be attempted."
                    );

                    return;
                }

                /*
                 * Transactions exist, so click Export.
                 */

                this.elements.exportButton()
                    .should("be.visible")
                    .should("not.be.disabled")
                    .click();

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Validations
    |--------------------------------------------------------------------------
    */

    validateNoTransactionsMessage() {

        this.elements.noTransactionsMessage()
            .should("be.visible")
            .and(
                "contain.text",
                "No transactions found for the selected date range"
            );

    }


    validateExportEnabled() {

        this.elements.exportButton()
            .should("not.be.disabled");

    }


    validateExportDisabled() {

        this.elements.exportButton()
            .should("be.disabled");

    }


    validateExportState() {

        const noTransactionsMessage =
            "No transactions found for the selected date range";

        cy.get("body", { timeout: 30000 })
            .then(($body) => {

                if ($body.text().includes(noTransactionsMessage)) {

                    this.validateNoTransactionsMessage();

                    return;

                }

                this.validateExportEnabled();

            });

    }


    validateSelectedRows(rows) {

        this.elements.rowDropdown()
            .should("have.value", rows);

    }


    validateDateSelected() {

        this.elements.dateRangeInput()
            .invoke("val")
            .should("not.equal", "");

    }


    validateDefaultColumns() {

        this.elements.selectedColumns()
            .should("have.length", 7);

    }


    /*
    |--------------------------------------------------------------------------
    | Validate Export Result
    |--------------------------------------------------------------------------
    */

    validateDownloadedFile() {

        const noTransactionsMessage =
            "No transactions found for the selected date range";

        /*
         * Wait briefly for the export API/UI response.
         * This gives the application time to render the error.
         */
        cy.wait(1000);

        /*
         * Check the DOM BEFORE calling the download task.
         */
        cy.get("body").then(($body) => {

            const errorMessage = $body
                .find("p")
                .filter((_, element) =>
                    Cypress.$(element)
                        .text()
                        .trim()
                        .includes(noTransactionsMessage)
                );


            /*
             * ERROR SCENARIO
             *
             * If the message exists:
             * - Validate it
             * - STOP
             * - NEVER call getLatestDownloadedFile
             */
            if (errorMessage.length > 0) {

                cy.log(
                    "No transactions found for the selected date range."
                );

                cy.wrap(errorMessage)
                    .should("be.visible")
                    .and(
                        "contain.text",
                        noTransactionsMessage
                    );

                return;
            }


            /*
             * SUCCESS SCENARIO
             *
             * Only call getLatestDownloadedFile when
             * there is no error message.
             */
            cy.task("getLatestDownloadedFile", null)
                .then((fileName) => {

                    expect(
                        fileName,
                        "Downloaded file name"
                    ).to.not.be.empty;

                    cy.log(
                        `Downloaded file: ${fileName}`
                    );

                    expect(
                        fileName.toLowerCase()
                    ).to.contain("transaction");

                });

        });

    }



    formatDate(date) {

        const day =
            String(date.getDate())
                .padStart(2, "0");

        const month =
            date.toLocaleString("en-US", {
                month: "short"
            });

        return `${day} ${month} ${date.getFullYear()}`;

    }

}


export default new ExportTransactionsPriPocPage();
