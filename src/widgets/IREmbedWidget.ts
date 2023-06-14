import debug from "debug";
import AnalyticsApi from "../api/AnalyticsApi";
import { WidgetApi } from "../squatch";
import { domready } from "../utils/domready";
import { delay } from "q";
import { decodeJwt } from "../utils/decodeJwt";
const _log = debug("squatch-js:IREmbedWidget");

export default class IREmbedWidget extends HTMLElement {
  element: HTMLElement;
  widgetType: string | null;
  frame: HTMLIFrameElement;
  content: string;
  analyticsApi: AnalyticsApi;
  widgetApi: WidgetApi;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["widget-type"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    console.log({ attr, oldVal, newVal, content: this.content });

    switch (attr) {
      case "widget-type":
        this.connectedCallback();
        break;
    }
  }

  connectedCallback() {
    this.widgetType = this.getAttribute("widget-type");

    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiaXJ0ZXN0IiwiYWNjb3VudElkIjoiaXJ0ZXN0In0sImVudiI6eyJ0ZW5hbnRBbGlhcyI6InRlc3RfYThiNDFqb3RmOGExdiIsImRvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5yZWZlcnJhbHNhYXNxdWF0Y2guY29tIn19.8I5Kktmb6T3jowYwScZouqSliHRVF3YuFa-atphL2DA";

    const config = decodeJwt(jwt);

    if (!config) return console.error("could not decode jwt");

    if (!config.user) return console.error("could not decode user from jwt");

    if (!config.env) return console.error("could not decode env from jwt");

    this.analyticsApi = new AnalyticsApi({
      domain: config?.env?.domain,
    });
    this.widgetApi = new WidgetApi({
      ...config.env,
    });

    _log("widget initializing ...");

    const userObj = config?.user;

    const response = this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: "EMBED",
        widgetType: this.widgetType!,
        jwt,
      })
      .then((res) => {
        this.frame = document.createElement("iframe");
        this.frame["squatchJsApi"] = this;
        this.frame.width = "100%";
        this.frame.scrolling = "no";
        this.frame.setAttribute(
          "style",
          "border: 0; background-color: none; width: 1px; min-width: 100%;"
        );

        if (this.firstChild) {
          this.replaceChild(this.frame, this.firstChild);
          // Add iframe for the first time
          //   @ts-ignore
        } else if (!this.firstChild || this.firstChild!.nodeName === "#text") {
          this.appendChild(this.frame);
        }

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

          ro.observe(await this._findInnerContainer());
        });
      });
  }

  protected async _findInnerContainer(): Promise<Element> {
    const { contentWindow } = this.frame;
    if (!contentWindow)
      throw new Error("Squatch.js frame inner frame is empty");
    const frameDoc = contentWindow.document;

    function search() {
      const containers = frameDoc.getElementsByTagName("sqh-global-container");
      const legacyContainers =
        frameDoc.getElementsByClassName("squatch-container");
      const fallback =
        containers.length > 0
          ? containers[0]
          : legacyContainers.length > 0
          ? legacyContainers[0]
          : null;
      return fallback;
    }

    let found: Element | null = null;
    for (let i = 0; i < 5; i++) {
      found = search();
      if (found) break;
      await delay(100);
    }
    if (!found) {
      return frameDoc.body;
    }
    return found;
  }

  /*** existing preloading embedded widget functionality */
  // Un-hide if element is available and refresh data
  open() {
    // if (!this.frame) return _log("no target element to open");
    // this.element.style.visibility = "unset";
    // this.element.style.height = "auto";
    // this.element.style["overflow-y"] = "auto";
    // this.frame?.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
    // const _sqh =
    //   this.frame?.contentWindow?.squatch ||
    //   this.frame?.contentWindow?.widgetIdent;
    // this._loadEvent(_sqh);
    // _log("loaded");
  }

  close() {
    // if (!this.frame) return _log("no target element to close");
    // this.element.style.visibility = "hidden";
    // this.element.style.height = "0";
    // this.element.style["overflow-y"] = "hidden";
    // _log("Embed widget closed");
  }
}

window.customElements.define("ir-embed", IREmbedWidget);
