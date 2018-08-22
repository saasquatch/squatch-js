//@ts-check
import superagent from "superagent";
import Promise from "../utils/Promise";
import { validate } from "jsonschema";
import "string.prototype.includes"; // Polyfill

import { doPost, doPut, doRequest } from "../utils/io";

// @ts-ignore
import CookieUser from "./schema/CookieUser.schema.json";
// @ts-ignore
import UpsertUser from "./schema/UpsertUser.schema.json";
// import ApplyReferralCode from "./schema/ApplyReferralCode.schema.json"
// import User from "./schema/User.schema.json"
// import UserLookup from "./schema/UserLookup.schema.json"
// import UserReferralCode from "./schema/UserReferralCode.schema.json"

function validateInput(props, schema) {
  let o = validate(props, schema);
  if (!o.valid) throw o.errors;
}

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
   * var WidgetApi = require('@saasquatch/squatch-js').WidgetApi;
   * var squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {WidgetApi} from '@saasquatch/squatch-js';
   * let squatchApi = new WidgetApi({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor(config) {
    if (!config.tenantAlias) throw new Error("tenantAlias not provided");
    this.tenantAlias = config.tenantAlias;
    this.domain = config.domain || "https://app.referralsaasquatch.com";
  }

  /**
   * Creates/upserts an anonymous user.
   *
   * @param {Object} params Parameters for request
   * @param {WidgetType} params.widgetType The content of the widget.
   * @param {EngagementMedium} params.engagementMedium How to display the widget.
   * @param {User} params.user An optional user object 
   * @param {string} params.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise} json object if true, with the widget template, jsOptions and user details.
   */
  cookieUser(params) {
    validateInput(params, CookieUser);
    const { widgetType, engagementMedium = "POPUP", jwt, user } = params;
    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const optionalParams = _buildParams({widgetType, engagementMedium})
    const path = `/api/v1/${tenantAlias}/widget/user/cookie_user${optionalParams}`;
    const url = this.domain + path;

    return doPut(
      url,
      // TODO: This seems like a clear and present bug
      JSON.stringify(user ? user : {}),
      jwt
    );
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
  upsertUser(params) {
    validateInput(params, UpsertUser);
    const { widgetType, engagementMedium = "POPUP", jwt, user } = params;

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(user.accountId);
    const userId = encodeURIComponent(user.id);

    const optionalParams = _buildParams({widgetType, engagementMedium})

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/upsert${optionalParams}`;
    const url = this.domain + path;

    return doPut(url, JSON.stringify(user), jwt);
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
  render(params) {
    validateInput(params, UpsertUser);
    const { widgetType, engagementMedium = "POPUP", jwt, user } = params;

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(user.accountId);
    const userId = encodeURIComponent(user.id);
    const optionalParams = _buildParams({widgetType, engagementMedium})

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/render${optionalParams}`;
    const url = this.domain + path;
    return doRequest(url, jwt);
  }

  /**
   * An API call to send out referral invites to contacts
   *
   * @param {Object} params Parameters for request
   * @param {Array} params.emailList The list of recipients to send to
   * @param {string} params.userId The user id
   * @param {string} params.accountId The user account id
   * @param {string} params.tenantAlias The tenant alias
   *
   * @return {Promise} an object containing total accepted / rejected emails send or error
   */
  invite({ emailList = [], userId, accountId, tenantAlias }) {
    const tenantAliasP = encodeURIComponent(tenantAlias);

    const path = `/api/v1/${tenantAliasP}/mail/referralinvite`;
    const url = this.domain + path;
    const request = {
      sendingAccountId: accountId,
      sendingUserId: userId,
      recipients: emailList
    };
    return doPost(url, JSON.stringify(request));
  }

  /**
   * Looks up the referral code of the current user, if there is any.
   *
   * @return {Promise<Object>} code referral code if true.
   */
  squatchReferralCookie() {
    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const url = `${this.domain}/a/${tenantAlias}/widgets/squatchcookiejson`;
    return doRequest(url);
  }
}

// builds a param string for widgets
function _buildParams({ widgetType, engagementMedium }) {
  const widgetTypeP = widgetType
    ? `?widgetType=${encodeURIComponent(widgetType)}`
    : null;
  const engagementMediumP = `${
    widgetType ? "&" : "?"
  }engagementMedium=${encodeURIComponent(engagementMedium)}`;
  const optionalParams = widgetTypeP + engagementMediumP;
  return optionalParams;
}
