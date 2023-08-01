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

    impactTBDToken: string;
    impactTBDConfig: Omit<ConfigOptions, "tenantAlias">;
  }
}
/** @hidden */
export default function asyncLoad() {
  const impactNamespace = "impactTBD";
  const namespace = window[impactNamespace] ? impactNamespace : "squatch";
  console.log({ namespace });

  const loaded = window[namespace] || null;
  const cached = window["_" + namespace] || null;

  if (loaded && cached) {
    const ready = cached.ready || [];

    setTimeout(() => (window["impactTBD"] = window.squatch), 0);
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
