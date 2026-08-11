@regression @fullSuite @smoke @subPocketDashboard

Feature: Sub Pocket Dashboard

  Background:
    Given I am logged into the Sub Pocket Dashboard

@subPocketDashboard1
Scenario: Verify Pocket card section of the dashboard 
        Then I should see the Dashboard title
        And I should see the Your Balances section
        And I should see the Recent Transactions section

@subPocketDashboard2
Scenario: Verify Performance section of the Dashboard
        And I should see the Performance section


@subPocketDashboard3
Scenario: Verify Pocket Balance section of the Dashboard
    And I should see the Pocket Balance section
    Scenario: Validate Recent Transactions section and  navigation to see all transactions page
    And I should see the Recent Transactions section
    Then I should see the Recent Transactions section
    And I should see a list of recent transactions
    And each transaction should display valid information
    When I click the See all transactions button
    Then I should be redirected to the Transactions page