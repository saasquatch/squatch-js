// @ts-check

import { debug } from "debug";
import { domready } from "../utils/domready";
import Widget, { Params } from "./Widget";

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

    if (this.container) {
      this.id = "squatchModal";
    } else {
      this.id = popupId === 0 ? `squatchModal` : `squatchModal__${popupId}`;
      popupId = popupId + 1;
    }

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style>#${this.id}::-webkit-scrollbar { display: none; }</style>`
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

    const element = this._findElement();
    // If widget is loaded with CTA, look for a 'squatchpop' element to use
    // that element as a trigger as well.
    const triggerWhenCTA = element.querySelector(".squatchpop") as HTMLElement;

    if (this.trigger === "#cta" && triggerWhenCTA) {
      triggerWhenCTA.onclick = () => {
        this.open(frame);
      };
    }
  }

  _createPopupDialog(): HTMLDialogElement {
    const dialog = document.createElement("dialog");
    dialog.id = this.id;
    dialog.setAttribute(
      "style",
      "width: 100%; max-width: 500px; border: none; padding: 0;"
    );
    const onClick = (e) => {
      if (e.target === dialog) dialog.close();
    };

    dialog.addEventListener("click", onClick);

    return dialog;
  }

  load(frame: HTMLIFrameElement) {
    this._initialiseCTA(frame);
    const element = this._findElement();

    const dialogParent = element.shadowRoot || element;
    const dialog = this._createPopupDialog();
    dialog.appendChild(frame);

    if (dialogParent.lastChild?.nodeName === "DIALOG") {
      // Was reloaded
      dialogParent.replaceChild(dialog, dialogParent.lastChild);
    } else {
      // First time rendering
      dialogParent.appendChild(dialog);
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
    _log("Popup template loaded into iframe");
    this._setupResizeHandler(frame);
  }

  protected _setupResizeHandler(frame: HTMLIFrameElement) {
    const { contentWindow } = frame;

    if (!contentWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, async () => {
      frameDoc.body.style.overflowY = "hidden";
      frame.height = `${frameDoc.body.offsetHeight}px`;
      // Adjust frame height when size of body changes
      const ro = new contentWindow["ResizeObserver"]((entries) => {
        for (const entry of entries) {
          const { top, bottom } = entry.contentRect;

          const computedHeight = bottom + top;
          frame.height = computedHeight + "";

          // Don't let anything else set the height of this element
          entry.target.style = ``;
        }
      });
      ro.observe(await this._findInnerContainer(frame));
    });
  }

  open(frame: HTMLIFrameElement) {
    const element = this._findElement();
    const parent = element.shadowRoot || element;
    const dialog = parent.querySelector(`#${this.id}`) as HTMLDialogElement;
    if (!dialog) throw new Error("Could not determine container div");

    dialog.showModal();

    const { contentWindow } = frame;
    if (!contentWindow) throw new Error("Squatch.js has an empty iframe");
    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
      frame.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));
      this._loadEvent(_sqh);
      _log("Popup opened");
    });
  }

  close() {
    const dialog = document.getElementById(this.id) as HTMLDialogElement;
    if (!dialog) throw new Error("Could not determine container div");

    dialog.close();

    _log("Popup closed");
  }

  protected _clickedOutside({ target }) {}

  protected _error(rs, mode = "modal", style = "") {
    const _style =
      "body { margin: 0; } .modal { box-shadow: none; border: 0; }";

    return super._error(rs, mode, style || _style);
  }

  show = this.open;
  hide = this.close;
}
