(function(exports) {
  function PVector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  PVector.prototype.set = function (x, y, z) {
    if (x instanceof PVector) { return this.set(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.set(x[0], x[1], x[2]); }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };

  PVector.prototype.get = function () {
    return new PVector(this.x, this.y, this.z);
  };

  PVector.prototype.add = function (x, y, z) {
    if (x instanceof PVector) { return this.add(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.add(x[0], x[1], x[2]); }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  PVector.prototype.sub = function (x, y, z) {
    if (x instanceof PVector) { return this.sub(x.x, x.y, x.z); }
    if (x instanceof Array) { return this.sub(x[0], x[1], x[2]); }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  PVector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  PVector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this; 
  };

  PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  PVector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  PVector.prototype.dot = function (x, y, z) {
    if (x instanceof PVector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  PVector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    return new PVector(x, y, z);
  };

  PVector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
  };

  PVector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  PVector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  PVector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
  };

  PVector.prototype.heading = function () {
    return PHelper.atan2(this.y, this.x);
  };

  PVector.prototype.rotate2D = function (a) {
    var newHeading = this.heading() + PHelper.convertToRadians(a);
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  PVector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof PVector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  PVector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };


  // Static Methods

  PVector.random2D = function () {
    //TODO:
  };

  PVector.random3D = function () {
    //TODO:
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

  PVector.angleBetween = function (v1, v2) {
    return PHelper.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  exports.PVector = PVector;

}(window));
