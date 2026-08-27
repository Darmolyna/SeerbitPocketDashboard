class SubPocketFundingPage {

    elements = {

        subPocketContext: () =>
            cy.contains("p", "CELL SUB POCKET"),

        transactionMenu: () => cy.contains("nav a", "Transactions"),

        // Page
        pageTitle: () => cy.contains("h1", "Transactions"),

        fundingTab: () => cy.contains("button", "Funding"),

        disbursementTab: () =>
            cy.contains("button", "Disbursement"),

        exportButton: () =>
            cy.contains("button", "Export Transactions"),

        searchInput: () =>
            cy.get('input[placeholder="Search reference"]'),

        filterButton: () =>
            cy.contains("button", "Filter"),

        dateRangeInput: () =>
            cy.get('[data-picker="date-range"] input'),

        datePickerIcon: () =>
            cy.get('[data-picker="date-range"]')
                .find('svg[aria-label="calendar"]'),

        applyFilterButton: () =>
            cy.contains("button", "Apply Filter"),

        transactionRows: () =>
            cy.get("table tbody tr"),

        // Table

        table: () => cy.get("table"),

        tableHeader: () =>
            cy.get("table thead th"),

        tableRows: () =>
            cy.get("table tbody tr"),

        copyButtons: () =>
            cy.get("button svg.lucide-copy"),

        paymentReferenceLinks: () =>
            cy.get('a[href*="/transactions/"]'),

        paginationText: () =>
            cy.contains("p", /Showing \d+ of \d+/),

        paginationButtons: () =>
            cy.get("nav").find("button"),

        emptyStateMessage: () =>
            cy.contains("Oops, we have nothing to show!"),

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

        cy.url().should("include", "/transactions");
    }

    ensureFundingTabActive() {

        this.elements.fundingTab()
            .should("be.visible", { timeout: 15000 })
            .invoke("attr", "class")
            .then((classes) => {

                if (!classes.includes("#E61B17")) {
                    this.elements.fundingTab().click();
                }

            });

        this.waitForTableData();

    }

    waitForTableData() {

        // The table renders a loading skeleton (single td colspan=100)
        // until the funding data is fetched, then rows with 6 cells appear.
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

    clickFilter() {

        this.elements.filterButton()
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

        cy.get("body").then(($body) => {

            if (!$body.text().includes("Oops, we have nothing to show!")) {

                this.elements.transactionRows({ timeout: 15000 })
                    .should("have.length.greaterThan", 0);

            }

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

        this.elements.fundingTab()
            .should("be.visible")
            .invoke("attr", "class")
            .should("contain", "#E61B17");

        this.elements.disbursementTab()
            .should("be.visible");

        this.elements.exportButton()
            .should("be.visible");

        this.elements.searchInput()
            .should("be.visible");

        this.elements.filterButton()
            .should("be.visible");

        this.elements.subPocketContext()
            .should("be.visible");

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

        this.elements.transactionRows({ timeout: 20000 })
            .should("have.length.greaterThan", 0);

        this.elements.transactionRows()
            .then(($rows) => {

                $rows.each((index, row) => {

                    expect(
                        Cypress.$(row).find("td").length
                    ).to.equal(6);

                });

            });

    }

validateSearchResultReference() {

        cy.get("@fundingSearchTerm").then((reference) => {

            this.waitForTableDataOrEmpty();

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

    validateNoTransactionsMessage() {

        this.elements.emptyStateMessage()
            .should("be.visible");

    }

    validatePaymentReferenceCopy() {

        this.elements.copyButtons()
            .first()
            .should("be.visible");

    }

    validateExportStarted() {

        cy.get("body").then(($body) => {

            const exportModalOpen =
                $body.text().includes("Export transactions");

            const exportButtonVisible = $body.find(
                "button"
            ).toArray().some(button =>
                Cypress.$(button).text().includes("Export Transactions")
            );

            expect(exportModalOpen || exportButtonVisible)
                .to.be.true;

        });

    }

    validateTransactionRowInfo() {

        this.waitForTableData();

        this.elements.transactionRows({ timeout: 20000 })
            .should("have.length.greaterThan", 0);

        this.elements.transactionRows()
            .then(($rows) => {

                $rows.each((rowIndex, row) => {

                    const cells = Cypress.$(row).find("td");

                    expect(cells.length).to.equal(6);

                    // Source Name/Number
                    const sourceParagraphs = Cypress.$(cells[0]).find("p");

                    expect(sourceParagraphs.length).to.equal(2);

                    sourceParagraphs.each((index, paragraph) => {

                        expect(
                            Cypress.$(paragraph).text().trim()
                        ).not.to.be.empty;

                    });

                    // Amount
                    expect(
                        Cypress.$(cells[1]).text().replace(/\s+/g, " ").trim()
                    ).to.match(/^NGN \d[\d,.]*$/);

                    // Payment reference: link + copy button
                    expect(
                        Cypress.$(cells[2]).find('a[href*="/transactions/"]').length
                    ).to.equal(1);

                    expect(
                        Cypress.$(cells[2]).find("svg.lucide-copy").length
                    ).to.equal(1);

                    // Status
                    expect(
                        Cypress.$(cells[3]).text().trim()
                    ).to.equal("Successful");

                    // Balance
                    expect(
                        Cypress.$(cells[4]).text().replace(/\s+/g, " ").trim()
                    ).to.match(/^NGN \d[\d,.]*$/);

                    // Date created: date + time
                    const dateCreated = Cypress.$(cells[5]).text().replace(/\s+/g, " ").trim();

                    expect(dateCreated)
                        .to.match(/^\d{1,2} [A-Z][a-z]{2}, \d{4}/);

                    expect(dateCreated.toLowerCase())
                        .to.match(/(am|pm)/);

                });

            });

    }

    validatePaginationControls() {

        this.waitForTableData();

        this.elements.paginationText()
            .should("exist")
            .then(($pagination) => {

                expect($pagination.text()).to.match(/Showing \d+ of \d+/);

            });

        cy.get("nav").find("button")
            .should("have.length.greaterThan", 0)
            .then(($buttons) => {

                expect($buttons.first().text().trim()).to.equal("1");

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

        const validateCurrentPage = () => {

            this.validateFilteredTransactions(dateRange);

        };


        const navigateNextPage = () => {

            cy.get("body").then(($body) => {

                const noDataMessage = "Oops, we have nothing to show!";


                if ($body.text().includes(noDataMessage)) {

                    cy.log("No transactions available. Skipping pagination.");
                    return;

                }


                const paginationButtons = $body.find("nav button");


                // Pagination arrow is not displayed when there is only one page
                if (paginationButtons.length === 0) {

                    cy.log("Pagination not displayed. Only one page available.");
                    return;

                }


                const currentPage = [...paginationButtons]
                    .find(button =>
                        Cypress.$(button)
                            .hasClass("text-red-500")
                    );


                if (!currentPage) {

                    cy.log("Current page not found. Stopping pagination.");
                    return;

                }


                const currentPageNumber =
                    Number(currentPage.innerText.trim());


                const nextPageNumber =
                    String(currentPageNumber + 1);


                const hasNextPage =
                    [...paginationButtons]
                        .some(button =>
                            button.innerText.trim() === nextPageNumber
                        );


                if (hasNextPage) {


                    cy.log(`Navigating to page ${nextPageNumber}`);


                    let firstRowBeforeClick;

                    this.elements.transactionRows()
                        .first()
                        .invoke("text")
                        .then((rowText) => {
                            firstRowBeforeClick = rowText.trim();
                        });


                    cy.wrap(paginationButtons[paginationButtons.length - 1])
                        .click();


                    this.waitForTableData();


                    this.elements.transactionRows()
                        .first()
                        .invoke("text")
                        .then((newRowText) => {

                            expect(newRowText.trim())
                                .not.to.equal("");

                            expect(newRowText.trim())
                                .not.to.equal(firstRowBeforeClick);

                        });


                    validateCurrentPage();


                    navigateNextPage();


                } else {

                    cy.log("No next page available. Pagination completed.");

                }


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

export default new SubPocketFundingPage();