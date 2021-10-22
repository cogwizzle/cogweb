import { RouterElement } from 'https://unpkg.com/ez-hash-router@0.0.4/index.js';
import { loadingObservable } from './page-loading-bar.js';

export class BlogRouter extends RouterElement {
  constructor() {
    super();
  }

  connectedCallback() {
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
        go: async () => {
          if (customElements.get('cw-blog-entry-page') !== undefined) {
            return '<cw-home-page></cw-home-page>';
          }
          loadingObservable.pushLoadingState('lazy-home-page');
          try {
            const { HomePage } = await import('./home-page.js');
            if (!customElements.get('cw-home-page')) {
              customElements.define('cw-home-page', HomePage);
            }
            return '<cw-home-page></cw-home-page>';
          } catch (e) {
            console.log(e);
          } finally {
            loadingObservable.resolveLoadingState('lazy-home-page');
          }
        },
      },
    ];
    super.connectedCallback();
  }

  notFound() {
    this.innerHTML = `
      <style>
        .not-found {
          padding: 16px;
        }
      </style>
      <div class="not-found">
        <h1>Unable to find page</h1>
        <div>
          I'm sorry the page you're looking for was unable to be found.
        </div>
      </div>
    `;
  }
}
