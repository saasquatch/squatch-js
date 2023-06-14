import debug from "debug";
import AnalyticsApi from "../api/AnalyticsApi";
import { WidgetApi } from "../squatch";
import { domready } from "../utils/domready";
import { delay } from "q";
import { decodeJwt } from "../utils/decodeJwt";
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

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["widget-type", "id"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    console.log({ attr, oldVal, newVal, content: this.popupcontent });

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

    this.analyticsApi = new AnalyticsApi({
      domain: config?.env?.domain,
    });
    this.widgetApi = new WidgetApi({
      ...config.env,
    });

    _log("widget initializing ...");

    const userObj = config.user;

    try {
      this.triggerElement /* HTMLButton */ = document.querySelector(this.id);
      if (this.id && !this.triggerElement)
        _log("No element found with trigger selector", this.id);
    } catch {
      _log("Not a valid selector", this.id);
    }

    // Trigger is optional
    if (this.triggerElement) {
      this.triggerElement.onclick = () => {
        this.open();
      };
    }

    // First time load
    if (!this.popupdiv) {
      this.frame = document.createElement("iframe");
      this.frame["squatchJsApi"] = this;
      this.frame.width = "100%";
      this.frame.scrolling = "no";
      this.frame.setAttribute(
        "style",
        "border: 0; background-color: none; width: 1px; min-width: 100%;"
      );

      this.popupdiv = document.createElement("div");
      this.popupdiv.id = "squatchModal";
      this.popupdiv.setAttribute(
        "style",
        "display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);"
      );

      document.head.insertAdjacentHTML(
        "beforeend",
        `<style>#squatchModal::-webkit-scrollbar { display: none; }</style>`
      );

      this.popupcontent = document.createElement("div");
      this.popupcontent.setAttribute(
        "style",
        "margin: auto; width: 80%; max-width: 500px; position: relative;"
      );

      this.popupdiv.onclick = (event) => {
        this._clickedOutside(event);
      };
    }

    const response = this.widgetApi
      .upsertUser({
        user: userObj,
        engagementMedium: "EMBED",
        widgetType: this.widgetType!,
        jwt,
      })
      .then((res) => {
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
        _log("Popup template loaded into iframe");
        this._setupResizeHandler();
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
      ro.observe(await this._findInnerContainer());
    });
  }

  protected _clickedOutside({ target }) {
    if (target === this.popupdiv) {
      this.close();
    }
  }

  open() {
    const popupdiv = this.popupdiv;
    const frame = this.frame;
    const { contentWindow } = frame;
    if (!contentWindow) throw new Error("Squatch.js has an empty iframe");
    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
      const ctaElement = frameDoc.getElementById("cta");

      if (ctaElement) {
        //@ts-ignore -- will occasionally throw a null pointer exception at runtime
        ctaElement.parentNode.removeChild(ctaElement);
      }

      popupdiv.style.visibility = "visible";
      popupdiv.style.top = "0px";
      frame.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
      // TODO: port this over
      //   this._loadEvent(_sqh);
      _log("Popup opened");
    });
  }

  close() {
    this.popupdiv.style.visibility = "hidden";
    this.popupdiv.style.top = "-2000px";

    _log("Popup closed");
  }
}

window.customElements.define("ir-popup", IRPopupWidget);
