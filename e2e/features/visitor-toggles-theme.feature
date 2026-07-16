Feature: Visitor toggles the color theme
  As a visitor
  I want to switch between light and dark mode
  So that I can read the site comfortably in any lighting

  @desktop
  Scenario: The site loads in light mode by default
    Given I am on the homepage
    Then the theme should be light

  @desktop
  Scenario: Toggling switches from light to dark and back
    Given I am on the homepage
    When I toggle the theme
    Then the theme should be dark
    When I toggle the theme
    Then the theme should be light

  @desktop
  Scenario: The chosen theme persists across reloads
    Given I am on the homepage
    When I toggle the theme
    Then the theme should be dark
    When I reload the page
    Then the theme should be dark

  @mobile
  Scenario: The theme can be toggled from the mobile header
    Given I am on the homepage
    When I toggle the theme on mobile
    Then the theme should be dark
