@regression @fullSuite @bulkSendMoney
Feature: Bulk Send Money

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the Send Money page
        And I navigate to bulk column

    # ============================
    # PAGE LOAD & LAYOUT
    # ============================

    @bulkSendMoney1
    Scenario: Verify Bulk Send Money page loads with correct elements
        Then I should see the Send Money page title
        And I should see the Bulk and Single tabs
        And the Bulk tab should be active
        And I should see the Transfer type section

    @bulkSendMoney2
    Scenario: Verify Bank transfer is default on Bulk tab
        Then the Bank transfer type should be selected

    # ============================
    # FORM VALIDATION — BANK TRANSFER
    # ============================

    @bulkSendMoney3
    Scenario: Continue button is disabled when no file is uploaded on Bank transfer
        Then the Continue button should be disabled

    @bulkSendMoney4
    Scenario: File upload success on Bank transfer bulk
        When I select Bank Transfer to Send Money
        And I select "SBP0018808" as the source pocket
        And I upload the "bulk_bank_transfer.xlsx" file
        Then the "bulk_bank_transfer.xlsx" file should be uploaded successfully
        And the Continue button should be enabled

    # ============================
    # FORM VALIDATION — SUB POCKET
    # ============================

    @bulkSendMoney5
    Scenario: Continue button is disabled when no file is uploaded on Sub Pocket
        When I select Sub Pocket to Send Money
        Then the Continue button should be disabled

    @bulkSendMoney6
    Scenario: File upload success on Sub Pocket bulk
        When I select Sub Pocket to Send Money
        And I select "SBP0018808" as the source pocket
        And I upload the "bulk_pocket_to_subpocket.xlsx" file
        Then the "bulk_pocket_to_subpocket.xlsx" file should be uploaded successfully
        And the Continue button should be enabled

    # ============================
    # BANK TRANSFER — FULL FLOW
    # ============================

    @bulkSendMoney7
    Scenario: Successful Bulk Bank Transfer from Primary Pocket
        When I select Bank Transfer to Send Money
        And I select "SBP0018808" as the source pocket
        And I store the source pocket balance
        And I upload the "bulk_bank_transfer.xlsx" file
        Then the "bulk_bank_transfer.xlsx" file should be uploaded successfully
        And the Continue button should be enabled
        When I click Continue
        Then the transaction details page should be displayed
        And the transaction summary should be displayed
        When I click Continue on bulk confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "123456"
        Then all OTP fields should be filled
        When I click Continue after OTP
        Then I should see a successful transaction page
        When I click the View Transaction History button
        Then I should see the Transactions disbursement page
        And the disbursement table should contain the transaction
        When I click the transaction payment reference link
        Then I should see the transaction details page
        And the transaction details should show correct information
        And I capture the transaction details from the page
        And the Print Receipt button should be visible
        And the Download Receipt button should be visible

    # ============================
    # SUB POCKET — FULL FLOW
    # ============================

    @bulkSendMoney8
    Scenario: Successful Bulk Sub Pocket Transfer from Primary Pocket
        When I select Sub Pocket to Send Money
        And I select "SBP0018808" as the source pocket
        And I store the source pocket balance
        And I upload the "bulk_pocket_to_subpocket.xlsx" file
        Then the "bulk_pocket_to_subpocket.xlsx" file should be uploaded successfully
        And the Continue button should be enabled
        When I click Continue
        Then the transaction details page should be displayed
        And the transaction summary should be displayed
        When I click Continue on bulk confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "123456"
        Then all OTP fields should be filled
        When I click Continue after OTP
        Then I should see a successful transaction page
        When I click the View Transaction History button
        Then I should see the Transactions disbursement page
        And the disbursement table should contain the transaction
        When I click the transaction payment reference link
        Then I should see the transaction details page
        And the transaction details should show correct information
        And I capture the transaction details from the page
        And the Print Receipt button should be visible
        And the Download Receipt button should be visible

    # ============================
    # INVALID OTP
    # ============================

    @bulkSendMoney9
    Scenario: Invalid OTP error message on Bulk Bank Transfer
        When I select Bank Transfer to Send Money
        And I select "SBP0018808" as the source pocket
        And I upload the "bulk_bank_transfer.xlsx" file
        Then the "bulk_bank_transfer.xlsx" file should be uploaded successfully
        And the Continue button should be enabled
        When I click Continue
        Then the transaction details page should be displayed
        And the transaction summary should be displayed
        When I click Continue on bulk confirmation page
        Then I should see the OTP verification page
        When I enter the OTP "000000"
        Then all OTP fields should be filled
        When I click Continue after OTP
        Then I should see the invalid OTP error message
