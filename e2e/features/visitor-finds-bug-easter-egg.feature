Feature: Visitor finds the deliberate bug easter egg
  As a visitor
  I want to discover the deliberate bug in the skills section
  So that I can learn about the site's QA practices

  Scenario: Bug-tagged Playwright skill appears in Infrastructure
    Given I am on the homepage
    When I scroll to the skills section
    Then I should see a bug-tagged skill in the infrastructure category

  Scenario: Hovering the bug tag reveals the popover
    Given I am on the homepage
    When I scroll to the skills section
    And I hover the bug-tagged skill
    Then I should see the bug popover with a link to the QA page

  Scenario: Clicking the QA link in the popover navigates to the QA page
    Given I am on the homepage
    When I scroll to the skills section
    And I hover the bug-tagged skill
    And I click the QA link in the popover
    Then I should be on the QA page
