class DelayedAction {
  timeout: number | null = null;
  constructor() {
    this.timeout = null;
  }

  set(action: Function, delay = 800) {
    this.clear();
    this.timeout = setTimeout(action, delay);
  }

  clear() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

export const delayedSync = new DelayedAction();
