/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { OpenApi } from './api/OpenApi';
import { WidgetApi } from './api/WidgetApi'
import { EmbedWidget } from './widgets/EmbedWidget';
import { PopupWidget } from './widgets/PopupWidget';
import { CtaWidget } from './widgets/CtaWidget';
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
    _log(response.jsOptions.cta);
    _log('buttonPosition', response.jsOptions.cta.content.buttonPosition);
    _log('buttonSide', response.jsOptions.cta.content.buttonSide);
    config.engagementMedium = 'CTA';
    loadWidget(response, config);
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

function loadWidget(response, config) {
  let embed;
  let popup;
  let cta;

  let params = {
    content: response.template,
    type: config.widgetType ? config.widgetType : response.jsOptions.widget.defaultWidgetType,
    eventBus: eventBus,
    api: api,
  };

  if (config.engagementMedium === 'EMBED') {
    embed = new EmbedWidget(params).load();
  } else if (config.engagementMedium === 'POPUP') {
    popup = new PopupWidget(params).load();
  } else if (config.engagementMedium === 'CTA') {
    let side = response.jsOptions.cta.content.buttonSide;
    let position = response.jsOptions.cta.content.buttonPosition;

    cta = new CtaWidget(params, {side: side, position: position}).load();
  }
}

if (window) asyncLoad();
