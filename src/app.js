import { BlogRouter } from './component/blog-router.js';
import { TitlePageLayout } from './component/title-page-layout.js';
import { ToastWrapperElement } from './component/toast.js';

customElements.define('cw-toast-mount', ToastWrapperElement);
customElements.define('cw-blog-router', BlogRouter);
customElements.define('cw-title-page-layout', TitlePageLayout);

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '.',
    });
  }
});

class App extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <cw-toast-mount></cw-toast-mount>
      <cw-title-page-layout>
        <cw-blog-router></cw-blog-router>
      </cw-title-page-layout>
    `;
  }
}

customElements.define('cw-app', App);
