@author:coleton
@owner:coleton

Feature: Using squatchjs API calls with declarative widgets

  Background: Squatchjs loader script is included in the head tag
    Given the following squatchjs loader script is in the "head" tag
      """
      <script>!function(a,b){a("squatch","https://fast.ssqt.io/squatch-js@2",b)}(function(a,b,c){var d,e,f;c["_"+a]={},c[a]={},c[a].ready=function(b){c["_" + a].ready =  c["_" + a].ready || [];c["_" + a].ready.push(b);},e=document.createElement("script"),e.async=1,e.src=b,f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(e,f)},this);</script>
      """

  @motivating @automated
  Scenario Outline: AnalyticsAPI defaults to window configuration
    Given the following window.squatchConfig field <field> is set to <value>
    When a AnalyticsApi instance is initialised with property <field> with value <propertyValue>
    Then the property <field> of the AnalyticsApi instance is set to <defaultValue>

    Examples:
      | field  | value                    | propertyValue            | defaultValue                       |
      | domain | null                     | null                     | https://app.referralsaasquatch.com |
      | domain | https://www.example.com  | null                     | https://www.example.com            |
      | domain | null                     | https://www.example.com  | https://www.example.com            |
      | domain | https://www.example1.com | https://www.example2.com | https://www.example2.com           |

  @motivating @automated
  Scenario Outline: Widgets defaults to window configuration
    Given the following window field <windowField> is set to <value>
    When a Widgets instance is initialised with property <field> with value <propertyValue>
    Then the property <field> of the Widgets instance is equal to <defaultValue>

    Examples:
      | windowField          | value                    | field       | propertyValue            | defaultValue                       |
      | squatchTenant        | null                     | tenantAlias | null                     | N/A (ERROR)                        |
      | squatchTenant        | TENANTALIAS              | tenantAlias | null                     | TENANTALIAS                        |
      | squatchTenant        | null                     | tenantAlias | TENANTALIAS              | TENANTALIAS                        |
      | squatchTenant        | TENANTALIAS_1            | tenantAlias | TENANTALIAS_2            | TENANTALIAS_2                      |
      | squatchConfig.domain | null                     | domain      | null                     | https://app.referralsaasquatch.com |
      | squatchConfig.domain | https://www.example.com  | domain      | null                     | https://www.example.com            |
      | squatchConfig.domain | null                     | domain      | https://www.example.com  | https://www.example.com            |
      | squatchConfig.domain | https://www.example1.com | domain      | https://www.example2.com | https://www.example2.com           |
      | squatchConfig.npmCdn | null                     | npmCdn      | null                     | https://fast.ssqt.io/npm           |
      | squatchConfig.npmCdn | https://www.example.com  | npmCdn      | null                     | https://www.example.com            |
      | squatchConfig.npmCdn | null                     | npmCdn      | https://www.example.com  | https://www.example.com            |
      | squatchConfig.npmCdn | https://www.example1.com | npmCdn      | https://www.example2.com | https://www.example2.com           |

  @motivating @automated
  Scenario Outline: EventsApi defaults to window configuration
    Given the following window field <windowField> is set to <value>
    When a EventsApi instance is initialised with property <property> with value <propertyValue>
    Then the property <property> of the EventsApi instance is equal to <defaultValue>

    Examples:
      | windowField          | value                    | property    | propertyValue            | defaultValue                       |
      | squatchTenant        | null                     | tenantAlias | null                     | N/A (ERROR)                        |
      | squatchTenant        | TENANTALIAS              | tenantAlias | null                     | TENANTALIAS                        |
      | squatchTenant        | null                     | tenantAlias | TENANTALIAS              | TENANTALIAS                        |
      | squatchTenant        | TENANTALIAS_1            | tenantAlias | TENANTALIAS_2            | TENANTALIAS_2                      |
      | squatchConfig.domain | null                     | domain      | null                     | https://app.referralsaasquatch.com |
      | squatchConfig.domain | https://www.example.com  | domain      | null                     | https://www.example.com            |
      | squatchConfig.domain | null                     | domain      | https://www.example.com  | https://www.example.com            |
      | squatchConfig.domain | https://www.example1.com | domain      | https://www.example2.com | https://www.example2.com           |

  @motivating @automated
  # Instances are logged in the debug view of the console after init is called
  # EventsAPI doesn't have npmCdn property
  Scenario Outline: squatch.init defaults its values to the window configuration
    Given the following window field <windowField> is set to <value>
    And the init config object has field <property> with value <propertyValue>
    When squatch.init is called with the init config as a parameter
    Then the WidgetApi instance has <property> equal to <defaultValue>
    Then the Widgets instance has <property> equal to <defaultValue>
    Then the EventsApi instance has <property> equal to <defaultValue> if it exists as a property

    Examples:
      | windowField          | value                    | property    | propertyValue            | defaultValue                       |
      | squatchTenant        | null                     | tenantAlias | null                     | N/A (ERROR)                        |
      | squatchTenant        | TENANTALIAS              | tenantAlias | null                     | TENANTALIAS                        |
      | squatchTenant        | null                     | tenantAlias | TENANTALIAS              | TENANTALIAS                        |
      | squatchTenant        | TENANTALIAS_1            | tenantAlias | TENANTALIAS_2            | TENANTALIAS_2                      |
      | squatchConfig.domain | null                     | domain      | null                     | https://app.referralsaasquatch.com |
      | squatchConfig.domain | https://www.example.com  | domain      | null                     | https://www.example.com            |
      | squatchConfig.domain | null                     | domain      | https://www.example.com  | https://www.example.com            |
      | squatchConfig.domain | https://www.example1.com | domain      | https://www.example2.com | https://www.example2.com           |
      | squatchConfig.npmCdn | null                     | npmCdn      | null                     | https://fast.ssqt.io/npm           |
      | squatchConfig.npmCdn | https://www.example.com  | npmCdn      | null                     | https://www.example.com            |
      | squatchConfig.npmCdn | null                     | npmCdn      | https://www.example.com  | https://www.example.com            |
      | squatchConfig.npmCdn | https://www.example1.com | npmCdn      | https://www.example2.com | https://www.example2.com           |

  @minutia @automated
  # Make sure you have "Verbose" checked in the levels dropdown in the console to see debug messaging
  Scenario Outline: squatch.init defaults its debug value to the window configuration
    Given squatchConfig.debug is set to <value>
    And the init config has debug set to <propertyValue>
    When squatch.init is called with the init config as a parameter
    Then debugging information <mayBe> displayed in the debug console

    Examples:
      | value | propertyValue | mayBe  |
      | null  | null          | is not |
      | true  | null          | is     |
      | false | null          | is not |
      | null  | true          | is     |
      | true  | true          | is     |
      | false | true          | is     |
      | null  | false         | is not |
      | true  | false         | is not |
      | false | false         | is not |

  @minutia @cant-be-tested
  Scenario Outline: Squatchjs API methods if squatch.init hasn't been called
    Given I have not called squatch.init or a squatchjs API method
    When I call <method>
    Then squatchjs implicitly calls squatch.init
    And the init method is passed an empty initial config

    Examples:
      | method          |
      | squatch.api     |
      | squatch.widgets |
      | squatch.events  |

  @minutia @cant-be-tested
  Scenario Outline: Squatchjs API methods if impact.init hasn't been called
    Given I have not called impact.init or a squatchjs API method
    When I call <method>
    Then squatchjs implicitly calls impact.init
    And the init method is passed an empty initial config

    Examples:
      | method         |
      | impact.api     |
      | impact.widgets |
      | impact.events  |

  @motivating
  Scenario: Squatchjs API methods without loader script
    Given I have removed the loader script
    And I have included squatchjs via the following script tag
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">193823400
      """
    And the following script tag is included in the head tag
      """
      <script>
      window.squatchOnReady = function () {
      squatch.api()
      squatch.widgets()
      squatch.events()
      }
      </script>
      """
    When squatchjs loads
    Then window.squatch exists
    And the function stored in window.squatchOnReady is called

  @motivating
  Scenario: Squatchjs API namespacced methods without loader script
    Given I have removed the loader script
    And I have included squatchjs via the following script tag
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">193823400
      """
    And the following script tag is included in the head tag
      """
      <script>
      window.impactOnReady = function () {
      impact.api()
      impact.widgets()
      impact.events()
      }
      </script>
      """
    When squatchjs loads
    Then window.squatch exists
    And window.impact is an alias for window.squatch
    And the function stored in window.impactOnReady is called

  @minutia
  Scenario: squatchReferralCookie is aliased by referralCookie under WidgetAPI
    Given I have loaded squatchjs correctly
    Then there is a method "referralCookie" on the WidgetAPI class
    And "referralCookie" is an alias of the "squatchReferralCookie" method