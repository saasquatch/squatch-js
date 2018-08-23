// @ts-check
import { doPost } from "../utils/io";
import { EngagementMedium, ShareMedium } from "..";

/**
 *
 * The AnalyticsApi class is a wrapper around the Analytics Endpoints of
 * the SaaSquatch REST API. Used to record Widget events.
 *
 * @hidden
 */
export default class AnalyticsApi {
  domain: string;
  /**
   * Initialize a new {@link AnalyticsApi} instance.
   *
   * @param {Object} config Config details
   * @param {string} [config.domain='https://app.referralsaasquatch.com'] The server domain.
   *
   */
  constructor({ domain }: { domain: string }) {
    this.domain = domain || "https://app.referralsaasquatch.com";
  }

  pushAnalyticsLoadEvent(params: {
    tenantAlias: string;
    externalAccountId: string;
    externalUserId: string;
    engagementMedium: EngagementMedium;
  }) {
    const tenantAlias = encodeURIComponent(params.tenantAlias);
    const accountId = encodeURIComponent(params.externalAccountId);
    const userId = encodeURIComponent(params.externalUserId);
    const engagementMedium = encodeURIComponent(params.engagementMedium);

    const path = `/a/${tenantAlias}/widgets/analytics/loaded?externalAccountId=${accountId}&externalUserId=${userId}&engagementMedium=${engagementMedium}`;
    const url = this.domain + path;

    return doPost(url, JSON.stringify({}));
  }

  pushAnalyticsShareClickedEvent(params:{
    tenantAlias: string;
    externalAccountId: string;
    externalUserId: string;
    engagementMedium: EngagementMedium;
    shareMedium: ShareMedium;
  }) {
    const tenantAlias = encodeURIComponent(params.tenantAlias);
    const accountId = encodeURIComponent(params.externalAccountId);
    const userId = encodeURIComponent(params.externalUserId);
    const engagementMedium = encodeURIComponent(params.engagementMedium);
    const shareMedium = encodeURIComponent(params.shareMedium);

    const path = `/a/${tenantAlias}/widgets/analytics/shared?externalAccountId=${accountId}&externalUserId=${userId}&engagementMedium=${engagementMedium}&shareMedium=${shareMedium}`;
    const url = this.domain + path;

    return doPost(url, JSON.stringify({}));
  }
}