@regression @fullSuite @smoke @subPocketSendMoney
Feature: Single Send Money (Sub Pocket)

    # Sub-pocket send money is single-only and bank-transfer-only
    # (no bulk/single toggle, no sub-pocket destination).

    Background:
        Given I am logged into the Sub Pocket Dashboard
        And I navigate to the Send Money page

    # ============================
    # PAGE LOAD & LAYOUT
    # ============================

    @subPocketSendMoney1
    Scenario: Verify Send Money page loads with correct elements on Single tab
        Then I should see the Send Money page title
        And the Single tab should be active
        And I should see the "Send money from" section
        And I should see the source pocket dropdown
        And I should see the Account number input field
        And I should see the Select bank dropdown
        And I should see the Account name field
        And I should see the Amount input field
        And I should see the Narration input field

    @subPocketSendMoney2
    Scenario: Verify source pocket displays pocket ID and balance
        Then the source pocket should display a pocket ID
        And the source pocket should display a balance

    # ============================
    # FORM VALIDATION — BANK TRANSFER
    # ============================

    @subPocketSendMoney3
    Scenario: Continue button is disabled when the form is empty
        Then the Continue button should be disabled

    @subPocketSendMoney4
    Scenario: Continue button is disabled when Account number is empty
        When I enter amount "5000"
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @subPocketSendMoney5
    Scenario: Continue button is disabled when Bank is not selected
        When I enter account number "0780290893"
        And I enter amount "5000"
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @subPocketSendMoney6
    Scenario: Continue button is disabled when Amount is empty
        When I enter account number "0780290893"
        And I select a bank
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @subPocketSendMoney7
    Scenario: Account name auto-generates after valid account number and bank selection
        When I enter account number "0780290893"
        And I select a bank
        Then the account name should be auto-generated

    @subPocketSendMoney8
    Scenario: Account number limited to 10 digits
        When I enter account number "078029089301"
        Then the account number field should contain only 10 digits

    # ============================
    # SUCCESSFUL & ERROR FLOWS
    # ============================

    @subPocketSendMoney9
    Scenario: Successful Bank transfer single send money
        When I enter account number "0780290893"
        And I select a bank
        And I enter amount "1"
        And I enter narration "Automated bank transfer"
        And I click the Continue button
        Then I should see the transaction confirmation page
        When I click the Continue button on confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "123456"
        Then all OTP fields should be filled
        When I click the Continue button after OTP
        Then I should see a successful transaction page

    @subPocketSendMoney10
    Scenario: Insufficient pocket balance for payout on Bank transfer
        When I enter account number "0780290893"
        And I select a bank
        And I enter amount "999999"
        And I enter narration "Insufficient balance test"
        And I click the Continue button
        Then I should see the insufficient balance error

    @subPocketSendMoney11
    Scenario: Invalid OTP error message on Bank transfer
        When I enter account number "0780290893"
        And I select a bank
        And I enter amount "1"
        And I enter narration "Invalid OTP test"
        And I click the Continue button
        Then I should see the transaction confirmation page
        When I click the Continue button on confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "000000"
        Then all OTP fields should be filled
        When I click the Continue button after OTP
        Then I should see the invalid OTP error message

    # ============================
    # CANCEL BUTTON
    # ============================

    @subPocketSendMoney12
    Scenario: Cancel button clears the send money form on the Single tab
        When I enter account number "0780290893"
        And I enter amount "1000"
        And I enter narration "Cancel test"
        And I click the Cancel button
        Then the send money form should be cleared
