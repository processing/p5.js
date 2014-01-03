define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.abs = Math.abs;

  Processing.prototype.ceil = Math.ceil;

  Processing.prototype.constrain = function(n, l, h) {
    return max(min(n, h), l);
  };

  Processing.prototype.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };

  Processing.prototype.exp = Math.exp;

  Processing.prototype.floor = Math.floor;

  Processing.prototype.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };

  Processing.prototype.log = Math.log;

  Processing.prototype.mag = function(x, y) {
    return Math.sqrt(x*x+y*y);
  };

  Processing.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  Processing.prototype.max = Math.max;

  Processing.prototype.min = Math.min;

  Processing.prototype.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); };

  Processing.prototype.pow = Math.pow;

  Processing.prototype.round = Math.round;

  Processing.prototype.sq = function(n) { return n*n; };

  Processing.prototype.sqrt = Math.sqrt;

  return Processing;

});
