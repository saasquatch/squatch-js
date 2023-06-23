import AnalyticsApi from "../../api/AnalyticsApi";
import { EmbedWidget, PopupWidget, WidgetApi, widget } from "../../squatch";
import { DeclarativeConfigOptions } from "../../types";
import { decodeUserJwt } from "../../utils/decodeUserJwt";
import { _getAutoConfig } from "../../utils/utmUtils";
import { DEFAULT_DOMAIN, DEFAULT_NPM_CDN } from "../../utils/validate";

export default abstract class DeclarativeWidget extends HTMLElement {
  config: DeclarativeConfigOptions;
  token: string;
  tenant: string;
  widgetType: string | null;

  widgetApi: WidgetApi;
  analyticsApi: AnalyticsApi;

  type: "EMBED" | "POPUP";
  widgetInstance: EmbedWidget | PopupWidget;
  frame: HTMLIFrameElement;

  // Embed specific:
  container: string | HTMLElement | undefined;
  element: HTMLElement | undefined;

  constructor() {
    super();

    this.config = window.squatchConfig;
    this.token = window.squatchToken;
    this.tenant = window.squatchTenant;

    console.log(window.squatchTenant, this.config);
    this.widgetApi = new WidgetApi({
      tenantAlias: this.tenant,
      domain: this.config.domain || DEFAULT_DOMAIN,
    });
    this.analyticsApi = new AnalyticsApi({
      domain: this.config.domain || DEFAULT_DOMAIN,
    });
  }

  renderPasswordlessVariant() {
    const configs = _getAutoConfig();

    if (configs) {
      // TODO: Do we use the config in _saasquatchExtra or the one set in window.squatch______?
      const { squatchConfig, widgetConfig } = configs;
      return this.widgetApi
        .render(widgetConfig)
        .then((res) => this._setWidget(res, { type: "passwordless" }))
        .catch(this._setErrorWidget);
    }

    return this.widgetApi
      .render({
        engagementMedium: this.type,
        widgetType: this.widgetType || undefined, // FIXME: Type issue
      })
      .then((res) => this._setWidget(res, { type: "passwordless" }))
      .catch(this._setErrorWidget);
  }

  async renderUserUpsertVariant() {
    if (!this.widgetType) throw new Error("Widget must be specified");

    const userObj = decodeUserJwt(this.token);
    if (!userObj) throw new Error("Could not load user information from jwt");

    console.log({ api: this.widgetApi });
    const widgetInstance = await this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: this.type,
        widgetType: this.widgetType,
        jwt: this.token,
      })
      .then((res) => this._setWidget(res, { type: "upsert" }))
      .catch(this._setErrorWidget);

    return widgetInstance;
  }

  _setWidget = (res: any, config: { type: "upsert" | "passwordless" }) => {
    if (!this.widgetType) throw new Error("Widget was no specified");
    const Widget = this.type === "EMBED" ? EmbedWidget : PopupWidget;

    return new Widget({
      api: this.widgetApi,
      content: res.template,
      context: { type: config.type, engagementMedium: this.type },
      type: this.widgetType,
      domain: this.config.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container || this,
    });
  };

  renderWidget() {
    this.widgetInstance.load(this.frame);
  }

  _setErrorWidget = (e: Error) => {
    console.log("ERROR");
    const Widget = this.type === "EMBED" ? EmbedWidget : PopupWidget;

    return new Widget({
      api: this.widgetApi,
      content: "error",
      context: { type: "error" },
      type: "ERROR_WIDGET",
      domain: this.config.domain || DEFAULT_DOMAIN,
      npmCdn: DEFAULT_NPM_CDN,
      container: this.container,
    });
  };

  async connectedCallback() {
    this.widgetType = this.getAttribute("widget");
    console.log({ widget: this.getAttribute("widget") });
    if (!this.widgetType) throw new Error("No widget has been specified");

    if (!this.token) {
      this.widgetInstance = await this.renderPasswordlessVariant();
    } else {
      this.widgetInstance = await this.renderUserUpsertVariant();
    }

    if (!this.widgetInstance) throw new Error("Could not create widget.");

    this.frame = this.widgetInstance._createFrame();
    this.renderWidget();
  }

  open() {
    this.widgetInstance.open(this.frame);
  }

  close() {
    this.widgetInstance.close(this.frame);
  }
}
