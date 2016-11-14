/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to
 * integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique
 * referral short links and referral codes, and more.
 *
 * @module squatch
 */
import 'whatwg-fetch';
import debug from 'debug';
import Widgets from './widgets/Widgets';
import { EmbedWidget } from './widgets/EmbedWidget';
import { PopupWidget } from './widgets/PopupWidget';
import { CtaWidget } from './widgets/CtaWidget';
import WidgetApi from './api/WidgetApi';
import asyncLoad from './async';

debug.disable('squatch-js*');
const _log = debug('squatch-js');

export {
  Widgets,
  EmbedWidget,
  PopupWidget,
  CtaWidget,
  WidgetApi,
};

/**
 * Initializes the static `squatch` global. This sets up:
 *
 *  - `squatch.api()` a static instance of the {@link WidgetApi}
 *  - `squatch.widgets()` a static instance of {@link Widgets}
 *
 * @param {ConfigOptions} config Configuration details
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  if (config.tenantAlias.match('^test') || config.debug) {
    debug.enable('squatch-js*');
  }

  _log('initializing ...');
  _api = new WidgetApi({ tenantAlias: config.tenantAlias });
  _widgets = new Widgets({ tenantAlias: config.tenantAlias });

  _log('Widget API instance', _api);
  _log('widgets instance', _widgets);
}

/**
 * Squatch.js can't start safely making operations until it's "ready". This
 * function detects that state.
 *
 * @param {function} fn A callback once Squatch.js is ready.
 *
 * @example
 * squatch.ready(function() {
 *   console.log("ready!");
 *   squatch.api().cookieUser();
 * });
 */
export function ready(fn) {
  fn();
}


/**
 * A static instance of the {@link WidgetApi} created when you call {@link #init init}.
 * 
 * Read the {@link WidgetApi} docs.
 *
 * @type {WidgetApi}
 */
export function api() {
  return _api;
}
let _api = null;


/**
 * A static instance of the {@link Widgets} created when you call {@link #init init}.
 * 
 * Read the {@link Widgets} docs.
 *
 * @type {Widgets}
 */
export function widgets() {
  return _widgets;
}
let _widgets = null;


/**
 * Autofills a referral code into an element when someone has been referred. Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
 *
 */
export function autofill(element) {
  let el;

  if (typeof element === 'function') {
    return api.squatchReferralCookie().then(element).catch((ex) => {
      throw ex;
    });
  } else if (element.match('^#')) {
    el = document.getElementById(element.slice(1));
  } else if (element.match('^[.]')) {
    el = document.getElementsByClassName(element.slice(1))[0];
  } else {
    _log('Element id/class or function missing');
    throw new Error('Element id/class or function missing');
  }

  return api.squatchReferralCookie().then((response) => {
    el.value = response.code;
  }).catch((ex) => {
    throw ex;
  });
}

export * from './docs.js';
if (window) asyncLoad();
