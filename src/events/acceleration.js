/**
 * @module Events
 * @submodule Acceleration
 * @for p5
 * @requires core
 * @main Events
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 * The system variable deviceOrientation always contains the orientation of
 * the device. The value of this variable will either be set 'landscape'
 * or 'portrait'. If no data is available it will be set to 'undefined'.
 * either LANDSCAPE or PORTRAIT.
 *
 * @property {(LANDSCAPE|PORTRAIT)} deviceOrientation
 * @readOnly
 */
p5.prototype.deviceOrientation =
  window.innerWidth / window.innerHeight > 1.0 ? 'landscape' : 'portrait';

/**
 * The system variable accelerationX always contains the acceleration of the
 * device along the x axis. Value is represented as meters per second squared.
 *
 * @property {Number} accelerationX
 * @readOnly
 * @example
 * <div>
 * <code>
 * // Move a touchscreen device to register
 * // acceleration changes.
 * function draw() {
 *   background(220, 50);
 *   fill('magenta');
 *   ellipse(width / 2, height / 2, accelerationX);
 *   describe('Magnitude of device acceleration is displayed as ellipse size.');
 * }
 * </code>
 * </div>
 */
p5.prototype.accelerationX = 0;

/**
 * The system variable accelerationY always contains the acceleration of the
 * device along the y axis. Value is represented as meters per second squared.
 *
 * @property {Number} accelerationY
 * @readOnly
 * @example
 * <div>
 * <code>
 * // Move a touchscreen device to register
 * // acceleration changes.
 * function draw() {
 *   background(220, 50);
 *   fill('magenta');
 *   ellipse(width / 2, height / 2, accelerationY);
 *   describe('Magnitude of device acceleration is displayed as ellipse size');
 * }
 * </code>
 * </div>
 */
p5.prototype.accelerationY = 0;

/**
 * The system variable accelerationZ always contains the acceleration of the
 * device along the z axis. Value is represented as meters per second squared.
 *
 * @property {Number} accelerationZ
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // Move a touchscreen device to register
 * // acceleration changes.
 * function draw() {
 *   background(220, 50);
 *   fill('magenta');
 *   ellipse(width / 2, height / 2, accelerationZ);
 *   describe('Magnitude of device acceleration is displayed as ellipse size');
 * }
 * </code>
 * </div>
 */
p5.prototype.accelerationZ = 0;

/**
 * The system variable pAccelerationX always contains the acceleration of the
 * device along the x axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property {Number} pAccelerationX
 * @readOnly
 */
p5.prototype.pAccelerationX = 0;

/**
 * The system variable pAccelerationY always contains the acceleration of the
 * device along the y axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property {Number} pAccelerationY
 * @readOnly
 */
p5.prototype.pAccelerationY = 0;

/**
 * The system variable pAccelerationZ always contains the acceleration of the
 * device along the z axis in the frame previous to the current frame. Value
 * is represented as meters per second squared.
 *
 * @property {Number} pAccelerationZ
 * @readOnly
 */
p5.prototype.pAccelerationZ = 0;

/**
 * _updatePAccelerations updates the pAcceleration values
 *
 * @private
 */
p5.prototype._updatePAccelerations = function() {
  this._setProperty('pAccelerationX', this.accelerationX);
  this._setProperty('pAccelerationY', this.accelerationY);
  this._setProperty('pAccelerationZ', this.accelerationZ);
};

/**
 * The system variable rotationX always contains the rotation of the
 * device along the x axis. If the sketch <a href="#/p5/angleMode">
 * angleMode()</a> is set to DEGREES, the value will be -180 to 180. If
 * it is set to RADIANS, the value will be -PI to PI.
 *
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @property {Number} rotationX
 * @readOnly
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   //rotateZ(radians(rotationZ));
 *   rotateX(radians(rotationX));
 *   //rotateY(radians(rotationY));
 *   box(200, 200, 200);
 *   describe(`red horizontal line right, green vertical line bottom.
 *     black background.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.rotationX = 0;

/**
 * The system variable rotationY always contains the rotation of the
 * device along the y axis. If the sketch <a href="#/p5/angleMode">
 * angleMode()</a> is set to DEGREES, the value will be -90 to 90. If
 * it is set to RADIANS, the value will be -PI/2 to PI/2.
 *
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @property {Number} rotationY
 * @readOnly
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   //rotateZ(radians(rotationZ));
 *   //rotateX(radians(rotationX));
 *   rotateY(radians(rotationY));
 *   box(200, 200, 200);
 *   describe(`red horizontal line right, green vertical line bottom.
 *     black background.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.rotationY = 0;

/**
 * The system variable rotationZ always contains the rotation of the
 * device along the z axis. If the sketch <a href="#/p5/angleMode">
 * angleMode()</a> is set to DEGREES, the value will be 0 to 360. If
 * it is set to RADIANS, the value will be 0 to 2*PI.
 *
 * Unlike rotationX and rotationY, this variable is available for devices
 * with a built-in compass only.
 *
 * Note: The order the rotations are called is important, ie. if used
 * together, it must be called in the order Z-X-Y or there might be
 * unexpected behaviour.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateZ(radians(rotationZ));
 *   //rotateX(radians(rotationX));
 *   //rotateY(radians(rotationY));
 *   box(200, 200, 200);
 *   describe(`red horizontal line right, green vertical line bottom.
 *     black background.`);
 * }
 * </code>
 * </div>
 *
 * @property {Number} rotationZ
 * @readOnly
 */
p5.prototype.rotationZ = 0;

/**
 * The system variable pRotationX always contains the rotation of the
 * device along the x axis in the frame previous to the current frame.
 * If the sketch <a href="#/p5/angleMode"> angleMode()</a> is set to DEGREES,
 * the value will be -180 to 180. If it is set to RADIANS, the value will
 * be -PI to PI.
 *
 * pRotationX can also be used with rotationX to determine the rotate
 * direction of the device along the X-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationX - pRotationX < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * let rotateDirection = 'clockwise';
 *
 * // Simple range conversion to make things simpler.
 * // This is not absolutely necessary but the logic
 * // will be different in that case.
 *
 * let rX = rotationX + 180;
 * let pRX = pRotationX + 180;
 *
 * if ((rX - pRX > 0 && rX - pRX < 270) || rX - pRX < -270) {
 *   rotateDirection = 'clockwise';
 * } else if (rX - pRX < 0 || rX - pRX > 270) {
 *   rotateDirection = 'counter-clockwise';
 * }
 *
 * print(rotateDirection);
 * describe('no image to display.');
 * </code>
 * </div>
 *
 * @property {Number} pRotationX
 * @readOnly
 */
p5.prototype.pRotationX = 0;

/**
 * The system variable pRotationY always contains the rotation of the
 * device along the y axis in the frame previous to the current frame.
 * If the sketch <a href="#/p5/angleMode"> angleMode()</a> is set to DEGREES,
 * the value will be -90 to 90. If it is set to RADIANS, the value will
 * be -PI/2 to PI/2.
 *
 * pRotationY can also be used with rotationY to determine the rotate
 * direction of the device along the Y-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationY - pRotationY < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * let rotateDirection = 'clockwise';
 *
 * // Simple range conversion to make things simpler.
 * // This is not absolutely necessary but the logic
 * // will be different in that case.
 *
 * let rY = rotationY + 180;
 * let pRY = pRotationY + 180;
 *
 * if ((rY - pRY > 0 && rY - pRY < 270) || rY - pRY < -270) {
 *   rotateDirection = 'clockwise';
 * } else if (rY - pRY < 0 || rY - pRY > 270) {
 *   rotateDirection = 'counter-clockwise';
 * }
 * print(rotateDirection);
 * describe('no image to display.');
 * </code>
 * </div>
 *
 * @property {Number} pRotationY
 * @readOnly
 */
p5.prototype.pRotationY = 0;

/**
 * The system variable pRotationZ always contains the rotation of the
 * device along the z axis in the frame previous to the current frame.
 * If the sketch <a href="#/p5/angleMode"> angleMode()</a> is set to DEGREES,
 * the value will be 0 to 360. If it is set to RADIANS, the value will
 * be 0 to 2*PI.
 *
 * pRotationZ can also be used with rotationZ to determine the rotate
 * direction of the device along the Z-axis.
 * @example
 * <div class='norender'>
 * <code>
 * // A simple if statement looking at whether
 * // rotationZ - pRotationZ < 0 is true or not will be
 * // sufficient for determining the rotate direction
 * // in most cases.
 *
 * // Some extra logic is needed to account for cases where
 * // the angles wrap around.
 * let rotateDirection = 'clockwise';
 *
 * if (
 *   (rotationZ - pRotationZ > 0 && rotationZ - pRotationZ < 270) ||
 *   rotationZ - pRotationZ < -270
 * ) {
 *   rotateDirection = 'clockwise';
 * } else if (rotationZ - pRotationZ < 0 || rotationZ - pRotationZ > 270) {
 *   rotateDirection = 'counter-clockwise';
 * }
 * print(rotateDirection);
 * describe('no image to display.');
 * </code>
 * </div>
 *
 * @property {Number} pRotationZ
 * @readOnly
 */
p5.prototype.pRotationZ = 0;

let startAngleX = 0;
let startAngleY = 0;
let startAngleZ = 0;

let rotateDirectionX = 'clockwise';
let rotateDirectionY = 'clockwise';
let rotateDirectionZ = 'clockwise';

p5.prototype.pRotateDirectionX = undefined;
p5.prototype.pRotateDirectionY = undefined;
p5.prototype.pRotateDirectionZ = undefined;

p5.prototype._updatePRotations = function() {
  this._setProperty('pRotationX', this.rotationX);
  this._setProperty('pRotationY', this.rotationY);
  this._setProperty('pRotationZ', this.rotationZ);
};

/**
 * When a device is rotated, the axis that triggers the <a href="#/p5/deviceTurned">deviceTurned()</a>
 * method is stored in the turnAxis variable. The turnAxis variable is only defined within
 * the scope of deviceTurned().
 * @property {String} turnAxis
 * @readOnly
 * @example
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees in the
 * // X-axis to change the value.
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device turns`);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when x-axis turns`);
 * }
 * function deviceTurned() {
 *   if (turnAxis === 'X') {
 *     if (value === 0) {
 *       value = 255;
 *     } else if (value === 255) {
 *       value = 0;
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.turnAxis = undefined;

let move_threshold = 0.5;
let shake_threshold = 30;

/**
 * The <a href="#/p5/setMoveThreshold">setMoveThreshold()</a> function is used to set the movement threshold for
 * the <a href="#/p5/deviceMoved">deviceMoved()</a> function. The default threshold is set to 0.5.
 *
 * @method setMoveThreshold
 * @param {number} value The threshold value
 * @example
 * <div class="norender">
 * <code>
 * // Run this example on a mobile device
 * // You will need to move the device incrementally further
 * // the closer the square's color gets to white in order to change the value.
 *
 * let value = 0;
 * let threshold = 0.5;
 * function setup() {
 *   setMoveThreshold(threshold);
 * }
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device moves`);
 * }
 * function deviceMoved() {
 *   value = value + 5;
 *   threshold = threshold + 0.1;
 *   if (value > 255) {
 *     value = 0;
 *     threshold = 30;
 *   }
 *   setMoveThreshold(threshold);
 * }
 * </code>
 * </div>
 */

p5.prototype.setMoveThreshold = function(val) {
  p5._validateParameters('setMoveThreshold', arguments);
  move_threshold = val;
};

/**
 * The <a href="#/p5/setShakeThreshold">setShakeThreshold()</a> function is used to set the movement threshold for
 * the <a href="#/p5/deviceShaken">deviceShaken()</a> function. The default threshold is set to 30.
 *
 * @method setShakeThreshold
 * @param {number} value The threshold value
 * @example
 * <div class="norender">
 * <code>
 * // Run this example on a mobile device
 * // You will need to shake the device more firmly
 * // the closer the box's fill gets to white in order to change the value.
 *
 * let value = 0;
 * let threshold = 30;
 * function setup() {
 *   setShakeThreshold(threshold);
 * }
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device is being shaked`);
 * }
 * function deviceMoved() {
 *   value = value + 5;
 *   threshold = threshold + 5;
 *   if (value > 255) {
 *     value = 0;
 *     threshold = 30;
 *   }
 *   setShakeThreshold(threshold);
 * }
 * </code>
 * </div>
 */

p5.prototype.setShakeThreshold = function(val) {
  p5._validateParameters('setShakeThreshold', arguments);
  shake_threshold = val;
};

/**
 * The <a href="#/p5/deviceMoved">deviceMoved()</a> function is called when the device is moved by more than
 * the threshold value along X, Y or Z axis. The default threshold is set to 0.5.
 * The threshold value can be changed using <a href="https://p5js.org/reference/#/p5/setMoveThreshold">setMoveThreshold()</a>.
 *
 * @method deviceMoved
 * @example
 * <div class="norender">
 * <code>
 * // Run this example on a mobile device
 * // Move the device around
 * // to change the value.
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device moves`);
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
 * The <a href="#/p5/deviceTurned">deviceTurned()</a> function is called when the device rotates by
 * more than 90 degrees continuously.
 *
 * The axis that triggers the <a href="#/p5/deviceTurned">deviceTurned()</a> method is stored in the turnAxis
 * variable. The <a href="#/p5/deviceTurned">deviceTurned()</a> method can be locked to trigger on any axis:
 * X, Y or Z by comparing the turnAxis variable to 'X', 'Y' or 'Z'.
 *
 * @method deviceTurned
 * @example
 * <div class="norender">
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees
 * // to change the value.
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device turns`);
 * }
 * function deviceTurned() {
 *   if (value === 0) {
 *     value = 255;
 *   } else if (value === 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // Run this example on a mobile device
 * // Rotate the device by 90 degrees in the
 * // X-axis to change the value.
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when x-axis turns`);
 * }
 * function deviceTurned() {
 *   if (turnAxis === 'X') {
 *     if (value === 0) {
 *       value = 255;
 *     } else if (value === 255) {
 *       value = 0;
 *     }
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * The <a href="#/p5/deviceShaken">deviceShaken()</a> function is called when the device total acceleration
 * changes of accelerationX and accelerationY values is more than
 * the threshold value. The default threshold is set to 30.
 * The threshold value can be changed using <a href="https://p5js.org/reference/#/p5/setShakeThreshold">setShakeThreshold()</a>.
 *
 * @method deviceShaken
 * @example
 * <div class="norender">
 * <code>
 * // Run this example on a mobile device
 * // Shake the device to change the value.
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`50-by-50 black rect in center of canvas.
 *     turns white on mobile when device shakes`);
 * }
 * function deviceShaken() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 */

p5.prototype._ondeviceorientation = function(e) {
  this._updatePRotations();
  if (this._angleMode === constants.radians) {
    e.beta = e.beta * (_PI / 180.0);
    e.gamma = e.gamma * (_PI / 180.0);
    e.alpha = e.alpha * (_PI / 180.0);
  }
  this._setProperty('rotationX', e.beta);
  this._setProperty('rotationY', e.gamma);
  this._setProperty('rotationZ', e.alpha);
  this._handleMotion();
};
p5.prototype._ondevicemotion = function(e) {
  this._updatePAccelerations();
  this._setProperty('accelerationX', e.acceleration.x * 2);
  this._setProperty('accelerationY', e.acceleration.y * 2);
  this._setProperty('accelerationZ', e.acceleration.z * 2);
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
  const context = this._isGlobal ? window : this;
  if (typeof context.deviceMoved === 'function') {
    if (
      Math.abs(this.accelerationX - this.pAccelerationX) > move_threshold ||
      Math.abs(this.accelerationY - this.pAccelerationY) > move_threshold ||
      Math.abs(this.accelerationZ - this.pAccelerationZ) > move_threshold
    ) {
      context.deviceMoved();
    }
  }

  if (typeof context.deviceTurned === 'function') {
    // The angles given by rotationX etc is from range -180 to 180.
    // The following will convert them to 0 to 360 for ease of calculation
    // of cases when the angles wrapped around.
    // _startAngleX will be converted back at the end and updated.
    const wRX = this.rotationX + 180;
    const wPRX = this.pRotationX + 180;
    let wSAX = startAngleX + 180;
    if ((wRX - wPRX > 0 && wRX - wPRX < 270) || wRX - wPRX < -270) {
      rotateDirectionX = 'clockwise';
    } else if (wRX - wPRX < 0 || wRX - wPRX > 270) {
      rotateDirectionX = 'counter-clockwise';
    }
    if (rotateDirectionX !== this.pRotateDirectionX) {
      wSAX = wRX;
    }
    if (Math.abs(wRX - wSAX) > 90 && Math.abs(wRX - wSAX) < 270) {
      wSAX = wRX;
      this._setProperty('turnAxis', 'X');
      context.deviceTurned();
    }
    this.pRotateDirectionX = rotateDirectionX;
    startAngleX = wSAX - 180;

    // Y-axis is identical to X-axis except for changing some names.
    const wRY = this.rotationY + 180;
    const wPRY = this.pRotationY + 180;
    let wSAY = startAngleY + 180;
    if ((wRY - wPRY > 0 && wRY - wPRY < 270) || wRY - wPRY < -270) {
      rotateDirectionY = 'clockwise';
    } else if (wRY - wPRY < 0 || wRY - this.pRotationY > 270) {
      rotateDirectionY = 'counter-clockwise';
    }
    if (rotateDirectionY !== this.pRotateDirectionY) {
      wSAY = wRY;
    }
    if (Math.abs(wRY - wSAY) > 90 && Math.abs(wRY - wSAY) < 270) {
      wSAY = wRY;
      this._setProperty('turnAxis', 'Y');
      context.deviceTurned();
    }
    this.pRotateDirectionY = rotateDirectionY;
    startAngleY = wSAY - 180;

    // Z-axis is already in the range 0 to 360
    // so no conversion is needed.
    if (
      (this.rotationZ - this.pRotationZ > 0 &&
        this.rotationZ - this.pRotationZ < 270) ||
      this.rotationZ - this.pRotationZ < -270
    ) {
      rotateDirectionZ = 'clockwise';
    } else if (
      this.rotationZ - this.pRotationZ < 0 ||
      this.rotationZ - this.pRotationZ > 270
    ) {
      rotateDirectionZ = 'counter-clockwise';
    }
    if (rotateDirectionZ !== this.pRotateDirectionZ) {
      startAngleZ = this.rotationZ;
    }
    if (
      Math.abs(this.rotationZ - startAngleZ) > 90 &&
      Math.abs(this.rotationZ - startAngleZ) < 270
    ) {
      startAngleZ = this.rotationZ;
      this._setProperty('turnAxis', 'Z');
      context.deviceTurned();
    }
    this.pRotateDirectionZ = rotateDirectionZ;
    this._setProperty('turnAxis', undefined);
  }
  if (typeof context.deviceShaken === 'function') {
    let accelerationChangeX;
    let accelerationChangeY;
    // Add accelerationChangeZ if acceleration change on Z is needed
    if (this.pAccelerationX !== null) {
      accelerationChangeX = Math.abs(this.accelerationX - this.pAccelerationX);
      accelerationChangeY = Math.abs(this.accelerationY - this.pAccelerationY);
    }
    if (accelerationChangeX + accelerationChangeY > shake_threshold) {
      context.deviceShaken();
    }
  }
};

export default p5;
