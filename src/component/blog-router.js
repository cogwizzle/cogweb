import { RouterElement } from 'https://unpkg.com/ez-hash-router@0.0.2/index.js';
import { HomePage } from './home-page.js';
import { BlogEntryPage } from './blog-entry-page.js';

export class BlogRouter extends RouterElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (customElements.get('cw-home-page') === undefined) {
      customElements.define('cw-home-page', HomePage);
    }
    if (customElements.get('cw-blog-entry-page') === undefined) {
      customElements.define('cw-blog-entry-page', BlogEntryPage);
    }
    this.routes = [
      {
        path: 'blog/{entry}',
        component: 'cw-blog-entry-page',
      },
      {
        path: '',
        component: 'cw-home-page',
      },
    ];
    super.connectedCallback();
  }
}
