import debug from "debug";
import AnalyticsApi from "../../api/AnalyticsApi";
import WidgetApi from "../../api/WidgetApi";
import { ConfigOptions, DeclarativeConfigOptions } from "../../types";
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
 * Abstract class for declarative widget web-components
 * @extends HTMLElement
 * @example <caption>Example usage for extending DeclarativeWidget</caption>
 * class TestWidget extends DeclarativeWidget {
 *   this.type = "EMBED" // An embedded widget
 *   async connectedCallback() {
 *     await this.renderWidget()
 *   }
 * }
 */
export default abstract class DeclarativeWidget extends HTMLElement {
  config: DeclarativeConfigOptions | undefined;
  token: string | undefined;
  tenant: string | undefined;
  widgetType: string | undefined;
  locale: string | undefined;

  widgetApi: WidgetApi;
  analyticsApi: AnalyticsApi;

  type: "EMBED" | "POPUP";
  widgetInstance: EmbedWidget | PopupWidget;

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

    this.locale = validateLocale(navigator.language.replace(/\-/g, "_"));
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
      .then((res) => this._setWidget(res.template, { type: "upsert" }))
      .catch(this.setErrorWidget);

    return widgetInstance;
  }

  private _setWidget = (
    template: any,
    config: { type: "upsert" | "passwordless" }
  ) => {
    const params = {
      api: this.widgetApi,
      content: template,
      context: { type: config.type, engagementMedium: this.type },
      type: this.widgetType!,
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container || this,
    };
    if (this.type === "EMBED") {
      return new EmbedWidget(params);
    } else {
      return new PopupWidget(params, this.firstChild ? null : undefined);
    }
  };

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

    if (!widgetInstance) throw new Error("Could not create widget.");

    this.widgetInstance = widgetInstance;
    return widgetInstance;
  }

  async renderWidget() {
    await this.getWidgetInstance();
    await this.widgetInstance.load();
  }

  setErrorWidget = (e: Error) => {
    const params = {
      api: this.widgetApi,
      content: "error",
      context: { type: "error" as const },
      type: "ERROR_WIDGET",
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container || this,
    };
    if (this.type === "EMBED") {
      return new EmbedWidget(params);
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
