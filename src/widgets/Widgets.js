import debug from 'debug';
import Promise from 'es6-promise';
import EventBus from 'eventbusjs';
import WidgetApi from '../api/WidgetApi';
import EmbedWidget from './EmbedWidget';
import PopupWidget from './PopupWidget';
import CtaWidget from './CtaWidget';

const _log = debug('squatch-js:widgets');

/**
 *
 * `Widgets` is a factory for creating widgets. It's possible to build your own widgets using the
 * {@link WidgetApi} but most people will prefer to use these easy methods.
 *
 */
export default class Widgets {
  /**
   * Initialize a new {@link Widgets} instance.
   *
   * @param {ConfigOptions} config Config details
   *
   * @example <caption>Browser example</caption>
   * var widgets = new squatch.Widgets({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Browserify/Webpack example</caption>
   * var Widgets = require('@saasquatch/squatch-js').Widgets;
   * var widgets = new Widgets({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {Widgets} from '@saasquatch/squatch-js';
   * let widgets = new Widgets({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor(config) {
    this.tenantAlias = config.tenantAlias;
    this.api = new WidgetApi(config);
    this.eventBus = EventBus;
    // listens to a 'submit_email' event in the theme.
    this.eventBus.addEventListener('submit_email', Widgets.cb);
  }

  /**
   * This function calls the {@link WidgetApi.cookieUser} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  createCookieUser(config) {
    return new Promise((resolve, reject) => {
      try {
        this.api.cookieUser(config).then((response) => {
          resolve({ widget: this.renderWidget(response, config), user: response.user });
        }).catch((err) => {
          if (err.apiErrorCode) {
            Widgets.renderErrorWidget(err, config.engagementMedium);
          }
          reject(err);
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * This function calls the {@link WidgetApi.upsertUser} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {Object} config.user The user details
   * @param {string} config.user.id The user id
   * @param {string} config.user.accountId The user account id
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  upsertUser(config) {
    return new Promise((resolve, reject) => {
      try {
        this.api.upsertUser(config).then((response) => {
          resolve({ widget: this.renderWidget(response, config), user: response.user });
        }).catch((err) => {
          if (err.apiErrorCode) {
            Widgets.renderErrorWidget(err, config.engagementMedium);
          }
          _log(err);
          reject(err);
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * This function calls the {@link WidgetApi.render} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {Object} config.user The user details
   * @param {string} config.user.id The user id
   * @param {string} config.user.accountId The user account id
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  render(config) {
    return new Promise((resolve, reject) => {
      try {
        this.api.cookieUser(config).then((response) => {
          resolve({
            widget: this.renderWidget({ template: response }, config),
            user: response.user }
          );
        }).catch((err) => {
          if (err.apiErrorCode) {
            Widgets.renderErrorWidget(err, config.engagementMedium);
          }
          reject(err);
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  /**
   * Autofills a referral code into an element when someone has been referred.
   * Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
   *
   * @param {string} selector Element class/id
   * @returns {void}
   */
  autofill(selector) {
    if (typeof selector === 'function') {
      this.api.squatchReferralCookie().then(selector).catch((ex) => {
        throw ex;
      });
    }

    let elems = document.querySelectorAll(selector);

    if (elems.length > 0) {
      // Only use the first element found
      elems = elems[0];
    } else {
      _log('Element id/class or function missing');
      throw new Error('Element id/class or function missing');
    }

    this.api.squatchReferralCookie().then((response) => {
      elems.value = response.code;
    }).catch((ex) => {
      throw ex;
    });
  }

  /**
   * Overrides the default function that submits the user email. If you have
   * Security enabled, the email needs to be signed before it's submitted.
   *
   * @param {function} fn Callback function for the 'submit_email' event.
   * @returns {void}
   */
  submitEmail(fn) {
    this.eventBus.removeEventListener('submit_email', Widgets.cb);
    this.eventBus.addEventListener('submit_email', fn);
  }

  /**
   * @private
   * @param {Object} response The json object return from the WidgetApi
   * @param {Object} config Config details
   * @param {string} config.widgetType The widget type (REFERRER_WIDGET, CONVERSION_WIDGET)
   * @param {string} config.engagementMedium (POPUP, EMBED)
   * @returns {Widget} widget (PopupWidget, EmbedWidget, or CtaWidget)
   */
  renderWidget(response, config = { widgetType: '', engagementMedium: '' }) {
    _log('Rendering Widget...');
    if (!response) throw new Error('Unable to get a response');
    if (!response.jsOptions) throw new Error('Missing jsOptions in response');

    let widget;
    let displayOnLoad = false;
    let displayCTA = false;
    const opts = response.jsOptions || '';

    const params = {
      content: response.template,
      type: config.widgetType || opts.widget.defaultWidgetType,
      api: this.api,
    };

    if (opts.widgetUrlMappings) {
      opts.widgetUrlMappings.forEach((rule) => {
        if (Widgets.matchesUrl(rule.url)) {
          displayOnLoad = true;
          displayCTA = rule.showAsCTA;
          _log(`Display ${rule.widgetType} on ${rule.url}`);
        }
      });
    }

    if (opts.conversionUrls) {
      opts.conversionUrls.forEach((rule) => {
        if (response.user.referredBy && Widgets.matchesUrl(rule)) {
          displayOnLoad = true;
          _log('This is a conversion URL', rule);
        }
      });
    }

    if (!displayCTA && config.engagementMedium === 'EMBED') {
      widget = new EmbedWidget(params);
      widget.load();
    } else if (!displayCTA && config.engagementMedium === 'POPUP') {
      widget = new PopupWidget(params);
      widget.load();
      if (displayOnLoad) widget.open();
    } else if (displayCTA) {
      _log('display CTA');
      const side = opts.cta.content.buttonSide;
      const position = opts.cta.content.buttonPosition;

      widget = new CtaWidget(params, { side: side, position: position });
      widget.load();
    } else if (displayOnLoad) {
      _log('display popup on load');
      widget = new PopupWidget(params);
      widget.load();
      widget.open();
    }

    return widget;
  }

  /**
   * @private
   * @param {Object} error The json object containing the error details
   * @param {string} em The engagementMedium
   * @returns {void}
   */
  static renderErrorWidget(error, em = 'POPUP') {
    _log(new Error(`${error.apiErrorCode} (${error.rsCode}) ${error.message}`));

    let widget;
    const params = {
      content: 'error',
      rsCode: error.rsCode,
      type: 'ERROR_WIDGET',
    };

    if (em === 'EMBED') {
      widget = new EmbedWidget(params);
    } else if (em === 'POPUP') {
      widget = new PopupWidget(params);
    }

    widget.load();
  }

  /**
   * @private
   * @param {string} rule A regular expression
   * @returns {boolean} true if rule matches Url, false otherwise
   */
  static matchesUrl(rule) {
    return window.location.href.match(new RegExp(rule));
  }

  /**
   * @private
   * @param {Object} target Object containing the target DOM element
   * @param {Widget} widget A widget (EmbedWidget, PopupWidget, CtaWidget)
   * @param {string} email A valid email address
   * @returns {void}
   */
  static cb(target, widget, email) {
    widget.reload(email);
  }
}
