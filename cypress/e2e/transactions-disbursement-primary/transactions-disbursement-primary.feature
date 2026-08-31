@regression @fullSuite @transactionDisbursement
Feature: Primary Pocket Disbursement Transactions

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Disbursement Transactions page

@transactionDisbursement1
Scenario: Validate Disbursement Transactions page
    Then I should see the Disbursement Transactions page

@transactionDisbursement2
Scenario Outline: Search transaction by Pocket ID
    When I search using a Pocket ID "<pocketId>"
    Then I should see "<result>" for Pocket ID "<pocketId>"

Examples:
    | pocketId     | result                    |
    | SBP0018808   | matching transactions     |
    | SBP0017146   | matching transactions     |
    | SBP0017144   | matching transactions     |
    | 9999999999   | no transactions           |

@transactionDisbursement30
Scenario Outline: Search disbursement by payment reference
    When I search using a payment reference "<reference>"
    Then I should see disbursement matching payment reference "<reference>"

Examples:
    | reference                             | result                    |
    | Charge-F0006640830-qpc4jk             | matching transactions     |
    | F0006640830                           | matching transactions     |
    | JIN-S49745200465                      | matching transactions     |
    | 9999999999   | no transactions           |

@transactionDisbursement3
Scenario: Filter transactions by Payment Reference
    When I filter disbursement transactions using a payment reference
    Then only Disbursement transactions matching the payment reference should be displayed

@transactionDisbursement4
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

@transactionDisbursement5
Scenario: Validate payment reference copy
    Then I should be able to copy the payment reference

@transactionDisbursement6
Scenario: Export disbursement Transactions
    When I export disbursement transactions
    Then the disbursement transactions export should start successfully

@transactionDisbursement7
Scenario Outline: Export disbursement transactions rows
    When I export "<rows>" disbursement transaction rows
    Then the disbursement export should contain exactly "<rows>" rows

Examples:
    | rows  |
    | 15    |
    | 25    |
    | 50    |
    | 100   |
    | 200   |