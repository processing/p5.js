(function(exports) {
  exports.abs = function(n) { return Math.abs(n); };
  exports.ceil = function(n) { return Math.ceil(n); };
  exports.constrain = function(n, l, h) { return max(min(n, h), l); };
  exports.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };
  exports.exp = function(n) { return Math.exp(n); };
  exports.floor = function(n) { return Math.floor(n); };
  exports.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };
  exports.log = function(n) { return Math.log(n); };
  exports.mag = function(x, y) { return Math.sqrt(x*x+y*y); };
  exports.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
  exports.max = function(a, b) { return Math.max(a, b); };
  exports.min = function(a, b) { return Math.min(a, b); };
  exports.norm = function(n, start, stop) { return map(n, start, stop, 0, 1); };
  exports.pow = function(n, e) { return Math.pow(n, e); };
  exports.round = function(n) { return Math.round(n); };
  exports.sq = function(n) { return n*n; };
  exports.sqrt = function(n) { return Math.sqrt(n); };
}(window));
