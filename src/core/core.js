/**
 * @module *
 */
define(function (require) {

  'use strict';

  require('shim');

  // Core needs the PVariables object
  // TODO: ???
  var constants = require('constants');

  /**
   * p5 instance constructor
   *
   * A p5 instance....
   *
   * Can run in "global" or "instance" mode:
   *   "global" - 
   *   "instance" - 
   *
   * Public fields on a p5 instance:
   * 
   *
   * @param {HTMLElement}  node - to attach the instance to
   * @param {Function}     sketch - with a setup() and draw() properties
   * @return {p5}
   */
  var p5 = function(sketch, node) {

    // ******************************************
    // PUBLIC p5 PROTOTYPE PROPERTIES
    //   

    /**
     * The system variable frameCount contains the number of frames that have
     * been displayed since the program started. Inside setup() the value is 0,
     * after the first iteration of draw it is 1, etc.
     *
     * @property frameCount
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     function setup() {
     *       frameRate(30);
     *     }
     *
     *     function draw() {
     *       line(0, 0, width, height);
     *       print(frameCount);
     *     }
     *   </code></div>
     */
    this.frameCount = 0;

    /**
     * Confirms if a p5.js program is "focused," meaning that it is active and
     * will accept mouse or keyboard input. This variable is "true" if it is
     * focused and "false" if not.
     *
     * @property focused
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     if (focused) {  // or "if (focused === true)"
     *       ellipse(25, 25, 50, 50);
     *     } else {
     *       line(0, 0, 100, 100);
     *       line(100, 0, 0, 100);
     *     }
     *   </code></div>
     */
    this.focused = true;
  
    /**
     * System variable that stores the width of the entire screen display. This
     * is used to run a full-screen program on any display size.
     *
     * @property displayWidth
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     size(displayWidth, displayHeight);
     *   </code></div>
     */
    this.displayWidth = screen.width;
  
    /**
     * System variable that stores the height of the entire screen display. This
     * is used to run a full-screen program on any display size.
     *
     * @property displayHeight
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     size(displayWidth, displayHeight);
     *   </code></div>
     */
    this.displayHeight = screen.height;
  
    /**
     * System variable that stores the width of the inner window, it maps to
     * window.innerWidth
     *
     * @property windowWidth
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     size(windowWidth, windowHeight);
     *   </code></div>
     */
    this.windowWidth = window.innerWidth;
  
    /**
     * System variable that stores the height of the inner window, it maps to
     * window.innerHeight
     *
     * @property windowHeight
     * @for Environment:Environment
     * @example
     *   <div><code>
     *     size(windowWidth, windowHeight);
     *   </code></div>
     */
    this.windowHeight = window.innerHeight;

    /**
     * System variable that stores the width of the drawing canvas. This value
     * is set by the first parameter of the createCanvas() function.
     * For example, the function call createCanvas(320, 240) sets the width
     * variable to the value 320. The value of width defaults to 100 if
     * createCanvas() is not used in a program.
     *
     * @property width
     * @for Environment:Environment
     */
    this.width = 0;
  
    /**
     * System variable that stores the height of the drawing canvas. This value
     * is set by the second parameter of the createCanvas() function. For
     * example, the function call createCanvas(320, 240) sets the height
     * variable to the value 240. The value of height defaults to 100 if
     * createCanvas() is not used in a program.
     *
     * @property height
     * @for Environment:Environment
     */
    this.height = 0;
  
    // TODO: ???
    window.addEventListener('resize', function (e) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });

    // Shape.Vertex
    this.shapeKind = null;
    this.shapeInited = false;

    // Input.Mouse
    this.mouseX = 0;
    this.mouseY = 0;
    this.pmouseX = 0;
    this.pmouseY = 0;
    this.winMouseX = 0;
    this.winMouseY = 0;
    this.pwinMouseX = 0;
    this.pwinMouseY = 0;
    this.mouseButton = 0;
    this.isMousePressed = false;
    this.mouseIsPressed = false; // khan

    // Input.Keyboard
    this.key = '';
    this.keyCode = 0;
    this.isKeyPressed = false;
    this.keyIsPressed = false; // khan

    // Input.Touch
    this.touchX = 0;
    this.touchY = 0;

    // Output.Files
    this.pWriters = [];

    // Image.Pixels
    /**
     * Array containing the values for all the pixels in the display window.
     * These values are of the color datatype. This array is the size of the
     * display window. For example, if the image is 100x100 pixels, there will
     * be 10000 values and if the window is 200x300 pixels, there will be 60000
     * values. The index value defines the position of a value within the
     * array.
     *
     * Before accessing this array, the data must loaded with the loadPixels()
     * function. After the array data has been modified, the updatePixels()
     * function must be run to update the changes.
     *
     * @property pixels[]
     * @for Image:Pixels
     */
    this.pixels = [];

    // TODO: ???
    this.curElement = null;
    this.matrices = [[1,0,0,1,0,0]];

    // TODO: ???
    this.settings = {
      // Structure
      loop: true,
      fill: false,
      updateInterval: 0,
      rectMode: constants.CORNER,
      imageMode: constants.CORNER,
      ellipseMode: constants.CENTER,
      colorMode: constants.RGB,
      angleMode: constants.RADIANS,
      tint: null
    };

    // ******************************************
    // PRIVATE p5 PROTOTYPE PROPERTIES
    //

    // Keep a reference to when this instance was created
    this._startTime = new Date().getTime();

    this._userNode = node;
    // find node if id given
    if (this._userNode) {
      if (typeof this._userNode === 'string') {
        this._userNode = document.getElementById(this._userNode);
      }
    }

    // TODO: ???
    this._preloadCount = 0;

    // Tracks whether p5 is running in "global" or "instance" mode
    this._isGlobal = false;

    // Default canvas size
    this._defaultCanvasSize = {
      width: 100,
      height: 100
    };

    // Environment
    this._frameRate = 0;
    this._lastFrameTime = 0;
    this._targetFrameRate = 60;

    // Text
    this._textLeading = 15;
    this._textFont = 'sans-serif';
    this._textSize = 12;
    this._textStyle = constants.NORMAL;

    // TODO: ???
    this.styles = [];

    // Curves
    this._bezierDetail = 20;
    this._curveDetail = 20;

    //Vertices
    this._contourInited = false;
    this._contourVertices = [];

    //Tint

    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global (i.e. on the window)
    if (!sketch) {
      this._isGlobal = true;
      // Loop through methods on the prototype and attach them to the window
      for (var method in p5.prototype) {
        window[method] = p5.prototype[method].bind(this);
      }
      // Attach its properties to the window
      for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
          window[prop] = this[prop];
        }
      }
      for (var constant in constants) {
        if (constants.hasOwnProperty(constant)) {
          window[constant] = constants[constant];
        }
      }
    } else {
      // Else, the user has passed in a sketch function closure
      // So create attach the user given 'setup', 'draw', etc on this
      // instance of p5
      sketch(this);

      // attach constants to p5 instance
      for (var c in constants) {
        if (constants.hasOwnProperty(c)) {
          p5.prototype[c] = constants[c];
        }
      }

      // bind events to window or to container div (instance mode)
      var ctx = this._userNode ? this._userNode : window;
      ctx.addEventListener('mousemove', function (e) {
        this.onmousemove(e);
      }.bind(this));
      ctx.addEventListener('mousedown', function (e) {
        this.onmousedown(e);
      }.bind(this));
      ctx.addEventListener('mouseup', function (e) {
        this.onmouseup(e);
      }.bind(this));
      ctx.addEventListener('mouseclick', function (e) {
        this.onmouseclick(e);
      }.bind(this));
      ctx.addEventListener('mousewheel', function (e) {
        this.onmousewheel(e);
      }.bind(this));
      ctx.addEventListener('keydown', function (e) {
        this.onkeydown(e);
      }.bind(this));
      ctx.addEventListener('keyup', function (e) {
        this.onkeyup(e);
      }.bind(this));
      ctx.addEventListener('keypress', function (e) {
        this.onkeypress(e);
      }.bind(this));
      ctx.addEventListener('touchstart', function (e) {
        this.ontouchstart(e);
      }.bind(this));
      ctx.addEventListener('touchmove', function (e) {
        this.ontouchmove(e);
      }.bind(this));
      ctx.addEventListener('touchend', function (e) {
        this.ontouchend(e);
      }.bind(this));
    }

    if (document.readyState === 'complete') {
      this._start();
    } else {
      window.addEventListener('load', this._start.bind(this), false);
    }

  };

  // ******************************************
  // PRIVATE p5 PROTOTYPE METHODS
  //

  /**
   * _start
   *
   * TODO: ???
   * looks for "preload" on sketch or on window
   * 
   * @return {Undefined}
   */
  p5.prototype._start = function () {

    // Always create a default canvas.
    // Later on if the user calls createCanvas, this default one
    // will be replaced
    this.createCanvas(
      this._defaultCanvasSize.width,
      this._defaultCanvasSize.height,
      true
    );

    var userPreload = this.preload || window.preload; // look for "preload"
    var context = this._isGlobal ? window : this;
    if (userPreload) {
      context.loadJSON = function (path) {
        return context._preload('loadJSON', path); // _preload?
      };
      context.loadStrings = function (path) {
        return context._preload('loadStrings', path); // _preload?
      };
      context.loadXML = function (path) {
        return context._preload('loadXML', path); // _preload?
      };
      context.loadImage = function (path) {
        return context._preload('loadImage', path); // _preload?
      };
      userPreload();
      context.loadJSON = p5.prototype.loadJSON;
      context.loadStrings = p5.prototype.loadStrings;
      context.loadXML = p5.prototype.loadXML;
      context.loadImage = p5.prototype.loadImage;
      if (this._preloadCount === 0) {
        this._setup();
        this._runFrames();
        this._draw();
      }
    } else {
      this._setup();
      this._runFrames();
      this._draw();
    }
  };

  /**
   * _preload
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._preload = function (func, path) {
    var context = this._isGlobal ? window : this;
    context._setProperty('_preloadCount', context._preloadCount + 1);
    return p5.prototype[func].call(context, path, function (resp) {
      context._setProperty('_preloadCount', context._preloadCount - 1);
      if (context._preloadCount === 0) {
        context._setup();
        context._runFrames();
        context._draw();
      }
    });
  };

  /**
   * The setup() function is called once when the program starts. It's used to
   * define initial enviroment properties such as screen size and background
   * color and to load media such as images and fonts as the program starts.
   * There can only be one setup() function for each program and it shouldn't
   * be called again after its initial execution. Note: Variables declared
   * within setup() are not accessible within other functions, including
   * draw().
   *
   * @method setup
   * @for Structure:Structure
   * @example
   *   <div><code>
   *     var a = 0;
   *
   *     function setup() {
   *       createCanvas(200, 200);
   *       background(0);
   *       noStroke();
   *       fill(102);
   *     }
   *
   *     function draw() {
   *       rect(a++%width, 10, 2, 80); 
   *     }
   *   </code></div>
   */
  p5.prototype._setup = function() {
    // Short-circuit on this, in case someone used the library in "global"
    // mode earlier
    var userSetup = this.setup || window.setup;
    if (typeof userSetup === 'function') {
      userSetup();
    }
  };

  /**
   * Called directly after setup(), the draw() function continuously executes
   * the lines of code contained inside its block until the program is stopped
   * or noLoop() is called. draw() is called automatically and should never be
   * called explicitly.
   *
   * It should always be controlled with noLoop(), redraw() and loop(). After
   * noLoop() stops the code in draw() from executing, redraw() causes the code
   * inside draw() to execute once, and loop() will cause the code inside draw()
   * to resume executing continuously.
   * 
   * The number of times draw() executes in each second may be controlled with
   * the frameRate() function.
   * 
   * There can only be one draw() function for each sketch, and draw() must
   * exist if you want the code to run continuously, or to process events such
   * as mousePressed(). Sometimes, you might have an empty call to draw() in
   * your program, as shown in the above example.
   *
   * @method draw
   * @for Structure:Structure
   */
  p5.prototype._draw = function () {
    var now = new Date().getTime();
    this._frameRate = 1000.0/(now - this._lastFrameTime);
    this._lastFrameTime = now;

    var userDraw = this.draw || window.draw;

    if (this.settings.loop) {
      setTimeout(function() {
        window.requestDraw(this._draw.bind(this));
      }.bind(this), 1000 / this._targetFrameRate);
    }
    // call user's draw
    if (typeof userDraw === 'function') {
      userDraw();
    }

    this.curElement.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  /**
   * _runFrames
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._runFrames = function() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(function(){
      this._setProperty('frameCount', this.frameCount + 1);
    }.bind(this), 1000/this._targetFrameRate);
  };

  /**
   * _applyDefaults
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._applyDefaults = function() {
    this.curElement.context.fillStyle = '#FFFFFF';
    this.curElement.context.strokeStyle = '#000000';
    this.curElement.context.lineCap = constants.ROUND;
  };

  /**
   * _setProperty
   *
   * TODO: ???
   * 
   * @return {Undefined}
   */
  p5.prototype._setProperty = function(prop, value) {
    this[prop] = value;
    if (this._isGlobal) {
      window[prop] = value;
    }
  };

  return p5;

});