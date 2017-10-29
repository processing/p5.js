/**
 * @module Utilities
 * @submodule Iterators
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');


/**
 * Produces an iterator over the numbers in the range. The result is given by
 * starting at start, and adding step repeatedly until the result has gone past
 * stop.
 * In the single parameter version, start is set to zero and step is set to one.
 *
 * @method range
 * @param  {Number}  stop      Number to stop at
 * @return {Iterator}          An iterator that returns the values sequentially
 * @example
 * <div>
 * <code>
 * for(var i of range(width)) {
 *   line(i, 0, i, i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * var start = width / 4;
 * var stop = 3 / 4 * width;
 * for(var i of range(start, stop, 2)) {
 *   line(i, start, i, i);
 *   line(start, i, i, i);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Triangle filling the top right corner of the canvas
 * Square in the center of the canvas, with a striped effect
 */
/**
 * @method range
 * @param  {Number}  start       Number to start at (default 0)
 * @param  {Number}  stop
 * @param  {Number}  [step]      Amount to step by (default 1)
 * @return {Iterator}
 */
p5.prototype.range = function(start, stop, step) {
  if(typeof start === 'undefined') {
    throw new TypeError('Not enough parameters for range');
  }
  if(typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }
  if(typeof step === 'undefined') {
    step = 1;
  }
  var dir = step < 0 ? -1 : 1;
  if(Symbol && Symbol.iterator) {
    var res = {};
    res[Symbol.iterator] = function() {
      var i = start;
      return {
        next: function() {
          if(stop !== null && dir * (i - stop) >= 0) {
            return {
              done: true
            };
          } else {
            i += step;
            return {
              value: i - step,
              done: false
            };
          }
        }
      };
    };
    return res;
  } else {
    throw new Error('range() unsuported');
  }
};
