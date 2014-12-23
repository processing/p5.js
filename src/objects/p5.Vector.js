/**
 * @module Math
 * @submodule Math
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  /**
   * A class to describe a two or three dimensional vector, specifically
   * a Euclidean (also known as geometric) vector. A vector is an entity
   * that has both magnitude and direction. The datatype, however, stores
   * the components of the vector (x,y for 2D, and x,y,z for 3D). The magnitude
   * and direction can be accessed via the methods mag() and heading(). In many
   * of the p5.js examples, you will see p5.Vector used to describe a position,
   * velocity, or acceleration. For example, if you consider a rectangle moving
   * across the screen, at any given instant it has a position (a vector that
   * points from the origin to its location), a velocity (the rate at which the
   * object's position changes per time unit, expressed as a vector), and
   * acceleration (the rate at which the object's velocity changes per time
   * unit, expressed as a vector). Since vectors represent groupings of values,
   * we cannot simply use traditional addition/multiplication/etc. Instead,
   * we'll need to do some "vector" math, which is made easy by the methods
   * inside the p5.Vector class.
   *
   * @class p5.Vector
   * @constructor
   * @param {Number} [x] x component of the vector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   * @example
   * <div>
   * <code>
   * var v1 = createVector(40, 50);
   * var v2 = createVector(40, 50);
   *
   * ellipse(v1.x, v1.y, 50, 50);
   * ellipse(v2.x, v2.y, 50, 50);
   * v1.add(v2);
   * ellipse(v1.x, v1.y, 50, 50);
   * </code>
   * </div>
   */
  p5.Vector = function() {
    var x,y,z;
    // This is how it comes in with createVector()
    if(arguments[0] instanceof p5) {
      // save reference to p5 if passed in
      this.p5 = arguments[0];
      x  = arguments[1][0] || 0;
      y  = arguments[1][1] || 0;
      z  = arguments[1][2] || 0;
    // This is what we'll get with new p5.Vector()
    } else {
      x = arguments[0] || 0;
      y = arguments[1] || 0;
      z = arguments[2] || 0;
    }
    /**
     * The x component of the vector
     * @property x
     * @type {Number}
     */
    this.x = x;
    /**
     * The y component of the vector
     * @property y
     * @type {Number}
     */
    this.y = y;
    /**
     * The z component of the vector
     * @property z
     * @type {Number}
     */
    this.z = z;
  };


  /**
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a p5.Vector, or the values from a float array.
   * @method set
   *
   * @param {Number|p5.Vector|Array} [x] the x component of the vector or a
   *                                     p5.Vector or an Array
   * @param {Number}                 [y] the y component of the vector
   * @param {Number}                 [z] the z component of the vector
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *    var v = createVector(1,2,3);
   *    v.set(4,5,6); //Sets vector to [4,5,6]
   *
   *    var v1 = createVector(0,0,0);
   *    var arr = [1,2,3]
   *    v1.set(arr); //Sets vector to [1,2,3]
   * }
   * </code>
   * </div>
   */
  p5.Vector.prototype.set = function (x, y, z) {
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
   * Gets a copy of the vector, returns a p5.Vector object.
   *
   * @method get
   * @return {p5.Vector} the copy of the p5.Vector object
   */
  p5.Vector.prototype.get = function () {
    if (this.p5) {
      return new p5.Vector(this.p5,[this.x, this.y, this.z]);
    } else {
      return new p5.Vector(this.x,this.y,this.z);
    }
  };


  /**
   * Adds x, y, and z components to a vector, adds one vector to another, or
   * adds two independent vectors together. The version of the method that adds
   * two vectors together is a static method and returns a p5.Vector, the others
   * acts directly on the vector. See the examples for more context.
   *
   * @method add
   * @chainable
   * @param  {Number|p5.Vector|Array} x   the x component of the vector to be
   *                                      added or a p5.Vector or an Array
   * @param  {Number}                 [y] the y component of the vector to be
   *                                      added
   * @param  {Number}                 [z] the z component of the vector to be
   *                                      added
   * @return {p5.Vector}                  the p5.Vector object.
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 2, 3);
   * v.add(4,5,6); // v's compnents are set to [5,7,9]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(2, 3, 4);
   *
   * var v3 = p5.Vector.add(v1, v2); // v3 has components [3,5,7]
   * </code>
   * </div>
   */
  p5.Vector.prototype.add = function (x, y, z) {
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

  /**
   * Subtracts x, y, and z components from a vector, subtracts one vector from
   * another, or subtracts two independent vectors. The version of the method
   * that subtracts two vectors is a static method and returns a p5.Vector, the
   * other acts directly on the vector. See the examples for more context.
   *
   * @method sub
   * @chainable
   * @param  {Number|p5.Vector|Array} x   the x component of the vector or a
   *                                      p5.Vector or an Array
   * @param  {Number}                 [y] the y component of the vector
   * @param  {Number}                 [z] the z component of the vector
   * @return {p5.Vector}                  p5.Vector object.
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(4, 5, 6);
   * v.sub(1, 1, 1); // v's compnents are set to [3,4,5]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(2, 3, 4);
   * var v2 = createVector(1, 2, 3);
   *
   * var v3 = p5.Vector.sub(v1, v2); // v3 has compnents [1,1,1]
   * </code>
   * </div>
   */
  p5.Vector.prototype.sub = function (x, y, z) {
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
   * Multiply the vector by a scalar. The static version of this method 
   * creates a new p5.Vector while the non static version acts on the vector
   * directly. See the examples for more context.
   *
   * @method mult
   * @chainable
   * @param  {Number}    n the number to multiply with the vector
   * @return {p5.Vector} a reference to the p5.Vector object (allow chaining)
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 2, 3);
   * v.mult(2); // v's compnents are set to [2,4,6]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1  = createVector(1, 2, 3);
   * var v2 = p5.Vector.mult(v1, 2); // v2 has compnents [2,4,6]
   * </code>
   * </div>
   */
  p5.Vector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  /**
   * Divide the vector by a scalar. The static version of this method creates a
   * new p5.Vector while the non static version acts on the vector directly. 
   * See the examples for more context.
   *
   * @method div
   * @chainable
   * @param  {number}    n the number to divide the vector by
   * @return {p5.Vector} a reference to the p5.Vector object (allow chaining)
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(6, 4, 2);
   * v.div(2); //v's compnents are set to [3,2,1]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1  = createVector(6, 4, 2);
   * var v2 = p5.Vector.div(v, 2); // v2 has compnents [3,2,1]
   * </code>
   * </div>
   */
  p5.Vector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };

  /**
   * Calculates the magnitude (length) of the vector and returns the result as
   * a float (this is simply the equation sqrt(x*x + y*y + z*z).)
   *
   * @method mag
   * @return {Number} magnitude of the vector
   */
  p5.Vector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  /**
   * Calculates the squared magnitude of the vector and returns the result
   * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
   * Faster if the real length is not required in the
   * case of comparing vectors, etc.
   *
   * @method magSq
   * @return {number} squared magnitude of the vector
   */
  p5.Vector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   * Calculates the dot product of two vectors. The version of the method
   * that computes the dot product of two independent vectors is a static
   * method. See the examples for more context.
   *
   *
   * @method dot
   * @param  {Number|p5.Vector} x   x component of the vector or a p5.Vector
   * @param  {Number}           [y] y component of the vector
   * @param  {Number}           [z] z component of the vector
   * @return {Number}                 the dot product
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(2, 3, 4);
   *
   * v1.dot(v2); // returns 20
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * //Static method
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(3, 2, 1);
   *
   * var dotProduct = p5.Vector.dot(v1, v2); // dotProduct is 10
   * </code>
   * </div>
   */
  p5.Vector.prototype.dot = function (x, y, z) {
    if (x instanceof p5.Vector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  /**
   * Calculates and returns a vector composed of the cross product between
   * two vectors. Both the static and non static methods return a new p5.Vector.
   * See the examples for more context.
   *
   * @method cross
   * @param  {p5.Vector} v p5.Vector to be crossed
   * @return {p5.Vector}   p5.Vector composed of cross product
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(1, 2, 3);
   *
   * v1.cross(v2); // v's components are [0,0,0]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * //Static method
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * // crossProduct has components [0,0,1]
   * var crossProduct = p5.Vector.cross(v1,v2); 
   * </code>
   * </div>
   */
  p5.Vector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    if (this.p5) {
      return new p5.Vector(this.p5,[x,y,z]);
    } else {
      return new p5.Vector(x,y,z);
    }
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @method dist
   * @param  {p5.Vector} v the x, y, and z coordinates of a p5.Vector
   * @return {Number}      the distance
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var distance = v.dist(v1); // distance is 1.4142...
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var distance = p5.Vector.dist(v1,v2); //distance is 1.4142...
   * </code>
   * </div>
   */
  p5.Vector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  /**
   * Normalize the vector to length 1 (make it a unit vector).
   *
   * @method normalize
   * @return {p5.Vector} normalized p5.Vector
   */
  p5.Vector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  /**
   * Limit the magnitude of this vector to the value used for the <b>max</b>
   * parameter.
   *
   * @method limit
   * @param  {Number}    max the maximum magnitude for the vector
   * @return {p5.Vector}     the modified p5.Vector
   */
  p5.Vector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  /**
   * Set the magnitude of this vector to the value used for the <b>len</b>
   * parameter.
   *
   * @method setMag
   * @param  {number}    len the new length for this vector
   * @return {p5.Vector}     the modified p5.Vector
   */
  p5.Vector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  /**
   * Calculate the angle of rotation for this vector (only 2D vectors)
   *
   * @method heading
   * @return {Number} the angle of rotation
   */
  p5.Vector.prototype.heading = function () {
    var h = Math.atan2(this.y, this.x);
    if (this.p5) {
      if (this.p5._angleMode === constants.RADIANS) {
        return h;
      } else {
        return polarGeometry.radiansToDegrees(h);
      }
    } else {
      return h;
    }
  };

  /**
   * Rotate the vector by an angle (only 2D vectors), magnitude remains the
   * same
   *
   * @method rotate
   * @param  {number}    angle the angle of rotation
   * @return {p5.Vector} the modified p5.Vector
   */
  p5.Vector.prototype.rotate = function (a) {
    if (this.p5) {
      if (this.p5._angleMode === constants.DEGREES) {
        a = polarGeometry.degreesToRadians(a);
      }
    }
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  /**
   * Linear interpolate the vector to another vector
   *
   * @method lerp
   * @param  {p5.Vector} x   the x component or the p5.Vector to lerp to
   * @param  {p5.Vector} [y] y the y component
   * @param  {p5.Vector} [z] z the z component
   * @param  {Number}    amt the amount of interpolation; some value between 0.0
   *                         (old vector) and 1.0 (new vector). 0.1 is very near
   *                         the new vector. 0.5 is halfway in between.
   * @return {p5.Vector}     the modified p5.Vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 1, 0);
   *
   * v.lerp(3, 3, 0, 0.5); // v now has components [2,2,0]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * var v1 = createVector(0, 0, 0);
   * var v2 = createVector(100, 100, 0);
   *
   * var v3 = p5.Vector.lerp(v1, v2, 0.5);
   * // v3 has components [50,50,0]
   * </code>
   * </div>
   */
  p5.Vector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof p5.Vector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  /**
   * Return a representation of this vector as a float array. This is only
   * for temporary use. If used in any other fashion, the contents should be
   * copied by using the <b>p5.Vector.get()</b> method to copy into your own
   * array.
   *
   * @method array
   * @return {Array} an Array with the 3 values
   */
  p5.Vector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods


  /**
   * Make a new 2D unit vector from an angle
   *
   * @method fromAngle
   * @static
   * @param {Number}     angle the desired angle
   * @return {p5.Vector}       the new p5.Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v = p5.Vector.fromAngle(PI / 2);
   * //v has components [0,1,0]
   * </code>
   * </div>
   */
  p5.Vector.fromAngle = function(angle) {
    if (this.p5) {
      if (this.p5._angleMode === constants.DEGREES) {
        angle = polarGeometry.degreesToRadians(angle);
      }
    }
    if (this.p5) {
      return new p5.Vector(this.p5,[Math.cos(angle),Math.sin(angle),0]);
    } else {
      return new p5.Vector(Math.cos(angle),Math.sin(angle),0);
    }
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @method random2D
   * @static
   * @return {p5.Vector} the new p5.Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v = p5.Vector.random2D();
   * </code>
   * </div>
   */
  p5.Vector.random2D = function () {
    var angle;
    // A lot of nonsense to determine if we know about a
    // p5 sketch and whether we should make a random angle in degrees or radians
    if (this.p5) {
      if (this.p5._angleMode === constants.DEGREES) {
        angle = this.p5.random(360);
      } else {
        angle = this.p5.random(constants.TWO_PI);
      }
    } else {
      angle = Math.random()*Math.PI*2;
    }
    return this.fromAngle(angle);
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @method random3D
   * @static
   * @return {p5.Vector} the new p5.Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v = p5.Vector.random3D();
   * </code>
   * </div>
   */
  p5.Vector.random3D = function () {
    var angle,vz;
    // If we know about p5
    if (this.p5) {
      angle = this.p5.random(0,constants.TWO_PI);
      vz = this.p5.random(-1,1);
    } else {
      angle = Math.random()*Math.PI*2;
      vz = Math.random()*2-1;
    }
    var vx = Math.sqrt(1-vz*vz)*Math.cos(angle);
    var vy = Math.sqrt(1-vz*vz)*Math.sin(angle);
    if (this.p5) {
      return new p5.Vector(this.p5,[vx,vy,vz]);
    } else {
      return new p5.Vector(vx,vy,vz);
    }
  };


  /**
   * Adds two vectors together and returns a new one.
   *
   * @static
   * @param  {p5.Vector} v1 a p5.Vector to add
   * @param  {p5.Vector} v2 a p5.Vector to add
   * @return {p5.Vector}    the resulting new p5.Vector
   */

  p5.Vector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  /**
   * Subtracts one p5.Vector from another and returns a new one.  The second
   * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
   *
   * @static
   * @param  {p5.Vector} v1 a p5.Vector to subtract from
   * @param  {p5.Vector} v2 a p5.Vector to subtract
   * @return {p5.Vector}    the resulting new p5.Vector
   */

  p5.Vector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };


  /**
   * Multiplies a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {p5.Vector} v the p5.Vector to multiply
   * @param  {Number}  n the scalar
   * @return {p5.Vector}   the resulting new p5.Vector
   */
  p5.Vector.mult = function (v, n) {
    return v.get().mult(n);
  };

  /**
   * Divides a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {p5.Vector} v the p5.Vector to divide
   * @param  {Number}  n the scalar
   * @return {p5.Vector}   the resulting new p5.Vector
   */
  p5.Vector.div = function (v, n) {
    return v.get().div(n);
  };


  /**
   * Calculates the dot product of two vectors.
   *
   * @static
   * @param  {p5.Vector} v1 the first p5.Vector
   * @param  {p5.Vector} v2 the second p5.Vector
   * @return {Number}     the dot product
   */
  p5.Vector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  /**
   * Calculates the cross product of two vectors.
   *
   * @static
   * @param  {p5.Vector} v1 the first p5.Vector
   * @param  {p5.Vector} v2 the second p5.Vector
   * @return {Number}     the cross product
   */
  p5.Vector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @static
   * @param  {p5.Vector} v1 the first p5.Vector
   * @param  {p5.Vector} v2 the second p5.Vector
   * @return {Number}     the distance
   */
  p5.Vector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  /**
   * Linear interpolate a vector to another vector and return the result as a
   * new vector.
   *
   * @static
   * @param {p5.Vector} v1 a starting p5.Vector
   * @param {p5.Vector} v2 the p5.Vector to lerp to
   * @param {Number}       the amount of interpolation; some value between 0.0
   *                       (old vector) and 1.0 (new vector). 0.1 is very near
   *                       the new vector. 0.5 is halfway in between.
   */
  p5.Vector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  /**
   * Calculates and returns the angle (in radians) between two vectors.
   * @method angleBetween
   * @static
   * @param  {p5.Vector} v1 the x, y, and z components of a p5.Vector
   * @param  {p5.Vector} v2 the x, y, and z components of a p5.Vector
   * @return {Number}       the angle between (in radians)
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1,0,0);
   * var v2 = createVector(0,1,0);
   *
   * var angle = p5.Vector.angleBetween(v1,v2);
   * // angle is PI/2
   * </code>
   * </div>
   */
  p5.Vector.angleBetween = function (v1, v2) {
    var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    if (this.p5) {
      if (this.p5._angleMode === constants.DEGREES) {
        angle = polarGeometry.radiansToDegrees(angle);
      }
    }
    return angle;
  };

  return p5.Vector;

});
