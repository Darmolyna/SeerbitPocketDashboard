class PrimaryPocketDisbursementPage {

    /*
        |--------------------------------------------------------------------------
        | Elements
        |--------------------------------------------------------------------------
        */

    elements = {
        transactionMenu: () => cy.contains("nav a", "Transactions"),

        disbursementMenu: () => cy.contains('button', 'Disbursement'),

        // Page
        pageTitle: () => cy.contains("h1", "Transactions"),

        fundingTab: () => cy.contains("button", "Funding"),

        exportButton: () => cy.contains("button", "Export Transactions"),

        searchInput: () =>
            cy.get('input[placeholder="Search reference"]'),

        filterButton: () =>
            cy.contains("div", "Filter"),

        filterSearchInput: () =>
            cy.get('input[placeholder="Search"]'),

        emptyStateMessage: () =>
            cy.contains("Oops, we have nothing to show!"),

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
            cy.get("button").find("svg.lucide-copy"),

        paymentReferenceLinks: () =>
            cy.get('a[href*="/transactions/"]'),

        nextPageButton: () =>
            cy.get("nav")
                .find("button")
                .last(),

    }



    /*
        |--------------------------------------------------------------------------
        | Actions
        |--------------------------------------------------------------------------
        */

    clickDisbursementMenu() {
        this.elements.transactionMenu()
            .should("be.visible", { timeout: 10000 })
            .click();

        this.elements.disbursementMenu()
            .should("be.visible", { timeout: 10000 })
            .click();
    }

    clickTransactionMenu() {
        this.elements.transactionMenu()
            .should("be.visible", { timeout: 10000 })
            .click();
    }
    searchPocketId(pocketId) {

        // Pocket ID search happens through the filter modal:
        // click Filter, type the pocket ID into the "Search" input,
        // then Apply Filter.
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

    searchPaymentReference(reference) {

        this.elements.searchInput()
            .clear()
            .type(reference, { delay: 0 })
            .type("{enter}");

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

        // The table either reloads data (rows with 6 cells) or shows the
        // "Oops, we have nothing to show!" empty state (single colspan td).
        cy.get("body", { timeout: 20000 }).should(($body) => {

            const hasEmptyState = $body.text()
                .includes("Oops, we have nothing to show!");

            const hasData = Cypress.$("table tbody tr td").length >= 6;

            expect(hasEmptyState || hasData).to.be.true;

        });

    }

    loopAllPages(callback) {

        const visitPage = () => {

            callback();

            cy.get("body").then(($body) => {

                // Check for the "Showing X of Y" indicator — if only
                // one page, "Showing" text is absent or X === Y.
                const showingMatch = $body
                    .text()
                    .match(/Showing\s+\d+\s+of\s+(\d+)/);

                if (!showingMatch) {

                    cy.log("No pagination indicator — single page of results.");

                    return;

                }

                const total = Number(showingMatch[1]);

                if (total <= 10) {

                    cy.log(`Total results ${total} fit on one page.`);

                    return;

                }

                // The next-page arrow button contains an SVG with class
                // lucide-arrow-right. If it is missing, there is only one
                // page of data.
                const $nextBtn = $body
                    .find("svg.lucide-arrow-right")
                    .first()
                    .closest("button");

                if ($nextBtn.length === 0) {

                    cy.log("No next-page arrow — single page of results.");

                    return;

                }

                cy.wrap($nextBtn)
                    .scrollIntoView()
                    .click({ force: true });

                cy.contains("td", /^(NGN|₦)/, { timeout: 15000 })
                    .should("be.visible")
                    .first();

                visitPage();

            });

        };

        visitPage();

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

        // Wait for either the empty state or the table data to render.
        cy.get("body", { timeout: 20000 }).should(($body) => {

            const hasEmptyState = $body.text().includes(emptyMessage);

            const hasData = Cypress.$("table tbody tr td").length >= 6;

            expect(hasEmptyState || hasData).to.be.true;

        });

        // Filtering by pocket ID is reflected in the URL query string.
        cy.url().should("include", `disbursement_pocketId=${searchText}`);

        cy.get("body").then(($body) => {

            if (result === "no transactions") {

                expect($body.text()).to.include(emptyMessage);

                this.elements.emptyStateMessage()
                    .should("be.visible");

                return;

            }

            expect($body.text()).not.to.include(emptyMessage);

            // Table has data — pagination controls live in the same
            // container (div.flex.justify-between), not directly in nav.
            this.loopAllPages(() => {

                this.elements.tableRows()
                    .should("have.length.greaterThan", 0);

            });

        });

    }

    validatePaymentReferenceResults(reference) {

        // Searching by payment reference reflects in the URL query string.
        cy.url().should("include", `disbursement_reference=${reference}`);

        const emptyMessage = "Oops, we have nothing to show!";

        // A non-existent reference (e.g. 9999999999) yields no rows.
        cy.get("body", { timeout: 20000 }).should(($body) => {

            const hasEmptyState = $body.text().includes(emptyMessage);

            const hasData = Cypress.$("table tbody tr td").length >= 6;

            expect(hasEmptyState || hasData).to.be.true;

        });

        cy.get("body").then(($body) => {

            if ($body.text().includes(emptyMessage)) {

                this.elements.emptyStateMessage()
                    .should("be.visible");

                return;

            }

            // Validate every page of returned rows contains the reference.
            this.loopAllPages(() => {

                cy.get("tbody tr a[href*='/transactions/']")
                    .should("have.length.greaterThan", 0)
                    .each(($link) => {

                        expect(Cypress.$( $link ).attr("href"))
                            .to.include(reference);

                    });

            });

        });

    }

    validateTransactionTable() {

        const headers = [

            "Source Name/Number",
            "Amount",
            "payment reference",
            "Status",
            "balance",
            "date created"

        ];

        this.elements.tableHeader()
            .should("have.length", headers.length)
            .each(($header, index) => {

                cy.wrap($header)
                    .invoke("text")
                    .then(text => {

                        expect(text.trim().toLowerCase())
                            .to.equal(headers[index].toLowerCase());

                    });

            });

        this.elements.tableRows()
            .should("have.length.greaterThan", 0)
            .each(($row) => {

                cy.wrap($row)
                    .find("td")
                    .should("have.length", 6);

            });

    }

    validatePaymentReferenceCopy() {

        this.elements.copyButtons()
            .first()
            .should("be.visible");

    }

    validateExportStarted() {

        this.elements.exportButton()
            .should("exist");

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

        cy.get("body").then(($body) => {

            if ($body.text().includes(noDataMessage)) {

                cy.contains(noDataMessage)
                    .should("be.visible");

                return;

            }

            this.getDateCreatedColumnIndex()
                .then((dateColumn) => {

                    this.elements.transactionRows()
                        .should("exist")
                        .each(($row, index) => {

                            cy.log(`Validating transaction row ${index + 1}`);

                            const dateText = Cypress.$($row)
                                .find("td")
                                .eq(dateColumn)
                                .find("div")
                                .first()
                                .clone()
                                .children()
                                .remove()
                                .end()
                                .text()
                                .trim();


                            cy.log(`Date from table: ${dateText}`);


                            const transactionDate =
                                this.parseTransactionDate(dateText);


                            cy.log(`Parsed date: ${transactionDate}`);


                            transactionDate.setHours(0, 0, 0, 0);


                            expect(transactionDate.toString())
                                .not.to.equal("Invalid Date");


                            expect(transactionDate.getTime())
                                .to.be.at.least(startDate.getTime());


                            expect(transactionDate.getTime())
                                .to.be.at.most(endDate.getTime());


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

                // Only paginate when the data spans more than one page.
                const showingMatch = $body
                    .text()
                    .match(/Showing\s+\d+\s+of\s+(\d+)/);

                if (!showingMatch || Number(showingMatch[1]) <= 10) {

                    cy.log("Pagination not displayed. Only one page available.");

                    return;

                }

                // The next-page arrow button contains an SVG with class
                // lucide-arrow-right. If missing, we are on the last page.
                const $nextBtn = $body
                    .find("svg.lucide-arrow-right")
                    .first()
                    .closest("button");

                if ($nextBtn.length === 0) {

                    cy.log("No next-page arrow. Pagination completed.");

                    return;

                }

                cy.wrap($nextBtn)
                    .scrollIntoView()
                    .click({ force: true });

                // Wait for fresh data to render (a currency amount cell).
                cy.contains("td", /^(NGN|₦)/, { timeout: 15000 })
                    .should("be.visible")
                    .first();

                validateCurrentPage();

                navigateNextPage();

            });

        };

        validateCurrentPage();

        navigateNextPage();

    }

    parseTransactionDate(dateText) {

        if (!dateText) {
            return new Date("Invalid Date");
        }

        // Remove time part (example: 10:37 am)
        const cleanedText = dateText
            .replace(/\d{1,2}:\d{2}\s?(am|pm)/i, "")
            .replace(/\s+/g, " ")
            .trim();


        // Format: 31 Jul, 2026
        if (cleanedText.includes(",")) {

            const [day, month, year] =
                cleanedText
                    .replace(",", "")
                    .split(" ");


            return new Date(
                Number(year),
                this.getMonthNumber(month),
                Number(day)
            );

        }


        // Format: 31 Jul 2026 (without comma)
        const dateParts = cleanedText.split(" ");

        if (dateParts.length === 3 && this.getMonthNumber(dateParts[1]) !== undefined) {

            const [day, month, year] = dateParts;


            return new Date(
                Number(year),
                this.getMonthNumber(month),
                Number(day)
            );

        }


        // Format: 31/07/2026
        if (cleanedText.includes("/")) {

            const [day, month, year] =
                cleanedText.split("/");


            return new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

        }


        // Fallback
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

export default new PrimaryPocketDisbursementPage();