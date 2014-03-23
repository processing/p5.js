define(function (require) {

  'use strict';

  var p5 = require('core');

  var randConst = 100000;
  var seed = Math.ceil(Math.random() * randConst);

  p5.prototype.randomSeed = function(nseed) {
    //the seed will be a positive (non-zero) number
    seed = Math.ceil(Math.abs(nseed));
  };

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
  p5.prototype.random = function (min, max) {
    var tmp;
    var rand  = Math.sin(seed++) * randConst;
    rand -= Math.floor(rand);

    if (arguments.length === 0) {
      return rand;
    } else
    if (arguments.length === 1) {
      return rand * min;
    } else {
      if (min > max) {
        tmp = min;
        min = max;
        max = tmp;
      }

      return rand * (max-min) + min;
    }
  };

  return p5;

});
