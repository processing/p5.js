/**
 * @module Math
 * @submodule Matrix
 */

import p5 from '../core/main';

/**
 * A class to describe 2 dimensional matrices.
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
  let m = [[]];
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
 * Create a Number[][] matrix, all values set to 0.
 * @method make
 * @static
 * @param {Number} x the x component of the Number[][] matrix.
 * @param {Number} y the y component of the Number[][] matrix.
 * @return {Number[][]}
 * @example
 * <div><code>
 * let rawMatrix = p5.MatrixTensor.make(3, 4);
 * console.log(rawMatrix);
 * </code></div>
 */
p5.MatrixTensor.make = function make(x = 0, y = 0) {
  let m = [[]];
  for (let i = 0; i < x; i++) {
    m[i] = [];
    for (let j = 0; j < y; j++) {
      m[i][j] = 0;
    }
  }
  return m;
};

/**
 * Convert a (1 by n) or (n by 1) <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to an array.
 * @method toArray
 * @return {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m = createMatrixTensor(4, 1);
 * let a = m.toArray();
 * console.log(a);
 * </code></div>
 */
p5.MatrixTensor.prototype.toArray = function toArray() {
  let ans = [];
  if (this.rows === 1) {
    for (let i = 0; i < this.cols; i++) {
      ans[i] = this.matrix[i][0];
    }
    return ans;
  } else if (this.cols === 1) {
    ans = this.matrix[0];
    return ans;
  } else {
    p5._friendlyError(
      'none of the lengths of the matrix equal 1',
      'p5.MatrixTensor.prototype.toArray'
    );
    return undefined;
  }
};

/**
 * Convert an array to a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method fromArray
 * @static
 * @param {Array} arr the array to convert into a 'n by 1' matrix.
 * @return {p5.MatrixTensor}
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
 * Set a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> value at a coordinate.
 * @method setValue
 * @param {Number} value the value to set in the matrix.
 * @param {Number} x the x index.
 * @param {Number} y the y index.
 * @chainable
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
 * Get a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> value at a coordinate.
 * @method getValue
 * @param {Number} x the x index.
 * @param {Number} y the y index.
 * @return {p5.MatrixTensor}
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
 * Copy a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method copy
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(2, 3);
 * m1.table();
 * let m2 = m1.copy();
 * m2.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.copy = function copy() {
  let result;
  if (this.p5) {
    result = new p5.MatrixTensor(this.p5, [this.cols, this.rows]);
  } else {
    result = new p5.MatrixTensor(this.cols, this.rows);
  }
  result.set(this.matrix);
  return result;
};

/**
 * Set a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a certain matrix.
 * @method set
 * @param {Number[][]|p5.MatrixTensor} m the matrix with which to set the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(2, 2);
 * m1.table();
 * m1.set([[1, 0], [0, 1]]);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.set = function set(m) {
  if (m instanceof p5.MatrixTensor) {
    this.rows = m.rows;
    this.cols = m.cols;
    this.matrix = m.matrix;
    return this;
  } else {
    this.matrix = m;
    this.rows = m[0].length;
    //If rows = 0, columns should be 0, matrix.lenght is going to return 1 because of the empty array in matrix.
    if (this.rows === 0) {
      this.cols = 0;
    } else {
      this.cols = m.length;
    }
    return this;
  }
};
/**
 * @method transpose
 * @chainable
 * @example
 * <div><code>
 * let m = createMatrixTensor(2, 3);
 * m.table();
 * m.transpose();
 * m.table();
 * </code></div>
 * @alt
 * Non-static example of a transpose operation.
 */
p5.MatrixTensor.prototype.transpose = function transpose() {
  let result = new p5.MatrixTensor(this.rows, this.cols);
  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      result.matrix[j][i] = this.matrix[i][j];
    }
  }
  this.set(result);
  return this;
};

/**
 * Transpose a matrix.
 */
/**
 * @method transpose
 * @static
 * @param {p5.MatrixTensor} m the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> on which to perform the operation.
 * @return {p5.MatrixTensor} a transposed <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> instance.
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(2, 3);
 * m1.table();
 * let m2 = p5.MatrixTensor.transpose(m1);
 * m2.table();
 * </code></div>
 * @alt
 * Static example of a transpose operation.
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
 * Map every <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> value to a function.
 * @method map
 * @param {function} f the function with which to map every matrix value. This function should have one 'Number' value as an argument and return a 'Number' value.
 * @chainable
 * @example
 * <div><code>
 * let m;
 * function setup() {
 *   stroke(0);
 *   //Creating the matrix
 *   m = createMatrixTensor(2, 3);
 *   m.setValue(1, 0, 0);
 *   m.setValue(4, 0, 1);
 *   m.setValue(9, 0, 2);
 *   m.setValue(16, 1, 0);
 *   m.setValue(25, 1, 1);
 *   m.setValue(36, 1, 2);
 *   // Mapping the values to sqrt(x)
 *   m.map(sqrt);
 * }
 * function draw() {
 *   background(121);
 *   translate(40, 30);
 *   for (let x = 0; x < m.cols; x++) {
 *     for (let y = 0; y < m.rows; y++) {
 *       text(m.getValue(x, y), x * 20, y * 25);
 *     }
 *   }
 * }
 * </code></div>
 * <div><code>
 * let m;
 * function setup() {
 *   stroke(0);
 *   //Creating the matrix
 *   m = createMatrixTensor(2, 3);
 *   m.setValue(-3, 0, 0);
 *   m.setValue(-2, 0, 1);
 *   m.setValue(-1, 0, 2);
 *   m.setValue(1, 1, 0);
 *   m.setValue(2, 1, 1);
 *   m.setValue(3, 1, 2);
 *   // Mapping the values to a custom function.
 *   m.map(x => {
 *     return round(1 / (1 + exp(-x)) * 100) / 100;
 *   });
 * }
 * function draw() {
 *   background(121);
 *   translate(12, 30);
 *   for (let x = 0; x < m.cols; x++) {
 *     for (let y = 0; y < m.rows; y++) {
 *       text(m.getValue(x, y), x * 45, y * 25);
 *     }
 *   }
 * }
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
 * @method map
 * @static
 * @param {p5.MatrixTensor} m the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> on which to perform the operation.
 * @param {function} f
 * @return {p5.MatrixTensor} a mapped matrix as a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> instance.
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
      let mc = new p5.MatrixTensor(m.cols, m.rows);
      for (let i = 0; i < mc.cols; i++) {
        for (let j = 0; j < mc.rows; j++) {
          mc.matrix[i][j] = f(m.matrix[i][j]);
        }
      }
      return mc;
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
 * Subtract a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a number or <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method sub
 * @param {Number|p5.MatrixTensor} n the value to subtract to every value of the matrix. Can be a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> or a Number
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(2);
 * m1.sub(1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.sub = function sub(n) {
  if (n instanceof p5.MatrixTensor) {
    if (n.cols !== this.cols || n.rows !== this.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.prototype.sub'
      );
      return undefined;
    } else {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.matrix[i][j] -= n.matrix[i][j];
        }
      }
      return this;
    }
  } else {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] -= n;
      }
    }
    return this;
  }
};

/**
 * @method sub
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @return {p5.MatrixTensor}
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
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.sub'
      );
      return undefined;
    } else {
      let result = new p5.MatrixTensor(a.cols, a.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
        }
      }
      return result;
    }
  } else {
    p5._friendlyError(
      'The arguments should be p5.MatrixTensors',
      'p5.MatrixTensor.sub'
    );
    return undefined;
  }
};

/**
 * Add a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a number or <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method add
 * @param {Number|p5.MatrixTensor} n the value to add to the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(2);
 * m1.add(1);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.add = function add(n) {
  if (n instanceof p5.MatrixTensor) {
    if (this.cols !== n.cols || this.rows !== n.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.prototype.add'
      );
      return undefined;
    } else {
      let result = new p5.MatrixTensor(this.cols, this.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result.matrix[i][j] = this.matrix[i][j] + n.matrix[i][j];
        }
      }
      this.set(result);
      return this;
    }
  } else {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] += n;
      }
    }
    return this;
  }
};

/**
 * @method add
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @chainable
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
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.add'
      );
      return undefined;
    } else {
      let result = new p5.MatrixTensor(a.cols, a.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
        }
      }
      return result;
    }
  } else {
    p5._friendlyError(
      'Arguments must be instances of p5.MatrixTensor.',
      'p5.MatrixTensor.add'
    );
    return undefined;
  }
};

/**
 * Divide a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a number or <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method div
 * @param {Number|p5.MatrixTensor} n the value to divide the matrix.
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(4);
 * m1.div(2);
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.div = function div(n) {
  if (n instanceof p5.MatrixTensor) {
    if (n.cols !== this.cols || n.rows !== this.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.prototype.div'
      );
      return undefined;
    } else {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.matrix[i][j] /= n.matrix[i][j];
        }
      }
      return this;
    }
  } else {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] /= n;
      }
    }
    return this;
  }
};

/**
 * @method div
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @return {p5.MatrixTensor}
 * @example
 * <div><code>
 * let a = createMatrixTensor(3, 3);
 * a.initiate(2);
 * a.setValue(5, 2, 2);
 * a.table();
 * let b = createMatrixTensor(3, 3);
 * b.initiate(2);
 * b.table();
 * let c = p5.MatrixTensor.div(a, b);
 * c.table();
 * </code></div>
 */
p5.MatrixTensor.div = function div(a, b) {
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.div'
      );
      return undefined;
    } else {
      let result = new p5.MatrixTensor(a.cols, a.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result.matrix[i][j] = a.matrix[i][j] / b.matrix[i][j];
        }
      }
      return result;
    }
  } else {
    p5._friendlyError(
      'The arguments should be p5.MatrixTensors',
      'p5.MatrixTensor.div'
    );
    return undefined;
  }
};

/**
 * Multiply a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a number or <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method mult
 * @param {Number|p5.MatrixTensor} n the value to multiply the matrix.
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(3, 3);
 * m1.initiate(4);
 * m1.mult(2);
 * m1.table();
 * </code></div>
 * <div><code>
 * let a = createMatrixTensor(3, 3);
 * a.initiate(5);
 * a.setValue(4, 2, 2);
 * a.table();
 * let b = createMatrixTensor(3, 3);
 * b.initiate(2);
 * b.table();
 * let c = p5.MatrixTensor.mult(a, b);
 * c.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.mult = function mult(n) {
  if (n instanceof p5.MatrixTensor) {
    if (n.cols !== this.cols || n.rows !== this.rows) {
      p5._friendlyError(
        'The matrix dimensions should match, be sure you are not mistaking matrix multiplication & matrix dot product.',
        'p5.MatrixTensor.prototype.mult'
      );
      return undefined;
    } else {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.matrix[i][j] *= n.matrix[i][j];
        }
      }
      return this;
    }
  } else {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.matrix[i][j] *= n;
      }
    }
    return this;
  }
};

/**
 * @method mult
 * @static
 * @param {p5.MatrixTensor} a the first matrix in the calculation.
 * @param {p5.MatrixTensor} b the second matrix in the calculation.
 * @return {p5.MatrixTensor}
 */
p5.MatrixTensor.mult = function mult(a, b) {
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    if (a.cols !== b.cols || a.rows !== b.rows) {
      p5._friendlyError(
        'The matrix dimensions should match',
        'p5.MatrixTensor.mult'
      );
      return undefined;
    } else {
      let result = new p5.MatrixTensor(a.cols, a.rows);
      for (let i = 0; i < result.cols; i++) {
        for (let j = 0; j < result.rows; j++) {
          result.matrix[i][j] = a.matrix[i][j] * b.matrix[i][j];
        }
      }
      return result;
    }
  } else {
    p5._friendlyError(
      'The arguments should be p5.MatrixTensors',
      'p5.MatrixTensor.mult'
    );
    return undefined;
  }
};

/**
 * Matrix dot product operation of a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a>.
 * @method dot
 * @param {p5.MatrixTensor} x The matrix to multiply the <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> with.
 * @chainable
 * @example
 * <div>
 * <code>
 * let a = createMatrixTensor(3, 4);
 * a.set([[1, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 1]]);
 * let b = createMatrixTensor(4, 3);
 * b.set([[1, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]]);
 * let c = a.dot(b);
 * c.table();
 * </code>
 * </div>
 */
p5.MatrixTensor.prototype.dot = function dot(x) {
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
    this.set(ans);
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
 * @method dot
 * @static
 * @param {p5.MatrixTensor} a the first matrix of the dot product operation.
 * @param {p5.MatrixTensor} b the second matrix of the dot product operation.
 * @return {p5.MatrixTensor}
 * @example
 * <div>
 * <code>
 * let a = createMatrixTensor(3, 4);
 * a.set([[1, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 1]]);
 * let b = createMatrixTensor(4, 3);
 * b.set([[1, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0]]);
 * let c = p5.MatrixTensor.dot(a, b);
 * c.table();
 * </code>
 * </div>
 */
p5.MatrixTensor.dot = function dot(a, b) {
  if (a instanceof p5.MatrixTensor && b instanceof p5.MatrixTensor) {
    let ans = new p5.MatrixTensor(a.cols, b.rows);
    if (a.rows !== b.cols) {
      p5._friendlyError(
        'Rows of A do not match columns of B.',
        'p5.MatrixTensor.mult'
      );
      return undefined;
    } else {
      for (let i = 0; i < ans.cols; i++) {
        for (let j = 0; j < ans.rows; j++) {
          let sum = 0;
          for (let k = 0; k < a.rows; k++) {
            sum += a.matrix[i][k] * b.matrix[k][j];
          }
          ans.matrix[i][j] = sum;
        }
      }
    }
    return ans;
  } else {
    p5._friendlyError(
      'Arguments must be instances of p5.MatrixTensor.',
      'p5.MatrixTensor.mult'
    );
    return undefined;
  }
};

/**
 * Log a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> in the form of a table.
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
 * Initiate a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to an identity matrix. Needs to be a square matrix.
 * @method identity
 * @chainable
 * @example
 * <div><code>
 * let m1 = createMatrixTensor(5, 5);
 * m1.table();
 * m1.identity();
 * m1.table();
 * </code></div>
 */
p5.MatrixTensor.prototype.identity = function identity() {
  if (this.cols !== this.rows) {
    p5._friendlyError(
      'An identity matrix can only be initiated if rows are equal to columns (square matrix)',
      'p5.MatrixTensor.prototype.initiate'
    );
    return undefined;
  } else {
    for (let i = 0; i < this.rows; i++) {
      this.matrix[i][i] = 1;
    }
    return this;
  }
};

/**
 * Initiate a <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> to a certain value.
 * @method initiate
 * @param {Number} [value] the initiated value, 0 by default.
 * @chainable
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
 * Randomize all <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> values within a range.
 * @method randomize
 * @param {Number} [min] the minimum range value, 0 by default.
 * @param {Number} [max] the maximum range value, 1 by default.
 * @chainable
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
