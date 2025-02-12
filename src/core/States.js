export class States {
  #modified = {};
  #tracking = false;
  #data = {};

  constructor(initialState) {
    for (const key in initialState) {
      this[key] = initialState[key]
    }
  }

  trackDiffs() {
    this.#tracking = true;
    this.#modified = {};
    this.#data = {};
    for (const key in this) {
      console.log(key)
      this.#data[key] = this[key];
      Object.defineProperty(this, key, {
        get() {
          return this.#data[key];
        },
        set(val) {
          if (this.#tracking) {
            this.#modified[key] = this.#data[key];
          }
          this.#data[key] = val;
        }
      });
    }
  }

  getDiff() {
    const diff = this.#modified;
    this.#modified = {};
    return diff;
  }

  applyDiff(prevModified) {
    for (const key in this.#modified) {
      this.#data[key] = this.#modified[key];
    }
    this.#modified = prevModified;
  }

  resetDiffTracking() {}
}
