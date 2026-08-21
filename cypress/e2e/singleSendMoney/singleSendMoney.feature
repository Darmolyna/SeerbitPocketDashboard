@regression @fullSuite @smoke @singleSendMoney
Feature: Single Send Money

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Send Money page
        And I navigate to single column

    # ============================
    # PAGE LOAD & LAYOUT
    # ============================

    @singleSendMoney1
    Scenario: Verify Send Money page loads with correct elements on Single tab
        Then I should see the Send Money page title
        And I should see the Bulk and Single tabs
        And the Single tab should be active
        And I should see the "Send money from" section
        And I should see the source pocket dropdown
        And I should see the Transfer type section

    @singleSendMoney2
    Scenario: Verify Sub pocket column is default on Single tab
        When I click the Sub pocket button
        Then the Sub pocket transfer type should be selected
        And I should see the Pocket ID input field
        And I should see the Amount input field
        And I should see the Narration input field

    # ============================
    # TRANSFER TYPE TOGGLE
    # ============================

    @singleSendMoney3
    Scenario: Toggle from Sub pocket to Bank transfer on Single tab
        When I click the Sub pocket button
        And I click the Bank transfer button
        Then the Bank transfer type should be selected
        And I should see the Account number input field
        And I should see the Select bank dropdown
        And I should see the Account name field
        And I should see the Amount input field
        And I should see the Narration input field

    @singleSendMoney4
    Scenario: Toggle from Bank transfer back to Sub pocket on Single tab
        When I click the Bank transfer button
        And I click the Sub pocket button
        Then the Sub pocket transfer type should be selected
        And I should see the Pocket ID input field

    # ============================
    # FORM VALIDATION — SUB POCKET
    # ============================

    @singleSendMoney5
    Scenario: Continue button is disabled when Sub pocket form is empty
        When I click the Sub pocket button
        Then the Continue button should be disabled

    @singleSendMoney6
    Scenario: Continue button is disabled when Pocket ID is empty on Sub pocket form
        When I click the Sub pocket button
        And I enter amount "5000"
        And I enter narration "Test transfer"
        Then the Continue button should be disabled

    @singleSendMoney7
    Scenario: Continue button is disabled when Amount is empty on Sub pocket form
        When I click the Sub pocket button
        And I enter pocket ID "SBP0000829"
        And I enter narration "Test transfer"
        Then the Continue button should be disabled

    @singleSendMoney8
    Scenario: Successful Sub pocket single transfer
        When I click the Sub pocket button
        And I select the primary pocket "SBP0018808"
        And I store the source pocket balance
        And I enter pocket ID "SBP0020694"
        And I enter amount "1"
        And I enter narration "Automated test transfer"
        And I click the Continue button
        Then I should see the transaction confirmation page
        And I should capture the transaction charge
        When I click the Continue button on confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "123456"
        Then all OTP fields should be filled
        When I click the Continue button after OTP
        Then I should see a successful transaction page
        And I should see the correct balance was debited
        When I click the View Transaction History button
        Then I should see the Transactions disbursement page
        And the disbursement table should contain the transaction
        And the payment reference in the disbursement table should match the success page
        And the transaction status in the disbursement table should match the success page
        And the amount in the disbursement table should be correct
        And the balance in the disbursement table should be correct
        When I click the transaction payment reference link
        Then I should see the transaction details page
        And the transaction details should show correct information
        And the Print Receipt button should be visible
        And the Download Receipt button should be visible
        When I navigate back to the disbursement table
        Then the disbursement table should contain the charge
        And the charge payment reference in the disbursement table should match the success page
        And the charge transaction status in the disbursement table should match the success page
        And the charge amount in the disbursement table should be correct
        And the balance after charge in the disbursement table should be correct
        When I click the charge payment reference link
        Then I should see the charge details page
        And the charge details should show correct information

    @singleSendMoney8a
    Scenario: Insufficient pocket balance for payout on Sub pocket transfer
        When I click the Sub pocket button
        And I select the primary pocket "SBP0018808"
        And I enter pocket ID "SBP0020694"
        And I enter amount "999999"
        And I enter narration "Insufficient balance test"
        And I click the Continue button
        Then I should see the insufficient balance error

    @singleSendMoney8b
    Scenario: Same pocket transfer not allowed error on Sub pocket transfer
        When I click the Sub pocket button
        And I select the primary pocket "SBP0018808"
        And I enter pocket ID "SBP0018808"
        And I enter amount "1"
        And I enter narration "Same pocket transfer test"
        And I click the Continue button
        Then I should see the transaction confirmation page
        And I should capture the transaction charge
        When I click the Continue button on confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "123456"
        Then all OTP fields should be filled
        When I click the Continue button after OTP
        Then I should see the same pocket transfer not allowed error
        
    @singleSendMoney8c
    Scenario: Invalid OTP error message on Sub pocket transfer
        When I click the Sub pocket button
        And I select the primary pocket "SBP0018808"
        And I enter pocket ID "SBP0020694"
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
    # FORM VALIDATION — BANK TRANSFER
    # ============================

    @singleSendMoney9
    Scenario: Continue button is disabled when Bank transfer form is empty
        When I click the Bank transfer button
        Then the Continue button should be disabled

    @singleSendMoney10
    Scenario: Continue button is disabled when Account number is empty on Bank transfer
        When I click the Bank transfer button
        And I enter amount "5000"
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @singleSendMoney11
    Scenario: Continue button is disabled when Bank is not selected on Bank transfer
        When I click the Bank transfer button
        And I enter account number "0780290893"
        And I enter amount "5000"
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @singleSendMoney12
    Scenario: Continue button is disabled when Amount is empty on Bank transfer form
        When I click the Bank transfer button
        And I enter account number "0780290893"
        And I select a bank
        And I enter narration "Bank transfer test"
        Then the Continue button should be disabled

    @singleSendMoney13
    Scenario: Account name auto-generates after valid account number and bank selection
        When I click the Bank transfer button
        And I enter account number "0780290893"
        And I select a bank
        Then the account name should be auto-generated

    @singleSendMoney14
    Scenario: Account number limited to 10 digits
        When I click the Bank transfer button
        And I enter account number "078029089301"
        Then the account number field should contain only 10 digits

    @singleSendMoney15
    Scenario: Successful Bank transfer single send money
        When I click the Bank transfer button
        And I enter account number "0780290893"
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

    # ============================
    # CANCEL BUTTON
    # ============================

    @singleSendMoney16
    Scenario: Cancel button navigates back on Sub pocket form
        When I click the Sub pocket button
        And I enter pocket ID "SBP0000829"
        And I enter amount "1000"
        And I click the Cancel button
        Then I should be navigated away from the send money form

    # ============================
    # SOURCE POCKET DROPDOWN
    # ============================

    @singleSendMoney17
    Scenario: Verify source pocket dropdown displays currency and balance
        Then the source pocket should display a currency code
        And the source pocket should display a pocket ID
        And the source pocket should display a balance

    @singleSendMoney18
    Scenario: Source pocket dropdown opens and shows available pockets
        When I click the source pocket dropdown
        Then I should see a list of available pockets
