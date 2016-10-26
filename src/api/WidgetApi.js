import { validate } from 'jsonschema';
import schema from './schema.json';
import 'whatwg-fetch';

/**
 *
 * The WidgetApi class is a wrapper around the Widget Endpoints of the SaaSquatch REST API.
 *
 */
export class WidgetApi {
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
    this.tenantAlias = config.tenantAlias;
    this.domain = "https://staging.referralsaasquatch.com";
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {string} params.widgetType the type of widget template to load (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} params.engagementMedium the mode of the widget being loaded (POPUP/MOBILE)
   * @return {Promise} json object if true, with the widget template, jsOptions and user details.
   */
  cookieUser(params = { widgetType: "", engagementMedium: "", jwt: "" }) {
    this._validateInput(params, schema.cookieUser);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let widget_type = params.widgetType ? '?widgetType=' + encodeURIComponent(params.widgetType) : '';
    let engagement_medium = params.engagementMedium ? (widget_type ? '&' : '?') + 'engagementMedium=' + encodeURIComponent(params.engagementMedium) : '';
    let optional_params = widget_type + engagement_medium;

    let path = `/api/v1/${tenant_alias}/widget/user/cookie_user${optional_params}`;
    let url = this.domain + path;
    return this._doPut(url, JSON.stringify({}), params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {Object} params.user the user details
   * @param {string} params.user.id
   * @param {string} params.user.accountId
   * @param {string} params.widgetType the type of widget template to load (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} params.engagementMedium the mode of the widget being loaded (POPUP/MOBILE)
   * @return {Promise} string if true, with the widget template.
   */
  upsert(params = { widgetType: "", engagementMedium: "", jwt: ""}) {
    this._validateInput(params, schema.upsertUser);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let account_id = encodeURIComponent(params.user.accountId);
    let user_id = encodeURIComponent(params.user.id);
    let widget_type = params.widgetType ? '?widgetType=' + encodeURIComponent(params.widgetType) : '';
    let engagement_medium = params.engagementMedium ? (widget_type ? '&' : '?') + 'engagementMedium=' + encodeURIComponent(params.engagementMedium) : '';
    let optional_params = widget_type + engagement_medium;

    let path = `/api/v1/${tenant_alias}/widget/account/${account_id}/user/${user_id}/upsert${optional_params}`;
    let url = this.domain + path;
    return this._doPut(url, JSON.stringify(params.user), params.jwt);
  }

  /**
   * Description here.
   *
   * @param {Object} params
   * @param {Object} params.user the user details
   * @param {string} params.user.id
   * @param {string} params.user.accountId
   * @param {string} params.widgetType the type of widget template to load (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} params.engagementMedium the mode of the widget being loaded (POPUP/MOBILE)
   * @return {Promise} template html if true.
   */
  render(params = { widgetType: "", engagementMedium: "", jwt: ""}) {
    this._validateInput(params, schema.upsertUser);

    let tenant_alias = encodeURIComponent(this.tenantAlias);
    let account_id = encodeURIComponent(params.user.accountId);
    let user_id = encodeURIComponent(params.user.id);
    let widget_type = params.widgetType ? '?widgetType=' + encodeURIComponent(params.widgetType) : '';
    let engagement_medium = params.engagementMedium ? (widget_type ? '&' : '?') + 'engagementMedium=' + encodeURIComponent(params.engagementMedium) : '';
    let optional_params = widget_type + engagement_medium;

    let path = `/api/v1/${tenant_alias}/widget/account/${account_id}/user/${user_id}/render${optional_params}`;
    let url = this.domain + path;
    return this._doRequest(url, params.jwt);
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
  _doRequest(url, jwt) {
    let _headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (jwt) _headers['X-SaaSquatch-User-Token'] = jwt;

    return fetch(url, {
      method: 'GET',
      headers: _headers,
      credentials: 'include',
      mode: 'cors'
    }).then(function(response) {
      return response.text();
    });
  }

  /**
   * @private
   */
   _doPut(url, data, jwt) {
     let _headers = {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     }

     if (jwt) _headers['X-SaaSquatch-User-Token'] = jwt;

     return fetch(url, {
       method: 'PUT',
       headers: _headers,
       credentials: 'include',
       body: data
     }).then(function(response) {
       return response.json();
     });
   }
}
