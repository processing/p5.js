/**
 * @module Math
 * @submodule Vector
 * @requires constants
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 * A class to describe a two or three dimensional vector, specifically
 * a Euclidean (also known as geometric) vector. A vector is an entity
 * that has both magnitude and direction. The datatype, however, stores
 * the components of the vector (x, y for 2D, and x, y, z for 3D). The magnitude
 * and direction can be accessed via the methods <a href="#/p5.Vector/mag">mag()</a> and <a href="#/p5.Vector/heading">heading()</a>.
 *
 * In many of the p5.js examples, you will see <a href="#/p5.Vector">p5.Vector</a> used to describe a
 * position, velocity, or acceleration. For example, if you consider a rectangle
 * moving across the screen, at any given instant it has a position (a vector
 * that points from the origin to its location), a velocity (the rate at which
 * the object's position changes per time unit, expressed as a vector), and
 * acceleration (the rate at which the object's velocity changes per time
 * unit, expressed as a vector).
 *
 * Since vectors represent groupings of values, we cannot simply use
 * traditional addition/multiplication/etc. Instead, we'll need to do some
 * "vector" math, which is made easy by the methods inside the <a href="#/p5.Vector">p5.Vector</a> class.
 *
 * @class p5.Vector
 * @constructor
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 * @example
 * <div>
 * <code>
 * let v1 = createVector(40, 50);
 * let v2 = createVector(40, 50);
 *
 * ellipse(v1.x, v1.y, 50, 50);
 * ellipse(v2.x, v2.y, 50, 50);
 * v1.add(v2);
 * ellipse(v1.x, v1.y, 50, 50);
 * </code>
 * </div>
 *
 * @alt
 * 2 white ellipses. One center-left the other bottom right and off canvas
 */
p5.Vector = function Vector() {
  let x, y, z;
  // This is how it comes in with createVector()
  if (arguments[0] instanceof p5) {
    // save reference to p5 if passed in
    this.p5 = arguments[0];
    x = arguments[1][0] || 0;
    y = arguments[1][1] || 0;
    z = arguments[1][2] || 0;
    // This is what we'll get with new p5.Vector()
  } else {
    x = arguments[0] || 0;
    y = arguments[1] || 0;
    z = arguments[2] || 0;
  }
  /**
   * The x component of the vector
   * @property x {Number}
   */
  this.x = x;
  /**
   * The y component of the vector
   * @property y {Number}
   */
  this.y = y;
  /**
   * The z component of the vector
   * @property z {Number}
   */
  this.z = z;
};

/**
 * Returns a string representation of a vector v by calling String(v)
 * or v.toString(). This method is useful for logging vectors in the
 * console.
 * @method  toString
 * @return {String}
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   let v = createVector(20, 30);
 *   print(String(v)); // prints "p5.Vector Object : [20, 30, 0]"
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'black');
 *
 *   noStroke();
 *   text(v1.toString(), 10, 25, 90, 75);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.toString = function p5VectorToString() {
  return `p5.Vector Object : [${this.x}, ${this.y}, ${this.z}]`;
};

/**
 * Sets the x, y, and z component of the vector using two or three separate
 * variables, the data from a <a href="#/p5.Vector">p5.Vector</a>, or the values from a float array.
 * @method set
 * @param {Number} [x] the x component of the vector
 * @param {Number} [y] the y component of the vector
 * @param {Number} [z] the z component of the vector
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   let v = createVector(1, 2, 3);
 *   v.set(4, 5, 6); // Sets vector to [4, 5, 6]
 *
 *   let v1 = createVector(0, 0, 0);
 *   let arr = [1, 2, 3];
 *   v1.set(arr); // Sets vector to [1, 2, 3]
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let v0, v1;
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   v0 = createVector(0, 0);
 *   v1 = createVector(50, 50);
 * }
 *
 * function draw() {
 *   background(240);
 *
 *   drawArrow(v0, v1, 'black');
 *   v1.set(v1.x + random(-1, 1), v1.y + random(-1, 1));
 *
 *   noStroke();
 *   text('x: ' + round(v1.x) + ' y: ' + round(v1.y), 20, 90);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
/**
 * @method set
 * @param {p5.Vector|Number[]} value the vector to set
 * @chainable
 */
p5.Vector.prototype.set = function set(x, y, z) {
  if (x instanceof p5.Vector) {
    this.x = x.x || 0;
    this.y = x.y || 0;
    this.z = x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x = x[0] || 0;
    this.y = x[1] || 0;
    this.z = x[2] || 0;
    return this;
  }
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  return this;
};

/**
 * Gets a copy of the vector, returns a <a href="#/p5.Vector">p5.Vector</a> object.
 *
 * @method copy
 * @return {p5.Vector} the copy of the <a href="#/p5.Vector">p5.Vector</a> object
 * @example
 * <div class="norender">
 * <code>
 * let v1 = createVector(1, 2, 3);
 * let v2 = v1.copy();
 * print(v1.x === v2.x && v1.y === v2.y && v1.z === v2.z);
 * // Prints "true"
 * </code>
 * </div>
 */
p5.Vector.prototype.copy = function copy() {
  if (this.p5) {
    return new p5.Vector(this.p5, [this.x, this.y, this.z]);
  } else {
    return new p5.Vector(this.x, this.y, this.z);
  }
};

/**
 * Adds x, y, and z components to a vector, adds one vector to another, or
 * adds two independent vectors together. The version of the method that adds
 * two vectors together is a static method and returns a <a href="#/p5.Vector">p5.Vector</a>, the others
 * acts directly on the vector. Additionally, you may provide arguments to this function as an array.
 * See the examples for more context.
 *
 * @method add
 * @param  {Number} x   the x component of the vector to be added
 * @param  {Number} [y] the y component of the vector to be added
 * @param  {Number} [z] the z component of the vector to be added
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(1, 2, 3);
 * v.add(4, 5, 6);
 * // v's components are set to [5, 7, 9]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v = createVector(1, 2, 3);
 * // Provide arguments as an array
 * let arr = [4, 5, 6];
 * v.add(arr);
 * // v's components are set to [5, 7, 9]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(1, 2, 3);
 * let v2 = createVector(2, 3, 4);
 *
 * let v3 = p5.Vector.add(v1, v2);
 * // v3 has components [3, 5, 7]
 * print(v3);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // red vector + blue vector = purple vector
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'red');
 *
 *   let v2 = createVector(-30, 20);
 *   drawArrow(v1, v2, 'blue');
 *
 *   let v3 = p5.Vector.add(v1, v2);
 *   drawArrow(v0, v3, 'purple');
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
/**
 * @method add
 * @param  {p5.Vector|Number[]} value the vector to add
 * @chainable
 */
p5.Vector.prototype.add = function add(x, y, z) {
  if (x instanceof p5.Vector) {
    this.x += x.x || 0;
    this.y += x.y || 0;
    this.z += x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x += x[0] || 0;
    this.y += x[1] || 0;
    this.z += x[2] || 0;
    return this;
  }
  this.x += x || 0;
  this.y += y || 0;
  this.z += z || 0;
  return this;
};

/// HELPERS FOR REMAINDER METHOD
const calculateRemainder2D = function(xComponent, yComponent) {
  if (xComponent !== 0) {
    this.x = this.x % xComponent;
  }
  if (yComponent !== 0) {
    this.y = this.y % yComponent;
  }
  return this;
};

const calculateRemainder3D = function(xComponent, yComponent, zComponent) {
  if (xComponent !== 0) {
    this.x = this.x % xComponent;
  }
  if (yComponent !== 0) {
    this.y = this.y % yComponent;
  }
  if (zComponent !== 0) {
    this.z = this.z % zComponent;
  }
  return this;
};
/**
 * Gives remainder of a vector when it is divided by another vector.
 * See examples for more context.
 *
 * @method rem
 * @param {Number} x the x component of divisor vector
 * @param {Number} y the y component of divisor vector
 * @param {Number} z the z component of divisor vector
 * @chainable
 * @example
 * <div class='norender'>
 * <code>
 * let v = createVector(3, 4, 5);
 * v.rem(2, 3, 4);
 * // v's components are set to [1, 1, 1]
 * </code>
 * </div>
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(3, 4, 5);
 * let v2 = createVector(2, 3, 4);
 *
 * let v3 = p5.Vector.rem(v1, v2);
 * // v3 has components [1, 1, 1]
 * print(v3);
 * </code>
 * </div>
 */
/**
 * @method rem
 * @param {p5.Vector | Number[]}  value  divisor vector
 * @chainable
 */
p5.Vector.prototype.rem = function rem(x, y, z) {
  if (x instanceof p5.Vector) {
    if (Number.isFinite(x.x) && Number.isFinite(x.y) && Number.isFinite(x.z)) {
      const xComponent = parseFloat(x.x);
      const yComponent = parseFloat(x.y);
      const zComponent = parseFloat(x.z);
      calculateRemainder3D.call(this, xComponent, yComponent, zComponent);
    }
  } else if (x instanceof Array) {
    if (x.every(element => Number.isFinite(element))) {
      if (x.length === 2) {
        calculateRemainder2D.call(this, x[0], x[1]);
      }
      if (x.length === 3) {
        calculateRemainder3D.call(this, x[0], x[1], x[2]);
      }
    }
  } else if (arguments.length === 1) {
    if (Number.isFinite(arguments[0]) && arguments[0] !== 0) {
      this.x = this.x % arguments[0];
      this.y = this.y % arguments[0];
      this.z = this.z % arguments[0];
      return this;
    }
  } else if (arguments.length === 2) {
    const vectorComponents = [...arguments];
    if (vectorComponents.every(element => Number.isFinite(element))) {
      if (vectorComponents.length === 2) {
        calculateRemainder2D.call(
          this,
          vectorComponents[0],
          vectorComponents[1]
        );
      }
    }
  } else if (arguments.length === 3) {
    const vectorComponents = [...arguments];
    if (vectorComponents.every(element => Number.isFinite(element))) {
      if (vectorComponents.length === 3) {
        calculateRemainder3D.call(
          this,
          vectorComponents[0],
          vectorComponents[1],
          vectorComponents[2]
        );
      }
    }
  }
};

/**
 * Subtracts x, y, and z components from a vector, subtracts one vector from
 * another, or subtracts two independent vectors. The version of the method
 * that subtracts two vectors is a static method and returns a <a href="#/p5.Vector">p5.Vector</a>, the
 * other acts directly on the vector. Additionally, you may provide arguments to this function as an array.
 * See the examples for more context.
 *
 * @method sub
 * @param  {Number} x   the x component of the vector to subtract
 * @param  {Number} [y] the y component of the vector to subtract
 * @param  {Number} [z] the z component of the vector to subtract
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(4, 5, 6);
 * v.sub(1, 1, 1);
 * // v's components are set to [3, 4, 5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v = createVector(4, 5, 6);
 * // Provide arguments as an array
 * let arr = [1, 1, 1];
 * v.sub(arr);
 * // v's components are set to [3, 4, 5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(2, 3, 4);
 * let v2 = createVector(1, 2, 3);
 *
 * let v3 = p5.Vector.sub(v1, v2);
 * // v3 has components [1, 1, 1]
 * print(v3);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // red vector - blue vector = purple vector
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(70, 50);
 *   drawArrow(v0, v1, 'red');
 *
 *   let v2 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v2, 'blue');
 *
 *   let v3 = p5.Vector.sub(v1, v2);
 *   drawArrow(v2, v3, 'purple');
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
/**
 * @method sub
 * @param  {p5.Vector|Number[]} value the vector to subtract
 * @chainable
 */
p5.Vector.prototype.sub = function sub(x, y, z) {
  if (x instanceof p5.Vector) {
    this.x -= x.x || 0;
    this.y -= x.y || 0;
    this.z -= x.z || 0;
    return this;
  }
  if (x instanceof Array) {
    this.x -= x[0] || 0;
    this.y -= x[1] || 0;
    this.z -= x[2] || 0;
    return this;
  }
  this.x -= x || 0;
  this.y -= y || 0;
  this.z -= z || 0;
  return this;
};

/**
 * Multiplies the vector by a scalar, multiplies the x, y, and z components from a vector, or multiplies
 * the x, y, and z components of two independent vectors. When multiplying a vector by a scalar, the x, y,
 * and z components of the vector are all multiplied by the scalar. When multiplying a vector by a vector,
 * the x, y, z components of both vectors are multiplied by each other
 * (for example, with two vectors a and b: a.x * b.x, a.y * b.y, a.z * b.z). The static version of this method
 * creates a new <a href="#/p5.Vector">p5.Vector</a> while the non static version acts on the vector
 * directly. Additionally, you may provide arguments to this function as an array.
 * See the examples for more context.
 *
 * @method mult
 * @param  {Number} n The number to multiply with the vector
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(1, 2, 3);
 * v.mult(2);
 * // v's components are set to [2, 4, 6]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(1, 2, 3);
 * let v1 = createVector(2, 3, 4);
 * v0.mult(v1); // v0's components are set to [2, 6, 12]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(1, 2, 3);
 * // Provide arguments as an array
 * let arr = [2, 3, 4];
 * v0.mult(arr); // v0's components are set to [2, 6, 12]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(1, 2, 3);
 * let v1 = createVector(2, 3, 4);
 * const result = p5.Vector.mult(v0, v1);
 * print(result); // result's components are set to [2, 6, 12]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(1, 2, 3);
 * let v2 = p5.Vector.mult(v1, 2);
 * // v2 has components [2, 4, 6]
 * print(v2);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = createVector(25, -25);
 *   drawArrow(v0, v1, 'red');
 *
 *   let num = map(mouseX, 0, width, -2, 2, true);
 *   let v2 = p5.Vector.mult(v1, num);
 *   drawArrow(v0, v2, 'blue');
 *
 *   noStroke();
 *   text('multiplied by ' + num.toFixed(2), 5, 90);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */

/**
 * @method mult
 * @param  {Number} x The number to multiply with the x component of the vector
 * @param  {Number} y The number to multiply with the y component of the vector
 * @param  {Number} [z] The number to multiply with the z component of the vector
 * @chainable
 */

/**
 * @method mult
 * @param  {Number[]} arr The array to multiply with the components of the vector
 * @chainable
 */

/**
 * @method mult
 * @param  {p5.Vector} v The vector to multiply with the components of the original vector
 * @chainable
 */

p5.Vector.prototype.mult = function mult(x, y, z) {
  if (x instanceof p5.Vector) {
    // new p5.Vector will check that values are valid upon construction but it's possible
    // that someone could change the value of a component after creation, which is why we still
    // perform this check
    if (
      Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
    ) {
      this.x *= x.x;
      this.y *= x.y;
      this.z *= x.z;
    } else {
      console.warn(
        'p5.Vector.prototype.mult:',
        'x contains components that are either undefined or not finite numbers'
      );
    }
    return this;
  }
  if (x instanceof Array) {
    if (
      x.every(element => Number.isFinite(element)) &&
      x.every(element => typeof element === 'number')
    ) {
      if (x.length === 1) {
        this.x *= x[0];
        this.y *= x[0];
        this.z *= x[0];
      } else if (x.length === 2) {
        this.x *= x[0];
        this.y *= x[1];
      } else if (x.length === 3) {
        this.x *= x[0];
        this.y *= x[1];
        this.z *= x[2];
      }
    } else {
      console.warn(
        'p5.Vector.prototype.mult:',
        'x contains elements that are either undefined or not finite numbers'
      );
    }
    return this;
  }

  const vectorComponents = [...arguments];
  if (
    vectorComponents.every(element => Number.isFinite(element)) &&
    vectorComponents.every(element => typeof element === 'number')
  ) {
    if (arguments.length === 1) {
      this.x *= x;
      this.y *= x;
      this.z *= x;
    }
    if (arguments.length === 2) {
      this.x *= x;
      this.y *= y;
    }
    if (arguments.length === 3) {
      this.x *= x;
      this.y *= y;
      this.z *= z;
    }
  } else {
    console.warn(
      'p5.Vector.prototype.mult:',
      'x, y, or z arguments are either undefined or not a finite number'
    );
  }

  return this;
};

/**
 * Divides the vector by a scalar, divides a vector by the x, y, and z arguments, or divides the x, y, and
 * z components of two vectors against each other. When dividing a vector by a scalar, the x, y,
 * and z components of the vector are all divided by the scalar. When dividing a vector by a vector,
 * the x, y, z components of the source vector are treated as the dividend, and the x, y, z components
 * of the argument is treated as the divisor (for example with two vectors a and b: a.x / b.x, a.y / b.y, a.z / b.z).
 * The static version of this method creates a
 * new <a href="#/p5.Vector">p5.Vector</a> while the non static version acts on the vector directly.
 * Additionally, you may provide arguments to this function as an array.
 * See the examples for more context.
 *
 * @method div
 * @param  {number}    n The number to divide the vector by
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(6, 4, 2);
 * v.div(2); //v's components are set to [3, 2, 1]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(9, 4, 2);
 * let v1 = createVector(3, 2, 4);
 * v0.div(v1); // v0's components are set to [3, 2, 0.5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(9, 4, 2);
 * // Provide arguments as an array
 * let arr = [3, 2, 4];
 * v0.div(arr); // v0's components are set to [3, 2, 0.5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v0 = createVector(9, 4, 2);
 * let v1 = createVector(3, 2, 4);
 * let result = p5.Vector.div(v0, v1);
 * print(result); // result's components are set to [3, 2, 0.5]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(6, 4, 2);
 * let v2 = p5.Vector.div(v1, 2);
 * // v2 has components [3, 2, 1]
 * print(v2);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 100);
 *   let v1 = createVector(50, -50);
 *   drawArrow(v0, v1, 'red');
 *
 *   let num = map(mouseX, 0, width, 10, 0.5, true);
 *   let v2 = p5.Vector.div(v1, num);
 *   drawArrow(v0, v2, 'blue');
 *
 *   noStroke();
 *   text('divided by ' + num.toFixed(2), 10, 90);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */

/**
 * @method div
 * @param  {Number} x The number to divide with the x component of the vector
 * @param  {Number} y The number to divide with the y component of the vector
 * @param  {Number} [z] The number to divide with the z component of the vector
 * @chainable
 */

/**
 * @method div
 * @param  {Number[]} arr The array to divide the components of the vector by
 * @chainable
 */

/**
 * @method div
 * @param  {p5.Vector} v The vector to divide the components of the original vector by
 * @chainable
 */
p5.Vector.prototype.div = function div(x, y, z) {
  if (x instanceof p5.Vector) {
    // new p5.Vector will check that values are valid upon construction but it's possible
    // that someone could change the value of a component after creation, which is why we still
    // perform this check
    if (
      Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
    ) {
      if (x.x === 0 || x.y === 0 || x.z === 0) {
        console.warn('p5.Vector.prototype.div:', 'divide by 0');
        return this;
      }
      this.x /= x.x;
      this.y /= x.y;
      this.z /= x.z;
    } else {
      console.warn(
        'p5.Vector.prototype.div:',
        'x contains components that are either undefined or not finite numbers'
      );
    }
    return this;
  }
  if (x instanceof Array) {
    if (
      x.every(element => Number.isFinite(element)) &&
      x.every(element => typeof element === 'number')
    ) {
      if (x.some(element => element === 0)) {
        console.warn('p5.Vector.prototype.div:', 'divide by 0');
        return this;
      }

      if (x.length === 1) {
        this.x /= x[0];
        this.y /= x[0];
        this.z /= x[0];
      } else if (x.length === 2) {
        this.x /= x[0];
        this.y /= x[1];
      } else if (x.length === 3) {
        this.x /= x[0];
        this.y /= x[1];
        this.z /= x[2];
      }
    } else {
      console.warn(
        'p5.Vector.prototype.div:',
        'x contains components that are either undefined or not finite numbers'
      );
    }

    return this;
  }

  const vectorComponents = [...arguments];
  if (
    vectorComponents.every(element => Number.isFinite(element)) &&
    vectorComponents.every(element => typeof element === 'number')
  ) {
    if (vectorComponents.some(element => element === 0)) {
      console.warn('p5.Vector.prototype.div:', 'divide by 0');
      return this;
    }

    if (arguments.length === 1) {
      this.x /= x;
      this.y /= x;
      this.z /= x;
    }
    if (arguments.length === 2) {
      this.x /= x;
      this.y /= y;
    }
    if (arguments.length === 3) {
      this.x /= x;
      this.y /= y;
      this.z /= z;
    }
  } else {
    console.warn(
      'p5.Vector.prototype.div:',
      'x, y, or z arguments are either undefined or not a finite number'
    );
  }

  return this;
};
/**
 * Calculates the magnitude (length) of the vector and returns the result as
 * a float (this is simply the equation sqrt(x\*x + y\*y + z\*z).)
 *
 * @method mag
 * @return {Number} magnitude of the vector
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'black');
 *
 *   noStroke();
 *   text('vector length: ' + v1.mag().toFixed(2), 10, 70, 90, 30);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 * <div class="norender">
 * <code>
 * let v = createVector(20.0, 30.0, 40.0);
 * let m = v.mag();
 * print(m); // Prints "53.85164807134504"
 * </code>
 * </div>
 */
p5.Vector.prototype.mag = function mag() {
  return Math.sqrt(this.magSq());
};

/**
 * Calculates the squared magnitude of the vector and returns the result
 * as a float (this is simply the equation <em>(x\*x + y\*y + z\*z)</em>.)
 * Faster if the real length is not required in the
 * case of comparing vectors, etc.
 *
 * @method magSq
 * @return {number} squared magnitude of the vector
 * @example
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(6, 4, 2);
 * print(v1.magSq()); // Prints "56"
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'black');
 *
 *   noStroke();
 *   text('vector length squared: ' + v1.magSq().toFixed(2), 10, 45, 90, 55);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.magSq = function magSq() {
  const x = this.x;
  const y = this.y;
  const z = this.z;
  return x * x + y * y + z * z;
};

/**
 * Calculates the dot product of two vectors. The version of the method
 * that computes the dot product of two independent vectors is a static
 * method. See the examples for more context.
 *
 * @method dot
 * @param  {Number} x   x component of the vector
 * @param  {Number} [y] y component of the vector
 * @param  {Number} [z] z component of the vector
 * @return {Number}       the dot product
 *
 * @example
 * <div class="norender">
 * <code>
 * let v1 = createVector(1, 2, 3);
 * let v2 = createVector(2, 3, 4);
 *
 * print(v1.dot(v2)); // Prints "20"
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * //Static method
 * let v1 = createVector(1, 2, 3);
 * let v2 = createVector(3, 2, 1);
 * print(p5.Vector.dot(v1, v2)); // Prints "10"
 * </code>
 * </div>
 */
/**
 * @method dot
 * @param  {p5.Vector} value value component of the vector or a <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}
 */
p5.Vector.prototype.dot = function dot(x, y, z) {
  if (x instanceof p5.Vector) {
    return this.dot(x.x, x.y, x.z);
  }
  return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
};

/**
 * Calculates and returns a vector composed of the cross product between
 * two vectors. Both the static and non static methods return a new <a href="#/p5.Vector">p5.Vector</a>.
 * See the examples for more context.
 *
 * @method cross
 * @param  {p5.Vector} v <a href="#/p5.Vector">p5.Vector</a> to be crossed
 * @return {p5.Vector}   <a href="#/p5.Vector">p5.Vector</a> composed of cross product
 * @example
 * <div class="norender">
 * <code>
 * let v1 = createVector(1, 2, 3);
 * let v2 = createVector(1, 2, 3);
 *
 * let v = v1.cross(v2); // v's components are [0, 0, 0]
 * print(v);
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(1, 0, 0);
 * let v2 = createVector(0, 1, 0);
 *
 * let crossProduct = p5.Vector.cross(v1, v2);
 * // crossProduct has components [0, 0, 1]
 * print(crossProduct);
 * </code>
 * </div>
 */
p5.Vector.prototype.cross = function cross(v) {
  const x = this.y * v.z - this.z * v.y;
  const y = this.z * v.x - this.x * v.z;
  const z = this.x * v.y - this.y * v.x;
  if (this.p5) {
    return new p5.Vector(this.p5, [x, y, z]);
  } else {
    return new p5.Vector(x, y, z);
  }
};

/**
 * Calculates the Euclidean distance between two points (considering a
 * point as a vector object).
 *
 * @method dist
 * @param  {p5.Vector} v the x, y, and z coordinates of a <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}      the distance
 * @example
 * <div class="norender">
 * <code>
 * let v1 = createVector(1, 0, 0);
 * let v2 = createVector(0, 1, 0);
 *
 * let distance = v1.dist(v2); // distance is 1.4142...
 * print(distance);
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // Static method
 * let v1 = createVector(1, 0, 0);
 * let v2 = createVector(0, 1, 0);
 *
 * let distance = p5.Vector.dist(v1, v2);
 * // distance is 1.4142...
 * print(distance);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *
 *   let v1 = createVector(70, 50);
 *   drawArrow(v0, v1, 'red');
 *
 *   let v2 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v2, 'blue');
 *
 *   noStroke();
 *   text('distance between vectors: ' + v2.dist(v1).toFixed(2), 5, 50, 95, 50);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.dist = function dist(v) {
  return v
    .copy()
    .sub(this)
    .mag();
};

/**
 * Normalize the vector to length 1 (make it a unit vector).
 *
 * @method normalize
 * @return {p5.Vector} normalized <a href="#/p5.Vector">p5.Vector</a>
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(10, 20, 2);
 * // v has components [10.0, 20.0, 2.0]
 * v.normalize();
 * // v's components are set to
 * // [0.4454354, 0.8908708, 0.089087084]
 * </code>
 * </div>
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = createVector(mouseX - 50, mouseY - 50);
 *
 *   drawArrow(v0, v1, 'red');
 *   v1.normalize();
 *   drawArrow(v0, v1.mult(35), 'blue');
 *
 *   noFill();
 *   ellipse(50, 50, 35 * 2);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.normalize = function normalize() {
  const len = this.mag();
  // here we multiply by the reciprocal instead of calling 'div()'
  // since div duplicates this zero check.
  if (len !== 0) this.mult(1 / len);
  return this;
};

/**
 * Limit the magnitude of this vector to the value used for the <b>max</b>
 * parameter.
 *
 * @method limit
 * @param  {Number}    max the maximum magnitude for the vector
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(10, 20, 2);
 * // v has components [10.0, 20.0, 2.0]
 * v.limit(5);
 * // v's components are set to
 * // [2.2271771, 4.4543543, 0.4454354]
 * </code>
 * </div>
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = createVector(mouseX - 50, mouseY - 50);
 *
 *   drawArrow(v0, v1, 'red');
 *   drawArrow(v0, v1.limit(35), 'blue');
 *
 *   noFill();
 *   ellipse(50, 50, 35 * 2);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.limit = function limit(max) {
  const mSq = this.magSq();
  if (mSq > max * max) {
    this.div(Math.sqrt(mSq)) //normalize it
      .mult(max);
  }
  return this;
};

/**
 * Set the magnitude of this vector to the value used for the <b>len</b>
 * parameter.
 *
 * @method setMag
 * @param  {number}    len the new length for this vector
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(10, 20, 2);
 * // v has components [10.0, 20.0, 2.0]
 * v.setMag(10);
 * // v's components are set to [6.0, 8.0, 0.0]
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(50, 50);
 *
 *   drawArrow(v0, v1, 'red');
 *
 *   let length = map(mouseX, 0, width, 0, 141, true);
 *   v1.setMag(length);
 *   drawArrow(v0, v1, 'blue');
 *
 *   noStroke();
 *   text('magnitude set to: ' + length.toFixed(2), 10, 70, 90, 30);
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.setMag = function setMag(n) {
  return this.normalize().mult(n);
};

/**
 * Calculate the angle of rotation for this vector(only 2D vectors).
 * p5.Vectors created using <a src="#/p5/createVector">createVector()</a>
 * will take the current <a = src="#/p5/angleMode">angleMode</a> into consideration, and give the angle
 * in radians or degree accordingly.
 *
 * @method heading
 * @return {Number} the angle of rotation
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   let v1 = createVector(30, 50);
 *   print(v1.heading()); // 1.0303768265243125
 *
 *   v1 = createVector(40, 50);
 *   print(v1.heading()); // 0.8960553845713439
 *
 *   v1 = createVector(30, 70);
 *   print(v1.heading()); // 1.1659045405098132
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = createVector(mouseX - 50, mouseY - 50);
 *
 *   drawArrow(v0, v1, 'black');
 *
 *   let myHeading = v1.heading();
 *   noStroke();
 *   text(
 *     'vector heading: ' +
 *       myHeading.toFixed(2) +
 *       ' radians or ' +
 *       degrees(myHeading).toFixed(2) +
 *       ' degrees',
 *     10,
 *     50,
 *     90,
 *     50
 *   );
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.heading = function heading() {
  const h = Math.atan2(this.y, this.x);
  if (this.p5) return this.p5._fromRadians(h);
  return h;
};

/**
 * Rotate the vector by an angle (only 2D vectors), magnitude remains the
 * same
 *
 * @method rotate
 * @param  {number}    angle the angle of rotation
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(10.0, 20.0);
 * // v has components [10.0, 20.0, 0.0]
 * v.rotate(HALF_PI);
 * // v's components are set to [-20.0, 9.999999, 0.0]
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let angle = 0;
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = createVector(50, 0);
 *
 *   drawArrow(v0, v1.rotate(angle), 'black');
 *   angle += 0.01;
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.rotate = function rotate(a) {
  let newHeading = this.heading() + a;
  if (this.p5) newHeading = this.p5._toRadians(newHeading);
  const mag = this.mag();
  this.x = Math.cos(newHeading) * mag;
  this.y = Math.sin(newHeading) * mag;
  return this;
};

/**
 * Calculates and returns the angle (in radians) between two vectors.
 * @method angleBetween
 * @param  {p5.Vector}    value the x, y, and z components of a <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}       the angle between (in radians)
 * @example
 * <div class="norender">
 * <code>
 * let v1 = createVector(1, 0, 0);
 * let v2 = createVector(0, 1, 0);
 *
 * let angle = v1.angleBetween(v2);
 * // angle is PI/2
 * print(angle);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *   let v0 = createVector(50, 50);
 *
 *   let v1 = createVector(50, 0);
 *   drawArrow(v0, v1, 'red');
 *
 *   let v2 = createVector(mouseX - 50, mouseY - 50);
 *   drawArrow(v0, v2, 'blue');
 *
 *   let angleBetween = v1.angleBetween(v2);
 *   noStroke();
 *   text(
 *     'angle between: ' +
 *       angleBetween.toFixed(2) +
 *       ' radians or ' +
 *       degrees(angleBetween).toFixed(2) +
 *       ' degrees',
 *     10,
 *     50,
 *     90,
 *     50
 *   );
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */

p5.Vector.prototype.angleBetween = function angleBetween(v) {
  const dotmagmag = this.dot(v) / (this.mag() * v.mag());
  // Mathematically speaking: the dotmagmag variable will be between -1 and 1
  // inclusive. Practically though it could be slightly outside this range due
  // to floating-point rounding issues. This can make Math.acos return NaN.
  //
  // Solution: we'll clamp the value to the -1,1 range
  let angle;
  angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
  angle = angle * Math.sign(this.cross(v).z || 1);
  if (this.p5) {
    angle = this.p5._fromRadians(angle);
  }
  return angle;
};
/**
 * Linear interpolate the vector to another vector
 *
 * @method lerp
 * @param  {Number}    x   the x component
 * @param  {Number}    y   the y component
 * @param  {Number}    z   the z component
 * @param  {Number}    amt the amount of interpolation; some value between 0.0
 *                         (old vector) and 1.0 (new vector). 0.9 is very near
 *                         the new vector. 0.5 is halfway in between.
 * @chainable
 *
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(1, 1, 0);
 *
 * v.lerp(3, 3, 0, 0.5); // v now has components [2,2,0]
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v1 = createVector(0, 0, 0);
 * let v2 = createVector(100, 100, 0);
 *
 * let v3 = p5.Vector.lerp(v1, v2, 0.5);
 * // v3 has components [50,50,0]
 * print(v3);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let step = 0.01;
 * let amount = 0;
 *
 * function draw() {
 *   background(240);
 *   let v0 = createVector(0, 0);
 *
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'red');
 *
 *   let v2 = createVector(90, 90);
 *   drawArrow(v0, v2, 'blue');
 *
 *   if (amount > 1 || amount < 0) {
 *     step *= -1;
 *   }
 *   amount += step;
 *   let v3 = p5.Vector.lerp(v1, v2, amount);
 *
 *   drawArrow(v0, v3, 'purple');
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
/**
 * @method lerp
 * @param  {p5.Vector} v   the <a href="#/p5.Vector">p5.Vector</a> to lerp to
 * @param  {Number}    amt
 * @chainable
 */
p5.Vector.prototype.lerp = function lerp(x, y, z, amt) {
  if (x instanceof p5.Vector) {
    return this.lerp(x.x, x.y, x.z, y);
  }
  this.x += (x - this.x) * amt || 0;
  this.y += (y - this.y) * amt || 0;
  this.z += (z - this.z) * amt || 0;
  return this;
};

/**
 * Reflect the incoming vector about a normal to a line in 2D, or about a normal to a plane in 3D
 * This method acts on the vector directly
 *
 * @method reflect
 * @param  {p5.Vector} surfaceNormal   the <a href="#/p5.Vector">p5.Vector</a> to reflect about, will be normalized by this method
 * @chainable
 * @example
 * <div class="norender">
 * <code>
 * let v = createVector(4, 6); // incoming vector, this example vector is heading to the right and downward
 * let n = createVector(0, -1); // surface normal to a plane (this example normal points directly upwards)
 * v.reflect(n); // v is reflected about the surface normal n.  v's components are now set to [4, -6]
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(0, 0);
 *   let v1 = createVector(mouseX, mouseY);
 *   drawArrow(v0, v1, 'red');
 *
 *   let n = createVector(0, -30);
 *   drawArrow(v1, n, 'blue');
 *
 *   let r = v1.copy();
 *   r.reflect(n);
 *   drawArrow(v1, r, 'purple');
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.prototype.reflect = function reflect(surfaceNormal) {
  surfaceNormal.normalize();
  return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal)));
};

/**
 * Return a representation of this vector as a float array. This is only
 * for temporary use. If used in any other fashion, the contents should be
 * copied by using the <b>p5.Vector.<a href="#/p5.Vector/copy">copy()</a></b> method to copy into your own
 * array.
 *
 * @method array
 * @return {Number[]} an Array with the 3 values
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   let v = createVector(20, 30);
 *   print(v.array()); // Prints : Array [20, 30, 0]
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v = createVector(10.0, 20.0, 30.0);
 * let f = v.array();
 * print(f[0]); // Prints "10.0"
 * print(f[1]); // Prints "20.0"
 * print(f[2]); // Prints "30.0"
 * </code>
 * </div>
 */
p5.Vector.prototype.array = function array() {
  return [this.x || 0, this.y || 0, this.z || 0];
};

/**
 * Equality check against a <a href="#/p5.Vector">p5.Vector</a>
 *
 * @method equals
 * @param {Number} [x] the x component of the vector
 * @param {Number} [y] the y component of the vector
 * @param {Number} [z] the z component of the vector
 * @return {Boolean} whether the vectors are equals
 * @example
 * <div class = "norender">
 * <code>
 * let v1 = createVector(5, 10, 20);
 * let v2 = createVector(5, 10, 20);
 * let v3 = createVector(13, 10, 19);
 *
 * print(v1.equals(v2.x, v2.y, v2.z)); // true
 * print(v1.equals(v3.x, v3.y, v3.z)); // false
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * let v1 = createVector(10.0, 20.0, 30.0);
 * let v2 = createVector(10.0, 20.0, 30.0);
 * let v3 = createVector(0.0, 0.0, 0.0);
 * print(v1.equals(v2)); // true
 * print(v1.equals(v3)); // false
 * </code>
 * </div>
 */
/**
 * @method equals
 * @param {p5.Vector|Array} value the vector to compare
 * @return {Boolean}
 */
p5.Vector.prototype.equals = function equals(x, y, z) {
  let a, b, c;
  if (x instanceof p5.Vector) {
    a = x.x || 0;
    b = x.y || 0;
    c = x.z || 0;
  } else if (x instanceof Array) {
    a = x[0] || 0;
    b = x[1] || 0;
    c = x[2] || 0;
  } else {
    a = x || 0;
    b = y || 0;
    c = z || 0;
  }
  return this.x === a && this.y === b && this.z === c;
};

// Static Methods

/**
 * Make a new 2D vector from an angle
 *
 * @method fromAngle
 * @static
 * @param {Number}     angle the desired angle, in radians (unaffected by <a href="#/p5/angleMode">angleMode</a>)
 * @param {Number}     [length] the length of the new vector (defaults to 1)
 * @return {p5.Vector}       the new <a href="#/p5.Vector">p5.Vector</a> object
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Create a variable, proportional to the mouseX,
 *   // varying from 0-360, to represent an angle in degrees.
 *   let myDegrees = map(mouseX, 0, width, 0, 360);
 *
 *   // Display that variable in an onscreen text.
 *   // (Note the nfc() function to truncate additional decimal places,
 *   // and the "\xB0" character for the degree symbol.)
 *   let readout = 'angle = ' + nfc(myDegrees, 1) + '\xB0';
 *   noStroke();
 *   fill(0);
 *   text(readout, 5, 15);
 *
 *   // Create a p5.Vector using the fromAngle function,
 *   // and extract its x and y components.
 *   let v = p5.Vector.fromAngle(radians(myDegrees), 30);
 *   let vx = v.x;
 *   let vy = v.y;
 *
 *   push();
 *   translate(width / 2, height / 2);
 *   noFill();
 *   stroke(150);
 *   line(0, 0, 30, 0);
 *   stroke(0);
 *   line(0, 0, vx, vy);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.fromAngle = function fromAngle(angle, length) {
  if (typeof length === 'undefined') {
    length = 1;
  }
  return new p5.Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
};

/**
 * Make a new 3D vector from a pair of ISO spherical angles
 *
 * @method fromAngles
 * @static
 * @param {Number}     theta    the polar angle, in radians (zero is up)
 * @param {Number}     phi      the azimuthal angle, in radians
 *                               (zero is out of the screen)
 * @param {Number}     [length] the length of the new vector (defaults to 1)
 * @return {p5.Vector}          the new <a href="#/p5.Vector">p5.Vector</a> object
 * @example
 * <div modernizr='webgl'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   fill(255);
 *   noStroke();
 * }
 * function draw() {
 *   background(255);
 *
 *   let t = millis() / 1000;
 *
 *   // add three point lights
 *   pointLight(color('#f00'), p5.Vector.fromAngles(t * 1.0, t * 1.3, 100));
 *   pointLight(color('#0f0'), p5.Vector.fromAngles(t * 1.1, t * 1.2, 100));
 *   pointLight(color('#00f'), p5.Vector.fromAngles(t * 1.2, t * 1.1, 100));
 *
 *   sphere(35);
 * }
 * </code>
 * </div>
 */
p5.Vector.fromAngles = function(theta, phi, length) {
  if (typeof length === 'undefined') {
    length = 1;
  }
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  return new p5.Vector(
    length * sinTheta * sinPhi,
    -length * cosTheta,
    length * sinTheta * cosPhi
  );
};

/**
 * Make a new 2D unit vector from a random angle
 *
 * @method random2D
 * @static
 * @return {p5.Vector} the new <a href="#/p5.Vector">p5.Vector</a> object
 * @example
 * <div class="norender">
 * <code>
 * let v = p5.Vector.random2D();
 * // May make v's attributes something like:
 * // [0.61554617, -0.51195765, 0.0] or
 * // [-0.4695841, -0.14366731, 0.0] or
 * // [0.6091097, -0.22805278, 0.0]
 * print(v);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   frameRate(1);
 * }
 *
 * function draw() {
 *   background(240);
 *
 *   let v0 = createVector(50, 50);
 *   let v1 = p5.Vector.random2D();
 *   drawArrow(v0, v1.mult(50), 'black');
 * }
 *
 * // draw an arrow for a vector at a given base position
 * function drawArrow(base, vec, myColor) {
 *   push();
 *   stroke(myColor);
 *   strokeWeight(3);
 *   fill(myColor);
 *   translate(base.x, base.y);
 *   line(0, 0, vec.x, vec.y);
 *   rotate(vec.heading());
 *   let arrowSize = 7;
 *   translate(vec.mag() - arrowSize, 0);
 *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.Vector.random2D = function random2D() {
  return this.fromAngle(Math.random() * constants.TWO_PI);
};

/**
 * Make a new random 3D unit vector.
 *
 * @method random3D
 * @static
 * @return {p5.Vector} the new <a href="#/p5.Vector">p5.Vector</a> object
 * @example
 * <div class="norender">
 * <code>
 * let v = p5.Vector.random3D();
 * // May make v's attributes something like:
 * // [0.61554617, -0.51195765, 0.599168] or
 * // [-0.4695841, -0.14366731, -0.8711202] or
 * // [0.6091097, -0.22805278, -0.7595902]
 * print(v);
 * </code>
 * </div>
 */
p5.Vector.random3D = function random3D() {
  const angle = Math.random() * constants.TWO_PI;
  const vz = Math.random() * 2 - 1;
  const vzBase = Math.sqrt(1 - vz * vz);
  const vx = vzBase * Math.cos(angle);
  const vy = vzBase * Math.sin(angle);
  return new p5.Vector(vx, vy, vz);
};

// Adds two vectors together and returns a new one.
/**
 * @method add
 * @static
 * @param  {p5.Vector} v1 a <a href="#/p5.Vector">p5.Vector</a> to add
 * @param  {p5.Vector} v2 a <a href="#/p5.Vector">p5.Vector</a> to add
 * @param  {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector} the resulting <a href="#/p5.Vector">p5.Vector</a>
 */

p5.Vector.add = function add(v1, v2, target) {
  if (!target) {
    target = v1.copy();
    if (arguments.length === 3) {
      p5._friendlyError(
        'The target parameter is undefined, it should be of type p5.Vector',
        'p5.Vector.add'
      );
    }
  } else {
    target.set(v1);
  }
  target.add(v2);
  return target;
};

// Returns a vector remainder when it is divided by another vector
/**
 * @method rem
 * @static
 * @param  {p5.Vector} v1 dividend <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 divisor <a href="#/p5.Vector">p5.Vector</a>
 */
/**
 * @method rem
 * @static
 * @param  {p5.Vector} v1
 * @param  {p5.Vector} v2
 * @return {p5.Vector} the resulting <a href="#/p5.Vector">p5.Vector</a>
 */
p5.Vector.rem = function rem(v1, v2) {
  if (v1 instanceof p5.Vector && v2 instanceof p5.Vector) {
    let target = v1.copy();
    target.rem(v2);
    return target;
  }
};

/*
 * Subtracts one <a href="#/p5.Vector">p5.Vector</a> from another and returns a new one.  The second
 * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
 */
/**
 * @method sub
 * @static
 * @param  {p5.Vector} v1 a <a href="#/p5.Vector">p5.Vector</a> to subtract from
 * @param  {p5.Vector} v2 a <a href="#/p5.Vector">p5.Vector</a> to subtract
 * @param  {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector} the resulting <a href="#/p5.Vector">p5.Vector</a>
 */

p5.Vector.sub = function sub(v1, v2, target) {
  if (!target) {
    target = v1.copy();
    if (arguments.length === 3) {
      p5._friendlyError(
        'The target parameter is undefined, it should be of type p5.Vector',
        'p5.Vector.sub'
      );
    }
  } else {
    target.set(v1);
  }
  target.sub(v2);
  return target;
};

/**
 * Multiplies a vector by a scalar and returns a new vector.
 */

/**
 * @method mult
 * @static
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]
 * @return {p5.Vector} The resulting new <a href="#/p5.Vector">p5.Vector</a>
 */

/**
 * @method mult
 * @static
 * @param  {p5.Vector} v
 * @param  {Number}  n
 * @param  {p5.Vector} [target] the vector to receive the result (Optional)
 */

/**
 * @method mult
 * @static
 * @param  {p5.Vector} v0
 * @param  {p5.Vector} v1
 * @param  {p5.Vector} [target]
 */

/**
 * @method mult
 * @static
 * @param  {p5.Vector} v0
 * @param  {Number[]} arr
 * @param  {p5.Vector} [target]
 */
p5.Vector.mult = function mult(v, n, target) {
  if (!target) {
    target = v.copy();
    if (arguments.length === 3) {
      p5._friendlyError(
        'The target parameter is undefined, it should be of type p5.Vector',
        'p5.Vector.mult'
      );
    }
  } else {
    target.set(v);
  }
  target.mult(n);
  return target;
};

/**
 * Divides a vector by a scalar and returns a new vector.
 */

/**
 * @method div
 * @static
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]
 * @return {p5.Vector} The resulting new <a href="#/p5.Vector">p5.Vector</a>
 */

/**
 * @method div
 * @static
 * @param  {p5.Vector} v
 * @param  {Number}  n
 * @param  {p5.Vector} [target] the vector to receive the result (Optional)
 */

/**
 * @method div
 * @static
 * @param  {p5.Vector} v0
 * @param  {p5.Vector} v1
 * @param  {p5.Vector} [target]
 */

/**
 * @method div
 * @static
 * @param  {p5.Vector} v0
 * @param  {Number[]} arr
 * @param  {p5.Vector} [target]
 */
p5.Vector.div = function div(v, n, target) {
  if (!target) {
    target = v.copy();

    if (arguments.length === 3) {
      p5._friendlyError(
        'The target parameter is undefined, it should be of type p5.Vector',
        'p5.Vector.div'
      );
    }
  } else {
    target.set(v);
  }
  target.div(n);
  return target;
};

/**
 * Calculates the dot product of two vectors.
 */
/**
 * @method dot
 * @static
 * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     the dot product
 */
p5.Vector.dot = function dot(v1, v2) {
  return v1.dot(v2);
};

/**
 * Calculates the cross product of two vectors.
 */
/**
 * @method cross
 * @static
 * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     the cross product
 */
p5.Vector.cross = function cross(v1, v2) {
  return v1.cross(v2);
};

/**
 * Calculates the Euclidean distance between two points (considering a
 * point as a vector object).
 */
/**
 * @method dist
 * @static
 * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     the distance
 */
p5.Vector.dist = function dist(v1, v2) {
  return v1.dist(v2);
};

/**
 * Linear interpolate a vector to another vector and return the result as a
 * new vector.
 */
/**
 * @method lerp
 * @static
 * @param {p5.Vector} v1
 * @param {p5.Vector} v2
 * @param {Number} amt
 * @param {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector}      the lerped value
 */
p5.Vector.lerp = function lerp(v1, v2, amt, target) {
  if (!target) {
    target = v1.copy();
    if (arguments.length === 4) {
      p5._friendlyError(
        'The target parameter is undefined, it should be of type p5.Vector',
        'p5.Vector.lerp'
      );
    }
  } else {
    target.set(v1);
  }
  target.lerp(v2, amt);
  return target;
};

/**
 * @method mag
 * @param {p5.Vector} vecT the vector to return the magnitude of
 * @return {Number}        the magnitude of vecT
 * @static
 */
p5.Vector.mag = function mag(vecT) {
  const x = vecT.x,
    y = vecT.y,
    z = vecT.z;
  const magSq = x * x + y * y + z * z;
  return Math.sqrt(magSq);
};

export default p5.Vector;
