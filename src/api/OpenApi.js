import { validate } from 'jsonschema';
import schema from './schema.json';
import 'whatwg-fetch';

/**
 *
 * The OpenApi class is a wrapper around the Open Endpoints of the SaaSquatch REST API.
 *
 * The Open Endpoints in the SaaSquatch REST API are endpoints designed to work
 * in client applications like the Mobile SDK and Javascript SDK.
 * Authentication relies on a User JWT and some API endpoints are unauthenticated.
 * Even though the Open Endpoints are designed for client applications, they can
 * still be used in server-to-server cases using API Key authentication.
 *
 */
export class OpenApi {

  //TODO:
  // - Authenticate with JWT
  // - Add comments

  /**
   * Initialize a new {@link OpenApi} instance.
   *
   * @param {Object} config Config details
   * @param {string} config.tenantAlias The tenant to access
   * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
   *    Useful if you want to use a proxy like {@link https://requestb.in/ RequestBin} or {@link https://runscope.com/ Runscope}.
   *
   * @example <caption>Browser example</caption>
   * var squatchApi = new squatch.OpenApi({tenantAlias:'test_12b5bo1b25125');
   *
   * @example <caption>Browserify/Webpack example</caption>
   * var OpenApi = require('squatch-js').OpenApi;
   * var squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125');
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {OpenApi} from 'squatch-js';
   * let squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125');
   */
  constructor(config) {
    this.tenantAlias = config.tenantAlias;
    this.domain = "https://staging.referralsaasquatch.com";
  }

  /**
   * This method creates a user and an account in one call. Because this call creates a user, it requires either a write token or an API key.
   * This is an Open Endpoint and disabled by default. Contact support to enable the open endpoints.
   *
   * {@link https://docs.referralsaasquatch.com/api/methods/#open_list_referrals List Referrals}
   *
   * @param {Object} params The User/Account
   * @param {string} params.id the ID of user to be created
   * @param {string} params.accountId the ID of account to be created
   * @return {Promise<User>} details of the user create
   */
  createUser(params) {
    this._validateInput(params, schema.user);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let account_id = encodeURIComponent(params.accountId);
    let user_id = encodeURIComponent(params.id);

    let path = `/api/v1/${tenant_alias}/open/account/${account_id}/user/${user_id}`;
    let url = this.domain + path;
    return this._doPost(url, JSON.stringify(params));
  }

  createCookieUser(params = 'text/html') {
    let responseType = params;
    let tenant_alias = encodeURIComponent(this.tenantAlias);

    let path = `/api/v1/${tenant_alias}/open/user/cookie_user`;
    let url = this.domain + path;
    return this._doPost(url, JSON.stringify({}), responseType);
  }

  /**
   * Looks up a user based upon their id and returns their personal information including sharelinks. This endpoint requires a read token or an API key.
   *
   * This is an Open Endpoint and disabled by default. Contact support to enable the open endpoints.
   *
   * {@link https://docs.referralsaasquatch.com/api/methods/#open_get_user Open API Spec}
   *
   * @param {Object} params The User/Account
   * @param {string} params.id the ID of user to look up
   * @param {string} params.accountId the ID of account to look up
   * @return {Promise<User>} User details
   */
  lookUpUser(params) {
    this._validateInput(params, schema.userLookUp);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let account_id = encodeURIComponent(params.accountId);
    let user_id = encodeURIComponent(params.id);

    let path = `/api/v1/${tenant_alias}/open/account/${account_id}/user/${user_id}`;
    let url = this.domain + path;
    return this._doRequest(url);
  }

  /**
   * Looks up a user by their Referral Code
   *
   * @param {Object} params stuff
   * @param {string} params.referralCode the code used to look up a user
   * @return {Promise} User details
   */
  getUserByReferralCode(params) {
    this._validateInput(params, schema.userReferralCode);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let referral_code = encodeURIComponent(params.referralCode);

    let path = `/api/v1/${tenant_alias}/open/user?referralCode=${referral_code}`;
    let url = this.domain + path;
    return this._doRequest(url);
  }

  /**
   * Looks up a referral code
   *
   * @param {Object} params stuff
   * @param {string} params.referralCode the code used to look up a code
   * @return {Promise} User details
   */
  lookUpReferralCode(params) {
    this._validateInput(params, schema.userReferralCode);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let referral_code = encodeURIComponent(params.referralCode);

    let path = `/api/v1/${tenant_alias}/open/code/${referral_code}`;
    let url = this.domain + path;
    return this._doRequest(url);
  }

  /**
   * Applies a referral code
   *
   * @param {Object} params stuff
   * @param {string} params.id the ID of the User that is referred
   * @param {string} params.accountId the Account ID of the User that is referred
   * @param {string} params.referralCode the code to apply
   * @return {Promise} Stuff
   */
  applyReferralCode(params) {
    this._validateInput(params, schema.applyReferralCode);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let referral_code = encodeURIComponent(params.referralCode);
    let account_id = encodeURIComponent(params.accountId);
    let user_id = encodeURIComponent(params.id);

    let path = `/api/v1/${tenant_alias}/open/code/${referral_code}/account/${account_id}/user/${user_id}`;
    let url = this.domain + path;
    return this._doPost(url, JSON.stringify(""));
  }

  /**
   * Lists referrals
   *
   * @return {Promise} Stuff
   */
  listReferrals() {
    let tenant_alias = encodeURIComponent(this.tenantAlias);

    let path = `/api/v1/${tenant_alias}/open/referrals`;
    let url = this.domain + path;
    return this._doRequest(url);
  }

  /**
   * @private
   */
  _validateInput(params, schema) {
    let valid = validate(params, schema);
    if (!valid.valid) throw valid.errors;
  }

  /**
   * @private
   */
  _doRequest(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.json();
    });
  }

  /**
   * @private
   */
  _doPost(url, data, responseType) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': responseType,
        'Content-Type': 'application/json'
      },
      body: data
    }).then(function(response) {
      if (responseType === 'text/html') {
        return response.text();
      } else {
        return response.json();
      }
    });
  }

}
