import { debug } from "../../utils/logger";
import AnalyticsApi from "../../api/AnalyticsApi";
import WidgetApi from "../../api/WidgetApi";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../globals";
import {
  ConfigOptions,
  DeclarativeConfigOptions,
  User,
  WidgetValueConfig,
} from "../../types";
import { decodeUserJwt } from "../../utils/decodeUserJwt";
import { getConfig, getToken } from "../../utils/validate";
import EmbedWidget from "../EmbedWidget";
import PopupWidget from "../PopupWidget";
import type { Params } from "../Widget";

const _log = debug("squatch-js:DeclarativeWidget");

/**
 * Abstract class for building web-components that render SaaSquatch widgets to the DOM
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
   * Determines whether to render the widget as an embedding widget or popup widget
   */
  type: "EMBED" | "POPUP";

  /**
   * Container element to contain the widget iframe
   * @default this
   */
  container: string | HTMLElement | undefined | null;
  element: HTMLElement | undefined;

  /**
   * Flag for if the component has been loaded or not
   * @hidden
   */
  loaded: boolean;

  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    }).innerHTML = `<style>:host { display: block; }</style><slot></slot>`;

    this.config = getConfig();
    this.token = getToken();
    this.tenant = window.squatchTenant;
    this.container = this;
  }

  private _setupApis(config?: ConfigOptions) {
    if (!this.tenant) throw new Error("tenantAlias not provided");

    this.widgetApi = new WidgetApi({
      tenantAlias: config?.tenantAlias || this.tenant,
      domain: config?.domain || this.config?.domain || DEFAULT_DOMAIN,
    });
    this.analyticsApi = new AnalyticsApi({
      domain: config?.domain || this.config?.domain || DEFAULT_DOMAIN,
    });
  }

  protected getWidgetType(
    widgetType?: string,
  ): "instant-access" | "verified-access" {
    if (widgetType && widgetType.includes("friendWidget")) {
      return "instant-access";
    }
    return "verified-access";
  }

  private async renderPasswordlessVariant() {
    this._setupApis();

    _log("Rendering as an Instant Access widget");

    return await this.widgetApi
      .render({
        engagementMedium: this.type,
        widgetType: this.widgetType,
        locale: this.locale,
      })
      .then((res) => this._setWidget(res, { type: "passwordless" }))
      .catch(this.setErrorWidget);
  }

  private async renderUserUpsertVariant() {
    this._setupApis();

    const userObj = decodeUserJwt(this.token!);
    if (!userObj) {
      return this.setErrorWidget(Error("No user object in token."));
    }

    // Use the user's locale from the JWT if no locale attribute was set
    if (!this.locale && userObj.locale) {
      this.locale = userObj.locale;
    }

    _log("Rendering as a Verified widget");

    try {
      await this.widgetApi.upsertUser({
        user: userObj,
        locale: this.locale,
        engagementMedium: this.type,
        widgetType: this.widgetType,
        jwt: this.token,
      });
    } catch (e) {
      return this.setErrorWidget(
        e as
          | Error
          | { apiErrorCode?: string; rsCode?: string; message?: string },
      );
    }

    const widgetInstance = await this.widgetApi
      .render({
        locale: this.locale,
        engagementMedium: this.type,
        widgetType: this.widgetType,
      })
      .then((res) => {
        return this._setWidget(res, { type: "upsert", user: userObj });
      })
      .catch(this.setErrorWidget);

    return widgetInstance;
  }

  private _setWidget = (
    res: { template: any; widgetConfig: WidgetValueConfig },
    config: { type: "upsert" | "passwordless"; user?: User },
  ) => {
    const params = {
      api: this.widgetApi,
      content: res.template,
      context: {
        type: config.type,
        user: config.user,
        container: this.container || undefined,
        engagementMedium: this.type,
        widgetConfig: res.widgetConfig,
      },
      type: this.widgetType!,
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this,
    } as Params;
    if (this.type === "EMBED") {
      return new EmbedWidget(params);
    } else {
      const useFirstChildTrigger = this.firstChild ? null : undefined;
      return new PopupWidget(params, useFirstChildTrigger);
    }
  };

  /**
   * Fetches widget content from SaaSquatch and builds a Widget instance to support rendering the widget in the DOM
   * @returns Instance of either {@link EmbedWidget} or {@link PopupWidget} depending on `this.type`
   * @throws Throws an Error if `widgetType` is undefined
   */
  async getWidgetInstance() {
    let widgetInstance: EmbedWidget | PopupWidget;
    this.widgetType = this.getAttribute("widget") || undefined;
    this.locale = this.getAttribute("locale") || this.locale;
    const widgetType = this.getWidgetType(this.widgetType);

    if (!this.widgetType) throw new Error("No widget has been specified");

    if (!this.token && widgetType === "verified-access") {
      _log(
        "[SquatchJS] Authentication token is required for this widget type.",
      );
    }

    if (!this.token) {
      widgetInstance = await this.renderPasswordlessVariant();
    } else {
      widgetInstance = await this.renderUserUpsertVariant();
    }

    this.widgetInstance = widgetInstance;

    if (this.widgetInstance)
      this.dispatchEvent(new CustomEvent("sq:widget-loaded"));

    return widgetInstance;
  }

  /**
   * Calls {@link getWidgetInstance} to build the Widget instance and loads the widget iframe into the DOM
   */
  async renderWidget() {
    await this.getWidgetInstance();
    await this.widgetInstance.load();
  }

  /**
   * Builds a Widget instance for the default error widget
   * @returns Instance of either {@link EmbedWidget} or {@link PopupWidget} depending on `this.type`
   */
  setErrorWidget = (
    e:
      | Error
      | {
          apiErrorCode?: string;
          rsCode?: string;
          statusCode?: number;
          message?: string;
        },
  ) => {
    // Extract error details from either Error object or API error response
    const errorMessage = e instanceof Error ? e.message : e?.message;
    const apiErrorCode = (e as any)?.apiErrorCode;
    const rsCode = (e as any)?.rsCode;
    const statusCode = (e as any)?.statusCode;

    const params = {
      api: this.widgetApi,
      content: "error",
      context: {
        type: "error" as const,
        container: this.container || undefined,
      },
      type: "ERROR_WIDGET",
      domain: this.config?.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this,
      apiErrorCode,
      rsCode,
      statusCode,
      errorMessage,
    };

    if (this.type === "EMBED") {
      return new EmbedWidget(params);
    } else {
      const useFirstChildTrigger = this.firstChild ? null : undefined;
      return new PopupWidget(params, useFirstChildTrigger);
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

  static get observedAttributes() {
    return ["widget", "locale"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !this.loaded) return;

    switch (attr) {
      case "locale":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  async connectedCallback() {
    this.loaded = true;
    this.container = this.getAttribute("container");
    this.widgetType = this.getAttribute("widget") || undefined;

    const skeletonWidgetType = this.getWidgetType(this.widgetType);

    const { getSkeleton } = await import("../SkeletonTemplate");
    const skeletonHTML = getSkeleton({
      type: skeletonWidgetType,
    });

    const skeletonContainer = document.createElement("div");
    skeletonContainer.id = "loading-skeleton";
    skeletonContainer.innerHTML = skeletonHTML;

    const root = this.shadowRoot || this.attachShadow({ mode: "open" });

    // For popup widgets, insert skeleton into the dialog container if it exists
    if (this.type === "POPUP") {
      const dialogContainer = root.getElementById("squatchModal");
      if (dialogContainer) {
        dialogContainer.innerHTML = "";
        dialogContainer.appendChild(skeletonContainer);
      } else {
        root.appendChild(skeletonContainer);
      }
    } else {
      root.innerHTML = "";
      root.appendChild(skeletonContainer);
    }

    try {
      await this.renderWidget();
    } catch (error) {
      _log("Failed to render widget", error);
    } finally {
      const loadingElement = root.getElementById("loading-skeleton");
      if (loadingElement) {
        loadingElement.remove();
      }
    }

    if (this.getAttribute("open") !== null) this.open();
  }
}
