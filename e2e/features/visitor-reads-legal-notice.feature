Feature: Visitor reads the legal notice
  As a visitor
  I want to read the legal notice
  So that I know who publishes the site and how my data is handled

  Scenario: Legal notice is reachable from the footer
    Given I am on the homepage
    When I click the "Legal Notice" footer link
    Then I should be on the "/legal" page
    And I should see the legal notice page

  Scenario: Legal notice shows publisher, incubator, hosting and data sections
    Given I am on the legal page
    Then I should see the "Website publisher" legal section
    And I should see the "Professional status" legal section
    And I should see the "Hosting" legal section
    And I should see the "Intellectual property" legal section
    And I should see the "Personal data" legal section

  Scenario: Contact form link scrolls to the contact section on the homepage
    Given I am on the legal page
    When I click the contact form link
    Then the contact section should be scrolled into view
