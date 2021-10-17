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
