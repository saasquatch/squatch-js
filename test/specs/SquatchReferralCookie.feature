@author:derek
@owner:sam
Feature: Squatch referral cookie

    @motivating
    Scenario: The squatchReferralCookie function returns the decoded cookie from the browser
        Given a browser with a _saasquatch cookie
        And squatch.js is loaded on the page
        When the following code runs on the on the browser
            """
            squatch.ready(function () {

            squatch.init({
            tenantAlias: "test_acocayt4aov9z",
            domain: "https://staging.referralsaasquatch.com",
            });

            squatch.api().squatchReferralCookie().then(function (response) {
            console.log(response);
            });
            });
            """
        Then inside of the response object is a field called "encodedCookie"
        And it contains the value of the encoded _saasquatch cookie on the browser
