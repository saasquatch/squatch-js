// @ts-check
/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to
 * integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique
 * referral short links and referral codes, and more.
 *
 * @module squatch
 */
import { debug } from "debug";
import Widgets from "./widgets/Widgets";
import EmbedWidget from "./widgets/EmbedWidget";
import PopupWidget from "./widgets/PopupWidget";
import WidgetApi from "./api/WidgetApi";
import EventsApi from "./api/EventsApi";
import asyncLoad from "./async";
import { ConfigOptions, WidgetConfig, WidgetResult } from "./types";
import { validateConfig } from "./utils/validate";
import { _pushCookie } from "./utils/cookieUtils";
import { _getAutoConfig } from "./utils/utmUtils";
import {
  DeclarativeEmbedWidget,
  DeclarativePopupWidget,
} from "./widgets/declarative/DeclarativeWidgets";
export * from "./types";
export * from "./docs";

// @ts-ignore
// debug.disable("squatch-js*");
/** @hidden */
const _log = debug("squatch-js");

export {
  Widgets,
  EmbedWidget,
  PopupWidget,
  DeclarativeEmbedWidget,
  DeclarativePopupWidget,
  WidgetApi,
};
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
 * @example
 * squatch.api().render({ ... })
 * squatch.api().upsertUser({ ... })
 * squatch.api().squatchReferralCookie()
 */
export function api(): WidgetApi | null {
  if (!_api) init({} as ConfigOptions);
  return _api;
}

/**
 * A static instance of the {@link Widgets} created when you call {@link #init init}.
 *
 * Read the {@link Widgets} docs.
 *
 * @returns static instance
 * @example
 * squatch.widgets().render({ widgetType: "w/widget-type" })
 * squatch.widgets().upsertUser({ user: { ... }, widgetType: "w/widget-type" })
 * squatch.widgets().autofill(".referral-code")
 */
export function widgets(): Widgets | null {
  if (!_widgets) init({} as ConfigOptions);
  return _widgets;
}

/**
 * A static instance of the {@link EventsApi} created when you call {@link #init init}.
 *
 * Read the {@link EventsApi} docs.
 *
 * @returns EventsApi static instance
 *
 * @example
 * squatch.events().track({ ... })
 */
export function events(): EventsApi | null {
  if (!_events) init({} as ConfigOptions);
  return _events;
}

/**
 * Entry-point for high level API to render a widget using the instance of {@link Widgets} created when you call {@link #init init}.
 *
 * Read the {@link Widgets.render} docs.
 *
 * @example
 * squatch.widget().then(res => {
 *   const widget = res.widget
 * }).catch(e => console.error("Did not render widget:", e))
 */
export function widget(
  widgetConfig: WidgetConfig
): Promise<WidgetResult | undefined> | undefined {
  return widgets()?.render(widgetConfig);
}

/**
 * Extracts widget configuration from `_saasquatchExtra` UTM parameter. Initialises `squatch` and renders the widget as a {@link PopupWidget} via static instanct of {@link Widgets}.
 *
 * Called by default on startup via the loader script.
 * @private
 */
export function _auto(
  configIn: ConfigOptions
): Promise<WidgetResult | undefined> | undefined {
  const configs = _getAutoConfig(configIn);

  if (configs) {
    const { squatchConfig, widgetConfig } = configs;
    init(squatchConfig);
    return widgets()?.render(widgetConfig);
  }
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
 * squatch.init({
 *   tenantAlias:'test_basbtabstq51v',
 * });
 */
export function init(configIn: ConfigOptions): void {
  const raw = configIn as unknown | undefined;
  const config = validateConfig(raw);
  if (config.tenantAlias.match("^test") || config.debug) {
    debug.enable("squatch-js*");
  } else {
    debug.disable();
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
 *   squatch.api().upsertUser({ ... });
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
 *
 * @example
 * squatch.autofill("input.referral-code")
 * squatch.autofill("input#referral-code")
 */
export function autofill(selector: string): void {
  // @ts-ignore -- will throw occasionally throw a null pointer exception at runtime
  widgets().autofill(selector);
}

/**
 * Manually set the _saasquatch cookie as a 1st party cookie if available as a URL parameter on the current page.
 * This runs automatically immediately when squatch-js is loaded, except when window.SaaSquatchDoNotAutoDrop is true.
 * Use this function manually if you have a single page application or custom routing that causes the `_saasquatch` URL parameter to not be set when Squatch.js loads.
 
 * It is safe to run this function multiple times. If the `_saasquatch` URL parameter is invalid or missing it will not clear the 1st party cookie.
 
 *
 * @returns {void}
 *
 * @example
 * squatch.pushCookie();
 */
export function pushCookie(): void {
  _pushCookie();
}

declare global {
  interface Window {
    SaaSquatchDoNotAutoDrop?: boolean;
  }
}

if (typeof document !== "undefined" && !window.SaaSquatchDoNotAutoDrop) {
  pushCookie();
}

// Show message if squatchjs has already been loaded on the page
if (window["squatch"]?.init)
  _log(
    "Squatchjs is being loaded more than once. This may lead to multiple load events being sent, duplicated widgets, and inaccurate analytics."
  );

if (typeof document !== "undefined") asyncLoad();
