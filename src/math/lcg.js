/**
 * @module Math
 * @submodule Linear Congruential Generator
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
// m is basically chosen to be large (as it is the max period)
// and for its relationships to a and c
var m = 4294967296;
// a - 1 should be divisible by m's prime factors
var a = 1664525;
// c and m should be co-prime
var c = 1013904223;

// Linear Congruential Generator that stores its state at instance[stateProperty]
p5.prototype._lcg = function(stateProperty) {
  // define the recurrence relationship
  this[stateProperty] = (a * this[stateProperty] + c) % m;
  // return a float in [0, 1)
  // we've just used % m, so / m is always < 1
  return this[stateProperty] / m;
};

p5.prototype._lcgSetSeed = function(stateProperty, val) {
  // pick a random seed if val is undefined or null
  // the >>> 0 casts the seed to an unsigned 32-bit integer
  this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
};
