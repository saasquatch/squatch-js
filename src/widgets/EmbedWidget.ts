// @ts-check

import { debug } from "debug";
import Widget, { Params } from "./Widget";
import { domready } from "../utils/domready";

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
  }

  async load() {
    const frame = this._createFrame();
    const element = this._findElement();

    if (this.container) {
      if (element.shadowRoot) {
        if (element.shadowRoot.lastChild?.nodeName === "IFRAME")
          element.shadowRoot.replaceChild(frame, element.shadowRoot.lastChild);
        else {
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
      const ro = new contentWindow["ResizeObserver"]((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          // @ts-ignore -- number will be cast to string by browsers
          frame.height = height;
        }
      });

      ro.observe(await this._findInnerContainer(frame));

      // Regular load - trigger event
      if (!this.container) {
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

    const element = this._findElement();

    element.style.visibility = "unset";
    element.style.height = "auto";
    element.style["overflow-y"] = "auto";

    frame?.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
    const _sqh =
      frame?.contentWindow?.squatch || frame?.contentWindow?.widgetIdent;
    this._loadEvent(_sqh);
    _log("loaded");
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

  show = this.open;
  hide = this.close;
}
