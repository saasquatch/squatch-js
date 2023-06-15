declare global {
  interface Window {
    _squatch: {
      ready: any[];
    };
    squatch: any;
    widgetIdent: any;
    irEmbed: {
      tenantAlias: string;
      domain: string;
      jwt: string;
    };
    irPopup: {
      tenantAlias: string;
      domain: string;
      jwt: string;
    };
  }
}
/** @hidden */
export default function asyncLoad() {
  const loaded = window.squatch || null;
  const cached = window._squatch || null;

  if (loaded && cached) {
    const ready = cached.ready || [];

    ready.forEach((cb) => setTimeout(() => cb(), 0));
    setTimeout(() => window.squatch._auto(), 0);

    // @ts-ignore -- intetionally deletes `_squatch` to cleanup initialization
    window._squatch = undefined;
    try {
      delete window._squatch;
    } catch (e) {
      throw e;
    }
  }
}
