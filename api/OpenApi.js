import JSONSchema from 'jsonschema';
import schema from './schema.json';

var validate = JSONSchema.validate;

class OpenApi {

    //TODO:
    // - Authenticate with JWT

    constructor(config) {
      this.tenantAlias = config.tenantAlias;
      this.API_KEY = config.API_KEY;
      this.domain = "https://app.referralsaasquatch.com";
    }

    createUser(params) {
      this.validateInput(params, schema.user);

      let tenant_alias = encodeURIComponent(this.tenantAlias),
          account_id = encodeURIComponent(params.accountId),
          user_id = encodeURIComponent(params.id);

      let path = `/api/v1/${tenant_alias}/open/account/${account_id}/user/${user_id}`;
      let url = this.domain + path;
      return this.doPost(url, JSON.stringify(params));
    }

    lookUpUser(params) {
      this.validateInput(params, schema.userLookUp);

      let tenant_alias = encodeURIComponent(this.tenantAlias),
          account_id = encodeURIComponent(params.accountId),
          user_id = encodeURIComponent(params.id);

      let path = `/api/v1/${tenant_alias}/open/account/${account_id}/user/${user_id}`;
      let url = this.domain + path;
      return this.doRequest(url);
    }

    getUserByReferralCode(params) {
      this.validateInput(params, schema.userReferralCode);

      let tenant_alias = encodeURIComponent(this.tenantAlias),
          referral_code = encodeURIComponent(params.referralCode);

      let path = `/api/v1/${tenant_alias}/open/user?referralCode=${referral_code}`;
      let url = this.domain + path;
      return this.doRequest(url);
    }

    lookUpReferralCode(params) {
      this.validateInput(params, schema.userReferralCode);

      let tenant_alias = encodeURIComponent(this.tenantAlias),
          referral_code = encodeURIComponent(params.referralCode);

      let path = `/api/v1/${tenant_alias}/open/code/${referral_code}`;
      let url = this.domain + path;
      return this.doRequest(url);
    }

    applyReferralCode(params) {
      this.validateInput(params, schema.applyReferralCode);

      let tenant_alias = encodeURIComponent(this.tenantAlias),
          referral_code = encodeURIComponent(params.referralCode),
          account_id = encodeURIComponent(params.accountId),
          user_id = encodeURIComponent(params.id);

      let path = `/api/v1/${tenant_alias}/open/code/${referral_code}/account/${account_id}/user/${user_id}`;
      let url = this.domain + path;
      return this.doPost(url, JSON.stringify(""));
    }

    listReferrals() {
      let tenant_alias = encodeURIComponent(this.tenantAlias);

      let path = `/api/v1/${tenant_alias}/open/referrals`;
      let url = this.domain + path;
      return this.doRequest(url);
    }

    validateInput (params, schema) {
      let valid = validate(params, schema);
      if(!valid.valid) throw valid.errors;
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
        return response.json();
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
        return response.json();
      });
    }

}

export default OpenApi;
