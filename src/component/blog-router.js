import { RouterElement } from 'https://unpkg.com/ez-hash-router@0.0.3/index.js';
import { HomePage } from './home-page.js';
import { LazyBlogEntryPage } from './lazy-blog-entry-page.js';
import { loadingObservable } from './page-loading-bar.js';
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
        go: async ({ variables }) => {
          if (customElements.get('cw-blog-entry-page') !== undefined) {
            return `<cw-blog-entry-page
              ${variables
                .map(({ name, value }) => {
                  return `${name}="${value}"`;
                })
                .join('\n')}
            />`;
          }

          loadingObservable.pushLoadingState('lazy-blog-entry-page');
          try {
            const { BlogEntryPage } = await import('./blog-entry-page.js');
            if (!customElements.get('cw-blog-entry-page')) {
              customElements.define('cw-blog-entry-page', BlogEntryPage);
            }
            return `<cw-blog-entry-page
              ${variables
                .map(({ name, value }) => {
                  return `${name}="${value}"`;
                })
                .join('\n')}
            />`;
          } catch (e) {
            console.log(e);
          } finally {
            loadingObservable.resolveLoadingState('lazy-blog-entry-page');
          }
        },
      },
      {
        path: '',
        go: () => '<cw-home-page></cw-home-page>',
      },
    ];
    super.connectedCallback();
  }
}
