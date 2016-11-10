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
import WidgetApi from './api/WidgetApi';
import asyncLoad from './async';

debug.disable('squatch-js*');
const _log = debug('squatch-js');

export { WidgetApi } from './api/WidgetApi';
export { EmbedWidget } from './widgets/EmbedWidget';
export { PopupWidget } from './widgets/PopupWidget';
export { CtaWidget } from './widgets/CtaWidget';


/**
 * Static instance of the {@link WidgetApi}. Make sure you call {@link #init init} first
 *
 * @type {WidgetApi}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 * squatch.api.cookieUser();
 */
export let api = null;

/**
 * Static instance of {@link Widgets}. Make sure you call {@link #init init} first
 *
 * @type {Widgets}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 * squatch.widgets.cookieUser();
 */
export let widgets = null;

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link WidgetApi}
 *  - `widgets` a static instance of {@link Widgets}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenantAlias The tenant alias connects to your account.
 *                        Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  if (config.tenantAlias.match('^test') || config.debug) {
    debug.enable('squatch-js*');
  }

  _log('initializing ...');
  api = new WidgetApi({ tenantAlias: config.tenantAlias });
  widgets = new Widgets({ tenantAlias: config.tenantAlias });

  _log('Widget API instance', api);
  _log('widgets instace', widgets);
}

/**
 * Squatch.js can't start safely making operations until it's "ready". This
 * function detects that state.
 *
 * @param {function} fn Anonymous function
 *
 * @returns {void}
 * @example
 * squatch.ready(function() {
 *   console.log("ready!");
 * });
 */
export function ready(fn) {
  fn();
}

/**
 * Creates an anonymous user.
 *
 * @param {Object} params
 * @param {string} params.jwt the JSON Web Token (JWT) that is used to
 *                            validate the data (can be disabled)
 *
 * @return {Promise} json object if true, with the widget template, jsOptions and user details.
 */
export function createCookieUser(config) {
  return api.cookieUser(config);
}

/**
 * Creates/upserts user.
 *
 * @param {Object} params
 * @param {Object} params.user the user details
 * @param {string} params.user.id
 * @param {string} params.user.accountId
 * @param {string} params.widgetType (REFERRED_WIDGET/REFERRING_WIDGET)
 * @param {string} params.engagementMedium (POPUP/MOBILE)
 * @param {string} params.jwt the JSON Web Token (JWT) that is used
 *                            to validate the data (can be disabled)
 *
 * @return {Promise} json object if true, with the widget template, jsOptions and user details.
 */
export function upsertUser(config) {
  return api.upsert(config);
}

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

if (window) asyncLoad();
