import DeclarativeWidget from "./DeclarativeWidget";

/**
 * Base class for `squatch-embed` web-component
 * @extends {DeclarativeWidget}
 * @class
 * @example
 * const widget = document.querySelector('squatch-embed') as DeclarativeEmbedWidget
 */
export class DeclarativeEmbedWidget extends DeclarativeWidget {
  constructor() {
    super();

    /**
     * @static
     */
    this.type = "EMBED";
  }

  static get observedAttributes() {
    return ["widget", "locale"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    switch (attr) {
      case "locale":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  async connectedCallback() {
    this.container = this.getAttribute("container") || this;

    await this.renderWidget();

    const slot = (
      this.shadowRoot && Array.from(this.shadowRoot.children)
    )?.find((c) => c.tagName === "SLOT") as Node;
    if (slot) this.shadowRoot?.removeChild(slot);
  }
}

/**
 * Base class for `squatch-popup` web-component
 * @extends {DeclarativeWidget}
 * @class
 * @example
 * const widget = document.querySelector('squatch-popup') as DeclarativePopupWidget
 */
export class DeclarativePopupWidget extends DeclarativeWidget {
  constructor() {
    super();

    /**
     * @static
     */
    this.type = "POPUP";

    this.addEventListener("click", (e) => {
      e.stopPropagation();

      // SQUATCH-POPUP target means something in the shadowDOM was clicked (i.e. the dialog element)
      if ((e.target as HTMLElement).tagName !== "SQUATCH-POPUP") this.open();
    });
  }

  static get observedAttributes() {
    return ["widget", "locale"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    switch (attr) {
      case "locale":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  async connectedCallback() {
    await this.renderWidget();
    if (this.getAttribute("open") !== null) this.open();
  }
}

window.customElements.define("squatch-embed", DeclarativeEmbedWidget);
window.customElements.define("squatch-popup", DeclarativePopupWidget);
