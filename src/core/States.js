export class States {
  #modified = {};

  constructor(initialState) {
    for (const key in initialState) {
      this[key] = initialState[key];
    }
  }

  setValue(key, value) {
    if (!(key in this.#modified)) {
      this.#modified[key] = this[key];
    }
    this[key] = value;
  }

  getDiff() {
    const diff = this.#modified;
    this.#modified = {};
    return diff;
  }

  getModified() {
    return this.#modified;
  }

  applyDiff(prevModified) {
    for (const key in this.#modified) {
      this[key] = this.#modified[key];
    }
    this.#modified = prevModified;
  }
}
