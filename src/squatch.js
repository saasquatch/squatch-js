/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { OpenApi } from './api/OpenApi';
import cookie from './tracking/Cookie';
import { each } from './utils/each';

export { OpenApi } from './api/OpenApi';
export { default as cookie } from './tracking/Cookie';

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link OpenApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenantAlias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  api = new OpenApi({
    tenantAlias: config.tenantAlias
  });
}

/**
 * Static instance of the {@link OpenApi}. Make sure you call {@link #init init} first
 *
 * @type {OpenApi}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
 */
export var api = null;


export function autofill() {
  let opts = {};
  return cookie('name', 'value', opts);
}

export function ready(fn) {
  fn();
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
