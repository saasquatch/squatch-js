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
export {default as cookie} from './tracking/Cookie';

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

  // api.createCookieUser(config.mode ? 'text/html' : 'application/json').then(function(response) {
  //   console.log(response);
  //   if (config.mode) {
  //     loadWidget(config.element, response, config.mode);
  //   } else {
  //     // save user info in Store
  //   }
  // }).catch(function(ex) {
  //   console.log(ex);
  // });


  // api.upsertUser(config.user).then(function(response) {
  //   console.log(response);
  //   cookie('sqh_user', JSON.stringify(response));
  //   var resp = cookie('sqh_user');
  //   console.log(JSON.parse(resp));
  // }).catch(function(ex) {
  //   console.log(ex);
  // });
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
