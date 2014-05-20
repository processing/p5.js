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
   * Stops p5.js from continuously executing the code within draw(). If loop() is called, the code in draw() begins to run continuously again. If using noLoop() in setup(), it should be the last line inside the block.
   * 
   * When noLoop() is used, it's not possible to manipulate or access the screen inside event handling functions such as mousePressed() or keyPressed(). Instead, use those functions to call redraw() or loop(), which will run draw(), which can update the screen properly. This means that when noLoop() has been called, no drawing can happen, and functions like saveFrame() or loadPixels() may not be used.
   * 
   * Note that if the sketch is resized, redraw() will be called to update the sketch, even after noLoop() has been specified. Otherwise, the sketch would enter an odd state until loop() was called.
   *
   * @method noLoop
   */
  p5.prototype.noLoop = function() {
    this.settings.loop = false;
  };

  /**
   * By default, p5.js loops through draw() continuously, executing the code within it. However, the draw() loop may be stopped by calling noLoop(). In that case, the draw() loop can be resumed with loop().
   * 
   * @method loop
   */
  p5.prototype.loop = function() {
    this.settings.loop = true;
  };

  /**
   * The pushStyle() function saves the current style settings and popStyle() restores the prior settings. Note that these functions are always used together. They allow you to change the style settings and later return to what you had. When a new style is started with pushStyle(), it builds on the current style information. The pushStyle() and popStyle() functions can be embedded to provide more control. (See the second example above for a demonstration.)
   *
   * The style information controlled by the following functions are included in the style: fill(), stroke(), tint(), strokeWeight(), strokeCap(), strokeJoin(), imageMode(), rectMode(), ellipseMode(), shapeMode(), colorMode(), textAlign(), textFont(), textMode(), textSize(), textLeading(), emissive(), specular(), shininess(), ambient()
   *
   * @method pushStyle
   */
  p5.prototype.pushStyle = function() {

    this.styles.push({
      fillStyle:   this.curElement.context.fillStyle, // fill
      strokeStyle: this.curElement.context.strokeStyle, // stroke
      lineWidth:   this.curElement.context.lineWidth, // strokeWeight
      lineCap:     this.curElement.context.lineCap, // strokeCap
      lineJoin:    this.curElement.context.lineJoin, // strokeJoin
      tint:        this.settings.tint, // tint
      imageMode:   this.settings.imageMode, // imageMode
      rectMode:    this.settings.rectMode, // rectMode
      ellipseMode: this.settings.ellipseMode, // ellipseMode
      // @todo shapeMode
      colorMode:   this.settings.colorMode, // colorMode
      textAlign:   this.curElement.context.textAlign, // textAlign
      textFont:    this.settings.textFont,
      textLeading: this.settings.textLeading, // textLeading
      textSize:    this.settings.textSize, // textSize
      textStyle:   this.settings.textStyle // textStyle
    });
  };

  /**
   * The pushStyle() function saves the current style settings and popStyle() restores the prior settings; these functions are always used together. They allow you to change the style settings and later return to what you had. When a new style is started with pushStyle(), it builds on the current style information. The pushStyle() and popStyle() functions can be embedded to provide more control (see the second example above for a demonstration.)
   * 
   * @method popStyle
   */
  p5.prototype.popStyle = function() {

    var lastS = this.styles.pop();

    this.curElement.context.fillStyle = lastS.fillStyle; // fill
    this.curElement.context.strokeStyle = lastS.strokeStyle; // stroke
    this.curElement.context.lineWidth = lastS.lineWidth; // strokeWeight
    this.curElement.context.lineCap = lastS.lineCap; // strokeCap
    this.curElement.context.lineJoin = lastS.lineJoin; // strokeJoin
    this.settings.tint = lastS.tint; // tint
    this.settings.imageMode = lastS.imageMode; // imageMode
    this.settings.rectMode = lastS.rectMode; // rectMode
    this.settings.ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    this.settings.colorMode = lastS.colorMode; // colorMode
    this.curElement.context.textAlign = lastS.textAlign; // textAlign
    this.settings.textFont = lastS.textFont;
    this.settings.textLeading = lastS.textLeading; // textLeading
    this.settings.textSize = lastS.textSize; // textSize
    this.settings.textStyle = lastS.textStyle; // textStyle
  };

  /**
   *
   * Executes the code within draw() one time. This functions allows the program to update the display window only when necessary, for example when an event registered by mousePressed() or keyPressed() occurs. 
   *
   * In structuring a program, it only makes sense to call redraw() within events such as mousePressed(). This is because redraw() does not run draw() immediately (it only sets a flag that indicates an update is needed). 
   * 
   * The redraw() function does not work properly when called inside draw(). To enable/disable animations, use loop() and noLoop().
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