export class BlogList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.loading = true;
    fetch('/blog/index.json')
      .then((res) => res.json())
      .then((data) => {
        this.loading = false;
        this.data = data;
        this.render();
      });
    this.render();
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
      ${this.data.map(
        (entry) =>
          `<a href="/blog/#${entry.location}">
            <div class="entry">
              <h2>${entry.title}</h2>
              <p>${entry.date} - ${entry.author}</p>
            </div>
          </a>`
      )}
    `;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
