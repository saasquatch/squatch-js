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
  }
}
/** @hidden */
export default function asyncLoad() {
  const namespace = window.__squatchjsNamespace || "squatch";

  const loaded = window[namespace] || null;
  const cached = window["_" + namespace] || null;

  if (loaded && cached) {
    const ready = cached.ready || [];

    ready.forEach((cb) =>
      setTimeout(() => {
        cb();
      }, 0)
    );
    setTimeout(() => window[namespace]._auto(), 0);

    // @ts-ignore -- intetionally deletes `_squatch` to cleanup initialization
    window["_" + namespace] = undefined;
    try {
      delete window["_" + namespace];
    } catch (e) {
      throw e;
    }
  }
}
