import 'whatwg-fetch';

/**
 *
 * The AnalyticsApi class is a wrapper around the Analytics Endpoints of
 * the SaaSquatch REST API. Used to record Widget events.
 *
 */
export class AnalyticsApi {
 /**
  * Initialize a new {@link AnalyticsApi} instance.
  *
  * @param {Object} config Config details
  * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
  *
  */
  constructor(config) {
    this.domain = "https://staging.referralsaasquatch.com";
  }

  pushAnalyticsLoadEvent(params) {
    let tenant_alias = encodeURIComponent(params.tenantAlias);
    let account_id = encodeURIComponent(params.externalAccountId);
    let user_id = encodeURIComponent(params.externalUserId);
    let engagement_medium = encodeURIComponent(params.engagementMedium);

    let path = `/a/${tenant_alias}/widgets/analytics/loaded?externalAccountId=${account_id}&externalUserId=${user_id}&engagementMedium=${engagement_medium}`;
    let url = this.domain + path;
    return this._doPost(url, JSON.stringify({}));
  }

  pushAnalyticsShareClickedEvent(params) {
    let tenant_alias = encodeURIComponent(params.tenantAlias);
    let account_id = encodeURIComponent(params.externalAccountId);
    let user_id = encodeURIComponent(params.externalUserId);
    let engagement_medium = encodeURIComponent(params.engagementMedium);
    let share_medium = encodeURIComponent(params.shareMedium);

    let path = `/a/${tenant_alias}/widgets/analytics/loaded?externalAccountId=${account_id}&externalUserId=${user_id}&engagementMedium=${engagement_medium}&shareMedium=${share_medium}`;
    let url = this.domain + path;
    return this._doPost(url, params);
  }

  /**
  * @private
  */
  _doPost(url, data) {

    return fetch(url, {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: data
    }).then(function(response) {
     return response.text();
    });
  }
}
