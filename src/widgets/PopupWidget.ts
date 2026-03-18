// @ts-check

import { debug } from "../utils/logger";
import { UpsertWidgetContext } from "../types";
import { domready } from "../utils/domready";
import { formatWidth } from "../utils/widgetUtils";
import Widget, { Params } from "./Widget";

const _log = debug("squatch-js:POPUPwidget");

let popupId = 0;
/**
 * The PopupWidget is used to display popups (also known as "Modals").
 * Popups widgets are rendered on top of other elements in a page.
 *
 * To create a PopupWidget use {@link Widgets}
 *
 * @example
 * const widget = new PopupWidget({ ... })
 * widget.load() // Loads the widget into a dialog element
 * widget.open() // Opens the dialog element
 * widget.close() // Hides the dialog element
 */
export default class PopupWidget extends Widget {
  trigger: string | null;
  id: string;

  constructor(params: Params, trigger: string | null = ".squatchpop") {
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
      `<style>#${this.id}::-webkit-scrollbar { display: none; }</style>`,
    );
  }

  _initialiseCTA() {
    if (!this.trigger) return;

    let triggerElement;
    try {
      triggerElement /* HTMLButton */ =
        document.querySelector(this.trigger) ||
        document.querySelector(".impactpop");

      if (this.trigger && !triggerElement)
        _log("No element found with trigger selector", this.trigger);
    } catch {
      _log("Not a valid selector", this.trigger);
    }

    // Trigger is optional
    if (triggerElement) {
      triggerElement.onclick = () => {
        this.open();
      };
    }
  }

  _createPopupDialog(brandingConfig?: any): HTMLDialogElement {
    const dialog = document.createElement("dialog");
    const sizes = brandingConfig?.widgetSize?.popupWidgets;

    // Still styling the dialog to keep consistent with previous versions
    const minWidth = sizes?.minWidth ? formatWidth(sizes.minWidth) : "auto";
    const maxWidth = sizes?.maxWidth ? formatWidth(sizes.maxWidth) : "500px";
    dialog.id = this.id;
    dialog.setAttribute(
      "style",
      `width: 100%; min-width: ${minWidth}; max-width: ${maxWidth}; border: none; padding: 0;`,
    );
    const onClick = (e) => {
      e.stopPropagation();
      if (e.target === dialog) dialog.close();
    };

    dialog.addEventListener("click", onClick);

    return dialog;
  }

  async load() {
    const brandingConfig = this.context.widgetConfig?.values?.brandingConfig;
    const initialHeight = brandingConfig?.loadingHeight || 500;
    const hasMintComponents = this.content?.includes("mint-components");

    const frame = this._createFrame({ initialHeight });
    this._initialiseCTA();

    const element = this.container ? this._findElement() : document.body;

    const dialogParent = element?.shadowRoot || element;
    const dialog = this._createPopupDialog(brandingConfig);
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

    const domain = this.widgetApi.domain;

    frameDoc.write(`
      ${
        brandingConfig?.main?.brandFont
          ? `
        <link rel="preconnect" href="https://fast${
          domain === "https://staging.referralsaasquatch.com" ? "-staging" : ""
        }.ssqt.io">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          brandingConfig?.main?.brandFont,
        )}" as="style">`
          : ""
      }
      <link rel="dns-prefetch" href="https://res.cloudinary.com">
      <link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
      ${
        hasMintComponents
          ? `
      <style data-styles>
        html { visibility: hidden; }
      </style>`
          : ""
      }
      ${this.content}

      `);

    frameDoc.close();
    _log("Popup template loaded into iframe");
    await this._setupResizeHandler(frame, initialHeight);
  }

  protected async _setupResizeHandler(
    frame: HTMLIFrameElement,
    initialHeight?: number,
  ) {
    const { contentWindow } = frame;

    if (!contentWindow) {
      throw new Error("Frame needs a content window");
    }

    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, async () => {
      frameDoc.body.style.overflowY = "hidden";
      // @ts-ignore -- number will be cast to string by browsers
      frame.height = initialHeight || frameDoc.body.offsetHeight;
      // Adjust frame height when size of body changes
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { top, bottom } = entry.contentRect;

          const computedHeight = bottom + top;
          frame.height = computedHeight + "";

          // @ts-ignore Don't let anything else set the height of this element
          entry.target.style = "";
        }
      });
      ro.observe(await this._findInnerContainer(frame));
    });
  }

  open() {
    const element = this.container ? this._findElement() : document.body;
    const parent = element.shadowRoot || element;
    const dialog = parent.querySelector(`#${this.id}`) as HTMLDialogElement;
    if (!dialog) throw new Error("Could not determine container div");

    dialog.showModal();

    const frame = this._findFrame();
    if (!frame) throw new Error("Could not find iframe");
    const { contentWindow } = frame;
    if (!contentWindow) throw new Error("Squatch.js has an empty iframe");
    const frameDoc = contentWindow.document;

    // Adjust frame height when size of body changes
    domready(frameDoc, () => {
      const _sqh = contentWindow.squatch || contentWindow.widgetIdent;
      frame.contentDocument?.dispatchEvent(new CustomEvent("sq:refresh"));

      if ((this.context as UpsertWidgetContext).user) {
        this._loadEvent(_sqh);
        _log("Popup opened");
      } else {
        this._attachLoadEventListener(frameDoc, _sqh);
      }
    });
  }

  close() {
    const frame = this._findFrame();
    if (frame?.contentDocument)
      this._detachLoadEventListener(frame.contentDocument);

    const element = this.container ? this._findElement() : document.body;
    const parent = element.shadowRoot || element;
    const dialog = parent.querySelector(`#${this.id}`) as HTMLDialogElement;
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
