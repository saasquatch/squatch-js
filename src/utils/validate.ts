import { ConfigOptions, WidgetConfig } from "../types";

export const DEFAULT_DOMAIN = "https://app.referralsaasquatch.com";
export const DEFAULT_NPM_CDN = "https://fast.ssqt.io/npm";

type KeysOf<T> = keyof T;
type SimpleObject = {
  [key: string]: unknown;
};

export function hasProps<T extends SimpleObject & {}>(
  object: unknown,
  props: KeysOf<T> | KeysOf<T>[]
): object is T {
  if (!isObject(object)) return false;
  const keys = Object.keys(object);
  if (!Array.isArray(props)) return object.hasOwnProperty(props);
  const hasKeys = props.reduce((acc: boolean, cur: KeysOf<T>) => {
    return acc && keys.indexOf(cur as string) >= 0;
  }, true);
  return hasKeys;
}

export function isObject(x: unknown): x is {} {
  return typeof x === "object";
}

export function assertProp<T extends SimpleObject & {}>(
  object: unknown,
  ...props: KeysOf<T>[]
): object is T {
  props.forEach((p) => {
    if (!hasProps(object, props)) throw new Error(p + " is required");
  });
  return true;
}

type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

export function validateConfig(raw: unknown): Required<ConfigOptions> {
  if (!isObject(raw)) throw new Error("config must be an object");
  if (!hasProps(raw, "tenantAlias") || typeof raw.tenantAlias !== "string")
    throw new Error("tenantAlias not provided");
  const tenantAlias = raw.tenantAlias;
  const domain =
    (hasProps(raw, "domain") && typeof raw.domain === "string" && raw.domain) ||
    DEFAULT_DOMAIN;
  const debug =
    (hasProps(raw, "debug") && typeof raw.debug === "boolean" && raw.debug) ||
    false;
  const npmCdn =
    (hasProps(raw, "npmCdn") && typeof raw.npmCdn === "string" && raw.npmCdn) ||
    DEFAULT_NPM_CDN;
  return {
    tenantAlias,
    domain,
    debug,
    npmCdn,
  };
}

export function validateLocale(locale?: string) {
  if (locale && /^[a-z]{2}_(?:[A-Z]{2}|[0-9]{3})$/.test(locale)) {
    return locale;
  }
}

export function validateWidgetConfig(raw: unknown): WidgetConfig {
  if (!isObject(raw)) throw new Error("Widget properties must be an object");
  if (!assertProp(raw, "user")) throw new Error("Required properties missing.");
  // TODO: This should be better type checked
  return raw as unknown as WidgetConfig;
}

export function validatePasswordlessConfig(raw: unknown): WidgetConfig {
  if (!isObject(raw)) throw new Error("Widget properties must be an object");
  return raw as unknown as WidgetConfig;
}
