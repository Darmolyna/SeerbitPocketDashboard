class PrimaryPocketDashboardPage {

    // ============================
    // Elements
    // ============================

    elements = {
        //Blanace card
        dashboardTitle: () => cy.contains("Dashboard"),

        primaryPocketTag: () => cy.contains("p", "PRIMARY POCKET"),

        yourBalances: () => cy.contains("Your Balances"),

        balanceCards: () => cy.get(".overflow-x-auto > .flex.gap-3 > div"),

        //Quick Actions

        quickActionsTitle: () =>
            cy.contains("h2", "Quick Actions"),

        sendMoneyButton: () =>
            cy.contains("h2", "Quick Actions")
                .closest(".bg-white")
                .contains("span", "Send Money"),

        convertFundsButton: () =>
            cy.contains("h2", "Quick Actions")
                .closest(".bg-white").contains("span", "Convert Funds"),

        createSubPocketButton: () =>
            cy.contains("h2", "Quick Actions")
                .closest(".bg-white").contains("span", "Create a Subpocket"),

        sendMoneyPageTitle: () =>
            cy.contains("h2", "Send money from"),

        createSubPocketPageTitle: () => cy.contains("h1", "Create pocket account"),

        convertFundsPageTitle: () => cy.contains('', ''),



        // EXCHANGE RATES

        exchangeRateButton: () => cy.contains("See all our rates"),

        exchangeRateCard: () =>
            cy.contains("h2", "Exchange Rates")
                .parents(".bg-white"),

        exchangeRateTitle: () =>
            cy.contains("h2", "Exchange Rates"),

        currencyHeader: () =>
            cy.contains("div", "CURRENCY"),

        rateHeader: () =>
            cy.contains("div", "RATE"),

        seeAllRatesButton: () =>
            cy.contains("button", "See all our rates"),

        currencyConversionTable: () =>
            cy.contains("div", "CURRENCY")
                .closest(".grid.grid-cols-4")
                .parent(),

        currencyConversionRows: () =>
            cy.contains("div", "CURRENCY")
                .closest(".grid.grid-cols-4")
                .next()
                .children(".grid.grid-cols-4"),

        exchangeRatePageHeader: () =>
            cy.contains('span', 'Exchange Rate'),


        // RECENT TRANSACTIONS

        recentTransactionsSection: () =>
            cy.contains("h2", "Recent Transactions")
                .closest(".bg-white"),

        transactionRows: () =>
            cy.contains("h2", "Recent Transactions")
                .closest(".bg-white")
                .find("div.flex.items-center.justify-between")
                .not(":first"),

        transactionName: () =>
            cy.contains("h2", "Recent Transactions")
                .closest(".bg-white")
                .find(".space-y-0 > div")
                .find("div.flex.items-center.gap-3")
                .find("p")
                .first(),

        transactionDate: () =>
            cy.contains("h2", "Recent Transactions")
                .closest(".bg-white")
                .find(".space-y-0 > div")
                .find("p.text-sm"),

        transactionAmount: () =>
            cy.contains("h2", "Recent Transactions")
                .closest(".bg-white")
                .find(".space-y-0 > div > p"),

        seeAllTransactionsButton: () =>
            cy.contains("button", "See all transactions"),





        // SIDE PANEL OR NAV BAR
        homeMenu: () => cy.contains("nav a", "Home"),

        transactionsMenu: () => cy.contains("nav a", "Transactions"),

        accountsMenu: () => cy.contains("nav a", "Accounts"),

        auditLogMenu: () => cy.contains("nav a", "Audit Log"),

        sendMoneyMenu: () => cy.contains("nav a", "Send Money"),

        settingsMenu: () => cy.contains("nav a", "Settings"),

        logoutButton: () => cy.contains("button", "Log out"),
    }




    // ============================
    // Actions
    // ============================

    visitDashboard() {
        cy.visit("/dashboard");
    }


    //Quick Actions
    clickSendMoney() {
        this.elements.sendMoneyButton()
            .should("be.visible")
            .click();
    }

    clickConvertFunds() {
        this.elements.convertFundsButton()
            .should("be.visible")
            .click();
    }

    clickCreateSubPocket() {
        this.elements.createSubPocketButton()
            .should("be.visible")
            .click();
    }

    verifySendMoneyPage() {
        this.elements.sendMoneyPageTitle()
            .should("be.visible");
    }

    verifyConvertFundsPage() {
        this.elements.convertFundsPageTitle()
            .should("be.visible");
    }

    verifyCreateSubPocketPage() {
        this.elements.createSubPocketPageTitle()
            .should("be.visible");
    }

    clickSeeAllRates() {
        this.elements.seeAllRatesButton().click();
    }

    clickSeeAllTransactions() {

        this.elements.seeAllTransactionsButton()
            .scrollIntoView()
            .click();
    }


    // ============================
    // Validations
    // ============================


    // POCKET CARDS AND DASHBOARD
    validateDashboardTitle() {
        this.elements.dashboardTitle().should("be.visible");
    }

    validateYourBalancesSection() {
        this.elements.yourBalances().should("be.visible");
    }

    validateQuickActionsSection() {
        this.elements.quickActions().should("be.visible");
    }

    validateExchangeRatesSection() {
        this.elements.exchangeRates().should("be.visible");
    }

    validateRecentTransactionsSection() {
        this.elements.recentTransactions().should("be.visible");
    }

    validateAllPocketCards() {

        this.elements.balanceCards()
            .should("have.length.greaterThan", 0)
            .each(($card, index) => {

                cy.log(`Validating Pocket Card ${index + 1}`);

                cy.wrap($card).within(() => {

                    // Validate Currency Name
                    cy.get("p")
                        .eq(0)
                        .invoke("text")
                        .then((text) => {
                            expect(text.trim()).to.not.equal("");
                        });

                    // Validate Currency Code
                    cy.get("span")
                        .invoke("text")
                        .then((code) => {
                            expect(code.trim()).to.match(/^[A-Z]{3}$/);
                        });

                    // Validate Balance
                    cy.get("p.text-\\[20px\\]")
                        .invoke("text")
                        .then((balance) => {

                            const amount = balance
                                .replace(/[A-Z]/g, "")
                                .replace(/,/g, "")
                                .trim();

                            expect(amount).to.not.equal("");
                        });

                });

                // Determine if card is Active or Inactive
                cy.wrap($card).then(($currentCard) => {

                    if ($currentCard.text().includes("More information")) {

                        // Click More Information
                        cy.wrap($currentCard)
                            .scrollIntoView()
                            .within(() => {
                                cy.contains("More information")
                                    .scrollIntoView()
                                    .click({ force: true });
                            });

                        //cy.wait(2000)

                        // ===== Validate Modal =====

                        cy.get(".relative.bg-white.rounded-2xl")
                            .should("be.visible");

                        // Currency Name
                        cy.get(".relative.bg-white.rounded-2xl")
                            .find("h2")
                            .should("be.visible")
                            .and("not.be.empty");

                        // Pocket ID
                        cy.contains("Pocket ID")
                            .should("be.visible");

                        // Total Sub Pocket
                        cy.contains("Total Sub Pocket")
                            .should("be.visible");

                        // Total Sub Pocket Balance
                        cy.contains("Total Sub Pocket Balance")
                            .should("be.visible");

                        // Funding Link
                        // cy.contains("Funding Link")
                        //     .should("be.visible");

                        // cy.get('a[target="_blank"]')
                        //     .should("have.attr", "href")
                        //     .and("include", "pay.seerbit");

                        // Bank Information
                        cy.contains("Bank Information")
                            .should("be.visible");

                        // View Transactions Button
                        cy.contains("button", "View Transactions")
                            .should("be.visible")
                            .and("be.enabled")
                        //     .click();

                        // // Validate redirection
                        // cy.url().should("include", "/transactions");

                        // cy.contains("Transactions").should("be.visible");

                        // // Return to Dashboard
                        // cy.go("back");

                        // // Wait for dashboard to reload
                        // cy.contains("Your Balances").should("be.visible");


                        // Close Modal
                        cy.get(".relative.bg-white.rounded-2xl")
                            .find("button")
                            .first()
                            .click();

                        cy.get(".relative.bg-white.rounded-2xl")
                            .should("not.exist");

                    } else {

                        // Validate inactive card
                        cy.wrap($currentCard)
                            .contains("INACTIVE")
                            .should("be.visible");

                    }

                });

            });

    }

    validateQuickActionsSection() {

        this.elements.quickActionsTitle()
            .should("be.visible");

        this.elements.sendMoneyButton()
            .should("be.visible");

        this.elements.convertFundsButton()
            .should("be.visible");

        this.elements.createSubPocketButton()
            .should("be.visible");

    }

    // Exchange rates
    validateExchangeRates() {

        this.elements.exchangeRateRows()
            .should("have.length.greaterThan", 0)
            .each(($row) => {

                cy.wrap($row).within(() => {

                    // Validate currency codes exist
                    cy.get("span")
                        .eq(0)
                        .should("be.visible")
                        .invoke("text")
                        .should("match", /[a-zA-Z]/);

                    cy.get("span")
                        .eq(1)
                        .should("be.visible")
                        .invoke("text")
                        .should("not.be.empty");

                    cy.get("span")
                        .eq(2)
                        .should("be.visible")
                        .invoke("text")
                        .should("match", /[a-zA-Z]/);

                    // Validate exchange rate
                    cy.get("div")
                        .last()
                        .invoke("text")
                        .should("not.be.empty")
                        .and("match", /\d/);
                });

            });

    }

    //Validate currency conversion table
    validateCurrencyConversionTable() {

        this.elements.currencyConversionRows()
            .should("have.length.greaterThan", 0)
            .each(($row, index) => {

                cy.log(`Validating Currency Conversion Row ${index + 1}`);

                cy.wrap($row)
                    .children("div")
                    .should("have.length", 4)
                    .then(($columns) => {

                        // Source Currency
                        cy.wrap($columns[0]).find("img, div").should("exist");
                        cy.wrap($columns[0]).find("span")
                            .invoke("text")
                            .then(text => {
                                expect(text.trim()).to.match(/^[A-Z]{3}$|^[A-Za-z]{2,5}$/);
                            });

                        // Destination Currency
                        cy.wrap($columns[2]).find("img, div").should("exist");
                        cy.wrap($columns[2]).find("span")
                            .invoke("text")
                            .then(text => {
                                expect(text.trim()).to.match(/^[A-Z]{3}$|^[A-Za-z]{2,5}$/);
                            });

                        // Exchange Rate
                        cy.wrap($columns[3])
                            .invoke("text")
                            .then(text => {
                                expect(text.trim()).to.match(/^\d+(\.\d+)?$/);
                            });

                    });

            });

    }


    // RECENT TRANSACTIONS
    validateRecentTransactionsSection() {
        this.scrollToRecentTransactions();
        this.elements.recentTransactionsSection()
            .should("be.visible");

        this.elements.seeAllTransactionsButton()
            .should("be.visible")
            .and("be.enabled");
    }


    validateTransactionRows() {

        this.elements.recentTransactionsSection()
            .scrollIntoView()
            .should("be.visible");


        this.elements.transactionRows()
            .should("have.length.greaterThan", 0)
            .each(($row, index) => {

                cy.log(`Validating Transaction ${index + 1}`);

                cy.wrap($row).within(() => {


                    // Transaction icon
                    cy.get("svg")
                        .should("exist")
                        .and("be.visible");


                    // Transaction name
                    cy.get("p")
                        .first()
                        .invoke("text")
                        .then((text) => {

                            expect(text.trim())
                                .to.not.equal("");

                        });


                    // Transaction date
                    cy.get("p")
                        .eq(1)
                        .invoke("text")
                        .then((date) => {

                            expect(date.trim())
                                .to.match(/ago|day|days/);

                        });


                    // Transaction amount
                    cy.get("> p")
                        .invoke("text")
                        .then((amount) => {

                            expect(amount.trim())
                                .to.match(/^[A-Z]{3}\s[\d,.]+$/);

                        });

                });

            });

    }


    validateNavigationToTransactions() {

        this.elements.seeAllTransactionsButton()
            .scrollIntoView()
            .click();

        cy.url()
            .should("include", "/transactions");

        cy.contains("H1", "Transactions").should("be.visible");

    }

    // SIDE BAR MENU

    validateSidebarMenus() {

        this.elements.homeMenu().should("be.visible");
        this.elements.transactionsMenu().should("be.visible");
        this.elements.accountsMenu().should("be.visible");
        this.elements.auditLogMenu().should("be.visible");
        this.elements.sendMoneyMenu().should("be.visible");
        this.elements.settingsMenu().should("be.visible");

    }

}

export default new PrimaryPocketDashboardPage();