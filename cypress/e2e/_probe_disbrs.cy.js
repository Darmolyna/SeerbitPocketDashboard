import PrimaryPocketDisbursementPage from "./transactions-disbursement-primary/transactions-disbursement-primaryPage";
import LoginPage from "./login/loginPage";

describe("probe disbursement export", () => {
    it("exports and inspects", () => {
        cy.viewport(1800, 1000);
        cy.visit(Cypress.expose("baseUrl"));

        LoginPage.enterPrimaryPocketEmail();
        LoginPage.enterPrimaryPocketPassword();
        LoginPage.clickSignIn();

        cy.contains("nav a", "Transactions").should("be.visible").click();
        cy.contains("button", "Disbursement").should("be.visible").click();

        cy.contains("button", "Export Transactions").click();

        cy.contains("h2", "Export transactions").should("be.visible");
        cy.get("select").then(($sel) => cy.log(`select options: ${JSON.stringify($sel.find("option").map((i,o)=>o.value).get())}`));

        cy.get('[data-picker="date-range"] svg[aria-label="calendar"]').click();
        cy.get('[data-testid="calendar-start"]').find('[aria-label="Previous month"]').click();
        cy.get('[data-testid="calendar-end"]').find('[aria-label="Previous month"]').click();
        const today = new Date();
        const start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        const fmt = (d) => `${String(d.getDate()).padStart(2,"0")} ${d.toLocaleString("en-US",{month:"short"})} ${d.getFullYear()}`;
        cy.get(`.rs-calendar-table-cell[title^="${fmt(start)}"]`).first().click();
        cy.get(`.rs-calendar-table-cell[title^="${fmt(today)}"]`).last().click();
        cy.contains("button", "OK").should("be.visible").click();

        cy.get('[data-picker="date-range"] input').should(($i)=>expect($i.val()).not.to.equal(""));

        // log the column toggle labels
        cy.get(".grid button").each(($b, i) => cy.log(`COL ${i}: ${$b.text().trim()}`));
        // deselect "Status" (index 4)
        cy.get(".grid button").eq(4).click();
        cy.log("clicked Status toggle");

        cy.contains("button", /^Export$/).should("not.be.disabled").click();

        cy.wait(6000);

        cy.task("getLatestDownloadedFile", ".xlsx").then((filePath) => {
            cy.log(`LATEST FILE: ${filePath}`);
            if (!filePath) { cy.log("NO FILE"); return; }
            cy.task("parseXlsx", filePath).then((rows) => {
                cy.log(`ROWS: ${rows.length}`);
                cy.log(`HEADER: ${JSON.stringify(rows[0])}`);
                cy.log(`ROW1: ${JSON.stringify(rows[1])}`);
            });
        });
    });
});
