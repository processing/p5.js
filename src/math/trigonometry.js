(function(exports) {

  exports.acos = function(x) { return Math.acos(x); };
  exports.asin = function(x) { return Math.asin(x); };
  exports.atan = function(x) { return Math.atan(x); };
  exports.atan2 = function(y, x) { return Math.atan2(y, x); };
  exports.cos = function(x) { return Math.cos(x); };
  exports.degrees = function(x) { return 360.0*x/(2*Math.PI); };
  exports.radians = function(x) { return 2*Math.PI*x/360.0; };
  exports.sin = function(x) { return Math.sin(x); };
  exports.tan = function(x) { return Math.tan(x); };
}(window));
