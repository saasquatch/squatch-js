Feature: Namespacing

  window.squatch is aliased by window.impact, and a custom loader script initialises window.impact.ready

  @motivating
  Scenario: Squatchjs loading with the base loader script
    Given the following code is included in the head tag
      """
      <script>
      !(function (a, b) {
      a("squatch", "https://fast.ssqt.io/squatch-js@2", b);
      })(function (a, b, c) {
      var d, e, f;
      (c["_" + a] = {}),
      (c[a] = {}),
      (c[a].ready = function (b) {
      c["_" + a].ready = c["_" + a].ready || [];
      c["_" + a].ready.push(b);
      }),
      (e = document.createElement("script")),
      (e.async = 1),
      (e.src = b),
      (f = document.getElementsByTagName("script")[0]),
      f.parentNode.insertBefore(e, f);
      }, this);
      </script>
      """
    And the following code is included in the head tag
      """
      <script>
      squatch.ready(function(){
      const codes = squatch.api().squatchReferralCookie()
      })
      </script>
      """
    And squatchjs hasn't loaded yet
    Then window.squatch is an object that only contains a ready property
    And window.squatch.ready is a function
    And window._squatch.ready is an array of functions
    But the squatch.api function does not exist
    And window.impact does not exist
    When squatchjs loads completely
    Then the window.squatch is a module
    And window.impact is an alias of window.squatch
    And window._squatch is undefined
    And window.squatch.api exists
    And the function inside the squatch.ready is called

  @motivating
  Scenario: Impact namespacing without custom loader script
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">354000100
      """
    And the following code is included in the head tag
      """
      <script>
      impact.ready(function(){
      const codes = impact.api().squatchReferralCookie()
      })
      </script>
      """
    When the page loads
    Then there will be an error in the console
    And the console error states that "impact is undefined"
    When squatchjs loads completely
    Then window.squatch is a module
    And window.impact is a module
    But the function inside impact.ready is not executed

  @minutia
  Scenario Outline: Declarative widgets work without the need for the custom loader script
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">446713000
      """
    And the web-component <componentTag> is in the body
    When squatchjs loads completely
    Then window.squatch is a module
    And window.impact is a module
    And the web-component correctly loads

    Examples:
      | componentTag  |
      | squatch-embed |
      | squatch-popup |
      | impact-embed  |
      | impact-popup  |

  @motivating
  Scenario: Impact namespacing for Legacy API
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">451725300
      """
    And the following code is included in the head tag
      """
      <script>
      window.impactOnReady = function(){
      const codes = impact.api().squatchReferralCookie()
      }
      </script>
      """
    And squatchjs hasn't loaded
    Then window.impact does not exist
    And the impact.api function does not exist
    When squatchjs loads completely
    Then the window.squatch is a module
    And window.impactOnReady is run
    And window.impact is an alias of window.squatch
    And window.impact.api exists

  @minutia
  Scenario: Impact namespaced valid window variables
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">566341200
      """
    And the following code is included in the head or body tag
      """
      window.impactToken = "VALID_IMPACT_TOKEN"
      window.squatchToken = "VALID_SQUATCH_TOKEN"
      window.impactConfig = {
      domain: "impact-example-domain",
      npmCdn: "impact-example-npm-cdn",
      debug: true
      }
      window.squatchConfig = {
      domain: "squatch-example-domain",
      npmCdn: "squatch-example-npm-cdn",
      debug: true
      }
      window.impactOnReady = () => {
      console.log("first")
      }
      window.squatchOnReady = () => {
      console.log("second")
      }
      """
    When squatchjs loads completely
    Then squatchjs uses "window.impactToken" instead of "window.squatchToken"
    Then squatchjs uses "window.impactConfig" instead of "window.squatchConfig"
    Then squatchjs uses "window.impactOnReady" instead of "window.squatchOnReady"

  @minutia @landmine
  Scenario: Legacy API without loader script
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2">566341200
      """
    And a widget is attempted to be loaded via the following script
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
    When the page loads
    Then an error is shown in the console stating that "impact.ready" does not exist
    And the "widget_2" widget iframe is not attached as a child to the element with the "squatchembed" id

  @landmine
  Scenario: UTT asyncronously overrides the value of squatchToken
    Given the tenant associated in UTT has tenant alias "tenant_alias_utt"
    And the UTT loader script is included in the page's html
    And the following script tag is included in the page's html
    """
    <script>
    window.squatchTenant = "tenant_alias"
    </script>
    """
    When the page loads
    Then the value of window.squatchTenant is "tenant_alias"
    When UTT loads
    Then the value of window.squatchTenant is "tenant_alias_utt"
