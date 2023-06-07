import p5 from '../core/main';

p5.DataVector = class DataVector {
  constructor(initialLength = 256) {
    this.length = 0;
    this.data = new Float32Array(initialLength);
    this.initialLength = initialLength;
  }

  clear() {
    this.length = 0;
  }

  reset() {
    this.clear();
    this.data = new Float32Array(initialLength);
  }

  push(...values) {
    this.ensureLength(this.length + values.length);
    this.data.set(values, this.length);
    this.length += values.length;
  }

  slice(from, to) {
    return this.data.slice(from, Math.min(to, this.length));
  }

  ensureLength(target) {
    while (this.data.length < target) {
      const newData = new Float32Array(this.data.length * 2);
      newData.set(this.data, 0);
      this.data = newData;
    }
  }
};

export default p5.DataVector;
