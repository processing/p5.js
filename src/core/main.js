/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires constants
 */

// Core needs the PVariables object
import * as constants from './constants';
/**
 * This is the p5 instance constructor.
 *
 * A p5 instance holds all the properties and methods related to
 * a p5 sketch.  It expects an incoming sketch closure and it can also
 * take an optional node parameter for attaching the generated p5 canvas
 * to a node.  The sketch closure takes the newly created p5 instance as
 * its sole argument and may optionally set <a href="#/p5/preload">preload()</a>,
 * <a href="#/p5/setup">setup()</a>, and/or
 * <a href="#/p5/draw">draw()</a> properties on it for running a sketch.
 *
 * A p5 sketch can run in "global" or "instance" mode:
 * "global"   - all properties and methods are attached to the window
 * "instance" - all properties and methods are bound to this p5 object
 *
 * @class p5
 * @param  {function(p5)}       sketch a closure that can set optional <a href="#/p5/preload">preload()</a>,
 *                              <a href="#/p5/setup">setup()</a>, and/or <a href="#/p5/draw">draw()</a> properties on the
 *                              given p5 instance
 * @param  {HTMLElement}        [node] element to attach canvas to
 * @return {p5}                 a p5 instance
 */
class p5 {
  constructor(sketch, node) {
    //////////////////////////////////////////////
    // PRIVATE p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    this._setupDone = false;
    this._preloadDone = false;
    // for handling hidpi
    this._pixelDensity = Math.ceil(window.devicePixelRatio) || 1;
    this._userNode = node;
    this._curElement = null;
    this._elements = [];
    this._glAttributes = null;
    this._requestAnimId = 0;
    this._preloadCount = 0;
    this._isGlobal = false;
    this._loop = true;
    this._startListener = null;
    this._initializeInstanceVariables();
    this._defaultCanvasSize = {
      width: 100,
      height: 100
    };
    this._events = {
      // keep track of user-events for unregistering later
      mousemove: null,
      mousedown: null,
      mouseup: null,
      dragend: null,
      dragover: null,
      click: null,
      dblclick: null,
      mouseover: null,
      mouseout: null,
      keydown: null,
      keyup: null,
      keypress: null,
      touchstart: null,
      touchmove: null,
      touchend: null,
      resize: null,
      blur: null
    };
    this._millisStart = -1;
    this._recording = false;

    // States used in the custom random generators
    this._lcg_random_state = null;
    this._gaussian_previous = false;

    this._events.wheel = null;
    this._loadingScreenId = 'p5_loading';

    // Allows methods to be registered on an instance that
    // are instance-specific.
    this._registeredMethods = {};
    const methods = Object.getOwnPropertyNames(p5.prototype._registeredMethods);

    for (const prop of methods) {
      this._registeredMethods[prop] = p5.prototype._registeredMethods[
        prop
      ].slice();
    }

    if (window.DeviceOrientationEvent) {
      this._events.deviceorientation = null;
    }
    if (window.DeviceMotionEvent && !window._isNodeWebkit) {
      this._events.devicemotion = null;
    }

    // Function to invoke registered hooks before or after events such as preload, setup, and pre/post draw.
    p5.prototype.callRegisteredHooksFor = function (hookName) {
      const target = this || p5.prototype;
      const context = this._isGlobal ? window : this;
      if (target._registeredMethods.hasOwnProperty(hookName)) {
        const methods = target._registeredMethods[hookName];
        for (const method of methods) {
          if (typeof method === 'function') {
            method.call(context);
          }
        }
      }
    };

    this._start = async () => {
      // Find node if id given
      if (this._userNode) {
        if (typeof this._userNode === 'string') {
          this._userNode = document.getElementById(this._userNode);
        }
      }

      const context = this._isGlobal ? window : this;
      if (context.preload) {
        this.callRegisteredHooksFor('beforePreload');
        // Setup loading screen
        // Set loading screen into dom if not present
        // Otherwise displays and removes user provided loading screen
        let loadingScreen = document.getElementById(this._loadingScreenId);
        if (!loadingScreen) {
          loadingScreen = document.createElement('div');
          loadingScreen.innerHTML = 'Loading...';
          loadingScreen.style.position = 'absolute';
          loadingScreen.id = this._loadingScreenId;
          const node = this._userNode || document.body;
          node.appendChild(loadingScreen);
        }
        const methods = this._preloadMethods;
        for (const method in methods) {
          // default to p5 if no object defined
          methods[method] = methods[method] || p5;
          let obj = methods[method];
          //it's p5, check if it's global or instance
          if (obj === p5.prototype || obj === p5) {
            if (this._isGlobal) {
              window[method] = this._wrapPreload(this, method);
            }
            obj = this;
          }
          this._registeredPreloadMethods[method] = obj[method];
          obj[method] = this._wrapPreload(obj, method);
        }

        context.preload();
        this._runIfPreloadsAreDone();
      } else {
        await this._setup();
        if (!this._recording) {
          this._draw();
        }
      }
    };

    /** @type {() => void} */
    this._runIfPreloadsAreDone = function() {
      const context = this._isGlobal ? window : this;
      if (context._preloadCount === 0) {
        const loadingScreen = document.getElementById(context._loadingScreenId);
        if (loadingScreen) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
        this.callRegisteredHooksFor('afterPreload');
        if (!this._setupDone) {
          this._lastTargetFrameTime = window.performance.now();
          this._lastRealFrameTime = window.performance.now();
          context._setup();
          if (!this._recording) {
            context._draw();
          }
        }
      }
    };

    this._decrementPreload = function() {
      const context = this._isGlobal ? window : this;
      if (!context._preloadDone && typeof context.preload === 'function') {
        context._setProperty('_preloadCount', context._preloadCount - 1);
        context._runIfPreloadsAreDone();
      }
    };

    this._wrapPreload = function(obj, fnName) {
      return (...args) => {
        //increment counter
        this._incrementPreload();
        //call original function
        return this._registeredPreloadMethods[fnName].apply(obj, args);
      };
    };

    this._incrementPreload = function() {
      const context = this._isGlobal ? window : this;
      // Do nothing if we tried to increment preloads outside of `preload`
      if (context._preloadDone) return;
      context._setProperty('_preloadCount', context._preloadCount + 1);
    };

    this._setup = async () => {
      this.callRegisteredHooksFor('beforeSetup');
      // Always create a default canvas.
      // Later on if the user calls createCanvas, this default one
      // will be replaced
      this.createCanvas(
        this._defaultCanvasSize.width,
        this._defaultCanvasSize.height,
        constants.P2D
      );

      // return preload functions to their normal vals if switched by preload
      const context = this._isGlobal ? window : this;
      if (typeof context.preload === 'function') {
        for (const f in this._preloadMethods) {
          context[f] = this._preloadMethods[f][f];
          if (context[f] && this) {
            context[f] = context[f].bind(this);
          }
        }
      }

      // Record the time when sketch starts
      this._millisStart = window.performance.now();

      context._preloadDone = true;

      // Short-circuit on this, in case someone used the library in "global"
      // mode earlier
      if (typeof context.setup === 'function') {
        await context.setup();
      }

      // unhide any hidden canvases that were created
      const canvases = document.getElementsByTagName('canvas');

      for (const k of canvases) {
        if (k.dataset.hidden === 'true') {
          k.style.visibility = '';
          delete k.dataset.hidden;
        }
      }

      this._lastTargetFrameTime = window.performance.now();
      this._lastRealFrameTime = window.performance.now();
      this._setupDone = true;
      if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
        this._updateAccsOutput();
      }
      this.callRegisteredHooksFor('afterSetup');
    };

    this._draw = () => {
      const now = window.performance.now();
      const time_since_last = now - this._lastTargetFrameTime;
      const target_time_between_frames = 1000 / this._targetFrameRate;

      // only draw if we really need to; don't overextend the browser.
      // draw if we're within 5ms of when our next frame should paint
      // (this will prevent us from giving up opportunities to draw
      // again when it's really about time for us to do so). fixes an
      // issue where the frameRate is too low if our refresh loop isn't
      // in sync with the browser. note that we have to draw once even
      // if looping is off, so we bypass the time delay if that
      // is the case.
      const epsilon = 5;
      if (
        !this._loop ||
        time_since_last >= target_time_between_frames - epsilon
      ) {
        //mandatory update values(matrixes and stack)
        this.deltaTime = now - this._lastRealFrameTime;
        this._setProperty('deltaTime', this.deltaTime);
        this._frameRate = 1000.0 / this.deltaTime;
        this.redraw();
        this._lastTargetFrameTime = Math.max(this._lastTargetFrameTime
          + target_time_between_frames, now);
        this._lastRealFrameTime = now;

        // If the user is actually using mouse module, then update
        // coordinates, otherwise skip. We can test this by simply
        // checking if any of the mouse functions are available or not.
        // NOTE : This reflects only in complete build or modular build.
        if (typeof this._updateMouseCoords !== 'undefined') {
          this._updateMouseCoords();

          //reset delta values so they reset even if there is no mouse event to set them
          // for example if the mouse is outside the screen
          this._setProperty('movedX', 0);
          this._setProperty('movedY', 0);
        }
      }

      // get notified the next time the browser gives us
      // an opportunity to draw.
      if (this._loop) {
        this._requestAnimId = window.requestAnimationFrame(this._draw);
      }
    };

    this._setProperty = (prop, value) => {
      this[prop] = value;
      if (this._isGlobal) {
        window[prop] = value;
      }
    };

    /**
     * Removes the entire p5 sketch. This will remove the canvas and any
     * elements created by p5.js. It will also stop the draw loop and unbind
     * any properties or methods from the window global scope. It will
     * leave a variable p5 in case you wanted to create a new p5 sketch.
     * If you like, you can set p5 = null to erase it. While all functions and
     * variables and objects created by the p5 library will be removed, any
     * other global variables created by your code will remain.
     *
     * @example
     * <div class='norender'><code>
     * function draw() {
     *   ellipse(50, 50, 10, 10);
     * }
     *
     * function mousePressed() {
     *   remove(); // remove whole sketch on mouse press
     * }
     * </code></div>
     *
     * @alt
     * nothing displayed
     *
     */
    this.remove = () => {
      // Remove start listener to prevent orphan canvas being created
      if(this._startListener){
        window.removeEventListener('load', this._startListener, false);
      }
      const loadingScreen = document.getElementById(this._loadingScreenId);
      if (loadingScreen) {
        loadingScreen.parentNode.removeChild(loadingScreen);
        // Add 1 to preload counter to prevent the sketch ever executing setup()
        this._incrementPreload();
      }
      if (this._curElement) {
        // stop draw
        this._loop = false;
        if (this._requestAnimId) {
          window.cancelAnimationFrame(this._requestAnimId);
        }

        // unregister events sketch-wide
        for (const ev in this._events) {
          window.removeEventListener(ev, this._events[ev]);
        }

        // remove DOM elements created by p5, and listeners
        for (const e of this._elements) {
          if (e.elt && e.elt.parentNode) {
            e.elt.parentNode.removeChild(e.elt);
          }
          for (const elt_ev in e._events) {
            e.elt.removeEventListener(elt_ev, e._events[elt_ev]);
          }
        }

        // call any registered remove functions
        const self = this;
        this._registeredMethods.remove.forEach(f => {
          if (typeof f !== 'undefined') {
            f.call(self);
          }
        });
      }
      // remove window bound properties and methods
      if (this._isGlobal) {
        for (const p in p5.prototype) {
          try {
            delete window[p];
          } catch (x) {
            window[p] = undefined;
          }
        }
        for (const p2 in this) {
          if (this.hasOwnProperty(p2)) {
            try {
              delete window[p2];
            } catch (x) {
              window[p2] = undefined;
            }
          }
        }
        p5.instance = null;
      }
    };

    // call any registered init functions
    this._registeredMethods.init.forEach(function(f) {
      if (typeof f !== 'undefined') {
        f.call(this);
      }
    }, this);
    // Set up promise preloads
    this._setupPromisePreloads();

    const friendlyBindGlobal = this._createFriendlyGlobalFunctionBinder();

    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global (i.e. on the window)
    if (!sketch) {
      this._isGlobal = true;
      p5.instance = this;
      // Loop through methods on the prototype and attach them to the window
      for (const p in p5.prototype) {
        if (typeof p5.prototype[p] === 'function') {
          const ev = p.substring(2);
          if (!this._events.hasOwnProperty(ev)) {
            if (Math.hasOwnProperty(p) && Math[p] === p5.prototype[p]) {
              // Multiple p5 methods are just native Math functions. These can be
              // called without any binding.
              friendlyBindGlobal(p, p5.prototype[p]);
            } else {
              friendlyBindGlobal(p, p5.prototype[p].bind(this));
            }
          }
        } else {
          friendlyBindGlobal(p, p5.prototype[p]);
        }
      }
      // Attach its properties to the window
      for (const p2 in this) {
        if (this.hasOwnProperty(p2)) {
          friendlyBindGlobal(p2, this[p2]);
        }
      }
    } else {
      // Else, the user has passed in a sketch closure that may set
      // user-provided 'setup', 'draw', etc. properties on this instance of p5
      sketch(this);

      // Run a check to see if the user has misspelled 'setup', 'draw', etc
      // detects capitalization mistakes only ( Setup, SETUP, MouseClicked, etc)
      p5._checkForUserDefinedFunctions(this);
    }

    // Bind events to window (not using container div bc key events don't work)

    for (const e in this._events) {
      const f = this[`_on${e}`];
      if (f) {
        const m = f.bind(this);
        window.addEventListener(e, m, { passive: false });
        this._events[e] = m;
      }
    }

    const focusHandler = () => {
      this._setProperty('focused', true);
    };
    const blurHandler = () => {
      this._setProperty('focused', false);
    };
    window.addEventListener('focus', focusHandler);
    window.addEventListener('blur', blurHandler);
    this.registerMethod('remove', () => {
      window.removeEventListener('focus', focusHandler);
      window.removeEventListener('blur', blurHandler);
    });

    if (document.readyState === 'complete') {
      this._start();
    } else {
      this._startListener = this._start.bind(this);
      window.addEventListener('load', this._startListener, false);
    }
  }

  static registerAddon(addon) {
    const lifecycles = {};
    addon(p5, p5.prototype, lifecycles);

    // Handle lifecycle hooks
  }

  _initializeInstanceVariables() {
    this._accessibleOutputs = {
      text: false,
      grid: false,
      textLabel: false,
      gridLabel: false
    };

    this._styles = [];

    this._bezierDetail = 20;
    this._curveDetail = 20;

    this._colorMode = constants.RGB;
    this._colorMaxes = {
      rgb: [255, 255, 255, 255],
      hsb: [360, 100, 100, 1],
      hsl: [360, 100, 100, 1]
    };

    this._downKeys = {}; //Holds the key codes of currently pressed keys
  }

  registerPreloadMethod(fnString, obj) {
    // obj = obj || p5.prototype;
    if (!p5.prototype._preloadMethods.hasOwnProperty(fnString)) {
      p5.prototype._preloadMethods[fnString] = obj;
    }
  }

  registerMethod(name, m) {
    const target = this || p5.prototype;
    if (!target._registeredMethods.hasOwnProperty(name)) {
      target._registeredMethods[name] = [];
    }
    target._registeredMethods[name].push(m);
  }

  unregisterMethod(name, m) {
    const target = this || p5.prototype;
    if (target._registeredMethods.hasOwnProperty(name)) {
      const methods = target._registeredMethods[name];
      const indexesToRemove = [];
      // Find all indexes of the method `m` in the array of registered methods
      for (let i = 0; i < methods.length; i++) {
        if (methods[i] === m) {
          indexesToRemove.push(i);
        }
      }
      // Remove all instances of the method `m` from the array
      for (let i = indexesToRemove.length - 1; i >= 0; i--) {
        methods.splice(indexesToRemove[i], 1);
      }
    }
  }

  // create a function which provides a standardized process for binding
  // globals; this is implemented as a factory primarily so that there's a
  // way to redefine what "global" means for the binding function so it
  // can be used in scenarios like unit testing where the window object
  // might not exist
  _createFriendlyGlobalFunctionBinder(options = {}) {
    const globalObject = options.globalObject || window;
    const log = options.log || console.log.bind(console);
    const propsToForciblyOverwrite = {
      // p5.print actually always overwrites an existing global function,
      // albeit one that is very unlikely to be used:
      //
      //   https://developer.mozilla.org/en-US/docs/Web/API/Window/print
      print: true
    };

    return (prop, value) => {
      if (
        !p5.disableFriendlyErrors &&
        typeof IS_MINIFIED === 'undefined' &&
        typeof value === 'function' &&
        !(prop in p5.prototype._preloadMethods)
      ) {
        try {
          // Because p5 has so many common function names, it's likely
          // that users may accidentally overwrite global p5 functions with
          // their own variables. Let's allow this but log a warning to
          // help users who may be doing this unintentionally.
          //
          // For more information, see:
          //
          //   https://github.com/processing/p5.js/issues/1317

          if (prop in globalObject && !(prop in propsToForciblyOverwrite)) {
            throw new Error(`global "${prop}" already exists`);
          }

          // It's possible that this might throw an error because there
          // are a lot of edge-cases in which `Object.defineProperty` might
          // not succeed; since this functionality is only intended to
          // help beginners anyways, we'll just catch such an exception
          // if it occurs, and fall back to legacy behavior.
          Object.defineProperty(globalObject, prop, {
            configurable: true,
            enumerable: true,
            get() {
              return value;
            },
            set(newValue) {
              Object.defineProperty(globalObject, prop, {
                configurable: true,
                enumerable: true,
                value: newValue,
                writable: true
              });
              log(
                `You just changed the value of "${prop}", which was a p5 function. This could cause problems later if you're not careful.`
              );
            }
          });
        } catch (e) {
          let message = `p5 had problems creating the global function "${prop}", possibly because your code is already using that name as a variable. You may want to rename your variable to something else.`;
          p5._friendlyError(message, prop);
          globalObject[prop] = value;
        }
      } else {
        globalObject[prop] = value;
      }
    };
  }
}

//////////////////////////////////////////////
// PUBLIC p5 PROPERTIES AND METHODS
//////////////////////////////////////////////

/**
 * Called directly before <a href="#/p5/setup">setup()</a>, the <a href="#/p5/preload">preload()</a> function is used to handle
 * asynchronous loading of external files in a blocking way. If a preload
 * function is defined, <a href="#/p5/setup">setup()</a> will wait until any load calls within have
 * finished. Nothing besides load calls (<a href="#/p5/loadImage">loadImage</a>, <a href="#/p5/loadJSON">loadJSON</a>, <a href="#/p5/loadFont">loadFont</a>,
 * <a href="#/p5/loadStrings">loadStrings</a>, etc.) should be inside the preload function. If asynchronous
 * loading is preferred, the load methods can instead be called in <a href="#/p5/setup">setup()</a>
 * or anywhere else with the use of a callback parameter.
 *
 * By default the text "loading..." will be displayed. To make your own
 * loading page, include an HTML element with id "p5_loading" in your
 * page. More information <a href="http://bit.ly/2kQ6Nio">here</a>.
 *
 * @method preload
 * @for p5
 * @example
 * <div><code>
 * let img;
 * let c;
 * function preload() {
 *   // preload() runs once
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   // setup() waits until preload() is done
 *   img.loadPixels();
 *   // get color of middle pixel
 *   c = img.get(img.width / 2, img.height / 2);
 * }
 *
 * function draw() {
 *   background(c);
 *   image(img, 25, 25, 50, 50);
 * }
 * </code></div>
 *
 * @alt
 * nothing displayed
 *
 */

/**
 * The <a href="#/p5/setup">setup()</a> function is called once when the program starts. It's used to
 * define initial environment properties such as screen size and background
 * color and to load media such as images and fonts as the program starts.
 * There can only be one <a href="#/p5/setup">setup()</a> function for each program and it shouldn't
 * be called again after its initial execution.
 *
 * Note: Variables declared within <a href="#/p5/setup">setup()</a> are not accessible within other
 * functions, including <a href="#/p5/draw">draw()</a>.
 *
 * @method setup
 * @for p5
 * @example
 * <div><code>
 * let a = 0;
 *
 * function setup() {
 *   background(0);
 *   noStroke();
 *   fill(102);
 * }
 *
 * function draw() {
 *   rect(a++ % width, 10, 2, 80);
 * }
 * </code></div>
 *
 * @alt
 * nothing displayed
 *
 */

/**
 * Called directly after <a href="#/p5/setup">setup()</a>, the <a href="#/p5/draw">draw()</a> function continuously executes
 * the lines of code contained inside its block until the program is stopped
 * or <a href="#/p5/noLoop">noLoop()</a> is called. Note if <a href="#/p5/noLoop">noLoop()</a> is called in <a href="#/p5/setup">setup()</a>, <a href="#/p5/draw">draw()</a> will
 * still be executed once before stopping. <a href="#/p5/draw">draw()</a> is called automatically and
 * should never be called explicitly.
 *
 * It should always be controlled with <a href="#/p5/noLoop">noLoop()</a>, <a href="#/p5/redraw">redraw()</a> and <a href="#/p5/loop">loop()</a>. After
 * <a href="#/p5/noLoop">noLoop()</a> stops the code in <a href="#/p5/draw">draw()</a> from executing, <a href="#/p5/redraw">redraw()</a> causes the
 * code inside <a href="#/p5/draw">draw()</a> to execute once, and <a href="#/p5/loop">loop()</a> will cause the code
 * inside <a href="#/p5/draw">draw()</a> to resume executing continuously.
 *
 * The number of times <a href="#/p5/draw">draw()</a> executes in each second may be controlled with
 * the <a href="#/p5/frameRate">frameRate()</a> function.
 *
 * There can only be one <a href="#/p5/draw">draw()</a> function for each sketch, and <a href="#/p5/draw">draw()</a> must
 * exist if you want the code to run continuously, or to process events such
 * as <a href="#/p5/mousePressed">mousePressed()</a>. Sometimes, you might have an empty call to <a href="#/p5/draw">draw()</a> in
 * your program, as shown in the above example.
 *
 * It is important to note that the drawing coordinate system will be reset
 * at the beginning of each <a href="#/p5/draw">draw()</a> call. If any transformations are performed
 * within <a href="#/p5/draw">draw()</a> (ex: scale, rotate, translate), their effects will be
 * undone at the beginning of <a href="#/p5/draw">draw()</a>, so transformations will not accumulate
 * over time. On the other hand, styling applied (ex: fill, stroke, etc) will
 * remain in effect.
 *
 * @for p5
 * @method draw
 * @example
 * <div><code>
 * let yPos = 0;
 * function setup() {
 *   // setup() runs once
 *   frameRate(30);
 * }
 * function draw() {
 *   // draw() loops forever, until stopped
 *   background(204);
 *   yPos = yPos - 1;
 *   if (yPos < 0) {
 *     yPos = height;
 *   }
 *   line(0, yPos, width, yPos);
 * }
 * </code></div>
 *
 * @alt
 * nothing displayed
 *
 */

// This is a pointer to our global mode p5 instance, if we're in
// global mode.
p5.instance = null;

/**
 * Turn off some features of the friendly error system (FES), which can give
 * a significant boost to performance when needed.
 *
 * Note that this will disable the parts of the FES that cause performance
 * slowdown (like argument checking). Friendly errors that have no performance
 * cost (like giving a descriptive error if a file load fails, or warning you
 * if you try to override p5.js functions in the global space),
 * will remain in place.
 *
 * See <a href='https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes'>
 * disabling the friendly error system</a>.
 *
 * @property {Boolean} disableFriendlyErrors
 * @example
 * <div class="norender notest"><code>
 * p5.disableFriendlyErrors = true;
 *
 * function setup() {
 *   createCanvas(100, 50);
 * }
 * </code></div>
 */
p5.disableFriendlyErrors = false;

// attach constants to p5 prototype
for (const k in constants) {
  p5.prototype[k] = constants[k];
}

// makes the `VERSION` constant available on the p5 object
// in instance mode, even if it hasn't been instantiated yet
p5.VERSION = constants.VERSION;

// functions that cause preload to wait
// more can be added by using registerPreloadMethod(func)
p5.prototype._preloadMethods = {
  loadJSON: p5.prototype,
  loadImage: p5.prototype,
  loadStrings: p5.prototype,
  loadXML: p5.prototype,
  loadBytes: p5.prototype,
  loadTable: p5.prototype,
  loadFont: p5.prototype,
  loadModel: p5.prototype,
  loadShader: p5.prototype
};

p5.prototype._registeredMethods = { init: [], pre: [], post: [], remove: [] };

p5.prototype._registeredPreloadMethods = {};

export default p5;
