// @ts-check
import { doPost } from "../utils/io";
import { EngagementMedium } from "../types";
import { hasProps } from "../utils/validate";

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
  constructor(config: { domain: string }) {
    const raw = config as unknown;
    if (hasProps(raw, "domain") && typeof raw.domain === "string") {
      this.domain = raw.domain;
    } else {
      this.domain = "https://app.referralsaasquatch.com";
    }
  }

  pushAnalyticsLoadEvent(params: SQHDetails) {
    const tenantAlias = encodeURIComponent(params.tenantAlias);
    const accountId = encodeURIComponent(params.externalAccountId);
    const userId = encodeURIComponent(params.externalUserId);
    const engagementMedium = encodeURIComponent(params.engagementMedium);
    const programId = params.programId
      ? `&programId=${encodeURIComponent(params.programId)}`
      : ``;

    const path = `/a/${tenantAlias}/widgets/analytics/loaded?externalAccountId=${accountId}&externalUserId=${userId}&engagementMedium=${engagementMedium}${programId}`;
    const url = this.domain + path;

    return doPost(url, JSON.stringify({}));
  }

  pushAnalyticsShareClickedEvent(params: SQHDetails & { shareMedium: string }) {
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

export type SQHDetails = {
  tenantAlias: string;
  externalAccountId: string;
  externalUserId: string;
  engagementMedium: EngagementMedium;
  programId?: string;
};
