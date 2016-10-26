/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { OpenApi } from './api/OpenApi';
import { WidgetApi } from './api/WidgetApi'
import { EmbedWidget, PopupWidget, CtaWidget } from './widgets/Widget';
import { asyncLoad } from './async';
import store from 'store';
import debug from 'debug';
import EventBus from 'eventbusjs';

debug.disable('squatch-js*');
let _log = debug('squatch-js');

export { OpenApi } from './api/OpenApi';
export { WidgetApi } from './api/WidgetApi';
export let eventBus = EventBus;

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link WidgetApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenant_alias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenant_alias:'test_basbtabstq51v'});
 */
export function init(config) {
  if (config.tenant_alias.startsWith('test')) {
    debug.enable('squatch-js*');
  }

  _log('initializing ...');
  api = new WidgetApi({
    tenantAlias: config.tenant_alias
  });


  _log("Widget API instance");
  _log(api);

  api.cookieUser(config).then(function(response) {
    _log('cookie_user');
    _log(response.jsOptions);


    loadWidget(response.template, 'POPUP');
  }).catch(function(ex) {
    _log(new Error('cookieUser() ' + ex));
  });

  // api.upsert(config).then(function(response) {
  //   _log('upsert user:')
  //   _log(response);
  //   // store.set('sqh_user', response);
  // }).catch(function(ex) {
  //   _log(new Error('upsertUser()' + ex));
  // });

  // api.render(config).then(function(response) {
  //   _log('render');
  //   _log(response);
  //   loadWidget(response, config.engagementMedium ? config.engagementMedium : 'POPUP');
  // }).catch(function(ex) {
  //   _log(new Error('render() ' + ex));
  // });
}

/**
 * Static instance of the {@link WidgetApi}. Make sure you call {@link #init init} first
 *
 * @type {WidgetApi}
 * @example
 * squatch.init({tenant_alias:'test_basbtabstq51v'});
 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
 */
export let api = null;

export function ready(fn) {
  fn();
}

function loadWidget(content, mode) {
  let embed;
  let popup;
  let cta;

  if (mode === 'EMBED') {
    embed = new EmbedWidget(content, eventBus).load();
  } else if (mode === 'POPUP') {
    popup = new PopupWidget(content, eventBus).load();
  } else if (mode === 'CTA') {
    cta = new CtaWidget(content, eventBus).load();
  }
}

if (window) asyncLoad();
