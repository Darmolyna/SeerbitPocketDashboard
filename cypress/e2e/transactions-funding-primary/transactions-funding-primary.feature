@regression @fullSuite @transactionFunding
Feature: Primary Pocket Funding Transactions

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Funding Transactions page

@transactionFunding1
Scenario: Validate Funding Transactions page
    Then I should see the Funding Transactions page

@transactionFunding2
Scenario Outline: Search transaction by Pocket ID "<pocketId>"
    When I search using a Pocket ID "<pocketId>"
    Then I should see "<result>" for Pocket ID "<pocketId>"

Examples:
    | pocketId     | result                    |
    | SBP0018808   | matching transactions     |
    | SBP0017146   | matching transactions     |
    | SBP0017144   | matching transactions     |
    | 9999999999   | no transactions           |

@transactionFunding3
Scenario Outline: Search transactions funding by payment reference "<reference>"
    When I search using a payment reference "<reference>"
    Then I should see transactions funding matching payment reference "<reference>"

Examples:
    | reference                             | result                    |
    | JIN-S54184569908_XFER-C           | matching transactions     |
    | 000017260828092034265485097205-C                           | matching transactions     |
    | JIN-S16013439124-C               |matching transactions     |
    | 9999999999                      |no transactions                |

@transactionFunding4   
Scenario Outline: Filter transactions by Date Range "<dateRange>"
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