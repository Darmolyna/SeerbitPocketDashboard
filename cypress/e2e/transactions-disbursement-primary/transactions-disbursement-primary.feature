@regression
Feature: Primary Pocket Disbursement Transactions

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Disbursement Transactions page

    Scenario: Validate Disbursement Transactions page
        Then I should see the Disbursement Transactions page

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

    Scenario: Filter transactions by Payment Reference
        When I filter disbursement transactions using a payment reference
        Then only Disbursement transactions matching the payment reference should be displayed

   Scenario Outline: Filter transactions by Date Range
    When I filter disbursement transactions using "<dateRange>" date range
    Then only Disbursement transactions within the selected "<dateRange>" range should be displayed

Examples:
| dateRange |
| No Filter |
| Last 1 Day |
| Last 7 Days |
| Last 1 Month |
| Future Date |

    Scenario: Validate payment reference copy
        Then I should be able to copy the payment reference

    Scenario: Export disbursement Transactions
        When I export disbursement transactions
        Then the disbursement transactions export should start successfully