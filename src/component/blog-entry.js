export class BlogEntry extends HTMLElement {
  static get observedAttributes() {
    return ['date', 'author'];
  }

  set date(value) {
    this.setAttribute('date', value);
  }

  set author(value) {
    return this.setAttribute('author', value);
  }

  get date() {
    return this.getAttribute('date');
  }

  get author() {
    return this.getAttribute('author');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const shadowRoot = this.shadowRoot;
    const tempalte = document.createElement('template');
    tempalte.innerHTML = `
      <style>
        ::slotted(h1) {
          margin-top: 0px;
          padding-top: 21px;
        }

        ::slotted(p){
          margin-bottom: 0px;
          padding-bottom: 16px;
        }

        ::slotted(p:last-child) {
          margin-bottom: 16px;
        }
      </style>
      <div class="meta-data">
        <div class="author">${this.author || ''}</div>
        <div class="date">${this.date || ''}</div>
      </div>
      <div class="body">
        <slot></slot>
      </div>
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(tempalte.content.cloneNode(true));
  }
}
