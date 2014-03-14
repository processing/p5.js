define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Return a random number.
   *
   * Takes either 0, 1 or 2 arguments.
   * If no argument is given, returns a random number between 0 and 1.
   * If one argument is given, returns a random number between 0 and the number.
   * If two arguments are given, returns a random number between them, inclusive.
   *
   * @param  {x}      min
   * @param  {y}      max
   * @return {Number}
   */
  p5.prototype.random = function(x, y) {
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

  return p5;

});
