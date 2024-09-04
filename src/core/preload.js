import p5 from './main';

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
 * @for p5
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

p5.prototype._registeredPreloadMethods = {};

p5.prototype._promisePreloads = [
  /* Example object
  {
    target: p5.prototype, // The target object to have the method modified
    method: 'loadXAsync', // The name of the preload function to wrap
    addCallbacks: true,   // Whether to automatically handle the p5 callbacks
    legacyPreloadSetup: { // Optional object to generate a legacy-style preload
      method: 'loadX',    // The name of the legacy preload function to generate
      createBaseObject: function() {
        return {};
      } // An optional function to create the base object for the legacy preload.
    }
  }
  */
];

p5.prototype._preloadDone = false;
p5.prototype._preloadCount = 0;

p5.prototype.registerPromisePreload = function(setup) {
  p5.prototype._promisePreloads.push(setup);
};

let initialSetupRan = false;

p5.prototype._setupPromisePreloads = function() {
  for (const preloadSetup of this._promisePreloads) {
    let thisValue = this;
    let { method, addCallbacks, legacyPreloadSetup } = preloadSetup;
    // Get the target object that the preload gets assigned to by default,
    // that is the current object.
    let target = preloadSetup.target || this;
    let sourceFunction = target[method].bind(target);
    // If the target is the p5 prototype, then only set it up on the first run per page
    if (target === p5.prototype) {
      if (initialSetupRan) {
        continue;
      }
      thisValue = null;
      sourceFunction = target[method];
    }

    // Replace the original method with a wrapped version
    target[method] = this._wrapPromisePreload(
      thisValue,
      sourceFunction,
      addCallbacks
    );
    // If a legacy preload is required
    if (legacyPreloadSetup) {
      // What is the name for this legacy preload
      const legacyMethod = legacyPreloadSetup.method;
      // Wrap the already wrapped Promise-returning method with the legacy setup
      target[legacyMethod] = this._legacyPreloadGenerator(
        thisValue,
        legacyPreloadSetup,
        target[method]
      );
    }
  }
  initialSetupRan = true;
};

p5.prototype._wrapPromisePreload = function(thisValue, fn, addCallbacks) {
  let replacementFunction = function(...args) {
    // Uses the current preload counting mechanism for now.
    this._incrementPreload();
    // A variable for the callback function if specified
    let callback = null;
    // A variable for the errorCallback function if specified
    let errorCallback = null;
    if (addCallbacks) {
      // Loop from the end of the args array, pulling up to two functions off of
      // the end and putting them in fns
      for (let i = args.length - 1; i >= 0 && !errorCallback; i--) {
        if (typeof args[i] !== 'function') {
          break;
        }
        errorCallback = callback;
        callback = args.pop();
      }
    }
    // Call the underlying function and pass it to Promise.resolve,
    // so that even if it didn't return a promise we can still
    // act on the result as if it did.
    const promise = Promise.resolve(fn.apply(this, args));
    // Add the optional callbacks
    if (callback) {
      promise.then(callback);
    }
    if (errorCallback) {
      promise.catch(errorCallback);
    }
    // Decrement the preload counter only if the promise resolved
    promise.then(() => this._decrementPreload());
    // Return the original promise so that neither callback changes the result.
    return promise;
  };
  if (thisValue) {
    replacementFunction = replacementFunction.bind(thisValue);
  }
  return replacementFunction;
};

const objectCreator = function() {
  return {};
};

p5.prototype._legacyPreloadGenerator = function(
  thisValue,
  legacyPreloadSetup,
  fn
) {
  // Create a function that will generate an object before the preload is
  // launched. For example, if the object should be an array or be an instance
  // of a specific class.
  const baseValueGenerator =
    legacyPreloadSetup.createBaseObject || objectCreator;
  let returnedFunction = function(...args) {
    // Our then clause needs to run before setup, so we also increment the preload counter
    this._incrementPreload();
    // Generate the return value based on the generator.
    const returnValue = baseValueGenerator.apply(this, args);
    // Run the original wrapper
    fn.apply(this, args).then(data => {
      // Copy each key from the resolved value into returnValue
      Object.assign(returnValue, data);
      // Decrement the preload counter, to allow setup to continue.
      this._decrementPreload();
    });
    return returnValue;
  };
  if (thisValue) {
    returnedFunction = returnedFunction.bind(thisValue);
  }
  return returnedFunction;
};

p5.prototype._decrementPreload = function() {
  const context = this._isGlobal ? window : this;
  if (!context._preloadDone && typeof context.preload === 'function') {
    context._setProperty('_preloadCount', context._preloadCount - 1);
    context._runIfPreloadsAreDone();
  }
};

p5.prototype._wrapPreload = function(obj, fnName) {
  return (...args) => {
    //increment counter
    this._incrementPreload();
    //call original function
    return this._registeredPreloadMethods[fnName].apply(obj, args);
  };
};

p5.prototype._incrementPreload = function() {
  const context = this._isGlobal ? window : this;
  // Do nothing if we tried to increment preloads outside of `preload`
  if (context._preloadDone) return;
  context._setProperty('_preloadCount', context._preloadCount + 1);
};

p5.prototype._runIfPreloadsAreDone = function() {
  const context = this._isGlobal ? window : this;
  if (context._preloadCount === 0) {
    const loadingScreen = document.getElementById(context._loadingScreenId);
    if (loadingScreen) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
    // this.callRegisteredHooksFor('afterPreload');
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

p5.prototype.registerPreloadMethod = function(fnString, obj) {
  // obj = obj || p5.prototype;
  if (!p5.prototype._preloadMethods.hasOwnProperty(fnString)) {
    p5.prototype._preloadMethods[fnString] = obj;
  }
};
