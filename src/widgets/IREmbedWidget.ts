import debug from "debug";
import AnalyticsApi from "../api/AnalyticsApi";
import { EmbedWidget, WidgetApi } from "../squatch";
import { decodeUserJwt } from "../utils/decodeUserJwt";
import { domready } from "../utils/domready";
import { loadEvent } from "../utils/loadEvent";
import { _getAutoConfig } from "../utils/utmUtils";
const _log = debug("squatch-js:IREmbedWidget");

export default class IREmbedWidget extends HTMLElement {
  widgetType: string | null;
  container: string | HTMLElement | null;
  element: HTMLElement;
  frame: HTMLIFrameElement;
  content: string;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;

  widget: EmbedWidget;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["widget-type", "container"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !this.frame) return; // nothing to do
    switch (attr) {
      case "container":
        if (this.element) this.close();
        this.connectedCallback();
        break;
      case "widget-type":
        this.connectedCallback();
        break;
    }
  }

  _setupApi({ domain, tenantAlias }: { domain: string; tenantAlias: string }) {
    this.analyticsApi = new AnalyticsApi({
      domain,
    });
    this.widgetApi = new WidgetApi({
      tenantAlias,
      domain,
    });
  }

  _loadPasswordlessWidget() {
    const configs = _getAutoConfig();

    // Has _saasquatchExtra
    if (configs) {
      const { squatchConfig, widgetConfig } = configs;
      this._setupApi({
        domain: squatchConfig.domain!,
        tenantAlias: squatchConfig.tenantAlias,
      });
      this.widgetApi.render(widgetConfig).then(this._renderWidget);
      // No _saasquatchExtra
    } else {
      this._setupApi({
        domain: window.irEmbed.domain!,
        tenantAlias: window.irEmbed.tenantAlias,
      });
      this.widgetApi
        .render({
          engagementMedium: "EMBED",
          widgetType: this.widgetType!,
        })
        .then(this._renderWidget);
    }
  }

  _loadUserWidget(jwt: string) {
    const userObj = decodeUserJwt(jwt);

    if (!userObj) return _log("could not decode user from jwt");

    this._setupApi({
      domain: window.irEmbed.domain!,
      tenantAlias: window.irEmbed.tenantAlias,
    });

    this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: "EMBED",
        widgetType: this.widgetType!,
        jwt,
      })
      .then(this._renderWidget);
  }

  _renderErrorWidget = () => {
    this.widget = new EmbedWidget({
      api: this.widgetApi,
      content: "error",
      context: { type: "error" }, // TODO: Change
      type: "ERROR_WIDGET",
      npmCdn: "https://fast.ssqt.io/npm",
      domain: window.irEmbed.domain,
      container: this.container || this,
    });

    this.element = this.widget._findElement();
    this.frame = this.widget._createFrame();
    this.widget.load(this.frame);
  };

  _renderWidget = (res) => {
    this.widget = new EmbedWidget({
      api: this.widgetApi,
      content: res.template,
      context: { type: "upsert" }, // TODO: Change
      type: this.widgetType as string,
      npmCdn: "https://fast.ssqt.io/npm",
      domain: window.irEmbed.domain,
      container: this.container || this,
    });

    this.element = this.widget._findElement();
    this.frame = this.widget._createFrame();
    this.widget.load(this.frame);
  };

  connectedCallback() {
    this.widgetType = this.getAttribute("widget-type");
    this.container = this.getAttribute("container");

    const jwt = window.irEmbed?.jwt;

    _log("widget initializing ...");

    if (!jwt) return this._loadPasswordlessWidget();

    this._loadUserWidget(jwt);
  }

  // Un-hide if element is available and refresh data
  open() {
    this.widget.open(this.frame);
  }

  close() {
    this.widget.close(this.frame);
  }
}

window.customElements.define("ir-embed", IREmbedWidget);
