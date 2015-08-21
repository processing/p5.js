'use strict';

var p5 = require('../core/core');

p5.prototype.camera = function(eyeX, eyeY, eyeZ){
  this._graphics.translate(-eyeX, -eyeY, -eyeZ);
};

p5.prototype.perspective = function(fovy,aspect,near,far) {
  this._graphics.uPMatrix.perspective(fovy,aspect,near,far);
};

p5.prototype.ortho = function(left,right,bottom,top,near,far) {
  this._graphics.uPMatrix.ortho(left,right,bottom,top,near,far);
};

module.exports = p5;