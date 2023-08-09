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
      <script async src="https://fast.ssqt.io/squatch-js@2"></script>
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
  Scenario: Declarative widgets work without the need for the custom loader script
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2"></script>
      """
    And the web-component <componentTag> is in the body
    When squatchjs loads completely
    Then window.squatch is a module
    And window.impact is a module
    And the web-component correctly loads

  #TODO Ditch
  @motivating
  Scenario: Impact namespacing with custom loader script
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2"></script>
      <script>
      !(function (a, b) {
      a("impact", b);
      })(function (a, b) {
      #TODO: if b[a]: return;
      (b["_" + a] = {}),
      (b[a] = {}),
      (b[a].ready = function (c) {
      b["_" + a].ready = b["_" + a].ready || [];
      b["_" + a].ready.push(c);
      });
      }, this);
      </script>
      """
    And the following code is included in the head tag
      """
      <script>
      impact.ready(function(){
      const codes = impact.api().squatchReferralCookie()
      })
      </script>
      """
    And squatchjs hasn't loaded yet
    Then window.impact is an object that only contains a ready property
    And window.impact.ready is a function
    And window._impact.ready is an array of functions
    But the impact.api function does not exist
    When squatchjs loads completely
    Then the window.squatch is a module
    And window.impact is an alias of window.squatch
    And window._impact is undefined
    And window.impact.api exists
    And the function inside the impact.ready is called

  # TODO: Add impactOnReady/impactOnLoad/impactReady
  @minutia
  Scenario: Impact namespaced valid window variables
    Given squatchjs is loaded onto the page via the html code below
      """
      <script async src="https://fast.ssqt.io/squatch-js@2"></script>
      """
    And the following code is included in the head or body tag
      """
      window.impactToken = "VALID_TOKEN"
      window.impactConfig = {
      domain: "impact-example-domain",
      npmCdn: "impact-example-npm-cdn"
      debug: true
      }
      """
    When squatchjs loads completely
    Then squatchjs uses "window.impactToken" instead of "window.squatchToken"
    Then squatchjs uses "window.impactConfig" instead of "window.squatchConfig"
