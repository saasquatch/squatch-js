import debug from "debug";
import AnalyticsApi from "../../api/AnalyticsApi";
import WidgetApi from "../../api/WidgetApi";
import { ConfigOptions, DeclarativeConfigOptions, User } from "../../types";
import { decodeUserJwt } from "../../utils/decodeUserJwt";
import { _getAutoConfig } from "../../utils/utmUtils";
import {
  DEFAULT_DOMAIN,
  DEFAULT_NPM_CDN,
  validateLocale,
} from "../../utils/validate";
import EmbedWidget from "../EmbedWidget";
import PopupWidget from "../PopupWidget";

const _log = debug("sqh:DeclarativeWidget");

/**
 * Abstract class for building web-components that render SaaSquatch widgets to the DOM.
 * @abstract
 * @example
 * class TestWidgetElement extends DeclarativeWidget {}
 * const testWidget = new TestWidgetElement()
 * testWidget.widgetType = 'w/widget-type'
 * testWidget.type = 'EMBED'
 * testWidget.renderWidget()
 */
export default abstract class DeclarativeWidget extends HTMLElement {
  /**
   * Configuration overrides
   * @default window.squatchConfig
   */
  config: DeclarativeConfigOptions | undefined;

  /**
   * Signed JWT containing user information
   * @default window.squatchToken
   */
  token: string | undefined;

  /**
   * Tenant alias of SaaSquatch tenant
   * @default window.squatchTenant
   */
  tenant: string | undefined;

  /**
   * widgetType of widget to load
   */
  widgetType: string | undefined;

  /**
   * Locale to render the widget in
   */
  locale: string | undefined;

  /**
   * Instance of {@link WidgetApi}
   */
  widgetApi: WidgetApi;

  /**
   * Instance of {@link AnalyticsApi}
   */
  analyticsApi: AnalyticsApi;

  /**
   * Instance of {@link EmbedWidget} or {@link PopupWidget}
   */
  widgetInstance: EmbedWidget | PopupWidget;

  /**
   * Determines whether to render the widget as an embedding widget or popup widget.
   */
  type: "EMBED" | "POPUP";

  /**
   * Container element to contain the widget iframe
   * @default this
   */
  container: string | HTMLElement | undefined | null;
  element: HTMLElement | undefined;

  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    }).innerHTML = `<style>:host { display: contents; }</style><slot></slot>`;

    this.config = window.squatchConfig;
    this.token = window.squatchToken;
    this.tenant = window.squatchTenant;
    this.container = this;
  }

  private _setupApis(config?: ConfigOptions) {
    if (!this.tenant) throw new Error("Requires tenantAlias");

    this.widgetApi = new WidgetApi({
      tenantAlias: config?.tenantAlias || this.tenant,
      domain: config?.domain || this.config?.domain || DEFAULT_DOMAIN,
    });
    this.analyticsApi = new AnalyticsApi({
      domain: config?.domain || this.config?.domain || DEFAULT_DOMAIN,
    });
  }

  private async renderPasswordlessVariant() {
    const configs = _getAutoConfig();
    this._setupApis(configs?.squatchConfig);

    return await this.widgetApi
      .render({
        engagementMedium: configs?.widgetConfig?.engagementMedium || this.type,
        widgetType: configs?.widgetConfig?.widgetType || this.widgetType,
        locale: configs?.widgetConfig?.locale || this.locale,
      })
      .then((res) => this._setWidget(res.template, { type: "passwordless" }))
      .catch(this.setErrorWidget);
  }

  private async renderUserUpsertVariant() {
    this._setupApis();

    const userObj = decodeUserJwt(this.token!);
    if (!userObj) throw new Error("Could not load user information from jwt");

    const widgetInstance = await this.widgetApi
      .upsertUser({
        user: userObj,
        locale: this.locale,
        engagementMedium: this.type,
        widgetType: this.widgetType,
        jwt: this.token,
      })
      .then((res) =>
        this._setWidget(res.template, { type: "upsert", user: userObj })
      )
      .catch(this.setErrorWidget);

    return widgetInstance;
  }

  private _setWidget = (
    template: any,
    config: { type: "upsert" | "passwordless"; user?: User }
  ) => {
    const params = {
      api: this.widgetApi,
      content: template,
      context: {
        type: config.type,
        user: config.user,
        container: this.container || this,
        engagementMedium: this.type,
      },
      type: this.widgetType!,
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
    };
    if (this.type === "EMBED") {
      return new EmbedWidget(params, params.context.container);
    } else {
      return new PopupWidget(params, this.firstChild ? null : undefined);
    }
  };

  /**
   * Fetches widget content from SaaSquatch and builds a Widget instance to support rendering the widget in the DOM.
   * @returns Instance of either {@link EmbedWidget} or {@link PopupWidget} depending on `this.type`
   * @throws Throws an Error if `widgetType` is undefined
   */
  async getWidgetInstance() {
    let widgetInstance: EmbedWidget | PopupWidget;
    this.widgetType = this.getAttribute("widget") || undefined;
    this.locale = this.getAttribute("locale") || this.locale;

    if (!this.widgetType) throw new Error("No widget has been specified");

    if (!this.token) {
      widgetInstance = await this.renderPasswordlessVariant();
    } else {
      widgetInstance = await this.renderUserUpsertVariant();
    }

    this.widgetInstance = widgetInstance;
    return widgetInstance;
  }

  /**
   * Calls {@link getWidgetInstance} to build the Widget instance and loads the widget iframe into the DOM.
   */
  async renderWidget() {
    await this.getWidgetInstance();
    await this.widgetInstance.load();
  }

  /**
   * Builds a Widget instance for the default error widget.
   * @returns Instance of either {@link EmbedWidget} or {@link PopupWidget} depending on `this.type`
   */
  setErrorWidget = (e: Error) => {
    const params = {
      api: this.widgetApi,
      content: "error",
      context: { type: "error" as const, container: this.container || this },
      type: "ERROR_WIDGET",
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
    };
    if (this.type === "EMBED") {
      return new EmbedWidget(params, params.context.container);
    } else {
      return new PopupWidget(params, this.firstChild ? null : undefined);
    }
  };

  /**
   * Calls `open` method of `widgetInstance`
   * @throws Throws an Error if called before the widget has loaded
   */
  open() {
    if (!this.widgetInstance) throw new Error("Widget has not loaded yet");
    this.widgetInstance.open();
  }

  /**
   * Calls `close` method of `widgetInstance`
   * @throws Throws an Error if called before the widget has loaded
   */
  close() {
    if (!this.widgetInstance) throw new Error("Widget has not loaded yet");
    this.widgetInstance.close();
  }

  reload = this.renderWidget;
  show = this.open;
  hide = this.close;
}
