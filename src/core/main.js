/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires constants
 */

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
  static VERSION = constants.VERSION;
  // This is a pointer to our global mode p5 instance, if we're in
  // global mode.
  static instance = null;
  static lifecycleHooks = {
    presetup: [],
    postsetup: [],
    predraw: [],
    postdraw: [],
    remove: []
  };

  // FES stub
  static _checkForUserDefinedFunctions = () => {};
  static _friendlyFileLoadError = () => {};

  constructor(sketch, node) {
    //////////////////////////////////////////////
    // PRIVATE p5 PROPERTIES AND METHODS
    //////////////////////////////////////////////

    this.hitCriticalError = false;
    this._setupDone = false;
    this._userNode = node;
    this._curElement = null;
    this._elements = [];
    this._glAttributes = null;
    this._requestAnimId = 0;
    this._isGlobal = false;
    this._loop = true;
    this._startListener = null;
    this._initializeInstanceVariables();
    this._events = {
      // keep track of user-events for unregistering later
      pointerdown: null,
      pointerup: null,
      pointermove: null,
      dragend: null,
      dragover: null,
      click: null,
      dblclick: null,
      mouseover: null,
      mouseout: null,
      keydown: null,
      keyup: null,
      keypress: null,
      wheel: null,
      resize: null,
      blur: null
    };
    this._millisStart = -1;
    this._recording = false;

    // States used in the custom random generators
    this._lcg_random_state = null; // NOTE: move to random.js
    this._gaussian_previous = false; // NOTE: move to random.js

    if (window.DeviceOrientationEvent) {
      this._events.deviceorientation = null;
    }
    if (window.DeviceMotionEvent && !window._isNodeWebkit) {
      this._events.devicemotion = null;
    }

    // ensure correct reporting of window dimensions
    this._updateWindowSize();

    const bindGlobal = (property) => {
      Object.defineProperty(window, property, {
        configurable: true,
        enumerable: true,
        get: () => {
          if(typeof this[property] === 'function'){
            return this[property].bind(this);
          }else{
            return this[property];
          }
        },
        set: (newValue) => {
          Object.defineProperty(window, property, {
            configurable: true,
            enumerable: true,
            value: newValue,
            writable: true
          });
          if (!p5.disableFriendlyErrors) {
            console.log(`You just changed the value of "${property}", which was a p5 global value. This could cause problems later if you're not careful.`);
          }
        }
      })
    };
    // If the user has created a global setup or draw function,
    // assume "global" mode and make everything global (i.e. on the window)
    if (!sketch) {
      this._isGlobal = true;
      if (window.hitCriticalError) {
        return;
      }
      p5.instance = this;

      // Loop through methods on the prototype and attach them to the window
      // All methods and properties with name starting with '_' will be skipped
      for (const p of Object.getOwnPropertyNames(p5.prototype)) {
        if(p[0] === '_') continue;
        bindGlobal(p);
      }

      // Attach its properties to the window
      for (const p in this) {
        if (this.hasOwnProperty(p)) {
          if(p[0] === '_') continue;
          bindGlobal(p);
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
      this.focused = true;
    };
    const blurHandler = () => {
      this.focused = false;
    };
    window.addEventListener('focus', focusHandler);
    window.addEventListener('blur', blurHandler);
    p5.lifecycleHooks.remove.push(function() {
      window.removeEventListener('focus', focusHandler);
      window.removeEventListener('blur', blurHandler);
    });

    // Initialization complete, start runtime
    if (document.readyState === 'complete') {
      this.#_start();
    } else {
      this._startListener = this.#_start.bind(this);
      window.addEventListener('load', this._startListener, false);
    }
  }

  get pixels(){
    return this._renderer.pixels;
  }

  get drawingContext(){
    return this._renderer.drawingContext;
  }

  static registerAddon(addon) {
    const lifecycles = {};
    addon(p5, p5.prototype, lifecycles);

    const validLifecycles = Object.keys(p5.lifecycleHooks);
    for(const name of validLifecycles){
      if(typeof lifecycles[name] === 'function'){
        p5.lifecycleHooks[name].push(lifecycles[name]);
      }
    }
  }

  async #_start() {
    if (this.hitCriticalError) return;
    // Find node if id given
    if (this._userNode) {
      if (typeof this._userNode === 'string') {
        this._userNode = document.getElementById(this._userNode);
      }
    }

    await this.#_setup();
    if (this.hitCriticalError) return;
    if (!this._recording) {
      this._draw();
    }
  }

  async #_setup() {
    // Run `presetup` hooks
    await this._runLifecycleHook('presetup');
    if (this.hitCriticalError) return;

    // Always create a default canvas.
    // Later on if the user calls createCanvas, this default one
    // will be replaced
    this.createCanvas(
      100,
      100,
      constants.P2D
    );

    // Record the time when sketch starts
    this._millisStart = window.performance.now();

    const context = this._isGlobal ? window : this;
    if (typeof context.setup === 'function') {
      await context.setup();
    }
    if (this.hitCriticalError) return;

    // unhide any hidden canvases that were created
    const canvases = document.getElementsByTagName('canvas');

    // Apply touchAction = 'none' to canvases if pointer events exist
    if (Object.keys(this._events).some(event => event.startsWith('pointer'))) {
      for (const k of canvases) {
        k.style.touchAction = 'none';
      }
    }


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

    // Run `postsetup` hooks
    await this._runLifecycleHook('postsetup');
  }

  // While '#_draw' here is async, it is not awaited as 'requestAnimationFrame'
  // does not await its callback. Thus it is not recommended for 'draw()` to be
  // async and use await within as the next frame may start rendering before the
  // current frame finish awaiting. The same goes for lifecycle hooks 'predraw'
  // and 'postdraw'.
  async _draw(requestAnimationFrameTimestamp) {
    if (this.hitCriticalError) return;
    const now = requestAnimationFrameTimestamp || window.performance.now();
    const timeSinceLastFrame = now - this._lastTargetFrameTime;
    const targetTimeBetweenFrames = 1000 / this._targetFrameRate;

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
      timeSinceLastFrame >= targetTimeBetweenFrames - epsilon
    ) {
      //mandatory update values(matrixes and stack)
      this.deltaTime = now - this._lastRealFrameTime;
      this._frameRate = 1000.0 / this.deltaTime;
      await this.redraw();
      this._lastTargetFrameTime = Math.max(this._lastTargetFrameTime
        + targetTimeBetweenFrames, now);
      this._lastRealFrameTime = now;

      // If the user is actually using mouse module, then update
      // coordinates, otherwise skip. We can test this by simply
      // checking if any of the mouse functions are available or not.
      // NOTE : This reflects only in complete build or modular build.
      if (typeof this._updateMouseCoords !== 'undefined') {
        this._updateMouseCoords();

        //reset delta values so they reset even if there is no mouse event to set them
        // for example if the mouse is outside the screen
        this.movedX = 0;
        this.movedY = 0;
      }
    }

    // get notified the next time the browser gives us
    // an opportunity to draw.
    if (this._loop) {
      this._requestAnimId = window.requestAnimationFrame(
        this._draw.bind(this)
      );
    }
  }

  /**
   * Removes the sketch from the web page.
   *
   * Calling `remove()` stops the draw loop and removes any HTML elements
   * created by the sketch, including the canvas. A new sketch can be
   * created by using the <a href="#/p5/p5">p5()</a> constructor, as in
   * `new p5()`.
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
  async remove() {
    // Remove start listener to prevent orphan canvas being created
    if(this._startListener){
      window.removeEventListener('load', this._startListener, false);
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

      // Run `remove` hooks
      await this._runLifecycleHook('remove');
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
  }

  async _runLifecycleHook(hookName) {
    for(const hook of p5.lifecycleHooks[hookName]){
      await hook.call(this);
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
    this._downKeys = {}; //Holds the key codes of currently pressed keys
    this._downKeyCodes = {};
  }
}

// Attach constants to p5 prototype
for (const k in constants) {
  p5.prototype[k] = constants[k];
}

//////////////////////////////////////////////
// PUBLIC p5 PROPERTIES AND METHODS
//////////////////////////////////////////////

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
 * @for p5
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
 * async function setup() {
 *   img = await loadImage('assets/bricks.jpg');
 *
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
 * @for p5
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

import transform from './transform';
import structure from './structure';
import environment from './environment';
import rendering from './rendering';
import renderer from './p5.Renderer';
import renderer2D from './p5.Renderer2D';
import graphics from './p5.Graphics';

p5.registerAddon(transform);
p5.registerAddon(structure);
p5.registerAddon(environment);
p5.registerAddon(rendering);
p5.registerAddon(renderer);
p5.registerAddon(renderer2D);
p5.registerAddon(graphics);

export default p5;
