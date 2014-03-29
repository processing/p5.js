define(function (require) {

  'use strict';

  function PVector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }


  /**
   *
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a PVector, or the values from a float array.
   *
   * Takes either 1, 2 or 3 arguments.
   *
   * @param {x} x component (or PVector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 
   */
  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  /**
   *
   * Gets a copy of the vector, returns a PVector object.
   *
   * @return {PVector} The copy of the PVector object.
   */
  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };

  /**
   *
   * Adds x, y, and z components to a vector, adds one vector to another. To
   * add two independent vectors together see the static add method
   * which returns a new PVector.
   *
   * @param {x} x component (or PVector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 

   * @return {PVector} A reference to the PVector object (allow chaining)
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
   *
   * Subtracts x, y, and z components from a vector, subtracts one vector from another. To
   * subtract two independent vectors together see the static subtract method
   * which returns a new PVector.   
   *
   * @param {x} x component (or PVector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 

   * @return {PVector} A reference to the PVector object (allow chaining)
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
   *
   * Multiply the vector by a scalar.   
   *
   * @param {n} the number to multiply with the vector
   *
   * @return {PVector} A reference to the PVector object (allow chaining)
   */
  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

   /**
   *
   * Divide the vector by a scalar.   
   *
   * @param {number} the number to divide the vector by
   *
   * @return {PVector} A reference to the PVector object (allow chaining)
   */
  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };

  /**
   *
   * Calculates the magnitude (length) of the vector and returns the result
   * as a float (this is simply the equation <em>sqrt(x*x + y*y + z*z)</em>.)
   *
   * @return {number} magnitude (length) of the vector
   */
  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  /**
   *
   * Calculates the squared magnitude of the vector and returns the result
   * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
   * Faster if the real length is not required in the
   * case of comparing vectors, etc.
   *
   * @return {number} squared magnitude of the vector
   */
  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   *
   * Calculates the dot product of two vectors.
   *
   * @return {number} the dot product
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
   *
   * Calculates the cross product of two vectors.
   *
   * @return {number} the cross product
   */
  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  /**
   *
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @param {PVector} the x, y, and z coordinates of a PVector
   *
   * @return {number} the distance
   */
  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  /**
   *
   * Normalize the vector to length 1 (make it a unit vector).
   *
   */
  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  /**
   *
   * Limit the magnitude of this vector to the value used for the <b>max</b> parameter.
   *
   * @param {number} the maximum magnitude for the vector
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
   *
   * Set the magnitude of this vector to the value used for the <b>len</b> parameter.
   *
   * @param {number} the new length for this vector
   */
  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  /**
   *
   * Calculate the angle of rotation for this vector (only 2D vectors)
   * TODO: deal with AngleMode
   *
   * @return {number} the angle of rotation
   */
  PVector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };



  /**
   *
   * Rotate the vector by an angle (only 2D vectors), magnitude remains the same
   * TODO: Change to rotate()
   * TODO: Deal with angleMode
   *
   * @param {number} the angle of rotation
   */
  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  /**
   *
   * Linear interpolate the vector to another vector
   *
   * @param {PVector} the vector to lerp to
   * @param {number} The amount of interpolation; some value between 0.0 (old vector) and 1.0 (new vector). 0.1 is very near the new vector. 0.5 is halfway in between.
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
   *
   * Return a representation of this vector as a float array. This is only
   * for temporary use. If used in any other fashion, the contents should be
   * copied by using the <b>PVector.get()</b> method to copy into your own array.
   *
   * return {Array} an array with the 3 values 
   */
  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods
  

  /**
   * Make a new 2D unit vector from an angle
   
   * @param {number} The desired angle.
   * @return {PVector} The new PVector object.
   */
  PVector.fromAngle = function(angle) {
    return new PVector(Math.cos(angle),Math.sin(angle),0);
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @return {PVector} The new PVector object.
   */
  PVector.random2D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    return this.fromAngle(Math.random(Math.PI*2));
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @return {PVector} The new PVector object.
   */
  PVector.random3D = function () {
    // TODO: This should include an option to use p5.js seeded random number
    var angle = Math.random()*Math.PI*2;
    var vz = Math.random()*2-1;
    var vx = Math.sqrt(1-vz*vz)*Math.cos(angle);
    var vy = Math.sqrt(1-vz*vz)*Math.sin(angle);
    return new PVector(vx, vy, vz);
  };

  PVector.add = function (v1, v2) {
    return v1.get().add(v2);
  };

  PVector.sub = function (v1, v2) {
    return v1.get().sub(v2);
  };

  PVector.mult = function (v, n) {
    return v.get().mult(n);
  };

  PVector.div = function (v, n) {
    return v.get().div(n);
  };

  PVector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  PVector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  PVector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  PVector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  /**
   *
   * Calculates and returns the angle (in radians) between two vectors.
   *
   * @param {PVector} the x, y, and z components of a PVector
   * @param {PVector} the x, y, and z components of a PVector
   *
   * @return {number} the angle between
   * 
   * TODO: Needs to account for angleMode
   */
  PVector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  return PVector;

});
