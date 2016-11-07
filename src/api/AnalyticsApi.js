import 'whatwg-fetch';

/**
 *
 * The AnalyticsApi class is a wrapper around the Analytics Endpoints of
 * the SaaSquatch REST API. Used to record Widget events.
 *
 */
export default class AnalyticsApi {
 /**
  * Initialize a new {@link AnalyticsApi} instance.
  *
  * @param {Object} config Config details
  * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
  *
  */
  constructor() {
    this.domain = 'https://staging.referralsaasquatch.com';
  }


  pushAnalyticsLoadEvent(params) {
    const tenantAlias = encodeURIComponent(params.tenantAlias);
    const accountId = encodeURIComponent(params.externalAccountId);
    const userId = encodeURIComponent(params.externalUserId);
    const engagementMedium = encodeURIComponent(params.engagementMedium);

    const path = `/a/${tenantAlias}/widgets/analytics/loaded?externalAccountId=${accountId}&externalUserId=${userId}&engagementMedium=${engagementMedium}`;
    const url = this.domain + path;

    return AnalyticsApi.doPost(url, JSON.stringify({}));
  }

  pushAnalyticsShareClickedEvent(params) {
    const tenantAlias = encodeURIComponent(params.tenantAlias);
    const accountId = encodeURIComponent(params.externalAccountId);
    const userId = encodeURIComponent(params.externalUserId);
    const engagementMedium = encodeURIComponent(params.engagementMedium);
    const shareMedium = encodeURIComponent(params.shareMedium);

    const path = `/a/${tenantAlias}/widgets/analytics/loaded?externalAccountId=${accountId}&externalUserId=${userId}&engagementMedium=${engagementMedium}&shareMedium=${shareMedium}`;
    const url = this.domain + path;

    return AnalyticsApi.doPost(url, JSON.stringify({}));
  }

  /**
  * @private
  *
  * @param {String} url The requested url
  * @param {String} data Stringified json object
  *
  * @returns {Promise} fetch promise
  */
  static doPost(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    }).then(response => response.text());
  }
}
