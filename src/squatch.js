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
import WidgetApi from './api/WidgetApi';
import EmbedWidget from './widgets/EmbedWidget';
import PopupWidget from './widgets/PopupWidget';
import CtaWidget from './widgets/CtaWidget';
import asyncLoad from './async';

debug.disable('squatch-js*');
const _log = debug('squatch-js');

export { WidgetApi } from './api/WidgetApi';
export { EmbedWidget } from './widgets/EmbedWidget';
export { PopupWidget } from './widgets/PopupWidget';
export { CtaWidget } from './widgets/CtaWidget';

/**
 * @private
 */
function matchesUrl(rule) {
  return window.location.href.match(new RegExp(rule));
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

/**
 * Initializes a static `squatch` global. This sets up:
 *
 *  - `api` a static instance of the {@link WidgetApi}
 *
 * @param {Object} config Configuration details
 * @param {string} config.tenantAlias The tenant alias connects to your account.
 *                        Note: There are both *live* and *test* tenant aliases.
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

  _log('Widget API instance', api);
}

export function ready(fn) {
  fn();
}

// Refactor this function to make it simple
export function load(response, config = { widgetType: '', engagementMedium: '' }) {
  let widget;
  let params;
  let displayOnLoad = false;
  let displayCTA = false;

  if (!response) throw new Error('Unable to get a response');

  if (response.apiErrorCode) {
    _log(new Error(`${response.apiErrorCode} (${response.rsCode}) response.message`));
    params = {
      content: 'error',
      rsCode: response.rsCode,
      type: config.widgetType ? config.widgetType : '',
      api: api,
    };
  } else if (response.jsOptions) {
    params = {
      content: response.template,
      type: config.widgetType ? config.widgetType : response.jsOptions.widget.defaultWidgetType,
      api: api,
    };

    response.jsOptions.widgetUrlMappings.forEach((rule) => {
      if (matchesUrl(rule.url)) {
        displayOnLoad = true;
        displayCTA = rule.showAsCTA;
        _log(`Display ${rule.widgetType} on ${rule.rul}`);
      }
    });

    response.jsOptions.conversionUrls.forEach((rule) => {
      if (response.user.referredBy && matchesUrl(rule)) {
        displayOnLoad = true;
        _log('This is a conversion URL', rule);
      }
    });
  } else {
    params = {
      content: response,
      type: config.widgetType ? config.widgetType : '',
      api: api,
    };
  }

  if (!displayCTA && config.engagementMedium === 'EMBED') {
    widget = new EmbedWidget(params).load();
  } else if (!displayCTA && config.engagementMedium === 'POPUP') {
    widget = new PopupWidget(params);
    widget.load();
    if (displayOnLoad) widget.open();
  } else if (displayCTA) {
    const side = response.jsOptions.cta.content.buttonSide;
    const position = response.jsOptions.cta.content.buttonPosition;

    widget = new CtaWidget(params, { side: side, position: position }).load();
  } else if (displayOnLoad) {
    widget = new PopupWidget(params);
    widget.load();
    widget.open();
  }
}

export function autofill(element) {
  let el;

  if (typeof element === 'function') {
    return api.autofill().then(element).catch((ex) => {
      throw ex;
    });
  } else if (element.startsWith('#')) {
    el = document.getElementById(element.slice(1));
  } else if (element.startsWith('.')) {
    el = document.getElementsByClass(element.slice(1))[0];
  } else {
    _log('Element id/class or function missing');
  }

  return api.autofill().then((response) => {
    el.value = response.code;
  }).catch((ex) => {
    throw ex;
  });
}

if (window) asyncLoad();
