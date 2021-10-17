export class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    const shadowRoot = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #111827;
          padding: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #F9FAFB;
          padding-left: 15px;
          padding-right: 15px;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        a:visited {
          color: inherit;
          text-decoration: none;
        }
      </style>
      <h1>
        <a href="#"><slot></slot></a>
      </h1>
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
