
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
            .should("be.visible")
            .and("have.value", "15");

        this.elements.selectedColumns()
            .should("have.length", 7);

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


    /*
    |--------------------------------------------------------------------------
    | Export row validation (6-month disbursement outline)
    |--------------------------------------------------------------------------
    */

    exportTransactionRows(rows) {

        this.validateExportModal();

        this.elements.rowDropdown()
            .select(rows);

        this.selectExportDateRange("Last 6 Months");

        this.elements.exportButton()
            .should("not.be.disabled")
            .click();

        cy.task("getLatestDownloadedFile", ".xlsx").then((filePath) => {

            if (!filePath) {
                throw new Error("No .xlsx file was downloaded after exporting transactions");
            }

            cy.wrap(filePath).as("lastExportFile");

        });

    }

    validateExportedRowCount(expectedRows) {

        const expectedCount = Number(expectedRows);

        cy.task("getLatestDownloadedFile", ".xlsx").then((filePath) => {

            if (!filePath) {
                throw new Error("No .xlsx file was downloaded after exporting transactions");
            }

            const fileName = String(filePath).split(/[\\/]/).pop();

            cy.log(`Downloaded export file: ${fileName}`);

            cy.task("parseXlsx", filePath).then((rows) => {

                expect(rows.length, "xlsx should include a header row plus data rows")
                    .to.be.greaterThan(1);

                const header = rows[0].map((cell) => cell.trim());

                const dataRows = rows
                    .slice(1)
                    .map((row) => row.map((cell) => String(cell).trim()));

                // All expected columns must be strictly present.
                this.assertAllColumnsPresent(header);

                // The exported file must never contain more rows than were
                // requested. It may contain fewer when the 6-month date range
                // has fewer transactions than the selected row count.
                expect(
                    dataRows.length,
                    `expected no more than ${expectedCount} data rows in export`
                ).to.be.at.most(expectedCount);

                cy.log(
                    `Exported ${dataRows.length} data rows (requested ${expectedCount})`
                );

                // The DATE column must never be empty and must be well-formed.
                dataRows.forEach((row, index) => {
                    const rowNumber = index + 2;

                    expect(
                        row.length,
                        `row ${rowNumber} should have ${header.length} columns`
                    ).to.equal(header.length);

                    const date = row[0].trim();

                    expect(date, `row ${rowNumber} DATE should not be empty`)
                        .to.not.be.empty;

                    expect(date, `row ${rowNumber} date format`).to.match(
                        /^\d{2} [A-Za-z]{3}, \d{4} \d{2}:\d{2}:\d{2}$/
                    );

                    // Essential columns must be populated. CREDITS is allowed
                    // to be empty because this is a disbursement export.
                    const requiredIndexes = [0, 2, 3, 4, 5, 6, 7];

                    requiredIndexes.forEach((columnIndex) => {
                        expect(
                            row[columnIndex].trim(),
                            `row ${rowNumber} column "${header[columnIndex]}" should not be empty`
                        ).to.not.be.empty;
                    });
                });

            });

        });

    }

    assertAllColumnsPresent(header) {

        const expectedHeader = [
            "DATE",
            "CREDITS",
            "DEBITS",
            "AVAILABLE BALANCE",
            "POCKET ID",
            "RECEIVER NAME",
            "PAYMENT REFERENCE",
            "STATUS"
        ];

        expectedHeader.forEach((col) => {
            expect(header, `export header should contain "${col}"`)
                .to.include(col);
        });

    }

    selectExportDateRange(period) {

        this.openCalendar();

        switch (period) {

            case "Monthly":
                this.selectExportPreviousMonth();
                break;

            case "Last 6 Months":
                this.selectExportLastSixMonths();
                break;

            default:
                cy.contains("button", period, { timeout: 10000 })
                    .should("be.visible")
                    .click();

                cy.contains("button", "OK", { timeout: 10000 })
                    .should("be.visible")
                    .click();

        }

        this.validateDateSelected();

    }

    selectExportPreviousMonth() {

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

    selectExportLastSixMonths() {

        const today = new Date();

        const start = new Date(today);

        start.setMonth(today.getMonth() - 6);

        // The start pane opens on the current month; move it back 6 months
        // so the start date cell (6 months ago) becomes visible.
        this.navigateExportCalendar("calendar-start", 6);

        // The end pane opens on the next month; move it back one month so
        // the current month (containing today) is shown on the end pane.
        this.navigateExportCalendar("calendar-end", 1);

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

    navigateExportCalendar(pane, times) {

        const paneSelector = pane === "calendar-end"
            ? '[data-testid="calendar-end"]'
            : '[data-testid="calendar-start"]';

        for (let i = 0; i < times; i++) {

            cy.get(paneSelector, { timeout: 10000 })
                .find('[aria-label="Previous month"]')
                .click();

        }

    }

}


export default new ExportTransactionsPriPocPage();
