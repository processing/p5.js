
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');

  p5.Graphics3D = function(elt, pInst) {
    p5.Graphics.call(this, constants.WEBGL, elt, pInst);
    this._pInst._setProperty('graphics', this);
    return this;
  };

  p5.Graphics3D.prototype = Object.create(p5.Graphics.prototype);

  p5.Graphics3D.prototype.line = function(x1, y1, x2, y2) {
    // if (!this._pInst._doStroke) {
    //   return;
    // }
    // var ctx = this.drawingContext;
    // if (ctx.strokeStyle === 'rgba(0,0,0,0)') {
    //   return;
    // }
    // ctx.beginPath();
    // ctx.moveTo(x1, y1);
    // ctx.lineTo(x2, y2);
    // ctx.stroke();

    return this;
  };

  p5.Graphics3D.prototype.scale = function() {
    // var x = 1.0,
    //   y = 1.0;
    // if (arguments.length === 1) {
    //   x = y = arguments[0];
    // } else {
    //   x = arguments[0];
    //   y = arguments[1];
    // }
    // this.drawingContext.scale(x, y);

    return this;
  };

  p5.Graphics3D.prototype.push = function() {
    //this.drawingContext.save();
  };


  p5.Graphics3D.prototype.pop = function() {
    //this.drawingContext.restore();
  };
  
  return p5.Graphics3D;
});