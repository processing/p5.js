define(function(require) {

  'use strict';

  var p5 = require('core');

  function PVector(x, y, z) {
    // Check if PVector is called from a Sketch
    var sketch;
    if (Object.getOwnPropertyNames(this).length > 0) {
      sketch = this;
    }
    
    return new Vector(x, y, z, sketch);
  }
  
  // Extends p5 with the Vector plugin
  p5.extend({'PVector': PVector});

  /**
   * Vector constructor.
   * 
   * @param {type} x
   * @param {type} y
   * @param {type} z
   * @param {Object} sketch The current p5 instance.
   * @returns {_L1.Vector}
   */
  function Vector(x, y, z, sketch) {
    if (sketch) {
      this.sketch = sketch;
      console.log(this.sketch);
      console.log('current angle mode is ' + this.sketch.settings.angleMode);
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }


  /**
   *
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a Vector, or the values from a float array.
   *
   * Takes either 1, 2 or 3 arguments.
   *
   * @param {x} x component (or Vector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 
   */
  Vector.prototype.set = function(x, y, z) {
    if (x instanceof Vector) {
      return this.set(x.x, x.y, x.z);
    }
    if (x instanceof Array) {
      return this.set(x[0], x[1], x[2]);
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  /**
   *
   * Gets a copy of the vector, returns a Vector object.
   *
   * @return {Vector} The copy of the Vector object.
   */
  Vector.prototype.get = function() {
    return new Vector(this.x, this.y, this.z);
  };

  /**
   *
   * Adds x, y, and z components to a vector, adds one vector to another. To
   * add two independent vectors together see the static add method
   * which returns a new Vector.
   *
   * @param {x} x component (or Vector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 
   
   * @return {Vector} A reference to the Vector object (allow chaining)
   */
  Vector.prototype.add = function(x, y, z) {
    if (x instanceof Vector) {
      return this.add(x.x, x.y, x.z);
    }
    if (x instanceof Array) {
      return this.add(x[0], x[1], x[2]);
    }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  /**
   *
   * Subtracts x, y, and z components from a vector, subtracts one vector from another. To
   * subtract two independent vectors together see the static subtract method
   * which returns a new Vector.   
   *
   * @param {x} x component (or Vector or array of 3 numbers)
   * @param {y} y component 
   * @param {z} z component 
   
   * @return {Vector} A reference to the Vector object (allow chaining)
   */
  Vector.prototype.sub = function(x, y, z) {
    if (x instanceof Vector) {
      return this.sub(x.x, x.y, x.z);
    }
    if (x instanceof Array) {
      return this.sub(x[0], x[1], x[2]);
    }
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
   * @return {Vector} A reference to the Vector object (allow chaining)
   */
  Vector.prototype.mult = function(n) {
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
   * @return {Vector} A reference to the Vector object (allow chaining)
   */
  Vector.prototype.div = function(n) {
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
  Vector.prototype.mag = function() {
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
  Vector.prototype.magSq = function() {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   *
   * Calculates the dot product of two vectors.
   *
   * @return {number} the dot product
   */
  Vector.prototype.dot = function(x, y, z) {
    if (x instanceof Vector) {
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
  Vector.prototype.cross = function(v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new Vector(x, y, z);
  };

  /**
   *
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @param {Vector} the x, y, and z coordinates of a Vector
   *
   * @return {number} the distance
   */
  Vector.prototype.dist = function(v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  /**
   *
   * Normalize the vector to length 1 (make it a unit vector).
   *
   */
  Vector.prototype.normalize = function() {
    return this.div(this.mag());
  };

  /**
   *
   * Limit the magnitude of this vector to the value used for the <b>max</b> parameter.
   *
   * @param {number} the maximum magnitude for the vector
   */
  Vector.prototype.limit = function(l) {
    var mSq = this.magSq();
    if (mSq > l * l) {
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
  Vector.prototype.setMag = function(n) {
    return this.normalize().mult(n);
  };

  /**
   *
   * Calculate the angle of rotation for this vector (only 2D vectors)
   * TODO: deal with AngleMode
   *
   * @return {number} the angle of rotation
   */
  Vector.prototype.heading = function() {
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
  Vector.prototype.rotate2D = function(a) {
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
   * @param {Vector} the vector to lerp to
   * @param {number} The amount of interpolation; some value between 0.0 (old vector) and 1.0 (new vector). 0.1 is very near the new vector. 0.5 is halfway in between.
   */
  Vector.prototype.lerp = function(x, y, z, amt) {
    if (x instanceof Vector) {
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
   * copied by using the <b>Vector.get()</b> method to copy into your own array.
   *
   * return {Array} an array with the 3 values 
   */
  Vector.prototype.array = function() {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods


  /**
   * Make a new 2D unit vector from an angle
   
   * @param {number} The desired angle.
   * @return {Vector} The new Vector object.
   */
  Vector.fromAngle = function(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle), 0);
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @return {Vector} The new Vector object.
   */
  Vector.random2D = function() {
    // TODO: This should include an option to use p5.js seeded random number
    return this.fromAngle(Math.random(Math.PI * 2));
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @return {Vector} The new Vector object.
   */
  Vector.random3D = function() {
    // TODO: This should include an option to use p5.js seeded random number
    var angle = Math.random() * Math.PI * 2;
    var vz = Math.random() * 2 - 1;
    var vx = Math.sqrt(1 - vz * vz) * Math.cos(angle);
    var vy = Math.sqrt(1 - vz * vz) * Math.sin(angle);
    return new Vector(vx, vy, vz);
  };

  Vector.add = function(v1, v2) {
    return v1.get().add(v2);
  };

  Vector.sub = function(v1, v2) {
    return v1.get().sub(v2);
  };

  Vector.mult = function(v, n) {
    return v.get().mult(n);
  };

  Vector.div = function(v, n) {
    return v.get().div(n);
  };

  Vector.dot = function(v1, v2) {
    return v1.dot(v2);
  };

  Vector.cross = function(v1, v2) {
    return v1.cross(v2);
  };

  Vector.dist = function(v1, v2) {
    return v1.dist(v2);
  };

  Vector.lerp = function(v1, v2, amt) {
    return v1.get().lerp(v2, amt);
  };

  /**
   *
   * Calculates and returns the angle (in radians) between two vectors.
   *
   * @param {Vector} the x, y, and z components of a Vector
   * @param {Vector} the x, y, and z components of a Vector
   *
   * @return {number} the angle between
   * 
   * TODO: Needs to account for angleMode
   */
  Vector.angleBetween = function(v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  return PVector;

});
