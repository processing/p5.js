/**
 * @module Math
 * @for PVector
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');


  /**
   * Creates a new PVector (the datatype for storing vectors). This provides a
   * two or three dimensional vector, specifically a Euclidean (also known as 
   * geometric) vector. A vector is an entity that has both magnitude and 
   * direction. 
   *
   * @method createVector
   * @param {Number} [x] x component of the vector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   * @for Math
   */
  p5.prototype.createVector = function() {
    return new PVector(this, arguments);
  };


  /**
   * The PVector constructor function.
   *
   * A class to describe a two or three dimensional vector, specifically
   * a Euclidean (also known as geometric) vector. A vector is an entity
   * that has both magnitude and direction. The datatype, however, stores
   * the components of the vector (x,y for 2D, and x,y,z for 3D). The magnitude
   * and direction can be accessed via the methods mag() and heading(). In many
   * of the p5.js examples, you will see PVector used to describe a position,
   * velocity, or acceleration. For example, if you consider a rectangle moving
   * across the screen, at any given instant it has a position (a vector that
   * points from the origin to its location), a velocity (the rate at which the
   * object's position changes per time unit, expressed as a vector), and
   * acceleration (the rate at which the object's velocity changes per time
   * unit, expressed as a vector). Since vectors represent groupings of values,
   * we cannot simply use traditional addition/multiplication/etc. Instead,
   * we'll need to do some "vector" math, which is made easy by the methods
   * inside the PVector class.
   *
   * @class PVector
   * @constructor
   * @param {Number} [x] x component of the vector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   */
  function PVector() {
    var nums = arguments;
    // save reference to p5 if passed in
    if(arguments[0] instanceof p5) {
      this.p5 = arguments[0];
      nums = arguments[1];
    }
    /**
     * The x component of the vector
     * @property x
     * @type {Number}
     */
    this.x = nums[0] || 0;
    /**
     * The y component of the vector
     * @property y
     * @type {Number}
     */
    this.y = nums[1] || 0;
    /**
     * The z component of the vector
     * @property z
     * @type {Number}
     */
    this.z = nums[2] || 0;
  }


  /**
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a PVector, or the values from a float array.
   * @method set
   * 
   * @param {Number|PVector|Array} [x] the x component of the vector or a
   *                                   PVector or an Array
   * @param {Number}               [y] the y component of the vector 
   * @param {Number}               [z] the z component of the vector 
   */
  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
  };

  /**
   * Gets a copy of the vector, returns a PVector object.
   *
   * @method get
   * @return {PVector} the copy of the PVector object
   */
  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };


  /**
   * Adds x, y, and z components to a vector, adds one vector to another, or
   * adds two independent vectors together. The version of the method that adds
   * two vectors together is a static method and returns a PVector, the others
   * have no return value -- they act directly on the vector. See the examples
   * for more context. 
   * 
   * @method add
   * @chainable
   * @param  {Number|PVector|Array} x   the x component of the vector to be
   *                                    added or a PVector or an Array
   * @param  {Number}               [y] the y component of the vector to be
   *                                    added
   * @param  {Number}               [z] the z component of the vector to be
   *                                    added
   * @return {PVector}                  the PVector object.
   */
  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  /**
   * Subtracts x, y, and z components from a vector, subtracts one vector from
   * another, or subtracts two independent vectors. The version of the method
   * that substracts two vectors is a static method and returns a PVector, the
   * others have no return value -- they act directly on the vector. See the
   * examples for more context. 
   * 
   * @method sub
   * @chainable
   * @param  {Number|PVector|Array} x   the x component of the vector or a
   *                                    PVector or an Array
   * @param  {Number}               [y] the y component of the vector
   * @param  {Number}               [z] the z component of the vector
   * @return {PVector}                  PVector object.
   */
  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  /**
   * Multiply the vector by a scalar.   
   *
   * @method mult
   * @chainable
   * @param  {Number}  n the number to multiply with the vector
   * @return {PVector} a reference to the PVector object (allow chaining)
   */
  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  /**
   * Divide the vector by a scalar.   
   *
   * @method div
   * @chainable
   * @param  {number}  n the number to divide the vector by
   * @return {PVector} a reference to the PVector object (allow chaining)
   */
  PVector.prototype.div = function (n) {
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
  PVector.prototype.mag = function () {
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
  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   * Calculates the dot product of two vectors.
   *
   * @method dot
   * @param  {Number|PVector} x   x component of the vector or a PVector
   * @param  {Number}         [y] y component of the vector
   * @param  {Number}         [z] z component of the vector
   * @return {Number}             the dot product
   */
  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  /**
   * Calculates and returns a vector composed of the cross product between
   * two vectors.
   *
   * @method cross
   * @param  {PVector} v PVector to be crossed
   * @return {PVector}   PVector composed of cross product
   */
  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @method dist
   * @param  {PVector} v the x, y, and z coordinates of a PVector
   * @return {Number}    the distance
   */
  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  /**
   * Normalize the vector to length 1 (make it a unit vector).
   *
   * @method normalize
   * @return {PVector} normalized PVector
   */
  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  /**
   * Limit the magnitude of this vector to the value used for the <b>max</b>
   * parameter.
   *
   * @method limit
   * @param  {Number}  max the maximum magnitude for the vector
   * @return {PVector}     the modified PVector
   */
  PVector.prototype.limit = function (l) {
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
   * @mtehod setMag
   * @param  {number}  len the new length for this vector
   * @return {PVector}     the modified PVector
   */
  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  /**
   * Calculate the angle of rotation for this vector (only 2D vectors)
   * TODO: deal with AngleMode // LM gave this a shot, is it right?
   *
   * @method heading
   * @return {Number} the angle of rotation
   */
  PVector.prototype.heading = function () {
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
   * TODO: Change to rotate()
   * TODO: Deal with angleMode
   *
   * @method rotate2D
   * @param  {number}  angle the angle of rotation
   * @return {PVector} the modified PVector
   */
  PVector.prototype.rotate2D = function (a) {
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
   * @param  {PVector} x   the x component or the PVector to lerp to
   * @param  {PVector} [y] y the y component 
   * @param  {PVector} [z] z the z component
   * @param  {Number}  amt the amount of interpolation; some value between 0.0
   *                       (old vector) and 1.0 (new vector). 0.1 is very near
   *                       the new vector. 0.5 is halfway in between.
   * @return {PVector}     the modified PVector
   */
  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
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
   * copied by using the <b>PVector.get()</b> method to copy into your own
   * array.
   *
   * @method array
   * @return {Array} an Array with the 3 values 
   */
  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods
  

  /**
   * Make a new 2D unit vector from an angle
   * 
   * @method fromAngle
   * @static
   * @param {Number} angle the desired angle
   * @return {PVector} the new PVector object
   */
  PVector.fromAngle = function(angle) {
    return new PVector(Math.cos(angle),Math.sin(angle),0);
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @method random2D
   * @static
   * @return {PVector} the new PVector object
   */
  PVector.random2D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    return this.fromAngle(Math.random()*Math.PI*2);
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @method random3D
   * @static
   * @return {PVector} the new PVector object
   */
  PVector.random3D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    var angle = Math.random()*Math.PI*2;
    var vz = Math.random()*2-1;
    var vx = Math.sqrt(1-vz*vz)*Math.cos(angle);
    var vy = Math.sqrt(1-vz*vz)*Math.sin(angle);
    return new PVector(vx, vy, vz);
  };


  /**
   * Adds two vectors together and returns a new one.
   *
   * @static
   * @param  {PVector} v1 a PVector to add
   * @param  {PVector} v2 a PVector to add
   * @return {PVector}    the resulting new PVector
   */

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  /**
   * Subtracts one PVector from another and returns a new one.  The second
   * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
   *
   * @static
   * @param  {PVector} v1 a PVector to subtract from
   * @param  {PVector} v2 a PVector to subtract
   * @return {PVector}    the resulting new PVector
   */

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };


  /**
   * Multiplies a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {PVector} v the PVector to multiply
   * @param  {Number}  n the scalar
   * @return {PVector}   the resulting new PVector
   */
  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  /**
   * Divides a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {PVector} v the PVector to divide
   * @param  {Number}  n the scalar
   * @return {PVector}   the resulting new PVector
   */
  PVector.div = function (v, n) {
    return v.get().div(n);
  };


  /**
   * Calculates the dot product of two vectors.
   *
   * @static
   * @param  {PVector} v1 the first PVector
   * @param  {PVector} v2 the second PVector
   * @return {Number}     the dot product
   */
  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  /**
   * Calculates the cross product of two vectors.
   *
   * @static
   * @param  {PVector} v1 the first PVector
   * @param  {PVector} v2 the second PVector
   * @return {Number}     the cross product
   */
  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @static
   * @param  {PVector} v1 the first PVector
   * @param  {PVector} v2 the second PVector
   * @return {Number}     the distance
   */
  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  /**
   * Linear interpolate a vector to another vector and return the result as a
   * new vector.
   *
   * @static
   * @param {PVector} v1 a starting PVector
   * @param {PVector} v2 the PVector to lerp to
   * @param {Number}     the amount of interpolation; some value between 0.0
   *                     (old vector) and 1.0 (new vector). 0.1 is very near
   *                     the new vector. 0.5 is halfway in between.
   */
  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  /**
   * Calculates and returns the angle (in radians) between two vectors.
   *
   * @static
   * @param  {PVector} v1 the x, y, and z components of a PVector
   * @param  {PVector} v2 the x, y, and z components of a PVector
   * @return {Number}     the angle between
   * 
   * TODO: Needs to account for angleMode
   */
  PVector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  return PVector;

});
