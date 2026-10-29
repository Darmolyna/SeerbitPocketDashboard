@regression @fullSuite @smoke @login
Feature: Login Functionality for flow dashboard
  As a registered user
  I want to log in to my account
  So that I can access the dashboard securely

  Background:
    Given I navigate to the login page
    
    @login1
  Scenario Outline: Login as the "<account>" pocket
    When I enter the email for the "<account>" pocket
    And I enter the password for the "<account>" pocket
    And I click the Sign In button
    Then the system should display "<result>"

    Examples:
  | account | result     |
  | primary | JABARI INC. |
  | sub     | JABARI INC. |

  @login1
  Scenario Outline: Login with invalid credentials "<email>"
    When I enter my email "<email>"
    And I enter my password "<password>"
    And I click the Sign In button
    Then the system should display "Invalid Login Credentials"

    Examples:
  | email               | password        |
  | invalid@example.com | ValidPassword123 |
  | test@seerbit.com    | WrongPassword    |


    @login2
  Scenario: Forgot Password button and page load validation
    When I click the Forgot Password link
    Then I should be redirected to the Forgot Password page

    @login3
  Scenario: Password visibility toggle
    When I enter my password "Password123"
    And I click the password visibility icon
    Then the password should become visible
    And I click the password visibility icon again
    Then the password should become hidden again