import { ConfigOptions, WidgetConfig } from "../types";

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
  props.forEach(p => {
    if (!hasProps(object, props)) throw new Error(p + " is required");
  });
  return true;
}

type Required<T> = T extends object
  ? { [P in keyof T]-?: NonNullable<T[P]> }
  : T;

export function validateConfig(raw: unknown): Required<ConfigOptions> {
  if (!isObject(raw)) throw new Error("config must be an object");
  if (!hasProps(raw, "tenantAlias"))
    throw new Error("tenantAlias not provided");
  const tenantAlias = raw.tenantAlias;
  const domain =
    (hasProps(raw, "domain") && raw.domain) ||
    "https://app.referralsaasquatch.com";
  const debug = (hasProps(raw, "debug") && raw.debug) || false;
  return {
    tenantAlias,
    domain,
    debug
  };
}



export function validateWidgetConfig(raw: unknown): WidgetConfig {
  if (!isObject(raw)) throw new Error("Widget properties must be an object");
  if(!assertProp(raw, "user")) throw new Error("Required properties missing.");
  return raw;
}

