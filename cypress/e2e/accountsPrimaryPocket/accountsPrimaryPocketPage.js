class AccountsPrimaryPocketPage {

    // ============================
    // Elements
    // ============================
    elements = {
        primaryPocketLabel: () =>
            cy.contains("p", "PRIMARY POCKET"),

        accountsMenu: () =>
            cy.contains("nav a", "Accounts"),

        // Primary pocket switcher (desktop copy: hidden md:block)
        pocketSwitcherTrigger: () =>
            cy.get(".hidden.md\\:block")
                .find('button.bg-\\[\\#FF3C38\\]')
                .first(),

        pocketSwitcherItems: () =>
            cy.get(".hidden.md\\:block")
                .find(".max-h-72.overflow-y-auto button"),

        // Balance summary cards
        balanceCards: () =>
            cy.get("main .grid.grid-cols-1.md\\:grid-cols-3"),
    };

    // ============================
    // Actions
    // ============================

    navigateToAccounts() {
        cy.contains("nav a", "Accounts", { timeout: 30000 }).click();
    }

    openPocketSwitcher() {
        this.elements.pocketSwitcherTrigger()
            .scrollIntoView()
            .click({ force: true });
    }

    selectPocketById(pocketId) {
        this.elements.pocketSwitcherItems()
            .contains(pocketId)
            .click({ force: true });
    }

    searchSubPocketId(subPocketId) {
        cy.get('input[placeholder="Search Subpocket ID"]')
            .clear()
            .type(subPocketId);
    }

    clickCreateSubPocket() {
        cy.contains("button", "Create a Subpocket")
            .scrollIntoView()
            .click({ force: true });
    }

    validateCreateFormVisible() {
        cy.contains("h2", "Create Subpocket", { timeout: 10000 }).should("be.visible");
        cy.get('input[name="firstname"]').should("be.visible");
        cy.get('input[name="lastname"]').should("be.visible");
        cy.get('input[name="email"]').should("be.visible");
        cy.get('input[name="phoneNumber"]').should("be.visible");
    }

    fillCreateSubPocketForm() {
        cy.get('input[name="firstname"]').clear().type("Test");
        cy.get('input[name="lastname"]').clear().type("Pocket");
        cy.get('input[name="email"]').clear().type("test.pocket@seerbit.com");
        cy.get('input[name="phoneNumber"]').clear().type("08012345678");
        cy.contains("button", "Create").click({ force: true });
    }

    openFilterModal() {
        cy.get('[data-slot="trigger"]')
            .contains("Filter", { matchCase: false })
            .then(($el) => {
                cy.wrap($el).scrollIntoView().click({ force: true });
            });
    }

    // ============================
    // Validations
    // ============================

    validatePrimaryPocketLabel() {
        this.elements.primaryPocketLabel().should("be.visible");
    }

    validateAccountsMenuActive() {
        this.elements.accountsMenu()
            .should("exist")
            .and("have.class", "!bg-[#FF3C38]");
    }

    validatePocketBalanceCard() {
        cy.contains("p", "Pocket balance").should("be.visible");
    }

    validateTotalSubpocketBalanceCard() {
        cy.contains("p", "Total Subpocket balance").should("be.visible");
    }

    validateTotalSubpocketsCard() {
        cy.contains("p", "Total Subpockets").should("be.visible");
    }

    validateFundingAccountsHeader() {
        cy.contains("span", "Funding Accounts").should("be.visible");
    }

    validateAllSubpocketsHeader() {
        cy.contains("h2", "All Subpockets").should("be.visible");
    }

    validateFundingAccounts(fundingAccount, fundingBank) {
        cy.contains("span", "Funding Accounts")
            .closest("div.bg-\\[\\#F6F6F6\\]")
            .should("exist")
            .then(($section) => {
                cy.wrap($section)
                    .find(".animate-pulse")
                    .should("not.exist", { timeout: 20000 });
                cy.wrap($section)
                    .invoke("text")
                    .then((text) => {
                        if (fundingAccount === "EMPTY") {
                            expect(text).to.contain("No funding accounts available");
                        } else if (fundingAccount === "ANY") {
                            const isEmpty = text.includes("No funding accounts available");
                            const isFunded = /JABARI INC/.test(text) || /Account Number/.test(text);
                            expect(isEmpty || isFunded).to.equal(true);
                        } else {
                            expect(text).to.contain(fundingAccount);
                            if (fundingBank !== "EMPTY") {
                                expect(text).to.contain(fundingBank);
                            }
                        }
                    });
            });
    }

    validateSubpocketTableDataOrEmpty() {
        cy.get("table tbody", { timeout: 20000 }).should(($tbody) => {
            const text = $tbody.text();
            const empty = /Oops, we have nothing to show!/.test(text);
            const hasRow = $tbody.find("tr").length > 0 &&
                !$tbody.find(".animate-pulse").length &&
                !/Oops, we have nothing to show!/.test(text);
            expect(empty || hasRow).to.equal(true);
        });
    }

    validateNoSubPocketsMessage() {
        cy.get("table tbody", { timeout: 20000 })
            .should("contain.text", "Oops, we have nothing to show!");
    }

    validateSearchResult(subPocketId, hasResult) {
        if (String(hasResult).toLowerCase() === "true") {
            cy.get("table tbody", { timeout: 20000 })
                .should("contain.text", subPocketId)
                .find("tr")
                .should("have.length.greaterThan", 0);
        } else {
            this.validateNoSubPocketsMessage();
        }
    }

    validateSwitcherList() {
        this.elements.pocketSwitcherItems()
            .should("have.length.greaterThan", 0)
            .each(($item) => {
                cy.wrap($item).within(() => {
                    cy.get("span").first().invoke("text").then((id) => {
                        expect(id.trim()).to.match(/^SBP\d+$/);
                    });
                    cy.get("span").last().invoke("text").then((ccy) => {
                        expect(ccy.trim()).to.match(/\(([A-Z]{3})\)$/);
                    });
                });
            });
    }

    validateSelectedPocket(pocketId) {
        this.elements.pocketSwitcherTrigger()
            .should("contain.text", pocketId);
    }

    validateFilterModalVisible() {
        cy.contains("h2", "Filter Subpockets", { timeout: 10000 }).should("be.visible");
        cy.contains("label", "Search Email Address").should("be.visible");
    }

    filterByEmail(email) {
        cy.contains("label", "Search Email Address")
            .parent()
            .find('input[placeholder="Search"]')
            .clear()
            .type(email);
    }

    filterByDateRange(from, to) {
        cy.get('input[placeholder="Select Date Range"]')
            .first()
            .click({ force: true });
        cy.log(`Set date range from ${from} to ${to} using the date picker`);
    }

    applyFilter() {
        cy.contains("button", "Apply Filter").click({ force: true });
    }

    // Validates the balance summary cards reflect the selected primary pocket
    validateDashboardReflectsPocket(currency) {
        this.elements.balanceCards()
            .find("p")
            .should("exist")
            .first()
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(new RegExp(`^${currency}\\s[\\d,.]+$`));
            });
    }

    validateTotalSubpocketsValue(count) {
        cy.contains("p", "Total Subpockets")
            .parent()
            .invoke("text")
            .then((parentText) => {
                const text = parentText.trim();
                expect(text).to.have.string(count.toString());
            });
    }

    validateBalanceCardsCurrency() {
        this.elements.balanceCards().should("be.visible");
        this.elements.balanceCards().find("p").first().invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(/^[A-Z]{3}\s[\d,.]+$/);
            });
    }
}

export default new AccountsPrimaryPocketPage();
