@testsuite:squatch-js
Feature: Example


    Scenario: Cucumber runs
        Given a "_saasquatch" cookie exists with value "GARBAGE"
        And the url is "https://example.com?_saasquatch=Garb"
        When Squatch.js loads
        Then the "_saasquatch" cookie is set to ""