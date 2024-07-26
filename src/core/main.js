/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires constants
 */

import './shim';

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
 * @constructor
 * @param  {function(p5)}       sketch a closure that can set optional <a href="#/p5/preload">preload()</a>,
 *                              <a href="#/p5/setup">setup()</a>, and/or <a href="#/p5/draw">draw()</a> properties on the
 *                              given p5 instance
 * @param  {HTMLElement}        [node] element to attach canvas to
 * @return {p5}                 a p5 instance
 */
class p5 {
  constructor(sketch, node) {
    //////////////////////////////////////////////
    // PUBLIC p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    /**
     * A function that's called once to load assets before the sketch runs.
     *
     * Declaring the function `preload()` sets a code block to run once
     * automatically before <a href="#/p5/setup">setup()</a> or
     * <a href="#/p5/draw">draw()</a>. It's used to load assets including
     * multimedia files, fonts, data, and 3D models:
     *
     * ```js
     * function preload() {
     *   // Code to run before the rest of the sketch.
     * }
     * ```
     *
     * Functions such as <a href="#/p5/loadImage">loadImage()</a>,
     * <a href="#/p5/loadFont">loadFont()</a>,
     * <a href="#/p5/loadJSON">loadJSON()</a>, and
     * <a href="#/p5/loadModel">loadModel()</a> are guaranteed to either
     * finish loading or raise an error if they're called within `preload()`.
     * Doing so ensures that assets are available when the sketch begins
     * running.
     *
     * @method preload
     *
     * @example
     * <div>
     * <code>
     * let img;
     *
     * // Load an image and create a p5.Image object.
     * function preload() {
     *   img = loadImage('assets/bricks.jpg');
     * }
     *
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   // Draw the image.
     *   image(img, 0, 0);
     *
     *   describe('A red brick wall.');
     * }
     * </code>
     * </div>
     */

    /**
     * A function that's called once when the sketch begins running.
     *
     * Declaring the function `setup()` sets a code block to run once
     * automatically when the sketch starts running. It's used to perform
     * setup tasks such as creating the canvas and initializing variables:
     *
     * ```js
     * function setup() {
     *   // Code to run once at the start of the sketch.
     * }
     * ```
     *
     * Code placed in `setup()` will run once before code placed in
     * <a href="#/p5/draw">draw()</a> begins looping. If the
     * <a href="#/p5/preload">preload()</a> is declared, then `setup()` will
     * run immediately after <a href="#/p5/preload">preload()</a> finishes
     * loading assets.
     *
     * Note: `setup()` doesn’t have to be declared, but it’s common practice to do so.
     *
     * @method setup
     *
     * @example
     * <div>
     * <code>
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   background(200);
     *
     *   // Draw the circle.
     *   circle(50, 50, 40);
     *
     *   describe('A white circle on a gray background.');
     * }
     * </code>
     * </div>
     *
     * <div>
     * <code>
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   // Paint the background once.
     *   background(200);
     *
     *   describe(
     *     'A white circle on a gray background. The circle follows the mouse as the user moves, leaving a trail.'
     *   );
     * }
     *
     * function draw() {
     *   // Draw circles repeatedly.
     *   circle(mouseX, mouseY, 40);
     * }
     * </code>
     * </div>
     *
     * <div>
     * <code>
     * let img;
     *
     * function preload() {
     *   img = loadImage('assets/bricks.jpg');
     * }
     *
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   // Draw the image.
     *   image(img, 0, 0);
     *
     *   describe(
     *     'A white circle on a brick wall. The circle follows the mouse as the user moves, leaving a trail.'
     *   );
     * }
     *
     * function draw() {
     *   // Style the circle.
     *   noStroke();
     *
     *   // Draw the circle.
     *   circle(mouseX, mouseY, 10);
     * }
     * </code>
     * </div>
     */

    /**
     * A function that's called repeatedly while the sketch runs.
     *
     * Declaring the function `draw()` sets a code block to run repeatedly
     * once the sketch starts. It’s used to create animations and respond to
     * user inputs:
     *
     * ```js
     * function draw() {
     *   // Code to run repeatedly.
     * }
     * ```
     *
     * This is often called the "draw loop" because p5.js calls the code in
     * `draw()` in a loop behind the scenes. By default, `draw()` tries to run
     * 60 times per second. The actual rate depends on many factors. The
     * drawing rate, called the "frame rate", can be controlled by calling
     * <a href="#/p5/frameRate">frameRate()</a>. The number of times `draw()`
     * has run is stored in the system variable
     * <a href="#/p5/frameCount">frameCount()</a>.
     *
     * Code placed within `draw()` begins looping after
     * <a href="#/p5/setup">setup()</a> runs. `draw()` will run until the user
     * closes the sketch. `draw()` can be stopped by calling the
     * <a href="#/p5/noLoop">noLoop()</a> function. `draw()` can be resumed by
     * calling the <a href="#/p5/loop">loop()</a> function.
     *
     * @method draw
     *
     * @example
     * <div>
     * <code>
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   // Paint the background once.
     *   background(200);
     *
     *   describe(
     *     'A white circle on a gray background. The circle follows the mouse as the user moves, leaving a trail.'
     *   );
     * }
     *
     * function draw() {
     *   // Draw circles repeatedly.
     *   circle(mouseX, mouseY, 40);
     * }
     * </code>
     * </div>
     *
     * <div>
     * <code>
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   describe(
     *     'A white circle on a gray background. The circle follows the mouse as the user moves.'
     *   );
     * }
     *
     * function draw() {
     *   // Paint the background repeatedly.
     *   background(200);
     *
     *   // Draw circles repeatedly.
     *   circle(mouseX, mouseY, 40);
     * }
     * </code>
     * </div>
     *
     * <div>
     * <code>
     * // Double-click the canvas to change the circle's color.
     *
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   describe(
     *     'A white circle on a gray background. The circle follows the mouse as the user moves. The circle changes color to pink when the user double-clicks.'
     *   );
     * }
     *
     * function draw() {
     *   // Paint the background repeatedly.
     *   background(200);
     *
     *   // Draw circles repeatedly.
     *   circle(mouseX, mouseY, 40);
     * }
     *
     * // Change the fill color when the user double-clicks.
     * function doubleClicked() {
     *   fill('deeppink');
     * }
     * </code>
     * </div>
     */

    //////////////////////////////////////////////
    // PRIVATE p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    this._setupDone = false;
    this._preloadDone = false;
    // for handling hidpi
    this._pixelDensity = Math.ceil(window.devicePixelRatio) || 1;
    this._maxAllowedPixelDimensions = 0;
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
    this.touchstart = false;
    this.touchend = false;

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

    this._start = () => {
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
        this._setup();
        if (!this._recording) {
          this._draw();
        }
      }
    };

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

    this._setup = () => {
      this.callRegisteredHooksFor('beforeSetup');
      // Always create a default canvas.
      // Later on if the user calls createCanvas, this default one
      // will be replaced
      this.createCanvas(
        this._defaultCanvasSize.width,
        this._defaultCanvasSize.height,
        'p2d'
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
        context.setup();
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

    this._draw = requestAnimationFrameTimestamp => {
      const now = requestAnimationFrameTimestamp || window.performance.now();
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
     * Removes the sketch from the web page.
     *
     * Calling `remove()` stops the draw loop and removes any HTML elements
     * created by the sketch, including the canvas. A new sketch can be
     * created by using the <a href="#/p5/p5">p5()</a> constructor, as in
     * `new p5()`.
     *
     * @method remove
     *
     * @example
     * <div>
     * <code>
     * // Double-click to remove the canvas.
     *
     * function setup() {
     *   createCanvas(100, 100);
     *
     *   describe(
     *     'A white circle on a gray background. The circle follows the mouse as the user moves. The sketch disappears when the user double-clicks.'
     *   );
     * }
     *
     * function draw() {
     *   // Paint the background repeatedly.
     *   background(200);
     *
     *   // Draw circles repeatedly.
     *   circle(mouseX, mouseY, 40);
     * }
     *
     * // Remove the sketch when the user double-clicks.
     * function doubleClicked() {
     *   remove();
     * }
     * </code>
     * </div>
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

    // ensure correct reporting of window dimensions
    this._updateWindowSize();

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

// This is a pointer to our global mode p5 instance, if we're in
// global mode.
p5.instance = null;

/**
 * Turns off the parts of the Friendly Error System (FES) that impact performance.
 *
 * The <a href="https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md" target="_blank">FES</a>
 * can cause sketches to draw slowly because it does extra work behind the
 * scenes. For example, the FES checks the arguments passed to functions,
 * which takes time to process. Disabling the FES can significantly improve
 * performance by turning off these checks.
 *
 * @property {Boolean} disableFriendlyErrors
 *
 * @example
 * <div>
 * <code>
 * // Disable the FES.
 * p5.disableFriendlyErrors = true;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // The circle() function requires three arguments. The
 *   // next line would normally display a friendly error that
 *   // points this out. Instead, nothing happens and it fails
 *   // silently.
 *   circle(50, 50);
 *
 *   describe('A gray square.');
 * }
 * </code>
 * </div>
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
