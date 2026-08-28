function parseAmount(value) {
    return parseFloat(String(value).replace(/,/g, ""));
}

class PrimaryPocketFundingPage {

    elements = {

        transactionMenu: () => cy.contains("nav a", "Transactions"),

        // Page
        pageTitle: () => cy.contains("h1", "Transactions"),

        fundingTab: () => cy.contains("button", "Funding"),

        exportButton: () => cy.contains("button", "Export Transactions"),

        searchInput: () =>
            cy.get('input[placeholder="Search reference"]'),

        filterButton: () =>
            cy.contains('button[data-slot="trigger"]', "Filter"),

        filterSearchInput: () =>
            cy.get('input[placeholder="Search"]'),

        resetButton: () =>
            cy.contains("button", "Reset"),

        emptyStateMessage: () =>
            cy.contains("Oops, we have nothing to show!"),

        dateRangeInput: () =>
            cy.get('[data-picker="date-range"] input'),

        datePickerIcon: () =>
            cy.get('[data-picker="date-range"]')
                .find('svg[aria-label="calendar"]'),

        applyFilterButton: () =>
            cy.contains("button", "Apply Filter"),

        exportModal: () =>
            cy.contains("h2", "Export transactions"),

        exportDateRangeIcon: () =>
            cy.get('[data-picker="date-range"] svg[aria-label="calendar"]'),

        exportRowsSelect: () =>
            cy.get("select"),

        exportColumnButtons: () =>
            cy.get(".grid button"),

        exportModalExportButton: () =>
            cy.contains("button", /^Export$/),

        transactionRows: () =>
            cy.get("table tbody tr"),

        // Table

        table: () => cy.get("table"),

        tableHeader: () =>
            cy.get("table thead th"),

        tableRows: () =>
            cy.get("table tbody tr"),

        copyButtons: () =>
            cy.get("button").find("svg.lucide-copy"),

        paymentReferenceLinks: () =>
            cy.get('a[href*="/transactions/"]'),

        nextPageButton: () =>
            cy.get("nav")
                .find("button")
                .last(),

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
    searchPocketId(pocketId) {

        // Pocket ID search now happens through the filter modal:
        // click Filter, type the pocket ID, then Apply Filter.
        this.elements.filterButton()
            .click();

        this.elements.filterSearchInput()
            .clear()
            .type(pocketId, { delay: 0 });

        this.clickApplyFilter();

    }

    clickFilter() {

        this.elements.filterButton()
            .click();

    }

    clickReset() {

        this.elements.resetButton()
            .click();

    }

    clickExport() {

        this.elements.exportButton()
            .click();

    }

    clickFirstCopyButton() {

        this.elements.copyButtons()
            .first()
            .click({ force: true });

    }

    selectDateRange(dateRange) {

        // No date selection required
        if (dateRange === "No Filter" || dateRange === "Empty Result") {
            cy.log(`Skipping date selection for: ${dateRange}`);
            return;
        }

        const today = new Date();

        let startDate;
        let endDate;

        this.elements.datePickerIcon()
            .should("be.visible")
            .click();

        cy.get(".rs-calendar-table")
            .should("be.visible");

        switch (dateRange) {

            case "Last 1 Day":

                startDate = new Date(today);
                startDate.setDate(today.getDate() - 1);

                break;

            case "Last 7 Days":

                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);

                break;

            case "Last 1 Month":

                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 1);

                cy.get('[data-testid="calendar-start"]')
                    .find('[aria-label="Previous month"]')
                    .click();

                cy.get('[data-testid="calendar-end"]')
                    .find('[aria-label="Previous month"]')
                    .click();

                break;

            case "Future Date":

                startDate = new Date(today);
                startDate.setDate(today.getDate() + 7);

                endDate = new Date(today);
                endDate.setDate(today.getDate() + 14);

                break;

            default:

                throw new Error(`Unsupported date range: ${dateRange}`);

        }

        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate || today);

        cy.log(`Selecting start date: ${formattedStartDate}`);
        cy.log(`Selecting end date: ${formattedEndDate}`);

        cy.get(`.rs-calendar-table-cell[title^="${formattedStartDate}"]`)
            .should("exist")
            .first()
            .click();

        cy.get(`.rs-calendar-table-cell[title^="${formattedEndDate}"]`)
            .should("exist")
            .last()
            .click();

        cy.contains("button", "OK")
            .should("be.visible")
            .click();

        this.elements.dateRangeInput()
            .should(($input) => {
                expect($input.val()).to.not.equal("");
            });

    }

    formatDate(date) {

        const day = String(date.getDate()).padStart(2, "0");

        const month = date.toLocaleString("en-US", {
            month: "short"
        });

        const year = date.getFullYear();

        return `${day} ${month} ${year}`;

    }


    clickApplyFilter() {

        this.elements.applyFilterButton()
            .should("be.visible")
            .click();

        // The table either reloads data (6 cells per row) or shows the
        // "Oops, we have nothing to show!" empty state (single colspan td).
        this.waitForTableDataOrEmpty();

    }


    /*

    |--------------------------------------------------------------------------
    | Payment reference search (top "Search reference" input)
    |--------------------------------------------------------------------------
    */

    captureFirstPaymentReference() {

        this.elements.paymentReferenceLinks()
            .first()
            .invoke("text")
            .then((text) => {

                const reference = text.trim().split("...")[0];

                expect(reference).not.to.be.empty;

                cy.wrap(reference).as("fundingSearchTerm");

                cy.log(`Searching for payment reference: ${reference}`);

                this.elements.searchInput()
                    .clear()
                    .type(reference);

            });

    }

    searchPaymentReference(reference) {

        this.elements.searchInput()
            .clear()
            .type(reference);

    }

    waitForTableData() {

        // The table renders a loading skeleton (single td colspan=100)
        // until the data is fetched, then rows with 6 cells appear.
        cy.get("table tbody tr td", { timeout: 20000 })
            .should("have.length.at.least", 6);

    }

    waitForTableDataOrEmpty() {

        // After a search/filter, the table either reloads its data
        // (rows with 6 cells) or shows the empty state message.
        cy.get("body", { timeout: 20000 }).should(($body) => {

            const hasEmptyState = $body.text()
                .includes("Oops, we have nothing to show!");

            const hasData = Cypress.$("table tbody tr td").length >= 6;

            expect(hasEmptyState || hasData).to.be.true;

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Validations
    |--------------------------------------------------------------------------
    */

    validateFundingPage() {

        this.elements.pageTitle()
            .should("be.visible");

        // this.elements.fundingTab()
        //     .should("have.class", "border-[#E61B17]");

        // this.elements.exportButton()
        //     .should("be.visible");

        // this.elements.searchInput()
        //     .should("be.visible");

        // this.elements.filterButton()
        //     .should("be.visible");

    }

    validateSearchResults(result, searchText) {

        const emptyMessage = "Oops, we have nothing to show!";

        this.waitForTableDataOrEmpty();

        // Filtering by pocket ID is reflected in the URL query string.
        cy.url().should("include", `funding_pocketId=${searchText}`);

        cy.get("body").then(($body) => {

            if (result === "no transactions") {

                expect($body.text()).to.include(emptyMessage);

                this.elements.emptyStateMessage()
                    .should("be.visible");

                return;

            }

            expect($body.text()).not.to.include(emptyMessage);

            // Loop through every page of results and validate each row.
            // NOTE: source name is not asserted yet after pocket ID filter.
            this.loopAllPages(() => {
                this.validateSearchResultRows();
            });

        });

    }

    validateSearchResultRows() {

        this.elements.transactionRows()
            .should("have.length.greaterThan", 0);

        this.elements.transactionRows()
            .then(($rows) => {

                $rows.each((index, row) => {

                    const $row = Cypress.$(row);

                    const cells = $row.find("td");

                    expect(cells.length).to.equal(6);

                    // Amount, payment reference, Status, balance, date created
                    // must all be populated. Source name is intentionally not
                    // asserted after a pocket ID filter.
                    expect(cells.eq(1).text().trim()).not.to.equal("");
                    expect(cells.eq(2).text().trim()).not.to.equal("");
                    expect(cells.eq(3).text().trim()).not.to.equal("");
                    expect(cells.eq(4).text().trim()).not.to.equal("");
                    expect(cells.eq(5).text().trim()).not.to.equal("");

                    expect($row.find('a[href*="/transactions/"]').length)
                        .to.be.at.least(1);

                });

            });

    }

    validateTransactionTable() {

        this.waitForTableData();

        const headers = [

            "Source Name/Number",
            "Amount",
            "payment reference",
            "Status",
            "balance",
            "date created"

        ];

        cy.get("table thead th")
            .should("have.length", headers.length)
            .then(($headers) => {

                $headers.each((index, header) => {

                    expect(
                        Cypress.$(header).text().trim().toLowerCase()
                    ).to.equal(headers[index].toLowerCase());

                });

            });

        this.elements.tableRows()
            .should("have.length.greaterThan", 0);

        this.elements.tableRows()
            .then(($rows) => {

                $rows.each((index, row) => {

                    expect(
                        Cypress.$(row).find("td").length
                    ).to.equal(6);

                });

            });

    }

    validatePaymentReferenceResults() {

        cy.get("@fundingSearchTerm").then((reference) => {

            this.waitForTableDataOrEmpty();

            // Searching by payment reference is reflected in the URL.
            cy.url().should("include", `funding_reference=${reference}`);

            cy.get("body").then(($body) => {

                const emptyMessage = "Oops, we have nothing to show!";

                if ($body.text().includes(emptyMessage)) {

                    throw new Error(
                        `Search for existing reference "${reference}" returned no transactions`
                    );

                }

                this.elements.transactionRows()
                    .then(($rows) => {

                        $rows.each((index, row) => {

                            expect(
                                Cypress.$(row).text()
                            ).to.contain(reference);

                        });

                    });

            });

        });

    }

    validatePaymentReferenceCopy() {

        this.elements.copyButtons()
            .first()
            .should("be.visible");

    }

    validateExportStarted() {

        this.validateExportModal();

        // "Monthly" (previous month) is the only preset range with data
        // in the current dataset, so it produces an actual download.
        this.selectExportDateRange("Monthly");

        this.validateExportButtonEnabled();

        this.elements.exportModalExportButton()
            .click();

        this.validateDownloadedFile();

    }

    validateExportModal() {

        this.elements.exportModal()
            .should("be.visible", { timeout: 10000 });

        this.elements.exportDateRangeIcon()
            .should("be.visible");

        this.elements.exportRowsSelect()
            .should("be.visible")
            .and("have.value", "15");

        this.elements.exportColumnButtons()
            .should("have.length", 7);

        this.elements.exportModalExportButton()
            .should("be.disabled");

    }

    selectExportDateRange(period) {

        this.elements.exportDateRangeIcon()
            .should("be.visible")
            .click();

        switch (period) {

            case "Monthly":

                this.selectExportPreviousMonth();
                break;

            default:

                cy.contains("button", period, { timeout: 10000 })
                    .should("be.visible")
                    .click();

                // Close the calendar so it no longer overlays the Export button.
                cy.contains("button", "OK", { timeout: 10000 })
                    .should("be.visible")
                    .click();

        }

        this.elements.dateRangeInput()
            .should(($input) => {
                expect($input.val()).to.not.equal("");
            });

    }

    selectExportPreviousMonth() {

        const today = new Date();

        const start = new Date(today);

        start.setMonth(today.getMonth() - 1);

        cy.get('[data-testid="calendar-start"]', { timeout: 10000 })
            .find('[aria-label="Previous month"]')
            .click();

        cy.get('[data-testid="calendar-end"]', { timeout: 10000 })
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

        // Close the calendar so it no longer overlays the Export button.
        cy.contains("button", "OK", { timeout: 10000 })
            .should("be.visible")
            .click();

    }

    formatDate(date) {

        const day = String(date.getDate()).padStart(2, "0");

        const month = date.toLocaleString("en-US", {
            month: "short"
        });

        return `${day} ${month} ${date.getFullYear()}`;

    }

    validateExportButtonEnabled() {

        this.elements.exportModalExportButton()
            .should("not.be.disabled");

    }

    validateDownloadedFile() {

        const expectedHeader = [
            "DATE",
            "CREDITS",
            "DEBITS",
            "AVAILABLE BALANCE",
            "POCKET ID",
            "SOURCE NAME",
            "PAYMENT REFERENCE",
            "STATUS"
        ];

        cy.task("getLatestDownloadedFile", ".xlsx").then((filePath) => {

            if (!filePath) {
                throw new Error("No .xlsx file was downloaded after exporting transactions");
            }

            const fileName = String(filePath).split(/[\\/]/).pop();

            cy.log(`Downloaded export file: ${fileName}`);

            expect(fileName.toLowerCase(), "exported file name").to.contain("transaction");

            cy.task("parseXlsx", filePath).then((rows) => {

                expect(rows.length, "xlsx should include a header row plus data rows")
                    .to.be.greaterThan(1);

                const header = rows[0].map((cell) => cell.trim());

                expect(header, "export header row").to.deep.equal(expectedHeader);

                const dataRows = rows.slice(1);

                cy.log(`Exported ${dataRows.length} transaction row(s)`);

                // Validate every data row: correct column count, no empty cells,
                // and well-formed values in each column.
                dataRows.forEach((row, index) => {
                    const rowNumber = index + 2;

                    expect(
                        row.length,
                        `row ${rowNumber} should have ${header.length} columns`
                    ).to.equal(header.length);

                    row.forEach((cell, columnIndex) => {
                        expect(
                            cell.trim(),
                            `row ${rowNumber} column "${header[columnIndex]}" should not be empty`
                        ).to.not.be.empty;
                    });

                    const date = row[0].trim();
                    const credits = row[1].trim();
                    const debits = row[2].trim();
                    const availableBalance = row[3].trim();
                    const pocketId = row[4].trim();
                    const paymentReference = row[6].trim();
                    const status = row[7].trim();

                    expect(date, `row ${rowNumber} date format`).to.match(
                        /^\d{2} [A-Za-z]{3}, \d{4} \d{2}:\d{2}:\d{2}$/
                    );

                    for (const [amount, label] of [
                        [parseAmount(credits), `row ${rowNumber} CREDITS`],
                        [parseAmount(debits), `row ${rowNumber} DEBITS`],
                        [parseAmount(availableBalance), `row ${rowNumber} AVAILABLE BALANCE`],
                    ]) {
                        expect(isFinite(amount), `${label} should be a valid amount`).to.be.true;
                    }

                    expect(pocketId, `row ${rowNumber} pocket ID format`).to.match(
                        /^SBP\d+$/
                    );

                    expect(paymentReference, `row ${rowNumber} payment reference`).to.not.be.empty;

                    expect(
                        ["Successful", "Failed", "Pending", "In Progress"],
                        `row ${rowNumber} status value`
                    ).to.include(status);
                });

                const allPocketIds = new Set(dataRows.map((row) => row[4].trim()));

                expect(
                    allPocketIds.size,
                    "all exported rows should belong to a single pocket"
                ).to.equal(1);
            });
        });

    }

    validateFilteredTransactions(dateRange) {

        const noDataMessage = "Oops, we have nothing to show!";

        const today = new Date();


        let startDate;
        let endDate;

        switch (dateRange) {

            case "No Filter":

                cy.log("Validating transactions without date filter.");

                this.elements.transactionRows()
                    .should("have.length.greaterThan", 0);

                return;

            case "Empty Result":

                cy.contains(noDataMessage)
                    .should("be.visible");

                return;

            case "Last 1 Day":

                startDate = new Date(today);
                startDate.setDate(today.getDate() - 1);

                break;

            case "Last 7 Days":

                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);

                break;

            case "Last 1 Month":

                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 1);

                break;

            case "Future Date":

                startDate = new Date(today);
                startDate.setDate(today.getDate() + 7);

                endDate = new Date(today);
                endDate.setDate(today.getDate() + 14);

                break;

            default:

                throw new Error(`Unsupported date range: ${dateRange}`);

        }

        endDate = endDate || new Date(today);

        // Normalize the comparison range
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        cy.log(`Filter: ${dateRange}`);
        cy.log(`Start Date: ${startDate}`);
        cy.log(`End Date: ${endDate}`);

        this.waitForTableDataOrEmpty();

        cy.get("body").then(($body) => {

            if ($body.text().includes(noDataMessage)) {

                cy.contains(noDataMessage)
                    .should("be.visible");

                return;

            }

            this.getDateCreatedColumnIndex()
                .then((dateColumn) => {

                    this.elements.transactionRows()
                        .should("exist");

                    this.elements.transactionRows()
                        .then(($rows) => {

                            $rows.each((index, row) => {

                                cy.log(`Validating transaction row ${index + 1}`);

                                const dateText = Cypress.$(row)
                                    .find("td")
                                    .eq(dateColumn)
                                    .text()
                                    .trim();

                                const transactionDate =
                                    this.parseTransactionDate(dateText);

                                transactionDate.setHours(0, 0, 0, 0);

                                expect(transactionDate.toString())
                                    .not.to.equal("Invalid Date");

                                cy.log(`Transaction Date: ${transactionDate}`);

                                expect(transactionDate.getTime())
                                    .to.be.at.least(startDate.getTime());

                                expect(transactionDate.getTime())
                                    .to.be.at.most(endDate.getTime());

                            });

                        });

                });

        });

    }

    validateAllTransactionPages(dateRange) {

        this.loopAllPages(() => {

            this.validateFilteredTransactions(dateRange);

        });

    }

    loopAllPages(pageValidator) {

        const validateCurrentPage = () => {
            pageValidator();
        };

        const navigateNextPage = () => {

            cy.get("body").then(($body) => {

                const noDataMessage = "Oops, we have nothing to show!";

                if ($body.text().includes(noDataMessage)) {
                    cy.log("No transactions available. Skipping pagination.");
                    return;
                }

                const paginationButtons = $body.find("nav button");

                // Pagination is not displayed when there is only one page
                if (paginationButtons.length === 0) {
                    cy.log("Pagination not displayed. Only one page available.");
                    return;
                }

                const currentPageButton = [...paginationButtons]
                    .find(button =>
                        Cypress.$(button).hasClass("text-red-500")
                    );

                if (!currentPageButton) {
                    cy.log("Current page not found. Stopping pagination.");
                    return;
                }

                const currentPageNumber =
                    Number(currentPageButton.innerText.trim());

                const showingMatch =
                    $body.text().match(/Showing \d+ of (\d+)/);

                if (!showingMatch) {
                    cy.log("Total result count not found. Stopping pagination.");
                    return;
                }

                const totalPages =
                    Math.ceil(Number(showingMatch[1]) / 10);

                if (currentPageNumber >= totalPages) {
                    cy.log("All pages validated. Pagination completed.");
                    return;
                }

                cy.log(`Validating page ${currentPageNumber} of ${totalPages}`);

                const lastButton =
                    paginationButtons[paginationButtons.length - 1];

                const lastButtonText =
                    Cypress.$(lastButton).text().trim();

                // The "next" arrow is the last nav button with an icon and
                // no visible text. When it is absent the current page is the
                // last page of results, so pagination is complete.
                const hasNextArrow =
                    lastButton.querySelector("svg") &&
                    lastButtonText === "";

                if (!hasNextArrow || currentPageNumber >= totalPages) {
                    cy.log("Reached the last page. Pagination completed.");
                    return;
                }

                let firstRowBeforeClick;

                this.elements.transactionRows()
                    .first()
                    .invoke("text")
                    .then((rowText) => {
                        firstRowBeforeClick = rowText.trim();
                    });

                // The pagination sits below the fold; scroll before clicking.
                cy.wrap(lastButton)
                    .scrollIntoView()
                    .click();

                // Wait for the table to swap in the new page's rows.
                // Using a retrying assertion covers the fetch/swap delay.
                this.elements.transactionRows()
                    .first()
                    .invoke("text")
                    .should((text) => {

                        const newRowText = String(text).trim();

                        expect(newRowText).not.to.equal("");
                        expect(newRowText).not.to.equal(firstRowBeforeClick);

                    });

                validateCurrentPage();

                navigateNextPage();

            });

        };

        validateCurrentPage();

        navigateNextPage();

    }

    parseTransactionDate(dateText) {

        // Remove time part
        const cleanedText = dateText
            .replace(/\d{1,2}:\d{2}\s?(am|pm)/i, "")
            .trim();


        // Example: 15 Jul, 2026
        if (cleanedText.includes(",")) {

            const [day, month, year] =
                cleanedText.replace(",", "").split(" ");


            return new Date(
                Number(year),
                this.getMonthNumber(month),
                Number(day)
            );

        }


        // Example: 15/07/2026
        if (cleanedText.includes("/")) {

            const [day, month, year] =
                cleanedText.split("/");


            return new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

        }


        return new Date(cleanedText);

    }


    getMonthNumber(month) {

        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };


        return months[month];

    }

    getDateCreatedColumnIndex() {

        return cy.get("table thead th")
            .then(($headers) => {

                let dateColumnIndex;

                $headers.each((index, header) => {

                    const headerText = Cypress.$(header)
                        .text()
                        .trim()
                        .toLowerCase();


                    if (headerText === "date created") {
                        dateColumnIndex = index;
                    }

                });


                expect(dateColumnIndex)
                    .not.to.be.undefined;


                return dateColumnIndex;

            });

    }

}

export default new PrimaryPocketFundingPage();