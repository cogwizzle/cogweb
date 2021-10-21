import { loadingObservable } from './page-loading-bar.js';
import { Observable } from '../utility/observable.js';

class LazyLoadingObservable extends Observable {
  constructor() {
    super();
    this.state = [];
  }

  addLazyLoadDescription(description) {
    this.state.push(description);
  }
}

export const lazyLoaderObservable = new LazyLoadingObservable();

export const CreateLazyLoader = ({ componentName, path, tagName }) =>
  class LazyLoaderElement extends HTMLElement {
    constructor() {
      super();
    }

    onNewComponentLoaded(components) {
      this.lazyLoadedComponents = components;
    }

    connectedCallback() {
      this.loading = true;
      loadingObservable.pushLoadingState(`lazy-load-${tagName}`);
      this.lazyLoadedComponents = lazyLoaderObservable.subscribe(
        this.onNewComponentLoaded.bind(this)
      );
      const hasComponentBeenLazyLoaded = this.lazyLoadedComponents.find(
        (component) => {
          return (
            component.componentName === componentName &&
            component.tagName === tagName &&
            component.path === path
          );
        }
      );
      if (hasComponentBeenLazyLoaded) {
        this.loading = false;
        this.lazyLoadedComponents = lazyLoaderObservable.unsubscribe(
          this.onNewComponentLoaded.bind(this)
        );
        this.render();
        return;
      }
      const resource = import(path);
      resource.then((module) => {
        if (customElements.get(tagName)) return;
        customElements.define(tagName, module[componentName]);
        lazyLoaderObservable.addLazyLoadDescription({
          componentName,
          tagName,
          path,
        });
        lazyLoaderObservable.unsubscribe(this.onNewComponentLoaded.bind(this));
        this.render();
      });
    }

    disconnectedCallback() {
      if (loadingObservable.state.indexOf(`lazy-load-${tagName}`) !== -1) {
        loadingObservable.resolveLoadingState(`lazy-load-${tagName}`);
      }
      this.lazyLoadedComponents = lazyLoaderObservable.unsubscribe(
        this.onNewComponentLoaded.bind(this)
      );
    }

    render() {
      const template = document.createElement('template');
      const component = document.createElement(tagName);
      this.getAttributeNames().forEach((attributeName) => {
        component.setAttribute(attributeName, this.getAttribute(attributeName));
      });
      template.content.appendChild(component);
      this.innerHTML = template.innerHTML;
      loadingObservable.resolveLoadingState(`lazy-load-${tagName}`);
    }
  };
