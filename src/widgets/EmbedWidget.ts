// @ts-check

import { debug } from "debug";
import { UpsertWidgetContext } from "../types";
import { domready } from "../utils/domready";
import { formatWidth } from "../utils/widgetUtils";
import Widget, { Params } from "./Widget";

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
    const brandingConfig = this.context.widgetConfig?.values?.brandingConfig;
    const sizes = brandingConfig?.widgetSize?.embeddedWidgets;
    const maxWidth = sizes?.maxWidth ? formatWidth(sizes.maxWidth) : "";
    const minWidth = sizes?.minWidth ? formatWidth(sizes.minWidth) : "";

    const frame = this._createFrame({ minWidth, maxWidth });
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

    //       <div><span class="loader"></span>
    //   <style>
    //   .loader {
    // width: 48px;
    // height: 48px;
    // border: 5px solid #FFF;
    // border-bottom-color: #FF3D00;
    // border-radius: 50%;
    // display: inline-block;
    // box-sizing: border-box;
    // animation: rotation 1s linear infinite;
    // }
    const frameDoc = contentWindow.document;
    frameDoc.open();

    frameDoc.write(`
      <script src="${this.npmCdn}/resize-observer-polyfill@1.5.x"></script>
      <style>
      html, p, h3 { visibility:hidden; }
      </style>
      ${this.content}
      `);

    frameDoc.close();
    domready(frameDoc, async () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;

      // @ts-ignore -- number will be cast to string by browsers
      frame.height =
        frameDoc.body.scrollHeight >= 150 ? 600 : frameDoc.body.scrollHeight;
      console.log({ height: frameDoc.body.scrollHeight });

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
      } else if (frameDoc) {
        this._attachLoadEventListener(frameDoc, _sqh);
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
    } else {
      if (!frame.contentDocument) return;
      this._attachLoadEventListener(frame.contentDocument, _sqh);
    }
  }

  close() {
    const frame = this._findFrame();
    if (!frame) return _log("no target element to close");

    if (frame.contentDocument)
      this._detachLoadEventListener(frame.contentDocument);

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
