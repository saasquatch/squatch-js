// @ts-check

import debug from "debug";
import Widget, { Params } from "./Widget";
import { domready } from "../utils/domready";

const _log = debug("squatch-js:POPUPwidget");

let popupId = 0;
/**
 * The PopupWidget is used to display popups (also known as "Modals").
 * Popups widgets are rendered on top of other elements in a page.
 *
 * To create a PopupWidget use {@link Widgets}
 *
 */
export default class PopupWidget extends Widget {
  trigger: string;
  id: string;

  constructor(params: Params, trigger = ".squatchpop") {
    super(params);

    this.trigger = trigger;
    this.id = popupId === 0 ? `squatchModal` : `squatchModal__${popupId}`;
    popupId = popupId + 1;

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>#squatchModal::-webkit-scrollbar { display: none; }</style>`
    );
  }

  _initialiseCTA(frame: HTMLIFrameElement) {
    let triggerElement;
    try {
      triggerElement /* HTMLButton */ = document.querySelector(this.trigger);
      if (this.trigger && !triggerElement)
        _log("No element found with trigger selector", this.trigger);
    } catch {
      _log("Not a valid selector", this.trigger);
    }

    // Trigger is optional
    if (triggerElement) {
      triggerElement.onclick = () => {
        this.open(frame);
      };
    }

    // If widget is loaded with CTA, look for a 'squatchpop' element to use
    // that element as a trigger as well.
    const triggerWhenCTA = document.querySelector(".squatchpop") as HTMLElement;

    if (this.trigger === "#cta" && triggerWhenCTA) {
      triggerWhenCTA.onclick = () => {
        this.open(frame);
      };
    }
  }

  _createPopupDiv(): HTMLDivElement {
    const popupdiv = document.createElement("div");

    popupdiv.id = this.id;
    popupdiv.setAttribute(
      "style",
      "display: none; position: fixed; z-index: 1; padding-top: 5%; left: 0; top: -2000px; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);"
    );
    popupdiv.onclick = (event) => {
      if (event.target === popupdiv) {
        this.close();
      }
    };

    return popupdiv;
  }

  _createPopupContent(): HTMLDivElement {
    const popupcontent = document.createElement("div");
    popupcontent.id = "squatchModal__content";
    popupcontent.setAttribute(
      "style",
      "margin: auto; width: 80%; max-width: 500px; position: relative;"
    );

    return popupcontent;
  }

  load(frame: HTMLIFrameElement) {
    this._initialiseCTA(frame);
    const popupcontent = this._createPopupContent();
    const popupdiv = this._createPopupDiv();

    popupdiv.appendChild(popupcontent);
    document.body.appendChild(popupdiv);
    popupcontent.appendChild(frame);

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
    _log("Popup template loaded into iframe");
    this._setupResizeHandler(frame, popupdiv);
  }

  protected _setupResizeHandler(
    frame: HTMLIFrameElement,
    popupdiv: HTMLDivElement
  ) {
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
      ro.observe(await this._findInnerContainer(frame));
    });
  }

  open(frame: HTMLIFrameElement) {
    const popupdiv = document.getElementById(this.id) as HTMLDivElement;
    if (!popupdiv) throw new Error("Could not determine container div");

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
    const popupdiv = document.getElementById(this.id) as HTMLDivElement;
    if (!popupdiv) throw new Error("Could not determine container div");

    popupdiv.style.visibility = "hidden";
    popupdiv.style.top = "-2000px";

    _log("Popup closed");
  }

  protected _clickedOutside({ target }) {}

  protected _error(rs, mode = "modal", style = "") {
    const _style =
      "body { margin: 0; } .modal { box-shadow: none; border: 0; }";

    return super._error(rs, mode, style || _style);
  }
}
