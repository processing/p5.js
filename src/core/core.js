/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires constants
 */
define(function (require) {

  'use strict';

  require('shim');

  // Core needs the PVariables object
  // TODO: ???
  var constants = require('constants');

  /**
   * p5
   * 
   * This is the p5 instance constructor.
   *
   * A p5 instance holds all the properties and methods related to
   * a p5 sketch.  It expects an incoming sketch closure with optional
   * preload(), setup() and draw() properties to attach to this p5
   * instance for running a sketch.  It can also take an optional node
   * parameter for attaching the generated p5 canvas to a node.
   *
   * A p5 sketch can run in "global" or "instance" mode:
   * "global"   - all properties and methods are attached to the window
   * "instance" - all properties and methods are bound to this p5 object
   *
   * @param  {Function}    sketch a closure with optional preload(), setup()
  *                               and draw() properties
   * @param  {HTMLElement} node   an element to attach the generated canvas to
   * @return {p5}                 a p5 instance
   */
  var p5 = function(sketch, node) {

    //////////////////////////////////////////////
    // PUBLIC p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////


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

    /**
     * Called directly after setup(), the draw() function continuously executes
     * the lines of code contained inside its block until the program is stopped
     * or noLoop() is called. draw() is called automatically and should never be
     * called explicitly.
     *
     * It should always be controlled with noLoop(), redraw() and loop(). After
     * noLoop() stops the code in draw() from executing, redraw() causes the
     * code inside draw() to execute once, and loop() will cause the code
     * inside draw() to resume executing continuously.
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
     */

    /**
     * @method remove
     */
    this.remove = function() {
      if (this._curElement) {

        // stop draw
        if (this._timeout) {
          clearTimeout(this._timeout);
          this._loop = false;
        }

        // unregister events sketch-wide
        for (var ev in this._events) {
          window.removeEventListener(ev, this._events[ev]);
        }

        // unregister events canvas-specific
        for (var cev in this._curElement._events) {
          var f = this._curElement._events[cev];
          this._curElement.elt.removeEventListener(cev, f);
        }

        // remove window bound properties and methods
        if (this._isGlobal) {
          for (var method in p5.prototype) {
            delete(window[method]);
          }
          // Attach its properties to the window
          for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
              delete(window[prop]);
            }
          }
          for (var constant in constants) {
            delete(window[constant]);
          }
        }

        // remove canvas from DOM
        var elt = this._curElement.elt;
        elt.parentNode.removeChild(elt);

      }
    }.bind(this);
    
    //////////////////////////////////////////////
    // PRIVATE p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    this._setupDone = false;
    this._pixelDensity = window.devicePixelRatio || 1; // for handling hidpi
    this._startTime = new Date().getTime();
    this._userNode = node;
    this._curElement = null;
    this._preloadCount = 0;
    this._updateInterval = 0;
    this._isGlobal = false;
    this._loop = true;
    this.styles = [];
    this._defaultCanvasSize = {
      width: 100,
      height: 100
    };
    this._events = { // keep track of user-events for unregistering later
      'mousemove': null,
      'mousedown': null,
      'mouseup': null,
      'click': null,
      'mousewheel': null,
      'mouseover': null,
      'mouseout': null,
      'keydown': null,
      'keyup': null,
      'keypress': null,
      'touchstart': null,
      'touchmove': null,
      'touchend': null
    };

    this._start = function () {
      // Find node if id given
      if (this._userNode) {
        if (typeof this._userNode === 'string') {
          this._userNode = document.getElementById(this._userNode);
        }
      }

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
        this._preloadFuncs.forEach(function(f) {
          context[f] = function(path) {
            return context._preload(f, path);
          };
        });
        userPreload();
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
    }.bind(this);

    this._preload = function (func, path) {
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
    }.bind(this);

    this._setup = function() {
      // Short-circuit on this, in case someone used the library in "global"
      // mode earlier
      var userSetup = this.setup || window.setup;
      if (typeof userSetup === 'function') {
        userSetup();
      }

      // unhide any hidden canvases that were created
      var reg = new RegExp(/(^|\s)p5_hidden(?!\S)/g);
      var canvases = document.getElementsByClassName('p5_hidden');
      for (var i = 0; i < canvases.length; i++) {
        var k = canvases[i];
        k.style.visibility = '';
        k.className = k.className.replace(reg, '');
      }
      this._setupDone = true;
    }.bind(this);

    this._draw = function () {
      var userSetup = this.setup || window.setup;
      var now = new Date().getTime();
      this._frameRate = 1000.0/(now - this._lastFrameTime);
      this._lastFrameTime = now;

      var userDraw = this.draw || window.draw;

      if (this._loop) {
        this._timeout = setTimeout(function() {
          window.requestDraw(this._draw.bind(this));
        }.bind(this), 1000 / this._targetFrameRate);
      }
      // call user's draw
      if (typeof userDraw === 'function') {
        this.pushMatrix();
        if (typeof userSetup === 'undefined') {
          this.scale(this._pixelDensity, this._pixelDensity);
        }
        userDraw();
        this.popMatrix();
      }
    }.bind(this);

    this._runFrames = function() {
      if (this._updateInterval) {
        clearInterval(this._updateInterval);
      }
      this._updateInterval = setInterval(function(){
        this._setProperty('frameCount', this.frameCount + 1);
      }.bind(this), 1000/this._targetFrameRate);
    }.bind(this);

    this._applyDefaults = function() {
      this._curElement.context.fillStyle = '#FFFFFF';
      this._curElement.context.strokeStyle = '#000000';
      this._curElement.context.lineCap = constants.ROUND;
    }.bind(this);

    this._setProperty = function(prop, value) {
      this[prop] = value;
      if (this._isGlobal) {
        window[prop] = value;
      }
    }.bind(this);

    this._registerPreloadFunc = function(func) {
      this._preloadFuncs.push(func);
    }.bind(this);

    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global (i.e. on the window)
    if (!sketch) {
      this._isGlobal = true;
      // Loop through methods on the prototype and attach them to the window
      for (var method in p5.prototype) {
        var ev = method.substring(2);
        if (!this._events.hasOwnProperty(ev)) {
          if(typeof p5.prototype[method] === 'function') {
            window[method] = p5.prototype[method].bind(this);
          }
        }
      }
      // Attach its properties to the window
      for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
          window[prop] = this[prop];
        }
      }
      for (var p in p5.prototype) {
        if (p5.prototype.hasOwnProperty(p) &&
          typeof p5.prototype[p] !== 'function') {
          window[p] = this[p];
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

    }

    // Bind events to window (not using container div bc key events don't work)
    for (var e in this._events) {
      var f = this['on'+e];
      if (f) {
        var m = f.bind(this);
        window.addEventListener(e, m);
        this._events[e] = m;
      }
    }

    // TODO: ???
    if (document.readyState === 'complete') {
      this._start();
    } else {
      window.addEventListener('load', this._start.bind(this), false);
    }

  };

  // attach constants to p5 instance
  for (var c in constants) {
    if (constants.hasOwnProperty(c)) {
      p5.prototype[c] = constants[c];
    }
  }

  p5.prototype._preloadFuncs = [
    'loadJSON',
    'loadImage',
    'loadStrings',
    'loadXML'
  ];
  p5.prototype._registerPreloadFunc = function (func) {
    p5.prototype._preloadFuncs.push(func);
  }.bind(this);

  return p5;

});