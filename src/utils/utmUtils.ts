import debug from "debug";
import { ConfigOptions, WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { validatePasswordlessConfig } from "./validate";

/** @hidden */
const _log = debug("squatch-js");

export function _getWidgetConfig(
  configIn: ConfigOptions
): WidgetConfig | undefined {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const refParam = urlParams.get("_saasquatchExtra") || "";

  if (!refParam) {
    _log("No _saasquatchExtra param");
    return;
  }

  let raw: unknown;

  try {
    raw = JSON.parse(b64decode(refParam));
  } catch (e) {
    _log("Unable to decode _saasquatchExtra config");
    return;
  }
  const scopedObj =
    raw?.[configIn.domain || "https://app.referralsaasquatch.com"]?.[
      configIn.tenantAlias
    ];

  if (!scopedObj) {
    _log("Unable to get relevant information from UTM parameters");
    return;
  }

  const { autoPopupWidgetType, ...rest } = scopedObj;
  return {
    widgetType: autoPopupWidgetType,
    ...rest,
  };
}
