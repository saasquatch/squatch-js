import EmbedWidget from "../EmbedWidget";
import DeclarativeWidget from "./DeclarativeWidget";

export class DeclarativeEmbedWidget extends DeclarativeWidget {
  constructor() {
    super();

    this.type = "EMBED";
    this.container = this.getAttribute("container") || undefined;
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

  renderWidget() {
    this.element = (this.widgetInstance as EmbedWidget)._findElement();
    this.widgetInstance.load(this.frame);
  }
}

export class DeclarativePopupWidget extends DeclarativeWidget {
  constructor() {
    super();

    this.type = "POPUP";

    console.log({ open: this.getAttribute("open") });
    this.addEventListener("click", (e) => {
      e.stopPropagation();
      if ((e.target as HTMLElement).tagName !== "DIALOG") this.open();
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
}

window.customElements.define("squatch-embed", DeclarativeEmbedWidget);
window.customElements.define("squatch-popup", DeclarativePopupWidget);
