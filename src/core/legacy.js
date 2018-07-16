/**
 * @for p5
 * @requires core
 * These are functions that are part of the Processing API but are not part of
 * the p5.js API. In some cases they have a new name, in others, they are
 * removed completely. Not all unsupported Processing functions are listed here
 * but we try to include ones that a user coming from Processing might likely
 * call.
 */

'use strict';

var p5 = require('./main');

p5.prototype.exit = function() {
  throw new Error('exit() not implemented, see remove()');
};

p5.prototype.pushStyle = function() {
  throw new Error('pushStyle() not used, see push()');
};

p5.prototype.popStyle = function() {
  throw new Error('popStyle() not used, see pop()');
};

p5.prototype.size = function() {
  var s = 'size() is not a valid p5 function, to set the size of the ';
  s += 'drawing canvas, please use createCanvas() instead';
  throw new Error(s);
};

module.exports = p5;
