/**
 * @module Structure
 * @for Structure
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.exit = function() {
    throw 'Not implemented';
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
   * The pushStyle() function saves the current style settings and popStyle()
   * restores the prior settings. Note that these functions are always used
   * together. They allow you to change the style settings and later return to
   * what you had. When a new style is started with pushStyle(), it builds on
   * the current style information. The pushStyle() and popStyle() functions
   * can be embedded to provide more control. (See the second example above
   * for a demonstration.)
   *
   * The style information controlled by the following functions are included
   * in the style: fill(), stroke(), tint(), strokeWeight(), strokeCap(),
   * strokeJoin(), imageMode(), rectMode(), ellipseMode(), shapeMode(),
   * colorMode(), textAlign(), textFont(), textMode(), textSize(),
   * textLeading(), emissive(), specular(), shininess(), ambient()
   *
   * @method pushStyle
   */
  p5.prototype.pushStyle = function() {

    this.styles.push({
      fillStyle:   this._curElement.context.fillStyle, // fill
      strokeStyle: this._curElement.context.strokeStyle, // stroke
      lineWidth:   this._curElement.context.lineWidth, // strokeWeight
      lineCap:     this._curElement.context.lineCap, // strokeCap
      lineJoin:    this._curElement.context.lineJoin, // strokeJoin
      tint:        this._tint, // tint
      imageMode:   this._imageMode, // imageMode
      rectMode:    this._rectMode, // rectMode
      ellipseMode: this._ellipseMode, // ellipseMode
      // @todo shapeMode
      colorMode:   this._colorMode, // colorMode
      textAlign:   this._curElement.context.textAlign, // textAlign
      textFont:    this.textFont,
      textLeading: this.textLeading, // textLeading
      textSize:    this.textSize, // textSize
      textStyle:   this.textStyle // textStyle
    });
  };

  /**
   * The pushStyle() function saves the current style settings and popStyle()
   * restores the prior settings; these functions are always used together.
   * They allow you to change the style settings and later return to what you
   * had. When a new style is started with pushStyle(), it builds on the
   * current style information. The pushStyle() and popStyle() functions can
   * be embedded to provide more control (see the second example above for
   * a demonstration.)
   * 
   * @method popStyle
   */
  p5.prototype.popStyle = function() {

    var lastS = this.styles.pop();

    this._curElement.context.fillStyle = lastS.fillStyle; // fill
    this._curElement.context.strokeStyle = lastS.strokeStyle; // stroke
    this._curElement.context.lineWidth = lastS.lineWidth; // strokeWeight
    this._curElement.context.lineCap = lastS.lineCap; // strokeCap
    this._curElement.context.lineJoin = lastS.lineJoin; // strokeJoin
    this._tint = lastS.tint; // tint
    this._imageMode = lastS.imageMode; // imageMode
    this._rectMode = lastS._rectMode; // rectMode
    this._ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    this._colorMode = lastS._colorMode; // colorMode
    this._curElement.context.textAlign = lastS.textAlign; // textAlign
    this.textFont = lastS.textFont;
    this.textLeading = lastS.textLeading; // textLeading
    this.textSize = lastS.textSize; // textSize
    this.textStyle = lastS.textStyle; // textStyle
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
    throw 'Not implemented';
  };

  return p5;

});