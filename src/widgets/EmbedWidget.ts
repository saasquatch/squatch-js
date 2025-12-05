// @ts-check

import { debug } from "debug";
import { UpsertWidgetContext } from "../types";
import { domready } from "../utils/domready";
import { formatWidth } from "../utils/widgetUtils";
import Widget, { Params } from "./Widget";
import { getSkeleton } from "./SkeletonTemplate";

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

    if (container) {
      this.container = container;
    }
  }

  async load() {
    const brandingConfig = this.context.widgetConfig?.values?.brandingConfig;
    // @ts-ignore
    const initialHeight = brandingConfig?.loadingHeight;
    const skeletonBackgroundColor =
      brandingConfig?.color?.loadingSkeleton?.background;
    const skeletonShimmerColor =
      brandingConfig?.color?.loadingSkeleton?.animationBackground;
    const borderColor = brandingConfig?.border?.borderColor;
    const sizes = brandingConfig?.widgetSize?.embeddedWidgets;
    const maxWidth = sizes?.maxWidth ? formatWidth(sizes.maxWidth) : "";
    const minWidth = sizes?.minWidth ? formatWidth(sizes.minWidth) : "";

    console.log({
      brandingConfig,
      initialHeight,
      widgetConfig: this.context.widgetConfig,
    });

    const skeletonHTML = getSkeleton({
      height: initialHeight,
      skeletonBackgroundColor,
      skeletonShimmerColor,
      borderColor,
    });

    const skeletonContainer = document.createElement("div");
    skeletonContainer.innerHTML = skeletonHTML;

    const frame = this._createFrame({
      minWidth,
      maxWidth,
      initialHeight,
    });
    const element = this._findElement();

    element.innerHTML = skeletonHTML;

    // Hide frame initially
    frame.style.display = "none";

    const injectContents = (target: HTMLElement | ShadowRoot) => {
      // Optional: Clear target to prevent duplicates if load() is called twice
      // target.innerHTML = "";
      target.appendChild(skeletonContainer);
      target.appendChild(frame);
    };

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
          injectContents(element.shadowRoot);
        }
      } else if (element.firstChild) {
        // If replacing, wipe and reload
        element.innerHTML = "";
        injectContents(element);
      } else {
        injectContents(element);
      }
    } else if (!element.firstChild || element.firstChild.nodeName === "#text") {
      injectContents(element);
    }

    const { contentWindow } = frame;
    if (!contentWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;
    frameDoc.open();

    console.log({ content: this.content, context: this.context, this: this });

    const domain = this.widgetApi.domain;

    frameDoc.write(`
      ${
        brandingConfig?.main?.brandFont &&
        `
        <link rel="preconnect" href="https://fast${
          domain === "https://staging.referralsaasquatch.com" && "-staging"
        }.ssqt.io">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          brandingConfig?.main?.brandFont
        )}" as="style">`
      }
      <script src="${this.npmCdn}/resize-observer-polyfill@1.5.x"></script>
      <style data-styles>
        html { visibility:hidden;}
      </style>
      ${this.content}

      `);

    frameDoc.close();
    domready(frameDoc, async () => {
      if (skeletonContainer && skeletonContainer.parentNode) {
        skeletonContainer.parentNode.removeChild(skeletonContainer);
      }

      frame.style.display = "block";

      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;

      // @ts-ignore -- number will be cast to string by browsers
      frame.height = initialHeight || frameDoc.body.scrollHeight;
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
