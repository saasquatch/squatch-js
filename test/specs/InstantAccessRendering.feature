@author:coleton
@owner:coleton
Feature: Instant Access Widget rendering

  Background: SquatchJS has been initialized and a tenant exists
    Given a tenant with a program widget
    And SquatchJS has been initialized for a tenant and domain
    And the following object is passed to the Widget API method specified in the spec
      """
      var initObj = {
      widgetType: '<MY_WIDGET>',
      engagementMedium: '<ENGAGEMENT_MEDIUM>',
      };

      """

  @motivating
  Scenario: An Instant Access widget can be loaded using the widget Widget API Method
    Given an environment with valid HTML
    And no container is passed with the initObj
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widget(initObj)
      """
    Then a widget is returned
    And the widget is displayed based on the provided engagementMedium

  @landmine
  Scenario: Loading an Instant Access widget without user information does not fire a Load Analytics API event
    Given a widget is rendered with the code
      """
      squatch.widget(initObj)
      """
    And there is no user object or jwt in the initObj
    When the widget is loaded by squatchJs
    Then there will be no Load Analytics API event

  @landmine
  Scenario: Rendering a Verified Access widget with `squatch.widget` causes component errors
    Given a widget is rendered with the code
      """
      squatch.widget(initObj)
      """
    And there is no user object or jwt in the initObj
    But the widget's components require a full access user jwt
    When the widget is loaded by squatchJs
    Then the components relying on user information will not load correctly

  @minutia
  Scenario: The browser's locale is used to determine the locale of the rendered Instant Acces widget
    Given a widget is rendered with the code
      """
      squatch.widget(initObj)
      """
    And there is no widgetIdent locale
    When squatchjs fetches the widget configuration
    Then the locale is the parsed navigator.language
    And that locale is used to determine widget locale

  @minutia
  Scenario: Instant access widgets respect widgetIdent locale
    Given a widget is rendered with the code
      """
      squatch.widget(initObj)
      """
    And there is a widgetIdent locale
    When squatchjs fetches the widget configuration
    Then the locale is the locale in widgetIdent
    And that locale is used to determine widget locale