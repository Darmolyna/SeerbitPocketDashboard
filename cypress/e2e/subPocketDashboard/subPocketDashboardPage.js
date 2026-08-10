class SubPocketDashboardPage {

    // ============================
    // Elements
    // ============================
    elements = {
        //Blanace card
        dashboardTitle: () => cy.contains("Dashboard"),

        balanceCards: () => cy.get(".overflow-x-auto > .flex.gap-3 > div"),

        yourBalances: () => cy.contains("Your Balances"),


        // Performance Section
        performanceCard: () =>
            cy.contains("h2", "Performance")
                .closest(".bg-white"),

        performanceTitle: () =>
            cy.contains("h2", "Performance"),

        payoutLegend: () =>
            cy.contains("span", "Payout"),

        payInLegend: () =>
            cy.contains("span", "Pay In"),

        performanceChart: () =>
            cy.get(".recharts-wrapper"),

        chartSvg: () =>
            cy.get(".recharts-surface"),

        chartSlices: () =>
            cy.get(".recharts-sector"),


        // Pocket Balance Section

        pocketBalanceCard: () =>
            cy.contains("h2", "Pocket Balance")
                .closest(".bg-white"),

        pocketBalanceTitle: () =>
            cy.contains("h2", "Pocket Balance"),

        balanceLabel: () =>
            cy.contains("p", "Balance"),

        balanceAmount: () =>
            cy.contains("p", /^NGN/),


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
    }




    // ============================
    // Validations
    // ============================

    validateAllSubPocketCards() {

        this.elements.balanceCards()
            .should("have.length.greaterThan", 0)
            .each(($card, index) => {

                cy.log(`Validating Sub Pocket Card ${index + 1}`);

                // Validate Card Details

                cy.wrap($card).within(() => {

                    // Currency Name
                    cy.get("p")
                        .eq(0)
                        .invoke("text")
                        .then((text) => {
                            expect(text.trim()).to.not.equal("");
                        });


                    // Currency Code
                    cy.get("span")
                        .invoke("text")
                        .then((code) => {
                            expect(code.trim())
                                .to.match(/^[A-Z]{3}$/);
                        });


                    // Balance
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


                // Active / Inactive Card

                cy.wrap($card).then(($currentCard) => {


                    if ($currentCard.text().includes("More information")) {


                        // Open Modal
                        cy.wrap($currentCard)
                            .scrollIntoView()
                            .within(() => {

                                cy.contains("More information")
                                    .scrollIntoView()
                                    .click({ force: true });

                            });



                        const modal = ".relative.bg-white.rounded-2xl";

                        // Validate Modal

                        cy.get(modal)
                            .should("be.visible");

                        // Currency Name
                        cy.get(modal)
                            .find("h2")
                            .should("be.visible")
                            .and("not.be.empty");

                        // Pocket ID
                        cy.get(modal)
                            .contains("Pocket ID")
                            .should("be.visible");

                        cy.get(modal)
                            .contains("Pocket ID")
                            .parent()
                            .find("span")
                            .last()
                            .invoke("text")
                            .then((id) => {

                                expect(id.trim())
                                    .to.match(/^SBP\d+$/);

                            });


                        // Funding Account Validation

                        cy.get(modal)
                            .then(($modal) => {


                                const modalText = $modal.text();



                                // Case 1: No funding account available
                                if (
                                    modalText.includes(
                                        "No funding accounts available"
                                    )
                                ) {


                                    cy.log(
                                        "Sub Pocket has no funding account"
                                    );


                                    cy.get(modal)
                                        .contains(
                                            "No funding accounts available"
                                        )
                                        .should("be.visible");



                                    // Ensure funding link does not exist
                                    cy.get(modal)
                                        .find('a[target="_blank"]')
                                        .should("not.exist");



                                    // Ensure account number does not exist
                                    cy.get(modal)
                                        .find(
                                            "p.text-\\[20px\\]"
                                        )
                                        .should("not.exist");


                                }



                                // Case 2: Funding account exists
                                else {


                                    // Funding Link
                                    // cy.get(modal)
                                    //     .contains("Funding Link")
                                    //     .should("be.visible");


                                    // cy.get(modal)
                                    //     .find('a[target="_blank"]')
                                    //     .should("exist")
                                    //     .and("have.attr", "href")
                                    //     .and(
                                    //         "include",
                                    //         "pay.seerbit"
                                    //     );



                                    // Bank Information
                                    cy.get(modal)
                                        .contains(
                                            "Bank Information"
                                        )
                                        .should("be.visible");



                                    // Account Number
                                    cy.get(modal)
                                        .find(
                                            "p.text-\\[20px\\]"
                                        )
                                        .should("be.visible")
                                        .invoke("text")
                                        .then(
                                            (accountNumber) => {

                                                expect(
                                                    accountNumber.trim()
                                                ).to.match(/^\d+$/);

                                            }
                                        );



                                    // Bank Name - Dynamic validation
                                    cy.get(modal)
                                        .contains("Bank Information")
                                        .parent()
                                        .find("p")
                                        .last()
                                        .invoke("text")
                                        .then((bankName) => {

                                            expect(bankName.trim())
                                                .to.match(/^[A-Za-z\s]+$/);

                                            expect(bankName.trim())
                                                .to.not.equal("");

                                        });
                                }


                            });

                        // View Transactions

                        cy.get(modal)
                            .contains(
                                "button",
                                "View Transactions"
                            )
                            .should("be.visible")
                            .and("be.enabled");

                        cy.get(modal)
                            .contains(
                                "button",
                                "View Transactions"
                            )
                            .parent("a")
                            .should("have.attr", "href")
                            .and(
                                "include",
                                "/transactions?pocketId="
                            );



                        // Close Modal
                        cy.get(modal)
                            .find("button")
                            .first()
                            .click();



                        cy.get(modal)
                            .should("not.exist");


                    } else {

                        // Inactive Card
                        cy.wrap($currentCard)
                            .contains("INACTIVE")
                            .should("be.visible");

                    }

                });

            });

    }

    validatePerformanceSection() {

        this.elements.performanceCard()
            .should("be.visible");

        this.elements.performanceTitle()
            .should("be.visible");

        this.elements.payoutLegend()
            .should("be.visible");

        this.elements.payInLegend()
            .should("be.visible");

        this.elements.performanceChart()
            .should("be.visible");

        this.elements.chartSvg()
            .should("exist");

        this.elements.chartSlices()
            .should("have.length", 2);

    }

    validatePocketBalanceSection() {

        this.elements.pocketBalanceCard()
            .should("be.visible");

        this.elements.pocketBalanceTitle()
            .should("be.visible");

        this.elements.balanceLabel()
            .should("be.visible");

        this.elements.balanceAmount()
            .invoke("text")
            .then((text) => {

                expect(text.trim()).to.match(/^NGN\s[\d,.]+$/);

            });

    }

    validateTransactionRows() {

        this.elements.recentTransactionsSection()
            .scrollIntoView()
            .should("be.visible");

        // Ensure skeleton loader is gone (if applicable)
        cy.get(".animate-pulse").should("not.exist");

        this.elements.transactionRows()
            .should("have.length.greaterThan", 0)
            .its("length")
            .then((count) => {

                Cypress._.times(count, (index) => {

                    cy.log(`Validating Transaction ${index + 1}`);

                    this.elements.transactionRows()
                        .eq(index)
                        .should("be.visible")
                        .within(() => {

                            // Transaction icon
                            cy.get("svg")
                                .should("exist")
                                .and("be.visible");

                            // Transaction name
                            cy.get("p")
                                .first()
                                .invoke("text")
                                .should("not.be.empty");

                            // Transaction date
                            cy.get("p")
                                .eq(1)
                                .invoke("text")
                                .should("match", /(ago|day|days|hour|hours|minute|minutes)/i);

                            // Transaction amount
                            cy.get("> p")
                                .invoke("text")
                                .should("match", /^[A-Z]{3}\s[\d,.]+$/);

                        });

                });

            });

    }

}
export default new SubPocketDashboardPage();