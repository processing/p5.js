/**
 * @module Math
 * @submodule Vector
 * @requires constants
 */

import * as constants from '../core/constants';

function vector(p5, fn){
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
   * A class to describe a two or three-dimensional vector. A vector is like an
   * arrow pointing in space. Vectors have both magnitude (length) and
   * direction.
   *
   * `p5.Vector` objects are often used to program motion because they simplify
   * the math. For example, a moving ball has a position and a velocity.
   * Position describes where the ball is in space. The ball's position vector
   * extends from the origin to the ball's center. Velocity describes the ball's
   * speed and the direction it's moving. If the ball is moving straight up, its
   * velocity vector points straight up. Adding the ball's velocity vector to
   * its position vector moves it, as in `pos.add(vel)`. Vector math relies on
   * methods inside the `p5.Vector` class.
   *
   * @class p5.Vector
   * @param {Number} [x] x component of the vector.
   * @param {Number} [y] y component of the vector.
   * @param {Number} [z] z component of the vector.
   * @example
   * <div>
   * <code>
   * let p1 = createVector(25, 25);
   * let p2 = createVector(75, 75);
   *
   * strokeWeight(5);
   * point(p1);
   * point(p2.x, p2.y);
   *
   * describe('Two black dots on a gray square, one at the top left and the other at the bottom right.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let pos;
   * let vel;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   pos = createVector(width / 2, height);
   *   vel = createVector(0, -1);
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   pos.add(vel);
   *
   *   if (pos.y < 0) {
   *     pos.y = height;
   *   }
   *
   *   strokeWeight(5);
   *   point(pos);
   *
   *   describe('A black dot moves from bottom to top on a gray square. The dot reappears at the bottom when it reaches the top.');
   * }
   * </code>
   * </div>
   */
  p5.Vector = class Vector {
    // This is how it comes in with createVector()
    // This check if the first argument is a function
    constructor(...args) {
      let x, y, z;
      if (typeof args[0] === 'function') {
        this.isPInst = true;
        this._fromRadians = args[0];
        this._toRadians = args[1];
        x = args[2] || 0;
        y = args[3] || 0;
        z = args[4] || 0;
        // This is what we'll get with new p5.Vector()
      } else {
        x = args[0] || 0;
        y = args[1] || 0;
        z = args[2] || 0;
      }
      this.x = x;
      this.y = y;
      this.z = z;
    }

    /**
   * Returns a string representation of a vector. This method is useful for
   * printing vectors to the console while debugging.
   * @return {String} string representation of the vector.
   * @example
   * <div class = "norender">
   * <code>
   * function setup() {
   *   let v = createVector(20, 30);
   *   // Prints 'p5.Vector Object : [20, 30, 0]'.
   *   print(v.toString());
   * }
   * </code>
   * </div>
   */
    toString() {
      return `p5.Vector Object : [${this.x}, ${this.y}, ${this.z}]`;
    }

    /**
   * Sets the `x`, `y`, and `z` components of the vector using separate numbers,
   * a <a href="#/p5.Vector">p5.Vector</a> object, or an array of numbers.
   * Calling `set()` with no arguments sets the vector's components to 0.
   *
   * @param {Number} [x] x component of the vector.
   * @param {Number} [y] y component of the vector.
   * @param {Number} [z] z component of the vector.
   * @chainable
   * @example
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * // Top left.
   * let pos = createVector(25, 25);
   * point(pos);
   *
   * // Top right.
   * pos.set(75, 25);
   * point(pos);
   *
   * // Bottom right.
   * let p2 = createVector(75, 75);
   * pos.set(p2);
   * point(pos);
   *
   * // Bottom left.
   * let arr = [25, 75];
   * pos.set(arr);
   * point(pos);
   *
   * describe('Four black dots arranged in a square on a gray background.');
   * </code>
   * </div>
   */
    /**
   * @param {p5.Vector|Number[]} value vector to set.
   * @chainable
   */
    set (x, y, z) {
      if (x instanceof p5.Vector) {
        this.x = x.x || 0;
        this.y = x.y || 0;
        this.z = x.z || 0;
        return this;
      }
      if (Array.isArray(x)) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
        this.z = x[2] || 0;
        return this;
      }
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      return this;
    }

    /**
   * Returns a copy of the <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * @return {p5.Vector} copy of the <a href="#/p5.Vector">p5.Vector</a> object.
   * @example
   * <div>
   * <code>
   * let pos = createVector(50, 50);
   * let pc = pos.copy();
   *
   * strokeWeight(5);
   * point(pc);
   *
   * describe('A black point drawn in the middle of a gray square.');
   * </code>
   * </div>
   */
    copy () {
      if (this.isPInst) {
        return new p5.Vector(
          this._fromRadians,
          this._toRadians,
          this.x,
          this.y,
          this.z
        );
      } else {
        return new p5.Vector(this.x, this.y, this.z);
      }
    }

    /**
   * Adds to a vector's `x`, `y`, and `z` components using separate numbers,
   * another <a href="#/p5.Vector">p5.Vector</a> object, or an array of numbers.
   * Calling `add()` with no arguments has no effect.
   *
   * The static version of `add()`, as in `p5.Vector.add(v2, v1)`, returns a new
   * <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * originals.
   *
   * @param  {Number} x   x component of the vector to be added.
   * @param  {Number} [y] y component of the vector to be added.
   * @param  {Number} [z] z component of the vector to be added.
   * @chainable
   * @example
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * // Top left.
   * let pos = createVector(25, 25);
   * point(pos);
   *
   * // Top right.
   * pos.add(50, 0);
   * point(pos);
   *
   * // Bottom right.
   * let p2 = createVector(0, 50);
   * pos.add(p2);
   * point(pos);
   *
   * // Bottom left.
   * let arr = [-50, 0];
   * pos.add(arr);
   * point(pos);
   *
   * describe('Four black dots arranged in a square on a gray background.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Top left.
   * let p1 = createVector(25, 25);
   *
   * // Center.
   * let p2 = createVector(50, 50);
   *
   * // Bottom right.
   * let p3 = p5.Vector.add(p1, p2);
   *
   * strokeWeight(5);
   * point(p1);
   * point(p2);
   * point(p3);
   *
   * describe('Three black dots in a diagonal line from top left to bottom right.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v1 = createVector(50, 50);
   *   drawArrow(origin, v1, 'red');
   *
   *   let v2 = createVector(-30, 20);
   *   drawArrow(v1, v2, 'blue');
   *
   *   let v3 = p5.Vector.add(v1, v2);
   *   drawArrow(origin, v3, 'purple');
   *
   *   describe('Three arrows drawn on a gray square. A red arrow extends from the top left corner to the center. A blue arrow extends from the tip of the red arrow. A purple arrow extends from the origin to the tip of the blue arrow.');
   * }
   *
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
   * @param  {p5.Vector|Number[]} value The vector to add
   * @chainable
   */
    add (x, y, z) {
      if (x instanceof p5.Vector) {
        this.x += x.x || 0;
        this.y += x.y || 0;
        this.z += x.z || 0;
        return this;
      }
      if (Array.isArray(x)) {
        this.x += x[0] || 0;
        this.y += x[1] || 0;
        this.z += x[2] || 0;
        return this;
      }
      this.x += x || 0;
      this.y += y || 0;
      this.z += z || 0;
      return this;
    }

    /**
   * Performs modulo (remainder) division with a vector's `x`, `y`, and `z`
   * components using separate numbers, another
   * <a href="#/p5.Vector">p5.Vector</a> object, or an array of numbers.
   *
   * The static version of `rem()` as in `p5.Vector.rem(v2, v1)`, returns a new
   * <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * originals.
   *
   * @param {Number} x x component of divisor vector.
   * @param {Number} y y component of divisor vector.
   * @param {Number} z z component of divisor vector.
   * @chainable
   * @example
   * <div class='norender'>
   * <code>
   * let v = createVector(3, 4, 5);
   * v.rem(2, 3, 4);
   * // Prints 'p5.Vector Object : [1, 1, 1]'.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * let v1 = createVector(3, 4, 5);
   * let v2 = createVector(2, 3, 4);
   * v1.rem(v2);
   *
   * // Prints 'p5.Vector Object : [1, 1, 1]'.
   * print(v1.toString());
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * let v = createVector(3, 4, 5);
   * let arr = [2, 3, 4];
   * v.rem(arr);
   *
   * // Prints 'p5.Vector Object : [1, 1, 1]'.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v1 = createVector(3, 4, 5);
   * let v2 = createVector(2, 3, 4);
   * let v3 = p5.Vector.rem(v1, v2);
   *
   * // Prints 'p5.Vector Object : [1, 1, 1]'.
   * print(v3.toString());
   * </code>
   * </div>
   */
    /**
   * @param {p5.Vector | Number[]}  value  divisor vector.
   * @chainable
   */
    rem (x, y, z) {
      if (x instanceof p5.Vector) {
        if ([x.x,x.y,x.z].every(Number.isFinite)) {
          const xComponent = parseFloat(x.x);
          const yComponent = parseFloat(x.y);
          const zComponent = parseFloat(x.z);
          return calculateRemainder3D.call(
            this,
            xComponent,
            yComponent,
            zComponent
          );
        }
      } else if (Array.isArray(x)) {
        if (x.every(element => Number.isFinite(element))) {
          if (x.length === 2) {
            return calculateRemainder2D.call(this, x[0], x[1]);
          }
          if (x.length === 3) {
            return calculateRemainder3D.call(this, x[0], x[1], x[2]);
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
            return calculateRemainder2D.call(
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
            return calculateRemainder3D.call(
              this,
              vectorComponents[0],
              vectorComponents[1],
              vectorComponents[2]
            );
          }
        }
      }
    }

    /**
   * Subtracts from a vector's `x`, `y`, and `z` components using separate
   * numbers, another <a href="#/p5.Vector">p5.Vector</a> object, or an array of
   * numbers. Calling `sub()` with no arguments has no effect.
   *
   * The static version of `sub()`, as in `p5.Vector.sub(v2, v1)`, returns a new
   * <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * originals.
   *
   * @param  {Number} x   x component of the vector to subtract.
   * @param  {Number} [y] y component of the vector to subtract.
   * @param  {Number} [z] z component of the vector to subtract.
   * @chainable
   * @example
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * // Bottom right.
   * let pos = createVector(75, 75);
   * point(pos);
   *
   * // Top right.
   * pos.sub(0, 50);
   * point(pos);
   *
   * // Top left.
   * let p2 = createVector(50, 0);
   * pos.sub(p2);
   * point(pos);
   *
   * // Bottom left.
   * let arr = [0, -50];
   * pos.sub(arr);
   * point(pos);
   *
   * describe('Four black dots arranged in a square on a gray background.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Bottom right.
   * let p1 = createVector(75, 75);
   *
   * // Center.
   * let p2 = createVector(50, 50);
   *
   * // Top left.
   * let p3 = p5.Vector.sub(p1, p2);
   *
   * strokeWeight(5);
   * point(p1);
   * point(p2);
   * point(p3);
   *
   * describe('Three black dots in a diagonal line from top left to bottom right.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v1 = createVector(50, 50);
   *   drawArrow(origin, v1, 'red');
   *
   *   let v2 = createVector(20, 70);
   *   drawArrow(origin, v2, 'blue');
   *
   *   let v3 = p5.Vector.sub(v2, v1);
   *   drawArrow(v1, v3, 'purple');
   *
   *   describe('Three arrows drawn on a gray square. A red and a blue arrow extend from the top left. A purple arrow extends from the tip of the red arrow to the tip of the blue arrow.');
   * }
   *
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
   * @param  {p5.Vector|Number[]} value the vector to subtract
   * @chainable
   */
    sub(x, y, z) {
      if (x instanceof p5.Vector) {
        this.x -= x.x || 0;
        this.y -= x.y || 0;
        this.z -= x.z || 0;
        return this;
      }
      if (Array.isArray(x)) {
        this.x -= x[0] || 0;
        this.y -= x[1] || 0;
        this.z -= x[2] || 0;
        return this;
      }
      this.x -= x || 0;
      this.y -= y || 0;
      this.z -= z || 0;
      return this;
    }

    /**
   * Multiplies a vector's `x`, `y`, and `z` components by the same number,
   * separate numbers, the components of another
   * <a href="#/p5.Vector">p5.Vector</a> object, or an array of numbers. Calling
   * `mult()` with no arguments has no effect.
   *
   * The static version of `mult()`, as in `p5.Vector.mult(v, 2)`, returns a new
   * <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * originals.
   *
   * @param  {Number} n The number to multiply with the vector
   * @chainable
   * @example
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(25, 25);
   * point(p);
   *
   * p.mult(2);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(25, 25);
   * point(p);
   *
   * p.mult(2, 3);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(25, 25);
   * point(p);
   *
   * let arr = [2, 3];
   * p.mult(arr);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(25, 25);
   * point(p);
   *
   * let p2 = createVector(2, 3);
   * p.mult(p2);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(25, 25);
   * point(p);
   *
   * let p2 = createVector(2, 3);
   * let p3 = p5.Vector.mult(p, p2);
   * point(p3);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v1 = createVector(25, 25);
   *   drawArrow(origin, v1, 'red');
   *
   *   let v2 = p5.Vector.mult(v1, 2);
   *   drawArrow(origin, v2, 'blue');
   *
   *   describe('Two arrows extending from the top left corner. The blue arrow is twice the length of the red arrow.');
   * }
   *
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
   * @param  {Number} x number to multiply with the x component of the vector.
   * @param  {Number} y number to multiply with the y component of the vector.
   * @param  {Number} [z] number to multiply with the z component of the vector.
   * @chainable
   */

    /**
   * @param  {Number[]} arr array to multiply with the components of the vector.
   * @chainable
   */

    /**
   * @param  {p5.Vector} v vector to multiply with the components of the original vector.
   * @chainable
   */

    mult(x, y, z) {
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
      if (Array.isArray(x)) {
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
    }

    /**
   * Divides a vector's `x`, `y`, and `z` components by the same number,
   * separate numbers, the components of another
   * <a href="#/p5.Vector">p5.Vector</a> object, or an array of numbers. Calling
   * `div()` with no arguments has no effect.
   *
   * The static version of `div()`, as in `p5.Vector.div(v, 2)`, returns a new
   * <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * originals.
   *
   * @param  {number}    n The number to divide the vector by
   * @chainable
   * @example
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(50, 50);
   * point(p);
   *
   * p.div(2);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(50, 75);
   * point(p);
   *
   * p.div(2, 3);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(50, 75);
   * point(p);
   *
   * let arr = [2, 3];
   * p.div(arr);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(50, 75);
   * point(p);
   *
   * let p2 = createVector(2, 3);
   * p.div(p2);
   * point(p);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * strokeWeight(5);
   *
   * let p = createVector(50, 75);
   * point(p);
   *
   * let p2 = createVector(2, 3);
   * let p3 = p5.Vector.div(p, p2);
   * point(p3);
   *
   * describe('Two black dots drawn on a gray square. One dot is in the top left corner and the other is in the bottom center.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v1 = createVector(50, 50);
   *   drawArrow(origin, v1, 'red');
   *
   *   let v2 = p5.Vector.div(v1, 2);
   *   drawArrow(origin, v2, 'blue');
   *
   *   describe('Two arrows extending from the top left corner. The blue arrow is half the length of the red arrow.');
   * }
   *
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
   * @param  {Number} x number to divide with the x component of the vector.
   * @param  {Number} y number to divide with the y component of the vector.
   * @param  {Number} [z] number to divide with the z component of the vector.
   * @chainable
   */

    /**
   * @param  {Number[]} arr array to divide the components of the vector by.
   * @chainable
   */

    /**
   * @param  {p5.Vector} v vector to divide the components of the original vector by.
   * @chainable
   */
    div(x, y, z) {
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
          const isLikely2D = x.z === 0 && this.z === 0;
          if (x.x === 0 || x.y === 0 || (!isLikely2D && x.z === 0)) {
            console.warn('p5.Vector.prototype.div:', 'divide by 0');
            return this;
          }
          this.x /= x.x;
          this.y /= x.y;
          if (!isLikely2D) {
            this.z /= x.z;
          }
        } else {
          console.warn(
            'p5.Vector.prototype.div:',
            'x contains components that are either undefined or not finite numbers'
          );
        }
        return this;
      }
      if (Array.isArray(x)) {
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
    }
    /**
   * Returns the magnitude (length) of the vector.
   *
   * @return {Number} magnitude of the vector.
   * @example
   * <div>
   * <code>
   * let p = createVector(30, 40);
   * line(0, 0, p.x, p.y);
   *
   * let m = p.mag();
   * text(m, p.x, p.y);
   *
   * describe('A diagonal black line extends from the top left corner of a gray square. The number 50 is written at the end of the line.');
   * </code>
   * </div>
   */
    mag() {
      return Math.sqrt(this.magSq());
    }

    /**
   * Returns the magnitude (length) of the vector squared.
   *
   * @return {number} squared magnitude of the vector.
   * @example
   * <div>
   * <code>
   * let p = createVector(30, 40);
   * line(0, 0, p.x, p.y);
   *
   * let m = p.magSq();
   * text(m, p.x, p.y);
   *
   * describe('A diagonal black line extends from the top left corner of a gray square. The number 2500 is written at the end of the line.');
   * </code>
   * </div>
   */
    magSq() {
      const x = this.x;
      const y = this.y;
      const z = this.z;
      return x * x + y * y + z * z;
    }

    /**
   * Returns the dot product of two vectors. The dot product is a number that
   * describes the overlap between two vectors. Visually, the dot product can be
   * thought of as the "shadow" one vector casts on another. The dot product's
   * magnitude is largest when two vectors point in the same or opposite
   * directions. Its magnitude is 0 when two vectors form a right angle.
   *
   * The version of `dot()` with one parameter interprets it as another
   * <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * The version of `dot()` with multiple parameters interprets them as the
   * `x`, `y`, and `z` components of another vector.
   *
   * The static version of `dot()`, as in `p5.Vector.dot(v1, v2)`, is the same
   * as calling `v1.dot(v2)`.
   *
   * @param  {Number} x   x component of the vector.
   * @param  {Number} [y] y component of the vector.
   * @param  {Number} [z] z component of the vector.
   * @return {Number}     dot product.
   *
   * @example
   * <div class="norender">
   * <code>
   * let v1 = createVector(3, 4);
   * let v2 = createVector(3, 0);
   * let dp = v1.dot(v2);
   * // Prints "9" to the console.
   * print(dp);
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v1 = createVector(1, 0);
   * let v2 = createVector(0, 1);
   * let dp = p5.Vector.dot(v1, v2);
   * // Prints "0" to the console.
   * print(dp);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(width / 2, height / 2);
   *   let v1 = createVector(30, 0);
   *   drawArrow(v0, v1, 'black');
   *
   *   let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
   *   drawArrow(v0, v2, 'red');
   *
   *   let dp = v2.dot(v1);
   *   text(`v2 • v1 = ${dp}`, 15, 20);
   *
   *   describe('Two arrows drawn on a gray square. A black arrow points to the right and a red arrow follows the mouse. The text "v1 • v2 = something" changes as the mouse moves.');
   * }
   *
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
   * @param  {p5.Vector} v <a href="#/p5.Vector">p5.Vector</a> to be dotted.
   * @return {Number}
   */
    dot(x, y, z) {
      if (x instanceof p5.Vector) {
        return this.dot(x.x, x.y, x.z);
      }
      return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }

    /**
   * Returns the cross product of two vectors. The cross product is a vector
   * that points straight out of the plane created by two vectors. The cross
   * product's magnitude is the area of the parallelogram formed by the original
   * two vectors.
   *
   * The static version of `cross()`, as in `p5.Vector.cross(v1, v2)`, is the same
   * as calling `v1.cross(v2)`.
   *
   * @param  {p5.Vector} v <a href="#/p5.Vector">p5.Vector</a> to be crossed.
   * @return {p5.Vector}   cross product as a <a href="#/p5.Vector">p5.Vector</a>.
   * @example
   * <div class="norender">
   * <code>
   * let v1 = createVector(1, 0);
   * let v2 = createVector(3, 4);
   * let cp = v1.cross(v2);
   * // Prints "p5.Vector Object : [0, 0, 4]" to the console.
   * print(cp.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v1 = createVector(1, 0);
   * let v2 = createVector(3, 4);
   * let cp = p5.Vector.cross(v1, v2);
   * // Prints "p5.Vector Object : [0, 0, 4]" to the console.
   * print(cp.toString());
   * </code>
   * </div>
   */
    cross(v) {
      const x = this.y * v.z - this.z * v.y;
      const y = this.z * v.x - this.x * v.z;
      const z = this.x * v.y - this.y * v.x;
      if (this.isPInst) {
        return new p5.Vector(this._fromRadians, this._toRadians, x, y, z);
      } else {
        return new p5.Vector(x, y, z);
      }
    }

    /**
   * Returns the distance between two points represented by vectors. A point's
   * coordinates can be thought of as a vector's components.
   *
   * The static version of `dist()`, as in `p5.Vector.dist(v1, v2)`, is the same
   * as calling `v1.dist(v2)`.
   *
   * Use <a href="#/p5/dist">dist()</a> to calculate the distance between points
   * using coordinates as in `dist(x1, y1, x2, y2)`.
   *
   * @param  {p5.Vector} v x, y, and z coordinates of a <a href="#/p5.Vector">p5.Vector</a>.
   * @return {Number}      distance.
   * @example
   * <div class="norender">
   * <code>
   * let v1 = createVector(1, 0);
   * let v2 = createVector(0, 1);
   * let d = v1.dist(v2);
   * // Prints "1.414..." to the console.
   * print(d);
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v1 = createVector(1, 0);
   * let v2 = createVector(0, 1);
   * let d = p5.Vector.dist(v1, v2);
   * // Prints "1.414..." to the console.
   * print(d);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v1 = createVector(50, 50);
   *   drawArrow(origin, v1, 'red');
   *
   *   let v2 = createVector(20, 70);
   *   drawArrow(origin, v2, 'blue');
   *
   *   let v3 = p5.Vector.sub(v2, v1);
   *   drawArrow(v1, v3, 'purple');
   *
   *   let m = floor(v3.mag());
   *   text(m, 50, 75);
   *
   *   describe('Three arrows drawn on a gray square. A red and a blue arrow extend from the top left. A purple arrow extends from the tip of the red arrow to the tip of the blue arrow. The number 36 is written in black near the purple arrow.');
   * }
   *
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
    dist(v) {
      return v
        .copy()
        .sub(this)
        .mag();
    }

    /**
   * Scales the components of a <a href="#/p5.Vector">p5.Vector</a> object so
   * that its magnitude is 1.
   *
   * The static version of `normalize()`,  as in `p5.Vector.normalize(v)`,
   * returns a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change
   * the original.
   *
   * @return {p5.Vector} normalized <a href="#/p5.Vector">p5.Vector</a>.
   * @example
   * <div class="norender">
   * <code>
   * let v = createVector(10, 20, 2);
   * v.normalize();
   * // Prints "p5.Vector Object : [0.445..., 0.890..., 0.089...]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(10, 20, 2);
   * let v1 = p5.Vector.normalize(v0);
   * // Prints "p5.Vector Object : [10, 20, 2]" to the console.
   * print(v0.toString());
   * // Prints "p5.Vector Object : [0.445..., 0.890..., 0.089...]" to the console.
   * print(v1.toString());
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
   *   let r = 25;
   *   drawArrow(v0, v1, 'red');
   *   v1.normalize();
   *   drawArrow(v0, v1.mult(r), 'blue');
   *
   *   noFill();
   *   circle(50, 50, r * 2);
   *
   *   describe("A red and blue arrow extend from the center of a circle. Both arrows follow the mouse, but the blue arrow's length is fixed to the circle's radius.");
   * }
   *
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
    normalize() {
      const len = this.mag();
      // here we multiply by the reciprocal instead of calling 'div()'
      // since div duplicates this zero check.
      if (len !== 0) this.mult(1 / len);
      return this;
    }

    /**
   * Limits a vector's magnitude to a maximum value.
   *
   * The static version of `limit()`, as in `p5.Vector.limit(v, 5)`, returns a
   * new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * original.
   *
   * @param  {Number}    max maximum magnitude for the vector.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let v = createVector(10, 20, 2);
   * v.limit(5);
   * // Prints "p5.Vector Object : [2.227..., 4.454..., 0.445...]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(10, 20, 2);
   * let v1 = p5.Vector.limit(v0, 5);
   * // Prints "p5.Vector Object : [2.227..., 4.454..., 0.445...]" to the console.
   * print(v1.toString());
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
   *   let r = 25;
   *   drawArrow(v0, v1, 'red');
   *   drawArrow(v0, v1.limit(r), 'blue');
   *
   *   noFill();
   *   circle(50, 50, r * 2);
   *
   *   describe("A red and blue arrow extend from the center of a circle. Both arrows follow the mouse, but the blue arrow never crosses the circle's edge.");
   * }
   *
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
    limit(max) {
      const mSq = this.magSq();
      if (mSq > max * max) {
        this.div(Math.sqrt(mSq)) //normalize it
          .mult(max);
      }
      return this;
    }

    /**
   * Sets a vector's magnitude to a given value.
   *
   * The static version of `setMag()`, as in `p5.Vector.setMag(v, 10)`, returns
   * a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change the
   * original.
   *
   * @param  {number}    len new length for this vector.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let v = createVector(3, 4, 0);
   * // Prints "5" to the console.
   * print(v.mag());
   *
   * v.setMag(10);
   * // Prints "p5.Vector Object : [6, 8, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(3, 4, 0);
   * let v1 = p5.Vector.setMag(v0, 10);
   * // Prints "5" to the console.
   * print(v0.mag());
   * // Prints "p5.Vector Object : [6, 8, 0]" to the console.
   * print(v1.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(240);
   *
   *   let origin = createVector(0, 0);
   *   let v = createVector(50, 50);
   *
   *   drawArrow(origin, v, 'red');
   *
   *   v.setMag(30);
   *   drawArrow(origin, v, 'blue');
   *
   *   describe('Two arrows extend from the top left corner of a square toward its center. The red arrow reaches the center and the blue arrow only extends part of the way.');
   * }
   *
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
    setMag(n) {
      return this.normalize().mult(n);
    }

    /**
   * Calculates the angle a 2D vector makes with the positive x-axis. Angles
   * increase in the clockwise direction.
   *
   * If the vector was created with
   * <a href="#/p5/createVector">createVector()</a>, `heading()` returns angles
   * in the units of the current <a href="#/p5/angleMode">angleMode()</a>.
   *
   * The static version of `heading()`, as in `p5.Vector.heading(v)`, works the
   * same way.
   *
   * @return {Number} angle of rotation.
   * @example
   * <div class = "norender">
   * <code>
   * let v = createVector(1, 1);
   * // Prints "0.785..." to the console.
   * print(v.heading());
   *
   * angleMode(DEGREES);
   * // Prints "45" to the console.
   * print(v.heading());
   * </code>
   * </div>
   *
   * <div class = "norender">
   * <code>
   * let v = createVector(1, 1);
   * // Prints "0.785..." to the console.
   * print(p5.Vector.heading(v));
   *
   * angleMode(DEGREES);
   * // Prints "45" to the console.
   * print(p5.Vector.heading(v));
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let origin = createVector(0, 0);
   *   let v = createVector(50, 50);
   *
   *   drawArrow(origin, v, 'black');
   *
   *   angleMode(RADIANS);
   *   let h = round(v.heading(), 2);
   *   text(`Radians: ${h}`, 20, 70);
   *   angleMode(DEGREES);
   *   h = v.heading();
   *   text(`Degrees: ${h}`, 20, 85);
   *
   *   describe('A black arrow extends from the top left of a square to its center. The text "Radians: 0.79" and "Degrees: 45" is written near the tip of the arrow.');
   * }
   *
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
    heading() {
      const h = Math.atan2(this.y, this.x);
      if (this.isPInst) return this._fromRadians(h);
      return h;
    }

    /**
   * Rotates a 2D vector to a specific angle without changing its magnitude.
   * By convention, the positive x-axis has an angle of 0. Angles increase in
   * the clockwise direction.
   *
   * If the vector was created with
   * <a href="#/p5/createVector">createVector()</a>, `setHeading()` uses
   * the units of the current <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @param  {number}    angle angle of rotation.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let v = createVector(0, 1);
   * // Prints "1.570..." to the console.
   * print(v.heading());
   *
   * v.setHeading(PI);
   * // Prints "3.141..." to the console.
   * print(v.heading());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * angleMode(DEGREES);
   * let v = createVector(0, 1);
   * // Prints "90" to the console.
   * print(v.heading());
   *
   * v.setHeading(180);
   * // Prints "180" to the console.
   * print(v.heading());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = createVector(30, 0);
   *
   *   drawArrow(v0, v1, 'red');
   *
   *   v1.setHeading(HALF_PI);
   *   drawArrow(v0, v1, 'blue');
   *
   *   describe('Two arrows extend from the center of a gray square. The red arrow points to the right and the blue arrow points down.');
   * }
   *
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

    setHeading(a) {
      if (this.isPInst) a = this._toRadians(a);
      let m = this.mag();
      this.x = m * Math.cos(a);
      this.y = m * Math.sin(a);
      return this;
    }

    /**
   * Rotates a 2D vector by an angle without changing its magnitude.
   * By convention, the positive x-axis has an angle of 0. Angles increase in
   * the clockwise direction.
   *
   * If the vector was created with
   * <a href="#/p5/createVector">createVector()</a>, `rotate()` uses
   * the units of the current <a href="#/p5/angleMode">angleMode()</a>.
   *
   * The static version of `rotate()`, as in `p5.Vector.rotate(v, PI)`,
   * returns a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change
   * the original.
   *
   * @param  {number}    angle angle of rotation.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let v = createVector(1, 0);
   * // Prints "p5.Vector Object : [1, 0, 0]" to the console.
   * print(v.toString());
   * v.rotate(HALF_PI);
   * // Prints "p5.Vector Object : [0, 1, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * angleMode(DEGREES);
   * let v = createVector(1, 0);
   * // Prints "p5.Vector Object : [1, 0, 0]" to the console.
   * print(v.toString());
   * v.rotate(90);
   * // Prints "p5.Vector Object : [0, 1, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(1, 0);
   * let v1 = p5.Vector.rotate(v0, HALF_PI);
   * // Prints "p5.Vector Object : [1, 0, 0]" to the console.
   * print(v0.toString());
   * // Prints "p5.Vector Object : [0, 1, 0]" to the console.
   * print(v1.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * angleMode(DEGREES);
   * let v0 = createVector(1, 0);
   * let v1 = p5.Vector.rotate(v0, 90);
   * // Prints "p5.Vector Object : [1, 0, 0]" to the console.
   * print(v0.toString());
   * // Prints "p5.Vector Object : [0, 1, 0]" to the console.
   * print(v1.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let v0;
   * let v1;
   *
   * function setup() {
   *   v0 = createVector(50, 50);
   *   v1 = createVector(30, 0);
   * }
   *
   * function draw() {
   *   background(240);
   *
   *   v1.rotate(0.01);
   *
   *   drawArrow(v0, v1, 'black');
   *
   *   describe('A black arrow extends from the center of a gray square. The arrow rotates counterclockwise.');
   * }
   *
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
    rotate(a) {
      let newHeading = this.heading() + a;
      if (this.isPInst) newHeading = this._toRadians(newHeading);
      const mag = this.mag();
      this.x = Math.cos(newHeading) * mag;
      this.y = Math.sin(newHeading) * mag;
      return this;
    }

    /**
   * Returns the angle between two vectors. The angles returned are signed,
   * which means that `v1.angleBetween(v2) === -v2.angleBetween(v1)`.
   *
   * If the vector was created with
   * <a href="#/p5/createVector">createVector()</a>, `angleBetween()` returns
   * angles in the units of the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @param  {p5.Vector}    value x, y, and z components of a <a href="#/p5.Vector">p5.Vector</a>.
   * @return {Number}       angle between the vectors.
   * @example
   * <div class="norender">
   * <code>
   * let v0 = createVector(1, 0);
   * let v1 = createVector(0, 1);
   * // Prints "1.570..." to the console.
   * print(v0.angleBetween(v1));
   * // Prints "-1.570..." to the console.
   * print(v1.angleBetween(v0));
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * angleMode(DEGREES);
   * let v0 = createVector(1, 0);
   * let v1 = createVector(0, 1);
   * // Prints "90" to the console.
   * print(v0.angleBetween(v1));
   * // Prints "-90" to the console.
   * print(v1.angleBetween(v0));
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(1, 0);
   * let v1 = createVector(0, 1);
   * // Prints "1.570..." to the console.
   * print(p5.Vector.angleBetween(v0, v1));
   * // Prints "-1.570..." to the console.
   * print(p5.Vector.angleBetween(v1, v0));
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * angleMode(DEGREES);
   * let v0 = createVector(1, 0);
   * let v1 = createVector(0, 1);
   * // Prints "90" to the console.
   * print(p5.Vector.angleBetween(v0, v1));
   * // Prints "-90" to the console.
   * print(p5.Vector.angleBetween(v1, v0));
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = createVector(30, 0);
   *   let v2 = createVector(0, 30);
   *
   *   drawArrow(v0, v1, 'red');
   *   drawArrow(v0, v2, 'blue');
   *
   *   angleMode(RADIANS);
   *   let angle = round(v1.angleBetween(v2), 2);
   *   text(`Radians: ${angle}`, 20, 20);
   *   angleMode(DEGREES);
   *   angle = round(v1.angleBetween(v2), 2);
   *   text(`Degrees: ${angle}`, 20, 35);
   *
   *   describe('Two arrows extend from the center of a gray square. A red arrow points to the right and a blue arrow points down. The text "Radians: 1.57" and "Degrees: 90" is written above the arrows.');
   * }
   *
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
    angleBetween(v) {
      const magSqMult = this.magSq() * v.magSq();
      // Returns NaN if either vector is the zero vector.
      if (magSqMult === 0) {
        return NaN;
      }
      const u = this.cross(v);
      // The dot product computes the cos value, and the cross product computes
      // the sin value. Find the angle based on them. In addition, in the case of
      // 2D vectors, a sign is added according to the direction of the vector.
      let angle = Math.atan2(u.mag(), this.dot(v)) * Math.sign(u.z || 1);
      if (this.isPInst) {
        angle = this._fromRadians(angle);
      }
      return angle;
    }

    /**
   * Calculates new `x`, `y`, and `z` components that are proportionally the
   * same distance between two vectors. The `amt` parameter is the amount to
   * interpolate between the old vector and the new vector. 0.0 keeps all
   * components equal to the old vector's, 0.5 is halfway between, and 1.0 sets
   * all components equal to the new vector's.
   *
   * The static version of `lerp()`, as in `p5.Vector.lerp(v0, v1, 0.5)`,
   * returns a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change
   * the original.
   *
   * @param  {Number}    x   x component.
   * @param  {Number}    y   y component.
   * @param  {Number}    z   z component.
   * @param  {Number}    amt amount of interpolation between 0.0 (old vector)
   *                         and 1.0 (new vector). 0.5 is halfway between.
   * @chainable
   *
   * @example
   * <div class="norender">
   * <code>
   * let v0 = createVector(1, 1, 1);
   * let v1 = createVector(3, 3, 3);
   * v0.lerp(v1, 0.5);
   * // Prints "p5.Vector Object : [2, 2, 2]" to the console.
   * print(v0.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v = createVector(1, 1, 1);
   * v.lerp(3, 3, 3, 0.5);
   * // Prints "p5.Vector Object : [2, 2, 2]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(1, 1, 1);
   * let v1 = createVector(3, 3, 3);
   * let v2 = p5.Vector.lerp(v0, v1, 0.5);
   * // Prints "p5.Vector Object : [2, 2, 2]" to the console.
   * print(v2.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = createVector(30, 0);
   *   let v2 = createVector(0, 30);
   *   let v3 = p5.Vector.lerp(v1, v2, 0.5);
   *
   *   drawArrow(v0, v1, 'red');
   *   drawArrow(v0, v2, 'blue');
   *   drawArrow(v0, v3, 'purple');
   *
   *   describe('Three arrows extend from the center of a gray square. A red arrow points to the right, a blue arrow points down, and a purple arrow points to the bottom right.');
   * }
   *
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
   * @param  {p5.Vector} v  <a href="#/p5.Vector">p5.Vector</a> to lerp toward.
   * @param  {Number}    amt
   * @chainable
   */
    lerp(x, y, z, amt) {
      if (x instanceof p5.Vector) {
        return this.lerp(x.x, x.y, x.z, y);
      }
      this.x += (x - this.x) * amt || 0;
      this.y += (y - this.y) * amt || 0;
      this.z += (z - this.z) * amt || 0;
      return this;
    }

    /**
   * Calculates a new heading and magnitude that are between two vectors. The
   * `amt` parameter is the amount to interpolate between the old vector and
   * the new vector. 0.0 keeps the heading and magnitude equal to the old
   * vector's, 0.5 sets them halfway between, and 1.0 sets the heading and
   * magnitude equal to the new vector's.
   *
   * `slerp()` differs from <a href="#/p5.Vector/lerp">lerp()</a> because
   * it interpolates magnitude. Calling `v0.slerp(v1, 0.5)` sets `v0`'s
   * magnitude to a value halfway between its original magnitude and `v1`'s.
   * Calling `v0.lerp(v1, 0.5)` makes no such guarantee.
   *
   * The static version of `slerp()`, as in `p5.Vector.slerp(v0, v1, 0.5)`,
   * returns a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change
   * the original.
   *
   * @param {p5.Vector} v <a href="#/p5.Vector">p5.Vector</a> to slerp toward.
   * @param {Number} amt  amount of interpolation between 0.0 (old vector)
   *                      and 1.0 (new vector). 0.5 is halfway between.
   * @return {p5.Vector}
   *
   * @example
   * <div class="norender">
   * <code>
   * let v0 = createVector(3, 0);
   * // Prints "3" to the console.
   * print(v0.mag());
   * // Prints "0" to the console.
   * print(v0.heading());
   *
   * let v1 = createVector(0, 1);
   * // Prints "1" to the console.
   * print(v1.mag());
   * // Prints "1.570..." to the console.
   * print(v1.heading());
   *
   * v0.slerp(v1, 0.5);
   * // Prints "2" to the console.
   * print(v0.mag());
   * // Prints "0.785..." to the console.
   * print(v0.heading());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(3, 0);
   * // Prints "3" to the console.
   * print(v0.mag());
   * // Prints "0" to the console.
   * print(v0.heading());
   *
   * let v1 = createVector(0, 1);
   * // Prints "1" to the console.
   * print(v1.mag());
   * // Prints "1.570..." to the console.
   * print(v1.heading());
   *
   * let v3 = p5.Vector.slerp(v0, v1, 0.5);
   * // Prints "2" to the console.
   * print(v3.mag());
   * // Prints "0.785..." to the console.
   * print(v3.heading());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = createVector(20, 0);
   *   let v2 = createVector(-40, 0);
   *   let v3 = p5.Vector.slerp(v1, v2, 0.5);
   *
   *   drawArrow(v0, v1, 'red');
   *   drawArrow(v0, v2, 'blue');
   *   drawArrow(v0, v3, 'purple');
   *
   *   describe('Three arrows extend from the center of a gray square. A red arrow points to the right, a blue arrow points to the left, and a purple arrow points down.');
   * }
   *
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
    slerp(v, amt) {
      // edge cases.
      if (amt === 0) { return this; }
      if (amt === 1) { return this.set(v); }

      // calculate magnitudes
      const selfMag = this.mag();
      const vMag = v.mag();
      const magmag = selfMag * vMag;
      // if either is a zero vector, linearly interpolate by these vectors
      if (magmag === 0) {
        this.mult(1 - amt).add(v.x * amt, v.y * amt, v.z * amt);
        return this;
      }
      // the cross product of 'this' and 'v' is the axis of rotation
      const axis = this.cross(v);
      const axisMag = axis.mag();
      // Calculates the angle between 'this' and 'v'
      const theta = Math.atan2(axisMag, this.dot(v));

      // However, if the norm of axis is 0, normalization cannot be performed,
      // so we will divide the cases
      if (axisMag > 0) {
        axis.x /= axisMag;
        axis.y /= axisMag;
        axis.z /= axisMag;
      } else if (theta < Math.PI * 0.5) {
        // if the norm is 0 and the angle is less than PI/2,
        // the angle is very close to 0, so do linear interpolation.
        this.mult(1 - amt).add(v.x * amt, v.y * amt, v.z * amt);
        return this;
      } else {
        // If the norm is 0 and the angle is more than PI/2, the angle is
        // very close to PI.
        // In this case v can be regarded as '-this', so take any vector
        // that is orthogonal to 'this' and use that as the axis.
        if (this.z === 0 && v.z === 0) {
          // if both this and v are 2D vectors, use (0,0,1)
          // this makes the result also a 2D vector.
          axis.set(0, 0, 1);
        } else if (this.x !== 0) {
          // if the x components is not 0, use (y, -x, 0)
          axis.set(this.y, -this.x, 0).normalize();
        } else {
          // if the x components is 0, use (1,0,0)
          axis.set(1, 0, 0);
        }
      }

      // Since 'axis' is a unit vector, ey is a vector of the same length as 'this'.
      const ey = axis.cross(this);
      // interpolate the length with 'this' and 'v'.
      const lerpedMagFactor = (1 - amt) + amt * vMag / selfMag;
      // imagine a situation where 'axis', 'this', and 'ey' are pointing
      // along the z, x, and y axes, respectively.
      // rotates 'this' around 'axis' by amt * theta towards 'ey'.
      const cosMultiplier = lerpedMagFactor * Math.cos(amt * theta);
      const sinMultiplier = lerpedMagFactor * Math.sin(amt * theta);
      // then, calculate 'result'.
      this.x = this.x * cosMultiplier + ey.x * sinMultiplier;
      this.y = this.y * cosMultiplier + ey.y * sinMultiplier;
      this.z = this.z * cosMultiplier + ey.z * sinMultiplier;

      return this;
    }

    /**
   * Reflects a vector about a line in 2D or a plane in 3D. The orientation of
   * the line or plane is described by a normal vector that points away from the
   * shape.
   *
   * The static version of `reflect()`, as in `p5.Vector.reflect(v, n)`,
   * returns a new <a href="#/p5.Vector">p5.Vector</a> object and doesn't change
   * the original.
   *
   * @param  {p5.Vector} surfaceNormal  <a href="#/p5.Vector">p5.Vector</a>
   *                                    to reflect about.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let n = createVector(0, 1);
   * let v = createVector(4, 6);
   * v.reflect(n);
   * // Prints "p5.Vector Object : [4, -6, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let n = createVector(0, 1);
   * let v0 = createVector(4, 6);
   * let v1 = p5.Vector.reflect(v0, n);
   * // Prints "p5.Vector Object : [4, -6, 0]" to the console.
   * print(v1.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   line(50, 0, 50, 100);
   *   let n = createVector(1, 0);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = createVector(30, 40);
   *   let v2 = p5.Vector.reflect(v1, n);
   *
   *   n.setMag(30);
   *   drawArrow(v0, n, 'black');
   *   drawArrow(v0, v1, 'red');
   *   drawArrow(v0, v2, 'blue');
   *
   *   describe('Three arrows extend from the center of a gray square with a vertical line down its middle. A black arrow points to the right, a blue arrow points to the bottom left, and a red arrow points to the bottom right.');
   * }
   *
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
    reflect(surfaceNormal) {
      surfaceNormal.normalize();
      return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal)));
    }

    /**
   * Returns the vector's components as an array of numbers.
   *
   * @return {Number[]} array with the vector's components.
   * @example
   * <div class = "norender">
   * <code>
   * let v = createVector(20, 30);
   * // Prints "[20, 30, 0]" to the console.
   * print(v.array());
   * </code>
   * </div>
   */
    array() {
      return [this.x || 0, this.y || 0, this.z || 0];
    }

    /**
   * Returns `true` if the vector's components are all the same as another
   * vector's and `false` if not.
   *
   * The version of `equals()` with one parameter interprets it as another
   * <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * The version of `equals()` with multiple parameters interprets them as the
   * components of another vector. Any missing parameters are assigned the value
   * 0.
   *
   * The static version of `equals()`, as in `p5.Vector.equals(v0, v1)`,
   * interprets both parameters as <a href="#/p5.Vector">p5.Vector</a> objects.
   *
   * @param {Number} [x] x component of the vector.
   * @param {Number} [y] y component of the vector.
   * @param {Number} [z] z component of the vector.
   * @return {Boolean} whether the vectors are equal.
   * @example
   * <div class="norender">
   * <code>
   * let v0 = createVector(10, 20, 30);
   * let v1 = createVector(10, 20, 30);
   * let v2 = createVector(0, 0, 0);
   *
   * // Prints "true" to the console.
   * print(v0.equals(v1));
   * // Prints "false" to the console.
   * print(v0.equals(v2));
   * </code>
   * </div>
   *
   * <div class = "norender">
   * <code>
   * let v0 = createVector(5, 10, 20);
   * let v1 = createVector(5, 10, 20);
   * let v2 = createVector(13, 10, 19);
   *
   * // Prints "true" to the console.
   * print(v0.equals(v1.x, v1.y, v1.z));
   * // Prints "false" to the console.
   * print(v0.equals(v2.x, v2.y, v2.z));
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * let v0 = createVector(10, 20, 30);
   * let v1 = createVector(10, 20, 30);
   * let v2 = createVector(0, 0, 0);
   *
   * // Prints "true" to the console.
   * print(p5.Vector.equals(v0, v1));
   * // Prints "false" to the console.
   * print(p5.Vector.equals(v0, v2));
   * </code>
   * </div>
   */
    /**
   * @param {p5.Vector|Array} value vector to compare.
   * @return {Boolean}
   */
    equals(x, y, z) {
      let a, b, c;
      if (x instanceof p5.Vector) {
        a = x.x || 0;
        b = x.y || 0;
        c = x.z || 0;
      } else if (Array.isArray(x)) {
        a = x[0] || 0;
        b = x[1] || 0;
        c = x[2] || 0;
      } else {
        a = x || 0;
        b = y || 0;
        c = z || 0;
      }
      return this.x === a && this.y === b && this.z === c;
    }

    // Static Methods

    /**
   * Make a new 2D vector from an angle.
   *
   * @static
   * @param {Number}     angle desired angle, in radians. Unaffected by <a href="#/p5/angleMode">angleMode()</a>.
   * @param {Number}     [length] length of the new vector (defaults to 1).
   * @return {p5.Vector}       new <a href="#/p5.Vector">p5.Vector</a> object.
   * @example
   * <div class="norender">
   * <code>
   * let v = p5.Vector.fromAngle(0);
   * // Prints "p5.Vector Object : [1, 0, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = p5.Vector.fromAngle(0, 30);
   *
   *   drawArrow(v0, v1, 'black');
   *
   *   describe('A black arrow extends from the center of a gray square. It points to the right.');
   * }
   *
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
    static fromAngle(angle, length) {
      if (typeof length === 'undefined') {
        length = 1;
      }
      return new p5.Vector(
        length * Math.cos(angle),
        length * Math.sin(angle),
        0
      );
    }

    /**
   * Make a new 3D vector from a pair of ISO spherical angles.
   *
   * @static
   * @param {Number}     theta    polar angle in radians (zero is up).
   * @param {Number}     phi      azimuthal angle in radians
   *                               (zero is out of the screen).
   * @param {Number}     [length] length of the new vector (defaults to 1).
   * @return {p5.Vector}          new <a href="#/p5.Vector">p5.Vector</a> object.
   * @example
   * <div class="norender">
   * <code>
   * let v = p5.Vector.fromAngles(0, 0);
   * // Prints "p5.Vector Object : [0, -1, 0]" to the console.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   fill(255);
   *   noStroke();
   *
   *   let theta = frameCount *  0.05;
   *   let phi = 0;
   *   let v = p5.Vector.fromAngles(theta, phi, 100);
   *   let c = color('deeppink');
   *   pointLight(c, v);
   *
   *   sphere(35);
   *
   *   describe('A light shines on a pink sphere as it orbits.');
   * }
   * </code>
   * </div>
   */
    static fromAngles(theta, phi, length) {
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
    }

    /**
   * Make a new 2D unit vector with a random heading.
   *
   * @static
   * @return {p5.Vector} new <a href="#/p5.Vector">p5.Vector</a> object.
   * @example
   * <div class="norender">
   * <code>
   * let v = p5.Vector.random2D();
   * // Prints "p5.Vector Object : [x, y, 0]" to the console
   * // where x and y are small random numbers.
   * print(v.toString());
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   frameRate(1);
   *
   *   let v0 = createVector(50, 50);
   *   let v1 = p5.Vector.random2D();
   *   v1.mult(30);
   *   drawArrow(v0, v1, 'black');
   *
   *   describe('A black arrow in extends from the center of a gray square. It changes direction once per second.');
   * }
   *
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
    static random2D() {
      return this.fromAngle(Math.random() * constants.TWO_PI);
    }

    /**
   * Make a new 3D unit vector with a random heading.
   *
   * @static
   * @return {p5.Vector} new <a href="#/p5.Vector">p5.Vector</a> object.
   * @example
   * <div class="norender">
   * <code>
   * let v = p5.Vector.random3D();
   * // Prints "p5.Vector Object : [x, y, z]" to the console
   * // where x, y, and z are small random numbers.
   * print(v.toString());
   * </code>
   * </div>
   */
    static random3D() {
      const angle = Math.random() * constants.TWO_PI;
      const vz = Math.random() * 2 - 1;
      const vzBase = Math.sqrt(1 - vz * vz);
      const vx = vzBase * Math.cos(angle);
      const vy = vzBase * Math.sin(angle);
      return new p5.Vector(vx, vy, vz);
    }

    // Returns a copy of a vector.
    /**
   * @static
   * @param  {p5.Vector} v the <a href="#/p5.Vector">p5.Vector</a> to create a copy of
   * @return {p5.Vector} the copy of the <a href="#/p5.Vector">p5.Vector</a> object
   */

    static copy(v) {
      return v.copy(v);
    }

    // Adds two vectors together and returns a new one.
    /**
   * @static
   * @param  {p5.Vector} v1 A <a href="#/p5.Vector">p5.Vector</a> to add
   * @param  {p5.Vector} v2 A <a href="#/p5.Vector">p5.Vector</a> to add
   * @param  {p5.Vector} [target] vector to receive the result.
   * @return {p5.Vector} resulting <a href="#/p5.Vector">p5.Vector</a>.
   */

    static add(v1, v2, target) {
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
    }

    // Returns a vector remainder when it is divided by another vector
    /**
   * @static
   * @param  {p5.Vector} v1 The dividend <a href="#/p5.Vector">p5.Vector</a>
   * @param  {p5.Vector} v2 The divisor <a href="#/p5.Vector">p5.Vector</a>
   */
    /**
   * @static
   * @param  {p5.Vector} v1
   * @param  {p5.Vector} v2
   * @return {p5.Vector} The resulting <a href="#/p5.Vector">p5.Vector</a>
   */
    static rem(v1, v2) {
      if (v1 instanceof p5.Vector && v2 instanceof p5.Vector) {
        let target = v1.copy();
        target.rem(v2);
        return target;
      }
    }

    /*
   * Subtracts one <a href="#/p5.Vector">p5.Vector</a> from another and returns a new one.  The second
   * vector (`v2`) is subtracted from the first (`v1`), resulting in `v1-v2`.
   */
    /**
   * @static
   * @param  {p5.Vector} v1 A <a href="#/p5.Vector">p5.Vector</a> to subtract from
   * @param  {p5.Vector} v2 A <a href="#/p5.Vector">p5.Vector</a> to subtract
   * @param  {p5.Vector} [target] vector to receive the result.
   * @return {p5.Vector} The resulting <a href="#/p5.Vector">p5.Vector</a>
   */

    static sub(v1, v2, target) {
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
    }

    /**
   * Multiplies a vector by a scalar and returns a new vector.
   */

    /**
   * @static
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} [z]
   * @return {p5.Vector} resulting new <a href="#/p5.Vector">p5.Vector</a>.
   */

    /**
   * @static
   * @param  {p5.Vector} v
   * @param  {Number}  n
   * @param  {p5.Vector} [target] vector to receive the result.
   */

    /**
   * @static
   * @param  {p5.Vector} v0
   * @param  {p5.Vector} v1
   * @param  {p5.Vector} [target]
   */

    /**
   * @static
   * @param  {p5.Vector} v0
   * @param  {Number[]} arr
   * @param  {p5.Vector} [target]
   */
    static mult(v, n, target) {
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
    }

    /**
   * Rotates the vector (only 2D vectors) by the given angle; magnitude remains the same. Returns a new vector.
   */

    /**
   * @static
   * @param  {p5.Vector} v
   * @param  {Number} angle
   * @param  {p5.Vector} [target] The vector to receive the result
   */
    static rotate(v, a, target) {
      if (arguments.length === 2) {
        target = v.copy();
      } else {
        if (!(target instanceof p5.Vector)) {
          p5._friendlyError(
            'The target parameter should be of type p5.Vector',
            'p5.Vector.rotate'
          );
        }
        target.set(v);
      }
      target.rotate(a);
      return target;
    }

    /**
   * Divides a vector by a scalar and returns a new vector.
   */

    /**
   * @static
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} [z]
   * @return {p5.Vector} The resulting new <a href="#/p5.Vector">p5.Vector</a>
   */

    /**
   * @static
   * @param  {p5.Vector} v
   * @param  {Number}  n
   * @param  {p5.Vector} [target] The vector to receive the result
   */

    /**
   * @static
   * @param  {p5.Vector} v0
   * @param  {p5.Vector} v1
   * @param  {p5.Vector} [target]
   */

    /**
   * @static
   * @param  {p5.Vector} v0
   * @param  {Number[]} arr
   * @param  {p5.Vector} [target]
   */
    static div(v, n, target) {
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
    }

    /**
   * Calculates the dot product of two vectors.
   */
    /**
   * @static
   * @param  {p5.Vector} v1 first <a href="#/p5.Vector">p5.Vector</a>.
   * @param  {p5.Vector} v2 second <a href="#/p5.Vector">p5.Vector</a>.
   * @return {Number}     dot product.
   */
    static dot(v1, v2) {
      return v1.dot(v2);
    }

    /**
   * Calculates the cross product of two vectors.
   */
    /**
   * @static
   * @param  {p5.Vector} v1 first <a href="#/p5.Vector">p5.Vector</a>.
   * @param  {p5.Vector} v2 second <a href="#/p5.Vector">p5.Vector</a>.
   * @return {Number}     cross product.
   */
    static cross(v1, v2) {
      return v1.cross(v2);
    }

    /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   */
    /**
   * @static
   * @param  {p5.Vector} v1 The first <a href="#/p5.Vector">p5.Vector</a>
   * @param  {p5.Vector} v2 The second <a href="#/p5.Vector">p5.Vector</a>
   * @return {Number}     The distance
   */
    static dist(v1, v2) {
      return v1.dist(v2);
    }

    /**
   * Linear interpolate a vector to another vector and return the result as a
   * new vector.
   */
    /**
   * @static
   * @param {p5.Vector} v1
   * @param {p5.Vector} v2
   * @param {Number} amt
   * @param {p5.Vector} [target] The vector to receive the result
   * @return {p5.Vector}      The lerped value
   */
    static lerp(v1, v2, amt, target) {
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
    }

    /**
   * Performs spherical linear interpolation with the other vector
   * and returns the resulting vector.
   * This works in both 3D and 2D. As for 2D, the result of slerping
   * between 2D vectors is always a 2D vector.
   */
    /**
   * @static
   * @param {p5.Vector} v1 old vector.
   * @param {p5.Vector} v2 new vector.
   * @param {Number} amt
   * @param {p5.Vector} [target] vector to receive the result.
   * @return {p5.Vector} slerped vector between v1 and v2
   */
    static slerp(v1, v2, amt, target) {
      if (!target) {
        target = v1.copy();
        if (arguments.length === 4) {
          p5._friendlyError(
            'The target parameter is undefined, it should be of type p5.Vector',
            'p5.Vector.slerp'
          );
        }
      } else {
        target.set(v1);
      }
      target.slerp(v2, amt);
      return target;
    }

    /**
   * Calculates the magnitude (length) of the vector and returns the result as
   * a float (this is simply the equation `sqrt(x*x + y*y + z*z)`.)
   */
    /**
   * @static
   * @param {p5.Vector} vecT The vector to return the magnitude of
   * @return {Number}        The magnitude of vecT
   */
    static mag(vecT) {
      return vecT.mag();
    }

    /**
   * Calculates the squared magnitude of the vector and returns the result
   * as a float (this is simply the equation <em>(x\*x + y\*y + z\*z)</em>.)
   * Faster if the real length is not required in the
   * case of comparing vectors, etc.
   */
    /**
   * @static
   * @param {p5.Vector} vecT the vector to return the squared magnitude of
   * @return {Number}        the squared magnitude of vecT
   */
    static magSq(vecT) {
      return vecT.magSq();
    }

    /**
   * Normalize the vector to length 1 (make it a unit vector).
   */
    /**
   * @static
   * @param {p5.Vector} v  The vector to normalize
   * @param {p5.Vector} [target] The vector to receive the result
   * @return {p5.Vector}   The vector v, normalized to a length of 1
   */
    static normalize(v, target) {
      if (arguments.length < 2) {
        target = v.copy();
      } else {
        if (!(target instanceof p5.Vector)) {
          p5._friendlyError(
            'The target parameter should be of type p5.Vector',
            'p5.Vector.normalize'
          );
        }
        target.set(v);
      }
      return target.normalize();
    }

    /**
   * Limit the magnitude of the vector to the value used for the <b>max</b>
   * parameter.
   */
    /**
   * @static
   * @param {p5.Vector} v  the vector to limit
   * @param {Number}    max
   * @param {p5.Vector} [target] the vector to receive the result (Optional)
   * @return {p5.Vector} v with a magnitude limited to max
   */
    static limit(v, max, target) {
      if (arguments.length < 3) {
        target = v.copy();
      } else {
        if (!(target instanceof p5.Vector)) {
          p5._friendlyError(
            'The target parameter should be of type p5.Vector',
            'p5.Vector.limit'
          );
        }
        target.set(v);
      }
      return target.limit(max);
    }

    /**
   * Set the magnitude of the vector to the value used for the <b>len</b>
   * parameter.
   */
    /**
   * @static
   * @param {p5.Vector} v  the vector to set the magnitude of
   * @param {number}    len
   * @param {p5.Vector} [target] the vector to receive the result (Optional)
   * @return {p5.Vector} v with a magnitude set to len
   */
    static setMag(v, len, target) {
      if (arguments.length < 3) {
        target = v.copy();
      } else {
        if (!(target instanceof p5.Vector)) {
          p5._friendlyError(
            'The target parameter should be of type p5.Vector',
            'p5.Vector.setMag'
          );
        }
        target.set(v);
      }
      return target.setMag(len);
    }

    /**
   * Calculate the angle of rotation for this vector (only 2D vectors).
   * p5.Vectors created using <a href="#/p5/createVector">createVector()</a>
   * will take the current <a href="#/p5/angleMode">angleMode</a> into
   * consideration, and give the angle in radians or degrees accordingly.
   */
    /**
   * @static
   * @param {p5.Vector} v the vector to find the angle of
   * @return {Number} the angle of rotation
   */
    static heading(v) {
      return v.heading();
    }

    /**
   * Calculates and returns the angle between two vectors. This function will take
   * the <a href="#/p5/angleMode">angleMode</a> on v1 into consideration, and
   * give the angle in radians or degrees accordingly.
   */
    /**
   * @static
   * @param  {p5.Vector}    v1 the first vector.
   * @param  {p5.Vector}    v2 the second vector.
   * @return {Number}       angle between the two vectors.
   */
    static angleBetween(v1, v2) {
      return v1.angleBetween(v2);
    }

    /**
   * Reflect a vector about a normal to a line in 2D, or about a normal to a
   * plane in 3D.
   */
    /**
   * @static
   * @param  {p5.Vector} incidentVector vector to be reflected.
   * @param  {p5.Vector} surfaceNormal
   * @param  {p5.Vector} [target] vector to receive the result.
   * @return {p5.Vector} the reflected vector
   */
    static reflect(incidentVector, surfaceNormal, target) {
      if (arguments.length < 3) {
        target = incidentVector.copy();
      } else {
        if (!(target instanceof p5.Vector)) {
          p5._friendlyError(
            'The target parameter should be of type p5.Vector',
            'p5.Vector.reflect'
          );
        }
        target.set(incidentVector);
      }
      return target.reflect(surfaceNormal);
    }

    /**
   * Return a representation of this vector as a float array. This is only
   * for temporary use. If used in any other fashion, the contents should be
   * copied by using the <b>p5.Vector.<a href="#/p5.Vector/copy">copy()</a></b>
   * method to copy into your own vector.
   */
    /**
   * @static
   * @param  {p5.Vector} v the vector to convert to an array
   * @return {Number[]} an Array with the 3 values
   */
    static array(v) {
      return v.array();
    }

    /**
   * Equality check against a <a href="#/p5.Vector">p5.Vector</a>
   */
    /**
   * @static
   * @param {p5.Vector|Array} v1 the first vector to compare
   * @param {p5.Vector|Array} v2 the second vector to compare
   * @return {Boolean}
   */
    static equals(v1, v2) {
      let v;
      if (v1 instanceof p5.Vector) {
        v = v1;
      } else if (v1 instanceof Array) {
        v = new p5.Vector().set(v1);
      } else {
        p5._friendlyError(
          'The v1 parameter should be of type Array or p5.Vector',
          'p5.Vector.equals'
        );
      }
      return v.equals(v2);
    }
  };

  /**
   * The x component of the vector
   * @type {Number}
   * @for p5.Vector
   * @property x
   * @name x
   */

  /**
   * The y component of the vector
   * @type {Number}
   * @for p5.Vector
   * @property y
   * @name y
   */

  /**
   * The z component of the vector
   * @type {Number}
   * @for p5.Vector
   * @property z
   * @name z
   */
}

export default vector;

if(typeof p5 !== 'undefined'){
  vector(p5, p5.prototype);
}
