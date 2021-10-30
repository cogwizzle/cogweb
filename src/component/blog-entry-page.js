import { BlogEntry } from './blog-entry.js';
import { loadingObservable } from './page-loading-bar.js';
import { toast } from './toast.js';

const getBlog = async (resource) => {
  try {
    const response = await fetch(`/api/blog/${resource}`);
    if (response.ok) {
      const text = await response.text();
      return text;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    toast('Unable to find the blog entry.', { type: 'danger' });
    return '';
  }
};

export class BlogEntryPage extends HTMLElement {
  static get observedAttributes() {
    return ['entry'];
  }

  constructor() {
    super();
  }

  set entry(value) {
    this.setAttribute('entry', value);
  }

  get entry() {
    this.getAttribute('entry');
  }

  async getBlogData() {
    const text = await getBlog(this.getAttribute('entry'));
    this.text = text;
    this.loading = false;
    loadingObservable.resolveLoadingState('blog-entry');
    this.render();
  }

  connectedCallback() {
    this.loading = true;
    this.getBlogData();
    this.render();
    if (customElements.get('cw-blog-entry') === undefined) {
      customElements.define('cw-blog-entry', BlogEntry);
    }
  }

  showLoader() {
    const template = document.createElement('template');
    template.innerHTML = `Loading...`;
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));
  }

  render() {
    if (this.loading) {
      loadingObservable.pushLoadingState('blog-entry');
      return;
    }
    const template = document.createElement('template');
    template.innerHTML = `
      <cw-blog-entry>
        ${this.text}
      </cw-blog-entry>
    `;
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));
  }
}
