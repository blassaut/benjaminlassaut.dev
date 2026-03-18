Feature: Visitor explores the QA lab
  As a visitor
  I want to see how this portfolio tests itself
  So that I can appreciate the meta QA approach

  @desktop
  Scenario: QA lab is accessible from navigation
    Given I am on the homepage
    When I click the "qa" nav link
    Then I should be on the "/qa" page

  Scenario: QA lab page displays feature files
    Given I am on the QA lab page
    Then I should see at least one feature file section

  Scenario: Feature files show Gherkin content
    Given I am on the QA lab page
    Then each feature file section should contain Gherkin syntax

  Scenario: CI status badge is displayed
    Given I am on the QA lab page
    Then I should see the CI status badge
