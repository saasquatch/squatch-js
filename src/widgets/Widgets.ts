import debug from "debug";
import * as EventBus from "eventbusjs";
import WidgetApi from "../api/WidgetApi";
import EmbedWidget from "./EmbedWidget";
import PopupWidget from "./PopupWidget";
import CtaWidget from "./CtaWidget";
import Widget from "./Widget";
import { WidgetResult } from "..";
// import { Promise } from "es6-promise";

const _log = debug("squatch-js:widgets");

/**
 *
 * `Widgets` is a factory for creating widgets. It's possible to build your own widgets using the
 * {@link WidgetApi} but most people will prefer to use these easy methods.
 *
 */
export default class Widgets {
  api: WidgetApi;
  tenantAlias: string;
  domain: string;

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
    this.domain = config.domain || "";
    // listens to a 'submit_email' event in the theme.
    EventBus.addEventListener("submit_email", Widgets.cb);
  }

  /**
   * This function calls the {@link WidgetApi.cookieUser} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {WidgetType} config.widgetType The content of the widget.
   * @param {EngagementMedium} config.engagementMedium How to display the widget.
   * @param {User} config.user An optional user to include
   * @param {string} config.jwt the JSON Web Token (JWT) that is used to
   *                            validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  async createCookieUser(config): Promise<WidgetResult> {
    try {
      const response = await this.api.cookieUser(config);
      return {
        widget: this.renderWidget(response, config),
        user: response.user
      };
    } catch (err) {
      _log(err);
      if (err.apiErrorCode) {
        Widgets.renderErrorWidget(err, config.engagementMedium);
      }
      throw err;
    }
  }

  /**
   * This function calls the {@link WidgetApi.upsertUser} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {Object} config.user The user details
   * @param {string} config.user.id The user id
   * @param {string} config.user.accountId The user account id
   * @param {WidgetType} config.widgetType The content of the widget.
   * @param {EngagementMedium} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  async upsertUser(config) {
    try {
      const response = await this.api.upsertUser(config);
      return {
        widget: this.renderWidget(response, config),
        user: response.user
      };
    } catch (err) {
      _log(err);
      if (err.apiErrorCode) {
        Widgets.renderErrorWidget(err, config.engagementMedium);
      }
      throw err;
    }
  }

  /**
   * This function calls the {@link WidgetApi.render} method, and it renders
   * the widget if it is successful. Otherwise it shows the "error" widget.
   *
   * @param {Object} config Config details
   * @param {Object} config.user The user details
   * @param {string} config.user.id The user id
   * @param {string} config.user.accountId The user account id
   * @param {WidgetType} config.widgetType The content of the widget.
   * @param {EngagementMedium} config.engagementMedium How to display the widget.
   * @param {string} config.jwt the JSON Web Token (JWT) that is used
   *                            to validate the data (can be disabled)
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  async render(config): Promise<WidgetResult> {
    try {
      const response = await this.api.cookieUser(config);
      return {
        widget: this.renderWidget({ template: response }, config),
        user: response.user
      };
    } catch (err) {
      if (err.apiErrorCode) {
        Widgets.renderErrorWidget(err, config.engagementMedium);
      }
      throw err;
    }
  }

  /**
   * Autofills a referral code into an element when someone has been referred.
   * Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
   *
   * @param {string} selector Element class/id
   * @returns {void}
   */
  autofill(selector) {
    if (typeof selector === "function") {
      this.api
        .squatchReferralCookie()
        .then(selector)
        .catch(ex => {
          _log("Autofill error", ex);
          throw ex;
        });
    }

    let elems = document.querySelectorAll(selector);
    let elem;
    if (elems.length > 0) {
      // Only use the first element found
      elem = elems[0];
    } else {
      _log("Element id/class or function missing");
      throw new Error("Element id/class or function missing");
    }

    this.api
      .squatchReferralCookie()
      //@ts-ignore
      .then(({ code }) => {
        elem.value = code;
      })
      .catch(ex => {
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
    EventBus.removeEventListener("submit_email", Widgets.cb);
    EventBus.addEventListener("submit_email", fn);
  }

  /**
   * @hidden
   * @param {Object} response The json object return from the WidgetApi
   * @param {Object} config Config details
   * @param {string} config.widgetType The widget type (REFERRER_WIDGET, CONVERSION_WIDGET)
   * @param {string} config.engagementMedium (POPUP, EMBED)
   * @returns {Widget} widget (PopupWidget, EmbedWidget, or CtaWidget)
   */
  renderWidget(response, config = { widgetType: "", engagementMedium: "" }) {
    _log("Rendering Widget...");
    if (!response) throw new Error("Unable to get a response");
    if (!response.jsOptions) throw new Error("Missing jsOptions in response");

    let widget;
    let displayOnLoad = false;
    let displayCTA = false;
    const opts = response.jsOptions || "";

    const params = {
      content: response.template,
      type: config.widgetType || opts.widget.defaultWidgetType,
      api: this.api,
      domain: this.domain
    };

    if (opts.widgetUrlMappings) {
      opts.widgetUrlMappings.forEach(rule => {
        if (Widgets.matchesUrl(rule.url)) {
          if (
            rule.widgetType !== "CONVERSION_WIDGET" ||
            (response.user.referredBy && response.user.referredBy.code)
          ) {
            displayOnLoad = rule.displayOnLoad;
            displayCTA = rule.showAsCTA;
            _log(`Display ${rule.widgetType} on ${rule.url}`);
          } else {
            _log(
              `Don't display ${
                rule.widgetType
              } when no referral on widget rule match ${rule.url}`
            );
          }
        }
      });
    }

    if (opts.conversionUrls) {
      opts.conversionUrls.forEach(rule => {
        if (response.user.referredBy && Widgets.matchesUrl(rule)) {
          _log("This is a conversion URL", rule);
        }
      });
    }

    if (opts.fuelTankAutofillUrls) {
      _log("We found a fuel tank autofill!");

      opts.fuelTankAutofillUrls.forEach(({ url, formSelector }) => {
        if (Widgets.matchesUrl(url)) {
          _log("Fuel Tank URL matches");
          if (response.user.referredBy && response.user.referredBy.code) {
            const formAutofill = document.querySelector(formSelector);

            if (formAutofill) {
              formAutofill.value =
                response.user.referredBy.referredReward.fuelTankCode || "";
            } else {
              _log(
                new Error(
                  `Element with id/class ${formSelector} was not found.`
                )
              );
            }
          }
        }
      });
    }

    if (!displayCTA && config.engagementMedium === "EMBED") {
      widget = new EmbedWidget(params);
      widget.load();
    } else if (!displayCTA && config.engagementMedium === "POPUP") {
      widget = new PopupWidget(params);
      widget.load();
      if (displayOnLoad) widget.open();
    } else if (displayCTA) {
      _log("display CTA");
      const side = opts.cta.content.buttonSide;
      const position = opts.cta.content.buttonPosition;

      widget = new CtaWidget(params, { side, position });
      widget.load();
      if (displayOnLoad) widget.open();
    } else {
      _log("display popup on load");
      widget = new PopupWidget(params);
      widget.load();
      if (displayOnLoad) widget.open();
    }

    return widget;
  }

  /**
   * @hidden
   * @param {Object} error The json object containing the error details
   * @param {string} em The engagementMedium
   * @returns {void}
   */
  static renderErrorWidget({ apiErrorCode, rsCode, message }, em = "POPUP") {
    _log(new Error(`${apiErrorCode} (${rsCode}) ${message}`));

    let widget;
    const params = {
      content: "error",
      rsCode,
      type: "ERROR_WIDGET"
    };

    if (em === "EMBED") {
      widget = new EmbedWidget(params);
    } else if (em === "POPUP") {
      widget = new PopupWidget(params);
    }

    widget.load();
  }

  /**
   * @hidden
   * @param {string} rule A regular expression
   * @returns {boolean} true if rule matches Url, false otherwise
   */
  static matchesUrl(rule) {
    // If there were no matches, null is returned.
    return window.location.href.match(new RegExp(rule)) ? true : false;
  }

  /**
   * @hidden
   * @param {Object} target Object containing the target DOM element
   * @param {Widget} widget A widget (EmbedWidget, PopupWidget, CtaWidget)
   * @param {Object} params An object with valid parameters
   *                        (e.g) {email:'email', firstName:'firstName'}
   * @returns {void}
   */
  static cb(target, widget, params) {
    let paramsObj;

    // If params is a string, then it should be an email
    if (typeof params === "string" || params instanceof String) {
      paramsObj = { email: params };
    } else {
      paramsObj = params;
    }

    // TODO: Reload doesn't exist on all widget types
    widget.reload(paramsObj);
  }
}