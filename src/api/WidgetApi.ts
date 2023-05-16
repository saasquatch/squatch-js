import Cookies from "js-cookie";
import {
  ConfigOptions,
  EngagementMedium,
  ReferralCookie,
  WidgetConfig,
  WidgetType,
  WithRequired,
} from "../types";
import { doGet, doPost, doPut, doQuery } from "../utils/io";
import {
  validateConfig,
  validateLocale,
  validatePasswordlessConfig,
  validateWidgetConfig,
} from "../utils/validate";
import { RENDER_WIDGET_QUERY } from "./graphql";

/**
 *
 * The WidgetApi class is a wrapper around the Widget Endpoints of the SaaSquatch REST API.
 *
 */
export default class WidgetApi {
  tenantAlias: string;
  domain: string;
  npmCdn: string;

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
  constructor(config: ConfigOptions) {
    const raw = config as unknown; // Flags that we need to validate anything we use from this type
    const clean = validateConfig(raw);
    this.tenantAlias = clean.tenantAlias;
    this.domain = clean.domain;
    this.npmCdn = clean.npmCdn;
  }

  /**
   * Creates/upserts user.
   *
   * @param {Object} params Parameters for request
   * @param {Object?} params.user The user details
   * @param {string} params.user.id The user id
   * @param {string} params.user.accountId The user account id
   * @param {WidgetType} params.widgetType The content of the widget.
   * @param {EngagementMedium?} params.engagementMedium How to display the widget.
   * @param {string?} params.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise} string if true, with the widget template, jsOptions and user details.
   */
  upsertUser(params: WithRequired<WidgetConfig, "user">): Promise<any> {
    const raw = params as unknown;
    const clean = validateWidgetConfig(raw);
    const {
      widgetType,
      engagementMedium = "POPUP",
      jwt,
      user,
    } = clean as WithRequired<WidgetConfig, "user">;

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = encodeURIComponent(user.accountId);
    const userId = encodeURIComponent(user.id);

    const optionalParams = _buildParams({ widgetType, engagementMedium });

    const path = `/api/v1/${tenantAlias}/widget/account/${accountId}/user/${userId}/upsert${optionalParams}`;
    const url = this.domain + path;
    const cookies = Cookies.get("_saasquatch");
    if (cookies) user["cookies"] = cookies;
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
  render(params: WidgetConfig): Promise<any> {
    const raw = params as unknown;
    const clean = validatePasswordlessConfig(raw);
    const { widgetType, engagementMedium = "POPUP", jwt, user } = clean;

    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const accountId = user ? encodeURIComponent(user.accountId) : null;
    const userId = user ? encodeURIComponent(user.id) : null;

    const locale =
      clean.locale ?? validateLocale(navigator.language.replace(/\-/g, "_"));

    const path = `/api/v1/${tenantAlias}/graphql`;
    const url = this.domain + path;
    return new Promise(async (resolve, reject) => {
      try {
        const res = await doQuery(
          url,
          RENDER_WIDGET_QUERY,
          {
            user: userId && accountId ? { id: userId, accountId } : null,
            engagementMedium,
            widgetType,
            locale,
          },
          jwt
        );
        resolve(res?.body?.data?.renderWidget);
      } catch (e) {
        reject(e);
      }
    });
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
  invite({
    emailList = [],
    userId,
    accountId,
    tenantAlias,
  }: {
    emailList: string[];
    userId: string;
    accountId: string;
    tenantAlias: string;
  }): Promise<any> {
    const tenantAliasP = encodeURIComponent(tenantAlias);

    const path = `/api/v1/${tenantAliasP}/mail/referralinvite`;
    const url = this.domain + path;
    const request = {
      sendingAccountId: accountId,
      sendingUserId: userId,
      recipients: emailList,
    };
    return doPost(url, JSON.stringify(request));
  }

  /**
   * Looks up the referral code of the current user, if there is any.
   *
   * @return {Promise<ReferralCookie>} code referral code if true.
   */
  async squatchReferralCookie(): Promise<ReferralCookie> {
    const tenantAlias = encodeURIComponent(this.tenantAlias);
    const _saasquatch = Cookies.get("_saasquatch") || "";

    const cookie = _saasquatch
      ? `?cookies=${encodeURIComponent(_saasquatch)}`
      : ``;

    const url = `${this.domain}/a/${tenantAlias}/widgets/squatchcookiejson${cookie}`;

    const response = await doGet<ReferralCookie>(url);

    return Promise.resolve({
      ...response,
      encodedCookie: _saasquatch,
    });
  }
}

// builds a param string for widgets
function _buildParams({
  widgetType,
  engagementMedium,
}: {
  widgetType?: WidgetType;
  engagementMedium: EngagementMedium;
}) {
  const widgetTypeP = widgetType
    ? `?widgetType=${encodeURIComponent(widgetType)}`
    : ``;
  const engagementMediumP = `${
    widgetType ? "&" : "?"
  }engagementMedium=${encodeURIComponent(engagementMedium)}`;
  const optionalParams = widgetTypeP + engagementMediumP;
  return optionalParams;
}
