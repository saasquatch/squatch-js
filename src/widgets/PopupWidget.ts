// @ts-check

import debug from "debug";
import Widget, { Params } from "./Widget";
import { domready } from "../utils/domready";

const _log = debug("squatch-js:POPUPwidget");

/**
 * The PopupWidget is used to display popups (also known as "Modals").
 * Popups widgets are rendered on top of other elements in a page.
 *
 * To create a PopupWidget use {@link Widgets}
 *
 */
export default class PopupWidget extends Widget {
  triggerElement: HTMLElement | null;
  triggerWhenCTA: HTMLElement | null;
  popupdiv: HTMLElement;
  popupcontent: HTMLElement;

  constructor(params: Params, trigger = ".squatchpop") {
    super(params);

    try {
      this.triggerElement /* HTMLButton */ = document.querySelector(trigger);
    } catch {
      _log("No element found with trigger selector", trigger);
    }

    // Trigger is optional
    if (this.triggerElement) {
      //@ts-ignore -- we assume this is an element that can have click events
      this.triggerElement.onclick = () => {
        this.open();
      };
    }

    // If widget is loaded with CTA, look for a 'squatchpop' element to use
    // that element as a trigger as well.
    this.triggerWhenCTA = document.querySelector(".squatchpop");

    if (trigger === "#cta" && this.triggerWhenCTA) {
      //@ts-ignore -- we assume this is an element that can have click events
      this.triggerWhenCTA.onclick = () => {
        this.open();
      };
    }

    this.popupdiv = document.createElement("div");
    this.popupdiv.id = "squatchModal";
    this.popupdiv.setAttribute(
      "style",
      "display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);"
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

  load() {
    this.popupdiv.appendChild(this.popupcontent);
    document.body.appendChild(this.popupdiv);
    this.popupcontent.appendChild(this.frame);

    //@ts-ignore -- will occasionally throw a null pointer exception at runtime
    const frameDoc = this.frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(this.content);
    frameDoc.write(
      `<script src="${this.npmCdn}/resize-observer-polyfill@1.5.x"></script>`
    );
    frameDoc.close();
    _log("Popup template loaded into iframe");
    this._setupResizeHandler();
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
      this._loadEvent(_sqh);
      _log("Popup opened");
    });
  }

  close() {
    this.popupdiv.style.visibility = "hidden";
    this.popupdiv.style.top = "-2000px";

    _log("Popup closed");
  }

  protected _clickedOutside({ target }) {
    if (target === this.popupdiv) {
      this.close();
    }
  }

  protected _error(rs, mode = "modal", style = "") {
    const _style =
      "body { margin: 0; } .modal { box-shadow: none; border: 0; }";

    return super._error(rs, mode, style || _style);
  }
}
