export class Observable {
  constructor() {
    this.observers = [];
    this.state = undefined;
  }

  subscribe(observer) {
    this.observers.push(observer);
    return this.state;
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify() {
    this.observers.forEach((observer) => observer(this.state));
  }
}
