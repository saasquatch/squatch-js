/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
// import { OpenApi } from './api/OpenApi';
import 'whatwg-fetch';
import WidgetApi from './api/WidgetApi'
import { EmbedWidget } from './widgets/EmbedWidget';
import { PopupWidget } from './widgets/PopupWidget';
import { CtaWidget } from './widgets/CtaWidget';
import asyncLoad from './async';
import debug from 'debug';

debug.disable('squatch-js*');
let _log = debug('squatch-js');

// export { OpenApi } from './api/OpenApi';
export { WidgetApi } from './api/WidgetApi';
export { EmbedWidget } from './widgets/EmbedWidget';
export { PopupWidget } from './widgets/PopupWidget';
export { CtaWidget } from './widgets/CtaWidget';

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link WidgetApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenantAlias The tenant alias connects to your account. Note: There are both *live* and *test* tenant aliases.
 * @returns {void}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 */
export function init(config) {
  if (config.tenantAlias.startsWith('test') || config.debug) {
    debug.enable('squatch-js*');
  }

  _log('initializing ...');
  api = new WidgetApi({ tenantAlias: config.tenantAlias });

  _log("Widget API instance", api);
}

/**
 * Static instance of the {@link WidgetApi}. Make sure you call {@link #init init} first
 *
 * @type {WidgetApi}
 * @example
 * squatch.init({tenantAlias:'test_basbtabstq51v'});
 * squatch.api.createUser({id:'123', accountId:'abc', firstName:'Tom'});
 */
export let api = null;

export function ready(fn) {
  fn();
}

// Refactor this function to make it simple
export function load(response, config = { widgetType: "", engagementMedium: ""}) {
  let widget;
  let params;
  let displayOnLoad = false;
  let displayCTA = false;

  if (!response) throw new Error('Unable to get a response');

  if (response.apiErrorCode) {
    _log(new Error(response.apiErrorCode + ' (' + response.rsCode + ') ' + response.message));
    params = {
      content: "error",
      rsCode: response.rsCode,
      type: config.widgetType ? config.widgetType : "",
      api: api
    };
  } else if (response.jsOptions) {
    params = {
      content: response.template,
      type: config.widgetType ? config.widgetType : response.jsOptions.widget.defaultWidgetType,
      api: api,
    };

    response.jsOptions.widgetUrlMappings.forEach(rule => {
      if (matchesUrl(rule.url)) {
        displayOnLoad = true;
        displayCTA = rule.showAsCTA;
        console.log("Display " + rule.widgetType + " on " + rule.url);
      }
    });

    response.jsOptions.conversionUrls.forEach(rule => {
      if (response.user.referredBy && matchesUrl(rule)) {
        displayOnLoad = true;
        console.log("This is a conversion URL", rule);
      }
    });
  } else {
    params = {
      content: response,
      type: config.widgetType ? config.widgetType: '',
      api: api
    }
  }

  if (!displayCTA && config.engagementMedium === 'EMBED') {
    widget = new EmbedWidget(params).load();

  } else if (!displayCTA && config.engagementMedium === 'POPUP') {
    widget = new PopupWidget(params);
    widget.load();
    if (displayOnLoad) widget.open();

  } else if (displayCTA) {
    let side = response.jsOptions.cta.content.buttonSide;
    let position = response.jsOptions.cta.content.buttonPosition;

    widget = new CtaWidget(params, {side: side, position: position}).load();

  } else if (displayOnLoad) {
    widget = new PopupWidget(params);
    widget.load();
    widget.open();
  }
}

export function autofill(element) {
  let el;

  if (typeof element === "function") {
    return api.autofill().then(element).catch(function(ex) {
      throw ex;
    });
  } else if (element.startsWith('#')) {
    el = document.getElementById(element.slice(1));
  } else if (element.startsWith('.')) {
    el = document.getElementsByClass(element.slice(1))[0];
  } else {
    _log("Element id/class or function missing");
  }

  return api.autofill().then(function(response){
    el.value = response.code;
  }).catch(function(ex) {
    throw ex;
  });
}

function matchesUrl(rule) {
  return window.location.href.match(new RegExp(rule));
}

if (window) asyncLoad();
