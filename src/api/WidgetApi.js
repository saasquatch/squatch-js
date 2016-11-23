import superagent from 'superagent';
import Promise from 'es6-promise';
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
   * @param {ConfigOptions} config Config details
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
    this.domain = config.domain || 'https://staging.referralsaasquatch.com';
  }

  /**
   * Creates/upserts an anonymous user.
   *
   * @param {Object} params Parameters for request
   * @param {WidgetType} params.widgetType The content of the widget.
   * @param {EngagementMedium} params.engagementMedium How to display the widget.
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
   * Creates/upserts user.
   *
   * @param {Object} params Parameters for request
   * @param {Object} params.user The user details
   * @param {string} params.user.id The user id
   * @param {string} params.user.accountId The user account id
   * @param {WidgetType} params.widgetType The content of the widget.
   * @param {EngagementMedium} params.engagementMedium How to display the widget.
   * @param {string} params.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise} string if true, with the widget template, jsOptions and user details.
   */
  upsertUser(params = { widgetType: '', engagementMedium: '', jwt: '' }) {
    WidgetApi.validateInput(params, schema.upsertUser);

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(params.user.accountId);
    const userId = encodeURIComponent(params.user.id);
    const widgetType = params.widgetType ? `?widgetType=${encodeURIComponent(params.widgetType)}` : '';
    const engagementMedium = params.engagementMedium ? `${widgetType ? '&' : '?'}engagementMedium=${encodeURIComponent(params.engagementMedium)}` : `${widgetType ? '&' : '?'}engagementMedium=POPUP`;
    const optionalParams = widgetType + engagementMedium;

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/upsert${optionalParams}`;
    const url = this.domain + path;

    const user = Object.assign({}, params.user);
    delete user.accountId;
    delete user.id;

    return WidgetApi.doPut(url, JSON.stringify(user), params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params Parameters for request
   * @param {Object} params.user The user details
   * @param {string} params.user.id The user id
   * @param {string} params.user.accountId The user account id
   * @param {WidgetType} params.widgetType The content of the widget.
   * @param {EngagementMedium} params.engagementMedium How to display the widget.
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
   * Looks up the referral code of the current user, if there is any.
   *
   * @return {Promise<json>} code referral code if true.
   */
  squatchReferralCookie() {
    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const url = `${this.domain}/a/${tenantAlias}/widgets/squatchcookiejson`;
    return WidgetApi.doRequest(url);
  }

  /**
   * @private
   * @param {Object} params json object
   * @param {Object} jsonSchema json schema object
   * @returns {void}
   */
  static validateInput(params, jsonSchema) {
    const valid = validate(params, jsonSchema);
    if (!valid.valid) throw valid.errors;
  }

  static doRequest(url, jwt = '') {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (jwt) headers['X-SaaSquatch-User-Token'] = jwt;

    return superagent
            .get(url)
            .withCredentials()
            .set(headers)
            .then((response) => {
              if (response.headers['content-type'] === 'application/json; charset=utf-8') {
                return JSON.parse(response.text);
              }
              return response.text;
            }, (error) => {
              const json = JSON.parse(error.response.text);
              return Promise.reject(json);
            });
  }

  static doPut(url, data, jwt) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SaaSquatch-Referrer': window ? window.location.href : '',
    };

    if (jwt) headers['X-SaaSquatch-User-Token'] = jwt;

    return superagent
            .put(url)
            .withCredentials()
            .send(data)
            .set(headers)
            .then(response => JSON.parse(response.text),
            (error) => {
              const json = JSON.parse(error.response.text);
              return Promise.reject(json);
            });
  }
}
