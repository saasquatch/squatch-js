import debug from 'debug';
import WidgetApi from '../api/WidgetApi';
import EmbedWidget from './EmbedWidget';
import PopupWidget from './PopupWidget';
import CtaWidget from './CtaWidget';

const _log = debug('squatch-js:widgets');

/**
 *
 * The Widgets class contains a widget loading process for different calls
 * to the WidgetApi.
 *
 */
export default class Widgets {
  /**
   * Initialize a new {@link Widgets} instance.
   *
   * @param {Object} config Config details
   * @param {string} config.tenantAlias The tenant to access
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
    this.api = new WidgetApi({ tenantAlias: config.tenantAlias });
  }

  /**
   * This function calls the WidgetApi.cookieUser() method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {string} config.widgetType (REFERRED_WIDGET/CONVERSION_WIDGET)
   * @param {string} config.engagementMedium (POPUP/MOBILE)
   * @param {string} config.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise} json object if true, with a Widget and user details.
   */
  createCookieUser(config) {
    return new Promise((resolve, reject) => {
      this.api.cookieUser(config).then((response) => {
        resolve({ widget: this.load(response, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          this.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * This function calls the WidgetApi.upsert() method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {Object} config.user the user details
   * @param {string} config.user.id
   * @param {string} config.user.accountId
   * @param {string} config.widgetType (CONVERSION_WIDGET/REFERRING_WIDGET)
   * @param {string} config.engagementMedium (POPUP/MOBILE)
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise} json object if true, with a Widget and user details.
   */
  upsertUser(config) {
    return new Promise((resolve, reject) => {
      this.api.upsert(config).then((response) => {
        resolve({ widget: this.load(response, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          this.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * This function calls the WidgetApi.render() method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config
   * @param {Object} config.user the user details
   * @param {string} config.user.id
   * @param {string} config.user.accountId
   * @param {string} config.widgetType (REFERRED_WIDGET/REFERRING_WIDGET)
   * @param {string} config.engagementMedium (POPUP/MOBILE)
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise} json object if true, with a Widget and user details.
   */
  render(config) {
    return new Promise((resolve, reject) => {
      this.api.cookieUser(config).then((response) => {
        resolve({ widget: this.load({ template: response }, config), user: response.user });
      }).catch((err) => {
        if (err.apiErrorCode) {
          this.renderErrorWidget(err, config.engagementMedium);
        }
        reject(err);
      });
    });
  }

  /**
   * @private
   *
   */
  load(response, config = { widgetType: '', engagementMedium: '' }) {
    _log('Loading...');
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
        if (this.matchesUrl(rule.url)) {
          displayOnLoad = true;
          displayCTA = rule.showAsCTA;
          _log(`Display ${rule.widgetType} on ${rule.rul}`);
        }
      });
    }

    if (opts.conversionUrls) {
      opts.conversionUrls.forEach((rule) => {
        if (response.user.referredBy && this.matchesUrl(rule)) {
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
      const side = opts.cta.content.buttonSide;
      const position = opts.cta.content.buttonPosition;

      widget = new CtaWidget(params, { side: side, position: position });
      widget.load();
    } else if (displayOnLoad) {
      widget = new PopupWidget(params);
      widget.load();
      widget.open();
    }

    return widget;
  }

  /**
   * @private
   *
   */
  renderErrorWidget(error, em = 'POPUP') {
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
  matchesUrl(rule) {
    return window.location.href.match(new RegExp(rule));
  }
}
