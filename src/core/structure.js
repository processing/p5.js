/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires core
 */

import p5 from './main';
/**
 * Stops p5.js from continuously executing the code within <a href="#/p5/draw">draw()</a>.
 * If <a href="#/p5/loop">loop()</a> is called, the code in <a href="#/p5/draw">draw()</a>
 * begins to run continuously again. If using <a href="#/p5/noLoop">noLoop()</a>
 * in <a href="#/p5/setup">setup()</a>, it should be the last line inside the block.
 *
 * When <a href="#/p5/noLoop">noLoop()</a> is used, it's not possible to manipulate
 * or access the screen inside event handling functions such as
 * <a href="#/p5/mousePressed">mousePressed()</a> or
 * <a href="#/p5/keyPressed">keyPressed()</a>. Instead, use those functions to
 * call <a href="#/p5/redraw">redraw()</a> or <a href="#/p5/loop">loop()</a>,
 * which will run <a href="#/p5/draw">draw()</a>, which can update the screen
 * properly. This means that when <a href="#/p5/noLoop">noLoop()</a> has been
 * called, no drawing can happen, and functions like <a href="#/p5/saveFrames">saveFrames()</a>
 * or <a href="#/p5/loadPixels">loadPixels()</a> may not be used.
 *
 * Note that if the sketch is resized, <a href="#/p5/redraw">redraw()</a> will
 * be called to update the sketch, even after <a href="#/p5/noLoop">noLoop()</a>
 * has been specified. Otherwise, the sketch would enter an odd state until
 * <a href="#/p5/loop">loop()</a> was called.
 *
 * Use <a href="#/p5/isLooping">isLooping()</a> to check the current state of <a href="#/p5/loop">loop()</a>.
 *
 * @method noLoop
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 *   noLoop();
 * }

 * function draw() {
 *   line(10, 10, 90, 90);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = 0;
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(204);
 *   x = x + 0.1;
 *   if (x > width) {
 *     x = 0;
 *   }
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   noLoop();
 * }
 *
 * function mouseReleased() {
 *   loop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * 113 pixel long line extending from top-left to bottom right of canvas.
 * horizontal line moves slowly from left. Loops but stops on mouse press.
 */
p5.prototype.noLoop = function() {
  this._loop = false;
};

/**
 * By default, p5.js loops through draw() continuously, executing the code within
 * it. However, the <a href="#/p5/draw">draw()</a> loop may be stopped by calling
 * <a href="#/p5/noLoop">noLoop()</a>. In that case, the <a href="#/p5/draw">draw()</a>
 * loop can be resumed with loop().
 *
 * Avoid calling loop() from inside setup().
 *
 * Use <a href="#/p5/isLooping">isLooping()</a> to check the current state of <a href="#/p5/loop">loop()</a>.
 *
 * @method loop
 * @example
 * <div>
 * <code>
 * let x = 0;
 * function setup() {
 *   createCanvas(100, 100);
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(204);
 *   x = x + 0.1;
 *   if (x > width) {
 *     x = 0;
 *   }
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   loop();
 * }
 *
 * function mouseReleased() {
 *   noLoop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * horizontal line moves slowly from left. Loops but stops on mouse press.
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
 * By default, p5.js loops through <a href="#/p5/draw">draw()</a> continuously,
 * executing the code within it. If the sketch is stopped with
 * <a href="#/p5/noLoop">noLoop()</a> or resumed with <a href="#/p5/loop">loop()</a>,
 * isLooping() returns the current state for use within custom event handlers.
 *
 * @method isLooping
 * @returns {boolean}
 * @example
 * <div>
 * <code>
 * let checkbox, button, colBG, colFill;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   button = createButton('Colorize if loop()');
 *   button.position(0, 120);
 *   button.mousePressed(changeBG);
 *
 *   checkbox = createCheckbox('loop()', true);
 *   checkbox.changed(checkLoop);
 *
 *   colBG = color(0);
 *   colFill = color(255);
 * }
 *
 * function changeBG() {
 *   if (isLooping()) {
 *     colBG = color(random(255), random(255), random(255));
 *     colFill = color(random(255), random(255), random(255));
 *   }
 * }
 *
 * function checkLoop() {
 *   if (this.checked()) {
 *     loop();
 *   } else {
 *     noLoop();
 *   }
 * }
 *
 * function draw() {
 *   background(colBG);
 *   fill(colFill);
 *   ellipse(frameCount % width, height / 2, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Ellipse moves slowly from left. Checkbox toggles loop()/noLoop().
 * Button colorizes sketch if isLooping().
 *
 */
p5.prototype.isLooping = function() {
  return this._loop;
};

/**
 * The <a href="#/p5/push">push()</a> function saves the current drawing style
 * settings and transformations, while <a href="#/p5/pop">pop()</a> restores these
 * settings. Note that these functions are always used together. They allow you to
 * change the style and transformation settings and later return to what you had.
 * When a new state is started with <a href="#/p5/push">push()</a>, it builds on
 * the current style and transform information. The <a href="#/p5/push">push()</a>
 * and <a href="#/p5/pop">pop()</a> functions can be embedded to provide more
 * control. (See the second example for a demonstration.)
 *
 * <a href="#/p5/push">push()</a> stores information related to the current transformation state
 * and style settings controlled by the following functions:
 * <a href="#/p5/fill">fill()</a>,
 * <a href="#/p5/noFill">noFill()</a>,
 * <a href="#/p5/noStroke">noStroke()</a>,
 * <a href="#/p5/stroke">stroke()</a>,
 * <a href="#/p5/tint">tint()</a>,
 * <a href="#/p5/noTint">noTint()</a>,
 * <a href="#/p5/strokeWeight">strokeWeight()</a>,
 * <a href="#/p5/strokeCap">strokeCap()</a>,
 * <a href="#/p5/strokeJoin">strokeJoin()</a>,
 * <a href="#/p5/imageMode">imageMode()</a>,
 * <a href="#/p5/rectMode">rectMode()</a>,
 * <a href="#/p5/ellipseMode">ellipseMode()</a>,
 * <a href="#/p5/colorMode">colorMode()</a>,
 * <a href="#/p5/textAlign">textAlign()</a>,
 * <a href="#/p5/textFont">textFont()</a>,
 * <a href="#/p5/textSize">textSize()</a>,
 * <a href="#/p5/textLeading">textLeading()</a>,
 * <a href="#/p5/applyMatrix">applyMatrix()</a>,
 * <a href="#/p5/resetMatrix">resetMatrix()</a>,
 * <a href="#/p5/rotate">rotate()</a>,
 * <a href="#/p5/scale">scale()</a>,
 * <a href="#/p5/shearX">shearX()</a>,
 * <a href="#/p5/shearY">shearY()</a>,
 * <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/noiseSeed">noiseSeed()</a>.
 *
 * In WEBGL mode additional style settings are stored. These are controlled by the
 * following functions: <a href="#/p5/setCamera">setCamera()</a>,
 * <a href="#/p5/ambientLight">ambientLight()</a>,
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>, <a href="#/p5/texture">texture()</a>,
 * <a href="#/p5/specularMaterial">specularMaterial()</a>,
 * <a href="#/p5/shininess">shininess()</a>,
 * <a href="#/p5/normalMaterial">normalMaterial()</a>
 * and <a href="#/p5/shader">shader()</a>.
 *
 * @method push
 * @example
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33); // Left circle
 *
 * push(); // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * translate(50, 0);
 * ellipse(0, 50, 33, 33); // Middle circle
 * pop(); // Restore original state
 *
 * ellipse(100, 50, 33, 33); // Right circle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33); // Left circle
 *
 * push(); // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(33, 50, 33, 33); // Left-middle circle
 *
 * push(); // Start another new drawing state
 * stroke(0, 102, 153);
 * ellipse(66, 50, 33, 33); // Right-middle circle
 * pop(); // Restore previous state
 *
 * pop(); // Restore original state
 *
 * ellipse(100, 50, 33, 33); // Right circle
 * </code>
 * </div>
 *
 * @alt
 * Gold ellipse + thick black outline @center 2 white ellipses on left and right.
 * 2 Gold ellipses left black right blue stroke. 2 white ellipses on left+right.
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
 * The <a href="#/p5/push">push()</a> function saves the current drawing style
 * settings and transformations, while <a href="#/p5/pop">pop()</a> restores
 * these settings. Note that these functions are always used together. They allow
 * you to change the style and transformation settings and later return to what
 * you had. When a new state is started with <a href="#/p5/push">push()</a>, it
 * builds on the current style and transform information. The <a href="#/p5/push">push()</a>
 * and <a href="#/p5/pop">pop()</a> functions can be embedded to provide more
 * control. (See the second example for a demonstration.)
 *
 * <a href="#/p5/push">push()</a> stores information related to the current transformation state
 * and style settings controlled by the following functions:
 * <a href="#/p5/fill">fill()</a>,
 * <a href="#/p5/noFill">noFill()</a>,
 * <a href="#/p5/noStroke">noStroke()</a>,
 * <a href="#/p5/stroke">stroke()</a>,
 * <a href="#/p5/tint">tint()</a>,
 * <a href="#/p5/noTint">noTint()</a>,
 * <a href="#/p5/strokeWeight">strokeWeight()</a>,
 * <a href="#/p5/strokeCap">strokeCap()</a>,
 * <a href="#/p5/strokeJoin">strokeJoin()</a>,
 * <a href="#/p5/imageMode">imageMode()</a>,
 * <a href="#/p5/rectMode">rectMode()</a>,
 * <a href="#/p5/ellipseMode">ellipseMode()</a>,
 * <a href="#/p5/colorMode">colorMode()</a>,
 * <a href="#/p5/textAlign">textAlign()</a>,
 * <a href="#/p5/textFont">textFont()</a>,
 * <a href="#/p5/textSize">textSize()</a>,
 * <a href="#/p5/textLeading">textLeading()</a>,
 * <a href="#/p5/applyMatrix">applyMatrix()</a>,
 * <a href="#/p5/resetMatrix">resetMatrix()</a>,
 * <a href="#/p5/rotate">rotate()</a>,
 * <a href="#/p5/scale">scale()</a>,
 * <a href="#/p5/shearX">shearX()</a>,
 * <a href="#/p5/shearY">shearY()</a>,
 * <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/noiseSeed">noiseSeed()</a>.
 *
 * In WEBGL mode additional style settings are stored. These are controlled by
 * the following functions:
 * <a href="#/p5/setCamera">setCamera()</a>,
 * <a href="#/p5/ambientLight">ambientLight()</a>,
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * <a href="#/p5/texture">texture()</a>,
 * <a href="#/p5/specularMaterial">specularMaterial()</a>,
 * <a href="#/p5/shininess">shininess()</a>,
 * <a href="#/p5/normalMaterial">normalMaterial()</a> and
 * <a href="#/p5/shader">shader()</a>.
 *
 * @method pop
 * @example
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33); // Left circle
 *
 * push(); // Start a new drawing state
 * translate(50, 0);
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(0, 50, 33, 33); // Middle circle
 * pop(); // Restore original state
 *
 * ellipse(100, 50, 33, 33); // Right circle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * ellipse(0, 50, 33, 33); // Left circle
 *
 * push(); // Start a new drawing state
 * strokeWeight(10);
 * fill(204, 153, 0);
 * ellipse(33, 50, 33, 33); // Left-middle circle
 *
 * push(); // Start another new drawing state
 * stroke(0, 102, 153);
 * ellipse(66, 50, 33, 33); // Right-middle circle
 * pop(); // Restore previous state
 *
 * pop(); // Restore original state
 *
 * ellipse(100, 50, 33, 33); // Right circle
 * </code>
 * </div>
 *
 * @alt
 * Gold ellipse + thick black outline @center 2 white ellipses on left and right.
 * 2 Gold ellipses left black right blue stroke. 2 white ellipses on left+right.
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
 * Executes the code within <a href="#/p5/draw">draw()</a> one time. This
 * function allows the program to update the display window only when necessary,
 * for example when an event registered by <a href="#/p5/mousePressed">mousePressed()</a>
 * or <a href="#/p5/keyPressed">keyPressed()</a> occurs.
 *
 * In structuring a program, it only makes sense to call <a href="#/p5/redraw">redraw()</a>
 * within events such as <a href="#/p5/mousePressed">mousePressed()</a>. This
 * is because <a href="#/p5/redraw">redraw()</a> does not run
 * <a href="#/p5/draw">draw()</a> immediately (it only sets a flag that indicates
 * an update is needed).
 *
 * The <a href="#/p5/redraw">redraw()</a> function does not work properly when
 * called inside <a href="#/p5/draw">draw()</a>.To enable/disable animations,
 * use <a href="#/p5/loop">loop()</a> and <a href="#/p5/noLoop">noLoop()</a>.
 *
 * In addition you can set the number of redraws per method call. Just
 * add an integer as single parameter for the number of redraws.
 *
 * @method redraw
 * @param  {Integer} [n] Redraw for n-times. The default value is 1.
 * @example
 * <div><code>
 * let x = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(204);
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   x += 1;
 *   redraw();
 * }
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * let x = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(204);
 *   x += 1;
 *   line(x, 0, x, height);
 * }
 *
 * function mousePressed() {
 *   redraw(5);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black line on far left of canvas
 * black line on far left of canvas
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
 * The `p5()` constructor enables you to activate "instance mode" instead of normal
 * "global mode". This is an advanced topic. A short description and example is
 * included below. Please see
 * <a target="blank" href="https://www.youtube.com/watch?v=Su792jEauZg&feature=youtu.be">
 * Dan Shiffman's Coding Train video tutorial</a> or this
 * <a target="blank" href="https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace">tutorial page</a>
 * for more info.
 *
 * By default, all p5.js functions are in the global namespace (i.e. bound to the window
 * object), meaning you can call them simply `ellipse()`, `fill()`, etc. However, this
 * might be inconvenient if you are mixing with other JS libraries (synchronously or
 * asynchronously) or writing long programs of your own. p5.js currently supports a
 * way around this problem called "instance mode". In instance mode, all p5 functions
 * are bound up in a single variable instead of polluting your global namespace.
 *
 * Optionally, you can specify a default container for the canvas and any other elements
 * to append to with a second argument. You can give the ID of an element in your html,
 * or an html node itself.
 *
 * Note that creating instances like this also allows you to have more than one p5 sketch on
 * a single web page, as they will each be wrapped up with their own set up variables. Of
 * course, you could also use iframes to have multiple sketches in global mode.
 *
 * @method p5
 * @param {Object} sketch a function containing a p5.js sketch
 * @param {String|Object} node ID or pointer to HTML DOM node to contain sketch in
 * @example
 * <div class='norender'><code>
 * const s = p => {
 *   let x = 100;
 *   let y = 100;
 *
 *   p.setup = function() {
 *     p.createCanvas(700, 410);
 *   };
 *
 *   p.draw = function() {
 *     p.background(0);
 *     p.fill(255);
 *     p.rect(x, y, 50, 50);
 *   };
 * };
 *
 * new p5(s); // invoke p5
 * </code></div>
 *
 * @alt
 * white rectangle on black background
 */
export default p5;
