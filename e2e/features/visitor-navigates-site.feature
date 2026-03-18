Feature: Visitor navigates the site
  As a visitor
  I want to navigate between sections and pages
  So that I can find the information I need

  @desktop
  Scenario Outline: Desktop nav links scroll to sections
    Given I am on the homepage
    When I click the "<section>" nav link
    Then the "<section>" section should be visible

    Examples:
      | section    |
      | about      |
      | experience |
      | skills     |
      | contact    |

  @desktop
  Scenario: Blog link navigates to blog page
    Given I am on the homepage
    When I click the "blog" nav link
    Then I should be on the "/blog" page

  @desktop
  Scenario: Logo navigates back to home
    Given I am on the blog page
    When I click the logo
    Then I should be on the "/" page

  @desktop
  Scenario: Desktop shows nav links and hides hamburger
    Given I am on the homepage
    Then I should see the desktop nav links
    And the hamburger menu should not be visible

  @mobile
  Scenario: Mobile shows hamburger and hides desktop nav
    Given I am on the homepage
    Then I should see the hamburger button
    And the desktop nav links should not be visible

  @mobile
  Scenario: Mobile menu opens and closes
    Given I am on the homepage
    When I tap the hamburger button
    Then the mobile menu should be visible
    When I tap the hamburger button
    Then the mobile menu should not be visible

  @mobile
  Scenario Outline: Mobile menu links navigate to sections
    Given I am on the homepage
    When I tap the hamburger button
    And I tap the "<section>" link in the mobile menu
    Then the mobile menu should not be visible
    And the "<section>" section should be visible

    Examples:
      | section    |
      | about      |
      | experience |
      | skills     |
      | contact    |

  @mobile
  Scenario: Mobile blog link navigates to blog page
    Given I am on the homepage
    When I tap the hamburger button
    And I tap the "blog" link in the mobile menu
    Then I should be on the "/blog" page

  Scenario: Unknown URL shows 404 page
    Given I am on a page that does not exist
    Then I should see the 404 page
    And I should see a link back to the homepage
