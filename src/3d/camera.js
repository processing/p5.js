'use strict';

var p5 = require('../core/core');

p5.prototype.camera = function(eyeX, eyeY, eyeZ){
  this._validateParameters(
    'camera',
    arguments,
    [
      ['Number', 'Number', 'Number']
    ]
  );
  this._graphics.translate(-eyeX, -eyeY, -eyeZ);
};

p5.prototype.perspective = function(fovy,aspect,near,far) {
  this._validateParameters(
    'perspective',
    arguments,
    [
      ['Number', 'Number', 'Number', 'Number']
    ]
  );
  this._graphics.uPMatrix.perspective(fovy,aspect,near,far);
  this._graphics._setCamera = true;
};

p5.prototype.ortho = function(left,right,bottom,top,near,far) {
  this._validateParameters(
    'ortho',
    perspective,
    [
      ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
    ]
  );
  left /= this.width;
  right /= this.width;
  top /= this.height;
  bottom /= this.height;
  this._graphics.uPMatrix.ortho(left,right,bottom,top,near,far);
  this._graphics._setCamera = true;
};

module.exports = p5;