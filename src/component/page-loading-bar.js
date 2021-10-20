import { Observable } from '../utility/observable.js';

class LoadingObservable extends Observable {
  constructor() {
    super();
    this.state = [];
  }

  pushLoadingState(loadingKey) {
    this.state.push(loadingKey);
    this.notify();
  }

  resolveLoadingState(loadingKey) {
    this.state = this.state.filter((key) => key !== loadingKey);
    this.notify();
  }
}

export const loadingObservable = new LoadingObservable();

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: black;
      position: absolute;
    }

    .loading-progress {
      height: 5px;
      width: 100vw;
      border-radius: 3px;
      background: linear-gradient(90deg, red 0%, yellow 15%, lime 30%, cyan 50%, blue 65%, magenta 80%, red 100%);
      background-size: 200%;
      animation: moveGradient 5s linear infinite;
    }

    @keyframes moveGradient {
      0% {
        background-position: 0% 0%; }
      100% {
        background-position: -200% 0%; } }
  </style>
  <div class="loading">
    <div class="loading-progress"></div>
  </div>
`;

export class PageLoadingBar extends HTMLElement {
  constructor() {
    super();
  }

  onLoadingStateChange(state) {
    this.render(state);
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const state = loadingObservable.subscribe(
      this.onLoadingStateChange.bind(this)
    );
    this.render(state);
  }

  disconnectedCallback() {
    loadingObservable.unsubscribe(this.onLoadingStateChange.bind(this));
  }

  render(state) {
    if (state.length <= 0) {
      this.shadowRoot.innerHTML = '';
    } else if (this.shadowRoot.innerHTML === '') {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}
