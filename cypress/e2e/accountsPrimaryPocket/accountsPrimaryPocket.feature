@regression @fullSuite @accountsPrimaryPocket

Feature: Primary Pocket Accounts Page

  Background:
    Given I am logged into the Primary Pocket Dashboard
    And I navigate to the Accounts page

  @accountsPrimaryPocket1
  Scenario: Verify the Accounts page structure and section headers
    Then I should see the PRIMARY POCKET label
    And I should see the Accounts sidebar menu is active
    And I should see the Pocket balance card
    And I should see the Total Subpocket balance card
    And I should see the Total Subpockets card
    And I should see the Funding Accounts section header
    And I should see the All Subpockets section header

  @accountsPrimaryPocket2
  Scenario: Verify the primary pocket switcher dropdown lists all primary pockets
    When I open the primary pocket switcher
    Then I should see a list of primary pockets with their currency
    And each primary pocket should have a valid SBP ID and currency code

  @accountsPrimaryPocket3
  Scenario Outline: Switch primary pocket "<pocketId>" and validate the dashboard updates
    Given I open the primary pocket switcher
    When I select the primary pocket "<pocketId>"
    Then the selected primary pocket should be "<pocketId>"
    And the dashboard should reflect the selected primary pocket "<pocketId>" with currency "<currency>"
    And the Funding Accounts section should show the funding account "<fundingAccount>" and bank "<fundingBank>"
    And the Subpocket table should show data or the empty state

    Examples:
      | pocketId   | currency | fundingAccount | fundingBank |
      | SBP0000829 | NGN      | 4018404197     | 9PSB        |
      | SBP0013153 | USD      | EMPTY          | EMPTY       |
      | SBP0013794 | XOF      | EMPTY          | EMPTY       |
      | SBP0014320 | XOF      | EMPTY          | EMPTY       |
      | SBP0014681 | GHS      | EMPTY          | EMPTY       |
      | SBP0016070 | XOF      | EMPTY          | EMPTY       |
      | SBP0016109 | XAF      | EMPTY          | EMPTY       |
      | SBP0016110 | XOF      | EMPTY          | EMPTY       |
      | SBP0017144 | NGN      | 7750187620     | WEMA        |
      | SBP0017146 | NGN      | 4565882902     | FIDELITY    |
      | SBP0018808 | NGN      | EMPTY          | EMPTY       |

  @accountsPrimaryPocket4
  Scenario: Validate the balance and subpocket summary cards
    Then I should see the balance summary cards contain the correct currency format

  @accountsPrimaryPocket5
  Scenario: Validate the Funding Accounts section reflects the selected primary pocket
    Then the Funding Accounts section should show account details or an empty state

  @accountsPrimaryPocket6
  Scenario: Validate the All Subpockets table headers
    Then I should see the Subpocket table headers
    And the Subpocket table should display the correct headers

  @accountsPrimaryPocket7
  Scenario Outline: Search for sub pocket ID "<subpocketId>" (has data: "<hasResult>")
    Given I am on the Accounts page
    When I search for a Subpocket ID "<subpocketId>"
    Then the search result for "<subpocketId>" should have data "<hasResult>"

    Examples:
      | subpocketId   | hasResult |
      | SBP0020711    | true      |
      | SBP0020694    | true      |
      | 11223344565   | false     |
      | SBP9999999    | false     |

  @accountsPrimaryPocket9
  Scenario: Create a sub pocket for the selected primary pocket
    When I click the Create a Subpocket button
    Then I should see the create sub pocket form
    When I fill the create sub pocket form
    Then the sub pocket should be created successfully

  @accountsPrimaryPocket10
  Scenario: Filter sub pockets by email address and date range
    Given I am on the Accounts page
    When I open the Filter sub pockets modal
    Then I should see the Filter Subpockets modal
    When I filter sub pockets by email "ayomide.afolabi@seerbit.com"
    And I filter sub pockets by date range from "2025-01-01" to "2026-12-31"
    And I apply the filter
    Then I should see the filtered results
