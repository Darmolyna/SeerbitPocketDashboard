class PrimaryPocketDashboardPage {

    // ============================
    // Elements
    // ============================

    elements = {

        dashboardTitle: () => cy.contains("Dashboard"),

        yourBalances: () => cy.contains("Your Balances"),

        balanceCards: () =>
            cy.get(".overflow-x-auto > .flex.gap-3 > div"),

        quickActions: () => cy.contains("Quick Actions"),

        exchangeRates: () => cy.contains("Exchange Rates"),

        recentTransactions: () => cy.contains("Recent Transactions"),

        homeMenu: () => cy.contains("Home"),

        transactionsMenu: () => cy.contains("Transactions"),

        accountsMenu: () => cy.contains("Accounts"),

        auditLogMenu: () => cy.contains("Audit Log"),

        sendMoneyMenu: () => cy.contains("Send Money"),

        settingsMenu: () => cy.contains("Settings"),

        logoutButton: () => cy.contains("Log out"),

        sendMoneyQuickAction: () => cy.contains("span", "Send Money"),

        moreInformationButton: () => cy.contains("More information"),

        exchangeRateButton: () => cy.contains("See all our rates"),

        seeAllTransactions: () => cy.contains("See all transactions")
    }


    // ============================
    // Actions
    // ============================

    visitDashboard() {
        cy.visit("/dashboard");
    }

    clickTransactions() {
        this.elements.transactionsMenu().click();
    }

    clickAccounts() {
        this.elements.accountsMenu().click();
    }

    clickAuditLog() {
        this.elements.auditLogMenu().click();
    }

    clickSettings() {
        this.elements.settingsMenu().click();
    }

    clickSendMoneyQuickAction() {
        this.elements.sendMoneyQuickAction().click();
    }

    clickLogout() {
        this.elements.logoutButton().click();
    }


    // ============================
    // Validations
    // ============================

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

    validateSidebarMenus() {

        this.elements.homeMenu().should("be.visible");
        this.elements.transactionsMenu().should("be.visible");
        this.elements.accountsMenu().should("be.visible");
        this.elements.auditLogMenu().should("be.visible");
        this.elements.sendMoneyMenu().should("be.visible");
        this.elements.settingsMenu().should("be.visible");

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
                        cy.contains("Funding Link")
                            .should("be.visible");

                        cy.get('a[target="_blank"]')
                            .should("have.attr", "href")
                            .and("include", "pay.seerbit");

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

}

export default new PrimaryPocketDashboardPage();