import DeclarativeWidget from "./DeclarativeWidget";

/**
 * Base class for `squatch-embed` web-component
 * @extends {DeclarativeWidget}
 * @class
 * @example
 * window.createCustomElement('squatch-embed', DeclarativeEmbedWidget)
 * const widget = document.querySelector('squatch-embed') as DeclarativeEmbedWidget
 * widget.open()
 * widget.close()
 * widget.reload()
 */
export class DeclarativeEmbedWidget extends DeclarativeWidget {
  constructor() {
    super();

    /**
     * @static
     */
    this.type = "EMBED";

    this.loaded = false;
  }

  static get observedAttributes() {
    return ["widget", "locale"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !this.loaded) return; // nothing to do

    switch (attr) {
      case "locale":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  async connectedCallback() {
    this.loaded = true;
    this.container = this.getAttribute("container");

    await this.renderWidget();

    const slot = (
      this.shadowRoot && Array.from(this.shadowRoot.children)
    )?.find((c) => c.tagName === "SLOT") as Node;
    if (slot) this.shadowRoot?.removeChild(slot);

    if (this.getAttribute("open") !== null) this.open();
  }
}

/**
 * Base class for `squatch-popup` web-component
 * @extends {DeclarativeWidget}
 * @class
 * @example
 * window.createCustomElement('squatch-popup', DeclarativePopupWidget)
 * const widget = document.querySelector('squatch-popup') as DeclarativePopupWidget
 * widget.open()
 * widget.close()
 * widget.reload()
 */
export class DeclarativePopupWidget extends DeclarativeWidget {
  constructor() {
    super();

    /**
     * @static
     */
    this.type = "POPUP";

    this.loaded = false;

    this.addEventListener("click", (e) => {
      e.stopPropagation();

      this.open();
    });
  }

  static get observedAttributes() {
    return ["widget", "locale"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !this.loaded) return; // nothing to do

    switch (attr) {
      case "locale":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  async connectedCallback() {
    this.loaded = true;
    this.container = this.getAttribute("container");

    await this.renderWidget();

    if (this.getAttribute("open") !== null) this.open();
  }
}

class SquatchEmbed extends DeclarativeEmbedWidget {}
class SquatchPopup extends DeclarativePopupWidget {}
class ImpactEmbed extends DeclarativeEmbedWidget {}
class ImpactPopup extends DeclarativePopupWidget {}

if (!window.customElements.get("squatch-embed")) window.customElements.define("squatch-embed", SquatchEmbed);
if (!window.customElements.get("impact-embed")) window.customElements.define("impact-embed", ImpactEmbed);
if (!window.customElements.get("squatch-popup")) window.customElements.define("squatch-popup", SquatchPopup);
if (!window.customElements.get("impact-popup")) window.customElements.define("impact-popup", ImpactPopup);
