import debug from 'debug';
import Promise from 'es6-promise';
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
   * var Widgets = require('squatch-js').Widgets;
   * var widgets = new Widgets({tenantAlias:'test_12b5bo1b25125'});
   *
   * @example <caption>Babel+Browserify/Webpack example</caption>
   * import {Widgets} from 'squatch-js';
   * let widgets = new Widgets({tenantAlias:'test_12b5bo1b25125'});
   */
  constructor(config) {
    this.tenantAlias = config.tenantAlias;
    this.api = new WidgetApi(config);
  }

  /**
   * This function calls the {@link WidgetApi.cookieUser} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  createCookieUser(config) {
    return new Promise((resolve, reject) => {
      this.api.cookieUser(config).then((response) => {
        _log('Got response');
        resolve({ widget: this.renderWidget(response, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          Widgets.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * This function calls the {@link WidgetApi.upsert} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {Object} config.user the user details
   * @param {string} config.user.id
   * @param {string} config.user.accountId
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  upsertUser(config) {
    return new Promise((resolve, reject) => {
      this.api.upsert(config).then((response) => {
        resolve({ widget: this.renderWidget(response, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          Widgets.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * This function calls the {@link WidgetApi.render} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {Object} config.user the user details
   * @param {string} config.user.id
   * @param {string} config.user.accountId
   * @param {EngagementMedium} config.widgetType The content of the widget.
   * @param {WidgetType} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  render(config) {
    return new Promise((resolve, reject) => {
      this.api.cookieUser(config).then((response) => {
        resolve({ widget: this.renderWidget({ template: response }, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          Widgets.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * @private
   *
   */
  renderWidget(response, config = { widgetType: '', engagementMedium: '' }) {
    _log('Rendering Widget...');
    if (!response) throw new Error('Unable to get a response');
    if (!response.jsOptions) throw new Error('Missing jsOptions in response');
    _log(response, config);

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

    _log('read jsOptions, now create Widget');

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

    _log('the widget returned', widget);
    return widget;
  }

  /**
   * @private
   *
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
   */
  static matchesUrl(rule) {
    return window.location.href.match(new RegExp(rule));
  }
}
