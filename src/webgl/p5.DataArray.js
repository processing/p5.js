class DataArray {
  constructor(initialLength = 128) {
    this.length = 0;
    this.data = new Float32Array(initialLength);
    this.initialLength = initialLength;
  }

  /**
   * Returns a Float32Array window sized to the exact length of the data
   */
  dataArray() {
    return this.subArray(0, this.length);
  }

  /**
   * A "soft" clear, which keeps the underlying storage size the same, but
   * empties the contents of its dataArray()
   */
  clear() {
    this.length = 0;
  }

  /**
   * Can be used to scale a DataArray back down to fit its contents.
   */
  rescale() {
    if (this.length < this.data.length / 2) {
      // Find the power of 2 size that fits the data
      const targetLength = 1 << Math.ceil(Math.log2(this.length));
      const newData = new Float32Array(targetLength);
      newData.set(this.data.subarray(0, this.length), 0);
      this.data = newData;
    }
  }

  /**
   * A full reset, which allocates a new underlying Float32Array at its initial
   * length
   */
  reset() {
    this.clear();
    this.data = new Float32Array(this.initialLength);
  }

  /**
   * Adds values to the DataArray, expanding its internal storage to
   * accommodate the new items.
   */
  push(...values) {
    this.ensureLength(this.length + values.length);
    this.data.set(values, this.length);
    this.length += values.length;
  }

  /**
   * Returns a copy of the data from the index `from`, inclusive, to the index
   * `to`, exclusive
   */
  slice(from, to) {
    return this.data.slice(from, Math.min(to, this.length));
  }

  /**
   * Returns a mutable Float32Array window from the index `from`, inclusive, to
   * the index `to`, exclusive
   */
  subArray(from, to) {
    return this.data.subarray(from, Math.min(to, this.length));
  }

  /**
   * Expand capacity of the internal storage until it can fit a target size
   */
  ensureLength(target) {
    while (this.data.length < target) {
      const newData = new Float32Array(this.data.length * 2);
      newData.set(this.data, 0);
      this.data = newData;
    }
  }
};

function dataArray(p5, fn){
  /**
   * An internal class to store data that will be sent to a p5.RenderBuffer.
   * Those need to eventually go into a Float32Array, so this class provides a
   * variable-length array container backed by a Float32Array so that it can be
   * sent to the GPU without allocating a new array each frame.
   *
   * Like a C++ vector, its fixed-length Float32Array backing its contents will
   * double in size when it goes over its capacity.
   *
   * @example
   * <div>
   * <code>
   * // Initialize storage with a capacity of 4
   * const storage = new DataArray(4);
   * console.log(storage.data.length); // 4
   * console.log(storage.length); // 0
   * console.log(storage.dataArray()); // Empty Float32Array
   *
   * storage.push(1, 2, 3, 4, 5, 6);
   * console.log(storage.data.length); // 8
   * console.log(storage.length); // 6
   * console.log(storage.dataArray()); // Float32Array{1, 2, 3, 4, 5, 6}
   * </code>
   * </div>
   */
  p5.DataArray = DataArray;
}

export default dataArray;
export { DataArray }

if(typeof p5 !== 'undefined'){
  dataArray(p5, p5.prototype);
}
