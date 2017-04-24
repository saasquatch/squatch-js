export default function asyncLoad() {
  const loaded = window.squatch || null;
  const cached = window._squatch || null;

  if (loaded && cached) {
    const ready = cached.ready || [];

    ready.forEach(cb => setTimeout(() => cb(), 0));

    window._squatch = undefined;
    try {
      delete window._squatch;
    } catch (e) {
      throw e;
    }
  }
}
