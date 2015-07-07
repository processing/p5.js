/**
 * @module Events
 * @submodule Acceleration
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * The system variable deviceOrientation always contains the orientation of
 * the device. The value of this variable will either be set 'landscape'
 * or 'portrait'. If no data is available it will be set to 'undefined'.
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

/**
 * _updatePAccelerations updates the pAcceleration values
 *
 * @private
 */
p5.prototype._updatePAccelerations = function(){
  this._setProperty('pAccelerationX', this.accelerationX);
  this._setProperty('pAccelerationY', this.accelerationY);
  this._setProperty('pAccelerationZ', this.accelerationZ);
};

var move_threshold = 0.5;

/**
 * The setMoveThreshold() function is used to set the movement threshold for
 * the deviceMoved() function.
 *
 * @method setMoveThreshold
 * @param {number} value The threshold value
 */
p5.prototype.setMoveThreshold = function(val){
  if(typeof val === 'number'){
    move_threshold = val;
  }
};

var old_max_axis = '';
var new_max_axis = '';

/**
 * The deviceMoved() function is called when the devices orientation changes
 * by more than the threshold value.
 * @method deviceMoved
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Move the device around
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * The deviceTurned() function is called when the device rotates by
 * more than 90 degrees.
 * @method deviceTurned
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees
 * // to change the value.
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function deviceTurned() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype._ondeviceorientation = function (e) {
  this._setProperty('accelerationX', e.beta);
  this._setProperty('accelerationY', e.gamma);
  this._setProperty('accelerationZ', e.alpha);
  this._handleMotion();
};
p5.prototype._ondevicemotion = function (e) {
  this._setProperty('accelerationX', e.acceleration.x * 2);
  this._setProperty('accelerationY', e.acceleration.y * 2);
  this._setProperty('accelerationZ', e.acceleration.z * 2);
  this._handleMotion();
};
p5.prototype._onMozOrientation = function (e) {
  this._setProperty('accelerationX', e.x);
  this._setProperty('accelerationY', e.y);
  this._setProperty('accelerationZ', e.z);
  this._handleMotion();
};
p5.prototype._handleMotion = function() {
  if (window.orientation === 90 || window.orientation === -90) {
    this._setProperty('deviceOrientation', 'landscape');
  } else if (window.orientation === 0) {
    this._setProperty('deviceOrientation', 'portrait');
  } else if (window.orientation === undefined) {
    this._setProperty('deviceOrientation', 'undefined');
  }
  var deviceMoved = this.deviceMoved || window.deviceMoved;
  if (typeof deviceMoved === 'function') {
    if (Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
      Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
      Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold) {
      deviceMoved();
    }
  }
  var deviceTurned = this.deviceTurned || window.deviceTurned;
  if (typeof deviceTurned === 'function') {
    var max_val = 0;
    if (Math.abs(this.accelerationX) > max_val) {
      max_val = this.accelerationX;
      new_max_axis = 'x';
    }
    if (Math.abs(this.accelerationY) > max_val) {
      max_val = this.accelerationY;
      new_max_axis = 'y';
    }
    if (Math.abs(this.accelerationZ) > max_val) {
      new_max_axis = 'z';
    }
    if (old_max_axis !== '' && old_max_axis !== new_max_axis) {
      deviceTurned(new_max_axis);

    }
    old_max_axis = new_max_axis;
  }
};


module.exports = p5;
