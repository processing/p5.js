/**
 * @module Events
 * @submodule Mouse
 * @for p5
 * @requires core
 * @requires constants
 */


'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

/**
 * The system variable mouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the canvas.
 *
 * @property mouseX
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, 0, mouseX, 100);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseX = 0;

/**
 * The system variable mouseY always contains the current vertical position
 * of the mouse, relative to (0, 0) of the canvas.
 *
 * @property mouseY
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(0, mouseY, 100, mouseY);
 *}
 * </code>
 * </div>
 */
p5.prototype.mouseY = 0;

/**
 * The system variable pmouseX always contains the horizontal position of
 * the mouse in the frame previous to the current frame, relative to (0, 0)
 * of the canvas.
 *
 * @property pmouseX
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas to leave a trail
 * function setup() {
 *   //slow down the frameRate to make it more visible
 *   frameRate(10);
 * }
 *
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, mouseY, pmouseX, pmouseY);
 *   print(pmouseX + " -> " + mouseX);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pmouseX = 0;

/**
 * The system variable pmouseY always contains the vertical position of the
 * mouse in the frame previous to the current frame, relative to (0, 0) of
 * the canvas.
 *
 * @property pmouseY
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *   //draw a square only if the mouse is not moving
 *   if(mouseY == pmouseY && mouseX == pmouseX)
 *     rect(20,20,60,60);
 *
 *   print(pmouseY + " -> " + mouseY);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pmouseY = 0;

/**
 * The system variable winMouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property winMouseX
 *
 * @example
 * <div>
 * <code>
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the horizontal mouse position
 *   //relative to the window
 *   myCanvas.position(winMouseX+1, windowHeight/2);
 *
 *  //the y of the square is relative to the canvas
 *  rect(20,mouseY,60,60);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.winMouseX = 0;

/**
 * The system variable winMouseY always contains the current vertical
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property winMouseY
 *
 * @example
 * <div>
 * <code>
 *var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the vertical mouse position
 *   //relative to the window
 *   myCanvas.position(windowWidth/2, winMouseY+1);
 *
 *  //the x of the square is relative to the canvas
 *  rect(mouseX,20,60,60);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.winMouseY = 0;

/**
 * The system variable pwinMouseX always contains the horizontal position
 * of the mouse in the frame previous to the current frame, relative to
 * (0, 0) of the window.
 *
 * @property pwinMouseX
 *
 * @example
 * <div>
 * <code>
 *
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 *   }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current x position is the horizontal mouse speed
 *   var speed = abs(winMouseX-pwinMouseX);
 *   //change the size of the circle
 *   //according to the horizontal speed
 *   ellipse(50, 50, 10+speed*5, 10+speed*5);
 *   //move the canvas to the mouse position
 *   myCanvas.position( winMouseX+1, winMouseY+1);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pwinMouseX = 0;

/**
 * The system variable pwinMouseY always contains the vertical position of
 * the mouse in the frame previous to the current frame, relative to (0, 0)
 * of the window.
 *
 * @property pwinMouseY
 *
 *
 * @example
 * <div>
 * <code>
 *
 * var myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 *   }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current y position is the vertical mouse speed
 *   var speed = abs(winMouseY-pwinMouseY);
 *   //change the size of the circle
 *   //according to the vertical speed
 *   ellipse(50, 50, 10+speed*5, 10+speed*5);
 *   //move the canvas to the mouse position
 *   myCanvas.position( winMouseX+1, winMouseY+1);
 * }
 *
 * </code>
 * </div>
 */
p5.prototype.pwinMouseY = 0;

/**
 * Processing automatically tracks if the mouse button is pressed and which
 * button is pressed. The value of the system variable mouseButton is either
 * LEFT, RIGHT, or CENTER depending on which button was pressed last.
 * Warning: different browsers may track mouseButton differently.
 *
 * @property mouseButton
 *
 * @example
	* <div>
	* <code>
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*
	*   if (mouseIsPressed) {
	*     if (mouseButton == LEFT)
	*       ellipse(50, 50, 50, 50);
	*     if (mouseButton == RIGHT)
	*       rect(25, 25, 50, 50);
	*     if (mouseButton == CENTER)
	*       triangle(23, 75, 50, 20, 78, 75);
	*   }
	*
	*   print(mouseButton);
	* }
	* </code>
 * </div>
 */
p5.prototype.mouseButton = 0;

/**
 * The boolean system variable mouseIsPressed is true if the mouse is pressed
 * and false if not.
 *
 * @property mouseIsPressed
 *
 * @example
	* <div>
	* <code>
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*
	*   if (mouseIsPressed)
	*     ellipse(50, 50, 50, 50);
	*   else
	*     rect(25, 25, 50, 50);
	*
	*   print(mouseIsPressed);
	* }
	* </code>
	* </div>
 */
p5.prototype.mouseIsPressed = false;
p5.prototype.isMousePressed = false; // both are supported

p5.prototype._updateMouseCoords = function(e) {
  if(e.type === 'touchstart' ||
     e.type === 'touchmove' ||
     e.type === 'touchend') {
    this._updatePTouchCoords();
    this._setProperty('mouseX', this.touchX);
    this._setProperty('mouseY', this.touchY);
  } else {
    if(this._curElement !== null) {
      this._updatePMouseCoords();
      var mousePos = getMousePos(this._curElement.elt, e);
      this._setProperty('mouseX', mousePos.x);
      this._setProperty('mouseY', mousePos.y);
    }
  }
  this._setProperty('winMouseX', e.pageX);
  this._setProperty('winMouseY', e.pageY);
};

p5.prototype._updatePMouseCoords = function() {
  this._setProperty('pmouseX', this.mouseX);
  this._setProperty('pmouseY', this.mouseY);
  this._setProperty('pwinMouseX', this.winMouseX);
  this._setProperty('pwinMouseY', this.winMouseY);
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

p5.prototype._setMouseButton = function(e) {
  if (e.button === 1) {
    this._setProperty('mouseButton', constants.CENTER);
  } else if (e.button === 2) {
    this._setProperty('mouseButton', constants.RIGHT);
  } else {
    this._setProperty('mouseButton', constants.LEFT);
    if(e.type === 'touchstart' || e.type === 'touchmove') {
      this._setProperty('mouseX', this.touchX);
      this._setProperty('mouseY', this.touchY);
    }
  }
};

/**
 * The mouseMoved() function is called every time the mouse moves and a mouse
 * button is not pressed.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseMoved
 * @example
 * <div>
 * <code>
 * // Move the mouse across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseMoved() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */

/**
 * The mouseDragged() function is called once every time the mouse moves and
 * a mouse button is pressed. If no mouseDragged() function is defined, the
 * touchMoved() function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseDragged
 * @example
 * <div>
 * <code>
 * // Drag the mouse across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseDragged() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseDragged() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousemove = function(e){
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateMouseCoords(e);
  if (!this.isMousePressed) {
    if (typeof context.mouseMoved === 'function') {
      executeDefault = context.mouseMoved(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  }
  else {
    if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchMoved === 'function') {
      executeDefault = context.touchMoved(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
      this._updateTouchCoords(e);
    }
  }
};

/**
 * The mousePressed() function is called once after every time a mouse button
 * is pressed. The mouseButton variable (see the related reference entry)
 * can be used to determine which button has been pressed. If no
 * mousePressed() function is defined, the touchStarted() function will be
 * called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mousePressed
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mousePressed() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mousePressed() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousedown = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._setProperty('isMousePressed', true);
  this._setProperty('mouseIsPressed', true);
  this._setMouseButton(e);
  this._updateMouseCoords(e);
  if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateTouchCoords(e);
  }
};

/**
 * The mouseReleased() function is called every time a mouse button is
 * released. If no mouseReleased() function is defined, the touchEnded()
 * function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 *
 * @method mouseReleased
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseReleased() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseReleased() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmouseup = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._setProperty('isMousePressed', false);
  this._setProperty('mouseIsPressed', false);
  if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateTouchCoords(e);
  }
};

p5.prototype._ondragend = p5.prototype._onmouseup;
p5.prototype._ondragover = p5.prototype._onmousemove;

/**
 * The mouseClicked() function is called once after a mouse button has been
 * pressed and then released.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method mouseClicked
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function mouseClicked() {
 *   if (value == 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function mouseClicked() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onclick = function(e) {
  var context = this._isGlobal ? window : this;
  if (typeof context.mouseClicked === 'function') {
    var executeDefault = context.mouseClicked(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The function mouseWheel is executed every time a scroll event is detected
 * either triggered by an actual mouse wheel or by a touchpad.<br>
 * The event.delta property returns -1 or +1 depending on the scroll
 * direction and the user's settings. (on OS X with "natural" scrolling
 * enabled, the values are inverted).<br><br>
 * Browsers may have different default behaviors attached to various
 * mouse events. To prevent any default behavior for this event, add
 * `return false` to the end of the method.
 *
 * The event.wheelDelta or event.detail properties can also be accessed but
 * their behavior may differ depending on the browser.
 * See <a href="http://www.javascriptkit.com/javatutors/onmousewheel.shtml">
 * mouse wheel event in JS</a>.
 *
 * @method mouseWheel
 *
	* @example
	* <div>
	* <code>
	* var pos = 25;
	*
	* function draw() {
	*   background(237, 34, 93);
	*   fill(0);
	*   rect(25, pos, 50, 50);
	* }
	*
	* function mouseWheel(event) {
	*   //event.delta can be +1 or -1 depending
	*   //on the wheel/scroll direction
	*   print(event.delta);
	*   //move the square one pixel up or down
	*   pos += event.delta;
	*   //uncomment to block page scrolling
	*   //return false;
	* }
	* </code>
	* </div>
 */
p5.prototype._onmousewheel = p5.prototype._onDOMMouseScroll = function(e) {
  var context = this._isGlobal ? window : this;
  if (typeof context.mouseWheel === 'function') {
    //creating a delta property (either +1 or -1)
    //for cross-browser compatibility
    e.delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var executeDefault = context.mouseWheel(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  }
};

module.exports = p5;
