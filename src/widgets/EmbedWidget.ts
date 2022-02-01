// @ts-check

import debug from "debug";
import Widget, { Params } from "./Widget";
import { domready } from "../utils/domready";

const _log = debug("squatch-js:EMBEDwidget");

/**
 * An EmbedWidget is displayed inline in part of your page.
 *
 * To create an EmbedWidget use {@link Widgets}
 *
 */
export default class EmbedWidget extends Widget {
  element: HTMLElement;
  targetElement: HTMLElement & EmbedWidget;

  constructor(params: Params, selector = "#squatchembed") {
    super(params);
    // Add required functions and data to target element
    if (params.context.element) {
      this.targetElement = params.context.element;
      this.targetElement.open = this.open;
      this.targetElement.close = this.close;
      this.targetElement.frame = this.frame;
      this.targetElement._loadEvent = this._loadEvent;
      this.targetElement.analyticsApi = this.analyticsApi;
    }
    const element =
      document.querySelector(selector) ||
      document.querySelector(".squatchembed");

    if (element === undefined)
      throw new Error(`element with selector '${selector}' not found.'`);
    this.element = element as HTMLElement;
  }

  async load() {
    if (this.targetElement) {
      this.targetElement.style.visibility = "hidden";
      this.targetElement.style.height = "0";
      this.targetElement.style["overflow-y"] = "hidden";

      // Widget reloaded - replace existing element
      if (this.targetElement.firstChild) {
        this.targetElement.replaceChild(
          this.frame,
          this.targetElement.firstChild
        );
        // Add iframe for the first time
      } else {
        this.targetElement.appendChild(this.frame);
      }
      this.element = this.targetElement;
    } else if (
      !this.element.firstChild ||
      this.element.firstChild.nodeName === "#text"
    ) {
      this.element.appendChild(this.frame);
    }
    const { contentWindow } = this.frame;
    if (!contentWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;
    frameDoc.open();
    frameDoc.write(this.content);
    frameDoc.write(
      `<script src="${this.npmCdn}/resize-observer-polyfill@1.5.x"></script>`
    );
    frameDoc.close();
    domready(frameDoc, async () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
      const ctaElement = frameDoc.getElementById("cta");

      if (ctaElement) {
        if (!ctaElement.parentNode) {
          throw new Error("ctaElement needs a parentNode");
        }
        ctaElement.parentNode.removeChild(ctaElement);
      }

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

      // Regular load - trigger event
      // @ts-ignore
      if (!this.targetElement) {
        this._loadEvent(_sqh);
        _log("loaded");
      }
    });
  }

  // Un-hide if element is available and refresh data
  open() {
    if (!this.firstChild) return _log("no target element to open");
    this.style.visibility = "unset";
    this.style.height = "auto";
    this.style["overflow-y"] = "auto";

    this.firstChild?.contentDocument?.dispatchEvent(
      new CustomEvent("sq:refresh")
    );
    const _sqh =
      this.frame?.contentWindow?.squatch ||
      this.frame?.contentWindow?.widgetIdent;
    this._loadEvent(_sqh);
    _log("loaded");
  }

  close() {
    if (!this.firstChild) return _log("no target element to close");
    this.style.visibility = "hidden";
    this.style.height = "0";
    this.style["overflow-y"] = "hidden";
    _log("Embed widget closed");
  }

  protected _error(rs, mode = "embed", style = "") {
    return super._error(rs, mode, style);
  }
}
