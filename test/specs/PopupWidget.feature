@author:derek
@owner:sam
Feature: Pop-Up Widget

  Background: SquatchJS has been initialized
    Given a tenant with a widget
    And SquatchJS has been initialized for a tenant and domain
    And the following object is used to pass to the Widget API upsert User method
      """""
      var initObj = {
      id: 'joe',
      accountId: 'joe',
      widgetType: '<MY_WIDGET>',
      user: {
      id: 'joe',
      accountId: 'joe',
      },
      jwt: "<MY_JWT>",
      engagementMedium: 'POPUP',
      };

      """

  @motivating
  Scenario: Pop Up widgets must be opened to be shown
    Given SquatchJS has been initialized for a tenant and domain
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      }).catch(function(error){
      console.log(error);
      });

      """
    Then a dialog element with the id 'squatchModal' is created with the following CSS styles
      | style     | value |
      | padding   | 0     |
      | width     | 100%  |
      | border    | none  |
      | max-width | 500px |
    And the dialog is appended to the page body
    Then the widget is loaded into an iframe in the dialog element
    When '.open()' is called on the returned widget
    Then the dialog element opens
    And the widget is displayed

  @motivating
  Scenario Outline: Opening a Pop Up widget fires a refresh event
    Given a Pop Up widget has been loaded
    But <exception>
    When '.open()' is called on the widget
    Then the Pop Up is displayed
    And a 'sq:refresh' event is dispatched
    Examples:
      | exception              |
      | hasn't been opened yet |
      | is closed              |

  @motivating
  Scenario: Pop Up widgets can be closed with the 'close' method
    Given a Pop Up widget has been loaded
    And it is opened
    When '.close()' is called on widget
    Then the Pop Up is closed

  @motivating
  Scenario: A Pop up widget can be opened with a default trigger
    Given no selector is passed as a trigger in the initObj
    And there is an element with the class 'squatchpop'
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      }).catch(function(error){
      console.log(error);
      });
      """
    Then a popup widget is returned
    When the element with the class 'squatchpop' is clicked
    Then it is displayed in an iFrame inside of a modal

  @motivating
  Scenario: A Pop up widget can be opened with a custom trigger
    Given the selector "#openPopup" is passed as a trigger in the initObj
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      }).catch(function(error){
      console.log(error);
      });
      """
    Then a popup widget is returned
    When the element with the id 'openPopup' is clicked
    Then it is displayed in an iFrame inside of a modal

  @motivating
  Scenario: A debug warning is shown if an invalid trigger selector is used
    Given the selector <selector> is passed as a trigger in the initObj
    And the config has "debug" set to "true"
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      }).catch(function(error){
      console.log(error);
      });
      """
    Then a popup widget is returned
    And there will be no onClick trigger on any elements
    And a debug log is shown with the message <errorMessage>
    And the widget can still be loaded with the '.open()' function
      | selector          | errorMessage                                |
      | "{junk}"          | Not a valid selector {junk}                 |
      | {}                | Not a valid selector {}                     |
      | "junk"            | No element found with trigger selector junk |
      | true              | No element found with trigger selector true |
      | () => ".selector" | Not a valid selector () => ".selector"      |


