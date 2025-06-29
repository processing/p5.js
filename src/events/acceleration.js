/**
 * @module Events
 * @submodule Acceleration
 * @for p5
 * @requires core
 * @main Events
 */

function acceleration(p5, fn){
  /**
   * The system variable deviceOrientation always contains the orientation of
   * the device. The value of this variable will either be set 'landscape'
   * or 'portrait'. If no data is available it will be set to 'undefined'.
   * either LANDSCAPE or PORTRAIT.
   *
   * @property {(LANDSCAPE|PORTRAIT)} deviceOrientation
   * @readOnly
   */
  fn.deviceOrientation =
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
  fn.accelerationX = 0;

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
  fn.accelerationY = 0;

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
  fn.accelerationZ = 0;

  /**
   * The system variable pAccelerationX always contains the acceleration of the
   * device along the x axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property {Number} pAccelerationX
   * @readOnly
   */
  fn.pAccelerationX = 0;

  /**
   * The system variable pAccelerationY always contains the acceleration of the
   * device along the y axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property {Number} pAccelerationY
   * @readOnly
   */
  fn.pAccelerationY = 0;

  /**
   * The system variable pAccelerationZ always contains the acceleration of the
   * device along the z axis in the frame previous to the current frame. Value
   * is represented as meters per second squared.
   *
   * @property {Number} pAccelerationZ
   * @readOnly
   */
  fn.pAccelerationZ = 0;

  /**
   * _updatePAccelerations updates the pAcceleration values
   *
   * @private
   */
  fn._updatePAccelerations = function () {
    this.pAccelerationX = this.accelerationX;
    this.pAccelerationY = this.accelerationY;
    this.pAccelerationZ = this.accelerationZ;
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
   * let rotationX = 0;            // Angle in degrees
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);   // Create 3D canvas
   * }
   *
   * function draw() {
   *   background(220);                 // Set light gray background
   *   rotateX(radians(rotationX));     // Rotate around X-axis
   *   normalMaterial();                // Apply simple shaded material
   *   box(60);                         // Draw 3D cube (60 units wide)
   *   rotationX = (rotationX + 2) % 360; // Increment rotation (2° per frame)
   * }
   * </code>
   * </div>
   */
  fn.rotationX = 0;

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
   * let rotationY = 0;            // Angle in degrees
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);   // Create 3D canvas
   * }
   *
   * function draw() {
   *   background(220);                 // Set light gray background
   *   rotateY(radians(rotationY));     // Rotate around Y-axis (vertical)
   *   normalMaterial();                // Apply simple shaded material
   *   box(60);                         // Draw 3D cube (60 units wide)
   *   rotationY = (rotationY + 2) % 360; // Increment rotation (2° per frame)
   * }
   * </code>
   * </div>
   */
  fn.rotationY = 0;

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
   * let rotationZ = 0;          // Angle in degrees
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);   // Create 3D canvas
   * }
   *
   * function draw() {
   *   background(220);
   *   rotateZ(radians(rotationZ));     // Rotate around Z-axis
   *   normalMaterial();                // Apply simple shaded material
   *   box(60);                         // Draw 3D cube
   *   rotationZ = (rotationZ + 2) % 360; // Increment rotation angle
   * }
   * </code>
   * </div>
   *
   * @property {Number} rotationZ
   * @readOnly
   */
  fn.rotationZ = 0;

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
  fn.pRotationX = 0;

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
  fn.pRotationY = 0;

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
  fn.pRotationZ = 0;

  let startAngleX = 0;
  let startAngleY = 0;
  let startAngleZ = 0;

  let rotateDirectionX = 'clockwise';
  let rotateDirectionY = 'clockwise';
  let rotateDirectionZ = 'clockwise';

  fn.pRotateDirectionX = undefined;
  fn.pRotateDirectionY = undefined;
  fn.pRotateDirectionZ = undefined;

  fn._updatePRotations = function () {
    this.pRotationX = this.rotationX;
    this.pRotationY = this.rotationY;
    this.pRotationZ = this.rotationZ;
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
  fn.turnAxis = undefined;

  let move_threshold = 0.5;
  let shake_threshold = 30;

  /**
   * The <a href="#/p5/setMoveThreshold">setMoveThreshold()</a> function is used to set the movement threshold for
   * the <a href="#/p5/deviceMoved">deviceMoved()</a> function. The default threshold is set to 0.5.
   *
   * @method setMoveThreshold
   * @param {Number} value The threshold value
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

  fn.setMoveThreshold = function (val) {
    // p5._validateParameters('setMoveThreshold', arguments);
    move_threshold = val;
  };

  /**
   * The <a href="#/p5/setShakeThreshold">setShakeThreshold()</a> function is used to set the movement threshold for
   * the <a href="#/p5/deviceShaken">deviceShaken()</a> function. The default threshold is set to 30.
   *
   * @method setShakeThreshold
   * @param {Number} value The threshold value
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

  fn.setShakeThreshold = function (val) {
    // p5._validateParameters('setShakeThreshold', arguments);
    shake_threshold = val;
  };

  /**
   * The <a href="#/p5/deviceMoved">deviceMoved()</a> function is called when the device is moved by more than
   * the threshold value along X, Y or Z axis. The default threshold is set to 0.5.
   * The threshold value can be changed using <a href="https://p5js.org/reference/p5/setMoveThreshold">setMoveThreshold()</a>.
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
   * The threshold value can be changed using <a href="https://p5js.org/reference/p5/setShakeThreshold">setShakeThreshold()</a>.
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

  fn._ondeviceorientation = function (e) {
    this._updatePRotations();

    // Convert from degrees into current angle mode
    this.rotationX = this._fromDegrees(e.beta);
    this.rotationY = this._fromDegrees(e.gamma);
    this.rotationZ = this._fromDegrees(e.alpha);
    this._handleMotion();
  };
  fn._ondevicemotion = function (e) {
    this._updatePAccelerations();
    this.accelerationX = e.acceleration.x * 2;
    this.accelerationY = e.acceleration.y * 2;
    this.accelerationZ = e.acceleration.z * 2;
    this._handleMotion();
  };
  fn._handleMotion = function () {
    if (window.orientation === 90 || window.orientation === -90) {
      this.deviceOrientation = 'landscape';
    } else if (window.orientation === 0) {
      this.deviceOrientation = 'portrait';
    } else if (window.orientation === undefined) {
      this.deviceOrientation = 'undefined';
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
      // The angles given by rotationX etc is from range [-180 to 180].
      // The following will convert them to [0 to 360] for ease of calculation
      // of cases when the angles wrapped around.
      // _startAngleX will be converted back at the end and updated.

      // Rotations are converted to degrees and all calculations are done in degrees
      const wRX = this._toDegrees(this.rotationX) + 180;
      const wPRX = this._toDegrees(this.pRotationX) + 180;
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
        this.turnAxis = 'X';
        context.deviceTurned();
      }
      this.pRotateDirectionX = rotateDirectionX;
      startAngleX = wSAX - 180;

      // Y-axis is identical to X-axis except for changing some names.
      const wRY = this._toDegrees(this.rotationY) + 180;
      const wPRY = this._toDegrees(this.pRotationY) + 180;
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
        this.turnAxis = 'Y';
        context.deviceTurned();
      }
      this.pRotateDirectionY = rotateDirectionY;
      startAngleY = wSAY - 180;

      // Z-axis is already in the range 0 to 360
      // so no conversion is needed.
      const rotZ = this._toDegrees(this.rotationZ);
      const pRotZ = this._toDegrees(this.pRotationZ);
      if (
        (rotZ - pRotZ > 0 && rotZ - pRotZ < 270) ||
        rotZ - pRotZ < -270
      ) {
        rotateDirectionZ = 'clockwise';
      } else if (
        rotZ - pRotZ < 0 ||
        rotZ - pRotZ > 270
      ) {
        rotateDirectionZ = 'counter-clockwise';
      }
      if (rotateDirectionZ !== this.pRotateDirectionZ) {
        startAngleZ = rotZ;
      }
      if (
        Math.abs(rotZ - startAngleZ) > 90 &&
        Math.abs(rotZ - startAngleZ) < 270
      ) {
        startAngleZ = rotZ;
        this.turnAxis = 'Z';
        context.deviceTurned();
      }
      this.pRotateDirectionZ = rotateDirectionZ;
      this.turnAxis = undefined;
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
}

export default acceleration;

if(typeof p5 !== 'undefined'){
  acceleration(p5, p5.prototype);
}
