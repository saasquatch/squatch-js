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
}

class SquatchEmbed extends DeclarativeEmbedWidget {}
class SquatchPopup extends DeclarativePopupWidget {}
class ImpactEmbed extends DeclarativeEmbedWidget {}
class ImpactPopup extends DeclarativePopupWidget {}

if (!window.customElements.get("squatch-embed"))
  window.customElements.define("squatch-embed", SquatchEmbed);
if (!window.customElements.get("impact-embed"))
  window.customElements.define("impact-embed", ImpactEmbed);
if (!window.customElements.get("squatch-popup"))
  window.customElements.define("squatch-popup", SquatchPopup);
if (!window.customElements.get("impact-popup"))
  window.customElements.define("impact-popup", ImpactPopup);
