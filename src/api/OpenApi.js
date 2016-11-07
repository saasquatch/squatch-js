import 'whatwg-fetch';
import { validate } from 'jsonschema';
import schema from './schema.json';


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
export default class OpenApi {

  // TODO:
  // - Authenticate with JWT

  /**
   * Initialize a new {@link OpenApi} instance.
   *
   * @param {Object} config Config details
   * @param {string} config.tenantAlias The tenant to access
   * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
   *    Useful if you want to use a proxy like {@link https://requestb.in/ RequestBin} or {@link https://runscope.com/ Runscope}.
   *
   * @example <caption>Browser example</caption>
   * var squatchApi = new squatch.OpenApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Browserify/Webpack example</caption>
   * var OpenApi = require('squatch-js').OpenApi;
   * var squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {OpenApi} from 'squatch-js';
   * let squatchApi = new OpenApi({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor(config) {
    this.tenantAlias = config.tenantAlias;
    this.domain = 'https://staging.referralsaasquatch.com';
  }

  /**
   * This method creates a user and an account in one call. Because this call
   * creates a user, it requires either a write token or an API key.
   *
   * This is an Open Endpoint and disabled by default. Contact support
   * to enable the open endpoints.
   *
   * {@link https://docs.referralsaasquatch.com/api/methods/#open_list_referrals List Referrals}
   *
   * @param {Object} params The User/Account
   * @param {string} params.id the ID of user to be created
   * @param {string} params.accountId the ID of account to be created
   * @return {Promise<User>} details of the user create
   */
  createUser(params) {
    OpenApi.validateInput(params, schema.user);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.accountId);
    const userId = encodeURIComponent(params.id);

    const path = `/api/v1/${tenantAlias}/open/account/${accountId}/user/${userId}`;
    const url = this.domain + path;
    return OpenApi.doPost(url, JSON.stringify(params), 'application/json');
  }

  upsertUser(params) {
    OpenApi.validateInput(params, schema.user);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.accountId);
    const userId = encodeURIComponent(params.id);

    const path = `/api/v1/${tenantAlias}/open/account/${accountId}/user/${userId}`;
    const url = this.domain + path;
    return OpenApi.doPut(url, JSON.stringify(params), 'application/json');
  }

  createCookieUser(params = 'text/html') {
    const responseType = params;
    const tenantAlias = encodeURIComponent(this.tenantAlias);

    const path = `/api/v1/${tenantAlias}/open/user/cookie_user`;
    const url = this.domain + path;
    return OpenApi.doPost(url, JSON.stringify({}), responseType);
  }

  /**
   * Looks up a user based upon their id and returns their personal information
   * including sharelinks. This endpoint requires a read token or an API key.
   *
   * This is an Open Endpoint and disabled by default. Contact support
   * to enable the open endpoints.
   *
   * {@link https://docs.referralsaasquatch.com/api/methods/#open_get_user Open API Spec}
   *
   * @param {Object} params The User/Account
   * @param {string} params.id the ID of user to look up
   * @param {string} params.accountId the ID of account to look up
   * @return {Promise<User>} User details
   */
  lookUpUser(params) {
    OpenApi.validateInput(params, schema.userLookUp);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.accountId);
    const userId = encodeURIComponent(params.id);

    const path = `/api/v1/${tenantAlias}/open/account/${accountId}/user/${userId}`;
    const url = this.domain + path;
    return OpenApi.doRequest(url);
  }

  /**
   * Looks up a user by their Referral Code
   *
   * @param {Object} params stuff
   * @param {string} params.referralCode the code used to look up a user
   * @return {Promise} User details
   */
  getUserByReferralCode(params) {
    OpenApi.validateInput(params, schema.userReferralCode);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const referralCode = encodeURIComponent(params.referralCode);

    const path = `/api/v1/${tenantAlias}/open/user?referralCode=${referralCode}`;
    const url = this.domain + path;

    return OpenApi.doRequest(url);
  }

  /**
   * Looks up a referral code
   *
   * @param {Object} params stuff
   * @param {string} params.referralCode the code used to look up a code
   * @return {Promise} User details
   */
  lookUpReferralCode(params) {
    OpenApi.validateInput(params, schema.userReferralCode);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const referralCode = encodeURIComponent(params.referralCode);

    const path = `/api/v1/${tenantAlias}/open/code/${referralCode}`;
    const url = this.domain + path;
    return OpenApi.doRequest(url);
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
    OpenApi.validateInput(params, schema.applyReferralCode);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const referralCode = encodeURIComponent(params.referralCode);
    const accountId = encodeURIComponent(params.accountId);
    const userId = encodeURIComponent(params.id);

    const path = `/api/v1/${tenantAlias}/open/code/${referralCode}/account/${accountId}/user/${userId}`;
    const url = this.domain + path;
    return OpenApi.doPost(url, JSON.stringify({}), 'application/json');
  }

  /**
   * Lists referrals
   *
   * @return {Promise} Stuff
   */
  listReferrals() {
    const tenantAlias = encodeURIComponent(this.tenantAlias);

    const path = `/api/v1/${tenantAlias}/open/referrals`;
    const url = this.domain + path;
    return OpenApi.doRequest(url);
  }

  /**
   * @private
   *
   * @param {Object} params json object
   * @param {Object} jsonSchema the schema that validates a json object
   * @returns {void}
   */
  static validateInput(params, jsonSchema) {
    const valid = validate(params, jsonSchema);
    if (!valid.valid) throw valid.errors;
  }

  /**
   * @private
   *
   * @param {String} url The requested url
   * @returns {Promise} response
   */
  static doRequest(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
  }

  /**
   * @private
   *
   * @param {String} url
   * @param {String} data stringified JSON object
   */
  static doPost(url, data, responseType) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: responseType,
        'Content-Type': 'application/json',
      },
      body: data,
    }).then((response) => {
      if (responseType === 'text/html') {
        return response.text();
      }

      return response.json();
    });
  }

  /**
   * @private
   */
  static doPut(url, data, responseType) {
    return fetch(url, {
      method: 'PUT',
      headers: {
        Accept: responseType,
        'Content-Type': 'application/json',
        'X-SaaSquatch-User-Token': 'JWT token',
      },
      credentials: 'cors',
      body: data,
      }).then((response) => {
        if (responseType === 'text/html') {
         return response.text();
        }

        return response.json();
    });
  }

}
