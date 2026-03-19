Feature: Visitor finds the deliberate bug easter egg
  As a visitor
  I want to discover the deliberate bug in the skills section
  So that I can learn about the "Who tests the tester?" page

  Scenario: Bug-tagged Playwright skill appears in Infrastructure
    Given I am on the homepage
    When I scroll to the skills section
    Then I should see a bug-tagged skill in the infrastructure category

  Scenario: Hovering the bug tag reveals the popover
    Given I am on the homepage
    When I scroll to the skills section
    And I hover the bug-tagged skill
    Then I should see the bug popover mentioning the "Who tests the tester?" page

  Scenario: Clicking the popover link navigates to the "Who tests the tester?" page
    Given I am on the homepage
    When I scroll to the skills section
    And I hover the bug-tagged skill
    And I click the "Who tests the tester?" link in the popover
    Then I should be on the "/qa" page
