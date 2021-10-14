import { Header } from './header.js';

export class TitlePageLayout extends HTMLElement {
  constructor() {
    super();
    if (customElements.get('cw-header') === undefined) {
      customElements.define('cw-header', Header);
    }
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .container {
          max-width: 768px;
          padding-left: 15px;
          padding-right: 15px;
          margin: auto;
        }
      </style>
      <cw-header>CogWeb</cw-header>
      <div class="container">
        <slot></slot>
      </div>
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
