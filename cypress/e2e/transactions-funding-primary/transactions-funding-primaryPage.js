class PrimaryPocketFundingPage {

    elements = {

        transactionMenu: () => cy.contains("nav a", "Transactions"),

        // Page
        pageTitle: () => cy.contains("h1", "Transactions"),

        fundingTab: () => cy.contains("button", "Funding"),

        exportButton: () => cy.contains("button", "Export Transactions"),

        searchInput: () =>
            cy.get('input[placeholder="Search pocket ID"]'),

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
            .should("be.visible", { timeout: 10000 })
            .click();
    }
    searchPocketId(pocketId) {

        this.elements.searchInput()
            .clear()
            .type(pocketId);

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


        cy.wait(5000)

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

    validateSearchResults(searchText) {

        cy.get("body").then(($body) => {

            const emptyMessage = "Oops, we have nothing to show!";

            if ($body.text().includes(emptyMessage)) {

                this.elements.emptyStateMessage()
                    .should("be.visible");

            } else {

                this.elements.tableRows()
                    .should("have.length.greaterThan", 0)
                    .each(($row) => {

                        cy.wrap($row)
                            .should("contain.text", searchText);

                    });

            }

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
        today.setHours(23, 59, 59, 999);

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

        endDate = endDate || today;

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


                    const firstRowBeforeClick = this.elements.transactionRows()
                        .first()
                        .invoke("text");


                    cy.wrap(paginationButtons[paginationButtons.length - 1])
                        .click();


                    cy.wait(3000);


                    this.elements.transactionRows()
                        .should("have.length.greaterThan", 0)
                        .each(($row) => {

                            cy.wrap($row)
                                .find("td")
                                .should("have.length", 6);

                        });


                    this.elements.transactionRows()
                        .first()
                        .invoke("text")
                        .should((newRowText) => {

                            expect(newRowText.trim())
                                .not.to.equal("");

                            expect(newRowText)
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

export default new PrimaryPocketFundingPage();
