import { debug } from "debug";
import AnalyticsApi, { SQHDetails } from "../api/AnalyticsApi";
import { EngagementMedium } from "../squatch";
import { hasProps, isObject } from "../utils/validate";
const _log = debug("squatch-js:loadEvent");

export function loadEvent(sqh: unknown, analyticsApi: AnalyticsApi) {
  if (!sqh) return; // No non-truthy value
  if (!isObject(sqh)) {
    throw new Error("Widget Load event identity property is not an object");
  }

  let params: SQHDetails;
  if (hasProps<{ programId: string }>(sqh, "programId")) {
    if (
      !hasProps<{
        tenantAlias: string;
        accountId: string;
        userId: string;
        engagementMedium: EngagementMedium;
      }>(sqh, ["tenantAlias", "accountId", "userId", "engagementMedium"])
    ) {
      throw new Error("Widget Load event missing required properties");
    }
    params = {
      tenantAlias: sqh.tenantAlias,
      externalAccountId: sqh.accountId,
      externalUserId: sqh.userId,
      engagementMedium: sqh.engagementMedium,
      programId: sqh.programId,
    };
  } else {
    const { analytics, mode } = sqh as any;
    params = {
      tenantAlias: analytics.attributes.tenant,
      externalAccountId: analytics.attributes.accountId,
      externalUserId: analytics.attributes.userId,
      engagementMedium: mode.widgetMode,
    };
  }

  analyticsApi
    .pushAnalyticsLoadEvent(params)
    ?.then((response) => {
      _log(`${params.engagementMedium} loaded event recorded.`);
    })
    .catch((ex) => {
      _log(new Error(`pushAnalyticsLoadEvent() ${ex}`));
    });
}
