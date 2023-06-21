import p5 from '../core/main';

p5.DataVector = class DataVector {
  constructor(initialLength = 128) {
    this.length = 0;
    this.data = new Float32Array(initialLength);
    this.initialLength = initialLength;
  }

  clear() {
    this.length = 0;
  }

  rescale() {
    if (this.length < this.data.length / 2) {
      // Find the power of 2 size that fits the data
      const targetLength = 1 << Math.ceil(Math.log2(this.length));
      const newData = new Float32Array(targetLength);
      newData.set(this.data.subarray(0, this.length), 0);
      this.data = newData;
    }
  }

  reset() {
    this.clear();
    this.data = new Float32Array(this.initialLength);
  }

  push(...values) {
    this.ensureLength(this.length + values.length);
    this.data.set(values, this.length);
    this.length += values.length;
  }

  slice(from, to) {
    return this.data.slice(from, Math.min(to, this.length));
  }

  subArray(from, to) {
    return this.data.subarray(from, Math.min(to, this.length));
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
