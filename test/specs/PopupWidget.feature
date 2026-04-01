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

  @minutia
  Scenario: Initial height is set on the popup iframe from brandingConfig loadingHeight
    Given a widget with brandingConfig that includes a loadingHeight of "350"
    When the popup widget is loaded
    Then the iframe height attribute is set to "350" before content renders

  @minutia
  Scenario: Initial height falls back to body offset height when loadingHeight is not set
    Given a widget with brandingConfig that does not include a loadingHeight
    When the popup widget is loaded
    Then the iframe height attribute is set to the body offset height

  @motivating
  Scenario: Popup widget dialog uses brandingConfig for width sizing
    Given a widget with brandingConfig that includes popup widget sizes
      | minWidth | 200px |
      | maxWidth | 700px |
    When the popup widget is loaded
    Then the dialog element has min-width "200px" and max-width "700px"

  @motivating
  Scenario: Preconnect links are injected for Cloudinary in popup widgets
    Given a popup widget is loaded
    When the iframe content is rendered
    Then the iframe document contains a dns-prefetch link for "https://res.cloudinary.com"
    And the iframe document contains a preconnect link for "https://res.cloudinary.com" with crossorigin

  @motivating
  Scenario: Popup preconnect links for brand font are injected when brandFont is configured
    Given a widget with brandingConfig that includes a brandFont of "Open Sans"
    When the popup widget is loaded
    Then the iframe document contains a preconnect link for fonts.gstatic.com
    And the iframe document contains a preconnect link for fonts.googleapis.com
    And the iframe document contains a preload link for the Google Fonts CSS for "Open Sans"

  @minutia
  Scenario: HTML is hidden until ready via visibility style in popup widgets
    Given a popup widget is loaded
    When the iframe content is rendered
    Then the iframe document contains a style tag with "html { visibility:hidden;}"