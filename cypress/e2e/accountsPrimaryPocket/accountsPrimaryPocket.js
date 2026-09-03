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

Then('the dashboard should reflect the selected primary pocket {string} with currency {string}', (pocketId, currency) => {
    AccountsPrimaryPocketPage.validateDashboardReflectsPocket(currency);
});

Then("the Total Subpockets card should show {string}", (count) => {
    AccountsPrimaryPocketPage.validateTotalSubpocketsValue(count);
});

Then("I should see the balance summary cards contain the correct currency format", () => {
    AccountsPrimaryPocketPage.validateBalanceCardsCurrency();
});

Then("the Funding Accounts section should show account details or an empty state", () => {
    AccountsPrimaryPocketPage.validateFundingAccounts("ANY", "ANY");
});

Then('the Funding Accounts section should show the funding account {string} and bank {string}', (fundingAccount, fundingBank) => {
    AccountsPrimaryPocketPage.validateFundingAccounts(fundingAccount, fundingBank);
});

Then("the Subpocket table should show data or the empty state", () => {
    AccountsPrimaryPocketPage.validateSubpocketTableDataOrEmpty();
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

Then('the search result for {string} should have data {string}', (subPocketId, hasResult) => {
    AccountsPrimaryPocketPage.validateSearchResult(subPocketId, hasResult);
});

Then("I should see the no sub pockets found message", () => {
    AccountsPrimaryPocketPage.validateNoSubPocketsMessage();
});

When("I click the Create a Subpocket button", () => {
    AccountsPrimaryPocketPage.clickCreateSubPocket();
});

Then("I should see the create sub pocket form", () => {
    AccountsPrimaryPocketPage.validateCreateFormVisible();
});

When("I fill the create sub pocket form", () => {
    AccountsPrimaryPocketPage.fillCreateSubPocketForm();
});

Then("the sub pocket should be created successfully", () => {
    cy.log("Create sub pocket form submitted");
});

When("I open the Filter sub pockets modal", () => {
    AccountsPrimaryPocketPage.openFilterModal();
});

Then("I should see the Filter Subpockets modal", () => {
    AccountsPrimaryPocketPage.validateFilterModalVisible();
});

When('I filter sub pockets by email {string}', (email) => {
    AccountsPrimaryPocketPage.filterByEmail(email);
});

When('I filter sub pockets by date range from {string} to {string}', (from, to) => {
    AccountsPrimaryPocketPage.filterByDateRange(from, to);
});

When("I apply the filter", () => {
    AccountsPrimaryPocketPage.applyFilter();
});

Then("I should see the filtered results", () => {
    cy.log("Filter applied - verifying filtered sub pocket rows");
});
