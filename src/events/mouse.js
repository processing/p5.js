/**
 * @module Events
 * @submodule Mouse
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 *
 * The variable movedX contains the horizontal movement of the mouse since the last frame
 * @property {Number} movedX
 * @readOnly
 * @example
 * <div class="notest">
 * <code>
 * let x = 50;
 * function setup() {
 *   rectMode(CENTER);
 * }
 *
 * function draw() {
 *   if (x > 48) {
 *     x -= 2;
 *   } else if (x < 48) {
 *     x += 2;
 *   }
 *   x += floor(movedX / 5);
 *   background(237, 34, 93);
 *   fill(0);
 *   rect(x, 50, 50, 50);
 *   describe(`box moves left and right according to mouse movement
 *     then slowly back towards the center`);
 * }
 * </code>
 * </div>
 */
p5.prototype.movedX = 0;

/**
 * The variable movedY contains the vertical movement of the mouse since the last frame
 * @property {Number} movedY
 * @readOnly
 * @example
 * <div class="notest">
 * <code>
 * let y = 50;
 * function setup() {
 *   rectMode(CENTER);
 * }
 *
 * function draw() {
 *   if (y > 48) {
 *     y -= 2;
 *   } else if (y < 48) {
 *     y += 2;
 *   }
 *   y += floor(movedY / 5);
 *   background(237, 34, 93);
 *   fill(0);
 *   rect(50, y, 50, 50);
 *   describe(`box moves up and down according to mouse movement then
 *     slowly back towards the center`);
 * }
 * </code>
 * </div>
 */
p5.prototype.movedY = 0;
/*
 * This is a flag which is false until the first time
 * we receive a mouse event. The pmouseX and pmouseY
 * values will match the mouseX and mouseY values until
 * this interaction takes place.
 */
p5.prototype._hasMouseInteracted = false;

/**
 * The system variable mouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the canvas. The value at
 * the top-left corner is (0, 0) for 2-D and (-width/2, -height/2) for WebGL.
 * If touch is used instead of mouse input, mouseX will hold the x value
 * of the most recent touch point.
 *
 * @property {Number} mouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(mouseX, 0, mouseX, 100);
 *   describe('horizontal black line moves left and right with mouse x-position');
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseX = 0;

/**
 * The system variable mouseY always contains the current vertical
 * position of the mouse, relative to (0, 0) of the canvas. The value at
 * the top-left corner is (0, 0) for 2-D and (-width/2, -height/2) for WebGL.
 * If touch is used instead of mouse input, mouseY will hold the y value
 * of the most recent touch point.
 *
 * @property {Number} mouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // Move the mouse across the canvas
 * function draw() {
 *   background(244, 248, 252);
 *   line(0, mouseY, 100, mouseY);
 *   describe('vertical black line moves up and down with mouse y-position');
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseY = 0;

/**
 * The system variable pmouseX always contains the horizontal position of
 * the mouse or finger in the frame previous to the current frame, relative to
 * (0, 0) of the canvas. The value at the top-left corner is (0, 0) for 2-D and
 * (-width/2, -height/2) for WebGL. Note: pmouseX will be reset to the current mouseX
 * value at the start of each touch event.
 *
 * @property {Number} pmouseX
 * @readOnly
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
 *   print(pmouseX + ' -> ' + mouseX);
 *   describe(`line trail is created from cursor movements.
 *     faster movement make longer line.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.pmouseX = 0;

/**
 * The system variable pmouseY always contains the vertical position of
 * the mouse or finger in the frame previous to the current frame, relative to
 * (0, 0) of the canvas. The value at the top-left corner is (0, 0) for 2-D and
 * (-width/2, -height/2) for WebGL. Note: pmouseY will be reset to the current mouseY
 * value at the start of each touch event.
 *
 * @property {Number} pmouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *   //draw a square only if the mouse is not moving
 *   if (mouseY === pmouseY && mouseX === pmouseX) {
 *     rect(20, 20, 60, 60);
 *   }
 *
 *   print(pmouseY + ' -> ' + mouseY);
 *   describe(`60-by-60 black rect center, fuchsia background.
 *     rect flickers on mouse movement`);
 * }
 * </code>
 * </div>
 */
p5.prototype.pmouseY = 0;

/**
 * The system variable winMouseX always contains the current horizontal
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property {Number} winMouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * let myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   let body = document.getElementsByTagName('body')[0];
 *   myCanvas.parent(body);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the horizontal mouse position
 *   //relative to the window
 *   myCanvas.position(winMouseX + 1, windowHeight / 2);
 *
 *   //the y of the square is relative to the canvas
 *   rect(20, mouseY, 60, 60);
 *   describe(`60-by-60 black rect y moves with mouse y and fuchsia
 *     canvas moves with mouse x`);
 * }
 * </code>
 * </div>
 */
p5.prototype.winMouseX = 0;

/**
 * The system variable winMouseY always contains the current vertical
 * position of the mouse, relative to (0, 0) of the window.
 *
 * @property {Number} winMouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * let myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   let body = document.getElementsByTagName('body')[0];
 *   myCanvas.parent(body);
 * }
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   //move the canvas to the vertical mouse position
 *   //relative to the window
 *   myCanvas.position(windowWidth / 2, winMouseY + 1);
 *
 *   //the x of the square is relative to the canvas
 *   rect(mouseX, 20, 60, 60);
 *   describe(`60-by-60 black rect x moves with mouse x and
 *     fuchsia canvas y moves with mouse y`);
 * }
 * </code>
 * </div>
 */
p5.prototype.winMouseY = 0;

/**
 * The system variable pwinMouseX always contains the horizontal position
 * of the mouse in the frame previous to the current frame, relative to
 * (0, 0) of the window. Note: pwinMouseX will be reset to the current winMouseX
 * value at the start of each touch event.
 *
 * @property {Number} pwinMouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * let myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 * }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current x position is the horizontal mouse speed
 *   let speed = abs(winMouseX - pwinMouseX);
 *   //change the size of the circle
 *   //according to the horizontal speed
 *   ellipse(50, 50, 10 + speed * 5, 10 + speed * 5);
 *   //move the canvas to the mouse position
 *   myCanvas.position(winMouseX + 1, winMouseY + 1);
 *   describe(`fuchsia ellipse moves with mouse x and y.
 *     Grows and shrinks with mouse speed`);
 * }
 * </code>
 * </div>
 */
p5.prototype.pwinMouseX = 0;

/**
 * The system variable pwinMouseY always contains the vertical position of
 * the mouse in the frame previous to the current frame, relative to (0, 0)
 * of the window. Note: pwinMouseY will be reset to the current winMouseY
 * value at the start of each touch event.
 *
 * @property {Number} pwinMouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * let myCanvas;
 *
 * function setup() {
 *   //use a variable to store a pointer to the canvas
 *   myCanvas = createCanvas(100, 100);
 *   noStroke();
 *   fill(237, 34, 93);
 * }
 *
 * function draw() {
 *   clear();
 *   //the difference between previous and
 *   //current y position is the vertical mouse speed
 *   let speed = abs(winMouseY - pwinMouseY);
 *   //change the size of the circle
 *   //according to the vertical speed
 *   ellipse(50, 50, 10 + speed * 5, 10 + speed * 5);
 *   //move the canvas to the mouse position
 *   myCanvas.position(winMouseX + 1, winMouseY + 1);
 *   describe(`fuchsia ellipse moves with mouse x and y.
 *     Grows and shrinks with mouse speed`);
 * }
 * </code>
 * </div>
 */
p5.prototype.pwinMouseY = 0;

/**
 * p5 automatically tracks if the mouse button is pressed and which
 * button is pressed. The value of the system variable mouseButton is either
 * LEFT, RIGHT, or CENTER depending on which button was pressed last.
 * Warning: different browsers may track mouseButton differently.
 *
 * @property {(LEFT|RIGHT|CENTER)} mouseButton
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   if (mouseIsPressed === true) {
 *     if (mouseButton === LEFT) {
 *       ellipse(50, 50, 50, 50);
 *     }
 *     if (mouseButton === RIGHT) {
 *       rect(25, 25, 50, 50);
 *     }
 *     if (mouseButton === CENTER) {
 *       triangle(23, 75, 50, 20, 78, 75);
 *     }
 *   }
 *
 *   print(mouseButton);
 *   describe(`50-by-50 black ellipse appears on center of fuchsia
 *     canvas on mouse click/press.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseButton = 0;

/**
 * The boolean system variable mouseIsPressed is true if the mouse is pressed
 * and false if not.
 *
 * @property {Boolean} mouseIsPressed
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *
 *   if (mouseIsPressed === true) {
 *     ellipse(50, 50, 50, 50);
 *   } else {
 *     rect(25, 25, 50, 50);
 *   }
 *
 *   print(mouseIsPressed);
 *   describe(`black 50-by-50 rect becomes ellipse with mouse click/press.
 *     fuchsia background.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseIsPressed = false;

p5.prototype._updateNextMouseCoords = function(e) {
  if (this._curElement !== null && (!e.touches || e.touches.length > 0)) {
    const mousePos = getMousePos(
      this._curElement.elt,
      this.width,
      this.height,
      e
    );
    this._setProperty('movedX', e.movementX);
    this._setProperty('movedY', e.movementY);
    this._setProperty('mouseX', mousePos.x);
    this._setProperty('mouseY', mousePos.y);
    this._setProperty('winMouseX', mousePos.winX);
    this._setProperty('winMouseY', mousePos.winY);
  }
  if (!this._hasMouseInteracted) {
    // For first draw, make previous and next equal
    this._updateMouseCoords();
    this._setProperty('_hasMouseInteracted', true);
  }
};

p5.prototype._updateMouseCoords = function() {
  this._setProperty('pmouseX', this.mouseX);
  this._setProperty('pmouseY', this.mouseY);
  this._setProperty('pwinMouseX', this.winMouseX);
  this._setProperty('pwinMouseY', this.winMouseY);

  this._setProperty('_pmouseWheelDeltaY', this._mouseWheelDeltaY);
};

function getMousePos(canvas, w, h, evt) {
  if (evt && !evt.clientX) {
    // use touches if touch and not mouse
    if (evt.touches) {
      evt = evt.touches[0];
    } else if (evt.changedTouches) {
      evt = evt.changedTouches[0];
    }
  }
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.scrollWidth / w || 1;
  const sy = canvas.scrollHeight / h || 1;
  return {
    x: (evt.clientX - rect.left) / sx,
    y: (evt.clientY - rect.top) / sy,
    winX: evt.clientX,
    winY: evt.clientY,
    id: evt.identifier
  };
}

p5.prototype._setMouseButton = function(e) {
  if (e.button === 1) {
    this._setProperty('mouseButton', constants.CENTER);
  } else if (e.button === 2) {
    this._setProperty('mouseButton', constants.RIGHT);
  } else {
    this._setProperty('mouseButton', constants.LEFT);
  }
};

/**
 * The <a href="#/p5/mouseMoved">mouseMoved()</a> function is called every time the mouse moves and a mouse
 * button is not pressed.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add "return false" to the end of the method.
 *
 * @method mouseMoved
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Move the mouse across the page
 * // to change its value
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black 50-by-50 rect becomes lighter with mouse movements until
 *   white then resets no image displayed`);
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
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function mouseMoved(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */

/**
 * The <a href="#/p5/mouseDragged">mouseDragged()</a> function is called once every time the mouse moves and
 * a mouse button is pressed. If no <a href="#/p5/mouseDragged">mouseDragged()</a> function is defined, the
 * <a href="#/p5/touchMoved">touchMoved()</a> function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add "return false" to the end of the function.
 *
 * @method mouseDragged
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Drag the mouse across the page
 * // to change its value
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black 50-by-50 rect turns lighter with mouse click and
 *     drag until white, resets`);
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
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function mouseDragged(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousemove = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._updateNextMouseCoords(e);
  if (!this.mouseIsPressed) {
    if (typeof context.mouseMoved === 'function') {
      executeDefault = context.mouseMoved(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  } else {
    if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchMoved === 'function') {
      executeDefault = context.touchMoved(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  }
};

/**
 * The <a href="#/p5/mousePressed">mousePressed()</a> function is called once after every time a mouse button
 * is pressed. The mouseButton variable (see the related reference entry)
 * can be used to determine which button has been pressed. If no
 * <a href="#/p5/mousePressed">mousePressed()</a> function is defined, the <a href="#/p5/touchStarted">touchStarted()</a> function will be
 * called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add "return false" to the end of the function.
 *
 * @method mousePressed
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Click anywhere in the webpage to change
 * // the color value of the rectangle
 *
 * let colorValue = 0;
 * function draw() {
 *   fill(colorValue);
 *   rect(25, 25, 50, 50);
 *   describe('black 50-by-50 rect turns white with mouse click/press.');
 * }
 * function mousePressed() {
 *   if (colorValue === 0) {
 *     colorValue = 255;
 *   } else {
 *     colorValue = 0;
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
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function mousePressed(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousedown = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._setProperty('mouseIsPressed', true);
  this._setMouseButton(e);
  this._updateNextMouseCoords(e);

  if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
    // only safari needs this manual fallback for consistency
  } else if (
    navigator.userAgent.toLowerCase().includes('safari') &&
    typeof context.touchStarted === 'function'
  ) {
    executeDefault = context.touchStarted(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The <a href="#/p5/mouseReleased">mouseReleased()</a> function is called every time a mouse button is
 * released. If no <a href="#/p5/mouseReleased">mouseReleased()</a> function is defined, the <a href="#/p5/touchEnded">touchEnded()</a>
 * function will be called instead if it is defined.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add "return false" to the end of the function.
 *
 * @method mouseReleased
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('black 50-by-50 rect turns white with mouse click/press.');
 * }
 * function mouseReleased() {
 *   if (value === 0) {
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
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function mouseReleased(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */
p5.prototype._onmouseup = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._setProperty('mouseIsPressed', false);
  if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._ondragend = p5.prototype._onmouseup;
p5.prototype._ondragover = p5.prototype._onmousemove;

/**
 * The <a href="#/p5/mouseClicked">mouseClicked()</a> function is called once after a mouse button has been
 * pressed and then released.<br><br>
 * Browsers handle clicks differently, so this function is only guaranteed to be
 * run when the left mouse button is clicked. To handle other mouse buttons
 * being pressed or released, see <a href="#/p5/mousePressed">mousePressed()</a> or <a href="#/p5/mouseReleased">mouseReleased()</a>.<br><br>
 * Browsers may have different default
 * behaviors attached to various mouse events. To prevent any default
 * behavior for this event, add "return false" to the end of the function.
 *
 * @method mouseClicked
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been clicked
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('black 50-by-50 rect turns white with mouse click/press.');
 * }
 *
 * function mouseClicked() {
 *   if (value === 0) {
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
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function mouseClicked(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */
p5.prototype._onclick = function(e) {
  const context = this._isGlobal ? window : this;
  if (typeof context.mouseClicked === 'function') {
    const executeDefault = context.mouseClicked(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The <a href="#/p5/doubleClicked">doubleClicked()</a> function is executed every time a event
 * listener has detected a dblclick event which is a part of the
 * DOM L3 specification. The doubleClicked event is fired when a
 * pointing device button (usually a mouse's primary button)
 * is clicked twice on a single element. For more info on the
 * dblclick event refer to mozilla's documentation here:
 * https://developer.mozilla.org/en-US/docs/Web/Events/dblclick
 *
 * @method doubleClicked
 * @param  {MouseEvent} [event] optional MouseEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Click within the image to change
 * // the value of the rectangle
 * // after the mouse has been double clicked
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('black 50-by-50 rect turns white with mouse doubleClick/press.');
 * }
 *
 * function doubleClicked() {
 *   if (value === 0) {
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
 * function doubleClicked() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // returns a MouseEvent object
 * // as a callback argument
 * function doubleClicked(event) {
 *   console.log(event);
 * }
 * </code>
 * </div>
 */

p5.prototype._ondblclick = function(e) {
  const context = this._isGlobal ? window : this;
  if (typeof context.doubleClicked === 'function') {
    const executeDefault = context.doubleClicked(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * For use with WebGL orbitControl.
 * @property {Number} _mouseWheelDeltaY
 * @readOnly
 * @private
 */
p5.prototype._mouseWheelDeltaY = 0;

/**
 * For use with WebGL orbitControl.
 * @property {Number} _pmouseWheelDeltaY
 * @readOnly
 * @private
 */
p5.prototype._pmouseWheelDeltaY = 0;

/**
 * The function <a href="#/p5/mouseWheel">mouseWheel()</a> is executed every time a vertical mouse wheel
 * event is detected either triggered by an actual mouse wheel or by a
 * touchpad.<br><br>
 * The event.delta property returns the amount the mouse wheel
 * have scrolled. The values can be positive or negative depending on the
 * scroll direction (on macOS with "natural" scrolling enabled, the signs
 * are inverted).<br><br>
 * Browsers may have different default behaviors attached to various
 * mouse events. To prevent any default behavior for this event, add
 * "return false" to the end of the method.<br><br>
 * Due to the current support of the "wheel" event on Safari, the function
 * may only work as expected if "return false" is included while using Safari.
 *
 * @method mouseWheel
 * @param  {WheelEvent} [event] optional WheelEvent callback argument.
 *
 * @example
 * <div>
 * <code>
 * let pos = 25;
 *
 * function draw() {
 *   background(237, 34, 93);
 *   fill(0);
 *   rect(25, pos, 50, 50);
 *   describe(`black 50-by-50 rect moves up and down with vertical scroll.
 *     fuchsia background`);
 * }
 *
 * function mouseWheel(event) {
 *   print(event.delta);
 *   //move the square according to the vertical scroll amount
 *   pos += event.delta;
 *   //uncomment to block page scrolling
 *   //return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onwheel = function(e) {
  const context = this._isGlobal ? window : this;
  this._setProperty('_mouseWheelDeltaY', e.deltaY);
  if (typeof context.mouseWheel === 'function') {
    e.delta = e.deltaY;
    const executeDefault = context.mouseWheel(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The function <a href="#/p5/requestPointerLock">requestPointerLock()</a>
 * locks the pointer to its current position and makes it invisible.
 * Use <a href="#/p5/movedX">movedX</a> and <a href="#/p5/movedY">movedY</a> to get the difference the mouse was moved since
 * the last call of draw.
 * Note that not all browsers support this feature.
 * This enables you to create experiences that aren't limited by the mouse moving out of the screen
 * even if it is repeatedly moved into one direction.
 * For example, a first person perspective experience.
 *
 * @method requestPointerLock
 * @example
 * <div class="notest">
 * <code>
 * let cam;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   requestPointerLock();
 *   cam = createCamera();
 * }
 *
 * function draw() {
 *   background(255);
 *   cam.pan(-movedX * 0.001);
 *   cam.tilt(movedY * 0.001);
 *   sphere(25);
 *   describe(`3D scene moves according to mouse mouse movement in a
 *     first person perspective`);
 * }
 * </code>
 * </div>
 */
p5.prototype.requestPointerLock = function() {
  // pointer lock object forking for cross browser
  const canvas = this._curElement.elt;
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  if (!canvas.requestPointerLock) {
    console.log('requestPointerLock is not implemented in this browser');
    return false;
  }
  canvas.requestPointerLock();
  return true;
};

/**
 * The function <a href="#/p5/exitPointerLock">exitPointerLock()</a>
 * exits a previously triggered <a href="#/p5/requestPointerLock">pointer Lock</a>
 * for example to make ui elements usable etc
 *
 * @method exitPointerLock
 * @example
 * <div class="notest">
 * <code>
 * //click the canvas to lock the pointer
 * //click again to exit (otherwise escape)
 * let locked = false;
 * function draw() {
 *   background(237, 34, 93);
 *   describe('cursor gets locked / unlocked on mouse-click');
 * }
 * function mouseClicked() {
 *   if (!locked) {
 *     locked = true;
 *     requestPointerLock();
 *   } else {
 *     exitPointerLock();
 *     locked = false;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.exitPointerLock = function() {
  document.exitPointerLock();
};

export default p5;
