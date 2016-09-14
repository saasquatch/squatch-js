import { OpenApi } from './api/OpenApi';
import cookie from './tracking/Cookie';
import { each } from './utils/each';

export { cookie } from './tracking/Cookie';
export { OpenApi } from './api/OpenApi';

export function init(config) {
  console.log("Init function called");
}

export function ready(fn) {
  fn();
}

export function autofill() {
  console.log("autofill");
}


var loaded = window['squatch'] || null,
    cached = window['_squatch'] || null;

if (loaded && cached) {
  var _ready = cached.ready;

  loaded["init"] = init;
  loaded["ready"] = ready;
  loaded["autofill"] = autofill;

  each(_ready, function(cb, i){
    cb();
  });

  window["_" + 'squatch'] = undefined;
  try {
    delete window['_' + 'squatch']
  } catch(e) {}
}
