import debug from "debug";
import { ConfigOptions, WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { validatePasswordlessConfig } from "./validate";

/** @hidden */
const _log = debug("squatch-js");

export function _getAutoConfig(
  configIn?: ConfigOptions
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
      displayOnLoad: true,
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
 * Deconstructs _saasquatchExtra into domain, tenantAlias, and widgetConfig
 * @param obj {Record<string, any>} Expected to be of the form `{ [appDomain]: { [tenantAlias]: { autoPopupWidgetType: [widgetType], [rest]?: ... } } }`
 */
export function convertExtraToConfig(obj: Record<string, any>) {
  const _domain = Object.keys(obj || {})[0];
  const tenantAlias = Object.keys(obj?.[_domain] || {})[0];
  const widgetConfig = obj?.[_domain]?.[tenantAlias];

  // domain in _saasquatchExtra doesn't contain "https://"
  const domain = _domain ? `https://${_domain}` : undefined;

  return { domain, tenantAlias, widgetConfig };
}
