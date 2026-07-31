class PrimaryPocketDisbursementPage {

    /*
        |--------------------------------------------------------------------------
        | Elements
        |--------------------------------------------------------------------------
        */

    elements = {
        transactionMenu: () => cy.contains("nav a", "Transactions"),

        disbursementMenu: () => cy.contains('button', 'Disbursement')

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

    parseTransactionDate(dateText) {

        cy.log(`Original date text: ${dateText}`);

        const cleanedText = dateText
            .replace(/\d{1,2}:\d{2}\s?(am|pm)/i, "")
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        cy.log(`Cleaned date text: ${cleanedText}`);


        // Example: 30 Jul, 2026
        const dateMatch = cleanedText.match(
            /^(\d{1,2})\s([A-Za-z]{3}),\s(\d{4})$/
        );


        if (dateMatch) {

            const day = Number(dateMatch[1]);
            const month = dateMatch[2];
            const year = Number(dateMatch[3]);


            return new Date(
                year,
                this.getMonthNumber(month),
                day
            );

        }


        return new Date("Invalid");

    }

}

export default new PrimaryPocketDisbursementPage();