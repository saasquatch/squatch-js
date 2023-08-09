@owner:coleton
@author:coleton

Feature: Declarative widgets using custom Web Components

  Background: Squatchjs loader script is included in the head tag
    Given the following squatchjs loader script is in the "head" tag
      """
      <script>!function(a,b){a("squatch","https://fast.ssqt.io/squatch-js@2",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);</script>
      """

  @motivating @automated
  Scenario Outline: Missing or invalid tenant alias
    Given window.squatchTenant is <tenantValue>
    And either web-component is included in the page's HTML
    And the widget has a valid widget type
    Then the web-component throws an error while loading
    And an iframe is not loaded into the DOM

    Examples:
      | tenantValue |
      | null        |
      | undefined   |
      | ""          |

  @motivating @automated
  Scenario Outline: Rendering a passwordless widget
    Given window.squatchToken is <tokenValue>
    And either web-component is included in the page's HTML
    And the widget has a valid widget type
    When the component loads
    Then squatchjs requests the widget with no user information
    And the widget is a passwordless widget

    Examples:
      | tokenValue |
      | null       |
      | undefined  |
      | ""         |

  @motivating @automated
  Scenario Outline: squatchToken requires a valid user object
    Given window.squatchToken does not include the user object <userField> field
    And either web-component is included in the page's HTML
    And the widget has a valid widget type
    When the component loads
    Then the widget's iframe is loaded into the DOM
    And the widget is a "error" widget

    Examples:
      | userField |
      | accountId |
      | id        |

  @minutia @automated
  Scenario Outline: Missing widget attribute
    Given <component> is included in the page's HTML
    And the widget attribute is set to <widgetType>
    When the component loads
    Then the component throws an error
    And the widget does not render

    Examples:
      | component     | widgetType |
      | squatch-embed | null       |
      | squatch-embed | ""         |
      | squatch-popup | null       |
      | squatch-popup | ""         |

  @motivating @automated
  Scenario Outline: Rendering a basic embedded widget
    Given window.squatchTenant is <tenantAlias>
    And window.squatchToken is <tokenValue>
    And the "squatch-embed" web-component is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    When the component loads
    Then the widget's iframe is loaded into the DOM
    And the widget is a <type> widget

    Examples:
      | tenantAlias | tokenValue    | type         |
      | valid       | null          | passwordless |
      | valid       | ""            | passwordless |
      | invalid     | a valid token | error        |
      | valid       | a valid token | verified     |

  @motivating @automated
  Scenario Outline: Rendering a basic popup widget
    Given window.squatchTenant is <tenantAlias>
    And window.squatchToken is <tokenValue>
    And the "squatch-popup" web-component is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    When the component loads
    Then the widget's iframe is loaded into the DOM
    And the widget's iframe is the only child of a "dialog" element
    And the widget is a <type> widget

    Examples:
      | tenantAlias | tokenValue    | type         |
      | valid       | null          | passwordless |
      | valid       | ""            | passwordless |
      | invalid     | a valid token | error        |
      | valid       | a valid token | verified     |

  @minutia @automated
  Scenario Outline: Rerender on attribute change
    Given window.squatchTenant is "valid"
    And window.squatchToken is <token>
    And the <component> web-component is included in the page's HTML
    And the <attribute> attribute is set to <value>
    And the widget is loaded into the DOM
    When the <attribute> attribute is changed to <newValue>
    Then the new widget is loaded into the DOM
    And the new widget's iframe replaces the previous one

    Examples:
      | token         | component     | attribute | value         | newValue          |
      | a valid token | squatch-embed | widget    | w/widget-type | w/new-widget-type |
      | a valid token | squatch-embed | locale    | en_CA         | en_US             |
      | a valid token | squatch-popup | widget    | w/widget-type | w/new-widget-type |
      | a valid token | squatch-popup | locale    | en_CA         | en_US             |
      | null          | squatch-embed | widget    | w/widget-type | w/new-widget-type |
      | null          | squatch-embed | locale    | en_CA         | en_US             |
      | null          | squatch-popup | widget    | w/widget-type | w/new-widget-type |
      | null          | squatch-popup | locale    | en_CA         | en_US             |

  @minutia @automated
  Scenario Outline: Locale attribute with user locale
    Given window.squatchTenant is set to "tenantalias"
    And window.squatchToken is "a valid token"
    And window.squatchToken encodes a user object which <mayContain> the locale property with value "en_CA"
    And either web-component is included in the page's HTML
    And the "locale" attribute with value "fr_FR" <isOrNotSet> on the web-component
    When the component loads
    Then the returned widget content has translation locale set to <locale>

    Examples:
      | mayContain       | isOrNotSet | locale |
      | does contain     | is set     | fr_FR  |
      | does contain     | is not set | en_CA  |
      | does not contain | is set     | fr_FR  |
      | does not contain | is not set | en_US  |

  @minutia @automated
  Scenario Outline: Opening squatch-popup web component dialog via children
    Given "squatch-popup" is included in the page's HTML
    And the web-component's innerHTML is <ctaHTML>
    And the component has loaded correctly
    And the widget's dialog is closed
    When the child <element> element fires a click event
    Then the widget's dialog is open

    Examples:
      | ctaHTML                                             | element |
      | <span>Click me!</span>                              | span    |
      | <div><button>+</button><span>Click me!</span></div> | button  |
      | <button>Click</button>                              | button  |

  @minutia @automated
  Scenario Outline: Declarative popup widgets can be open by default
    Given window.squatchTenant is "valid"
    And window.squatchToken is "a valid token"
    And the "squatch-popup" web-component is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    And the "open" attribute <isOrNot> set on the "squatch-popup" element
    When the component loads
    And the widget's iframe is loaded into the DOM
    Then the popup widget <isOrNot> displayed on the screen

    Examples:
      | isOrNot |
      | is      |
      | is not  |

  @minutia @automated
  Scenario Outline: Declarative widgets render children via a shadow DOM
    Given <customElement> is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    When the component loads
    Then the shadow DOM's mode is set to "open"
    And the shadom DOM's innerHTML is set to the following
      """
      <style>:host { display: contents; }</style><slot></slot>
      """
    And the widget iframe is slotted into the custom element's shadow DOM
    Examples:
      | customElement |
      | squatch-embed |
      | squatch-popup |

  @minutia @automated
  Scenario Outline: squatch-popup can be opened via .squatchpop
    Given an element with the <className> class exists in the DOM
    And a widget has been loaded correctly using "squatch-popup"
    When the element with the class <className> class is clicked
    Then the widget <mayBe> displayed on the screen

    Examples:
      | className  | mayBe  |
      | squatchpop | is     |
      | asdfasdf   | is not |

  @motivating @automated
  Scenario Outline: Custom widget containers for squatch-embed
    Given "squatch-embed" is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    And the "container" attribute has been set to <selector>
    And an element with attribute <attribute> with value <value> exists in the DOM
    Then the component <loadBehaviour>
    And the widget <mayBe> contained within the corresponding element
    Examples:
      | selector   | attribute | value        | loadBehaviour           | mayBe  |
      | null       | class     | squatchembed | loads                   | is not |
      | null       | id        | squatchembed | loads                   | is not |
      | #container | id        | container    | loads                   | is     |
      | .container | class     | container    | loads                   | is     |
      | #container | class     | container    | throws an error on load | is not |

  @minutia @automated
  Scenario: squatch-embed child elements are used as the loading state
    Given "squatch-embed" is included in the page's HTML
    And it has at least one child element
    When the component loads correctly
    Then the child elements of "squatch-embed" are slotted into its shadowDOM
    When the widget's iframe loads in
    Then the slot element in the web-component's shadowDOM is removed
    And the child elements are no longer visible

  @minutia @automated
  Scenario Outline: squatch-popup has children and there is a .squatchpop trigger in the DOM
    Given "squatch-popup" is included in the page's HTML
    And "squatch-popup" <mayHave> at least one child element
    And an element exists in the DOM with the "squatchpop" class
    And the component has loaded correctly
    When the "squatchpop" element is clicked
    Then the popup widget's dialog element <isOrNot> open
    Examples:
      | mayHave  | isOrNot |
      | does     | is not  |
      | does not | is      |

  @minutia @automated
  Scenario Outline: "squatch-embed" does not look for the default widget container
    Given "squatch-embed" is included in the page's HTML
    And the widget attribute is set to a valid SaaSquatch widget type
    And an element with attribute <attribute> with value <value> exists in the DOM
    When the component loads
    Then the widget iframe is attached to the web-component's shadow DOM
    And is not a child of the element with <attribute> with value <value>
    Examples:
      | attribute | value        |
      | id        | squatchembed |
      | class     | squatchembed |

  @minutia @automated
  Scenario Outline: Opening and closing squatch-popup component
    Given "squatch-popup" is included in the page's HTML
    And the widget's iframe loads correctly into the DOM
    And the dialog element <isOrNotInitial> open
    When the <method> is called on the web component instance
    Then the dialog element <isOrNot> open

    Examples:
      | isOrNotInitial | method | isOrNot |
      | is             | open   | is      |
      | is             | close  | is not  |
      | is not         | open   | is      |
      | is not         | close  | is not  |

  @minutia @automated
  Scenario Outline: Opening and closing squatch-embed component
    Given "squatch-embed" is included in the page's HTML
    And the widget's iframe loads correctly into the DOM
    And the web component <isVisibleInitial>
    When the <method> is called on the web component instance
    Then the web component <isVisible>

    Examples:
      | isVisibleInitial | method | isVisible      |
      | is not visible   | close  | is not visible |
      | is not visible   | open   | is visible     |
      | is visible       | close  | is not visible |
      | is visible       | open   | is visible     |

  @minutia
  Scenario: Legacy API and declarative widgets
    Given "squatch-embed" is included in the page's HTML
    And the "widget" attribute is set to "widget_1"
    And another widget is loaded via the following script
      """
      squatch.ready(function () {
      squatch.init({
      tenantAlias: TENANT_ALIAS
      })
      squatch.widgets().upsertUser({
      widgetType: "widget_2",
      engagementMedium: "EMBED",
      jwt: INSERT_JWT,
      user: INSERT_USER_OBJ,
      }).then(function(response) {
      user = response.user;
      }).catch(function(error){
      console.log(error);
      });
      })
      """
    And an element exists in the DOM with the "squatchembed" id
    When the widgets are loaded
    Then the "widget_1" widget iframe is attached to the "squatch-embed" element's shadow DOM
    And the "widget_2" widget iframe is attached as a child to the element with the "squatchembed" id

  @minutia @footgun
  #TODO Add failing spec
  Scenario: Legacy API and declarative widgets with impact namespacing
    Given "impact-embed" is included in the page's HTML
    And the "widget" attribute is set to "widget_1"
    And another widget is loaded via the following script
      """
      impact.ready(function () {
      impact.init({
      tenantAlias: TENANT_ALIAS
      })
      impact.widgets().upsertUser({
      widgetType: "widget_2",
      engagementMedium: "EMBED",
      jwt: INSERT_JWT,
      user: INSERT_USER_OBJ,
      }).then(function(response) {
      user = response.user;
      }).catch(function(error){
      console.log(error);
      });
      })
      """
    And an element exists in the DOM with the "squatchembed" id
    When the widgets are loaded
    Then the "widget_1" widget iframe is attached to the "impact-embed" element's shadow DOM
    And the "widget_2" widget iframe is NOT attached as a child to the element with the "squatchembed" id


  @landmine
  Scenario: squatch-popup elements without children override the .squatchpop onclick callback
    Given at least 2 "squatch-popup" elements in the page's HTML
    And an element with the "squatchpop" class
    When the components load
    When the widgets' iframes are loaded correctly
    Then the "squatchpop" class element's onclick callback is overridden
    When the "squatchpop" class element is clicked
    Then it opens up the last loaded widget

  @landmine @cant-be-tested
  Scenario Outline: Declarative web components are "display: inline" until component code is loaded
    Given <webComponent> is included in the page's HTML
    When the component loads
    But squatchjs hasn't loaded yet
    Then the element will default to be "display: inline;"
    When squatchjs loads
    Then the element will be set to "display: contents;"

    Examples:
      | webComponent  |
      | squatch-embed |
      | squatch-popup |


  @landmine @automated
  Scenario: Passwordless declarative widgets do not take _saasquatchExtra parameters
    Given window.squatchTenant is set to "tenantalias"
    And window.squatchToken is undefined
    And window.squatchConfig.domain is set to "https://staging.referralsaasquatch.com"
    And "squatch-embed" is included in the page's HTML
    And the "widget" attribute is set to "widgettype"
    And _saasquatchExtra is included in the url with payload as the following
      """
      {
        "www.example.com": {
          "OVERRIDE_TENANTALIAS": {
            "widgetType": "OVERRIDE_WIDGET_TYPE",
            "engagementMedium": "POPUP"
          }
        }
      }
      """
    When the component loads
    Then the component's WidgetAPI "tenantAlias" property is "tenantalias"
    And the component's WidgetAPI "domain" property is "https://staging.referralsaasquatch.com"
    And the component's AnalyticsAPI "domain" property is "https://staging.referralsaasquatch.com"
    And the widget loaded has widgetType "widgettype"
    And the widget will be rendered as a "EMBED" widget

  @minutia
  Scenario: Load event for "squatch-embed" widgets
    Given "squatch-embed" is included in the page's HTML
    And the widget loads correctly
    Then an analytics load event will be logged




