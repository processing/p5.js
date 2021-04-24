/**
 * @module Math
 * @submodule Matrix
 */

import p5 from '../core/main';

/**
 * @class p5.MatrixTensor
 * @constructor
 * @param {Number} x the x component of the matrix
 * @param {Number} y the y component of the matrix
 * @example
 * <div>
 * <code>
 * let m = createMatrixTensor(4, 3);
 * m.table();
 * </code>
 * </div>
 */
// Named p5.MatrixTensor to avoid using allready existing p5.Matrix
p5.MatrixTensor = function MatrixTensor() {
  let x, y;
  // This is how it comes in with createMatrixTensor()
  if (arguments[0] instanceof p5) {
    // save reference to p5 if passed in
    this.p5 = arguments[0];
    x = arguments[1][0] || 0;
    y = arguments[1][1] || 0;
    // This is what we'll get with new p5.MatrixTensor()
  } else {
    x = arguments[0] || 0;
    y = arguments[1] || 0;
  }
  /**
   * The x component of the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
   * @property cols {Number}
   */
  this.cols = x;
  /**
   * The y component of the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
   * @property rows {Number}
   */
  this.rows = y;
  //Create a Number[][] matrix, all values set to 0
  let m = [];
  for (let i = 0; i < x; i++) {
    m[i] = [];
    for (let j = 0; j < y; j++) {
      m[i][j] = 0;
    }
  }
  /**
   * The matrix component of the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
   * @example
   * <div><code>
   * let matrix = [[1, 0, 1], [0, 1, 0], [1, 0, 1]];
   * console.table(matrix);
   * </code></div>
   * @property matrix {Number[][]}
   */
  this.matrix = m;
};

/**
 * Create a Number[][] matrix, all values set to 0
 */
/**
 * @method make
 * @static
 * @param {Number} x the x component of the Number[][] matrix.
 * @param {Number} y the y component of the Number[][] matrix.
 * @returns {Number[][]}
 * @example
 * <div><code>
 * let rawMatrix = p5.MatrixTensor.make(3, 4);
 * console.log(rawMatrix);
 * </code></div>
 */
p5.MatrixTensor.make = function make(x, y) {
  let m = [];
  for (let i = 0; i < x; i++) {
    m[i] = [];
    for (let j = 0; j < y; j++) {
      m[i][j] = 0;
    }
  }
  return m;
};

/**
 * Convert a '1 by n' matrix to an array.
 */
/**
 * @method toArray
 * @returns {p5.MatrixTensor}
 * @example
 * let m = createMatrixTensor(1, 4);
 * let a = m.toArray();
 * console.log(a);
 * </code></div>
 */
p5.MatrixTensor.prototype.toArray = function toArray() {
  let ans = [];
  if (this.cols === 1) {
    for (let i = 0; i < this.cols; i++) {
      ans[i] = this.matrix[i][0];
    }
  } else {
    p5._friendlyError(
      'The y length of the matrix does not equal 1',
      'p5.MatrixTensor.prototype.toArray'
    );
  }
  return ans;
};

/**
 * Convert an array to a matrix object.
 */
/**
 * @method fromArray
 * @static
 * @param {Array} arr the array to convert into a 'n by 1' matrix.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let a = [1, 1, 0, 1];
 * let m = p5.MatrixTensor.fromArray(a);
 * m.table();
 * </code></div>
 */
p5.MatrixTensor.fromArray = function fromArray(arr) {
  let m = new p5.MatrixTensor(arr.length, 1);
  for (let i = 0; i < arr.length; i++) {
    m.matrix[i][0] = arr[i];
  }
  return m;
};

/**
 * Set a matrix value at a certain coordinate
 */
/**
 * @method setValue
 * @param {Number} value the value to set in the matrix.
 * @param {Number} x the x index.
 * @param {Number} y the y index.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1;
 * function setup() {
 *   createCanvas(100, 100);
 *   stroke(0);
 *   m1 = createMatrixTensor(3, 4);
 *   m1.setValue(100, 2, 3);
 * }
 * function draw() {
 *   background(121);
 *   translate(12, 25);
 *   for (let x = 0; x < m1.cols; x++) {
 *     for (let y = 0; y < m1.rows; y++) {
 *       text(m1.getValue(x, y), x * 30, y * 20);
 *     }
 *   }
 * }
 * </code></div>
 */
p5.MatrixTensor.prototype.setValue = function setValue(value, x, y) {
  if (x >= this.cols || y >= this.rows) {
    p5._friendlyError(
      'The coordinates specified are too large for the matrix.',
      'p5.MatrixTensor.prototype.setValue'
    );
    return undefined;
  } else {
    this.matrix[x][y] = value;
    return this;
  }
};

/**
 * Get a matrix value at a certain coordinate
 */
/**
 * @method getValue
 * @param {Number} x the x index.
 * @param {Number} y the y index.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m = createMatrixTensor(4, 5);
 * let value = m.getValue(3, 4);
 * console.log(value);
 * </code></div>
 */
p5.MatrixTensor.prototype.getValue = function getValue(x, y) {
  if (x >= this.cols || y >= this.rows) {
    p5._friendlyError(
      'The coordinates specified are too large for the matrix.',
      'p5.MatrixTensor.prototype.getValue'
    );
    return undefined;
  } else {
    return this.matrix[x][y];
  }
};

/**
 * Transpose a matrix (rotate a matrix).
 */
/**
 * @method transpose
 * @static
 * @param {p5.MatrixTensor} m the matrix on which to perform the operation.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(2, 3);
 * m1.table();
 * let m2 = p5.MatrixTensor.transpose(m1);
 * m2.table();
 * </code></div>
 */
p5.MatrixTensor.transpose = function transpose(m) {
  let result = new p5.MatrixTensor(m.rows, m.cols);
  if (m instanceof p5.MatrixTensor) {
    for (let i = 0; i < m.cols; i++) {
      for (let j = 0; j < m.rows; j++) {
        result.matrix[j][i] = m.matrix[i][j];
      }
    }
    return result;
  } else {
    p5._friendlyError(
      'Argument must be an instance of p5.MatrixTensor.',
      'p5.MatrixTensor.transpose'
    );
    return undefined;
  }
};

/**
 * Set a matrix to a certain matrix.
 */
/**
 * @method set
 * @param {Number[][]} matrix the matrix with which to set the matrix object.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(2, 2);
 * m1.table();
 * m1.set([[1, 0], [0, 1]]);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.set = function set(matrix) {
  this.matrix = matrix;
  this.cols = matrix.length;
  this.rows = matrix[0].length;
  return this;
};

/**
 * Map every matrix value to a function.
 */
/**
 * @method map
 * @param {function} f the function with which to map every matrix value.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m = createMatrixTensor(2, 3);
 * m.initiate(2);
 * m.map(sqrt);
 * m.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.map = function map(f) {
  if (typeof f === 'function') {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let v = this.matrix[i][j];
        this.matrix[i][j] = f(v);
      }
    }
    return this;
  } else {
    p5._friendlyError(
      'Second argument must be a function.',
      'p5.MatrixTensor.prototype.map'
    );
    return undefined;
  }
};

/**
 * Map every matrix value to a function.
 */
/**
 * @method map
 * @static
 * @param {p5.MatrixTensor} m the matrix on which to perform the operation.
 * @param {function} f
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(4, 4);
 * m1.initiate(2);
 * let m2 = p5.MatrixTensor.map(m1, exp);
 * m2.table();
 * </code></div>
 */
p5.MatrixTensor.map = function map(m, f) {
  if (m instanceof p5.MatrixTensor) {
    if (typeof f === 'function') {
      for (let i = 0; i < m.cols; i++) {
        for (let j = 0; j < m.rows; j++) {
          let v = m.matrix[i][j];
          m.matrix[i][j] = f(v);
        }
      }
      return m;
    } else {
      p5._friendlyError(
        'Second argument must be a function.',
        'p5.MatrixTensor.map'
      );
      return undefined;
    }
  } else {
    p5._friendlyError(
      'First argument must be an instance of p5.MatrixTensor.',
      'p5.MatrixTensor.map'
    );
    return undefined;
  }
};

/**
 * Subtract a matrix to a matrix. (a - b)
 */
/**
 * @method sub
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let a = createMatrixTensor(3, 3);
 * a.initiate(2);
 * a.setValue(5, 2, 2);
 * a.table();
 * let b = createMatrixTensor(3, 3);
 * b.initiate(1);
 * b.table();
 * let c = p5.MatrixTensor.sub(a, b);
 * c.table();
 * </code></div>
 */
p5.MatrixTensor.sub = function sub(a, b) {
  let result = new p5.MatrixTensor(a.cols, a.rows);
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    for (let i = 0; i < result.cols; i++) {
      for (let j = 0; j < result.rows; j++) {
        result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
      }
    }
  }
  return result;
};

/**
 * Subtract a number to a matrix
 */
/**
 * @method sub
 * @param {Number} n the value to subtract to every value of the matrix.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(2);
 * m1.sub(1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.sub = function sub(n) {
  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      this.matrix[i][j] -= n;
    }
  }
  return this;
};

/**
 * Add a matrix to a matrix.
 */
/**
 * @method add
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let a = createMatrixTensor(3, 3);
 * a.initiate(2);
 * a.setValue(10, 1, 2);
 * a.table();
 * let b = createMatrixTensor(3, 3);
 * b.initiate(1);
 * b.table();
 * let c = p5.MatrixTensor.add(a, b);
 * c.table();
 * </code></div>
 */
p5.MatrixTensor.add = function add(a, b) {
  let result;
  let ans;
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      return undefined;
    } else {
      result = p5.MatrixTensor.make(a.cols, a.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result[i][j] = a.matrix[i][j] + b.matrix[i][j];
        }
      }
    }
    ans = new p5.MatrixTensor(0, 0);
    ans.set(result);
    return ans;
  } else {
    p5._friendlyError(
      'Arguments must be instances of p5.MatrixTensor.',
      'p5.MatrixTensor.add'
    );
    return undefined;
  }
};

/**
 * Add a value to a matrix.
 */
/**
 * @method add
 * @param {Number} n the value to add to every value of matrix.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(2);
 * m1.add(1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.add = function add(n) {
  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      this.matrix[i][j] += n;
    }
  }
  return this;
};

/**
 * Static matrix multiplication function.
 */
/**
 * @method mult
 * @param {p5.MatrixTensor|Number} x the first matrix in the multiplication. Either a Number or a Matrix
 * @returns {p5.MatrixTensor}
 * @example
 * <div>
 * <code>
 * let a = createMatrixTensor(3, 4);
 * a.set([[1, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 1]]);
 * let b = createMatrixTensor(4, 3);
 * b.set([[1, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]]);
 * let c = a.mult(b);
 * c.table();
 * </code>
 * </div>
 */
p5.MatrixTensor.prototype.mult = function mult(x) {
  if (x instanceof p5.MatrixTensor) {
    let ans = new p5.MatrixTensor(this.cols, x.rows);
    if (this.rows !== x.cols) {
      p5._friendlyError(
        'Rows of A do not match columns of B.',
        'p5.MatrixTensor.mult'
      );
      return undefined;
    } else {
      for (let i = 0; i < ans.cols; i++) {
        for (let j = 0; j < ans.rows; j++) {
          let sum = 0;
          for (let k = 0; k < this.rows; k++) {
            sum += this.matrix[i][k] * x.matrix[k][j];
          }
          ans.matrix[i][j] = sum;
        }
      }
    }
    return ans;
  } else if (typeof x === 'number') {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] *= x;
      }
    }
    return this;
  } else {
    p5._friendlyError(
      'Arguments must be instances of p5.MatrixTensor.',
      'p5.MatrixTensor.mult'
    );
    return undefined;
  }
};

/**
 * Log a matrix in the form of a table.
 */
/**
 * @method table
 * @example
 * <div><code>
 * let m = createMatrixTensor(4, 3);
 * m.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.table = function table() {
  console.table(p5.MatrixTensor.transpose(this).matrix);
};

/**
 * Initiate matrix to a certain value.
 */
/**
 * @method initiate
 * @param {Number} [value] the initiated value, 0 by default.
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(5, 3);
 * m1.table();
 * m1.initiate(1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.initiate = function initiate(value = 0) {
  for (let i = 0; i < this.matrix.length; i++) {
    for (let j = 0; j < this.matrix[i].length; j++) {
      this.matrix[i][j] = value;
    }
  }
  return this;
};

/**
 * Randomize all matrix values within a range.
 */
/**
 * @method randomize
 * @param {Number} [min] the minimum range value
 * @param {Number} [max] the maximum range value
 * @returns {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(4, 4);
 * m1.table();
 * m1.randomize(-1, 1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.randomize = function randomize(min = 0, max = 1) {
  for (let i = 0; i < this.matrix.length; i++) {
    for (let j = 0; j < this.matrix[i].length; j++) {
      this.matrix[i][j] = Math.random() * (max - min) + min;
    }
  }
  return this;
};

export default p5.MatrixTensor;
