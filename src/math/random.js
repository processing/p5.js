(function(exports) {
  exports.random = function(x, y) {
    // might want to use this kind of check instead:
    // if (arguments.length === 0) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      return (y-x)*Math.random()+x;
    } else if (typeof x !== 'undefined') { 
      return x*Math.random();
    } else {
      return Math.random();
    }
  };

}(window));
