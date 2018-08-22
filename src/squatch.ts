// @ts-check
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
import EmbedWidget from './widgets/EmbedWidget';
import PopupWidget from './widgets/PopupWidget';
import CtaWidget from './widgets/CtaWidget';
import WidgetApi from './api/WidgetApi';
import EventsApi from './api/EventsApi';
import asyncLoad from './async';

export * from './docs';

// import {ConfigOptions, WidgetResult} from './docs';

//@ts-ignore
debug.disable('squatch-js*');
const _log = debug('squatch-js');

export {
  Widgets,
  EmbedWidget,
  PopupWidget,
  CtaWidget,
  WidgetApi,
};

let _api:WidgetApi|null = null;
let _widgets:Widgets|null = null;
let _events:EventsApi|null = null;

/**
 * A static instance of the {@link WidgetApi} created when you call {@link #init init}.
 *
 * Read the {@link WidgetApi} docs.
 *
 * @type {WidgetApi}
 * @returns {WidgetApi?} static instance
 */
export function api(): WidgetApi | null {
  return _api;
}

/**
 * A static instance of the {@link Widgets} created when you call {@link #init init}.
 *
 * Read the {@link Widgets} docs.
 *
 * @type {Widgets}
 * @returns {Widgets?} static instance
 */
export function widgets(): Widgets | null {
  return _widgets;
}

/**
 * A static instance of the {@link EventsApi} created when you call {@link #init init}.
 *
 * Read the {@link EventsApi} docs.
 *
 * @type {EventsApi}
 * @returns {EventsApi?} static instance
 */
export function events(): EventsApi | null {
  return _events;
}


/**
 * Initializes the static `squatch` global. This sets up:
 *
 *  - `squatch.api()` a static instance of the {@link WidgetApi}
 *  - `squatch.widgets()` a static instance of {@link Widgets}
 *  - `squatch.events()` a static instance of {@link EventsApi}
 *
 * @param {ConfigOptions} config Configuration details
 * @returns {void}
 *
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config: ConfigOptions): void {
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
export function ready(fn: ()=>any): void {
  fn();
}

/**
 * Autofills a referral code into an element when someone has been referred.
 * Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
 *
 * @param {string} selector Element class/id
 * @returns {void}
 */
export function autofill(selector: string): void {
  // @ts-ignore -- will throw occasionally throw a null pointer exception at runtime
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
export function submitEmail(fn: (target, widget, email)=>any): void {
  // @ts-ignore -- will throw occasionally throw a null pointer exception at runtime
  widgets().submitEmail(fn);
}

if (window) asyncLoad();
