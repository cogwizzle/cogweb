import { Observable } from '../utility/observable.js';

const position = {
  TOP_LEFT: 'top-left',
  BOTTOM_LEFT: 'bottom-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_RIGHT: 'bottom-right',
};

const defaultOptions = {
  position: position.TOP_RIGHT,
  duration: 2000,
};

export class ToastObservable extends Observable {
  constructor() {
    super();
    this.state = [];
  }

  createToast(message, options) {
    const toast = {
      message,
      options: { ...defaultOptions, ...options },
    };
    this.state = [...this.state, toast];
    setTimeout(() => {
      if (this.state.find((toast) => toast.message === message))
        this.removeToast(message);
    }, toast.options.duration);
    this.notify();
  }

  removeToast(message) {
    this.state = this.state.filter((toast) => toast.message !== message);
    this.notify();
  }
}

const toastObservable = new ToastObservable();

const toastGlobalTemplate = (tagName) => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
        position: fixed;
        height: 100vh;
        width: 100vw;
        pointer-events: none;
      }

      .toast-wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        transition: height 0.5s ease-out;
        pointer-events: auto;
      }

      .fadeOut {
        visibility: hidden;
        opacity: 0;
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 0;
        color: transparent;
        transition: visibility 0s 0.3s, opacity 0.3s ease-out, max-height 0.3s linear, padding 0.3s linear, margin 0.3s linear;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .toast-wrapper-top-left {
        top: 10px;
        left: 10px;
      }
      
      .toast-wrapper-top-left ${tagName} {
        animation: slideInLeft 0.5s;
      }

      .toast-wrapper-top-right {
        top: 10px;
        right: 10px;
      }

      .toast-wrapper-top-right ${tagName} {
        animation: slideInRight 0.5s;
      }

      .toast-wrapper-bottom-left {
        bottom: 10px;
        left: 10px;
        flex-direction: column-reverse;
      }

      .toast-wrapper-bottom-left ${tagName} {
        animation: slideInLeft 0.5s;
      }

      .toast-wrapper-bottom-right {
        bottom: 10px;
        right: 10px;
        flex-direction: column-reverse;
      }

      .toast-wrapper-bottom-right ${tagName} {
        animation: slideInRight 0.5s;
      }
    </style>
    <div class="toast-wrapper toast-wrapper-top-left">
    </div>
    <div class="toast-wrapper toast-wrapper-top-right">
    </div>
    <div class="toast-wrapper toast-wrapper-bottom-left">
    </div>
    <div class="toast-wrapper toast-wrapper-bottom-right">
    </div>
  `;
  return template;
};

export const toast = (message, options = {}) => {
  toastObservable.createToast(message, options);
};

const determineColors = (type) => {
  switch (type) {
    case 'danger':
      return {
        'background-color': '#f8d7da',
        border: 'solid 1px #f5c2c7',
        color: '#842029',
      };
    case 'warning':
      return {
        'background-color': '#fff3cd',
        border: 'solid 1px #ffecb5',
        color: '#664d03',
      };
    default:
      return {
        'background-color': '#fff',
        border: 'none',
        color: '#636464',
      };
  }
};

export class ToastElement extends HTMLElement {
  static get observedAttributes() {
    return ['key', 'type'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  get key() {
    return this.getAttribute('key');
  }

  set key(value) {
    this.setAttribute('key', value);
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(value) {
    this.type = value;
  }

  render() {
    const template = document.createElement('template');
    const colors = determineColors(this.getAttribute('type'));
    template.innerHTML = `
      <style>
        :host {
          position: relative;
          background-color: ${colors['background-color']};
          border: ${colors.border};
          color: ${colors.color};
          border-radius: 5px;
          padding: 10px;
          box-shadow: 0px 0px 5px #000;
          width: 200px;
          margin-bottom: 10px;
          padding-rigth: 25px;
        }

        #remove {
          position: absolute;
          top: 0;
          right: 0;
          background-color: transparent;
          cursor: pointer;
          outline: none;
          border: none;
          font-size: 20px;
        }
      </style>
      <div class="toast-message">
        <button type="button" id="remove">&times;</button>
        <slot></slot>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('#remove').addEventListener('click', () => {
      toastObservable.removeToast(this.getAttribute('key'));
    });
  }
}

customElements.define('ez-default-toast', ToastElement);

export class ToastWrapperElement extends HTMLElement {
  static get observedAttributes() {
    return ['tag-name'];
  }

  constructor() {
    super();
  }

  onToastUpdate(toasts) {
    this._toasts = toasts;
    this.render();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._toasts = toastObservable.subscribe(this.onToastUpdate.bind(this));
    this._initialRender();
    this.render();
  }

  disconnectedCallback() {
    toastObservable.unsubscribe(this.onToastUpdate.bind(this));
  }

  set tagName(value) {
    this.setAttribute('tag-name', value);
  }

  get tagName() {
    return this.getAttribute('tag-name');
  }

  attributesChangedCallback(name, oldValue, newValue) {
    if (name === 'tag-name') {
      this._initialRender();
    }
  }

  _createToastElements(acc, toast) {
    const tagName = this.getAttribute('tag-name') || 'ez-default-toast';
    const toastElement = document.createElement(tagName);
    toastElement.key = toast.message;
    toastElement.setAttribute('type', toast.options.type);
    toastElement.innerHTML = toast.message;
    acc[toast.options.position].push(toastElement);
    return acc;
  }

  _initialRender() {
    const tagName = this.getAttribute('tag-name') || 'ez-default-toast';
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(
      toastGlobalTemplate(tagName).content.cloneNode(true)
    );
  }

  render() {
    if (!this._toasts) return;
    const templates = this._toasts.reduce(
      this._createToastElements.bind(this),
      {
        'top-left': [],
        'top-right': [],
        'bottom-left': [],
        'bottom-right': [],
      }
    );
    const topLeft = this.shadowRoot.querySelector('.toast-wrapper-top-left');
    const topRight = this.shadowRoot.querySelector('.toast-wrapper-top-right');
    const bottomLeft = this.shadowRoot.querySelector(
      '.toast-wrapper-bottom-left'
    );
    const bottomRight = this.shadowRoot.querySelector(
      '.toast-wrapper-bottom-right'
    );
    if (!topLeft || !topRight || !bottomLeft || !bottomRight) return;
    const topLeftChildren = [...topLeft.children];
    const topRightChildren = [...topRight.children];
    const bottomLeftChildren = [...bottomLeft.children];
    const bottomRightChildren = [...bottomRight.children];
    const topLeftRemoved = topLeftChildren.filter((child) => {
      const key = child.getAttribute('key');
      return !templates['top-left'].some(
        (toast) => toast.getAttribute('key') === key
      );
    });
    const topRightRemoved = topRightChildren.filter((child) => {
      const key = child.getAttribute('key');
      return !templates['top-right'].some(
        (toast) => toast.getAttribute('key') === key
      );
    });
    const bottomLeftRemoved = bottomLeftChildren.filter((child) => {
      const key = child.getAttribute('key');
      return !templates['bottom-left'].some(
        (toast) => toast.getAttribute('key') === key
      );
    });
    const bottomRightRemoved = bottomRightChildren.filter((child) => {
      const key = child.getAttribute('key');
      return !templates['bottom-right'].some(
        (toast) => toast.getAttribute('key') === key
      );
    });
    [
      ...topLeftRemoved,
      ...topRightRemoved,
      ...bottomLeftRemoved,
      ...bottomRightRemoved,
    ].forEach((child) => {
      if ([...child.classList].indexOf('fadeOut') < 0) {
        child.classList.add('fadeOut');
      }
      setTimeout(() => {
        if (child) {
          child.remove();
        }
      }, 500);
    });
    const topLeftAdd = templates['top-left'].filter((toast) => {
      const key = toast.getAttribute('key');
      return !topLeftChildren.some(
        (child) => child.getAttribute('key') === key
      );
    });
    const topRightAdd = templates['top-right'].filter((toast) => {
      const key = toast.getAttribute('key');
      return !topRightChildren.some(
        (child) => child.getAttribute('key') === key
      );
    });
    const bottomLeftAdd = templates['bottom-left'].filter((toast) => {
      const key = toast.getAttribute('key');
      return !bottomLeftChildren.some(
        (child) => child.getAttribute('key') === key
      );
    });
    const bottomRightAdd = templates['bottom-right'].filter((toast) => {
      const key = toast.getAttribute('key');
      return !bottomRightChildren.some(
        (child) => child.getAttribute('key') === key
      );
    });
    topLeftAdd.forEach((toast) => topLeft.appendChild(toast));
    topRightAdd.forEach((toast) => topRight.appendChild(toast));
    bottomLeftAdd.forEach((toast) => bottomLeft.appendChild(toast));
    bottomRightAdd.forEach((toast) => bottomRight.appendChild(toast));
  }
}
