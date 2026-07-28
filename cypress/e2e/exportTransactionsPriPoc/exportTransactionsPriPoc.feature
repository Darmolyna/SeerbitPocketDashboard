Feature: Export Transactions

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Funding Transactions page
        And I clcik the Export Transactions button


    Scenario Outline: Export Today transactions
        And I select the Today date range
        When I select "<Rows>" rows
        Then the Export button should be enabled
        When I export the transactions
        Then the transaction file should be downloaded

    Examples:
        | Rows |
        | 15   |
        | 25   |
        | 50   |
        | 100  |
        | 200  |
        | 500  |
        | 1000 |
    Scenario Outline: Export Yesterday transactions
        And I select the Yesterday date range
        When I select "<Rows>" rows
        Then the Export button should be enabled
        When I export the transactions
        Then the transaction file should be downloaded

    Examples:
        | Rows |
        | 15   |
        | 25   |
        | 50   |
        | 100  |
        | 200  |
        | 500  |
        | 1000 |

    Scenario Outline: Export weekly transactions
        And I select the Weekly date range
        When I select "<Rows>" rows
        Then the Export button should be enabled
        When I export the transactions
        Then the transaction file should be downloaded

    Examples:
        | Rows |
        | 15   |
        | 25   |
        | 50   |
        | 100  |
        | 200  |
        | 500  |
        | 1000 |

    Scenario Outline: Export monthly transactions
        And I select the Monthly date range
        When I select "<Rows>" rows
        Then the Export button should be enabled
        When I export the transactions
        Then the transaction file should be downloaded

    Examples:
        | Rows |
        | 15   |
        | 25   |
        | 50   |
        | 100  |
        | 200  |
        | 500  |
        | 1000 |