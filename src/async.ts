import { DEFAULT_NAMESPACE, IMPACT_NAMESPACE } from "./globals";
import { ConfigOptions } from "./types";

declare global {
  interface Window {
    __squatchjsNamespace?: string;
    _squatch?: {
      ready: any[];
    };
    impactOnReady?: () => {};
    squatchOnReady?: () => {};

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
  const cached = window["_" + namespace]?.ready || [];
  const declarativeCache = window.impactOnReady || window.squatchOnReady;
  const readyFns = [...cached, declarativeCache].filter((a) => !!a);


  // Run all of this in a setTimeout because we need to wait for the squatch module to finish loading
  setTimeout(() => {
    // Exit early if module wasn't loaded onto window
    if (!window[DEFAULT_NAMESPACE]) return

    // Set window.impact as an alias for window.squatch.
    window[IMPACT_NAMESPACE] = window[DEFAULT_NAMESPACE];

    // Run all the ready functions in a set timeout to they happen after namespace aliasing.
    readyFns.forEach((cb) => cb());

    // Perform auto popup
    window[DEFAULT_NAMESPACE]._auto();

    // @ts-ignore -- intentionally deletes `_squatch` to cleanup initialization
    window["_" + namespace] = undefined;
    delete window["_" + namespace];
  }, 0);
}
