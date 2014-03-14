define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.abs = Math.abs;

  p5.prototype.ceil = Math.ceil;

  p5.prototype.constrain = function(n, l, h) {
    return this.max(this.min(n, h), l);
  };

  p5.prototype.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };

  p5.prototype.exp = Math.exp;

  p5.prototype.floor = Math.floor;

  p5.prototype.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };

  p5.prototype.log = Math.log;

  p5.prototype.mag = function(x, y) {
    return Math.sqrt(x*x+y*y);
  };

  p5.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  p5.prototype.max = Math.max;

  p5.prototype.min = Math.min;

  p5.prototype.norm = function(n, start, stop) { return this.map(n, start, stop, 0, 1); };

  p5.prototype.pow = Math.pow;

  p5.prototype.round = Math.round;

  p5.prototype.sq = function(n) { return n*n; };

  p5.prototype.sqrt = Math.sqrt;

  return p5;

});
