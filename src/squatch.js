/**
 * Squatch.js is the Referral SaaSquatch javascript SDK and a one-stop shop to integrate a referral program into your website or web app.
 * It can show referral widgets on any website, track users, generate unique referral short links and referral codes, and more.
 *
 * @module squatch
 */
// import { OpenApi } from './api/OpenApi';
import { WidgetApi } from './api/WidgetApi'
import { EmbedWidget } from './widgets/EmbedWidget';
import { PopupWidget } from './widgets/PopupWidget';
import { CtaWidget } from './widgets/CtaWidget';
import { asyncLoad } from './async';
import debug from 'debug';
import EventBus from 'eventbusjs';

debug.disable('squatch-js*');
let _log = debug('squatch-js');

// export { OpenApi } from './api/OpenApi';
export { WidgetApi } from './api/WidgetApi';
export { EmbedWidget } from './widgets/EmbedWidget';
export { PopupWidget } from './widgets/PopupWidget';
export { CtaWidget } from './widgets/CtaWidget';
export let eventBus = EventBus;

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link WidgetApi}
 *  - `eventBus` an instance for managing events https://github.com/krasimir/EventBus
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

  _log("Widget API instance", api);

  api.cookieUser(config).then(function(response) {
    _log('jsOptions', response.jsOptions);
    _log(response);
    load(response, config);
  }).catch(function(ex) {
    throw new Error(ex);
  });
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

// Refactor this function to make it simple
export function load(response, config) {
  let widget;
  let params;
  let displayOnLoad = false;
  let displayCTA = false;

  if (response.apiErrorCode) {
    _log(new Error(response.apiErrorCode + ' (' + response.rsCode + ') ' + response.message));
    params = {
      content: "error",
      rsCode: response.rsCode,
      type: config.widgetType ? config.widgetType : "",
      eventBus: eventBus,
      api: api
    };
  } else {
    params = {
      content: response.template,
      type: config.widgetType ? config.widgetType : response.jsOptions.widget.defaultWidgetType,
      eventBus: eventBus,
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
      if (matchesUrl(rule)) {
        displayOnLoad = true;
        console.log("This is a conversion URL", rule);
      }
    });
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

function matchesUrl(rule) {
  return window.location.href.match(new RegExp(rule));
}

if (window) asyncLoad();
