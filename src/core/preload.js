import p5 from './main';

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
