import debug from "debug";
import { ConfigOptions, WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { validatePasswordlessConfig } from "./validate";

/** @hidden */
const _log = debug("squatch-js");

export function _getConfig(
  configIn: ConfigOptions
): { widgetConfig: WidgetConfig; squatchConfig: ConfigOptions } | undefined {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const refParam = urlParams.get("_saasquatchExtra") || "";

  if (!refParam) {
    _log("No _saasquatchExtra param");
    return;
  }

  let raw: any;

  try {
    raw = JSON.parse(b64decode(refParam));
  } catch (e) {
    _log("Unable to decode _saasquatchExtra config");
    return;
  }

  const { domain, tenantAlias, widgetConfig } = convertExtraToConfig(raw);
  if (!domain || !tenantAlias || !widgetConfig) {
    _log("_saasquatchExtra did not have an expected structure");
    return undefined;
  }

  const { autoPopupWidgetType, ...rest } = widgetConfig;

  return {
    widgetConfig: {
      widgetType: autoPopupWidgetType,
      ...rest,
    },
    squatchConfig: {
      ...(configIn ? { configIn } : {}),
      domain,
      tenantAlias,
    },
  };
}

/**
 * Converts _saasquatchExtra into
 * @param obj
 */
export function convertExtraToConfig(obj: Record<string, any>) {
  const domain = Object.keys(obj || {})[0];
  const tenantAlias = Object.keys(obj?.[domain] || {})[0];
  const widgetConfig = obj?.[domain]?.[tenantAlias];

  return { domain, tenantAlias, widgetConfig };
}
