Feature: Visitor explores "Who tests the tester?"
  As a visitor
  I want to see how this portfolio tests itself
  So that I can appreciate the meta QA approach

  @desktop
  Scenario: "Who tests the tester?" is accessible from desktop navigation
    Given I am on the homepage
    When I click the "qa" nav link
    Then I should be on the "/qa" page

  @mobile
  Scenario: "Who tests the tester?" is accessible from mobile navigation
    Given I am on the homepage
    When I tap the hamburger button
    And I tap the "qa" link in the mobile menu
    Then I should be on the "/qa" page

  Scenario: "Who tests the tester?" displays feature files
    Given I am on the "Who tests the tester?" page
    Then I should see at least one feature file section

  Scenario: Feature files show Gherkin content
    Given I am on the "Who tests the tester?" page
    Then each feature file section should contain Gherkin syntax

  Scenario: CI status badge is displayed
    Given I am on the "Who tests the tester?" page
    Then I should see the CI status badge
