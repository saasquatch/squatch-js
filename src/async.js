export function asyncLoad() {
  let loaded = window['squatch'] || null;
  let cached = window['_squatch'] || null;

  if (loaded && cached) {
    const _ready = cached.ready;

    _ready.forEach((cb, i) => setTimeout(function() { cb(); }, 0) );

    window["_" + 'squatch'] = undefined;
    try {
      delete window['_' + 'squatch']
    } catch(e) {}
  }
}
