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
  hasContainer: boolean;

  constructor(params: Params, selector = "#squatchembed") {
    super(params);

    if (params.context.container) {
      this.hasContainer = true;
    }

    const element =
      document.querySelector(selector) ||
      document.querySelector(".squatchembed") ||
      params.context.container;

    if (!element)
      throw new Error(`element with selector '${selector}' not found.'`);
    this.element = element as HTMLElement;
  }

  async load() {
    if (this.hasContainer) {
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
      if (!this.hasContainer) {
        this._loadEvent(_sqh);
        _log("loaded");
      }
    });
  }

  // Un-hide if element is available and refresh data
  open() {
    if (!this.frame || !this.hasContainer)
      return _log("no target element to open");
    this.element.style.visibility = "unset";
    this.element.style.height = "auto";
    this.element.style["overflow-y"] = "auto";

    this.frame?.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
    const _sqh =
      this.frame?.contentWindow?.squatch ||
      this.frame?.contentWindow?.widgetIdent;
    this._loadEvent(_sqh);
    _log("loaded");
  }

  close() {
    if (!this.frame || !this.hasContainer)
      return _log("no target element to close");
    this.element.style.visibility = "hidden";
    this.element.style.height = "0";
    this.element.style["overflow-y"] = "hidden";
    _log("Embed widget closed");
  }

  protected _error(rs, mode = "embed", style = "") {
    return super._error(rs, mode, style);
  }
}
