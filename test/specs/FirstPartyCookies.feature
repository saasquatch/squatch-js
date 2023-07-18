@owner:sam
@author:jorge
@reviewed:2020-06-09
Feature: First Party Cookies

  Background: Using squatchjs.v2 on a domain
    Given I am using squatchjs
    And it is being loaded on "example.com"
    And I have an active referral program "program1"


  @testsuite:squatch-js
  Scenario: Reads the cookie from the url
    Given  the _saasquatch parameter for the url is "eyJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6eyJ0ZW5hbnRBbGlhc19DT0RFIjp7ImNvZGVzIjp7InByb2dyYW0xIjoiQ09ERTEifSwiY29kZXNFeHAiOnsiQ09ERTEiOjEyMzQ1Njd9fX19"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """

  @testsuite:squatch-js
  Scenario Outline: Invalid parameters are ignored
    Given  the _saasquatch parameter for the url is "<Value>"
    When squatchjs loads
    Then the _saasquatch cookie will not be set for "example.com"

    Examples:
      | Value |
      |       |
      | foo   |
      | 2     |
      | _     |
      | %20   |

  @testsuite:squatch-js
  Scenario: Overwrites cookies during merge
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE0"
            },
            "codesExp": {
              "CODE1": 1111111
            }
          }
        }
      }
      """
    And the _saasquatch parameter for the url is "eyJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6eyJ0ZW5hbnRBbGlhc19DT0RFIjp7ImNvZGVzIjp7InByb2dyYW0xIjoiQ09ERTEifSwiY29kZXNFeHAiOnsiQ09ERTEiOjEyMzQ1Njd9fX19"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """

  @testsuite:squatch-js
  Scenario: Merges cookies during merge
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program2": "CODE2"
            },
            "codesExp": {
              "CODE2": 2222222
            }
          }
        }
      }
      """
    And the _saasquatch parameter for the url is "eyJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6eyJ0ZW5hbnRBbGlhc19DT0RFIjp7ImNvZGVzIjp7InByb2dyYW0xIjoiQ09ERTEifSwiY29kZXNFeHAiOnsiQ09ERTEiOjEyMzQ1Njd9fX19"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program2": "CODE2",
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE2": 2222222,
              "CODE1": 1234567
            }
          }
        }
      }
      """

  # are these two scenarios possible? how so?
  @testsuite:squatch-js
  Scenario: Deep merges cookies during merge
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """
    And a new saasquatch url value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program2": "CODE2"
            },
            "codesExp": {
              "CODE2": 2222222
            }
          }
        }
      }
      """
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1",
              "program2": "CODE2"
            },
            "codesExp": {
              "CODE1": 1234567,
              "CODE2": 2222222
            }
          }
        }
      }
      """

  @testsuite:squatch-js
  Scenario: Deeply overwrites cookies during merge
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE0"
            },
            "codesExp": {
              "CODE1": 1111111
            }
          }
        }
      }
      """
    And a new saasquatch url value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """

  @testsuite:squatch-js
  Scenario: Arrays are replaced instead of merged
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": [
              "abc",
              "def"
            ]
          }
        }
      }
      """
    And the _saasquatch parameter for the url is "ICAgICAgewogICAgICAgICJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6IHsKICAgICAgICAgICJ0ZW5hbnRBbGlhc19DT0RFIjogewogICAgICAgICAgICAiY29kZXMiOiBbImdoaSJdCiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": [
              "ghi"
            ]
          }
        }
      }
      """

  @testsuite:squatch-js
  Scenario Outline: Does not overwite cookie during merge if there is no value
    Given a _saasquatch cookie exists on "example.com"
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """
    And the _saasquatch parameter for the url is "<Url>"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """

    Examples:
      | Url                                      |
      | https://example.com                      |
      | https://example.com?_saasquatch          |
      | https://example.com?_saasquatch=         |
      | https://example.com?_saasquatch=_        |
      | https://example.com?_saasquatch=2        |
      | https://example.com?foo=bar&_saasquatch= |
      | https://example.com?_saasquatch=&foo=bar |

  Scenario: Will not autodrop cookie if opted out
    Given window.SaaSquatchDoNotAutoDrop is a truthy value
    When squatchjs loads
    Then no cookie will be set

  Scenario: Will not overwrite existing cookies from other domains
    Given I have at least one cookie from "exampledupe.com"
    And the _saasquatch parameter for the url is "eyJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6eyJ0ZW5hbnRBbGlhc19DT0RFIjp7ImNvZGVzIjp7InByb2dyYW0xIjoiQ09ERTEifSwiY29kZXNFeHAiOnsiQ09ERTEiOjEyMzQ1Njd9fX19"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """
    And the pre-existing cookies will still be set

  Scenario: Will not overwrite cookies on the same domain
    Given a _googleAnalytics cookie exists on "example.com"
    And  the _saasquatch parameter for the url is "eyJhcHAucmVmZXJyYWxzYWFzcXVhdGNoLmNvbSI6eyJ0ZW5hbnRBbGlhc19DT0RFIjp7ImNvZGVzIjp7InByb2dyYW0xIjoiQ09ERTEifSwiY29kZXNFeHAiOnsiQ09ERTEiOjEyMzQ1Njd9fX19"
    When squatchjs loads
    Then the _saasquatch cookie will be set for "example.com" with value
      """
      {
        "app.referralsaasquatch.com": {
          "tenantAlias_CODE": {
            "codes": {
              "program1": "CODE1"
            },
            "codesExp": {
              "CODE1": 1234567
            }
          }
        }
      }
      """
    And the _googleAnalytics cookie will exist with it's pre-existing value

  Scenario: First party cookie is always set for the root domain
    Given squatch-js is setting a cookie for a landing page "http://subdomain.example.com"
    When squatchjs loads
    Then the cookie's "domain" attribute should be ".example.com"

  Scenario: First party cookie is always set for path "/"
    Given squatch-js is setting a cookie for a landing page "http://example.com/some/long/path"
    When squatchjs loads
    Then the cookie's "path" attribute should be "/"

  Scenario: First party cookie's SameSite attribute is set as "Lax"
    Given squatch-js is setting a cookie for a landing page "http://example.com"
    When squatchjs loads
    Then the cookie's "SameSite" attribute should be "Lax"

  Scenario Outline: First party cookie's should be insecure for HTTP and HTTPS landing pages
    Given squatch-js is setting a cookie for a landing page <url>
    When squatchjs loads
    Then the cookie's "Secure" attribute should be <value>

    Examples:
      | url                   | value |
      | "http://example.com"  | false |
      | "https://example.com" | false |

  Scenario: First party cookie's Expiry attribute is set to one year from date created
    Given squatch-js is setting a cookie for a landing page "http://example.com"
    When squatchjs loads
    Then the cookie's "Expiry" attribute should be "1 year from today"

  @landmine
  Scenario: First party cookie's Expiry attribute is set to one week from date created
    # https://konsole.zendesk.com/hc/en-us/articles/360037845413-Safari-1st-Party-Cookies#:~:text=As%20part%20of%20Apple's%20ITP,time%20you%20visit%20the%20site.
    Given squatch-js is setting a cookie for a landing page "http://example.com"
    When squatchjs loads on a Safari browser
    Then the cookie's "Expiry" attribute should be "1 week from today"

  Scenario: Passing cookie on squatchReferralCookie
    Given I use squatch.api().squatchReferralCookie()
    Then the cookie will be passed through the GET request
    And the param will be "?cookies={cookieValue}"
