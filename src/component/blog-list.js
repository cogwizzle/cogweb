import { blogService } from '../services/blog-service.js';
import { loadingObservable } from './page-loading-bar.js';

export class BlogList extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' });
    loadingObservable.pushLoadingState('blog-list');
    this.loading = true;
    blogService
      .getIndexBlogs()
      .then((data) => {
        this.data = data;
        this.loading = false;
        loadingObservable.resolveLoadingState('blog-list');
        this.render();
      })
      .then((render) => this.render())
      .catch((error) => this.showErrorState());

    this.render();
  }

  showErrorState() {
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = 'Error loading blog entries.';
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  showLoader() {
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = 'Loading...';
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  render() {
    if (this.loading) {
      return;
    }
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        a {
          color: inherit;
          text-decoration: none;
          outline: none;
        }

        a:visited {
          color: inherit;
        }

        .entry {
          margin-top: 16px;
          padding: 16px;
        }
      </style>
      ${this.data
        .map(
          (entry) =>
            `<a href="#blog/${entry.location}">
            <div class="entry">
              <h2>${entry.title}</h2>
              <span>${entry.date} - ${entry.author}</span>
              <div><p>${entry.description}</p></div>
            </div>
          </a>`
        )
        .join('')}
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
