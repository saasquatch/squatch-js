declare global {
  interface Window {
    _squatch: {
      ready: any[];
    };
    squatch: any;
    widgetIdent: any;
  }
}
/** @hidden */
export default function asyncLoad() {
  const loaded = window.squatch || null;
  const cached = window._squatch || null;

  function auto() {
    setTimeout(() => {
      if (typeof window.squatch._auto !== "function") return auto();
      window.squatch._auto();
    }, 0);
  }

  if (loaded && cached) {
    const ready = cached.ready || [];

    ready.forEach((cb) => setTimeout(() => cb(), 0));
    auto();

    // @ts-ignore -- intetionally deletes `_squatch` to cleanup initialization
    window._squatch = undefined;
    try {
      delete window._squatch;
    } catch (e) {
      throw e;
    }
  }
}
