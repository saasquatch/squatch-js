import EmbedWidget from "../EmbedWidget";
import DeclarativeWidget from "./DeclarativeWidget";

export class DeclarativeEmbedWidget extends DeclarativeWidget {
  constructor() {
    super();

    this.type = "EMBED";
    this.container = this.getAttribute("container") || this;
  }

  static get observedAttributes() {
    return ["widget", "container"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    switch (attr) {
      case "widget":
        this.connectedCallback();
        break;
      // Specific to embed widgets
      case "container":
        if (this.element) this.close();
        this.connectedCallback();
        break;
    }
  }

  connectedCallback() {
    this.renderWidget();

    // Remove placeholder slot element
    const slot = (
      this.shadowRoot && Array.from(this.shadowRoot.children)
    )?.find((c) => c.tagName === "SLOT") as Node;
    this.shadowRoot?.removeChild(slot);
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
    return ["widget", "id", "open"];
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    if (oldVal === newVal || !oldVal) return; // nothing to do

    switch (attr) {
      case "open":
      case "widget":
        this.connectedCallback();
        break;
    }
  }

  connectedCallback() {
    this.renderWidget();

    if (this.getAttribute("open") !== null) this.open();
  }
}

window.customElements.define("squatch-embed", DeclarativeEmbedWidget);
window.customElements.define("squatch-popup", DeclarativePopupWidget);
