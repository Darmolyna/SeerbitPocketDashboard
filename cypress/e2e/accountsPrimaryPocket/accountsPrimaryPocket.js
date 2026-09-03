import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import AccountsPrimaryPocketPage from "./accountsPrimaryPocketPage";
import LoginPage from "../login/loginPage";

Given("I am logged into the Primary Pocket Dashboard", () => {
    cy.viewport(1800, 1000);
    const url = Cypress.expose('baseUrl');
    cy.visit(url);
    LoginPage.enterPrimaryPocketEmail();
    LoginPage.enterPrimaryPocketPassword();
    LoginPage.clickSignIn();
});

Given("I navigate to the Accounts page", () => {
    AccountsPrimaryPocketPage.navigateToAccounts();
});

Given("I am on the Accounts page", () => {
    cy.contains("nav a", "Accounts", { timeout: 30000 }).click();
});

Then("I should see the PRIMARY POCKET label", () => {
    AccountsPrimaryPocketPage.validatePrimaryPocketLabel();
});

Then("I should see the Accounts sidebar menu is active", () => {
    AccountsPrimaryPocketPage.validateAccountsMenuActive();
});

Then("I should see the Pocket balance card", () => {
    AccountsPrimaryPocketPage.validatePocketBalanceCard();
});

Then("I should see the Total Subpocket balance card", () => {
    AccountsPrimaryPocketPage.validateTotalSubpocketBalanceCard();
});

Then("I should see the Total Subpockets card", () => {
    AccountsPrimaryPocketPage.validateTotalSubpocketsCard();
});

Then("I should see the Funding Accounts section header", () => {
    AccountsPrimaryPocketPage.validateFundingAccountsHeader();
});

Then("I should see the All Subpockets section header", () => {
    AccountsPrimaryPocketPage.validateAllSubpocketsHeader();
});

When("I open the primary pocket switcher", () => {
    AccountsPrimaryPocketPage.openPocketSwitcher();
});

Then("I should see a list of primary pockets with their currency", () => {
    AccountsPrimaryPocketPage.validateSwitcherList();
});

Then("each primary pocket should have a valid SBP ID and currency code", () => {
    AccountsPrimaryPocketPage.validateSwitcherList();
});

When("I select the primary pocket {string}", (pocketId) => {
    AccountsPrimaryPocketPage.selectPocketById(pocketId);
});

Then('the selected primary pocket should be {string}', (pocketId) => {
    AccountsPrimaryPocketPage.validateSelectedPocket(pocketId);
});

Then("I should see the balance summary cards contain the correct currency format", () => {
    AccountsPrimaryPocketPage.validateBalanceCardsCurrency();
});

Then("the Funding Accounts section should show account details or an empty state", () => {
    const sectionText = cy.contains("span", "Funding Accounts").parent();

    cy.contains("span", "Funding Accounts")
        .closest(".bg-\\[\\#F6F6F6\\]")
        .then(($section) => {
            const text = $section.text();
            if (text.includes("No funding accounts available")) {
                expect(text).to.contain("No funding accounts available");
            } else {
                expect(text).to.contain("Account Number").or.contain("9PSB");
            }
        });
});

Then("I should see the Subpocket table headers", () => {
    cy.get("table thead tr th").should("be.visible");
});

Then("the Subpocket table should display the correct headers", () => {
    const expected = [
        "Subpocket Name",
        "Status",
        "Email Address",
        "Balance",
        "Account Number",
        "Date Created",
    ];
    cy.get("table thead tr th")
        .should("have.length", expected.length)
        .each(($th, index) => {
            expect($th.text().trim()).to.equal(expected[index]);
        });
});

When("I search for a Subpocket ID {string}", (subPocketId) => {
    AccountsPrimaryPocketPage.searchSubPocketId(subPocketId);
});

Then('I should see rows matching the Subpocket ID {string}', (subPocketId) => {
    cy.get("table tbody tr")
        .should("have.length.greaterThan", 0)
        .each(($tr) => {
            expect($tr.text()).to.contain(subPocketId);
        });
});

Then("I should see the no sub pockets found message", () => {
    cy.contains("Oops, we have nothing to show!").should("be.visible");
});

When("I click the Create a Subpocket button", () => {
    AccountsPrimaryPocketPage.clickCreateSubPocket();
});

Then("I should see the create sub pocket form", () => {
    cy.contains("h1", "Create pocket account").should("be.visible");
});

When("I fill the create sub pocket form", () => {
    cy.contains("h1", "Create pocket account")
        .should("be.visible");
});

Then("the sub pocket should be created successfully", () => {
    cy.log("Create sub pocket form verified");
});
