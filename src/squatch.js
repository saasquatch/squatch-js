/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { OpenApi } from './api/OpenApi';
import { EmbedWidget, PopupWidget } from './widgets/Widget';
import cookie from './tracking/Cookie';
import { asyncLoad } from './async';

export { OpenApi } from './api/OpenApi';

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link OpenApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenant_alias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenant_alias:'test_basbtabstq51v'});
 */
export function init(config) {
  api = new OpenApi({
    tenantAlias: config.tenant_alias
  });

  // TODO:
  // 1. Check if config.user was provided
  // 2. If it is, Upsert user. Else, check store to see if user info is available
  // 3. If no user info is available, create new cookie user

  api.createCookieUser(config.mode ? 'text/html' : 'application/json').then(function(response) {
    if (config.mode) {
      loadWidget(config.element, response, config.mode);
    } else {
      // save user info in Store
    }
  }).catch(function(ex) {
    console.log(ex);
  });

}

/**
 * Static instance of the {@link OpenApi}. Make sure you call {@link #init init} first
 *
 * @type {OpenApi}
 * @example
 * squatch.init({tenant_alias:'test_basbtabstq51v'});
 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
 */
export let api = null;

export function ready(fn) {
  fn();
}

function loadWidget(element, content, mode) {
  let embed;
  let popup;

  if (mode === 'EMBED') {
    embed = new EmbedWidget(content).load();
  } else if (mode === 'POPUP') {
    popup = new PopupWidget(content).load();
  }
}

if (window) asyncLoad();
