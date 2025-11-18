import { debug } from "debug";
import { ConfigOptions, WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { getConfig } from "./validate";

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

  const config = getConfig();

  if (!config.domain) {
    _log("domain must be provided in config to use _saasquatchExtra");
    return;
  }

  let raw: any;

  try {
    raw = JSON.parse(b64decode(refParam));
  } catch (e) {
    _log("Unable to decode _saasquatchExtra config");
    return;
  }

  // Normalize the domain by removing protocol (e.g., 'https://')
  function normalizeDomain(domain: string): string {
    return domain.replace(/^https?:\/\//, "");
  }

  const normalizedDomain = normalizeDomain(config.domain);

  // _saasquatchExtra is expected to be structured as:
  // {
  //   [domain]: {
  //     [tenantAlias]: {
  //       autoPopupWidgetType: string,
  //       ...otherWidgetConfig
  //     }
  //   }
  // }
  //

  const tenantAlias = Object.keys(raw?.[normalizedDomain] || {})[0];
  const widgetConfig = raw?.[normalizedDomain]?.[tenantAlias];

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
      tenantAlias,
    },
  };
}
