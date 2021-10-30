import { md } from '../utility/markdown.js';
import { loadingObservable } from './page-loading-bar.js';
import { toast } from './toast.js';

const getBlogList = async () => {
  try {
    const response = await fetch(`/api/blog/index.json`);
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    return await Promise.all(
      data.map(async (blog) => {
        const preview = blog.description;
        return {
          ...blog,
          body: preview,
        };
      })
    );
  } catch (error) {
    toast('Something went wrong while loading blog entries.', {
      type: 'danger',
    });
  }
};
export class BlogList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    loadingObservable.pushLoadingState('blog-list');
    this.loading = true;
    getBlogList()
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
      ${this.data.map(
        (entry) =>
          `<a href="#blog/${entry.location}">
            <div class="entry">
              <span>${entry.date} - ${entry.author}</span>
              <h2>${entry.title}</h2>
              <div><p>${entry.body}</p></div>
            </div>
          </a>`
      )}
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
