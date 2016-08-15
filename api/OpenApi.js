class OpenApi {

    //TODO:
    // - Add JSON Schema validation
    // - Authenticate with JWT

    constructor(config) {
      this.tenantAlias = config.tenantAlias;
      this.encodedTenantAlias = encodeURIComponent(this.tenantAlias);
      this.API_KEY = config.API_KEY;
      this.domain = "https://app.referralsaasquatch.com";
    }

    createUser(user) {
      let path =  "/api/v1/" + this.encodedTenantAlias + "/open/account/" + encodeURIComponent(user.accountId) + "/user/" + encodeURIComponent(user.id);
      let url = this.domain + path;
      return this.doPost(url, JSON.stringify(user));
    }

    lookUpUser(accountId, userId) {
      let path = "/api/v1/" + this.encodedTenantAlias + "/open/account/" + encodeURIComponent(accountId) + "/user/" + encodeURIComponent(userId);
      let url = this.domain + path;
      return this.doRequest(url);
    }

    getUserByReferralCode(referralCode) {
      let path = "/api/v1/" + this.encodedTenantAlias + "/open/user?referralCode=" + encodeURIComponent(referralCode);
      let url = this.domain + path;
      return this.doRequest(url);
    }

    lookUpReferralCode(referralCode) {
      let path = "/api/v1/" + this.encodedTenantAlias + "/open/code/" + encodeURIComponent(referralCode);
      let url = this.domain + path;
      return this.doRequest(url);
    }

    applyReferralCode(referralCode, accountId, userId) {
      let path = "/api/v1/" + this.encodedTenantAlias + "/open/code/" + encodeURIComponent(referralCode) + "/account/" + encodeURIComponent(accountId) + "/user/" + encodeURIComponent(userId);
      let url = this.domain + path;
      return this.doPost(url, JSON.stringify(""));
    }

    listReferrals() {
      let path = "/api/v1/" + this.encodedTenantAlias + "/open/referrals";
      let url = this.domain + path;
      return this.doRequest(url);
    }

    doRequest(url) {
      return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(":" + this.API_KEY),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function(response) {
        return response.json()
      });
    }

    doPost(url, data) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(":" + this.API_KEY),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      }).then(function(response) {
        return response.json()
      });
    }

}

export default OpenApi;
