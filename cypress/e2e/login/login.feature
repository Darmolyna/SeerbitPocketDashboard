@regression @fullSuite @smoke @login
Feature: Login Functionality for flow dashboard
  As a registered user
  I want to log in to my account
  So that I can access the dashboard securely

  Background:
    Given I navigate to the login page
    
    @login1
  Scenario Outline: Login as "<email>" 
    When I enter my email "<email>"
    And I enter my password "<password>"
    And I click the Sign In button
    Then the system should display "<result>"

    Examples:
  | email                           | password           | result                      | tag       |
  | test@seerbit.com               | Test@1234            | JABARI INC.                | positive Primary Pocket |
  | ayomide.afolabi@seerbit.com    | Password@@1           | JABARI INC.                | positive Sub Pocket |
  | invalid@example.com             | ValidPassword123   | Invalid Login Credentials     | negative  |
  | test@seerbit.com                | WrongPassword      | Invalid Login Credentials     | negative  |


    @login2
  Scenario: Forgot Password button and page load validation
    When I click the Forgot Password link
    Then I should be redirected to the Forgot Password page

    @login3
  Scenario: Password visibility toggle
    When I enter my password "Password123"
    And I click the password visibility icon
    Then the password should become visible