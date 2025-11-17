import { debug } from "debug";
import { ConfigOptions, WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { validateConfig } from "./validate";

/** @hidden */
const _log = debug("squatch-js");

export function _getAutoConfig():
  | { widgetConfig: WidgetConfig; squatchConfig: ConfigOptions }
  | undefined {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const refParam = urlParams.get("_saasquatchExtra") || "";

  if (!refParam) {
    _log("No _saasquatchExtra param");
    return;
  }

  const config = validateConfig();

  if (!config.domain || !config.tenantAlias) {
    _log(
      "domain and tenantAlias must be provided in config to use _saasquatchExtra",
    );
    return;
  }

  let raw: any;

  try {
    raw = JSON.parse(b64decode(refParam));
  } catch (e) {
    _log("Unable to decode _saasquatchExtra config");
    return;
  }

  const { widgetConfig } = convertExtraToConfig(
    config.domain,
    config.tenantAlias,
    raw,
  );
  if (!widgetConfig) {
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
      ...config,
      domain: config.domain,
      tenantAlias: config.tenantAlias,
    },
  };
}

/**
 * Deconstructs _saasquatchExtra into domain, tenantAlias, and widgetConfig
 * @param obj {Record<string, any>} Expected to be of the form `{ [appDomain]: { [tenantAlias]: { autoPopupWidgetType: [widgetType], [rest]?: ... } } }`
 */
export function convertExtraToConfig(
  domain: string,
  tenantAlias: string,
  obj: Record<string, any>,
) {
  const widgetConfig = obj?.[domain]?.[tenantAlias];
  return { widgetConfig };
}
