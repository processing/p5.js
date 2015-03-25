/**
 * @module Input
 * @submodule Acceleration
 * @for p5
 * @requires core
 */
define(function (require){

  'use strict';

  var p5 = require('core');

  /**
   * The system variable deviceOrientation always contains the orientation of
   * the device. The vaule of this varible will either be landscape or portrait.
   *
   * @property deviceOrientation
   */
  p5.prototype.deviceOrientation = undefined;

  /**
   * The system variable accelerationX always contains the acceleration of the
   * device along the x axis. Value is represented as meters per second squared.
   *
   * @property accelerationX
   */
  p5.prototype.accelerationX = 0;

  /**
   * The system variable accelerationY always contains the acceleration of the
   * device along the y axis. Value is represented as meters per second squared.
   *
   * @property accelerationY
   */
  p5.prototype.accelerationY = 0;

  /**
   * The system variable accelerationZ always contains the acceleration of the
   * device along the z axis. Value is represented as meters per second squared.
   *
   * @property accelerationZ
   */
  p5.prototype.accelerationZ = 0;

  /**
   * The system variable pAccelerationX always contains the acceleration of the
   * device along the x axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property pAccelerationX
   */
  p5.prototype.pAccelerationX = 0;

  /**
   * The system variable pAccelerationY always contains the acceleration of the
   * device along the y axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property pAccelerationY
   */
  p5.prototype.pAccelerationY = 0;

  /**
   * The system variable pAccelerationZ always contains the acceleration of the
   * device along the z axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property pAccelerationZ
   */
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
      //In case the device doesn't support this function
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

      if(old_max_axis !== '' && old_max_axis !== new_max_axis){
        onDeviceTurn(new_max_axis);
      }

      old_max_axis = new_max_axis;
    }
  };


  return p5;
});
