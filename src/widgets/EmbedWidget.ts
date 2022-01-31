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
  targetElement: HTMLElement;

  constructor(params: Params, selector = "#squatchembed") {
    super(params);

    console.log("params!", params);

    if (params.context.element) {
      this.targetElement = params.context.element;
    }
    const element =
      document.querySelector(selector) ||
      document.querySelector(".squatchembed");

    if (element === undefined)
      throw new Error(`element with selector '${selector}' not found.'`);
    this.element = element as HTMLElement;
    // }
  }

  async load() {
    console.log("my element", { element: this.element, frame: this.frame });

    if (this.targetElement) {
      const placeholder = document.createElement("div");
      placeholder.style.visibility = "hidden";
      // placeholder.style.display = "none";
      placeholder.style.height = "0";
      placeholder.style["overflow-y"] = "hidden";
      document.body.appendChild(placeholder);
      placeholder.appendChild(this.frame);

      console.log({
        placeholder,
        targetElement: this.targetElement,
        frame: this.frame,
      });
      this.element = placeholder;
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

      console.log("element after observe", this.element);

      // Regular load - trigger event
      // @ts-ignore
      if (!this.targetElement) {
        this._loadEvent(_sqh);
        _log("loaded");
      } else {
        this.targetElement.open = this.open;
        this.targetElement.loadedElement = this.element;
        this.targetElement.frame = this.frame;
      }
    });
  }

  // Open when element is available
  open() {
    if (!this.appendChild) return;

    console.log(
      this,
      this.frame,
      this.frame?.contentWindow?.document
      // this.frame.contentWindow?.document?.documentElement?.outerHTML
    );

    // this.appendChild(this.frame);

    console.log(this.frame.loaded, "skipping new frame");
    if (!this.frame.loaded) {
      // Creates the new iframe, add the iframe where you want
      var newFrame = document.createElement("iframe");

      newFrame.width = this.frame.width;
      newFrame.scrolling = this.frame.scrolling;
      newFrame.style.border = "0";
      newFrame.style["background-color"] = "none";
      newFrame.style.width = "1px";
      newFrame.style["min-width"] = "100%";
      newFrame.height = this.frame.height;
      this.appendChild(newFrame);
      var frameDocument = newFrame.document;
      frameDocument = newFrame.contentDocument;
      frameDocument.open();
      frameDocument.write(
        this.frame.contentDocument.doctype ? "<!DOCTYPE html>" : ""
      );
      frameDocument.write(
        this.frame.contentDocument?.documentElement?.outerHTML
      );
      frameDocument.close();
      newFrame.height = this.frame.contentWindow?.document?.body?.scrollHeight;
      this.frame.loaded = true;
      return;
    }

    console.log("element", this.loadedElement);
    // this.appendChild(this.frame);
    console.log(
      "frame / window / document",
      this.frame,
      this.frame?.contentWindow?.document,
      this.frame?.contentDocument
    );

    this.firstChild?.contentDocument?.dispatchEvent(
      new CustomEvent("sq:refresh")
    );
  }
  // open() {
  //   const element = this.element;
  //   const frame = this.frame;
  //   console.log("the goods", this.element, this.frame, this.targetElement);
  //   const { contentWindow } = frame;
  //   if (!contentWindow) throw new Error("Squatch.js has an empty iframe");
  //   const frameDoc = contentWindow.document;

  //   // Adjust frame height when size of body changes
  //   domready(frameDoc, () => {
  //     const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
  //     const ctaElement = frameDoc.getElementById("cta");
  //     if (this.targetElement) this.targetElement.innerHTML = element.innerHTML;

  //     if (ctaElement) {
  //       //@ts-ignore -- will occasionally throw a null pointer exception at runtime
  //       ctaElement.parentNode.removeChild(ctaElement);
  //     }
  //     // element.style.visibility = "visible";
  //     // element.style.top = "0px";
  //     console.log("open content window", contentWindow);
  //     frameDoc.dispatchEvent(new CustomEvent("sq:refresh"));
  //     this._loadEvent(_sqh);
  //     _log("Embed widget opened");
  //   });
  // }

  close() {
    this.element.style.visibility = "hidden";
    this.element.style.top = "-2000px";

    _log("Embed widget closed");
  }

  protected _error(rs, mode = "embed", style = "") {
    return super._error(rs, mode, style);
  }
}
