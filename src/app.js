import { BlogRouter } from './component/blog-router.js';
import { TitlePageLayout } from './component/title-page-layout.js';

customElements.define('cw-blog-router', BlogRouter);
customElements.define('cw-title-page-layout', TitlePageLayout);

class App extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <cw-title-page-layout>
        <cw-blog-router></cw-blog-router>
      </cw-title-page-layout>
    `;
  }
}

customElements.define('cw-app', App);
