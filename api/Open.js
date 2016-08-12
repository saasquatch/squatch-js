class Open {

    constructor(config) {
      this.tenantAlias = config.tenantAlias;
      this.API_KEY = config.API_KEY;
      this.domain = "https://app.referralsaasquatch.com";
    }

    createUser(user) {
      let path =  "/api/v1/" + this.tenantAlias + "/open/account/" + user.accountId + "/user/" + user.id;
      let url = this.domain + path;
      return this.doPost(url, JSON.stringify(user));
    }

    lookUpUser(accountId, userId) {
      let path = "/api/v1/" + this.tenantAlias + "/open/account/" + accountId + "/user/" + userId;
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

export default Open;
