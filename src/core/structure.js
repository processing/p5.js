/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires core
 */

import p5 from './main';
/**
 * Stops the code in <a href="#/p5/draw">draw()</a> from running repeatedly.
 *
 * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
 * second. Calling `noLoop()` stops <a href="#/p5/draw">draw()</a> from
 * repeating. The draw loop can be restarted by calling
 * <a href="#/p5/loop">loop()</a>. <a href="#/p5/draw">draw()</a> can be run
 * once by calling <a href="#/p5/redraw">redraw()</a>.
 *
 * The <a href="#/p5/isLooping">isLooping()</a> function can be used to check
 * whether a sketch is looping, as in `isLooping() === true`.
 *
 * @method noLoop
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Turn off the draw loop.
 *   noLoop();
 *
 *   describe('A white half-circle on the left edge of a gray square.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's x-coordinate.
 *   let x = frameCount;
 *
 *   // Draw the circle.
 *   // Normally, the circle would move from left to right.
 *   circle(x, 50, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Double-click to stop the draw loop.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(5);
 *
 *   describe('A white circle moves randomly on a gray background. It stops moving when the user double-clicks.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's coordinates.
 *   let x = random(0, 100);
 *   let y = random(0, 100);
 *
 *   // Draw the circle.
 *   // Normally, the circle would move from left to right.
 *   circle(x, y, 20);
 * }
 *
 * // Stop the draw loop when the user double-clicks.
 * function doubleClicked() {
 *   noLoop();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let startButton;
 * let stopButton;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create the button elements and place them
 *   // beneath the canvas.
 *   startButton = createButton('▶');
 *   startButton.position(0, 100);
 *   startButton.size(50, 20);
 *   stopButton = createButton('◾');
 *   stopButton.position(50, 100);
 *   stopButton.size(50, 20);
 *
 *   // Set functions to call when the buttons are pressed.
 *   startButton.mousePressed(loop);
 *   stopButton.mousePressed(noLoop);
 *
 *   // Slow the frame rate.
 *   frameRate(5);
 *
 *   describe(
 *     'A white circle moves randomly on a gray background. Play and stop buttons are shown beneath the canvas. The circle stops or starts moving when the user presses a button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's coordinates.
 *   let x = random(0, 100);
 *   let y = random(0, 100);
 *
 *   // Draw the circle.
 *   // Normally, the circle would move from left to right.
 *   circle(x, y, 20);
 * }
 * </code>
 * </div>
 */
p5.prototype.noLoop = function() {
  this._loop = false;
};

/**
 * Resumes the draw loop after <a href="#/p5/noLoop">noLoop()</a> has been
 * called.
 *
 * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
 * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
 * <a href="#/p5/draw">draw()</a> from repeating. The draw loop can be
 * restarted by calling `loop()`.
 *
 * The <a href="#/p5/isLooping">isLooping()</a> function can be used to check
 * whether a sketch is looping, as in `isLooping() === true`.
 *
 * @method loop
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Turn off the draw loop.
 *   noLoop();
 *
 *   describe(
 *     'A white half-circle on the left edge of a gray square. The circle starts moving to the right when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's x-coordinate.
 *   let x = frameCount;
 *
 *   // Draw the circle.
 *   circle(x, 50, 20);
 * }
 *
 * // Resume the draw loop when the user double-clicks.
 * function doubleClicked() {
 *   loop();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let startButton;
 * let stopButton;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create the button elements and place them
 *   // beneath the canvas.
 *   startButton = createButton('▶');
 *   startButton.position(0, 100);
 *   startButton.size(50, 20);
 *   stopButton = createButton('◾');
 *   stopButton.position(50, 100);
 *   stopButton.size(50, 20);
 *
 *   // Set functions to call when the buttons are pressed.
 *   startButton.mousePressed(loop);
 *   stopButton.mousePressed(noLoop);
 *
 *   // Slow the frame rate.
 *   frameRate(5);
 *
 *   describe(
 *     'A white circle moves randomly on a gray background. Play and stop buttons are shown beneath the canvas. The circle stops or starts moving when the user presses a button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's coordinates.
 *   let x = random(0, 100);
 *   let y = random(0, 100);
 *
 *   // Draw the circle.
 *   // Normally, the circle would move from left to right.
 *   circle(x, y, 20);
 * }
 * </code>
 * </div>
 */
p5.prototype.loop = function() {
  if (!this._loop) {
    this._loop = true;
    if (this._setupDone) {
      this._draw();
    }
  }
};

/**
 * Returns `true` if the draw loop is running and `false` if not.
 *
 * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
 * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
 * <a href="#/p5/draw">draw()</a> from repeating. The draw loop can be
 * restarted by calling <a href="#/p5/loop">loop()</a>.
 *
 * The `isLooping()` function can be used to check whether a sketch is
 * looping, as in `isLooping() === true`.
 *
 * @method isLooping
 * @returns {boolean}
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle drawn against a gray background. When the user double-clicks, the circle stops or resumes following the mouse.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw the circle at the mouse's position.
 *   circle(mouseX, mouseY, 20);
 * }
 *
 * // Toggle the draw loop when the user double-clicks.
 * function doubleClicked() {
 *   if (isLooping() === true) {
 *     noLoop();
 *   } else {
 *     loop();
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.isLooping = function() {
  return this._loop;
};

/**
 * Begins a drawing group that contains its own styles and transformations.
 *
 * By default, styles such as <a href="#/p5/fill">fill()</a> and
 * transformations such as <a href="#/p5/rotate">rotate()</a> are applied to
 * all drawing that follows. The `push()` and <a href="#/p5/pop">pop()</a>
 * functions can limit the effect of styles and transformations to a specific
 * group of shapes, images, and text. For example, a group of shapes could be
 * translated to follow the mouse without affecting the rest of the sketch:
 *
 * ```js
 * // Begin the drawing group.
 * push();
 *
 * // Translate the origin to the mouse's position.
 * translate(mouseX, mouseY);
 *
 * // Style the face.
 * noStroke();
 * fill('green');
 *
 * // Draw the face.
 * circle(0, 0, 60);
 *
 * // Style the eyes.
 * fill('white');
 *
 * // Draw the left eye.
 * ellipse(-20, -20, 30, 20);
 *
 * // Draw the right eye.
 * ellipse(20, -20, 30, 20);
 *
 * // End the drawing group.
 * pop();
 *
 * // Draw a bug.
 * let x = random(0, 100);
 * let y = random(0, 100);
 * text('🦟', x, y);
 * ```
 *
 * In the code snippet above, the bug's position isn't affected by
 * `translate(mouseX, mouseY)` because that transformation is contained
 * between `push()` and <a href="#/p5/pop">pop()</a>. The bug moves around
 * the entire canvas as expected.
 *
 * Note: `push()` and <a href="#/p5/pop">pop()</a> are always called as a
 * pair. Both functions are required to begin and end a drawing group.
 *
 * `push()` and <a href="#/p5/pop">pop()</a> can also be nested to create
 * subgroups. For example, the code snippet above could be changed to give
 * more detail to the frog’s eyes:
 *
 * ```js
 * // Begin the drawing group.
 * push();
 *
 * // Translate the origin to the mouse's position.
 * translate(mouseX, mouseY);
 *
 * // Style the face.
 * noStroke();
 * fill('green');
 *
 * // Draw a face.
 * circle(0, 0, 60);
 *
 * // Style the eyes.
 * fill('white');
 *
 * // Draw the left eye.
 * push();
 * translate(-20, -20);
 * ellipse(0, 0, 30, 20);
 * fill('black');
 * circle(0, 0, 8);
 * pop();
 *
 * // Draw the right eye.
 * push();
 * translate(20, -20);
 * ellipse(0, 0, 30, 20);
 * fill('black');
 * circle(0, 0, 8);
 * pop();
 *
 * // End the drawing group.
 * pop();
 *
 * // Draw a bug.
 * let x = random(0, 100);
 * let y = random(0, 100);
 * text('🦟', x, y);
 * ```
 *
 * In this version, the code to draw each eye is contained between its own
 * `push()` and <a href="#/p5/pop">pop()</a> functions. Doing so makes it
 * easier to add details in the correct part of a drawing.
 *
 * `push()` and <a href="#/p5/pop">pop()</a> contain the effects of the
 * following functions:
 *
 * - <a href="#/p5/fill">fill()</a>
 * - <a href="#/p5/noFill">noFill()</a>
 * - <a href="#/p5/noStroke">noStroke()</a>
 * - <a href="#/p5/stroke">stroke()</a>
 * - <a href="#/p5/tint">tint()</a>
 * - <a href="#/p5/noTint">noTint()</a>
 * - <a href="#/p5/strokeWeight">strokeWeight()</a>
 * - <a href="#/p5/strokeCap">strokeCap()</a>
 * - <a href="#/p5/strokeJoin">strokeJoin()</a>
 * - <a href="#/p5/imageMode">imageMode()</a>
 * - <a href="#/p5/rectMode">rectMode()</a>
 * - <a href="#/p5/ellipseMode">ellipseMode()</a>
 * - <a href="#/p5/colorMode">colorMode()</a>
 * - <a href="#/p5/textAlign">textAlign()</a>
 * - <a href="#/p5/textFont">textFont()</a>
 * - <a href="#/p5/textSize">textSize()</a>
 * - <a href="#/p5/textLeading">textLeading()</a>
 * - <a href="#/p5/applyMatrix">applyMatrix()</a>
 * - <a href="#/p5/resetMatrix">resetMatrix()</a>
 * - <a href="#/p5/rotate">rotate()</a>
 * - <a href="#/p5/scale">scale()</a>
 * - <a href="#/p5/shearX">shearX()</a>
 * - <a href="#/p5/shearY">shearY()</a>
 * - <a href="#/p5/translate">translate()</a>
 *
 * In WebGL mode, `push()` and <a href="#/p5/pop">pop()</a> contain the
 * effects of a few additional styles:
 *
 * - <a href="#/p5/setCamera">setCamera()</a>
 * - <a href="#/p5/ambientLight">ambientLight()</a>
 * - <a href="#/p5/directionalLight">directionalLight()</a>
 * - <a href="#/p5/pointLight">pointLight()</a> <a href="#/p5/texture">texture()</a>
 * - <a href="#/p5/specularMaterial">specularMaterial()</a>
 * - <a href="#/p5/shininess">shininess()</a>
 * - <a href="#/p5/normalMaterial">normalMaterial()</a>
 * - <a href="#/p5/shader">shader()</a>
 *
 * @method push
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw the left circle.
 *   circle(25, 50, 20);
 *
 *   // Begin the drawing group.
 *   push();
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Style the circle.
 *   strokeWeight(5);
 *   stroke('royalblue');
 *   fill('orange');
 *
 *   // Draw the circle.
 *   circle(0, 0, 20);
 *
 *   // End the drawing group.
 *   pop();
 *
 *   // Draw the right circle.
 *   circle(75, 50, 20);
 *
 *   describe(
 *     'Three circles drawn in a row on a gray background. The left and right circles are white with thin, black borders. The middle circle is orange with a thick, blue border.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(24);
 *
 *   describe('A mosquito buzzes in front of a green frog. The frog follows the mouse as the user moves.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Begin the drawing group.
 *   push();
 *
 *   // Translate the origin to the mouse's position.
 *   translate(mouseX, mouseY);
 *
 *   // Style the face.
 *   noStroke();
 *   fill('green');
 *
 *   // Draw a face.
 *   circle(0, 0, 60);
 *
 *   // Style the eyes.
 *   fill('white');
 *
 *   // Draw the left eye.
 *   push();
 *   translate(-20, -20);
 *   ellipse(0, 0, 30, 20);
 *   fill('black');
 *   circle(0, 0, 8);
 *   pop();
 *
 *   // Draw the right eye.
 *   push();
 *   translate(20, -20);
 *   ellipse(0, 0, 30, 20);
 *   fill('black');
 *   circle(0, 0, 8);
 *   pop();
 *
 *   // End the drawing group.
 *   pop();
 *
 *   // Draw a bug.
 *   let x = random(0, 100);
 *   let y = random(0, 100);
 *   text('🦟', x, y);
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
 *   describe(
 *     'Two spheres drawn on a gray background. The sphere on the left is red and lit from the front. The sphere on the right is a blue wireframe.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Draw the red sphere.
 *   push();
 *   translate(-25, 0, 0);
 *   noStroke();
 *   directionalLight(255, 0, 0, 0, 0, -1);
 *   sphere(20);
 *   pop();
 *
 *   // Draw the blue sphere.
 *   push();
 *   translate(25, 0, 0);
 *   strokeWeight(0.3);
 *   stroke(0, 0, 255);
 *   noFill();
 *   sphere(20);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.prototype.push = function() {
  this._styles.push({
    props: {
      _colorMode: this._colorMode
    },
    renderer: this._renderer.push()
  });
};

/**
 * Ends a drawing group that contains its own styles and transformations.
 *
 * By default, styles such as <a href="#/p5/fill">fill()</a> and
 * transformations such as <a href="#/p5/rotate">rotate()</a> are applied to
 * all drawing that follows. The <a href="#/p5/push">push()</a> and `pop()`
 * functions can limit the effect of styles and transformations to a specific
 * group of shapes, images, and text. For example, a group of shapes could be
 * translated to follow the mouse without affecting the rest of the sketch:
 *
 * ```js
 * // Begin the drawing group.
 * push();
 *
 * // Translate the origin to the mouse's position.
 * translate(mouseX, mouseY);
 *
 * // Style the face.
 * noStroke();
 * fill('green');
 *
 * // Draw the face.
 * circle(0, 0, 60);
 *
 * // Style the eyes.
 * fill('white');
 *
 * // Draw the left eye.
 * ellipse(-20, -20, 30, 20);
 *
 * // Draw the right eye.
 * ellipse(20, -20, 30, 20);
 *
 * // End the drawing group.
 * pop();
 *
 * // Draw a bug.
 * let x = random(0, 100);
 * let y = random(0, 100);
 * text('🦟', x, y);
 * ```
 *
 * In the code snippet above, the bug's position isn't affected by
 * `translate(mouseX, mouseY)` because that transformation is contained
 * between <a href="#/p5/push">push()</a> and `pop()`. The bug moves around
 * the entire canvas as expected.
 *
 * Note: <a href="#/p5/push">push()</a> and `pop()` are always called as a
 * pair. Both functions are required to begin and end a drawing group.
 *
 * <a href="#/p5/push">push()</a> and `pop()` can also be nested to create
 * subgroups. For example, the code snippet above could be changed to give
 * more detail to the frog’s eyes:
 *
 * ```js
 * // Begin the drawing group.
 * push();
 *
 * // Translate the origin to the mouse's position.
 * translate(mouseX, mouseY);
 *
 * // Style the face.
 * noStroke();
 * fill('green');
 *
 * // Draw a face.
 * circle(0, 0, 60);
 *
 * // Style the eyes.
 * fill('white');
 *
 * // Draw the left eye.
 * push();
 * translate(-20, -20);
 * ellipse(0, 0, 30, 20);
 * fill('black');
 * circle(0, 0, 8);
 * pop();
 *
 * // Draw the right eye.
 * push();
 * translate(20, -20);
 * ellipse(0, 0, 30, 20);
 * fill('black');
 * circle(0, 0, 8);
 * pop();
 *
 * // End the drawing group.
 * pop();
 *
 * // Draw a bug.
 * let x = random(0, 100);
 * let y = random(0, 100);
 * text('🦟', x, y);
 * ```
 *
 * In this version, the code to draw each eye is contained between its own
 * <a href="#/p5/push">push()</a> and `pop()` functions. Doing so makes it
 * easier to add details in the correct part of a drawing.
 *
 * <a href="#/p5/push">push()</a> and `pop()` contain the effects of the
 * following functions:
 *
 * - <a href="#/p5/fill">fill()</a>
 * - <a href="#/p5/noFill">noFill()</a>
 * - <a href="#/p5/noStroke">noStroke()</a>
 * - <a href="#/p5/stroke">stroke()</a>
 * - <a href="#/p5/tint">tint()</a>
 * - <a href="#/p5/noTint">noTint()</a>
 * - <a href="#/p5/strokeWeight">strokeWeight()</a>
 * - <a href="#/p5/strokeCap">strokeCap()</a>
 * - <a href="#/p5/strokeJoin">strokeJoin()</a>
 * - <a href="#/p5/imageMode">imageMode()</a>
 * - <a href="#/p5/rectMode">rectMode()</a>
 * - <a href="#/p5/ellipseMode">ellipseMode()</a>
 * - <a href="#/p5/colorMode">colorMode()</a>
 * - <a href="#/p5/textAlign">textAlign()</a>
 * - <a href="#/p5/textFont">textFont()</a>
 * - <a href="#/p5/textSize">textSize()</a>
 * - <a href="#/p5/textLeading">textLeading()</a>
 * - <a href="#/p5/applyMatrix">applyMatrix()</a>
 * - <a href="#/p5/resetMatrix">resetMatrix()</a>
 * - <a href="#/p5/rotate">rotate()</a>
 * - <a href="#/p5/scale">scale()</a>
 * - <a href="#/p5/shearX">shearX()</a>
 * - <a href="#/p5/shearY">shearY()</a>
 * - <a href="#/p5/translate">translate()</a>
 *
 * In WebGL mode, <a href="#/p5/push">push()</a> and `pop()` contain the
 * effects of a few additional styles:
 *
 * - <a href="#/p5/setCamera">setCamera()</a>
 * - <a href="#/p5/ambientLight">ambientLight()</a>
 * - <a href="#/p5/directionalLight">directionalLight()</a>
 * - <a href="#/p5/pointLight">pointLight()</a> <a href="#/p5/texture">texture()</a>
 * - <a href="#/p5/specularMaterial">specularMaterial()</a>
 * - <a href="#/p5/shininess">shininess()</a>
 * - <a href="#/p5/normalMaterial">normalMaterial()</a>
 * - <a href="#/p5/shader">shader()</a>
 *
 * @method pop
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw the left circle.
 *   circle(25, 50, 20);
 *
 *   // Begin the drawing group.
 *   push();
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Style the circle.
 *   strokeWeight(5);
 *   stroke('royalblue');
 *   fill('orange');
 *
 *   // Draw the circle.
 *   circle(0, 0, 20);
 *
 *   // End the drawing group.
 *   pop();
 *
 *   // Draw the right circle.
 *   circle(75, 50, 20);
 *
 *   describe(
 *     'Three circles drawn in a row on a gray background. The left and right circles are white with thin, black borders. The middle circle is orange with a thick, blue border.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(24);
 *
 *   describe('A mosquito buzzes in front of a green frog. The frog follows the mouse as the user moves.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Begin the drawing group.
 *   push();
 *
 *   // Translate the origin to the mouse's position.
 *   translate(mouseX, mouseY);
 *
 *   // Style the face.
 *   noStroke();
 *   fill('green');
 *
 *   // Draw a face.
 *   circle(0, 0, 60);
 *
 *   // Style the eyes.
 *   fill('white');
 *
 *   // Draw the left eye.
 *   push();
 *   translate(-20, -20);
 *   ellipse(0, 0, 30, 20);
 *   fill('black');
 *   circle(0, 0, 8);
 *   pop();
 *
 *   // Draw the right eye.
 *   push();
 *   translate(20, -20);
 *   ellipse(0, 0, 30, 20);
 *   fill('black');
 *   circle(0, 0, 8);
 *   pop();
 *
 *   // End the drawing group.
 *   pop();
 *
 *   // Draw a bug.
 *   let x = random(0, 100);
 *   let y = random(0, 100);
 *   text('🦟', x, y);
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
 *   describe(
 *     'Two spheres drawn on a gray background. The sphere on the left is red and lit from the front. The sphere on the right is a blue wireframe.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Draw the red sphere.
 *   push();
 *   translate(-25, 0, 0);
 *   noStroke();
 *   directionalLight(255, 0, 0, 0, 0, -1);
 *   sphere(20);
 *   pop();
 *
 *   // Draw the blue sphere.
 *   push();
 *   translate(25, 0, 0);
 *   strokeWeight(0.3);
 *   stroke(0, 0, 255);
 *   noFill();
 *   sphere(20);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.prototype.pop = function() {
  const style = this._styles.pop();
  if (style) {
    this._renderer.pop(style.renderer);
    Object.assign(this, style.props);
  } else {
    console.warn('pop() was called without matching push()');
  }
};

/**
 * Runs the code in <a href="#/p5/draw">draw()</a> once.
 *
 * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
 * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
 * <a href="#/p5/draw">draw()</a> from repeating. Calling `redraw()` will
 * execute the code in the <a href="#/p5/draw">draw()</a> function a set
 * number of times.
 *
 * The parameter, `n`, is optional. If a number is passed, as in `redraw(5)`,
 * then the draw loop will run the given number of times. By default, `n` is
 * 1.
 *
 * @method redraw
 * @param  {Integer} [n] number of times to run <a href="#/p5/draw">draw()</a>. Defaults to 1.
 *
 * @example
 * <div>
 * <code>
 * // Double-click the canvas to move the circle.
 *
 * let x = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Turn off the draw loop.
 *   noLoop();
 *
 *   describe(
 *     'A white half-circle on the left edge of a gray square. The circle moves a little to the right when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw the circle.
 *   circle(x, 50, 20);
 *
 *   // Increment x.
 *   x += 5;
 * }
 *
 * // Run the draw loop when the user double-clicks.
 * function doubleClicked() {
 *   redraw();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Double-click the canvas to move the circle.
 *
 * let x = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Turn off the draw loop.
 *   noLoop();
 *
 *   describe(
 *     'A white half-circle on the left edge of a gray square. The circle hops to the right when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw the circle.
 *   circle(x, 50, 20);
 *
 *   // Increment x.
 *   x += 5;
 * }
 *
 * // Run the draw loop three times when the user double-clicks.
 * function doubleClicked() {
 *   redraw(3);
 * }
 * </code>
 * </div>
 */
p5.prototype.redraw = function(n) {
  if (this._inUserDraw || !this._setupDone) {
    return;
  }

  let numberOfRedraws = parseInt(n);
  if (isNaN(numberOfRedraws) || numberOfRedraws < 1) {
    numberOfRedraws = 1;
  }

  const context = this._isGlobal ? window : this;
  if (typeof context.draw === 'function') {
    if (typeof context.setup === 'undefined') {
      context.scale(context._pixelDensity, context._pixelDensity);
    }
    for (let idxRedraw = 0; idxRedraw < numberOfRedraws; idxRedraw++) {
      context.resetMatrix();
      if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
        this._updateAccsOutput();
      }
      if (context._renderer.isP3D) {
        context._renderer._update();
      }
      context._setProperty('frameCount', context.frameCount + 1);
      this.callRegisteredHooksFor('pre');
      this._inUserDraw = true;
      try {
        context.draw();
      } finally {
        this._inUserDraw = false;
      }
      this.callRegisteredHooksFor('post');
    }
  }
};

/**
 * Creates a new sketch in "instance" mode.
 *
 * All p5.js sketches are instances of the `p5` class. Put another way, all
 * p5.js sketches are objects with methods including `pInst.setup()`,
 * `pInst.draw()`, `pInst.circle()`, and `pInst.fill()`. By default, sketches
 * run in "global mode" to hide some of this complexity.
 *
 * In global mode, a default instance of the `p5` class is created
 * automatically. The default `p5` instance searches the web page's source
 * code for declarations of system functions such as `setup()`, `draw()`,
 * and `mousePressed()`, then attaches those functions to itself as methods.
 * Calling a function such as `circle()` in global mode actually calls the
 * default `p5` object's `pInst.circle()` method.
 *
 * It's often helpful to isolate the code within sketches from the rest of the
 * code on a web page. Two common use cases are web pages that use other
 * JavaScript libraries and web pages with multiple sketches. "Instance mode"
 * makes it easy to support both of these scenarios.
 *
 * Instance mode sketches support the same API as global mode sketches. They
 * use a function to bundle, or encapsulate, an entire sketch. The function
 * containing the sketch is then passed to the `p5()` constructor.
 *
 * The first parameter, `sketch`, is a function that contains the sketch. For
 * example, the statement `new p5(mySketch)` would create a new instance mode
 * sketch from a function named `mySketch`. The function should have one
 * parameter, `p`, that's a `p5` object.
 *
 * The second parameter, `node`, is optional. If a string is passed, as in
 * `new p5(mySketch, 'sketch-one')` the new instance mode sketch will become a
 * child of the HTML element with the id `sketch-one`. If an HTML element is
 * passed, as in `new p5(mySketch, myElement)`, then the new instance mode
 * sketch will become a child of the `Element` object called `myElement`.
 *
 * @method p5
 * @param {Object} sketch function containing the sketch.
 * @param {String|HTMLElement} node ID or reference to the HTML element that will contain the sketch.
 *
 * @example
 * <div class='norender notest'>
 * <code>
 * // Declare the function containing the sketch.
 * function sketch(p) {
 *
 *   // Declare the setup() method.
 *   p.setup = function () {
 *     p.createCanvas(100, 100);
 *
 *     p.describe('A white circle drawn on a gray background.');
 *   };
 *
 *   // Declare the draw() method.
 *   p.draw = function () {
 *     p.background(200);
 *
 *     // Draw the circle.
 *     p.circle(50, 50, 20);
 *   };
 * }
 *
 * // Initialize the sketch.
 * new p5(sketch);
 * </code>
 * </div>
 *
 * <div class='norender notest'>
 * <code>
 * // Declare the function containing the sketch.
 * function sketch(p) {
 *   // Create the sketch's variables within its scope.
 *   let x = 50;
 *   let y = 50;
 *
 *   // Declare the setup() method.
 *   p.setup = function () {
 *     p.createCanvas(100, 100);
 *
 *     p.describe('A white circle moves randomly on a gray background.');
 *   };
 *
 *   // Declare the draw() method.
 *   p.draw = function () {
 *     p.background(200);
 *
 *     // Update x and y.
 *     x += p.random(-1, 1);
 *     y += p.random(-1, 1);
 *
 *     // Draw the circle.
 *     p.circle(x, y, 20);
 *   };
 * }
 *
 * // Initialize the sketch.
 * new p5(sketch);
 * </code>
 * </div>
 *
 * <div class='norender notest'>
 * <code>
 * // Declare the function containing the sketch.
 * function sketch(p) {
 *
 *   // Declare the setup() method.
 *   p.setup = function () {
 *     p.createCanvas(100, 100);
 *
 *     p.describe('A white circle drawn on a gray background.');
 *   };
 *
 *   // Declare the draw() method.
 *   p.draw = function () {
 *     p.background(200);
 *
 *     // Draw the circle.
 *     p.circle(50, 50, 20);
 *   };
 * }
 *
 * // Select the web page's body element.
 * let body = document.querySelector('body');
 *
 * // Initialize the sketch and attach it to the web page's body.
 * new p5(sketch, body);
 * </code>
 * </div>
 *
 * <div class='norender notest'>
 * <code>
 * // Declare the function containing the sketch.
 * function sketch(p) {
 *
 *   // Declare the setup() method.
 *   p.setup = function () {
 *     p.createCanvas(100, 100);
 *
 *     p.describe(
 *       'A white circle drawn on a gray background. The circle follows the mouse as the user moves.'
 *     );
 *   };
 *
 *   // Declare the draw() method.
 *   p.draw = function () {
 *     p.background(200);
 *
 *     // Draw the circle.
 *     p.circle(p.mouseX, p.mouseY, 20);
 *   };
 * }
 *
 * // Initialize the sketch.
 * new p5(sketch);
 * </code>
 * </div>
 *
 * <div class='norender notest'>
 * <code>
 * // Declare the function containing the sketch.
 * function sketch(p) {
 *
 *   // Declare the setup() method.
 *   p.setup = function () {
 *     p.createCanvas(100, 100);
 *
 *     p.describe(
 *       'A white circle drawn on a gray background. The circle follows the mouse as the user moves. The circle becomes black when the user double-clicks.'
 *     );
 *   };
 *
 *   // Declare the draw() method.
 *   p.draw = function () {
 *     p.background(200);
 *
 *     // Draw the circle.
 *     p.circle(p.mouseX, p.mouseY, 20);
 *   };
 *
 *   // Declare the doubleClicked() method.
 *   p.doubleClicked = function () {
 *     // Change the fill color when the user double-clicks.
 *     p.fill(0);
 *   };
 * }
 *
 * // Initialize the sketch.
 * new p5(sketch);
 * </code>
 * </div>
 */
export default p5;
