Feature: Export Transactions and Disbursement Primary Pocket

    Background:
        Given I am logged into the Primary Pocket Dashboard

    @regression @fullSuite @Export @exportTransactions
    Scenario Outline: Export Today transactions 
        And I navigate to the Funding Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportTransactions
    Scenario Outline: Export Yesterday transactions
        And I navigate to the Funding Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportTransactions
    Scenario Outline: Export weekly transactions
        And I navigate to the Funding Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportTransactions
    Scenario Outline: Export monthly transactions
        Ad I navigate to the Funding Transactions page
        And I clcik the Export Transactions button
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











    @regression @fullSuite @Export @exportDisbursement
    Scenario Outline: Export Today Disbursement
        And I navigate to the Disbursement Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportDisbursement
    Scenario Outline: Export Yesterday Disbursement
        And I navigate to the Disbursement Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportDisbursement
    Scenario Outline: Export weekly Disbursement
        And I navigate to the Disbursement Transactions page
        And I clcik the Export Transactions button
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

    @regression @fullSuite @Export @exportDisbursement
    Scenario Outline: Export monthly Disbursement
        And I navigate to the Disbursement Transactions page
        And I clcik the Export Transactions button
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