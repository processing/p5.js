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
  var constants = require('constants');

  /**
   * This is the p5 instance constructor.
   *
   * A p5 instance holds all the properties and methods related to
   * a p5 sketch.  It expects an incoming sketch closure and it can also
   * take an optional node parameter for attaching the generated p5 canvas
   * to a node.  The sketch closure takes the newly created p5 instance as
   * its sole argument and may optionally set preload(), setup(), and/or
   * draw() properties on it for running a sketch.
   *
   * A p5 sketch can run in "global" or "instance" mode:
   * "global"   - all properties and methods are attached to the window
   * "instance" - all properties and methods are bound to this p5 object
   *
   * @param  {Function}    sketch a closure that can set optional preload(),
   *                              setup(), and/or draw() properties on the
   *                              given p5 instance
   * @param  {HTMLElement|boolean} node element to attach canvas to, if a 
   *                                    boolean is passed in use it as sync
   * @param  {boolean}     [sync] start synchronously (optional)
   * @return {p5}                 a p5 instance
   */
  var p5 = function(sketch, node, sync) {

    if (arguments.length === 2 && typeof node === 'boolean') {
      sync = node;
      node = undefined;
    }

    //////////////////////////////////////////////
    // PUBLIC p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////


    /**
     * Called directly before setup(), the preload() function is used to handle
     * asynchronous loading of external files. If a preload function is
     * defined, setup() will wait until any load calls within have finished.
     * Nothing besides load calls should be inside preload (loadImage,
     * loadJSON, loadStrings, etc).
     *
     * @method preload
     * @example
     * <div><code>
     * var img;
     * var c;
     * function preload() {  // preload() runs once
     *   img = loadImage('assets/laDefense.jpg');
     * }
     * 
     * function setup() {  // setup() waits until preload() is done
     *   img.loadPixels();
     *   // get color of middle pixel
     *   c = img.get(img.width/2, img.height/2);
     * }
     * 
     * function draw() {
     *   background(c);
     *   image(img, 25, 25, 50, 50);
     * }
     * </code></div>
     */

    /**
     * The setup() function is called once when the program starts. It's used to
     * define initial environment properties such as screen size and background
     * color and to load media such as images and fonts as the program starts.
     * There can only be one setup() function for each program and it shouldn't
     * be called again after its initial execution. Note: Variables declared
     * within setup() are not accessible within other functions, including
     * draw().
     *
     * @method setup
     * @example
     * <div><code>
     * var a = 0;
     *
     * function setup() {
     *   background(0);
     *   noStroke();
     *   fill(102);
     * }
     *
     * function draw() {
     *   rect(a++%width, 10, 2, 80);
     * }
     * </code></div>
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
     * @example
     * <div><code>
     * var yPos = 0;
     * function setup() {  // setup() runs once
     *   frameRate(30);
     * }
     * function draw() {  // draw() loops forever, until stopped
     *   background(204);
     *   yPos = yPos - 1;
     *   if (yPos < 0) {
     *     yPos = height;
     *   }
     *   line(0, yPos, width, yPos);
     * }
     * </code></div>
     */


    //////////////////////////////////////////////
    // PRIVATE p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    this._setupDone = false;
    this._pixelDensity = window.devicePixelRatio || 1; // for handling hidpi
    this._startTime = new Date().getTime();
    this._userNode = node;
    this._curElement = null;
    this._elements = [];
    this._preloadCount = 0;
    this._updateInterval = 0;
    this._isGlobal = false;
    this._loop = true;
    this._styles = [];
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
      'touchend': null,
      'resize': null,
      'blur': null
    };
    this._loadingScreenId = 'p5_loading';

    this._start = function () {
      // Find node if id given
      if (this._userNode) {
        if (typeof this._userNode === 'string') {
          this._userNode = document.getElementById(this._userNode);
        }
      }

      // Setup loading screen
      // Set loading scfeen into dom if not present
      // Otherwise displays and removes user provided loading screen
      this._loadingScreen = document.getElementById(this._loadingScreenId);
      if(!this._loadingScreen){
        this._loadingScreen = document.createElement('loadingDiv');
        this._loadingScreen.innerHTML = 'loading...';
        this._loadingScreen.style.position = 'absolute';
        var node = this._userNode || document.body;
        node.appendChild(this._loadingScreen);
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
        this._preloadMethods.forEach(function(f) {
          context[f] = function() {
            var argsArray = Array.prototype.slice.call(arguments);
            return context._preload(f, argsArray);
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

    this._preload = function (func, args) {
      var context = this._isGlobal ? window : this;
      context._setProperty('_preloadCount', context._preloadCount + 1);
      var preloadCallback = function (resp) {
        context._setProperty('_preloadCount', context._preloadCount - 1);
        if (context._preloadCount === 0) {
          context._setup();
          context._runFrames();
          context._draw();
        }
      };
      args.push(preloadCallback);
      return p5.prototype[func].apply(context, args);
    }.bind(this);

    this._setup = function() {

      // return preload functions to their normal vals if switched by preload
      var context = this._isGlobal ? window : this;
      if (typeof context.preload === 'function') {
        this._preloadMethods.forEach(function (f) {
          context[f] = p5.prototype[f];
        });
      }

      // Short-circuit on this, in case someone used the library in "global"
      // mode earlier
      if (typeof context.setup === 'function') {
        context.setup();
      }

      // unhide hidden canvas that was created
      this.canvas.style.visibility = '';
      this.canvas.className = this.canvas.className.replace('p5_hidden', '');
      this._setupDone = true;

      // Removes the loading screen if it's in the DOM
      this._loadingScreen.parentNode.removeChild(this._loadingScreen);

    }.bind(this);

    this._draw = function () {
      var now = new Date().getTime();
      this._frameRate = 1000.0/(now - this._lastFrameTime);
      this._lastFrameTime = now;
      this._setProperty('frameCount', this.frameCount + 1);
      if (this._loop) {
        if (this._drawInterval) {
          clearInterval(this._drawInterval);
        }
        this._drawInterval = setTimeout(function() {
          window.requestDraw(this._draw.bind(this));
        }.bind(this), 1000 / this._targetFrameRate);
      }
      // call user's draw
      this.redraw();
      this._updatePMouseCoords();
      this._updatePTouchCoords();
    }.bind(this);

    this._runFrames = function() {
      if (this._updateInterval) {
        clearInterval(this._updateInterval);
      }
    }.bind(this);

    this._setProperty = function(prop, value) {
      this[prop] = value;
      if (this._isGlobal) {
        window[prop] = value;
      }
    }.bind(this);

    /**
     * Removes the entire p5 sketch. This will remove the canvas and any
     * elements created by p5.js. It will also stop the draw loop and unbind
     * any properties or methods from the window global scope. It will
     * leave a variable p5 in case you wanted to create a new p5 sketch.
     * If you like, you can set p5 = null to erase it.
     * @method remove
     * @example
     * <div class='norender'><code>
     * function setup() {
     *   createCanvas(200, 200);
     * }
     *
     * function draw() {
     *   ellipse(width/2, height/2, 0, 0);
     * }
     *
     * function mousePressed() {
     *   remove(); // remove whole sketch on mouse press
     * }
     * </code></div>
     */
    this.remove = function() {
      if (this._curElement) {

        // stop draw
        this._loop = false;
        if (this._drawInterval) {
          clearTimeout(this._drawInterval);
        }
        if (this._updateInterval) {
          clearTimeout(this._updateInterval);
        }

        // unregister events sketch-wide
        for (var ev in this._events) {
          window.removeEventListener(ev, this._events[ev]);
        }

        // remove DOM elements created by p5, and listeners
        for (var i=0; i<this._elements.length; i++) {
          var e = this._elements[i];
          if (e.elt.parentNode) {
            e.elt.parentNode.removeChild(e.elt);
          }
          for (var elt_ev in e._events) {
            e.elt.removeEventListener(elt_ev, e._events[elt_ev]);
          }
        }

        // call any registered remove functions
        var self = this;
        this._registeredMethods.remove.forEach(function (f) {
          if (typeof(f) !== 'undefined') {
            f.call(self);
          }
        });

        // remove window bound properties and methods
        if (this._isGlobal) {
          for (var p in p5.prototype) {
            try {
              delete window[p];
            } catch (x) {
              window[p] = undefined;
            }
          }
          for (var p2 in this) {
            if (this.hasOwnProperty(p2)) {
              try {
                delete window[p2];
              } catch (x) {
                window[p2] = undefined;
              }
            }
          }
        }
      }
      // window.p5 = undefined;
    }.bind(this);


    // attach constants to p5 instance
    for (var k in constants) {
      p5.prototype[k] = constants[k];
    }

    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global (i.e. on the window)
    if (!sketch) {
      this._isGlobal = true;
      // Loop through methods on the prototype and attach them to the window
      for (var p in p5.prototype) {
        if(typeof p5.prototype[p] === 'function') {
          var ev = p.substring(2);
          if (!this._events.hasOwnProperty(ev)) {
            window[p] = p5.prototype[p].bind(this);
          }
        } else {
          window[p] = p5.prototype[p];
        }
      }
      // Attach its properties to the window
      for (var p2 in this) {
        if (this.hasOwnProperty(p2)) {
          window[p2] = this[p2];
        }
      }

    } else {
      // Else, the user has passed in a sketch closure that may set
      // user-provided 'setup', 'draw', etc. properties on this instance of p5
      sketch(this);
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

    var self = this;
    window.addEventListener('focus', function() {
      self._setProperty('focused', true);
    });

    window.addEventListener('blur', function() {
      self._setProperty('focused', false);
    });

    // TODO: ???
    
    if (sync) {
      this._start();
    } else {
      if (document.readyState === 'complete') {
        this._start();
      } else {
        window.addEventListener('load', this._start.bind(this), false);
      }
    }
  };


  // functions that cause preload to wait
  // more can be added by using registerPreloadMethod(func)
  p5.prototype._preloadMethods = [
    'loadJSON',
    'loadImage',
    'loadStrings',
    'loadXML',
    'loadShape',
    'loadTable'
  ];

  p5.prototype._registeredMethods = { pre: [], post: [], remove: [] };

  p5.prototype.registerPreloadMethod = function(m) {
    p5.prototype._preloadMethods.push(m);
  }.bind(this);

  p5.prototype.registerMethod = function(name, m) {
    if (!p5.prototype._registeredMethods.hasOwnProperty(name)) {
      p5.prototype._registeredMethods[name] = [];
    }
    p5.prototype._registeredMethods[name].push(m);
  }.bind(this);

  return p5;

});
