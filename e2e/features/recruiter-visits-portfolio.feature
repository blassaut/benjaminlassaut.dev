Feature: Recruiter visits portfolio
  As a recruiter
  I want to see Benjamin's experience and skills
  So that I can evaluate him as a candidate

  Scenario: Homepage sections are all visible
    Given I am on the homepage
    Then I should see the hero section
    And I should see the about section
    And I should see the experience section
    And I should see the skills section
    And I should see the blog preview section
    And I should see the contact section

  Scenario: Hero displays name and role
    Given I am on the homepage
    Then I should see "Benjamin Lassaut" in the hero section

  Scenario: Experience entries are displayed
    Given I am on the homepage
    When I scroll to the experience section
    Then I should see at least one experience card

  Scenario: Skills categories are displayed
    Given I am on the homepage
    When I scroll to the skills section
    Then I should see at least one skill category

  Scenario: Navbar stays visible while scrolling
    Given I am on the homepage
    When I scroll down the page
    Then the navbar should still be visible

  Scenario: Footer is visible
    Given I am on the homepage
    When I scroll to the bottom of the page
    Then I should see the footer
