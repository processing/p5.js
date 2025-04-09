/**
 * @module 3D
 * @submodule Camera
 * @requires core
 */

import { Matrix } from '../math/p5.Matrix';
import { Vector } from '../math/p5.Vector';
import { Quat } from './p5.Quat';
import { RendererGL } from './p5.RendererGL';

class Camera {
  constructor(renderer) {
    this._renderer = renderer;

    this.cameraType = 'default';
    this.useLinePerspective = true;
    this.cameraMatrix = new Matrix(4);
    this.projMatrix = new Matrix(4);
    this.yScale = 1;
  }
  /**
   * The camera’s x-coordinate.
   *
   * By default, the camera’s x-coordinate is set to 0 in "world" space.
   *
   * @property {Number} eyeX
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The text "eyeX: 0" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of eyeX, rounded to the nearest integer.
   *   text(`eyeX: ${round(cam.eyeX)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move left and right as the camera moves. The text "eyeX: X" is written in black beneath the cube. X oscillates between -25 and 25.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new x-coordinate.
   *   let x = 25 * sin(frameCount * 0.01);
   *
   *   // Set the camera's position.
   *   cam.setPosition(x, -400, 800);
   *
   *   // Display the value of eyeX, rounded to the nearest integer.
   *   text(`eyeX: ${round(cam.eyeX)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The camera’s y-coordinate.
   *
   * By default, the camera’s y-coordinate is set to 0 in "world" space.
   *
   * @property {Number} eyeY
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   // Set the camera.
   *   setCamera(cam);
   *
   *   describe(
   *     'A white cube on a gray background. The text "eyeY: -400" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of eyeY, rounded to the nearest integer.
   *   text(`eyeY: ${round(cam.eyeY)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move up and down as the camera moves. The text "eyeY: Y" is written in black beneath the cube. Y oscillates between -374 and -425.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new y-coordinate.
   *   let y = 25 * sin(frameCount * 0.01) - 400;
   *
   *   // Set the camera's position.
   *   cam.setPosition(0, y, 800);
   *
   *   // Display the value of eyeY, rounded to the nearest integer.
   *   text(`eyeY: ${round(cam.eyeY)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The camera’s z-coordinate.
   *
   * By default, the camera’s z-coordinate is set to 800 in "world" space.
   *
   * @property {Number} eyeZ
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The text "eyeZ: 800" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of eyeZ, rounded to the nearest integer.
   *   text(`eyeZ: ${round(cam.eyeZ)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move forward and back as the camera moves. The text "eyeZ: Z" is written in black beneath the cube. Z oscillates between 700 and 900.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new z-coordinate.
   *   let z = 100 * sin(frameCount * 0.01) + 800;
   *
   *   // Set the camera's position.
   *   cam.setPosition(0, -400, z);
   *
   *   // Display the value of eyeZ, rounded to the nearest integer.
   *   text(`eyeZ: ${round(cam.eyeZ)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The x-coordinate of the place where the camera looks.
   *
   * By default, the camera looks at the origin `(0, 0, 0)` in "world" space, so
   * `myCamera.centerX` is 0.
   *
   * @property {Number} centerX
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The text "centerX: 10" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of centerX, rounded to the nearest integer.
   *   text(`centerX: ${round(cam.centerX)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right.
   *   cam.setPosition(100, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move left and right as the camera shifts its focus. The text "centerX: X" is written in black beneath the cube. X oscillates between -15 and 35.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new x-coordinate.
   *   let x = 25 * sin(frameCount * 0.01) + 10;
   *
   *   // Point the camera.
   *   cam.lookAt(x, 20, -30);
   *
   *   // Display the value of centerX, rounded to the nearest integer.
   *   text(`centerX: ${round(cam.centerX)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The y-coordinate of the place where the camera looks.
   *
   * By default, the camera looks at the origin `(0, 0, 0)` in "world" space, so
   * `myCamera.centerY` is 0.
   *
   * @property {Number} centerY
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The text "centerY: 20" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of centerY, rounded to the nearest integer.
   *   text(`centerY: ${round(cam.centerY)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right.
   *   cam.setPosition(100, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move up and down as the camera shifts its focus. The text "centerY: Y" is written in black beneath the cube. Y oscillates between -5 and 45.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new y-coordinate.
   *   let y = 25 * sin(frameCount * 0.01) + 20;
   *
   *   // Point the camera.
   *   cam.lookAt(10, y, -30);
   *
   *   // Display the value of centerY, rounded to the nearest integer.
   *   text(`centerY: ${round(cam.centerY)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The y-coordinate of the place where the camera looks.
   *
   * By default, the camera looks at the origin `(0, 0, 0)` in "world" space, so
   * `myCamera.centerZ` is 0.
   *
   * @property {Number} centerZ
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The text "centerZ: -30" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of centerZ, rounded to the nearest integer.
   *   text(`centerZ: ${round(cam.centerZ)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right.
   *   cam.setPosition(100, -400, 800);
   *
   *   // Point the camera at (10, 20, -30).
   *   cam.lookAt(10, 20, -30);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to move forward and back as the camera shifts its focus. The text "centerZ: Z" is written in black beneath the cube. Z oscillates between -55 and -25.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the new z-coordinate.
   *   let z = 25 * sin(frameCount * 0.01) - 30;
   *
   *   // Point the camera.
   *   cam.lookAt(10, 20, z);
   *
   *   // Display the value of centerZ, rounded to the nearest integer.
   *   text(`centerZ: ${round(cam.centerZ)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The x-component of the camera's "up" vector.
   *
   * The camera's "up" vector orients its y-axis. By default, the "up" vector is
   * `(0, 1, 0)`, so its x-component is 0 in "local" space.
   *
   * @property {Number} upX
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The text "upX: 0" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of upX, rounded to the nearest tenth.
   *   text(`upX: ${round(cam.upX, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to rock back and forth. The text "upX: X" is written in black beneath it. X oscillates between -1 and 1.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the x-component.
   *   let x = sin(frameCount * 0.01);
   *
   *   // Update the camera's "up" vector.
   *   cam.camera(100, -400, 800, 0, 0, 0, x, 1, 0);
   *
   *   // Display the value of upX, rounded to the nearest tenth.
   *   text(`upX: ${round(cam.upX, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The y-component of the camera's "up" vector.
   *
   * The camera's "up" vector orients its y-axis. By default, the "up" vector is
   * `(0, 1, 0)`, so its y-component is 1 in "local" space.
   *
   * @property {Number} upY
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The text "upY: 1" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of upY, rounded to the nearest tenth.
   *   text(`upY: ${round(cam.upY, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube flips upside-down periodically. The text "upY: Y" is written in black beneath it. Y oscillates between -1 and 1.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the y-component.
   *   let y = sin(frameCount * 0.01);
   *
   *   // Update the camera's "up" vector.
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, y, 0);
   *
   *   // Display the value of upY, rounded to the nearest tenth.
   *   text(`upY: ${round(cam.upY, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  /**
   * The z-component of the camera's "up" vector.
   *
   * The camera's "up" vector orients its y-axis. By default, the "up" vector is
   * `(0, 1, 0)`, so its z-component is 0 in "local" space.
   *
   * @property {Number} upZ
   * @readonly
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The text "upZ: 0" is written in black beneath it.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Display the value of upZ, rounded to the nearest tenth.
   *   text(`upZ: ${round(cam.upZ, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cam;
   * let font;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   font = await loadFont('assets/inconsolata.otf');
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-right: (100, -400, 800)
   *   // Point it at the origin: (0, 0, 0)
   *   // Set its "up" vector: (0, 1, 0).
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube appears to rock back and forth. The text "upZ: Z" is written in black beneath it. Z oscillates between -1 and 1.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the box.
   *   fill(255);
   *
   *   // Draw the box.
   *   box();
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *   textFont(font);
   *   fill(0);
   *
   *   // Calculate the z-component.
   *   let z = sin(frameCount * 0.01);
   *
   *   // Update the camera's "up" vector.
   *   cam.camera(100, -400, 800, 0, 0, 0, 0, 1, z);
   *
   *   // Display the value of upZ, rounded to the nearest tenth.
   *   text(`upZ: ${round(cam.upZ, 1)}`, 0, 55);
   * }
   * </code>
   * </div>
   */

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Projection Methods
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Sets a perspective projection for the camera.
   *
   * In a perspective projection, shapes that are further from the camera appear
   * smaller than shapes that are near the camera. This technique, called
   * foreshortening, creates realistic 3D scenes. It’s applied by default in new
   * `p5.Camera` objects.
   *
   * `myCamera.perspective()` changes the camera’s perspective by changing its
   * viewing frustum. The frustum is the volume of space that’s visible to the
   * camera. The frustum’s shape is a pyramid with its top cut off. The camera
   * is placed where the top of the pyramid should be and points towards the
   * base of the pyramid. It views everything within the frustum.
   *
   * The first parameter, `fovy`, is the camera’s vertical field of view. It’s
   * an angle that describes how tall or narrow a view the camera has. For
   * example, calling `myCamera.perspective(0.5)` sets the camera’s vertical
   * field of view to 0.5 radians. By default, `fovy` is calculated based on the
   * sketch’s height and the camera’s default z-coordinate, which is 800. The
   * formula for the default `fovy` is `2 * atan(height / 2 / 800)`.
   *
   * The second parameter, `aspect`, is the camera’s aspect ratio. It’s a number
   * that describes the ratio of the top plane’s width to its height. For
   * example, calling `myCamera.perspective(0.5, 1.5)` sets the camera’s field
   * of view to 0.5 radians and aspect ratio to 1.5, which would make shapes
   * appear thinner on a square canvas. By default, `aspect` is set to
   * `width / height`.
   *
   * The third parameter, `near`, is the distance from the camera to the near
   * plane. For example, calling `myCamera.perspective(0.5, 1.5, 100)` sets the
   * camera’s field of view to 0.5 radians, its aspect ratio to 1.5, and places
   * the near plane 100 pixels from the camera. Any shapes drawn less than 100
   * pixels from the camera won’t be visible. By default, `near` is set to
   * `0.1 * 800`, which is 1/10th the default distance between the camera and
   * the origin.
   *
   * The fourth parameter, `far`, is the distance from the camera to the far
   * plane. For example, calling `myCamera.perspective(0.5, 1.5, 100, 10000)`
   * sets the camera’s field of view to 0.5 radians, its aspect ratio to 1.5,
   * places the near plane 100 pixels from the camera, and places the far plane
   * 10,000 pixels from the camera. Any shapes drawn more than 10,000 pixels
   * from the camera won’t be visible. By default, `far` is set to `10 * 800`,
   * which is 10 times the default distance between the camera and the origin.
   *
   * @for p5.Camera
   * @param  {Number} [fovy]   camera frustum vertical field of view. Defaults to
   *                           `2 * atan(height / 2 / 800)`.
   * @param  {Number} [aspect] camera frustum aspect ratio. Defaults to
   *                           `width / height`.
   * @param  {Number} [near]   distance from the camera to the near clipping plane.
   *                           Defaults to `0.1 * 800`.
   * @param  {Number} [far]    distance from the camera to the far clipping plane.
   *                           Defaults to `10 * 800`.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it at the top-right.
   *   cam2.camera(400, -400, 800);
   *
   *   // Set its fovy to 0.2.
   *   // Set its aspect to 1.5.
   *   // Set its near to 600.
   *   // Set its far to 1200.
   *   cam2.perspective(0.2, 1.5, 600, 1200);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A white cube on a gray background. The camera toggles between a frontal view and a skewed aerial view when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it at the top-right.
   *   cam2.camera(400, -400, 800);
   *
   *   // Set its fovy to 0.2.
   *   // Set its aspect to 1.5.
   *   // Set its near to 600.
   *   // Set its far to 1200.
   *   cam2.perspective(0.2, 1.5, 600, 1200);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A white cube moves left and right on a gray background. The camera toggles between a frontal and a skewed aerial view when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin left and right.
   *   let x = 100 * sin(frameCount * 0.01);
   *   translate(x, 0, 0);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  perspective(fovy, aspect, near, far) {
    this.cameraType = arguments.length > 0 ? 'custom' : 'default';
    if (typeof fovy === 'undefined') {
      fovy = this.defaultCameraFOV;
      // this avoids issue where setting angleMode(DEGREES) before calling
      // perspective leads to a smaller than expected FOV (because
      // _computeCameraDefaultSettings computes in radians)
      this.cameraFOV = fovy;
    } else {
      this.cameraFOV = this._renderer._pInst._toRadians(fovy);
    }
    if (typeof aspect === 'undefined') {
      aspect = this.defaultAspectRatio;
    }
    if (typeof near === 'undefined') {
      near = this.defaultCameraNear;
    }
    if (typeof far === 'undefined') {
      far = this.defaultCameraFar;
    }

    if (near <= 0.0001) {
      near = 0.01;
      console.log(
        'Avoid perspective near plane values close to or below 0. ' +
        'Setting value to 0.01.'
      );
    }

    if (far < near) {
      console.log(
        'Perspective far plane value is less than near plane value. ' +
        'Nothing will be shown.'
      );
    }

    this.aspectRatio = aspect;
    this.cameraNear = near;
    this.cameraFar = far;

    this.projMatrix = new Matrix(4);

    const f = 1.0 / Math.tan(this.cameraFOV / 2);
    const nf = 1.0 / (this.cameraNear - this.cameraFar);

    /* eslint-disable indent */
    this.projMatrix.set(f / aspect, 0, 0, 0,
      0, -f * this.yScale, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0);
    /* eslint-enable indent */

    if (this._isActive()) {
      this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
      this._renderer.states.uPMatrix.set(this.projMatrix);
    }
  }

  /**
   * Sets an orthographic projection for the camera.
   *
   * In an orthographic projection, shapes with the same size always appear the
   * same size, regardless of whether they are near or far from the camera.
   *
   * `myCamera.ortho()` changes the camera’s perspective by changing its viewing
   * frustum from a truncated pyramid to a rectangular prism. The frustum is the
   * volume of space that’s visible to the camera. The camera is placed in front
   * of the frustum and views everything within the frustum. `myCamera.ortho()`
   * has six optional parameters to define the viewing frustum.
   *
   * The first four parameters, `left`, `right`, `bottom`, and `top`, set the
   * coordinates of the frustum’s sides, bottom, and top. For example, calling
   * `myCamera.ortho(-100, 100, 200, -200)` creates a frustum that’s 200 pixels
   * wide and 400 pixels tall. By default, these dimensions are set based on
   * the sketch’s width and height, as in
   * `myCamera.ortho(-width / 2, width / 2, -height / 2, height / 2)`.
   *
   * The last two parameters, `near` and `far`, set the distance of the
   * frustum’s near and far plane from the camera. For example, calling
   * `myCamera.ortho(-100, 100, 200, -200, 50, 1000)` creates a frustum that’s
   * 200 pixels wide, 400 pixels tall, starts 50 pixels from the camera, and
   * ends 1,000 pixels from the camera. By default, `near` and `far` are set to
   * 0 and `max(width, height) + 800`, respectively.
   *
   * @for p5.Camera
   * @param  {Number} [left]   x-coordinate of the frustum’s left plane. Defaults to `-width / 2`.
   * @param  {Number} [right]  x-coordinate of the frustum’s right plane. Defaults to `width / 2`.
   * @param  {Number} [bottom] y-coordinate of the frustum’s bottom plane. Defaults to `height / 2`.
   * @param  {Number} [top]    y-coordinate of the frustum’s top plane. Defaults to `-height / 2`.
   * @param  {Number} [near]   z-coordinate of the frustum’s near plane. Defaults to 0.
   * @param  {Number} [far]    z-coordinate of the frustum’s far plane. Defaults to `max(width, height) + 800`.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Apply an orthographic projection.
   *   cam2.ortho();
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A row of white cubes against a gray background. The camera toggles between a perspective and an orthographic projection when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Apply an orthographic projection.
   *   cam2.ortho();
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A row of white cubes slither like a snake against a gray background. The camera toggles between a perspective and an orthographic projection when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     push();
   *     // Calculate the box's coordinates.
   *     let x = 10 * sin(frameCount * 0.02 + i * 0.6);
   *     let z = -40 * i;
   *     // Translate the origin.
   *     translate(x, 0, z);
   *     // Draw the box.
   *     box(10);
   *     pop();
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  ortho(left, right, bottom, top, near, far) {
    const source = this.fbo || this._renderer;
    if (left === undefined) left = -source.width / 2;
    if (right === undefined) right = +source.width / 2;
    if (bottom === undefined) bottom = -source.height / 2;
    if (top === undefined) top = +source.height / 2;
    if (near === undefined) near = 0;
    if (far === undefined) far = Math.max(source.width, source.height) + 800;
    this.cameraNear = near;
    this.cameraFar = far;
    const w = right - left;
    const h = top - bottom;
    const d = far - near;
    const x = +2.0 / w;
    const y = +2.0 / h * this.yScale;
    const z = -2.0 / d;
    const tx = -(right + left) / w;
    const ty = -(top + bottom) / h;
    const tz = -(far + near) / d;
    this.projMatrix = new Matrix(4);
    /* eslint-disable indent */
    this.projMatrix.set(x, 0, 0, 0,
      0, -y, 0, 0,
      0, 0, z, 0,
      tx, ty, tz, 1);
    /* eslint-enable indent */
    if (this._isActive()) {
      this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
      this._renderer.states.uPMatrix.set(this.projMatrix);
    }
    this.cameraType = 'custom';
  }
  /**
   * Sets the camera's frustum.
   *
   * In a frustum projection, shapes that are further from the camera appear
   * smaller than shapes that are near the camera. This technique, called
   * foreshortening, creates realistic 3D scenes.
   *
   * `myCamera.frustum()` changes the camera’s perspective by changing its
   * viewing frustum. The frustum is the volume of space that’s visible to the
   * camera. The frustum’s shape is a pyramid with its top cut off. The camera
   * is placed where the top of the pyramid should be and points towards the
   * base of the pyramid. It views everything within the frustum.
   *
   * The first four parameters, `left`, `right`, `bottom`, and `top`, set the
   * coordinates of the frustum’s sides, bottom, and top. For example, calling
   * `myCamera.frustum(-100, 100, 200, -200)` creates a frustum that’s 200
   * pixels wide and 400 pixels tall. By default, these coordinates are set
   * based on the sketch’s width and height, as in
   * `myCamera.frustum(-width / 20, width / 20, height / 20, -height / 20)`.
   *
   * The last two parameters, `near` and `far`, set the distance of the
   * frustum’s near and far plane from the camera. For example, calling
   * `myCamera.frustum(-100, 100, 200, -200, 50, 1000)` creates a frustum that’s
   * 200 pixels wide, 400 pixels tall, starts 50 pixels from the camera, and ends
   * 1,000 pixels from the camera. By default, near is set to `0.1 * 800`, which
   * is 1/10th the default distance between the camera and the origin. `far` is
   * set to `10 * 800`, which is 10 times the default distance between the
   * camera and the origin.
   *
   * @for p5.Camera
   * @param  {Number} [left]   x-coordinate of the frustum’s left plane. Defaults to `-width / 20`.
   * @param  {Number} [right]  x-coordinate of the frustum’s right plane. Defaults to `width / 20`.
   * @param  {Number} [bottom] y-coordinate of the frustum’s bottom plane. Defaults to `height / 20`.
   * @param  {Number} [top]    y-coordinate of the frustum’s top plane. Defaults to `-height / 20`.
   * @param  {Number} [near]   z-coordinate of the frustum’s near plane. Defaults to `0.1 * 800`.
   * @param  {Number} [far]    z-coordinate of the frustum’s far plane. Defaults to `10 * 800`.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Adjust the frustum.
   *   // Center it.
   *   // Set its width and height to 20 pixels.
   *   // Place its near plane 300 pixels from the camera.
   *   // Place its far plane 350 pixels from the camera.
   *   cam2.frustum(-10, 10, -10, 10, 300, 350);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A row of white cubes against a gray background. The camera zooms in on one cube when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  frustum(left, right, bottom, top, near, far) {
    if (left === undefined) left = -this._renderer.width * 0.05;
    if (right === undefined) right = +this._renderer.width * 0.05;
    if (bottom === undefined) bottom = +this._renderer.height * 0.05;
    if (top === undefined) top = -this._renderer.height * 0.05;
    if (near === undefined) near = this.defaultCameraNear;
    if (far === undefined) far = this.defaultCameraFar;

    this.cameraNear = near;
    this.cameraFar = far;

    const w = right - left;
    const h = top - bottom;
    const d = far - near;

    const x = +(2.0 * near) / w;
    const y = +(2.0 * near) / h * this.yScale;
    const z = -(2.0 * far * near) / d;

    const tx = (right + left) / w;
    const ty = (top + bottom) / h;
    const tz = -(far + near) / d;

    this.projMatrix = new Matrix(4);

    /* eslint-disable indent */
    this.projMatrix.set(x, 0, 0, 0,
      0, -y, 0, 0,
      tx, ty, tz, -1,
      0, 0, z, 0);
    /* eslint-enable indent */

    if (this._isActive()) {
      this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
      this._renderer.states.uPMatrix.set(this.projMatrix);
    }

    this.cameraType = 'custom';
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Orientation Methods
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Rotate camera view about arbitrary axis defined by x,y,z
   * based on http://learnwebgl.brown37.net/07_cameras/camera_rotating_motion.html
   * @private
   */
  _rotateView(a, x, y, z) {
    let centerX = this.centerX;
    let centerY = this.centerY;
    let centerZ = this.centerZ;

    // move center by eye position such that rotation happens around eye position
    centerX -= this.eyeX;
    centerY -= this.eyeY;
    centerZ -= this.eyeZ;

    const rotation = new Matrix(4); // TODO Maybe pass p5
    rotation.rotate4x4(this._renderer._pInst._toRadians(a), x, y, z);

    /* eslint-disable max-len */
    const rotatedCenter = [
      centerX * rotation.mat4[0] + centerY * rotation.mat4[4] + centerZ * rotation.mat4[8],
      centerX * rotation.mat4[1] + centerY * rotation.mat4[5] + centerZ * rotation.mat4[9],
      centerX * rotation.mat4[2] + centerY * rotation.mat4[6] + centerZ * rotation.mat4[10]
    ];
    /* eslint-enable max-len */

    // add eye position back into center
    rotatedCenter[0] += this.eyeX;
    rotatedCenter[1] += this.eyeY;
    rotatedCenter[2] += this.eyeZ;

    this.camera(
      this.eyeX,
      this.eyeY,
      this.eyeZ,
      rotatedCenter[0],
      rotatedCenter[1],
      rotatedCenter[2],
      this.upX,
      this.upY,
      this.upZ
    );
  }

  /**
   * Rotates the camera in a clockwise/counter-clockwise direction.
   *
   * Rolling rotates the camera without changing its orientation. The rotation
   * happens in the camera’s "local" space.
   *
   * The parameter, `angle`, is the angle the camera should rotate. Passing a
   * positive angle, as in `myCamera.roll(0.001)`, rotates the camera in counter-clockwise direction.
   * Passing a negative angle, as in `myCamera.roll(-0.001)`, rotates the
   * camera in clockwise direction.
   *
   * Note: Angles are interpreted based on the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @method roll
   * @param {Number} angle amount to rotate camera in current
   * <a href="#/p5/angleMode">angleMode</a> units.
   * @example
   * <div>
   * <code>
   * let cam;
   * let delta = 0.01;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   normalMaterial();
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Roll camera according to angle 'delta'
   *   cam.roll(delta);
   *
   *   translate(0, 0, 0);
   *   box(20);
   *   translate(0, 25, 0);
   *   box(20);
   *   translate(0, 26, 0);
   *   box(20);
   *   translate(0, 27, 0);
   *   box(20);
   *   translate(0, 28, 0);
   *   box(20);
   *   translate(0,29, 0);
   *   box(20);
   *   translate(0, 30, 0);
   *   box(20);
   * }
   * </code>
   * </div>
   *
   * @alt
   * camera view rotates in counter clockwise direction with vertically stacked boxes in front of it.
   */
  roll(amount) {
    const local = this._getLocalAxes();
    const axisQuaternion = Quat.fromAxisAngle(
      this._renderer._pInst._toRadians(amount),
      local.z[0], local.z[1], local.z[2]);
    // const upQuat = new p5.Quat(0, this.upX, this.upY, this.upZ);
    const newUpVector = axisQuaternion.rotateVector(
      new Vector(this.upX, this.upY, this.upZ));
    this.camera(
      this.eyeX,
      this.eyeY,
      this.eyeZ,
      this.centerX,
      this.centerY,
      this.centerZ,
      newUpVector.x,
      newUpVector.y,
      newUpVector.z
    );
  }

  /**
   * Rotates the camera left and right.
   *
   * Panning rotates the camera without changing its position. The rotation
   * happens in the camera’s "local" space.
   *
   * The parameter, `angle`, is the angle the camera should rotate. Passing a
   * positive angle, as in `myCamera.pan(0.001)`, rotates the camera to the
   * right. Passing a negative angle, as in `myCamera.pan(-0.001)`, rotates the
   * camera to the left.
   *
   * Note: Angles are interpreted based on the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @param {Number} angle amount to rotate in the current
   *                       <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let delta = 0.001;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube goes in and out of view as the camera pans left and right.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Pan with the camera.
   *   cam.pan(delta);
   *
   *   // Switch directions every 120 frames.
   *   if (frameCount % 120 === 0) {
   *     delta *= -1;
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  pan(amount) {
    const local = this._getLocalAxes();
    this._rotateView(amount, local.y[0], local.y[1], local.y[2]);
  }

  /**
   * Rotates the camera up and down.
   *
   * Tilting rotates the camera without changing its position. The rotation
   * happens in the camera’s "local" space.
   *
   * The parameter, `angle`, is the angle the camera should rotate. Passing a
   * positive angle, as in `myCamera.tilt(0.001)`, rotates the camera down.
   * Passing a negative angle, as in `myCamera.tilt(-0.001)`, rotates the camera
   * up.
   *
   * Note: Angles are interpreted based on the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @param {Number} angle amount to rotate in the current
   *                       <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let delta = 0.001;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube goes in and out of view as the camera tilts up and down.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Pan with the camera.
   *   cam.tilt(delta);
   *
   *   // Switch directions every 120 frames.
   *   if (frameCount % 120 === 0) {
   *     delta *= -1;
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  tilt(amount) {
    const local = this._getLocalAxes();
    this._rotateView(amount, local.x[0], local.x[1], local.x[2]);
  }

  /**
   * Points the camera at a location.
   *
   * `myCamera.lookAt()` changes the camera’s orientation without changing its
   * position.
   *
   * The parameters, `x`, `y`, and `z`, are the coordinates in "world" space
   * where the camera should point. For example, calling
   * `myCamera.lookAt(10, 20, 30)` points the camera at the coordinates
   * `(10, 20, 30)`.
   *
   * @for p5.Camera
   * @param {Number} x x-coordinate of the position where the camera should look in "world" space.
   * @param {Number} y y-coordinate of the position where the camera should look in "world" space.
   * @param {Number} z z-coordinate of the position where the camera should look in "world" space.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to look at a different cube.
   *
   * let cam;
   * let isLookingLeft = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(-30, 0, 0);
   *
   *   describe(
   *     'A red cube and a blue cube on a gray background. The camera switches focus between the cubes when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the box on the left.
   *   push();
   *   // Translate the origin to the left.
   *   translate(-30, 0, 0);
   *   // Style the box.
   *   fill(255, 0, 0);
   *   // Draw the box.
   *   box(20);
   *   pop();
   *
   *   // Draw the box on the right.
   *   push();
   *   // Translate the origin to the right.
   *   translate(30, 0, 0);
   *   // Style the box.
   *   fill(0, 0, 255);
   *   // Draw the box.
   *   box(20);
   *   pop();
   * }
   *
   * // Change the camera's focus when the user double-clicks.
   * function doubleClicked() {
   *   if (isLookingLeft === true) {
   *     cam.lookAt(30, 0, 0);
   *     isLookingLeft = false;
   *   } else {
   *     cam.lookAt(-30, 0, 0);
   *     isLookingLeft = true;
   *   }
   * }
   * </code>
   * </div>
   */
  lookAt(x, y, z) {
    this.camera(
      this.eyeX,
      this.eyeY,
      this.eyeZ,
      x,
      y,
      z,
      this.upX,
      this.upY,
      this.upZ
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Position Methods
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Sets the position and orientation of the camera.
   *
   * `myCamera.camera()` allows objects to be viewed from different angles. It
   * has nine parameters that are all optional.
   *
   * The first three parameters, `x`, `y`, and `z`, are the coordinates of the
   * camera’s position in "world" space. For example, calling
   * `myCamera.camera(0, 0, 0)` places the camera at the origin `(0, 0, 0)`. By
   * default, the camera is placed at `(0, 0, 800)`.
   *
   * The next three parameters, `centerX`, `centerY`, and `centerZ` are the
   * coordinates of the point where the camera faces in "world" space. For
   * example, calling `myCamera.camera(0, 0, 0, 10, 20, 30)` places the camera
   * at the origin `(0, 0, 0)` and points it at `(10, 20, 30)`. By default, the
   * camera points at the origin `(0, 0, 0)`.
   *
   * The last three parameters, `upX`, `upY`, and `upZ` are the components of
   * the "up" vector in "local" space. The "up" vector orients the camera’s
   * y-axis. For example, calling
   * `myCamera.camera(0, 0, 0, 10, 20, 30, 0, -1, 0)` places the camera at the
   * origin `(0, 0, 0)`, points it at `(10, 20, 30)`, and sets the "up" vector
   * to `(0, -1, 0)` which is like holding it upside-down. By default, the "up"
   * vector is `(0, 1, 0)`.
   *
   * @for p5.Camera
   * @param  {Number} [x]        x-coordinate of the camera. Defaults to 0.
   * @param  {Number} [y]        y-coordinate of the camera. Defaults to 0.
   * @param  {Number} [z]        z-coordinate of the camera. Defaults to 800.
   * @param  {Number} [centerX]  x-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [centerY]  y-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [centerZ]  z-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [upX]      x-component of the camera’s "up" vector. Defaults to 0.
   * @param  {Number} [upY]      x-component of the camera’s "up" vector. Defaults to 1.
   * @param  {Number} [upZ]      z-component of the camera’s "up" vector. Defaults to 0.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it at the top-right: (1200, -600, 100)
   *   // Point it at the row of boxes: (-10, -10, 400)
   *   // Set its "up" vector to the default: (0, 1, 0)
   *   cam2.camera(1200, -600, 100, -10, -10, 400, 0, 1, 0);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A row of white cubes against a gray background. The camera toggles between a frontal and an aerial view when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -30);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it at the right: (1200, 0, 100)
   *   // Point it at the row of boxes: (-10, -10, 400)
   *   // Set its "up" vector to the default: (0, 1, 0)
   *   cam2.camera(1200, 0, 100, -10, -10, 400, 0, 1, 0);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A row of white cubes against a gray background. The camera toggles between a static frontal view and an orbiting view when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Update cam2's position.
   *   let x = 1200 * cos(frameCount * 0.01);
   *   let y = -600 * sin(frameCount * 0.01);
   *   cam2.camera(x, y, 100, -10, -10, 400, 0, 1, 0);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -30);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  camera(
    eyeX,
    eyeY,
    eyeZ,
    centerX,
    centerY,
    centerZ,
    upX,
    upY,
    upZ
  ) {
    if (typeof eyeX === 'undefined') {
      eyeX = this.defaultEyeX;
      eyeY = this.defaultEyeY;
      eyeZ = this.defaultEyeZ;
      centerX = eyeX;
      centerY = eyeY;
      centerZ = 0;
      upX = 0;
      upY = 1;
      upZ = 0;
    }

    this.eyeX = eyeX;
    this.eyeY = eyeY;
    this.eyeZ = eyeZ;

    if (typeof centerX !== 'undefined') {
      this.centerX = centerX;
      this.centerY = centerY;
      this.centerZ = centerZ;
    }

    if (typeof upX !== 'undefined') {
      this.upX = upX;
      this.upY = upY;
      this.upZ = upZ;
    }

    const local = this._getLocalAxes();

    // the camera affects the model view matrix, insofar as it
    // inverse translates the world to the eye position of the camera
    // and rotates it.
    /* eslint-disable indent */
    this.cameraMatrix.set(local.x[0], local.y[0], local.z[0], 0,
      local.x[1], local.y[1], local.z[1], 0,
      local.x[2], local.y[2], local.z[2], 0,
      0, 0, 0, 1);
    /* eslint-enable indent */

    const tx = -eyeX;
    const ty = -eyeY;
    const tz = -eyeZ;

    this.cameraMatrix.translate([tx, ty, tz]);

    if (this._isActive()) {
      this._renderer.states.setValue('uViewMatrix', this._renderer.states.uViewMatrix.clone());
      this._renderer.states.uViewMatrix.set(this.cameraMatrix);
    }
    return this;
  }

  /**
   * Moves the camera along its "local" axes without changing its orientation.
   *
   * The parameters, `x`, `y`, and `z`, are the distances the camera should
   * move. For example, calling `myCamera.move(10, 20, 30)` moves the camera 10
   * pixels to the right, 20 pixels down, and 30 pixels backward in its "local"
   * space.
   *
   * @param {Number} x distance to move along the camera’s "local" x-axis.
   * @param {Number} y distance to move along the camera’s "local" y-axis.
   * @param {Number} z distance to move along the camera’s "local" z-axis.
   * @example
   * <div>
   * <code>
   * // Click the canvas to begin detecting key presses.
   *
   * let cam;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam = createCamera();
   *
   *   // Place the camera at the top-right.
   *   cam.setPosition(400, -400, 800);
   *
   *   // Point it at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   // Set the camera.
   *   setCamera(cam);
   *
   *   describe(
   *     'A white cube drawn against a gray background. The cube appears to move when the user presses certain keys.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Move the camera along its "local" axes
   *   // when the user presses certain keys.
   *
   *   // Move horizontally.
   *   if (keyIsDown(LEFT_ARROW)) {
   *     cam.move(-1, 0, 0);
   *   }
   *   if (keyIsDown(RIGHT_ARROW)) {
   *     cam.move(1, 0, 0);
   *   }
   *
   *   // Move vertically.
   *   if (keyIsDown(UP_ARROW)) {
   *     cam.move(0, -1, 0);
   *   }
   *   if (keyIsDown(DOWN_ARROW)) {
   *     cam.move(0, 1, 0);
   *   }
   *
   *   // Move in/out of the screen.
   *   if (keyIsDown('i')) {
   *     cam.move(0, 0, -1);
   *   }
   *   if (keyIsDown('o')) {
   *     cam.move(0, 0, 1);
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  move(x, y, z) {
    const local = this._getLocalAxes();

    // scale local axes by movement amounts
    // based on http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html
    const dx = [local.x[0] * x, local.x[1] * x, local.x[2] * x];
    const dy = [local.y[0] * y, local.y[1] * y, local.y[2] * y];
    const dz = [local.z[0] * z, local.z[1] * z, local.z[2] * z];

    this.camera(
      this.eyeX + dx[0] + dy[0] + dz[0],
      this.eyeY + dx[1] + dy[1] + dz[1],
      this.eyeZ + dx[2] + dy[2] + dz[2],
      this.centerX + dx[0] + dy[0] + dz[0],
      this.centerY + dx[1] + dy[1] + dz[1],
      this.centerZ + dx[2] + dy[2] + dz[2],
      this.upX,
      this.upY,
      this.upZ
    );
  }

  /**
   * Sets the camera’s position in "world" space without changing its
   * orientation.
   *
   * The parameters, `x`, `y`, and `z`, are the coordinates where the camera
   * should be placed. For example, calling `myCamera.setPosition(10, 20, 30)`
   * places the camera at coordinates `(10, 20, 30)` in "world" space.
   *
   * @param {Number} x x-coordinate in "world" space.
   * @param {Number} y y-coordinate in "world" space.
   * @param {Number} z z-coordinate in "world" space.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it closer to the origin.
   *   cam2.setPosition(0, 0, 600);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A row of white cubes against a gray background. The camera toggles the amount of zoom when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -30);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Place it closer to the origin.
   *   cam2.setPosition(0, 0, 600);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A row of white cubes against a gray background. The camera toggles between a static view and a view that zooms in and out when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Update cam2's z-coordinate.
   *   let z = 100 * sin(frameCount * 0.01) + 700;
   *   cam2.setPosition(0, 0, z);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 500);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -30);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  setPosition(x, y, z) {
    const diffX = x - this.eyeX;
    const diffY = y - this.eyeY;
    const diffZ = z - this.eyeZ;

    this.camera(
      x,
      y,
      z,
      this.centerX + diffX,
      this.centerY + diffY,
      this.centerZ + diffZ,
      this.upX,
      this.upY,
      this.upZ
    );
  }

  /**
   * Sets the camera’s position, orientation, and projection by copying another
   * camera.
   *
   * The parameter, `cam`, is the `p5.Camera` object to copy. For example, calling
   * `cam2.set(cam1)` will set `cam2` using `cam1`’s configuration.
   *
   * @param {p5.Camera} cam camera to copy.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to "reset" the camera zoom.
   *
   * let cam1;
   * let cam2;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   cam1 = createCamera();
   *
   *   // Place the camera at the top-right.
   *   cam1.setPosition(400, -400, 800);
   *
   *   // Point it at the origin.
   *   cam1.lookAt(0, 0, 0);
   *
   *   // Create the second camera.
   *   cam2 = createCamera();
   *
   *   // Copy cam1's configuration.
   *   cam2.set(cam1);
   *
   *   // Set the camera.
   *   setCamera(cam2);
   *
   *   describe(
   *     'A white cube drawn against a gray background. The camera slowly moves forward. The camera resets when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Update cam2's position.
   *   cam2.move(0, 0, -1);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // "Reset" the camera when the user double-clicks.
   * function doubleClicked() {
   *   cam2.set(cam1);
   * }
   */
  set(cam) {
    const keyNamesOfThePropToCopy = [
      'eyeX', 'eyeY', 'eyeZ',
      'centerX', 'centerY', 'centerZ',
      'upX', 'upY', 'upZ',
      'cameraFOV', 'aspectRatio', 'cameraNear', 'cameraFar', 'cameraType',
      'yScale', 'useLinePerspective'
    ];
    for (const keyName of keyNamesOfThePropToCopy) {
      this[keyName] = cam[keyName];
    }

    this.cameraMatrix = cam.cameraMatrix.copy();
    this.projMatrix = cam.projMatrix.copy();

    if (this._isActive()) {
      this._renderer.states.setValue('uModelMatrix', this._renderer.states.uModelMatrix.clone());
      this._renderer.states.setValue('uViewMatrix', this._renderer.states.uViewMatrix.clone());
      this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
      this._renderer.states.uModelMatrix.reset();
      this._renderer.states.uViewMatrix.set(this.cameraMatrix);
      this._renderer.states.uPMatrix.set(this.projMatrix);
    }
  }
  /**
   * Sets the camera’s position and orientation to values that are in-between
   * those of two other cameras.
   *
   * `myCamera.slerp()` uses spherical linear interpolation to calculate a
   * position and orientation that’s in-between two other cameras. Doing so is
   * helpful for transitioning smoothly between two perspectives.
   *
   * The first two parameters, `cam0` and `cam1`, are the `p5.Camera` objects
   * that should be used to set the current camera.
   *
   * The third parameter, `amt`, is the amount to interpolate between `cam0` and
   * `cam1`. 0.0 keeps the camera’s position and orientation equal to `cam0`’s,
   * 0.5 sets them halfway between `cam0`’s and `cam1`’s , and 1.0 sets the
   * position and orientation equal to `cam1`’s.
   *
   * For example, calling `myCamera.slerp(cam0, cam1, 0.1)` sets cam’s position
   * and orientation very close to `cam0`’s. Calling
   * `myCamera.slerp(cam0, cam1, 0.9)` sets cam’s position and orientation very
   * close to `cam1`’s.
   *
   * Note: All of the cameras must use the same projection.
   *
   * @param {p5.Camera} cam0 first camera.
   * @param {p5.Camera} cam1 second camera.
   * @param {Number} amt amount of interpolation between 0.0 (`cam0`) and 1.0 (`cam1`).
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let cam0;
   * let cam1;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the main camera.
   *   // Keep its default settings.
   *   cam = createCamera();
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam0 = createCamera();
   *
   *   // Create the second camera.
   *   cam1 = createCamera();
   *
   *   // Place it at the top-right.
   *   cam1.setPosition(400, -400, 800);
   *
   *   // Point it at the origin.
   *   cam1.lookAt(0, 0, 0);
   *
   *   // Set the current camera to cam.
   *   setCamera(cam);
   *
   *   describe('A white cube drawn against a gray background. The camera slowly oscillates between a frontal view and an aerial view.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the amount to interpolate between cam0 and cam1.
   *   let amt = 0.5 * sin(frameCount * 0.01) + 0.5;
   *
   *   // Update the main camera's position and orientation.
   *   cam.slerp(cam0, cam1, amt);
   *
   *   box();
   * }
   * </code>
   * </div>
   */
  slerp(cam0, cam1, amt) {
    // If t is 0 or 1, do not interpolate and set the argument camera.
    if (amt === 0) {
      this.set(cam0);
      return;
    } else if (amt === 1) {
      this.set(cam1);
      return;
    }

    // For this cameras is ortho, assume that cam0 and cam1 are also ortho
    // and interpolate the elements of the projection matrix.
    // Use logarithmic interpolation for interpolation.
    if (this.projMatrix.mat4[15] !== 0) {
        this.projMatrix.setElement(
          0,
          cam0.projMatrix.mat4[0] *
            Math.pow(cam1.projMatrix.mat4[0] / cam0.projMatrix.mat4[0], amt)
        );
        this.projMatrix.setElement(
          5,
          cam0.projMatrix.mat4[5] *
            Math.pow(cam1.projMatrix.mat4[5] / cam0.projMatrix.mat4[5], amt)
        );
      // If the camera is active, make uPMatrix reflect changes in projMatrix.
      if (this._isActive()) {
        this._renderer.states.setValue('uPMatrix', this._renderer.states.uPMatrix.clone());
        this._renderer.states.uPMatrix.mat4 = this.projMatrix.mat4.slice();
      }
    }

    // prepare eye vector and center vector of argument cameras.
    const eye0 = new Vector(cam0.eyeX, cam0.eyeY, cam0.eyeZ);
    const eye1 = new Vector(cam1.eyeX, cam1.eyeY, cam1.eyeZ);
    const center0 = new Vector(cam0.centerX, cam0.centerY, cam0.centerZ);
    const center1 = new Vector(cam1.centerX, cam1.centerY, cam1.centerZ);

    // Calculate the distance between eye and center for each camera.
    // Logarithmically interpolate these with amt.
    const dist0 = Vector.dist(eye0, center0);
    const dist1 = Vector.dist(eye1, center1);
    const lerpedDist = dist0 * Math.pow(dist1 / dist0, amt);

    // Next, calculate the ratio to interpolate the eye and center by a constant
    // ratio for each camera. This ratio is the same for both. Also, with this ratio
    // of points, the distance is the minimum distance of the two points of
    // the same ratio.
    // With this method, if the viewpoint is fixed, linear interpolation is performed
    // at the viewpoint, and if the center is fixed, linear interpolation is performed
    // at the center, resulting in reasonable interpolation. If both move, the point
    // halfway between them is taken.
    const eyeDiff = Vector.sub(eye0, eye1);
    const diffDiff = eye0.copy().sub(eye1).sub(center0).add(center1);
    // Suppose there are two line segments. Consider the distance between the points
    // above them as if they were taken in the same ratio. This calculation figures out
    // a ratio that minimizes this.
    // Each line segment is, a line segment connecting the viewpoint and the center
    // for each camera.
    const divider = diffDiff.magSq();
    let ratio = 1; // default.
    if (divider > 0.000001) {
      ratio = Vector.dot(eyeDiff, diffDiff) / divider;
      ratio = Math.max(0, Math.min(ratio, 1));
    }

    // Take the appropriate proportions and work out the points
    // that are between the new viewpoint and the new center position.
    const lerpedMedium = Vector.lerp(
      Vector.lerp(eye0, center0, ratio),
      Vector.lerp(eye1, center1, ratio),
      amt
    );

    // Prepare each of rotation matrix from their camera matrix
    const rotMat0 = cam0.cameraMatrix.createSubMatrix3x3();
    const rotMat1 = cam1.cameraMatrix.createSubMatrix3x3();

    // get front and up vector from local-coordinate-system.
    const front0 = rotMat0.row(2);
    const front1 = rotMat1.row(2);
    const up0 = rotMat0.row(1);
    const up1 = rotMat1.row(1);

    // prepare new vectors.
    const newFront = new Vector();
    const newUp = new Vector();
    const newEye = new Vector();
    const newCenter = new Vector();

    // Create the inverse matrix of mat0 by transposing mat0,
    // and multiply it to mat1 from the right.
    // This matrix represents the difference between the two.
    // 'deltaRot' means 'difference of rotation matrices'.
    const deltaRot = rotMat1.mult(rotMat0.copy().transpose()); // mat1 is 3x3

    // Calculate the trace and from it the cos value of the angle.
    // An orthogonal matrix is just an orthonormal basis. If this is not the identity
    // matrix, it is a centered orthonormal basis plus some angle of rotation about
    // some axis. That's the angle. Letting this be theta, trace becomes 1+2cos(theta).
    // reference: https://en.wikipedia.org/wiki/Rotation_matrix#Determining_the_angle
    const diag = deltaRot.diagonal();
    let cosTheta = 0.5 * (diag[0] + diag[1] + diag[2] - 1);

    // If the angle is close to 0, the two matrices are very close,
    // so in that case we execute linearly interpolate.
    if (1 - cosTheta < 0.0000001) {
      // Obtain the front vector and up vector by linear interpolation
      // and normalize them.
      // calculate newEye, newCenter with newFront vector.
      newFront.set(Vector.lerp(front0, front1, amt)).normalize();

      newEye.set(newFront).mult(ratio * lerpedDist).add(lerpedMedium);
      newCenter.set(newFront).mult((ratio - 1) * lerpedDist).add(lerpedMedium);

      newUp.set(Vector.lerp(up0, up1, amt)).normalize();

      // set the camera
      this.camera(
        newEye.x, newEye.y, newEye.z,
        newCenter.x, newCenter.y, newCenter.z,
        newUp.x, newUp.y, newUp.z
      );
      return;
    }

    // Calculates the axis vector and the angle of the difference orthogonal matrix.
    // The axis vector is what I explained earlier in the comments.
    // similar calculation is here:
    // https://github.com/mrdoob/three.js/blob/883249620049d1632e8791732808fefd1a98c871/src/math/Quaternion.js#L294
    let a, b, c, sinTheta;
    let invOneMinusCosTheta = 1 / (1 - cosTheta);
    const maxDiag = Math.max(diag[0], diag[1], diag[2]);
    const offDiagSum13 = deltaRot.mat3[1] + deltaRot.mat3[3];
    const offDiagSum26 = deltaRot.mat3[2] + deltaRot.mat3[6];
    const offDiagSum57 = deltaRot.mat3[5] + deltaRot.mat3[7];

    if (maxDiag === diag[0]) {
      a = Math.sqrt((diag[0] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= a;
      b = 0.5 * offDiagSum13 * invOneMinusCosTheta;
      c = 0.5 * offDiagSum26 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[7] - deltaRot.mat3[5]) / a;

    } else if (maxDiag === diag[1]) {
      b = Math.sqrt((diag[1] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= b;
      c = 0.5 * offDiagSum57 * invOneMinusCosTheta;
      a = 0.5 * offDiagSum13 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[2] - deltaRot.mat3[6]) / b;

    } else {
      c = Math.sqrt((diag[2] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= c;
      a = 0.5 * offDiagSum26 * invOneMinusCosTheta;
      b = 0.5 * offDiagSum57 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[3] - deltaRot.mat3[1]) / c;
    }

    // Constructs a new matrix after interpolating the angles.
    // Multiplying mat0 by the first matrix yields mat1, but by creating a state
    // in the middle of that matrix, you can obtain a matrix that is
    // an intermediate state between mat0 and mat1.
    const angle = amt * Math.atan2(sinTheta, cosTheta);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const oneMinusCosAngle = 1 - cosAngle;
    const ab = a * b;
    const bc = b * c;
    const ca = c * a;
    // 3x3
    const lerpedRotMat = new Matrix( [
      cosAngle + oneMinusCosAngle * a * a,
      oneMinusCosAngle * ab + sinAngle * c,
      oneMinusCosAngle * ca - sinAngle * b,
      oneMinusCosAngle * ab - sinAngle * c,
      cosAngle + oneMinusCosAngle * b * b,
      oneMinusCosAngle * bc + sinAngle * a,
      oneMinusCosAngle * ca + sinAngle * b,
      oneMinusCosAngle * bc - sinAngle * a,
      cosAngle + oneMinusCosAngle * c * c
    ]);

    // Multiply this to mat0 from left to get the interpolated front vector.
    // calculate newEye, newCenter with newFront vector.
    lerpedRotMat.multiplyVec(front0, newFront); // this is vec3

    newEye.set(newFront).mult(ratio * lerpedDist).add(lerpedMedium);
    newCenter.set(newFront).mult((ratio - 1) * lerpedDist).add(lerpedMedium);

    lerpedRotMat.multiplyVec(up0, newUp); // this is vec3

    // We also get the up vector in the same way and set the camera.
    // The eye position and center position are calculated based on the front vector.
    this.camera(
      newEye.x, newEye.y, newEye.z,
      newCenter.x, newCenter.y, newCenter.z,
      newUp.x, newUp.y, newUp.z
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Helper Methods
  ////////////////////////////////////////////////////////////////////////////////

  // @TODO: combine this function with _setDefaultCamera to compute these values
  // as-needed
  _computeCameraDefaultSettings() {
    this.defaultAspectRatio = this._renderer.width / this._renderer.height;
    this.defaultEyeX = 0;
    this.defaultEyeY = 0;
    this.defaultEyeZ = 800;
    this.defaultCameraFOV =
      2 * Math.atan(this._renderer.height / 2 / this.defaultEyeZ);
    this.defaultCenterX = 0;
    this.defaultCenterY = 0;
    this.defaultCenterZ = 0;
    this.defaultCameraNear = this.defaultEyeZ * 0.1;
    this.defaultCameraFar = this.defaultEyeZ * 10;
  }

  //detect if user didn't set the camera
  //then call this function below
  _setDefaultCamera() {
    this.cameraFOV = this.defaultCameraFOV;
    this.aspectRatio = this.defaultAspectRatio;
    this.eyeX = this.defaultEyeX;
    this.eyeY = this.defaultEyeY;
    this.eyeZ = this.defaultEyeZ;
    this.centerX = this.defaultCenterX;
    this.centerY = this.defaultCenterY;
    this.centerZ = this.defaultCenterZ;
    this.upX = 0;
    this.upY = 1;
    this.upZ = 0;
    this.cameraNear = this.defaultCameraNear;
    this.cameraFar = this.defaultCameraFar;

    this.perspective();
    this.camera();

    this.cameraType = 'default';
  }

  _resize() {
    // If we're using the default camera, update the aspect ratio
    if (this.cameraType === 'default') {
      this._computeCameraDefaultSettings();
      this.cameraFOV = this.defaultCameraFOV;
      this.aspectRatio = this.defaultAspectRatio;
      this.perspective();
    }
  }

  /**
   * Returns a copy of a camera.
   * @private
   */
  copy() {
    const _cam = new Camera(this._renderer);
    _cam.cameraFOV = this.cameraFOV;
    _cam.aspectRatio = this.aspectRatio;
    _cam.eyeX = this.eyeX;
    _cam.eyeY = this.eyeY;
    _cam.eyeZ = this.eyeZ;
    _cam.centerX = this.centerX;
    _cam.centerY = this.centerY;
    _cam.centerZ = this.centerZ;
    _cam.upX = this.upX;
    _cam.upY = this.upY;
    _cam.upZ = this.upZ;
    _cam.cameraNear = this.cameraNear;
    _cam.cameraFar = this.cameraFar;

    _cam.cameraType = this.cameraType;
    _cam.useLinePerspective = this.useLinePerspective;

    _cam.cameraMatrix = this.cameraMatrix.copy();
    _cam.projMatrix = this.projMatrix.copy();
    _cam.yScale = this.yScale;

    return _cam;
  }

  clone() {
    return this.copy();
  }

  /**
   * Returns a camera's local axes: left-right, up-down, and forward-backward,
   * as defined by vectors in world-space.
   * @private
   */
  _getLocalAxes() {
    // calculate camera local Z vector
    let z0 = this.eyeX - this.centerX;
    let z1 = this.eyeY - this.centerY;
    let z2 = this.eyeZ - this.centerZ;

    // normalize camera local Z vector
    const eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    if (eyeDist !== 0) {
      z0 /= eyeDist;
      z1 /= eyeDist;
      z2 /= eyeDist;
    }

    // calculate camera Y vector
    let y0 = this.upX;
    let y1 = this.upY;
    let y2 = this.upZ;

    // compute camera local X vector as up vector (local Y) cross local Z
    let x0 = y1 * z2 - y2 * z1;
    let x1 = -y0 * z2 + y2 * z0;
    let x2 = y0 * z1 - y1 * z0;

    // recompute y = z cross x
    y0 = z1 * x2 - z2 * x1;
    y1 = -z0 * x2 + z2 * x0;
    y2 = z0 * x1 - z1 * x0;

    // cross product gives area of parallelogram, which is < 1.0 for
    // non-perpendicular unit-length vectors; so normalize x, y here:
    const xmag = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (xmag !== 0) {
      x0 /= xmag;
      x1 /= xmag;
      x2 /= xmag;
    }

    const ymag = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (ymag !== 0) {
      y0 /= ymag;
      y1 /= ymag;
      y2 /= ymag;
    }

    return {
      x: [x0, x1, x2],
      y: [y0, y1, y2],
      z: [z0, z1, z2]
    };
  }

  /**
   * Orbits the camera about center point. For use with orbitControl().
   * @private
   * @param {Number} dTheta change in spherical coordinate theta
   * @param {Number} dPhi change in spherical coordinate phi
   * @param {Number} dRadius change in radius
   */
  _orbit(dTheta, dPhi, dRadius) {
    // Calculate the vector and its magnitude from the center to the viewpoint
    const diffX = this.eyeX - this.centerX;
    const diffY = this.eyeY - this.centerY;
    const diffZ = this.eyeZ - this.centerZ;
    let camRadius = Math.hypot(diffX, diffY, diffZ);
    // front vector. unit vector from center to eye.
    const front = new Vector(diffX, diffY, diffZ).normalize();
    // up vector. normalized camera's up vector.
    const up = new Vector(this.upX, this.upY, this.upZ).normalize(); // y-axis
    // side vector. Right when viewed from the front
    const side = Vector.cross(up, front).normalize(); // x-axis
    // vertical vector. normalized vector of projection of front vector.
    const vertical = Vector.cross(side, up); // z-axis

    // update camRadius
    camRadius *= Math.pow(10, dRadius);
    // prevent zooming through the center:
    if (camRadius < this.cameraNear) {
      camRadius = this.cameraNear;
    }
    if (camRadius > this.cameraFar) {
      camRadius = this.cameraFar;
    }

    // calculate updated camera angle
    // Find the angle between the "up" and the "front", add dPhi to that.
    // angleBetween() may return negative value. Since this specification is subject to change
    // due to version updates, it cannot be adopted, so here we calculate using a method
    // that directly obtains the absolute value.
    const camPhi =
      Math.acos(Math.max(-1, Math.min(1, Vector.dot(front, up)))) + dPhi;
    // Rotate by dTheta in the shortest direction from "vertical" to "side"
    const camTheta = dTheta;

    // Invert camera's upX, upY, upZ if dPhi is below 0 or above PI
    if (camPhi <= 0 || camPhi >= Math.PI) {
      this.upX *= -1;
      this.upY *= -1;
      this.upZ *= -1;
    }

    // update eye vector by calculate new front vector
    up.mult(Math.cos(camPhi));
    vertical.mult(Math.cos(camTheta) * Math.sin(camPhi));
    side.mult(Math.sin(camTheta) * Math.sin(camPhi));

    front.set(up).add(vertical).add(side);

    this.eyeX = camRadius * front.x + this.centerX;
    this.eyeY = camRadius * front.y + this.centerY;
    this.eyeZ = camRadius * front.z + this.centerZ;

    // update camera
    this.camera(
      this.eyeX, this.eyeY, this.eyeZ,
      this.centerX, this.centerY, this.centerZ,
      this.upX, this.upY, this.upZ
    );
  }

  /**
   * Orbits the camera about center point. For use with orbitControl().
   * Unlike _orbit(), the direction of rotation always matches the direction of pointer movement.
   * @private
   * @param {Number} dx the x component of the rotation vector.
   * @param {Number} dy the y component of the rotation vector.
   * @param {Number} dRadius change in radius
   */
  _orbitFree(dx, dy, dRadius) {
    // Calculate the vector and its magnitude from the center to the viewpoint
    const diffX = this.eyeX - this.centerX;
    const diffY = this.eyeY - this.centerY;
    const diffZ = this.eyeZ - this.centerZ;
    let camRadius = Math.hypot(diffX, diffY, diffZ);
    // front vector. unit vector from center to eye.
    const front = new Vector(diffX, diffY, diffZ).normalize();
    // up vector. camera's up vector.
    const up = new Vector(this.upX, this.upY, this.upZ);
    // side vector. Right when viewed from the front. (like x-axis)
    const side = Vector.cross(up, front).normalize();
    // down vector. Bottom when viewed from the front. (like y-axis)
    const down = Vector.cross(front, side);

    // side vector and down vector are no longer used as-is.
    // Create a vector representing the direction of rotation
    // in the form cos(direction)*side + sin(direction)*down.
    // Make the current side vector into this.
    const directionAngle = Math.atan2(dy, dx);
    down.mult(Math.sin(directionAngle));
    side.mult(Math.cos(directionAngle)).add(down);
    // The amount of rotation is the size of the vector (dx, dy).
    const rotAngle = Math.sqrt(dx * dx + dy * dy);
    // The vector that is orthogonal to both the front vector and
    // the rotation direction vector is the rotation axis vector.
    const axis = Vector.cross(front, side);

    // update camRadius
    camRadius *= Math.pow(10, dRadius);
    // prevent zooming through the center:
    if (camRadius < this.cameraNear) {
      camRadius = this.cameraNear;
    }
    if (camRadius > this.cameraFar) {
      camRadius = this.cameraFar;
    }

    // If the axis vector is likened to the z-axis, the front vector is
    // the x-axis and the side vector is the y-axis. Rotate the up and front
    // vectors respectively by thinking of them as rotations around the z-axis.

    // Calculate the components by taking the dot product and
    // calculate a rotation based on that.
    const c = Math.cos(rotAngle);
    const s = Math.sin(rotAngle);
    const dotFront = up.dot(front);
    const dotSide = up.dot(side);
    const ux = dotFront * c + dotSide * s;
    const uy = -dotFront * s + dotSide * c;
    const uz = up.dot(axis);
    up.x = ux * front.x + uy * side.x + uz * axis.x;
    up.y = ux * front.y + uy * side.y + uz * axis.y;
    up.z = ux * front.z + uy * side.z + uz * axis.z;
    // We won't be using the side vector and the front vector anymore,
    // so let's make the front vector into the vector from the center to the new eye.
    side.mult(-s);
    front.mult(c).add(side).mult(camRadius);

    // it's complete. let's update camera.
    this.camera(
      front.x + this.centerX,
      front.y + this.centerY,
      front.z + this.centerZ,
      this.centerX, this.centerY, this.centerZ,
      up.x, up.y, up.z
    );
  }

  /**
   * Returns true if camera is currently attached to renderer.
   * @private
   */
  _isActive() {
    return this === this._renderer.states.curCamera;
  }
};

function camera(p5, fn){
  ////////////////////////////////////////////////////////////////////////////////
  // p5.Prototype Methods
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Sets the position and orientation of the current camera in a 3D sketch.
   *
   * `camera()` allows objects to be viewed from different angles. It has nine
   * parameters that are all optional.
   *
   * The first three parameters, `x`, `y`, and `z`, are the coordinates of the
   * camera’s position. For example, calling `camera(0, 0, 0)` places the camera
   * at the origin `(0, 0, 0)`. By default, the camera is placed at
   * `(0, 0, 800)`.
   *
   * The next three parameters, `centerX`, `centerY`, and `centerZ` are the
   * coordinates of the point where the camera faces. For example, calling
   * `camera(0, 0, 0, 10, 20, 30)` places the camera at the origin `(0, 0, 0)`
   * and points it at `(10, 20, 30)`. By default, the camera points at the
   * origin `(0, 0, 0)`.
   *
   * The last three parameters, `upX`, `upY`, and `upZ` are the components of
   * the "up" vector. The "up" vector orients the camera’s y-axis. For example,
   * calling `camera(0, 0, 0, 10, 20, 30, 0, -1, 0)` places the camera at the
   * origin `(0, 0, 0)`, points it at `(10, 20, 30)`, and sets the "up" vector
   * to `(0, -1, 0)` which is like holding it upside-down. By default, the "up"
   * vector is `(0, 1, 0)`.
   *
   * Note: `camera()` can only be used in WebGL mode.
   *
   * @method camera
   * @for p5
   * @param  {Number} [x]        x-coordinate of the camera. Defaults to 0.
   * @param  {Number} [y]        y-coordinate of the camera. Defaults to 0.
   * @param  {Number} [z]        z-coordinate of the camera. Defaults to 800.
   * @param  {Number} [centerX]  x-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [centerY]  y-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [centerZ]  z-coordinate of the point the camera faces. Defaults to 0.
   * @param  {Number} [upX]      x-component of the camera’s "up" vector. Defaults to 0.
   * @param  {Number} [upY]      y-component of the camera’s "up" vector. Defaults to 1.
   * @param  {Number} [upZ]      z-component of the camera’s "up" vector. Defaults to 0.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white cube on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Move the camera to the top-right.
   *   camera(200, -400, 800);
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white cube apperas to sway left and right on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the camera's x-coordinate.
   *   let x = 400 * cos(frameCount * 0.01);
   *
   *   // Orbit the camera around the box.
   *   camera(x, -400, 800);
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Adjust the range sliders to change the camera's position.
   *
   * let xSlider;
   * let ySlider;
   * let zSlider;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create slider objects to set the camera's coordinates.
   *   xSlider = createSlider(-400, 400, 400);
   *   xSlider.position(0, 100);
   *   xSlider.size(100);
   *   ySlider = createSlider(-400, 400, -200);
   *   ySlider.position(0, 120);
   *   ySlider.size(100);
   *   zSlider = createSlider(0, 1600, 800);
   *   zSlider.position(0, 140);
   *   zSlider.size(100);
   *
   *   describe(
   *     'A white cube drawn against a gray background. Three range sliders appear beneath the image. The camera position changes when the user moves the sliders.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get the camera's coordinates from the sliders.
   *   let x = xSlider.value();
   *   let y = ySlider.value();
   *   let z = zSlider.value();
   *
   *   // Move the camera.
   *   camera(x, y, z);
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  fn.camera = function (...args) {
    this._assert3d('camera');
    // p5._validateParameters('camera', args);
    this._renderer.camera(...args);
    return this;
  };

  /**
   * Sets a perspective projection for the current camera in a 3D sketch.
   *
   * In a perspective projection, shapes that are further from the camera appear
   * smaller than shapes that are near the camera. This technique, called
   * foreshortening, creates realistic 3D scenes. It’s applied by default in
   * WebGL mode.
   *
   * `perspective()` changes the camera’s perspective by changing its viewing
   * frustum. The frustum is the volume of space that’s visible to the camera.
   * Its shape is a pyramid with its top cut off. The camera is placed where
   * the top of the pyramid should be and views everything between the frustum’s
   * top (near) plane and its bottom (far) plane.
   *
   * The first parameter, `fovy`, is the camera’s vertical field of view. It’s
   * an angle that describes how tall or narrow a view the camera has. For
   * example, calling `perspective(0.5)` sets the camera’s vertical field of
   * view to 0.5 radians. By default, `fovy` is calculated based on the sketch’s
   * height and the camera’s default z-coordinate, which is 800. The formula for
   * the default `fovy` is `2 * atan(height / 2 / 800)`.
   *
   * The second parameter, `aspect`, is the camera’s aspect ratio. It’s a number
   * that describes the ratio of the top plane’s width to its height. For
   * example, calling `perspective(0.5, 1.5)` sets the camera’s field of view to
   * 0.5 radians and aspect ratio to 1.5, which would make shapes appear thinner
   * on a square canvas. By default, aspect is set to `width / height`.
   *
   * The third parameter, `near`, is the distance from the camera to the near
   * plane. For example, calling `perspective(0.5, 1.5, 100)` sets the camera’s
   * field of view to 0.5 radians, its aspect ratio to 1.5, and places the near
   * plane 100 pixels from the camera. Any shapes drawn less than 100 pixels
   * from the camera won’t be visible. By default, near is set to `0.1 * 800`,
   * which is 1/10th the default distance between the camera and the origin.
   *
   * The fourth parameter, `far`, is the distance from the camera to the far
   * plane. For example, calling `perspective(0.5, 1.5, 100, 10000)` sets the
   * camera’s field of view to 0.5 radians, its aspect ratio to 1.5, places the
   * near plane 100 pixels from the camera, and places the far plane 10,000
   * pixels from the camera. Any shapes drawn more than 10,000 pixels from the
   * camera won’t be visible. By default, far is set to `10 * 800`, which is 10
   * times the default distance between the camera and the origin.
   *
   * Note: `perspective()` can only be used in WebGL mode.
   *
   * @method  perspective
   * @for p5
   * @param  {Number} [fovy]   camera frustum vertical field of view. Defaults to
   *                           `2 * atan(height / 2 / 800)`.
   * @param  {Number} [aspect] camera frustum aspect ratio. Defaults to
   *                           `width / height`.
   * @param  {Number} [near]   distance from the camera to the near clipping plane.
   *                           Defaults to `0.1 * 800`.
   * @param  {Number} [far]    distance from the camera to the far clipping plane.
   *                           Defaults to `10 * 800`.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Double-click to squeeze the box.
   *
   * let isSqueezed = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white rectangular prism on a gray background. The box appears to become thinner when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Place the camera at the top-right.
   *   camera(400, -400, 800);
   *
   *   if (isSqueezed === true) {
   *     // Set fovy to 0.2.
   *     // Set aspect to 1.5.
   *     perspective(0.2, 1.5);
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Change the camera's perspective when the user double-clicks.
   * function doubleClicked() {
   *   isSqueezed = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white rectangular prism on a gray background. The prism moves away from the camera until it disappears.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Place the camera at the top-right.
   *   camera(400, -400, 800);
   *
   *   // Set fovy to 0.2.
   *   // Set aspect to 1.5.
   *   // Set near to 600.
   *   // Set far to 1200.
   *   perspective(0.2, 1.5, 600, 1200);
   *
   *   // Move the origin away from the camera.
   *   let x = -frameCount;
   *   let y = frameCount;
   *   let z = -2 * frameCount;
   *   translate(x, y, z);
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  fn.perspective = function (...args) {
    this._assert3d('perspective');
    // p5._validateParameters('perspective', args);
    this._renderer.perspective(...args);
    return this;
  };


  /**
   * Enables or disables perspective for lines in 3D sketches.
   *
   * In WebGL mode, lines can be drawn with a thinner stroke when they’re
   * further from the camera. Doing so gives them a more realistic appearance.
   *
   * By default, lines are drawn differently based on the type of perspective
   * being used:
   * - `perspective()` and `frustum()` simulate a realistic perspective. In
   * these modes, stroke weight is affected by the line’s distance from the
   * camera. Doing so results in a more natural appearance. `perspective()` is
   * the default mode for 3D sketches.
   * - `ortho()` doesn’t simulate a realistic perspective. In this mode, stroke
   * weights are consistent regardless of the line’s distance from the camera.
   * Doing so results in a more predictable and consistent appearance.
   *
   * `linePerspective()` can override the default line drawing mode.
   *
   * The parameter, `enable`, is optional. It’s a `Boolean` value that sets the
   * way lines are drawn. If `true` is passed, as in `linePerspective(true)`,
   * then lines will appear thinner when they are further from the camera. If
   * `false` is passed, as in `linePerspective(false)`, then lines will have
   * consistent stroke weights regardless of their distance from the camera. By
   * default, `linePerspective()` is enabled.
   *
   * Calling `linePerspective()` without passing an argument returns `true` if
   * it's enabled and `false` if not.
   *
   * Note: `linePerspective()` can only be used in WebGL mode.
   *
   * @method linePerspective
   * @for p5
   * @param {Boolean} enable whether to enable line perspective.
   *
   * @example
   * <div>
   * <code>
   * // Double-click the canvas to toggle the line perspective.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe(
   *     'A white cube with black edges on a gray background. Its edges toggle between thick and thin when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the line perspective when the user double-clicks.
   * function doubleClicked() {
   *   let isEnabled = linePerspective();
   *   linePerspective(!isEnabled);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click the canvas to toggle the line perspective.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe(
   *     'A row of cubes with black edges on a gray background. Their edges toggle between thick and thin when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use an orthographic projection.
   *   ortho();
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   *
   * // Toggle the line perspective when the user double-clicks.
   * function doubleClicked() {
   *   let isEnabled = linePerspective();
   *   linePerspective(!isEnabled);
   * }
   * </code>
   * </div>
   */
  /**
   * @method linePerspective
   * @return {boolean} whether line perspective is enabled.
   */
  fn.linePerspective = function (enable) {
    // p5._validateParameters('linePerspective', arguments);
    if (!(this._renderer instanceof RendererGL)) {
      throw new Error('linePerspective() must be called in WebGL mode.');
    }
    return this._renderer.linePerspective(enable);
  };


  /**
   * Sets an orthographic projection for the current camera in a 3D sketch.
   *
   * In an orthographic projection, shapes with the same size always appear the
   * same size, regardless of whether they are near or far from the camera.
   *
   * `ortho()` changes the camera’s perspective by changing its viewing frustum
   * from a truncated pyramid to a rectangular prism. The camera is placed in
   * front of the frustum and views everything between the frustum’s near plane
   * and its far plane. `ortho()` has six optional parameters to define the
   * frustum.
   *
   * The first four parameters, `left`, `right`, `bottom`, and `top`, set the
   * coordinates of the frustum’s sides, bottom, and top. For example, calling
   * `ortho(-100, 100, 200, -200)` creates a frustum that’s 200 pixels wide and
   * 400 pixels tall. By default, these coordinates are set based on the
   * sketch’s width and height, as in
   * `ortho(-width / 2, width / 2, -height / 2, height / 2)`.
   *
   * The last two parameters, `near` and `far`, set the distance of the
   * frustum’s near and far plane from the camera. For example, calling
   * `ortho(-100, 100, 200, 200, 50, 1000)` creates a frustum that’s 200 pixels
   * wide, 400 pixels tall, starts 50 pixels from the camera, and ends 1,000
   * pixels from the camera. By default, `near` and `far` are set to 0 and
   * `max(width, height) + 800`, respectively.
   *
   * Note: `ortho()` can only be used in WebGL mode.
   *
   * @method  ortho
   * @for p5
   * @param  {Number} [left]   x-coordinate of the frustum’s left plane. Defaults to `-width / 2`.
   * @param  {Number} [right]  x-coordinate of the frustum’s right plane. Defaults to `width / 2`.
   * @param  {Number} [bottom] y-coordinate of the frustum’s bottom plane. Defaults to `height / 2`.
   * @param  {Number} [top]    y-coordinate of the frustum’s top plane. Defaults to `-height / 2`.
   * @param  {Number} [near]   z-coordinate of the frustum’s near plane. Defaults to 0.
   * @param  {Number} [far]    z-coordinate of the frustum’s far plane. Defaults to `max(width, height) + 800`.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A row of tiny, white cubes on a gray background. All the cubes appear the same size.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Apply an orthographic projection.
   *   ortho();
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white cube on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Apply an orthographic projection.
   *   // Center the frustum.
   *   // Set its width and height to 20.
   *   // Place its near plane 300 pixels from the camera.
   *   // Place its far plane 350 pixels from the camera.
   *   ortho(-10, 10, -10, 10, 300, 350);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.ortho = function (...args) {
    this._assert3d('ortho');
    // p5._validateParameters('ortho', args);
    this._renderer.ortho(...args);
    return this;
  };

  /**
   * Sets the frustum of the current camera in a 3D sketch.
   *
   * In a frustum projection, shapes that are further from the camera appear
   * smaller than shapes that are near the camera. This technique, called
   * foreshortening, creates realistic 3D scenes.
   *
   * `frustum()` changes the default camera’s perspective by changing its
   * viewing frustum. The frustum is the volume of space that’s visible to the
   * camera. The frustum’s shape is a pyramid with its top cut off. The camera
   * is placed where the top of the pyramid should be and points towards the
   * base of the pyramid. It views everything within the frustum.
   *
   * The first four parameters, `left`, `right`, `bottom`, and `top`, set the
   * coordinates of the frustum’s sides, bottom, and top. For example, calling
   * `frustum(-100, 100, 200, -200)` creates a frustum that’s 200 pixels wide
   * and 400 pixels tall. By default, these coordinates are set based on the
   * sketch’s width and height, as in
   * `ortho(-width / 20, width / 20, height / 20, -height / 20)`.
   *
   * The last two parameters, `near` and `far`, set the distance of the
   * frustum’s near and far plane from the camera. For example, calling
   * `ortho(-100, 100, 200, -200, 50, 1000)` creates a frustum that’s 200 pixels
   * wide, 400 pixels tall, starts 50 pixels from the camera, and ends 1,000
   * pixels from the camera. By default, near is set to `0.1 * 800`, which is
   * 1/10th the default distance between the camera and the origin. `far` is set
   * to `10 * 800`, which is 10 times the default distance between the camera
   * and the origin.
   *
   * Note: `frustum()` can only be used in WebGL mode.
   *
   * @method frustum
   * @for p5
   * @param  {Number} [left]   x-coordinate of the frustum’s left plane. Defaults to `-width / 20`.
   * @param  {Number} [right]  x-coordinate of the frustum’s right plane. Defaults to `width / 20`.
   * @param  {Number} [bottom] y-coordinate of the frustum’s bottom plane. Defaults to `height / 20`.
   * @param  {Number} [top]    y-coordinate of the frustum’s top plane. Defaults to `-height / 20`.
   * @param  {Number} [near]   z-coordinate of the frustum’s near plane. Defaults to `0.1 * 800`.
   * @param  {Number} [far]    z-coordinate of the frustum’s far plane. Defaults to `10 * 800`.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A row of white cubes on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Apply the default frustum projection.
   *   frustum();
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   describe('A white cube on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Adjust the frustum.
   *   // Center it.
   *   // Set its width and height to 20 pixels.
   *   // Place its near plane 300 pixels from the camera.
   *   // Place its far plane 350 pixels from the camera.
   *   frustum(-10, 10, -10, 10, 300, 350);
   *
   *   // Translate the origin toward the camera.
   *   translate(-10, 10, 600);
   *
   *   // Rotate the coordinate system.
   *   rotateY(-0.1);
   *   rotateX(-0.1);
   *
   *   // Draw the row of boxes.
   *   for (let i = 0; i < 6; i += 1) {
   *     translate(0, 0, -40);
   *     box(10);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.frustum = function (...args) {
    this._assert3d('frustum');
    // p5._validateParameters('frustum', args);
    this._renderer.frustum(...args);
    return this;
  };

  /**
   * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and sets it
   * as the current (active) camera.
   *
   * The new camera is initialized with a default position `(0, 0, 800)` and a
   * default perspective projection. Its properties can be controlled with
   * <a href="#/p5.Camera">p5.Camera</a> methods such as
   * `myCamera.lookAt(0, 0, 0)`.
   *
   * Note: Every 3D sketch starts with a default camera initialized.
   * This camera can be controlled with the functions
   * <a href="#/p5/camera">camera()</a>,
   * <a href="#/p5/perspective">perspective()</a>,
   * <a href="#/p5/ortho">ortho()</a>, and
   * <a href="#/p5/frustum">frustum()</a> if it's the only camera in the scene.
   *
   * Note: `createCamera()` can only be used in WebGL mode.
   *
   * @method createCamera
   * @return {p5.Camera} the new camera.
   * @for p5
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let usingCam1 = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   // Place it at the top-left.
   *   // Point it at the origin.
   *   cam2 = createCamera();
   *   cam2.setPosition(400, -400, 800);
   *   cam2.lookAt(0, 0, 0);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A white cube on a gray background. The camera toggles between frontal and aerial views when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (usingCam1 === true) {
   *     setCamera(cam2);
   *     usingCam1 = false;
   *   } else {
   *     setCamera(cam1);
   *     usingCam1 = true;
   *   }
   * }
   * </code>
   * </div>
   */
  fn.createCamera = function () {
    this._assert3d('createCamera');

    return this._renderer.createCamera();
  };

  /**
   * Sets the current (active) camera of a 3D sketch.
   *
   * `setCamera()` allows for switching between multiple cameras created with
   * <a href="#/p5/createCamera">createCamera()</a>.
   *
   * Note: `setCamera()` can only be used in WebGL mode.
   *
   * @method setCamera
   * @param  {p5.Camera} cam camera that should be made active.
   * @for p5
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let usingCam1 = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   // Place it at the top-left.
   *   // Point it at the origin.
   *   cam2 = createCamera();
   *   cam2.setPosition(400, -400, 800);
   *   cam2.lookAt(0, 0, 0);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe('A white cube on a gray background. The camera toggles between frontal and aerial views when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (usingCam1 === true) {
   *     setCamera(cam2);
   *     usingCam1 = false;
   *   } else {
   *     setCamera(cam1);
   *     usingCam1 = true;
   *   }
   * }
   * </code>
   * </div>
   */
  fn.setCamera = function (cam) {
    this._renderer.setCamera(cam);
  };

  /**
   * A class to describe a camera for viewing a 3D sketch.
   *
   * Each `p5.Camera` object represents a camera that views a section of 3D
   * space. It stores information about the camera’s position, orientation, and
   * projection.
   *
   * In WebGL mode, the default camera is a `p5.Camera` object that can be
   * controlled with the <a href="#/p5/camera">camera()</a>,
   * <a href="#/p5/perspective">perspective()</a>,
   * <a href="#/p5/ortho">ortho()</a>, and
   * <a href="#/p5/frustum">frustum()</a> functions. Additional cameras can be
   * created with <a href="#/p5/createCamera">createCamera()</a> and activated
   * with <a href="#/p5/setCamera">setCamera()</a>.
   *
   * Note: `p5.Camera`’s methods operate in two coordinate systems:
   * - The “world” coordinate system describes positions in terms of their
   * relationship to the origin along the x-, y-, and z-axes. For example,
   * calling `myCamera.setPosition()` places the camera in 3D space using
   * "world" coordinates.
   * - The "local" coordinate system describes positions from the camera's point
   * of view: left-right, up-down, and forward-backward. For example, calling
   * `myCamera.move()` moves the camera along its own axes.
   *
   * @class p5.Camera
   * @constructor
   * @param {rendererGL} rendererGL instance of WebGL renderer
   *
   * @example
   * <div>
   * <code>
   * let cam;
   * let delta = 0.001;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Camera object.
   *   cam = createCamera();
   *
   *   // Set the camera
   *   setCamera(cam);
   *
   *   // Place the camera at the top-center.
   *   cam.setPosition(0, -400, 800);
   *
   *   // Point the camera at the origin.
   *   cam.lookAt(0, 0, 0);
   *
   *   describe(
   *     'A white cube on a gray background. The cube goes in and out of view as the camera pans left and right.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Turn the camera left and right, called "panning".
   *   cam.pan(delta);
   *
   *   // Switch directions every 120 frames.
   *   if (frameCount % 120 === 0) {
   *     delta *= -1;
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let cam1;
   * let cam2;
   * let isDefaultCamera = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = createCamera();
   *
   *   // Create the second camera.
   *   // Place it at the top-left.
   *   // Point it at the origin.
   *   cam2 = createCamera();
   *   cam2.setPosition(400, -400, 800);
   *   cam2.lookAt(0, 0, 0);
   *
   *   // Set the current camera to cam1.
   *   setCamera(cam1);
   *
   *   describe(
   *     'A white cube on a gray background. The camera toggles between frontal and aerial views when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (isDefaultCamera === true) {
   *     setCamera(cam2);
   *     isDefaultCamera = false;
   *   } else {
   *     setCamera(cam1);
   *     isDefaultCamera = true;
   *   }
   * }
   * </code>
   * </div>
   */
  p5.Camera = Camera;

  RendererGL.prototype.camera = function(...args) {
    this.states.curCamera.camera(...args);
  }

  RendererGL.prototype.perspective = function(...args) {
    this.states.curCamera.perspective(...args);
  }

  RendererGL.prototype.linePerspective = function(enable) {
    if (enable !== undefined) {
      // Set the line perspective if enable is provided
      this.states.curCamera.useLinePerspective = enable;
    } else {
      // If no argument is provided, return the current value
      return this.states.curCamera.useLinePerspective;
    }
  }

  RendererGL.prototype.ortho = function(...args) {
    this.states.curCamera.ortho(...args);
  }

  RendererGL.prototype.frustum = function(...args) {
    this.states.curCamera.frustum(...args);
  }

  RendererGL.prototype.createCamera = function() {
    // compute default camera settings, then set a default camera
    const _cam = new Camera(this);
    _cam._computeCameraDefaultSettings();
    _cam._setDefaultCamera();

    return _cam;
  }

  RendererGL.prototype.setCamera = function(cam) {
    this.states.setValue('curCamera', cam);

    // set the projection matrix (which is not normally updated each frame)
    this.states.setValue('uPMatrix', this.states.uPMatrix.clone());
    this.states.uPMatrix.set(cam.projMatrix);
    this.states.setValue('uViewMatrix', this.states.uViewMatrix.clone());
    this.states.uViewMatrix.set(cam.cameraMatrix);
  }
}

export default camera;
export { Camera };

if(typeof p5 !== 'undefined'){
  camera(p5, p5.prototype);
}
