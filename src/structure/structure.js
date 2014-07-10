/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.exit = function() {
    throw 'exit() not implemented, see remove()';
  };
  /**
   * Stops p5.js from continuously executing the code within draw(). If loop()
   * is called, the code in draw() begins to run continuously again. If using
   * noLoop() in setup(), it should be the last line inside the block.
   * 
   * When noLoop() is used, it's not possible to manipulate or access the
   * screen inside event handling functions such as mousePressed() or
   * keyPressed(). Instead, use those functions to call redraw() or loop(),
   * which will run draw(), which can update the screen properly. This means
   * that when noLoop() has been called, no drawing can happen, and functions
   * like saveFrame() or loadPixels() may not be used.
   * 
   * Note that if the sketch is resized, redraw() will be called to update the
   * sketch, even after noLoop() has been specified. Otherwise, the sketch
   * would enter an odd state until loop() was called.
   *
   * @method noLoop
   */
  p5.prototype.noLoop = function() {
    this._loop = false;
  };

  /**
   * By default, p5.js loops through draw() continuously, executing the code
   * within it. However, the draw() loop may be stopped by calling noLoop().
   * In that case, the draw() loop can be resumed with loop().
   * 
   * @method loop
   */
  p5.prototype.loop = function() {
    this._loop = true;
  };

  /**
   * The push() function saves the current drawing style settings and 
   * transformations, while pop() restores these settings. Note that these 
   * functions are always used together. They allow you to change the style 
   * and transformation settings and later return to what you had. When a new 
   * state is started with push(), it builds on the current style and transform
   * information. The push() and pop() functions can be embedded to provide 
   * more control. (See the second example for a demonstration.)
   * <br><br>
   * push() stores information related to the current transformation state
   * and style settings controlled by the following functions: fill(), 
   * stroke(), tint(), strokeWeight(), strokeCap(), strokeJoin(), 
   * imageMode(), rectMode(), ellipseMode(), colorMode(), textAlign(), 
   * textFont(), textMode(), textSize(), textLeading().
   *
   * @method push
   * @example
   * <div>
   * <code>
   * ellipse(0, 50, 33, 33);  // Left circle
   *
   * push();  // Start a new drawing state
   * strokeWeight(10);
   * fill(204, 153, 0);
   * translate(50, 0);
   * ellipse(0, 50, 33, 33);  // Middle circle
   * pop();  // Restore original state
   *
   * ellipse(100, 50, 33, 33);  // Right circle
   * </code>
   * </div>
   * <div>
   * <code>
   * ellipse(0, 50, 33, 33);  // Left circle
   *
   * push();  // Start a new drawing state
   * strokeWeight(10);
   * fill(204, 153, 0);
   * ellipse(33, 50, 33, 33);  // Left-middle circle
   *
   * push();  // Start another new drawing state
   * stroke(0, 102, 153);
   * ellipse(66, 50, 33, 33);  // Right-middle circle
   * pop();  // Restore previous state
   *
   * pop();  // Restore original state
   *
   * ellipse(100, 50, 33, 33);  // Right circle
   * </code>
   * </div>
   */
  p5.prototype.push = function() {
    var ctx = this.canvas.getContext('2d');
    ctx.save();

    this.styles.push({
      fillStyle:   ctx.fillStyle, // fill
      strokeStyle: ctx.strokeStyle, // stroke
      lineWidth:   ctx.lineWidth, // strokeWeight
      lineCap:     ctx.lineCap, // strokeCap
      lineJoin:    ctx.lineJoin, // strokeJoin
      tint:        this._tint, // tint
      imageMode:   this._imageMode, // imageMode
      rectMode:    this._rectMode, // rectMode
      ellipseMode: this._ellipseMode, // ellipseMode
      // @todo shapeMode
      colorMode:   this._colorMode, // colorMode
      textAlign:   ctx.textAlign, // textAlign
      textFont:    this.textFont,
      textLeading: this.textLeading, // textLeading
      textSize:    this.textSize, // textSize
      textStyle:   this.textStyle // textStyle
    });
  };

  /**
   * The push() function saves the current drawing style settings and 
   * transformations, while pop() restores these settings. Note that these 
   * functions are always used together. They allow you to change the style 
   * and transformation settings and later return to what you had. When a new 
   * state is started with push(), it builds on the current style and transform
   * information. The push() and pop() functions can be embedded to provide 
   * more control. (See the second example for a demonstration.)
   * <br><br>
   * push() stores information related to the current transformation state
   * and style settings controlled by the following functions: fill(), 
   * stroke(), tint(), strokeWeight(), strokeCap(), strokeJoin(), 
   * imageMode(), rectMode(), ellipseMode(), colorMode(), textAlign(), 
   * textFont(), textMode(), textSize(), textLeading().
   * 
   * @method pop   
   * @example
   * <div>
   * <code>
   * ellipse(0, 50, 33, 33);  // Left circle
   *
   * push();  // Start a new drawing state
   * translate(50, 0);
   * strokeWeight(10);
   * fill(204, 153, 0);
   * ellipse(0, 50, 33, 33);  // Middle circle
   * pop();  // Restore original state
   *
   * ellipse(100, 50, 33, 33);  // Right circle
   * </code>
   * </div>
   * <div>
   * <code>
   * ellipse(0, 50, 33, 33);  // Left circle
   *
   * push();  // Start a new drawing state
   * strokeWeight(10);
   * fill(204, 153, 0);
   * ellipse(33, 50, 33, 33);  // Left-middle circle
   *
   * push();  // Start another new drawing state
   * stroke(0, 102, 153);
   * ellipse(66, 50, 33, 33);  // Right-middle circle
   * pop();  // Restore previous state
   *
   * pop();  // Restore original state
   *
   * ellipse(100, 50, 33, 33);  // Right circle
   * </code>
   * </div>
   */
  p5.prototype.pop = function() {
    var ctx = this.canvas.getContext('2d');
    ctx.restore();

    var lastS = this.styles.pop();

    ctx.fillStyle = lastS.fillStyle; // fill
    ctx.strokeStyle = lastS.strokeStyle; // stroke
    ctx.lineWidth = lastS.lineWidth; // strokeWeight
    ctx.lineCap = lastS.lineCap; // strokeCap
    ctx.lineJoin = lastS.lineJoin; // strokeJoin
    this._tint = lastS.tint; // tint
    this._imageMode = lastS.imageMode; // imageMode
    this._rectMode = lastS._rectMode; // rectMode
    this._ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    this._colorMode = lastS._colorMode; // colorMode
    ctx.textAlign = lastS.textAlign; // textAlign
    this.textFont = lastS.textFont;
    this.textLeading = lastS.textLeading; // textLeading
    this.textSize = lastS.textSize; // textSize
    this.textStyle = lastS.textStyle; // textStyle
  };

  p5.prototype.pushStyle = function() {
    throw new Error('pushStyle() not used, see push()');
  };

  p5.prototype.popStyle = function() {
    throw new Error('popStyle() not used, see pop()');
  };

  /**
   *
   * Executes the code within draw() one time. This functions allows the
   * program to update the display window only when necessary, for example
   * when an event registered by mousePressed() or keyPressed() occurs. 
   *
   * In structuring a program, it only makes sense to call redraw() within
   * events such as mousePressed(). This is because redraw() does not run
   * draw() immediately (it only sets a flag that indicates an update is
   * needed).
   * 
   * The redraw() function does not work properly when called inside draw().
   * To enable/disable animations, use loop() and noLoop().
   *
   * @method redraw
   * @example
   *   <div><code>
   *     var x = 0;
   *
   *     function setup() {
   *       createCanvas(200, 200);
   *       noLoop();
   *     }
   *
   *     function draw() {
   *       background(204);
   *       line(x, 0, x, height); 
   *     }
   *
   *     function mousePressed() {
   *       x += 1;
   *       redraw();
   *     }
   *   </code></div>
   */
  p5.prototype.redraw = function() {
    var context = this._isGlobal ? window : this;
    if (context.draw) {
      context.draw();
    }
  };

  p5.prototype.size = function() {
    throw 'size() not implemented, see createCanvas()';
  };


  return p5;

});