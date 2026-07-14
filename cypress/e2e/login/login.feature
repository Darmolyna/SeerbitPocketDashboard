Feature: Login Functionality for flow dashboard
  As a registered user
  I want to log in to my account
  So that I can access the dashboard securely

  Background:
    Given I navigate to the login page
    
    @regression @fullSuite @smoke @login
  Scenario: Login with valid credentials
    When I enter my email "test@example.com"
    And I enter my password "Password123"
    And I click the Sign In button
    Then I should be redirected to the dashboard

    @regression @fullSuite @smoke @login
  Scenario: Login with invalid credentials
    When I enter my email "wrong@example.com"
    And I enter my password "wrongpassword"
    And I click the Sign In button
    Then I should see a login error message

    @regression @fullSuite @smoke @login
  Scenario: Forgot Password link
    When I click the Forgot Password link
    Then I should be redirected to the Forgot Password page

    @regression @fullSuite @smoke @login
  Scenario: Password visibility toggle
    When I enter my password "Password123"
    And I click the password visibility icon
    Then the password should become visible