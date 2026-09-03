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
  Scenario Outline: Switch primary pocket and validate the dashboard updates
    Given I open the primary pocket switcher
    When I select the primary pocket "<pocketId>"
    Then the selected primary pocket should be "<pocketId>"

    Examples:
      | pocketId    |
      | SBP0000829  |
      | SBP0016109  |

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
  Scenario Outline: Search for a sub pocket by its ID
    Given I am on the Accounts page
    When I search for a Subpocket ID "<subpocketId>"
    Then I should see rows matching the Subpocket ID "<subpocketId>"

    Examples:
      | subpocketId |
      | SBP0020711  |
      | SBP0020694  |

  @accountsPrimaryPocket8
  Scenario: Search for a non existent sub pocket ID
    Given I am on the Accounts page
    When I search for a Subpocket ID "SBP9999999"
    Then I should see the no sub pockets found message

  @accountsPrimaryPocket9
  Scenario: Create a sub pocket for the selected primary pocket
    When I click the Create a Subpocket button
    Then I should see the create sub pocket form
    When I fill the create sub pocket form
    Then the sub pocket should be created successfully
