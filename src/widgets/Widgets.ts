import debug from "debug";
import WidgetApi from "../api/WidgetApi";
import EmbedWidget from "./EmbedWidget";
import PopupWidget from "./PopupWidget";
import Widget, { Params } from "./Widget";
import { WidgetResult, WidgetContext, WithRequired } from "../types";
import { ConfigOptions, EngagementMedium, WidgetConfig } from "../types";
import {
  validateConfig,
  validatePasswordlessConfig,
  validateWidgetConfig,
} from "../utils/validate";

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
  npmCdn: string;

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
  constructor(configin: ConfigOptions) {
    const raw = configin as unknown;
    const config = validateConfig(raw);
    this.tenantAlias = config.tenantAlias;
    this.domain = config.domain;
    this.npmCdn = config.npmCdn;
    this.api = new WidgetApi(config);
    // listens to a 'submit_email' event in the theme.
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
   * @param {string} config.jwt the JSON Web Token (JWT) that is used to validate the data (can be disabled)
   * @param {HTMLElement | string | undefined} config.container Element to load the widget into
   * @param {string | undefined} config.trigger Trigger element for opening the popup widget
   *
   * @return {Promise<WidgetResult>} json object if true, with a Widget and user details.
   */
  async upsertUser(config: WithRequired<WidgetConfig, "user">) {
    const raw = config as unknown;
    const clean = validateWidgetConfig(raw) as WithRequired<
      WidgetConfig,
      "user"
    >;
    try {
      const response = await this.api.upsertUser(clean);
      return {
        widget: this._renderWidget(response, clean, {
          type: "upsert",
          user: clean.user || null,
          engagementMedium: config.engagementMedium,
          container: config.container,
          trigger: config.trigger,
        }),
        user: response.user,
      };
    } catch (err) {
      _log(err);
      if (err.apiErrorCode) {
        this._renderErrorWidget(err, config.engagementMedium);
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
  async render(config: WidgetConfig): Promise<WidgetResult | undefined> {
    const raw = config as unknown;
    const clean = validatePasswordlessConfig(raw);

    try {
      const response = await this.api.render(clean);

      return {
        widget: this._renderWidget(response, clean, {
          type: "passwordless",
          engagementMedium: clean.engagementMedium,
        }),
        user: response.user,
      };
    } catch (err) {
      if (err.apiErrorCode) {
        this._renderErrorWidget(err, clean.engagementMedium);
      }
      throw err;
    }
  }

  /**
   * Autofills a referral code into an element when someone has been referred.
   * Uses {@link WidgetApi.squatchReferralCookie} behind the scenes.
   *
   * @param selector Element class/id selector, or a callback function
   * @returns
   */
  autofill(selector: string | Function): void {
    const input = selector as unknown;
    if (typeof input === "function") {
      this.api
        .squatchReferralCookie()
        .then((...args) => input(...args))
        .catch((ex) => {
          _log("Autofill error", ex);
          throw ex;
        });
      return;
    }
    if (typeof input !== "string")
      throw new Error("Autofill accepts a string or function");

    let elems = document.querySelectorAll(input);
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
      .then(({ codes }) => {
        elem.value = codes[0];
      })
      .catch((ex) => {
        throw ex;
      });
  }

  /**
   * @hidden
   * @param {Object} response The json object return from the WidgetApi
   * @param {Object} config Config details
   * @param {string} config.widgetType The widget type (REFERRER_WIDGET, CONVERSION_WIDGET)
   * @param {string} config.engagementMedium (POPUP, EMBED)
   * @returns {Widget} widget (PopupWidget or EmbedWidget)
   */
  private _renderWidget(
    response: any,
    config: WidgetConfig,
    context: WidgetContext
  ) {
    _log("Rendering Widget...");
    if (!response) throw new Error("Unable to get a response");

    let widget;
    let displayOnLoad = !!config.displayOnLoad;
    let displayCTA = false;
    const opts = response.jsOptions || "";

    const params = {
      content: response.template,
      type: config.widgetType || opts.widget.defaultWidgetType,
      api: this.api,
      domain: this.domain,
      npmCdn: this.npmCdn,
      context: context,
    };

    if (opts.widgetUrlMappings) {
      opts.widgetUrlMappings.forEach((rule) => {
        if (Widgets._matchesUrl(rule.url)) {
          if (
            rule.widgetType !== "CONVERSION_WIDGET" ||
            (response.user.referredBy && response.user.referredBy.code)
          ) {
            displayOnLoad = rule.displayOnLoad;
            displayCTA = rule.showAsCTA;
            _log(`Display ${rule.widgetType} on ${rule.url}`);
          } else {
            _log(
              `Don't display ${rule.widgetType} when no referral on widget rule match ${rule.url}`
            );
          }
        }
      });
    }

    if (opts.conversionUrls) {
      opts.conversionUrls.forEach((rule) => {
        if (response.user.referredBy && Widgets._matchesUrl(rule)) {
          _log("This is a conversion URL", rule);
        }
      });
    }

    if (opts.fuelTankAutofillUrls) {
      _log("We found a fuel tank autofill!");

      opts.fuelTankAutofillUrls.forEach(({ url, formSelector }) => {
        if (Widgets._matchesUrl(url)) {
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

    if (config.engagementMedium === "EMBED") {
      this._renderEmbedWidget(params, params.context.container);
    } else if (config.engagementMedium === "POPUP") {
      widget = this._renderPopupWidget(params);
      if (displayOnLoad) widget.open();
    } else {
      _log("display popup on load");
      widget = new PopupWidget(params);
      widget.load();
      if (displayOnLoad) widget.open();
    }

    return widget;
  }

  private _renderPopupWidget(params: Params) {
    const widget = new PopupWidget(params, params.context.trigger);
    const frame = widget._createFrame();
    widget.load(frame);

    return widget;
  }

  private _renderEmbedWidget(params, container) {
    const widget = new EmbedWidget(params);
    const frame = widget._createFrame();
    widget.load(frame);
  }

  /**
   * @hidden
   * @param {Object} error The json object containing the error details
   * @param {string} em The engagementMedium
   * @returns {void}
   */
  private _renderErrorWidget(
    props: { apiErrorCode: string; rsCode: string; message: string },
    em: EngagementMedium = "POPUP"
  ) {
    const { apiErrorCode, rsCode, message } = props;
    _log(new Error(`${apiErrorCode} (${rsCode}) ${message}`));

    const params: Params = {
      content: "error",
      rsCode,
      api: this.api,
      domain: this.domain,
      npmCdn: this.npmCdn,
      type: "ERROR_WIDGET",
      context: { type: "error" },
    };

    let widget: Widget;

    if (em === "EMBED") {
      widget = new EmbedWidget(params);
      const frame = widget._createFrame();
      widget.load(frame);
    } else if (em === "POPUP") {
      widget = new PopupWidget(params);
      const frame = widget._createFrame();
      widget.load(frame);
    }
  }

  /**
   * @hidden
   * @param {string} rule A regular expression
   * @returns {boolean} true if rule matches Url, false otherwise
   */
  private static _matchesUrl(rule) {
    // If there were no matches, null is returned.
    return window.location.href.match(new RegExp(rule)) ? true : false;
  }

  /**
   * @hidden
   * @param {Object} target Object containing the target DOM element
   * @param {Widget} widget A widget (EmbedWidget, PopupWidget)
   * @param {Object} params An object with valid parameters
   *                        (e.g) {email:'email', firstName:'firstName'}
   * @returns {void}
   */
  private static _cb(target, widget, params) {
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
