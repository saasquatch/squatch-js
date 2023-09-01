// @ts-check

import { debug } from "debug";
import Widget, { Params } from "./Widget";
import { domready } from "../utils/domready";
import { UpsertWidgetContext } from "../types";

const _log = debug("squatch-js:EMBEDwidget");

/**
 * An EmbedWidget is displayed inline in part of your page.
 *
 * To create an EmbedWidget use {@link Widgets}
 *
 * @example
 * const widget = new EmbedWidget({ ... })
 * widget.load() // Loads widget into the DOM
 * widget.open() // Makes the iframe container visible
 * widget.close() // Hides the iframe container
 */
export default class EmbedWidget extends Widget {
  constructor(params: Params, container?: HTMLElement | string) {
    super(params);

    if (container) this.container = container;
  }

  async load() {
    const frame = this._createFrame();
    const element = this._findElement();

    if (this.context?.container) {
      // Custom container is used
      element.style.visibility = "hidden";
      element.style.height = "0";
      element.style["overflow-y"] = "hidden";
    }

    if (this.container) {
      if (element.shadowRoot) {
        if (element.shadowRoot.lastChild?.nodeName === "IFRAME") {
          element.shadowRoot.replaceChild(frame, element.shadowRoot.lastChild);
        } else {
          element.shadowRoot.appendChild(frame);
        }
      }
      // Widget reloaded - replace existing element
      else if (element.firstChild) {
        element.replaceChild(frame, element.firstChild);
        // Add iframe for the first time
      } else {
        element.appendChild(frame);
      }
    } else if (!element.firstChild || element.firstChild.nodeName === "#text") {
      element.appendChild(frame);
    }

    const { contentWindow } = frame;
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

      // @ts-ignore -- number will be cast to string by browsers
      frame.height = frameDoc.body.scrollHeight;

      // Adjust frame height when size of body changes
      /* istanbul ignore next: hard to test */
      const ro = new contentWindow["ResizeObserver"]((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          // @ts-ignore -- number will be cast to string by browsers
          frame.height = height;
        }
      });

      const container = await this._findInnerContainer(frame);
      ro.observe(container);

      if (this._shouldFireLoadEvent()) {
        this._loadEvent(_sqh);
        _log("loaded");
      }
    });
  }

  /**
   * Un-hide if element is available and refresh data
   */
  open() {
    const frame = this._findFrame();
    if (!frame) return _log("no target element to open");
    if (!frame.contentWindow) return _log("Frame needs a content window");

    const element = this._findElement();

    element.style.visibility = "unset";
    element.style.height = "auto";
    element.style["overflow-y"] = "auto";

    frame.contentWindow.document.dispatchEvent(new CustomEvent("sq:refresh"));
    const _sqh = frame.contentWindow.squatch || frame.contentWindow.widgetIdent;

    if ((this.context as UpsertWidgetContext).user) {
      this._loadEvent(_sqh);
      _log("loaded");
    }
  }

  close() {
    const frame = this._findFrame();
    if (!frame) return _log("no target element to close");

    const element = this._findElement();

    element.style.visibility = "hidden";
    element.style.height = "0";
    element.style["overflow-y"] = "hidden";
    _log("Embed widget closed");
  }

  protected _error(rs, mode = "embed", style = "") {
    return super._error(rs, mode, style);
  }

  private _shouldFireLoadEvent() {
    const noContainer = !this.container;
    const isComponent =
      this.container instanceof HTMLElement &&
      (this.container.tagName.startsWith("SQUATCH-") ||
        this.container.tagName.startsWith("IMPACT-"));
    const isVerified = !!(this.context as UpsertWidgetContext).user;

    return isVerified && (noContainer || isComponent);
  }

  show = this.open;
  hide = this.close;
}
