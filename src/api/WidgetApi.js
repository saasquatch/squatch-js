import 'whatwg-fetch';
import { validate } from 'jsonschema';
import schema from './schema.json';

/**
 *
 * The WidgetApi class is a wrapper around the Widget Endpoints of the SaaSquatch REST API.
 *
 */
export default class WidgetApi {
  /**
   * Initialize a new {@link WidgetApi} instance.
   *
   * @param {Object} config Config details
   * @param {string} config.tenantAlias The tenant to access
   * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
   *    Useful if you want to use a proxy like {@link https://requestb.in/ RequestBin} or {@link https://runscope.com/ Runscope}.
   *
   * @example <caption>Browser example</caption>
   * var squatchApi = new squatch.WidgetApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Browserify/Webpack example</caption>
   * var WidgetApi = require('squatch-js').WidgetApi;
   * var squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {WidgetApi} from 'squatch-js';
   * let squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor(config) {
    if (!config.tenantAlias) throw new Error('tenantAlias not provided');
    this.tenantAlias = config.tenantAlias;
    this.domain = 'https://staging.referralsaasquatch.com';
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {string} params.widgetType (REFERRED_WIDGET/CONVERSION_WIDGET)
   * @param {string} params.engagementMedium (POPUP/MOBILE)
   * @param {string} params.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise} json object if true, with the widget template, jsOptions and user details.
   */
  cookieUser(params = { widgetType: '', engagementMedium: '', jwt: '' }) {
    WidgetApi.validateInput(params, schema.cookieUser);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const widgetType = params.widgetType ? `?widgetType=${encodeURIComponent(params.widgetType)}` : '';
    const engagementMedium = params.engagementMedium ? `${widgetType ? '&' : '?'}engagementMedium=${encodeURIComponent(params.engagementMedium)}` : `${widgetType ? '&' : '?'}engagementMedium=POPUP`;
    const optionalParams = widgetType + engagementMedium;

    const path = `/api/v1/${tenantAlias}/widget/user/cookie_user${optionalParams}`;
    const url = this.domain + path;

    return WidgetApi.doPut(url, JSON.stringify(params.user ? params.user : {}), params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {Object} params.user the user details
   * @param {string} params.user.id
   * @param {string} params.user.accountId
   * @param {string} params.widgetType (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} params.engagementMedium (POPUP/MOBILE)
   * @param {string} params.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise} string if true, with the widget template.
   */
  upsert(params = { widgetType: '', engagementMedium: '', jwt: '' }) {
    WidgetApi.validateInput(params, schema.upsertUser);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.user.accountId);
    const userId = encodeURIComponent(params.user.id);
    const widgetType = params.widgetType ? `?widgetType=${encodeURIComponent(params.widgetType)}` : '';
    const engagementMedium = params.engagementMedium ? `${widgetType ? '&' : '?'}engagementMedium=${encodeURIComponent(params.engagementMedium)}` : `${widgetType ? '&' : '?'}engagementMedium=POPUP`;
    const optionalParams = widgetType + engagementMedium;

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/upsert${optionalParams}`;
    const url = this.domain + path;

    const user = params.user;
    delete user.accountId;
    delete user.id;

    return WidgetApi.doPut(url, JSON.stringify(user), params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {Object} params.user the user details
   * @param {string} params.user.id
   * @param {string} params.user.accountId
   * @param {string} params.widgetType (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} params.engagementMedium (POPUP/MOBILE)
   * @param {string} params.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   * @return {Promise} template html if true.
   */
  render(params = { widgetType: '', engagementMedium: '', jwt: '' }) {
    WidgetApi.validateInput(params, schema.upsertUser);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.user.accountId);
    const userId = encodeURIComponent(params.user.id);
    const widgetType = params.widgetType ? `?widgetType=${encodeURIComponent(params.widgetType)}` : '';
    const engagementMedium = params.engagementMedium ? `${widgetType ? '&' : '?'}engagementMedium=${encodeURIComponent(params.engagementMedium)}` : `${widgetType ? '&' : '?'}engagementMedium=POPUP`;
    const optionalParams = widgetType + engagementMedium;

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/render${optionalParams}`;
    const url = this.domain + path;
    return WidgetApi.doRequest(url, params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {Object} params.code the user details
   * @return {Promise} code referral code if true.
   */
  squatchReferralCookie() {
    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const url = `${this.domain}/a/${tenantAlias}/widgets/squatchcookiejson`;
    return WidgetApi.doRequest(url);
  }

  /**
   * @private
   */
  static validateInput(params, jsonSchema) {
    const valid = validate(params, jsonSchema);
    if (!valid.valid) throw valid.errors;
  }

  /**
   * @private
   */
  static doRequest(url, jwt = '') {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    if (jwt) headers['X-SaaSquatch-User-Token'] = jwt;

    return fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
      mode: 'cors',
    }).then((response) => {
      if (response.ok) {
        return response.text();
      }

      const json = response.json;
      return json.then(Promise.reject.bind(Promise));
    });
  }

  /**
   * @private
   *
   */
  static doPut(url, data, jwt) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SaaSquatch-Referrer': window ? window.location.href : '',
    }

    if (jwt) headers['X-SaaSquatch-User-Token'] = jwt;

    return fetch(url, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      mode: 'cors',
      body: data,
    }).then((response) => {
      const json = response.json();
      if (!response.ok) {
        return json.then(Promise.reject.bind(Promise));
      }
      return json;
    });
  }
}