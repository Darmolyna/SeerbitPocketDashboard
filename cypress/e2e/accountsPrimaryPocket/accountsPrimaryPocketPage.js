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

    fillCreateSubPocketFormWithRandomData() {

        const firstname = this._randomFirstName();

        const lastname = this._randomLastName();

        const email = this._randomEmail(firstname, lastname);

        const phoneNumber = this._randomPhoneNumber();

        // Keep the data so later steps can verify the row on the table.
        this.createdSubPocket = {
            firstname,
            lastname,
            email,
            phoneNumber
        };

        cy.log(
            `Creating sub pocket: ${firstname} ${lastname} (${email})`
        );

        // Capture the create request so later steps can assert its status.
        cy.intercept("POST", "**/sub-pocket").as("createSubPocket");

        this._setField('input[name="firstname"]', firstname);
        this._setField('input[name="lastname"]', lastname);
        this._setField('input[name="email"]', email);
        this._setField('input[name="phoneNumber"]', phoneNumber);

        // Re-assert all values immediately before submitting, in case a
        // re-render reset the controlled inputs.
        cy.get('input[name="firstname"]').should("have.value", firstname);
        cy.get('input[name="lastname"]').should("have.value", lastname);
        cy.get('input[name="email"]').should("have.value", email);
        cy.get('input[name="phoneNumber"]').should("have.value", phoneNumber);

        // Scope to the modal so this does not match the page-level
        // "Create a Subpocket" button.
        cy.contains("h2", "Create Subpocket")
            .closest(".max-w-2xl")
            .find("button")
            .filter((_index, $button) =>
                Cypress.$($button).text().trim() === "Create"
            )
            .click({ force: true });

    }

    _setField(selector, value) {

        cy.get(selector)
            .clear()
            .type(value)
            .should("have.value", value);

    }

    _randomFirstName() {

        const firstNames = [
            "Ada",
            "Chidi",
            "Amina",
            "Kofi",
            "Ngozi",
            "Tunde",
            "Yemi",
            "Kwame",
            "Zainab",
            "Emeka"
        ];

        return firstNames[Math.floor(Math.random() * firstNames.length)];

    }

    _randomLastName() {

        const lastNames = [
            "Okafor",
            "Mensah",
            "Balogun",
            "Asante",
            "Eze",
            "Adeyemi",
            "Sowande",
            "Osei",
            "Okoye",
            "Diallo"
        ];

        return lastNames[Math.floor(Math.random() * lastNames.length)];

    }

    _randomEmail(firstname, lastname) {

        const suffix = Date.now().toString().slice(-7);

        return `${firstname}${lastname}${suffix}@yopmail.com`
            .toLowerCase();

    }

    _randomPhoneNumber() {

        const digits = String(
            Math.floor(10000000 + Math.random() * 90000000)
        );

        return `080${digits}`;

    }

    validateCreateSubPocketSubmitted() {

        // The create request must succeed (2xx) for the modal to close.
        cy.wait("@createSubPocket", { timeout: 20000 })
            .then((interception) => {

                const status = interception.response.statusCode;

                cy.log(`Create sub pocket response: ${status}`);

                expect(
                    status,
                    "create sub pocket request status"
                ).to.be.oneOf([200, 201]);

            });

        cy.contains("h2", "Create Subpocket", { timeout: 15000 })
            .should("not.exist");

        // Give React a moment to fully unmount the modal/backdrop before
        // interacting with the page again.
        cy.wait(500);

    }

    filterAndValidateCreatedSubPocketByEmail() {

        const created = this.createdSubPocket;

        expect(created, "random sub pocket data").to.exist;

        cy.log(
            `Filtering sub pockets by created email: ${created.email}`
        );

        // Click the Filter button and open the Filter Subpockets modal.
        this.openFilterModal();

        this.validateFilterModalVisible();

        // Search by the created email address.
        this.filterByEmail(created.email);

        this.applyFilter();

        // The filtered table should display exactly the created sub pocket.
        cy.get("table tbody", { timeout: 30000 })
            .should(($tbody) => {

                const matchingRows = Cypress.$($tbody)
                    .find("tr")
                    .filter((_index, row) =>
                        Cypress.$(row).text().includes(created.email)
                    );

                expect(
                    matchingRows.length,
                    `created sub pocket (${created.email}) in filtered results`
                ).to.equal(1);

            })

            .and(($tbody) => {

                const nameCell = Cypress.$($tbody)
                    .find("tr")
                    .filter((_index, row) =>
                        Cypress.$(row).text().includes(created.email)
                    )
                    .first()
                    .find("td")
                    .first()
                    .text();

                expect(
                    nameCell,
                    "created sub pocket name cell"
                ).to.match(new RegExp(
                    `${created.firstname}.*${created.lastname}`,
                    "i"
                ));

            });

    }

    openFilterModal() {

        // Dismiss any lingering dialog/backdrop before opening the filter.
        cy.get("body").type("{esc}", { force: true });

        // Click the Filter pill directly (inner div with the "Filter" text).
        cy.contains("div", "Filter").scrollIntoView().click({ force: true });

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
