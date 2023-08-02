import { ConfigOptions, WidgetConfig } from "../types";

export const DEFAULT_DOMAIN = "https://app.referralsaasquatch.com";
export const DEFAULT_NPM_CDN = "https://fast.ssqt.io/npm";

type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

export function validateConfig(
  _raw?: unknown | undefined
): Required<ConfigOptions> {
  if (typeof _raw !== "object") throw new Error("config must be an object");

  const tenant = window.squatchTenant;
  const config = getConfig();

  const raw = {
    tenantAlias: _raw?.["tenantAlias"] || tenant,
    domain: _raw?.["domain"] || config?.domain,
    npmCdn: _raw?.["npmCdn"] || config?.npmCdn,
    debug: _raw?.["debug"] || config?.debug,
  };

  if (typeof raw.tenantAlias !== "string")
    throw new Error("tenantAlias not provided");
  const tenantAlias = raw.tenantAlias;
  const domain =
    (typeof raw.domain === "string" && raw.domain) || DEFAULT_DOMAIN;
  const debug = (typeof raw.debug === "boolean" && raw.debug) || false;
  const npmCdn =
    (typeof raw.npmCdn === "string" && raw.npmCdn) || DEFAULT_NPM_CDN;

  return {
    tenantAlias,
    domain,
    debug,
    npmCdn,
  };
}

export function isObject(obj: unknown): obj is object {
  return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

export function validateLocale(locale?: string) {
  if (locale && /^[a-z]{2}_(?:[A-Z]{2}|[0-9]{3})$/.test(locale)) {
    return locale;
  }
}

export function validateWidgetConfig(raw: unknown | undefined): WidgetConfig {
  if (!isObject(raw)) throw new Error("Widget properties must be an object");
  if (!raw?.["user"]) throw new Error("Required properties missing.");

  return raw as WidgetConfig;
}

export function validatePasswordlessConfig(
  raw: unknown | undefined
): WidgetConfig {
  if (!isObject(raw)) throw new Error("Widget properties must be an object");

  return raw as WidgetConfig;
}

export function getToken() {
  return window.impactToken || window.squatchToken;
}
export function getConfig() {
  return window.impactConfig || window.squatchConfig;
}
