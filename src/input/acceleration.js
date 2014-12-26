
//my shitty acceleration stuff

define(function (require){

  'use strict';

  var p5 = require('core');

  p5.prototype.accelerationX = 0;
  p5.prototype.accelerationY = 0;
  p5.prototype.accelerationZ = 0;

  p5.prototype.pAccelerationX = 0;
  p5.prototype.pAccelerationY = 0;
  p5.prototype.pAccelerationZ = 0;

  var move_threshold = 0.5;

  p5.prototype.setMoveThreshold = function(val){
    if(typeof val === 'number'){
      move_threshold = val;
    }
  };

  p5.prototype._updatePAccelerations = function(){
    this._setProperty('pAccelerationX', this.accelerationX);
    this._setProperty('pAccelerationY', this.accelerationY);
    this._setProperty('pAccelerationZ', this.accelerationZ);
  };

  p5.prototype.ondevicemotion = function (e) {
    this._setProperty('accelerationX', e.accelerationIncludingGravity.x);
    this._setProperty('accelerationY', e.accelerationIncludingGravity.y);
    this._setProperty('accelerationZ', e.accelerationIncludingGravity.z);

    var onDeviceMove = this.onDeviceMove || window.onDeviceMove;
    if (typeof onDeviceMove === 'function') {
      if(Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
          Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
          Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold ){
        onDeviceMove();
      }
    }
  };


  return p5;
});
