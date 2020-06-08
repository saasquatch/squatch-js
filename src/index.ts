// @ts-check
/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to
 * integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique
 * referral short links and referral codes, and more.
 *
 * @module squatch
 */
import debug from "debug";
import Widgets from "./widgets/Widgets";
import EmbedWidget from "./widgets/EmbedWidget";
import PopupWidget from "./widgets/PopupWidget";
import CtaWidget from "./widgets/CtaWidget";
import WidgetApi from "./api/WidgetApi";
import EventsApi from "./api/EventsApi";
import asyncLoad from "./async";
import { ConfigOptions } from "./types";
import { validateConfig } from "./utils/validate";
import { deepMerge } from "./utils/deepMerge";
import { b64encode, b64decode } from "./utils/cookieUtils";
import Cookies from 'js-cookie'
export * from "./types";
export * from "./docs";

// @ts-ignore
debug.disable("squatch-js*");
/** @hidden */
const _log = debug("squatch-js");

export { Widgets, EmbedWidget, PopupWidget, CtaWidget, WidgetApi };
/** @hidden */
let _api: WidgetApi | null = null;
/** @hidden */
let _widgets: Widgets | null = null;
/** @hidden */
let _events: EventsApi | null = null;

/**
 * A static instance of the {@link WidgetApi} created when you call {@link #init init}.
 *
 * Read the {@link WidgetApi} docs.
 *
 * @returns WidgetApi static instance
 */
export function api(): WidgetApi | null {
  return _api;
}

/**
 * A static instance of the {@link Widgets} created when you call {@link #init init}.
 *
 * Read the {@link Widgets} docs.
 *
 * @returns static instance
 */
export function widgets(): Widgets | null {
  return _widgets;
}

/**
 * A static instance of the {@link EventsApi} created when you call {@link #init init}.
 *
 * Read the {@link EventsApi} docs.
 *
 * @returns EventsApi static instance
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
 * @param config Configuration details
 *
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(configIn: ConfigOptions): void {
  const raw = configIn as unknown;
  const config = validateConfig(raw);
  if (config.tenantAlias.match("^test") || config.debug) {
    debug.enable("squatch-js*");
  }
  _log("initializing ...");

  _api = new WidgetApi(config);
  _widgets = new Widgets(config);
  _events = new EventsApi(config);
  
  _log("Widget API instance", _api);
  _log("Widgets instance", _widgets);
  _log("Events API instance", _events);
}


/**
 * Squatch.js can't start safely making operations until it's "ready". This
 * function detects that state.
 *
 * @param fn A callback once Squatch.js is ready.
 *
 * @example
 * squatch.ready(function() {
 *   console.log("ready!");
 *   squatch.api().cookieUser();
 * });
 */
export function ready(fn: () => any): void {
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
export function submitEmail(fn: (target, widget, email) => any): void {
  // @ts-ignore -- will throw occasionally throw a null pointer exception at runtime
  widgets().submitEmail(fn);
}

if (window) asyncLoad();

if(window && !window.SaaSquatchDoNotAutoDrop){
  //valid query strings should be ignored
  const queryString = window.location.search;
  // needs polyfill
  const urlParams = new URLSearchParams(queryString);
  const refParam = urlParams.get('_saasquatch') || "";

  // return if no params

  if(refParam){
    let decodedParams = "";
    try {
      decodedParams = b64decode(refParam)
    } catch(error){
      throw Error("invalid query parameter");
    }

    const existingCookie = Cookies.get('_saasquatch');
    let existingCookieJSON = "";
    console.log("existing cookie", existingCookie)
    if(existingCookie){
      try {
        existingCookieJSON = b64decode(existingCookie)
      } catch(error){
        throw Error("invalid cookie stored");
      }
    }

    // don't merge if there's no existing object
    if(existingCookieJSON)  {
      const newCookie = deepMerge(JSON.parse(existingCookieJSON), JSON.parse(decodedParams))
      const reEncodedCookie = b64encode(JSON.stringify(newCookie));
      console.log("cookie to store:", newCookie)
      Cookies.set("_saasquatch", reEncodedCookie, { expires: 60, secure:true, sameSite:"lax" });
    } else {
      const paramsJSON = JSON.parse(decodedParams)
      const reEncodedCookie = b64encode(JSON.stringify(paramsJSON));
      console.log("cookie to store:", decodedParams)
      Cookies.set("_saasquatch", reEncodedCookie, { expires: 60, secure:true, sameSite:"lax" });
    }
  }
}
