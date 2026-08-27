@regression @fullSuite @subPocketFunding
Feature: Sub Pocket Funding Transactions

    Background:
        Given I am logged into the Sub Pocket Dashboard
        And I navigate to the Funding Transactions page

@subPocketFunding1
Scenario: Validate Funding Transactions page
    Then I should see the Funding Transactions page

@subPocketFunding2
Scenario: Validate funding transactions table structure
    Then the funding transactions table should display the correct columns and rows

@subPocketFunding3
Scenario: Search for an existing transaction reference
    When I search using an existing payment reference
    Then only funding transactions matching the reference should be displayed

@subPocketFunding4
Scenario: Search transactions with a non-existent reference
    When I search using a non-existent payment reference "9999999999"
    Then no funding transactions should be displayed

@subPocketFunding5
Scenario Outline: Filter transactions by Date Range
    When I filter funding transactions using "<dateRange>" date range
    Then only funding transactions within the selected "<dateRange>" range should be displayed

Examples:
| dateRange |
| No Filter |
| Last 1 Day |
| Last 7 Days |
| Last 1 Month |
| Future Date |

@subPocketFunding6
Scenario: Validate payment reference copy
    Then I should be able to copy the payment reference

@subPocketFunding7
Scenario: Export Funding Transactions
    When I export funding transactions
    Then the transactions export should start successfully

@subPocketFunding8
Scenario: Validate funding transaction row information
    Then each funding transaction should display valid source, amount, status, balance and date information

@subPocketFunding9
Scenario: Validate funding transactions pagination
    Then the funding transactions table should display valid pagination controls