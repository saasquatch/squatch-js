import { DEFAULT_NAMESPACE, IMPACT_NAMESPACE } from "./globals";
import { ConfigOptions } from "./types";

declare global {
  interface Window {
    __squatchjsNamespace?: string;
    _squatch?: {
      ready: any[];
    };

    squatch: any;
    widgetIdent: any;

    squatchTenant: string;
    squatchToken: string;
    squatchConfig: Omit<ConfigOptions, "tenantAlias">;

    impactToken: string;
    impactConfig: Omit<ConfigOptions, "tenantAlias">;
  }
}
/** @hidden */
export default function asyncLoad() {
  const namespace = window[IMPACT_NAMESPACE]
    ? IMPACT_NAMESPACE
    : DEFAULT_NAMESPACE;

  const loaded = window[namespace] || null;
  const cached = window["_" + namespace] || null;

  if (loaded && cached) {
    const ready = cached.ready || [];

    setTimeout(() => (window[IMPACT_NAMESPACE] = window[DEFAULT_NAMESPACE]), 0);
    ready.forEach((cb) => setTimeout(() => cb(), 0));
    setTimeout(() => {
      window.squatch._auto();
    }, 0);

    // @ts-ignore -- intentionally deletes `_squatch` to cleanup initialization
    window["_" + namespace] = undefined;
    try {
      delete window["_" + namespace];
    } catch (e) {
      throw e;
    }
  }
}
