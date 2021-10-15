import { TitlePageLayout } from './title-page-layout.js';
import { BlogEntry } from './blog-entry.js';
import { md } from '../utility/markdown.js';

const getBlog = async (resource) => {
  try {
    const response = await fetch(`/api/blog/${resource}.md`);
    const text = await response.text();
    return text;
  } catch (error) {
    throw new Error(error);
  }
};

export class BlogEntryPage extends HTMLElement {
  constructor() {
    super();
    this.loading = true;
    this.getBlogData();
    this.render();
    if (customElements.get('cw-blog-entry') === undefined) {
      customElements.define('cw-blog-entry', BlogEntry);
    }
    if (customElements.get('cw-title-page-layout') === undefined) {
      customElements.define('cw-title-page-layout', TitlePageLayout);
    }
  }

  getBlogData() {
    getBlog(window.location.hash.substring(1)).then((text) => {
      this.text = text;
      this.loading = false;
      this.render();
    });
  }

  hashChange() {
    this.loading = true;
    this.getBlogData();
    this.render();
  }

  connectedCallback() {
    window.addEventListener('hashchage', () => this.hashChange());
  }

  disconnectedCallback() {
    window.removeEventListener('hashchage', () => this.hashChange());
  }

  showLoader() {
    const template = document.createElement('template');
    template.innerHTML = `Loading...`;
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));
  }

  render() {
    if (this.loading) {
      this.showLoader();
      return;
    }
    const template = document.createElement('template');
    template.innerHTML = `
      <cw-title-page-layout>
        <cw-blog-entry>
          ${md(this.text)}
        </cw-blog-entry>
      </cw-title-page-layout>
    `;
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));
  }
}
