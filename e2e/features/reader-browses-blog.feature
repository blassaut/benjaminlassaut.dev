Feature: Reader browses the blog
  As a reader
  I want to browse and read blog posts
  So that I can learn from Benjamin's insights

  Scenario: Blog index loads and shows posts
    Given I am on the blog page
    Then I should see the blog index
    And I should see at least one blog post card

  Scenario: Blog post opens from index
    Given I am on the blog page
    When I click on the first blog post card
    Then I should be on a blog post page
    And I should see the blog post content

  Scenario: Back link returns to blog index
    Given I am reading a blog post
    When I click the back link
    Then I should be on the "/blog" page
