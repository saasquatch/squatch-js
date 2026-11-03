import { debug } from "./logger";
import { WidgetConfig } from "../types";
import { b64decode } from "./cookieUtils";
import { validateConfig } from "./validate";

/** @hidden */
const _log = debug("squatch-js");

/**
 * Reads the auto-popup widget from the `_saasquatchExtra` URL parameter.
 *
 * The URL only selects a widget type for the tenant the page itself declares
 * (via `window.squatchTenant` or a prior `init()`), so a crafted link can't
 * choose which tenant renders on this site or inject any other widget config.
 *
 * @param declared The page's initialised config, if `init()` has already run
 */
export function _getAutoConfig(
  declared?: { tenantAlias?: string; domain?: string } | null,
): WidgetConfig | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get("_saasquatchExtra") || "";

  if (!refParam) {
    _log("No _saasquatchExtra param");
    return;
  }

  const tenantAlias = declared?.tenantAlias || window.squatchTenant;
  if (typeof tenantAlias !== "string" || !tenantAlias) {
    console.warn(
      "squatch-js: _saasquatchExtra ignored. Set window.squatchTenant to enable auto-popup widgets.",
    );
    return;
  }

  const domain = declared?.domain || validateConfig({ tenantAlias }).domain;

  let raw: any;
  try {
    raw = JSON.parse(b64decode(refParam));
  } catch (e) {
    _log("Unable to decode _saasquatchExtra config");
    return;
  }

  // Expected shape: { [domain]: { [tenantAlias]: { autoPopupWidgetType } } }
  const normalizedDomain = domain.replace(/^https?:\/\//, "");
  const widgetType = raw?.[normalizedDomain]?.[tenantAlias]?.autoPopupWidgetType;

  if (typeof widgetType !== "string" || !widgetType) {
    console.warn(
      `squatch-js: _saasquatchExtra ignored. It has no auto-popup widget for tenant "${tenantAlias}".`,
    );
    return;
  }

  return { widgetType, engagementMedium: "POPUP", displayOnLoad: true };
}
