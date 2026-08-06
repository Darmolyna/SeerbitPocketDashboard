Feature: Bulk Send Money

    Background:
        Given I am logged into the Primary Pocket Dashboard
        And I navigate to the send Money section
        And I click bulk section


    Scenario: Bulk Bank Transfer from Primary Pocket

    When I select Bank Transfer to Send Money
    And I select "SBP0000829" as the source pocket
    And I upload the "bulk_bank_transfer.xlsx" file
    Then the "bulk_bank_transfer.xlsx" file should be uploaded successfully
    And the Continue button should be enabled
    When I click Continue
    
    Then the transaction details page should be displayed
    And the transaction summary should be displayed


Scenario: Bulk Sub Pocket Transfer from Primary Pocket

    When I select Sub Pocket to Send Money
    And I select "SBP0000829" as the source pocket
    And I upload the "bulk-sub-pocket.xlsx" file
    Then the "bulk-sub-pocket.xlsx" file should be uploaded successfully
    And the Continue button should be enabled