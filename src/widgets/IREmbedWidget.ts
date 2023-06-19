import debug from "debug";
import AnalyticsApi, { SQHDetails } from "../api/AnalyticsApi";
import { EngagementMedium, WidgetApi } from "../squatch";
import { decodeUserJwt } from "../utils/decodeUserJwt";
import { domready } from "../utils/domready";
import { hasProps, isObject } from "../utils/validate";
import { loadEvent } from "../utils/loadEvent";
const _log = debug("squatch-js:IREmbedWidget");

export default class IREmbedWidget extends HTMLElement {
  widgetType: string | null;
  container: string | null;
  element: HTMLElement;
  frame: HTMLIFrameElement;
  content: string;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;

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

  _createFrame() {
    if (typeof this.container === "string") {
      this.element = document.querySelector(this.container) as HTMLElement;
      _log("loading widget with selector", this.element);
    } else if (this.container) {
      _log("container must be an HTMLElement or string", this.container);
    }

    this.frame = document.createElement("iframe");
    this.frame["squatchJsApi"] = this;
    this.frame.width = "100%";
    this.frame.scrolling = "no";
    this.frame.setAttribute(
      "style",
      "border: 0; background-color: none; width: 1px; min-width: 100%;"
    );

    // Custom container to load widget
    if (this.container) {
      this.element.style.visibility = "hidden";
      this.element.style.height = "0";
      this.element.style["overflow-y"] = "hidden";

      // Widget reloaded - replace existing element
      if (this.element.firstChild) {
        this.element.replaceChild(this.frame, this.element.firstChild);
        // Add iframe for the first time
      } else {
        this.element.appendChild(this.frame);
      }
    } else if (this.firstChild) {
      this.replaceChild(this.frame, this.firstChild);
      // Add iframe for the first time
      //   @ts-ignore
    } else if (!this.firstChild || this.firstChild!.nodeName === "#text") {
      this.appendChild(this.frame);
    }
  }

  connectedCallback() {
    this.widgetType = this.getAttribute("widget-type");
    this.container = this.getAttribute("container");

    const jwt = window.irEmbed.jwt;

    const userObj = decodeUserJwt(jwt);

    if (!userObj) return _log("could not decode user from jwt");

    this.analyticsApi = new AnalyticsApi({
      domain: window.irEmbed.domain,
    });
    this.widgetApi = new WidgetApi({
      tenantAlias: window.irEmbed.tenantAlias,
      domain: window.irEmbed.domain,
    });

    _log("widget initializing ...");

    this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: "EMBED",
        widgetType: this.widgetType!,
        jwt,
      })
      .then((res) => {
        this._createFrame();

        this.content = res.template;

        const { contentWindow } = this.frame;
        if (!contentWindow) {
          throw new Error("Frame needs a content window");
        }

        // TODO: figure out the best way to do this
        const frameDoc = contentWindow.document;
        frameDoc.open();
        frameDoc.write(this.content);
        frameDoc.close();

        domready(frameDoc, async () => {
          const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
          // @ts-ignore -- number will be cast to string by browsers
          this.frame.height = frameDoc.body.scrollHeight;

          // Adjust frame height when size of body changes
          // @ts-ignore
          const ro = new contentWindow["ResizeObserver"]((entries) => {
            for (const entry of entries) {
              const { height } = entry.contentRect;
              // @ts-ignore -- number will be cast to string by browsers
              this.frame.height = height;
            }
          });

          const widget = frameDoc.body.firstElementChild;
          const wrapper = document.createElement("div");

          frameDoc.body.appendChild(wrapper);
          wrapper.appendChild(widget!);

          ro.observe(wrapper);

          // Regular load - trigger event
          if (!this.container) {
            loadEvent(_sqh, this.analyticsApi);
            _log("loaded");
          }
        });
      });
  }

  // Un-hide if element is available and refresh data
  open() {
    if (!this.frame) return _log("no target element to open");
    this.element.style.visibility = "unset";
    this.element.style.height = "auto";
    this.element.style["overflow-y"] = "auto";
    this.frame?.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
    const _sqh =
      this.frame?.contentWindow?.squatch ||
      this.frame?.contentWindow?.widgetIdent;
    loadEvent(_sqh, this.analyticsApi);
    _log("loaded");
  }

  close() {
    if (!this.frame) return _log("no target element to close");
    this.element.style.visibility = "hidden";
    this.element.style.height = "0";
    this.element.style["overflow-y"] = "hidden";
    _log("Embed widget closed");
  }
}

window.customElements.define("ir-embed", IREmbedWidget);
