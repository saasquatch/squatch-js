import DeclarativeWidget from "./DeclarativeWidget";

export class DeclarativeEmbedWidget extends DeclarativeWidget {
  constructor() {
    super();

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

export class DeclarativePopupWidget extends DeclarativeWidget {
  constructor() {
    super();

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
