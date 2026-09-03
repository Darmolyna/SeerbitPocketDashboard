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

    validateBalanceCardsCurrency() {
        this.elements.balanceCards().should("be.visible");
        this.elements.balanceCards().find("p").first().invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(/^[A-Z]{3}\s[\d,.]+$/);
            });
    }
}

export default new AccountsPrimaryPocketPage();
