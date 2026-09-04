@regression @fullSuite @subPocketDisbursement
Feature: Sub Pocket Disbursement Transactions

    Background:
        Given I am logged into the Sub Pocket Dashboard
        And I navigate to the Disbursement Transactions page

@subPocketDisbursement1
Scenario: Validate Disbursement Transactions page
    Then I should see the Sub Pocket Disbursement Transactions page

@subPocketDisbursement2
Scenario: Validate disbursement transactions table structure
    Then the disbursement transactions table should display the correct columns and rows

@subPocketDisbursement3
Scenario Outline: Search disbursement by payment reference "<reference>"
    When I search using a payment reference "<reference>"
    Then I should see disbursement matching payment reference "<reference>"

Examples:
    | reference           | result                |
    | JIN-S52960165394    | matching transactions |
    | 9999999999          | no transactions       |

@subPocketDisbursement4
Scenario: Search disbursement transactions with a non-existent reference
    When I search using a non-existent disbursement reference "9999999999"
    Then no disbursement transactions should be displayed

@subPocketDisbursement5
Scenario Outline: Filter transactions by Date Range "<dateRange>"
    When I filter disbursement transactions using "<dateRange>" date range
    Then only disbursement transactions within the selected "<dateRange>" range should be displayed

Examples:
    | dateRange |
    | No Filter |
    | Last 1 Day |
    | Last 7 Days |
    | Last 1 Month |
    | Future Date |

@subPocketDisbursement6
Scenario: Validate payment reference copy
    Then I should be able to copy the payment reference

@subPocketDisbursement7
Scenario: Export disbursement Transactions
    When I export disbursement transactions
    Then the disbursement transactions export should start successfully

@subPocketDisbursement8
Scenario: Validate disbursement transaction row information
    Then each disbursement transaction should display valid beneficiary, amount, status, balance and date information

@subPocketDisbursement9
Scenario: Validate disbursement transactions pagination
    Then the disbursement transactions table should display valid pagination controls
