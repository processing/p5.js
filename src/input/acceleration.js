
//my shitty acceleration stuff

define(function (require){

  'use strict';

  var p5 = require('core');
  
  p5.prototype.deviceOrientation = undefined;
  //not sure what a good default would be

  p5.prototype.accelerationX = 0;
  p5.prototype.accelerationY = 0;
  p5.prototype.accelerationZ = 0;

  p5.prototype.pAccelerationX = 0;
  p5.prototype.pAccelerationY = 0;
  p5.prototype.pAccelerationZ = 0;

  p5.prototype._updatePAccelerations = function(){
    this._setProperty('pAccelerationX', this.accelerationX);
    this._setProperty('pAccelerationY', this.accelerationY);
    this._setProperty('pAccelerationZ', this.accelerationZ);
  };

  var move_threshold = 0.5;

  p5.prototype.setMoveThreshold = function(val){
    if(typeof val === 'number'){
      move_threshold = val;
    }
  };

  var old_max_axis = '';
  var new_max_axis = '';

  p5.prototype.ondevicemotion = function (e) {
    this._setProperty('accelerationX', e.accelerationIncludingGravity.x);
    this._setProperty('accelerationY', e.accelerationIncludingGravity.y);
    this._setProperty('accelerationZ', e.accelerationIncludingGravity.z);

    //sets orientation property
    //device is horizontal
    if(window.orientation === 90 || window.orientation === -90){
      this._setProperty('deviceOrientation', 'landscape');
    }
    else if (window.orientation === 0){ //device is vertical
      this._setProperty('deviceOrientation', 'portrait');
    }
    else if (window.orientation === undefined){
      //in case the device doesn't support this function
      //I don't know if this is a good idea
      this._setProperty('deviceOrientation', 'undefined');
    }

    var onDeviceMove = this.onDeviceMove || window.onDeviceMove;
    if (typeof onDeviceMove === 'function') {
      if(Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
          Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
          Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold ){
        onDeviceMove();
      }
    }

    var onDeviceTurn = this.onDeviceTurn || window.onDeviceTurn;
    if (typeof onDeviceTurn === 'function') {
      //set current_max_axis
      var max_val = 0;
      if(Math.abs(this.accelerationX) > max_val){
        max_val = this.accelerationX;
        new_max_axis = 'x';
      }
      if(Math.abs(this.accelerationY) > max_val){
        max_val = this.accelerationY;
        new_max_axis = 'y';
      }
      if(Math.abs(this.accelerationZ) > max_val){
        new_max_axis = 'z'; //max_val is now irrelevant
      }
      
      //call the actual method
      if(old_max_axis !== '' && old_max_axis !== new_max_axis){
        onDeviceTurn(new_max_axis);
      }

      old_max_axis = new_max_axis;
    }
  };


  return p5;
});
