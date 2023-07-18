@author:derek
@owner:sam
Feature: Embedded Widget

  Background: SquatchJS has been initialized and a tenant exists
    Given a tenant with a widget
    And SquatchJS has been initialized for a tenant and domain
    And the following object is used to pass to the Widget API upsert User method
      """
      var initObj = {
      id: 'joe',
      accountId: 'joe',
      widgetType: '<MY_WIDGET>',
      user: {
      id: 'joe',
      accountId: 'joe',
      },
      jwt: "<MY_JWT>",
      engagementMedium: 'EMBED',
      };

      """

  @motivating
  Scenario Outline: An Embedded widget can be loaded using the upsertUser Widget API Method
    Given an environment with the following HTML <element>
    And no container is passed with the initObj
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      user = response.user;
      }).catch(function(error){
      console.log(error);
      });

      """
    Then an embedded widget is returned
    And it is displayed in an iFrame inside of the 'squatchembed' div as soon as it has loaded
    Examples:
      | element                          |
      | <div class='squatchembed'></div> |
      | <div id='squatchembed'></div>    |

  @minutia
  Scenario Outline: Embedded widgets will be added to the shadow DOM of the container if it exists
    Given a valid container exists in the DOM
    And the container <may> have a shadow DOM
    When the widget is correctly loaded
    Then the widget iframe will be inserted <iframePosition>

    Examples:
      | may      | iframePosition                                       |
      | does     | inside the shadow DOM                                |
      | does not | as a child of the container element in the light DOM |

  @motivating
  Scenario: An Embedded widget can be loaded using a custom container
    Given an valid HTML Element is passed as a container in the initObj
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      widget.open();
      }).catch(function(error){
      console.log(error);
      });

      """
    Then an embedded widget is returned
    And it is displayed in an iFrame inside of the HTML element that was passed

  @motivating
  Scenario Outline: A custom selector can be passed as a container instead of an HTML element
    Given an environment with the following HTML <element>
    And <container> is passed as the container in the initObj
    When the following code is wrapped by 'squatch.ready'
    And is executed
      """
      squatch.widgets().upsertUser(initObj).then(function(response) {
      widget = response.widget;
      widget.open();
      }).catch(function(error){
      console.log(error);
      });

      """
    Then an embedded widget is returned
    And it is displayed inside of <element>
    Examples:
      | container        | element                             |
      | .myCustomElement | <div class="myCustomElement"></div> |
      | #squathEmbed     | <div id="squathEmbed"></div>        |

  @motivating
  Scenario Outline: Embedded widgets loaded with a container are hidden by default
    Given an embedded widget is being loaded
    And <container> is passed as a container in the initObj
    When the widget is loaded using the upsertUser call
    Then it is loaded in an iframe in its container
    But the iframe has the following CSS styles
      | style      | value  |
      | visibility | hidden |
      | height     | 0      |
      | overflow-y | hidden |
    And it is hidden
    When 'open()' is called
    Then the widget's iframe receives the following CSS styles
      | style      | value |
      | visibility | unset |
      | height     | auto  |
      | overflow-y | auto  |
    And the widget is shown
    Examples:
      | container                             |
      | a selector string as the container    |
      | a valid HTML element as the container |

  @motivating
  Scenario Outline: Embedded widgets can be closed with the 'close' method
    Given an embedded widget has been loaded with <container>
    And it is visible
    When 'close()' is called
    Then the widget's parent element receives the following CSS styles
      | style      | value  |
      | visibility | hidden |
      | height     | 0      |
      | overflow-y | hidden |
    And the widget's parent element is hidden in the container
    Examples:
      | container                             |
      | a selector string as the container    |
      | a valid HTML element as the container |
      | no container                          |

  @motivating
  Scenario Outline: Opening an Embedded widget causes a refresh event to be sent
    Given an embedded widget has been loaded with <container>
    But <exception>
    When 'open()' is called
    Then the widget is displayed
    And a 'sq:refresh' event is dispatched
    Examples:
      | container                             | exception               |
      | a selector string as the container    | hasn't been opened      |
      | a selector string as the container    | is closed               |
      | a valid HTML element as the container | hasn't been opened      |
      | a valid HTML element as the container | is closed               |
      | no container                          | it is already displayed |
      | no container                          | is closed               |

  @motivating
  Scenario Outline: No widget is displayed if there is no container, squatchembed or custom selected html element
    Given an environment without a "squatchembed" HTML element
    And an embedded widget being loaded with <container>
    When the widget is loaded using the upsertUser call
    Then the widget is not loaded
    And the following error is thrown
      """
      element with selector <container> not found.
      """
    Examples:
      | container            |
      | 12                   |
      | asdasd               |
      | null                 |
      | .selectorToNoElement |
      | #selectorToNoElement |

  @minutia
  Scenario Outline: An error is logged when the container is not a string or an HTMLElement
    Given an environment without a "squatchembed" HTML element
    And an embedded widget being loaded with <container>
    When the widget is loaded using the upsertUser call
    Then the widget is not loaded
    And the following debug log is shown
      """
      container must be an HTMLElement or string <container>
      """
    And the following error is thrown
      """
      element with selector <container> not found.
      """
    Examples:
      | container                                    |
      | {"myContainer":true}                         |
      | {"innerHTML":"<div>hi</div>"}                |
      | 100                                          |
      | () => <div>my container</div>                |
      | function(){ return <h1>fake container</h1> } |

  @landmine
  @motivating
  Scenario: An Embedded widget is displayed when loaded if a container value is passed during instationation
    #This is actually needed to insure backwards compatibility, we have examples in our docs doing this
    #The logic around displaying when loaded falls on if the container exists in the context
    #In the following case the container does not exist in the context
    Given an environment with the following html element "<div id='test123'></div>"
    When the following code is run
      """
      squatch.api().upsertUser(initObj).then(function (response) {
      const params = {
      content: response.template,
      type: "upsert",
      api: squatch.api,
      domain: squatch.domain,
      npmCdn: squatch.api.npmCdn,
      context: response.user,
      };

      widget = new squatch.EmbedWidget(params, "#test123");
      widget.load();
      });
      """
    Then the 'open' method is not needed to be called to show the widget when its loaded
    And the widget is displayed into the element with 'id="test123"' as soon as its loaded