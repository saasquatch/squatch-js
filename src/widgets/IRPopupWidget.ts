import debug from "debug";
import AnalyticsApi from "../api/AnalyticsApi";
import {
  PopupWidget,
  WidgetApi,
  WidgetContext,
  WidgetContextType,
  WidgetType,
  Widgets,
} from "../squatch";
import { decodeUserJwt } from "../utils/decodeUserJwt";
import { domready } from "../utils/domready";
import { loadEvent } from "../utils/loadEvent";
import { _getAutoConfig } from "../utils/utmUtils";
const _log = debug("squatch-js:IRPopupWidget");

export default class IRPopupWidget extends HTMLElement {
  triggerElement: HTMLElement | null;
  popupdiv: HTMLElement;
  popupcontent: HTMLElement;
  widgetType: string | null;
  frame: HTMLIFrameElement;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;
  content: string;

  widget: PopupWidget;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["widget-type", "id"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    switch (attr) {
      case "widget-type":
        this.connectedCallback();
        break;
    }
  }

  connectedCallback() {
    this.widgetType = this.getAttribute("widget-type");

    const jwt = window.irPopup?.jwt;

    _log("widget initializing ...");

    if (!jwt) return this._loadPasswordlessWidget();

    this._loadUserWidget(jwt);
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

  _setFrameContents(res) {
    if (this.popupdiv.firstChild) {
      this.popupdiv.replaceChild(this.frame, this.popupdiv.firstChild);
      // Add iframe for the first time
    } else if (
      !this.popupdiv.firstChild ||
      //   @ts-ignore
      this.popupdiv.firstChild!.nodeName === "#text"
    ) {
      this.popupdiv.appendChild(this.frame);
    }

    this.content = res.template;

    this.popupdiv.appendChild(this.popupcontent);
    document.body.appendChild(this.popupdiv);
    this.popupcontent.appendChild(this.frame);

    //@ts-ignore -- will occasionally throw a null pointer exception at runtime
    const frameDoc = this.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(this.content);
    frameDoc.close();
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
      this.widgetApi.render(widgetConfig).then((res) => {
        _log("Popup template loaded into iframe");
        this._setFrameContents(res);
        this._setupResizeHandler();
        this.open();
      });
      // No _saasquatchExtra
    } else {
      this._setupApi({
        domain: window.irPopup.domain!,
        tenantAlias: window.irPopup.tenantAlias,
      });
      this.widgetApi
        .render({
          engagementMedium: "POPUP",
          widgetType: this.widgetType!,
        })
        .then((res) => {
          _log("Popup template loaded into iframe");
          this._renderWidget(res, {
            type: "passwordless",
            engagementMedium: "POPUP",
          });
        })
        .catch((e) => {
          _log("Could not access widget API");
          this._renderErrorWidget();
        });
    }
  }

  _loadUserWidget(jwt: string) {
    const userObj = decodeUserJwt(jwt);

    if (!userObj) return _log("could not decode user from jwt");

    this._setupApi({
      domain: window.irPopup.domain!,
      tenantAlias: window.irPopup.tenantAlias,
    });

    this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: "EMBED",
        widgetType: this.widgetType!,
        jwt,
      })
      .then((res) => {
        _log("Popup template loaded into iframe");
        this._renderWidget(res, {
          ...userObj,
          type: "upsert",
          engagementMedium: "EMBED",
        });
      })
      .catch((e) => {
        _log("Could not upsert user successfully");
        this._renderErrorWidget();
      });
  }

  _renderErrorWidget() {
    this.widget = new PopupWidget({
      api: this.widgetApi,
      content: "error",
      context: { type: "error" },
      type: "ERROR_WIDGET",
      npmCdn: "https://fast.ssqt.io/npm",
      domain: window.irEmbed.domain,
    });

    this.frame = this.widget._createFrame();
    this.widget.load(this.frame);
  }

  _renderWidget(res, context: WidgetContext) {
    this.widget = new PopupWidget({
      api: this.widgetApi,
      content: res.template,
      context,
      type: this.widgetType as string,
      npmCdn: "https://fast.ssqt.io/npm",
      domain: window.irEmbed.domain,
    });

    this.frame = this.widget._createFrame();
    this.widget.load(this.frame);
  }

  protected _setupResizeHandler() {
    const popupdiv = this.popupdiv;
    const frame = this.frame;
    const { contentWindow } = frame;

    if (!contentWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, async () => {
      frameDoc.body.style.overflowY = "hidden";
      popupdiv.style.visibility = "hidden";
      popupdiv.style.display = "block";
      frame.height = `${frameDoc.body.offsetHeight}px`;
      // Adjust frame height when size of body changes
      const ro = new contentWindow["ResizeObserver"]((entries) => {
        for (const entry of entries) {
          const { top, bottom } = entry.contentRect;

          const computedHeight = bottom + top;
          frame.height = computedHeight + "";

          // Don't let anything else set the height of this element
          entry.target.style = ``;

          if (window.innerHeight > Number(frame.height)) {
            popupdiv.style.paddingTop = `${
              (window.innerHeight - Number(frame.height)) / 2
            }px`;
          } else {
            popupdiv.style.paddingTop = "5px";
          }
        }
      });
      const widget = frameDoc.body.firstElementChild;
      const wrapper = document.createElement("div");

      frameDoc.body.appendChild(wrapper);
      wrapper.appendChild(widget!);

      ro.observe(wrapper);
    });
  }

  protected _clickedOutside({ target }) {
    if (target === this.popupdiv) {
      this.close();
    }
  }

  open() {
    this.widget.open(this.frame);
  }

  close() {
    this.widget.close();

    _log("Popup closed");
  }
}

window.customElements.define("ir-popup", IRPopupWidget);
