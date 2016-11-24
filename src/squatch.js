/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to
 * integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique
 * referral short links and referral codes, and more.
 *
 * @module squatch
 */
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

let _api = null;
let _widgets = null;

/**
 * A static instance of the {@link WidgetApi} created when you call {@link #init init}.
 *
 * Read the {@link WidgetApi} docs.
 *
 * @type {WidgetApi}
 * @returns {WidgetApi} static instance
 */
export function api() {
  return _api;
}

/**
 * A static instance of the {@link Widgets} created when you call {@link #init init}.
 *
 * Read the {@link Widgets} docs.
 *
 * @type {Widgets}
 * @returns {Widgets} static instance
 */
export function widgets() {
  return _widgets;
}


/**
 * Initializes the static `squatch` global. This sets up:
 *
 *  - `squatch.api()` a static instance of the {@link WidgetApi}
 *  - `squatch.widgets()` a static instance of {@link Widgets}
 *
 * @param {ConfigOptions} config Configuration details
 * @returns {void}
 *
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  if (config.tenantAlias.match('^test') || config.debug) {
    debug.enable('squatch-js*');
  }
  _log('initializing ...');

  const initObj = {
    tenantAlias: config.tenantAlias,
    domain: config.domain,
  };

  _api = new WidgetApi(initObj);
  _widgets = new Widgets(initObj);

  _log('Widget API instance', _api);
  _log('widgets instance', _widgets);
}

/**
 * Squatch.js can't start safely making operations until it's "ready". This
 * function detects that state.
 *
 * @param {function} fn A callback once Squatch.js is ready.
 * @returns {void}
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
 * Autofills a referral code into an element when someone has been referred.
 * Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
 *
 * @param {string} selector Element class/id
 * @returns {void}
 */
export function autofill(selector) {
  widgets().autofill(selector);
}

/**
 * Overrides the default function that submits the user email. If you have
 * Security enabled, the email needs to be signed before it's submitted.
 *
 * @param {function} fn Callback function for the 'submit_email' event.
 * @returns {void}
 *
 * @example
 * squatch.submitEmail(function(target, widget, email) {
 *   // Sign email and generate jwt token
 *   var jwt = 'token';
 *   widget.reload(email, jwt);
 * });
 */
export function submitEmail(fn) {
  widgets().submitEmail(fn);
}

export * from './docs.js';
if (window) asyncLoad();
