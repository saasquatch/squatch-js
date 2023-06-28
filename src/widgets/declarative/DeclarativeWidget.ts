import AnalyticsApi from "../../api/AnalyticsApi";
import { EmbedWidget, PopupWidget, WidgetApi } from "../../squatch";
import { ConfigOptions, DeclarativeConfigOptions } from "../../types";
import { decodeUserJwt } from "../../utils/decodeUserJwt";
import { _getAutoConfig } from "../../utils/utmUtils";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../utils/validate";

export default abstract class DeclarativeWidget extends HTMLElement {
  config: DeclarativeConfigOptions;
  token: string;
  tenant: string;
  widgetType: string | undefined;

  widgetApi: WidgetApi;
  analyticsApi: AnalyticsApi;

  type: "EMBED" | "POPUP";
  widgetInstance: EmbedWidget | PopupWidget;
  frame: HTMLIFrameElement;

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
    this.widgetApi = new WidgetApi({
      tenantAlias: config?.tenantAlias || this.tenant,
      domain: config?.domain || this.config.domain || DEFAULT_DOMAIN,
    });
    this.analyticsApi = new AnalyticsApi({
      domain: config?.domain || this.config.domain || DEFAULT_DOMAIN,
    });
  }

  renderPasswordlessVariant() {
    const configs = _getAutoConfig();
    this._setupApis(configs?.squatchConfig);

    return this.widgetApi
      .render({
        engagementMedium: configs?.widgetConfig?.engagementMedium || this.type,
        widgetType: configs?.widgetConfig?.widgetType || this.widgetType,
      })
      .then((res) => this._setWidget(res.template, { type: "passwordless" }))
      .catch(this._setErrorWidget);
  }

  async renderUserUpsertVariant() {
    if (!this.widgetType) throw new Error("Widget must be specified");
    this._setupApis();

    const userObj = decodeUserJwt(this.token);
    if (!userObj) throw new Error("Could not load user information from jwt");

    const widgetInstance = await this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: this.type,
        widgetType: this.widgetType,
        jwt: this.token,
      })
      .then((res) => this._setWidget(res.template, { type: "upsert" }))
      .catch(this._setErrorWidget);

    return widgetInstance;
  }

  _setWidget = (template: any, config: { type: "upsert" | "passwordless" }) => {
    if (!this.widgetType) throw new Error("Widget was no specified");
    const Widget = this.type === "EMBED" ? EmbedWidget : PopupWidget;

    return new Widget({
      api: this.widgetApi,
      content: template,
      context: { type: config.type, engagementMedium: this.type },
      type: this.widgetType,
      domain: this.config.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container || this,
    });
  };

  async renderWidget() {
    this.widgetType = this.getAttribute("widget") || undefined;

    if (!this.widgetType) throw new Error("No widget has been specified");

    if (!this.token) {
      this.widgetInstance = await this.renderPasswordlessVariant();
    } else {
      this.widgetInstance = await this.renderUserUpsertVariant();
    }

    if (!this.widgetInstance) throw new Error("Could not create widget.");

    this.element = this.widgetInstance._findElement();
    this.frame = this.widgetInstance._createFrame();
    this.widgetInstance.load(this.frame);
  }

  _setErrorWidget = (e: Error) => {
    const Widget = this.type === "EMBED" ? EmbedWidget : PopupWidget;

    return new Widget({
      api: this.widgetApi,
      content: "error",
      context: { type: "error" },
      type: "ERROR_WIDGET",
      domain: this.config.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container || this,
    });
  };

  open() {
    this.widgetInstance.open(this.frame);
  }

  close() {
    this.widgetInstance.close(this.frame);
  }
}
