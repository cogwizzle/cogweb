import { TitlePageLayout } from './title-page-layout.js';
import { BlogList } from './blog-list.js';

const template = document.createElement('template');
template.innerHTML = `
  <cw-blog-list></cw-blog-list>
`;

export class HomePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (customElements.get('cw-title-page-layout') === undefined) {
      customElements.define('cw-title-page-layout', TitlePageLayout);
    }
    if (customElements.get('cw-blog-list') === undefined) {
      customElements.define('cw-blog-list', BlogList);
    }
    this.render();
  }

  render() {
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));
  }
}
