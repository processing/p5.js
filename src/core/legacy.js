/**
 * @for p5
 * @requires core
 * These are functions that are part of the Processing API but are not part of
 * the p5.js API. In some cases they have a new name, in others, they are
 * removed completely. Not all unsupported Processing functions are listed here
 * but we try to include ones that a user coming from Processing might likely
 * call.
 */

import p5 from './main';

p5.prototype.pushStyle = function() {
  throw new Error('pushStyle() not used, see push()');
};

p5.prototype.popStyle = function() {
  throw new Error('popStyle() not used, see pop()');
};

p5.prototype.popMatrix = function() {
  throw new Error('popMatrix() not used, see pop()');
};

p5.prototype.pushMatrix = function() {
  throw new Error('pushMatrix() not used, see push()');
};

export default p5;
