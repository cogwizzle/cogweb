import { md } from '../utility/markdown.js';

const getBlogList = async () => {
  try {
    const response = await fetch(`/api/blog/index.json`);
    const data = await response.json();
    return await Promise.all(
      data.map(async (blog) => {
        try {
          const response = await fetch(`/api/blog/${blog.location}.md`);
          const body = await response.text();
          const preview = md(`${body.substring(0, 200)}...`);
          return {
            ...blog,
            body: preview,
          };
        } catch (error) {
          throw new Error(error);
        }
      })
    );
  } catch (error) {
    throw new Error(error);
  }
};
export class BlogList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.loading = true;
    getBlogList()
      .then((data) => {
        this.data = data;
        this.loading = false;
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
      this.showLoader();
      return;
    }
    if (!this.data) {
      this.showLoader();
      return;
    }
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        a {
          color: inherit;
          text-decoration: none;
        }

        a:visited {
          color: inherit;
        }
      </style>
      ${this.data.map(
        (entry) =>
          `<a href="#blog/${entry.location}">
            <div class="entry">
              <p>${entry.date} - ${entry.author}</p>
              <p>${entry.body}</p>
            </div>
          </a>`
      )}
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
