Feature: Visitor contacts Benjamin
  As a visitor
  I want to send a message through the contact form
  So that I can get in touch with Benjamin

  Scenario: Contact form is displayed
    Given I am on the homepage
    When I scroll to the contact section
    Then I should see the contact form
    And I should see the name input
    And I should see the email input
    And I should see the message input
    And I should see the submit button

  Scenario: Social links are displayed
    Given I am on the homepage
    When I scroll to the contact section
    Then I should see the "LinkedIn" contact link
    And I should see the "GitHub" contact link
