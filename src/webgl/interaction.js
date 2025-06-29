/**
 * @module 3D
 * @submodule Interaction
 * @for p5
 * @requires core
 */

import * as constants from '../core/constants';
import { Vector } from '../math/p5.Vector';

function interaction(p5, fn){
  /**
   * Allows the user to orbit around a 3D sketch using a mouse, trackpad, or
   * touchscreen.
   *
   * 3D sketches are viewed through an imaginary camera. Calling
   * `orbitControl()` within the <a href="#/p5/draw">draw()</a> function allows
   * the user to change the camera’s position:
   *
   * ```js
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Rest of sketch.
   * }
   * ```
   *
   * Left-clicking and dragging or swipe motion will rotate the camera position
   * about the center of the sketch. Right-clicking and dragging or multi-swipe
   * will pan the camera position without rotation. Using the mouse wheel
   * (scrolling) or pinch in/out will move the camera further or closer from the
   * center of the sketch.
   *
   * The first three parameters, `sensitivityX`, `sensitivityY`, and
   * `sensitivityZ`, are optional. They’re numbers that set the sketch’s
   * sensitivity to movement along each axis. For example, calling
   * `orbitControl(1, 2, -1)` keeps movement along the x-axis at its default
   * value, makes the sketch twice as sensitive to movement along the y-axis,
   * and reverses motion along the z-axis. By default, all sensitivity values
   * are 1.
   *
   * The fourth parameter, `options`, is also optional. It’s an object that
   * changes the behavior of orbiting. For example, calling
   * `orbitControl(1, 1, 1, options)` keeps the default sensitivity values while
   * changing the behaviors set with `options`. The object can have the
   * following properties:
   *
   * ```js
   * let options = {
   *   // Setting this to false makes mobile interactions smoother by
   *   // preventing accidental interactions with the page while orbiting.
   *   // By default, it's true.
   *   disableTouchActions: true,
   *
   *   // Setting this to true makes the camera always rotate in the
   *   // direction the mouse/touch is moving.
   *   // By default, it's false.
   *   freeRotation: false
   * };
   *
   * orbitControl(1, 1, 1, options);
   * ```
   *
   * @method orbitControl
   * @for p5
   * @param  {Number} [sensitivityX] sensitivity to movement along the x-axis. Defaults to 1.
   * @param  {Number} [sensitivityY] sensitivity to movement along the y-axis. Defaults to 1.
   * @param  {Number} [sensitivityZ] sensitivity to movement along the z-axis. Defaults to 1.
   * @param  {Object} [options] object with two optional properties, `disableTouchActions`
   *                            and `freeRotation`. Both are `Boolean`s. `disableTouchActions`
   *                            defaults to `true` and `freeRotation` defaults to `false`.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A multicolor box on a gray background. The camera angle changes when the user interacts using a mouse, trackpad, or touchscreen.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(30, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A multicolor box on a gray background. The camera angle changes when the user interacts using a mouse, trackpad, or touchscreen.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   // Make the interactions 3X sensitive.
   *   orbitControl(3, 3, 3);
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(30, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A multicolor box on a gray background. The camera angle changes when the user interacts using a mouse, trackpad, or touchscreen.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Create an options object.
   *   let options = {
   *     disableTouchActions: false,
   *     freeRotation: true
   *   };
   *
   *   // Enable orbiting with the mouse.
   *   // Prevent accidental touch actions on touchscreen devices
   *   // and enable free rotation.
   *   orbitControl(1, 1, 1, options);
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(30, 50);
   * }
   * </code>
   * </div>
   */

  // implementation based on three.js 'orbitControls':
  // https://github.com/mrdoob/three.js/blob/6afb8595c0bf8b2e72818e42b64e6fe22707d896/examples/jsm/controls/OrbitControls.js#L22
  fn.orbitControl = function(
    sensitivityX,
    sensitivityY,
    sensitivityZ,
    options
  ) {
    this._assert3d('orbitControl');
    // p5._validateParameters('orbitControl', arguments);

    const cam = this._renderer.states.curCamera;

    if (typeof sensitivityX === 'undefined') {
      sensitivityX = 1;
    }
    if (typeof sensitivityY === 'undefined') {
      sensitivityY = sensitivityX;
    }
    if (typeof sensitivityZ === 'undefined') {
      sensitivityZ = 1;
    }
    if (typeof options !== 'object') {
      options = {};
    }

    // default right-mouse and mouse-wheel behaviors (context menu and scrolling,
    // respectively) are disabled here to allow use of those events for panning and
    // zooming. However, whether or not to disable touch actions is an option.

    // disable context menu for canvas element and add 'contextMenuDisabled'
    // flag to p5 instance
    if (this.contextMenuDisabled !== true) {
      this.canvas.oncontextmenu = () => false;
      this.contextMenuDisabled = true;
    }

    // disable default scrolling behavior on the canvas element and add
    // 'wheelDefaultDisabled' flag to p5 instance
    if (this.wheelDefaultDisabled !== true) {
      this.canvas.onwheel = () => false;
      this.wheelDefaultDisabled = true;
    }

    // disable default touch behavior on the canvas element and add
    // 'touchActionsDisabled' flag to p5 instance
    const { disableTouchActions = true } = options;
    if (this.touchActionsDisabled !== true && disableTouchActions) {
      this.canvas.style['touch-action'] = 'none';
      this.touchActionsDisabled = true;
    }

    // If option.freeRotation is true, the camera always rotates freely in the direction
    // the pointer moves. default value is false (normal behavior)
    const { freeRotation = false } = options;

    // get moved touches.
    const movedTouches = [];

    this.touches.forEach(curTouch => {
      this._renderer.prevTouches.forEach(prevTouch => {
        if (curTouch.id === prevTouch.id) {
          const movedTouch = {
            x: curTouch.x,
            y: curTouch.y,
            px: prevTouch.x,
            py: prevTouch.y
          };
          movedTouches.push(movedTouch);
        }
      });
    });

    this._renderer.prevTouches = this.touches;

    // The idea of using damping is based on the following website. thank you.
    // https://github.com/freshfork/p5.EasyCam/blob/9782964680f6a5c4c9bee825c475d9f2021d5134/p5.easycam.js#L1124

    // variables for interaction
    let deltaRadius = 0;
    let deltaTheta = 0;
    let deltaPhi = 0;
    let moveDeltaX = 0;
    let moveDeltaY = 0;
    // constants for dampingProcess
    const damping = 0.85;
    const rotateAccelerationFactor = 0.6;
    const moveAccelerationFactor = 0.15;
    // For touches, the appropriate scale is different
    // because the distance difference is multiplied.
    const mouseZoomScaleFactor = 0.01;
    const touchZoomScaleFactor = 0.0004;
    const scaleFactor = this.height < this.width ? this.height : this.width;
    // Flag whether the mouse or touch pointer is inside the canvas
    let pointersInCanvas = false;

    // calculate and determine flags and variables.
    if (movedTouches.length > 0) {
      /* for touch */
      // if length === 1, rotate
      // if length > 1, zoom and move

      // for touch, it is calculated based on one moved touch pointer position.
      pointersInCanvas =
        movedTouches[0].x > 0 && movedTouches[0].x < this.width &&
        movedTouches[0].y > 0 && movedTouches[0].y < this.height;

      if (movedTouches.length === 1) {
        const t = movedTouches[0];
        deltaTheta = -sensitivityX * (t.x - t.px) / scaleFactor;
        deltaPhi = sensitivityY * (t.y - t.py) / scaleFactor;
      } else {
        const t0 = movedTouches[0];
        const t1 = movedTouches[1];
        const distWithTouches = Math.hypot(t0.x - t1.x, t0.y - t1.y);
        const prevDistWithTouches = Math.hypot(t0.px - t1.px, t0.py - t1.py);
        const changeDist = distWithTouches - prevDistWithTouches;
        // move the camera farther when the distance between the two touch points
        // decreases, move the camera closer when it increases.
        deltaRadius = -changeDist * sensitivityZ * touchZoomScaleFactor;
        // Move the center of the camera along with the movement of
        // the center of gravity of the two touch points.
        moveDeltaX = 0.5 * (t0.x + t1.x) - 0.5 * (t0.px + t1.px);
        moveDeltaY = 0.5 * (t0.y + t1.y) - 0.5 * (t0.py + t1.py);
      }
      if (this.touches.length > 0) {
        if (pointersInCanvas) {
          // Initiate an interaction if touched in the canvas
          this._renderer.executeRotateAndMove = true;
          this._renderer.executeZoom = true;
        }
      } else {
        // End an interaction when the touch is released
        this._renderer.executeRotateAndMove = false;
        this._renderer.executeZoom = false;
      }
    } else {
      /* for mouse */
      // if wheelDeltaY !== 0, zoom
      // if mouseLeftButton is down, rotate
      // if mouseRightButton is down, move

      // For mouse, it is calculated based on the mouse position.
      pointersInCanvas =
        (this.mouseX > 0 && this.mouseX < this.width) &&
        (this.mouseY > 0 && this.mouseY < this.height);

      if (this._mouseWheelDeltaY !== 0) {
        // zoom the camera depending on the value of _mouseWheelDeltaY.
        // move away if positive, move closer if negative
        deltaRadius = Math.sign(this._mouseWheelDeltaY) * sensitivityZ;
        deltaRadius *= mouseZoomScaleFactor;
        this._mouseWheelDeltaY = 0;
        // start zoom when the mouse is wheeled within the canvas.
        if (pointersInCanvas) this._renderer.executeZoom = true;
      } else {
        // quit zoom when you stop wheeling.
        this._renderer.executeZoom = false;
      }
      if (this.mouseIsPressed) {
        if (this.mouseButton.left) {
          deltaTheta = -sensitivityX * this.movedX / scaleFactor;
          deltaPhi = sensitivityY * this.movedY / scaleFactor;
        } else if (this.mouseButton.right) {
          moveDeltaX = this.movedX;
          moveDeltaY =  this.movedY * cam.yScale;
        }
        // start rotate and move when mouse is pressed within the canvas.
        if (pointersInCanvas) this._renderer.executeRotateAndMove = true;
      } else {
        // quit rotate and move if mouse is released.
        this._renderer.executeRotateAndMove = false;
      }
    }

    // interactions

    // zoom process
    if (deltaRadius !== 0 && this._renderer.executeZoom) {
      // accelerate zoom velocity
      this._renderer.zoomVelocity += deltaRadius;
    }
    if (Math.abs(this._renderer.zoomVelocity) > 0.001) {
      // if freeRotation is true, we use _orbitFree() instead of _orbit()
      if (freeRotation) {
        cam._orbitFree(
          0, 0, this._renderer.zoomVelocity
        );
      } else {
        cam._orbit(
          0, 0, this._renderer.zoomVelocity
        );
      }
      // In orthogonal projection, the scale does not change even if
      // the distance to the gaze point is changed, so the projection matrix
      // needs to be modified.
      if (cam.projMatrix.mat4[15] !== 0) {
        cam.projMatrix.mat4[0] *= Math.pow(
          10, -this._renderer.zoomVelocity
        );
        cam.projMatrix.mat4[5] *= Math.pow(
          10, -this._renderer.zoomVelocity
        );
        // modify uPMatrix
        this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
        this._renderer.states.uPMatrix.mat4[0] = cam.projMatrix.mat4[0];
        this._renderer.states.uPMatrix.mat4[5] = cam.projMatrix.mat4[5];
      }
      // damping
      this._renderer.zoomVelocity *= damping;
    } else {
      this._renderer.zoomVelocity = 0;
    }

    // rotate process
    if ((deltaTheta !== 0 || deltaPhi !== 0) &&
    this._renderer.executeRotateAndMove) {
      // accelerate rotate velocity
      this._renderer.rotateVelocity.add(
        deltaTheta * rotateAccelerationFactor,
        deltaPhi * rotateAccelerationFactor
      );
    }
    if (this._renderer.rotateVelocity.magSq() > 0.000001) {
      // if freeRotation is true, the camera always rotates freely in the direction the pointer moves
      if (freeRotation) {
        cam._orbitFree(
          -this._renderer.rotateVelocity.x,
          this._renderer.rotateVelocity.y,
          0
        );
      } else {
        cam._orbit(
          this._renderer.rotateVelocity.x,
          this._renderer.rotateVelocity.y,
          0
        );
      }
      // damping
      this._renderer.rotateVelocity.mult(damping);
    } else {
      this._renderer.rotateVelocity.set(0, 0);
    }

    // move process
    if ((moveDeltaX !== 0 || moveDeltaY !== 0) &&
    this._renderer.executeRotateAndMove) {
      // Normalize movement distance
      const ndcX = moveDeltaX * 2/this.width;
      const ndcY = -moveDeltaY * 2/this.height;
      // accelerate move velocity
      this._renderer.moveVelocity.add(
        ndcX * moveAccelerationFactor,
        ndcY * moveAccelerationFactor
      );
    }
    if (this._renderer.moveVelocity.magSq() > 0.000001) {
      // Translate the camera so that the entire object moves
      // perpendicular to the line of sight when the mouse is moved
      // or when the centers of gravity of the two touch pointers move.
      const local = cam._getLocalAxes();

      // Calculate the z coordinate in the view coordinates of
      // the center, that is, the distance to the view point
      const diffX = cam.eyeX - cam.centerX;
      const diffY = cam.eyeY - cam.centerY;
      const diffZ = cam.eyeZ - cam.centerZ;
      const viewZ = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);

      // position vector of the center.
      let cv = new Vector(cam.centerX, cam.centerY, cam.centerZ);

      // Calculate the normalized device coordinates of the center.
      cv = cam.cameraMatrix.multiplyPoint(cv);
      cv = this._renderer.states.uPMatrix.multiplyAndNormalizePoint(cv);

      // Move the center by this distance
      // in the normalized device coordinate system.
      cv.x -= this._renderer.moveVelocity.x;
      cv.y -= this._renderer.moveVelocity.y;

      // Calculate the translation vector
      // in the direction perpendicular to the line of sight of center.
      let dx, dy;
      const uP = this._renderer.states.uPMatrix.mat4;

      if (uP[15] === 0) {
        dx = ((uP[8] + cv.x)/uP[0]) * viewZ;
        dy = ((uP[9] + cv.y)/uP[5]) * viewZ;
      } else {
        dx = (cv.x - uP[12])/uP[0];
        dy = (cv.y - uP[13])/uP[5];
      }

      // translate the camera.
      cam.setPosition(
        cam.eyeX + dx * local.x[0] + dy * local.y[0],
        cam.eyeY + dx * local.x[1] + dy * local.y[1],
        cam.eyeZ + dx * local.x[2] + dy * local.y[2]
      );
      // damping
      this._renderer.moveVelocity.mult(damping);
    } else {
      this._renderer.moveVelocity.set(0, 0);
    }

    return this;
  };


  /**
   * Adds a grid and an axes icon to clarify orientation in 3D sketches.
   *
   * `debugMode()` adds a grid that shows where the “ground” is in a sketch. By
   * default, the grid will run through the origin `(0, 0, 0)` of the sketch
   * along the XZ plane. `debugMode()` also adds an axes icon that points along
   * the positive x-, y-, and z-axes. Calling `debugMode()` displays the grid
   * and axes icon with their default size and position.
   *
   * There are four ways to call `debugMode()` with optional parameters to
   * customize the debugging environment.
   *
   * The first way to call `debugMode()` has one parameter, `mode`. If the
   * system constant `GRID` is passed, as in `debugMode(GRID)`, then the grid
   * will be displayed and the axes icon will be hidden. If the constant `AXES`
   * is passed, as in `debugMode(AXES)`, then the axes icon will be displayed
   * and the grid will be hidden.
   *
   * The second way to call `debugMode()` has six parameters. The first
   * parameter, `mode`, selects either `GRID` or `AXES` to be displayed. The
   * next five parameters, `gridSize`, `gridDivisions`, `xOff`, `yOff`, and
   * `zOff` are optional. They’re numbers that set the appearance of the grid
   * (`gridSize` and `gridDivisions`) and the placement of the axes icon
   * (`xOff`, `yOff`, and `zOff`). For example, calling
   * `debugMode(20, 5, 10, 10, 10)` sets the `gridSize` to 20 pixels, the number
   * of `gridDivisions` to 5, and offsets the axes icon by 10 pixels along the
   * x-, y-, and z-axes.
   *
   * The third way to call `debugMode()` has five parameters. The first
   * parameter, `mode`, selects either `GRID` or `AXES` to be displayed. The
   * next four parameters, `axesSize`, `xOff`, `yOff`, and `zOff` are optional.
   * They’re numbers that set the appearance of the size of the axes icon
   * (`axesSize`) and its placement (`xOff`, `yOff`, and `zOff`).
   *
   * The fourth way to call `debugMode()` has nine optional parameters. The
   * first five parameters, `gridSize`, `gridDivisions`, `gridXOff`, `gridYOff`,
   * and `gridZOff` are numbers that set the appearance of the grid. For
   * example, calling `debugMode(100, 5, 0, 0, 0)` sets the `gridSize` to 100,
   * the number of `gridDivisions` to 5, and sets all the offsets to 0 so that
   * the grid is centered at the origin. The next four parameters, `axesSize`,
   * `xOff`, `yOff`, and `zOff` are numbers that set the appearance of the size
   * of the axes icon (`axesSize`) and its placement (`axesXOff`, `axesYOff`,
   * and `axesZOff`). For example, calling
   * `debugMode(100, 5, 0, 0, 0, 50, 10, 10, 10)` sets the `gridSize` to 100,
   * the number of `gridDivisions` to 5, and sets all the offsets to 0 so that
   * the grid is centered at the origin. It then sets the `axesSize` to 50 and
   * offsets the icon 10 pixels along each axis.
   *
   * @method debugMode
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Enable debug mode.
   *   debugMode();
   *
   *   describe('A multicolor box on a gray background. A grid and axes icon are displayed near the box.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(20, 40);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Enable debug mode.
   *   // Only display the axes icon.
   *   debugMode(AXES);
   *
   *   describe('A multicolor box on a gray background. A grid and axes icon are displayed near the box.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(20, 40);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Enable debug mode.
   *   // Only display the grid and customize it:
   *   // - size: 50
   *   // - divisions: 10
   *   // - offsets: 0, 20, 0
   *   debugMode(GRID, 50, 10, 0, 20, 0);
   *
   *   describe('A multicolor box on a gray background. A grid is displayed below the box.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(20, 40);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Enable debug mode.
   *   // Display the grid and axes icon and customize them:
   *   // Grid
   *   // ----
   *   // - size: 50
   *   // - divisions: 10
   *   // - offsets: 0, 20, 0
   *   // Axes
   *   // ----
   *   // - size: 50
   *   // - offsets: 0, 0, 0
   *   debugMode(50, 10, 0, 20, 0, 50, 0, 0, 0);
   *
   *   describe('A multicolor box on a gray background. A grid is displayed below the box. An axes icon is displayed at the center of the box.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.
   *   box(20, 40);
   * }
   * </code>
   * </div>
   */

  /**
   * @method debugMode
   * @param {(GRID|AXES)} mode either GRID or AXES
   */

  /**
   * @method debugMode
   * @param {(GRID|AXES)} mode
   * @param {Number} [gridSize] side length of the grid.
   * @param {Number} [gridDivisions] number of divisions in the grid.
   * @param {Number} [xOff] offset from origin along the x-axis.
   * @param {Number} [yOff] offset from origin along the y-axis.
   * @param {Number} [zOff] offset from origin along the z-axis.
   */

  /**
   * @method debugMode
   * @param {(GRID|AXES)} mode
   * @param {Number} [axesSize] length of axes icon markers.
   * @param {Number} [xOff]
   * @param {Number} [yOff]
   * @param {Number} [zOff]
   */

  /**
   * @method debugMode
   * @param {Number} [gridSize]
   * @param {Number} [gridDivisions]
   * @param {Number} [gridXOff] grid offset from the origin along the x-axis.
   * @param {Number} [gridYOff] grid offset from the origin along the y-axis.
   * @param {Number} [gridZOff] grid offset from the origin along the z-axis.
   * @param {Number} [axesSize]
   * @param {Number} [axesXOff] axes icon offset from the origin along the x-axis.
   * @param {Number} [axesYOff] axes icon offset from the origin along the y-axis.
   * @param {Number} [axesZOff] axes icon offset from the origin along the z-axis.
   */

  fn.debugMode = function(...args) {
    this._assert3d('debugMode');
    // p5._validateParameters('debugMode', args);

    // start by removing existing 'post' registered debug methods
    for (let i = p5.lifecycleHooks.postdraw.length - 1; i >= 0; i--) {
      // test for equality...
      if (
        p5.lifecycleHooks.postdraw[i].toString() === this._grid().toString() ||
        p5.lifecycleHooks.postdraw[i].toString() === this._axesIcon().toString()
      ) {
        p5.lifecycleHooks.postdraw.splice(i, 1);
      }
    }

    // then add new debugMode functions according to the argument list
    if (args[0] === constants.GRID) {
      p5.lifecycleHooks.postdraw.push(
        this._grid(args[1], args[2], args[3], args[4], args[5])
      );
    } else if (args[0] === constants.AXES) {
      p5.lifecycleHooks.postdraw.push(
        this._axesIcon(args[1], args[2], args[3], args[4])
      );
    } else {
      p5.lifecycleHooks.postdraw.push(
        this._grid(args[0], args[1], args[2], args[3], args[4])
      );
      p5.lifecycleHooks.postdraw.push(
        this._axesIcon(args[5], args[6], args[7], args[8])
      );
    }
  };

  /**
   * Turns off <a href="#/p5/debugMode">debugMode()</a> in a 3D sketch.
   *
   * @method noDebugMode
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Enable debug mode.
   *   debugMode();
   *
   *   describe('A multicolor box on a gray background. A grid and axes icon are displayed near the box. They disappear when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the box.
   *   normalMaterial();
   *
   *   // Draw the box.  box(20, 40);
   * }
   *
   * // Disable debug mode when the user double-clicks.
   * function doubleClicked() {
   *   noDebugMode();
   * }
   * </code>
   * </div>
   */
  fn.noDebugMode = function() {
    this._assert3d('noDebugMode');

    // start by removing existing 'post' registered debug methods
    for (let i = p5.lifecycleHooks.postdraw.length - 1; i >= 0; i--) {
      // test for equality...
      if (
        p5.lifecycleHooks.postdraw[i].toString() === this._grid().toString() ||
        p5.lifecycleHooks.postdraw[i].toString() === this._axesIcon().toString()
      ) {
        p5.lifecycleHooks.postdraw.splice(i, 1);
      }
    }
  };

  /**
   * For use with debugMode
   * @private
   * @method _grid
   * @param {Number} [size] size of grid sides
   * @param {Number} [div] number of grid divisions
   * @param {Number} [xOff] offset of grid center from origin in X axis
   * @param {Number} [yOff] offset of grid center from origin in Y axis
   * @param {Number} [zOff] offset of grid center from origin in Z axis
   */
  fn._grid = function(size, numDivs, xOff, yOff, zOff) {
    if (typeof size === 'undefined') {
      size = this.width / 2;
    }
    if (typeof numDivs === 'undefined') {
      // ensure at least 2 divisions
      numDivs = Math.round(size / 30) < 4 ? 4 : Math.round(size / 30);
    }
    if (typeof xOff === 'undefined') {
      xOff = 0;
    }
    if (typeof yOff === 'undefined') {
      yOff = 0;
    }
    if (typeof zOff === 'undefined') {
      zOff = 0;
    }

    const spacing = size / numDivs;
    const halfSize = size / 2;

    return function() {
      this.push();
      this.stroke(
        this._renderer.states.curStrokeColor[0] * 255,
        this._renderer.states.curStrokeColor[1] * 255,
        this._renderer.states.curStrokeColor[2] * 255
      );
      this._renderer.states.setValue('uModelMatrix', this._renderer.states.uModelMatrix.clone());
      this._renderer.states.uModelMatrix.reset();

      // Lines along X axis
      for (let q = 0; q <= numDivs; q++) {
        this.beginShape(this.LINES);
        this.vertex(-halfSize + xOff, yOff, q * spacing - halfSize + zOff);
        this.vertex(+halfSize + xOff, yOff, q * spacing - halfSize + zOff);
        this.endShape();
      }

      // Lines along Z axis
      for (let i = 0; i <= numDivs; i++) {
        this.beginShape(this.LINES);
        this.vertex(i * spacing - halfSize + xOff, yOff, -halfSize + zOff);
        this.vertex(i * spacing - halfSize + xOff, yOff, +halfSize + zOff);
        this.endShape();
      }

      this.pop();
    };
  };

  /**
   * For use with debugMode
   * @private
   * @method _axesIcon
   * @param {Number} [size] size of axes icon lines
   * @param {Number} [xOff] offset of icon from origin in X axis
   * @param {Number} [yOff] offset of icon from origin in Y axis
   * @param {Number} [zOff] offset of icon from origin in Z axis
   */
  fn._axesIcon = function(size, xOff, yOff, zOff) {
    if (typeof size === 'undefined') {
      size = this.width / 20 > 40 ? this.width / 20 : 40;
    }
    if (typeof xOff === 'undefined') {
      xOff = -this.width / 4;
    }
    if (typeof yOff === 'undefined') {
      yOff = xOff;
    }
    if (typeof zOff === 'undefined') {
      zOff = xOff;
    }

    return () => {
      this.push();
      this._renderer.states.setValue('uModelMatrix', this._renderer.states.uModelMatrix.clone());
      this._renderer.states.uModelMatrix.reset();

      // X axis
      this.strokeWeight(2);
      this.stroke(255, 0, 0);
      this.beginShape(this.LINES);
      this.vertex(xOff, yOff, zOff);
      this.vertex(xOff + size, yOff, zOff);
      this.endShape();
      // Y axis
      this.stroke(0, 255, 0);
      this.beginShape(this.LINES);
      this.vertex(xOff, yOff, zOff);
      this.vertex(xOff, yOff + size, zOff);
      this.endShape();
      // Z axis
      this.stroke(0, 0, 255);
      this.beginShape(this.LINES);
      this.vertex(xOff, yOff, zOff);
      this.vertex(xOff, yOff, zOff + size);
      this.endShape();
      this.pop();
    };
  };
}

export default interaction;

if(typeof p5 !== 'undefined'){
  interaction(p5, p5.prototype);
}
