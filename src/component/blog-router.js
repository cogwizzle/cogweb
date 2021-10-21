import { RouterElement } from 'https://unpkg.com/ez-hash-router@0.0.2/index.js';
import { HomePage } from './home-page.js';
import { LazyBlogEntryPage } from './lazy-blog-entry-page.js';

export class BlogRouter extends RouterElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (customElements.get('cw-home-page') === undefined) {
      customElements.define('cw-home-page', HomePage);
    }
    if (customElements.get('cw-lazy-blog-entry-page') === undefined) {
      customElements.define('cw-lazy-blog-entry-page', LazyBlogEntryPage);
    }
    this.routes = [
      {
        path: 'blog/{entry}',
        component: 'cw-lazy-blog-entry-page',
      },
      {
        path: '',
        component: 'cw-home-page',
      },
    ];
    super.connectedCallback();
  }
}
