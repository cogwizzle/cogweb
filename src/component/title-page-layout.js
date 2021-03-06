import { Header } from './header.js';
import { PageLoadingBar } from './page-loading-bar.js';

export class TitlePageLayout extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (customElements.get('cw-header') === undefined) {
      customElements.define('cw-header', Header);
    }
    if (customElements.get('cw-page-loading-bar') === undefined) {
      customElements.define('cw-page-loading-bar', PageLoadingBar);
    }
    this.attachShadow({ mode: 'open' });
    const globalStyles = document.createElement('template');
    globalStyles.innerHTML = `
      <style>
        body {
          margin: 0;
        }
      </style>
    `;
    this.appendChild(globalStyles.content.cloneNode(true));
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

        .shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      </style>
      <cw-header>CogWizzle</cw-header>
      <cw-page-loading-bar></cw-page-loading-bar>
      <div class="container shadow">
        <slot></slot>
      </div>
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
