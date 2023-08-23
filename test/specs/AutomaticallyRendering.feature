@author:coleton
@owner:coleton

Feature: Automatically rendering an Instant Access Widget

  Background: SquatchJS has been included on the page
    Given a tenant with a widget
    And the squatchJS initialisation code has been included in the page's HTML

  @motivating
  Scenario Outline: SquatchJS can automatically render a widget depending on if _saasquatchExtra is a UTM parameter
    Given the _saasquatchExtra UTM parameter <isInUrl>
    And _saasquatchExtra contains the following fields
      | appDomain   |
      | tenantAlias |
      | widgetType  |
    When squatchJS is initialised using the loader script
    Then the widget <mayBe> rendered as a popup widget

    Examples:
      | isInUrl | mayBe       |
      | is      | will be     |
      | is not  | will not be |

  @landmine
  Scenario: Automatically rendered widgets cannot be embedded widgets
    Given a widget is automatically rendered
    Then the widget is rendered as a Popup Widget
    And there is no way to render it as an Embed Widget