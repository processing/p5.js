/**
 * @module Math
 * @submodule Random
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  var seeded = false;

  // Linear Congruential Generator
  // Variant of a Lehman Generator 
  var lcg = (function() {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
        // m is basically chosen to be large (as it is the max period)
        // and for its relationships to a and c
    var m = 4294967296,
        // a - 1 should be divisible by m's prime factors
        a = 1664525,
        // c and m should be co-prime
        c = 1013904223,
        seed, z;
    return {
      setSeed : function(val) {
        z = seed = val || Math.round(Math.random() * m);
      },
      getSeed : function() {
        return seed;
      },
      rand : function() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1) 
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      }
    };
  }());

  p5.prototype.randomSeed = function(seed) {
    lcg.setSeed(seed);
    seeded = true;
  };

  /**
   * Return a random number.
   *
   * Takes either 0, 1 or 2 arguments.
   * If no argument is given, returns a random number between 0 and 1.
   * If one argument is given, returns a random number between 0 and the number.
   * If two arguments are given, returns a random number between them,
   * inclusive.
   *
   * @method random
   * @param  {x}      min the lower bound
   * @param  {y}      max the upper bound
   * @return {Number}     the random number
   */
  p5.prototype.random = function (min, max) {

    var rand;

    if (seeded) {
      rand  = lcg.rand();
    } else {
      rand = Math.random();
    }

    if (arguments.length === 0) {
      return rand;
    } else
    if (arguments.length === 1) {
      return rand * min;
    } else {
      if (min > max) {
        var tmp = min;
        min = max;
        max = tmp;
      }

      return rand * (max-min) + min;
    }
  };

  return p5;

});



