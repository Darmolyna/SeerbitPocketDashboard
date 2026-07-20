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

Scenario: Verify Quick action section Send Money, Convert Funds and Create a sub pocket button works
        Then I should see the Dashboard title
        When I click the send money button 
        Then I should see the send money page
        When I click the convert funds button 
        Then I should see the convert funds page
        When I click the create a sub pocket button 
        Then I should see the create a sub pocket page


Scenario: Validate Exchange rate section and see all our rate page
        Ans I should see the Exchange Rates section
        And I should see the Currency and Rate headers
        Then every currency should have a corresponding exchange rate
        When I click on See all our rates
        Then I should be redirected to the Exchange Rates page
        Then I validate that every currency conversion row should contain valid data in Exchange rate page

Scenario: Validate Recent Transactions section and see all transactions page