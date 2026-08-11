@regression @fullSuite @transactionFunding
Feature: Primary Pocket Funding Transactions

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Funding Transactions page

@transactionFunding1
Scenario: Validate Funding Transactions page
    Then I should see the Funding Transactions page

@transactionFunding2
Scenario Outline: Search transaction by Pocket ID
    When I search using a Pocket ID "<pocketId>"
    Then I should see "<result>" for Pocket ID "<pocketId>"

Examples:
    | pocketId     | result                    |
    | 0010012873   | matching transactions     |
    | 2093599119   | matching transactions     |
    | 0010010001   | matching transactions     |
    | 0522376248   | matching transactions     |
    | 9999999999   | no transactions           |

@transactionFunding3
Scenario: Filter transactions by Payment Reference
    When I filter transactions using a payment reference
    Then only transactions matching the payment reference should be displayed

@transactionFunding4   
Scenario Outline: Filter transactions by Date Range
    When I filter transactions using "<dateRange>" date range
    Then only transactions within the selected "<dateRange>" range should be displayed

Examples:
| dateRange |
| No Filter |
| Last 1 Day |
| Last 7 Days |
| Last 1 Month |
| Future Date |

@transactionFunding5
Scenario: Validate payment reference copy
    Then I should be able to copy the payment reference

@transactionFunding6    
Scenario: Export Funding Transactions
    When I export funding transactions
    Then the transactions export should start successfully