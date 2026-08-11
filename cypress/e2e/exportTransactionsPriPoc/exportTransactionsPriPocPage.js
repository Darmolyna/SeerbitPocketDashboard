class ExportTransactionsPriPocPage {

    elements = {

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
            cy.contains("No transactions found for the selected date range"),



        transactionMenu: () => cy.contains("nav a", "Transactions"),

        disbursementMenu: () => cy.contains('button', 'Disbursement')

    }

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    clickExportTransactionsButton() {
        this.elements.exportTransactionsButton().click()
    }

    validateExportModal() {

        this.elements.modal().should("be.visible");
        this.elements.dateRangeInput().should("be.visible");
        this.elements.rowDropdown().should("be.visible");
        this.elements.exportButton().should("be.disabled");

    }

    openCalendar() {

        this.elements.datePickerIcon().click();

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

                cy.contains("button", "Today").click();
                break;


            case "Yesterday":

                cy.contains("button", "Yesterday").click();
                break;

            case "Weekly":

                cy.contains("button", "Last 7 Days").click();
                break;

            case "Monthly":

                this.selectPreviousMonth();
                break;

        }

        // this.elements.okButton()
        //     .click();

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

        //click ok button
        this.elements.okButton().click()

    }

    clickExport() {

        this.elements.exportButton()
            .click();

    }


    clickExportIfAvailable() {

        cy.get("body").then(($body) => {

            if ($body.text().includes("No transactions found for the selected date range")) {

                cy.log("No transactions available. Export skipped.");

            } else {

                this.elements.exportButton()
                    .should("be.visible")
                    .should("not.be.disabled")
                    .click();

            }

        });

    }

    validateNoTransactionsMessage() {

        this.elements.noTransactionsMessage()
            .should("be.visible")
            .and("contain.text", "No transactions found for the selected date range");

    }

    clickDisbursementMenu() {
        this.elements.transactionMenu()
            .should("be.visible", { timeout: 10000 })
            .click();

        this.elements.disbursementMenu()
            .should("be.visible", { timeout: 10000 })
            .click();
    }

    /*
    |--------------------------------------------------------------------------
    | Validations
    |--------------------------------------------------------------------------
    */

    validateExportEnabled() {

        this.elements.exportButton()
            .should("not.be.disabled");

    }

    validateExportDisabled() {

        this.elements.exportButton()
            .should("be.disabled");

    }


    validateExportState() {

        cy.get("body").then(($body) => {

            if ($body.text().includes("No transactions found for the selected date range")) {

                this.validateNoTransactionsMessage();
                this.validateExportDisabled();

            } else {

                this.validateExportEnabled();

            }

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

    validateDownloadedFile() {
        const downloadsFolder = "cypress/downloads";
        const noTransactionsMessage =
            "No transactions found for the selected date range";

        const timeout = 30000;
        const startTime = Date.now();

        const checkResult = () => {
            // 1. First check if the "No transactions" message is displayed
            return cy.get("body").then(($body) => {

                if ($body.text().includes(noTransactionsMessage)) {
                    cy.log("No transactions found for the selected date range");

                    cy.contains(noTransactionsMessage, {
                        timeout: 5000,
                    }).should("be.visible");

                    return;
                }

                // 2. Check if a file has been downloaded
                return cy.task("getLatestDownloadedFile", null).then((fileName) => {

                    if (fileName) {
                        cy.log(`Downloaded file: ${fileName}`);

                        expect(fileName, "Downloaded file name")
                            .to.not.be.empty;

                        expect(fileName.toLowerCase())
                            .to.contain("transaction");

                        cy.readFile(`${downloadsFolder}/${fileName}`, {
                            timeout: 30000,
                        }).should("exist");

                        return;
                    }

                    // 3. Neither result exists yet
                    if (Date.now() - startTime < timeout) {
                        cy.log("Waiting for download or no-transactions message...");

                        return cy.wait(1000).then(() => {
                            return checkResult();
                        });
                    }

                    // 4. Nothing happened within the timeout
                    throw new Error(
                        `Neither a transaction file nor the "${noTransactionsMessage}" message was found within ${timeout}ms`
                    );
                });
            });
        };

        checkResult();
    }

    formatDate(date) {

        const day = String(date.getDate()).padStart(2, "0");

        const month = date.toLocaleString("en-US", {
            month: "short"
        });

        return `${day} ${month} ${date.getFullYear()}`;

    }

}

export default new ExportTransactionsPriPocPage();