import superagent from 'superagent';

/**
 *
 * The AnalyticsApi class is a wrapper around the Analytics Endpoints of
 * the SaaSquatch REST API. Used to record Widget events.
 *
 * @private
 */
export default class AnalyticsApi {
 /**
  * Initialize a new {@link AnalyticsApi} instance.
  *
  * @param {Object} config Config details
  * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
  *
  */
  constructor(config) {
    this.domain = config.domain || 'https://app.referralsaasquatch.com';
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
  * @param {string} url The requested url
  * @param {string} data Stringified json object
  *
  * @returns {Promise} superagent promise
  */
  static doPost(url, data) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return superagent
            .post(url)
            .send(data)
            .set(headers)
            .then(response => response.text);
  }
}
