Feature: Primary Pocket Dashboard

  Background:
    Given I am logged into the Primary Pocket Dashboard

  Scenario: Verify Dashboard Page
        Then I should see the Dashboard title
        And I should see the Your Balances section
        And I should see the Quick Actions section
        And I should see the Exchange Rates section
        And I should see the Recent Transactions section

    Scenario: Verify Sidebar Menus
        Then I should see the Home menu
        And I should see the Transactions menu
        And I should see the Accounts menu
        And I should see the Audit Log menu
        And I should see the Send Money menu
        And I should see the Settings menu

    Scenario: Open Send Money
        When I click Send Money Quick Action
        Then I should be redirected to the Send Money page

    Scenario: Navigate to Transactions
        When I click Transactions menu
        Then I should navigate to Transactions page

    Scenario: Navigate to Accounts
        When I click Accounts menu
        Then I should navigate to Accounts page

    Scenario: Navigate to Audit Log
        When I click Audit Log menu
        Then I should navigate to Audit Log page

    Scenario: Navigate to Settings
        When I click Settings menu
        Then I should navigate to Settings page

    Scenario: Logout
        When I click Logout
        Then I should be redirected to Login page