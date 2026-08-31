describe("probe", () => {
  it("logs body", () => {
    cy.visit("https://develop.d1vg8wvg97d1gx.amplifyapp.com/");
    cy.get('input[name="email"]').clear().type("test@seerbit.com");
    cy.get('input[name="password"]').clear().type("Test@1234");
    cy.contains("button", "Sign In").click();
    cy.contains("nav a", "Transactions", { timeout: 30000 }).click();
    cy.contains("button", "Export Transactions", { timeout: 30000 }).click();
    cy.contains("h2", "Export transactions", { timeout: 30000 }).should("be.visible");
    cy.get('[data-picker="date-range"] svg[aria-label="calendar"]').click();
    cy.contains("button", "Today").click();
    cy.wait(2000);
    cy.get("body").then(($b) => {
      const t = $b.text();
      cy.log("HAS_MSG=" + t.includes("No transactions found for the selected date range"));
      cy.log("BODY_TAIL=" + JSON.stringify(t.slice(-400)));
    });
  });
});
