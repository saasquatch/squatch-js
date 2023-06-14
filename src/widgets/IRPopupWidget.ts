export default class IRPopupWidget extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}
  open() {}
  close() {}
}

window.customElements.define("ir-popup", IRPopupWidget);
