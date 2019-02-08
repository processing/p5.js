'use strict';

var p5 = require('./main');

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
  {
    target: p5.prototype,
    method: 'loadPromiseAsync',
    addCallbacks: true,
    legacyPreloadSetup: {
      method: 'loadPromise'
    }
  }
];

p5.prototype.registerPromisePreload = function(setup) {
  p5.prototype._promisePreloads.push(setup);
};

p5.prototype._setupPromisePreloads = function() {
  for (var i in this._promisePreloads) {
    var preloadSetup = this._promisePreloads[i];
    // Get the target object that the preload gets assigned to by default,
    // that is the current object.
    var target = preloadSetup.target || this;
    // If the target is the p5 prototype, then set it to the current object instead.
    if (target === p5.prototype) {
      target = this;
    }
    var method = preloadSetup.method;
    // Option to add the p5 callback and errorCallback automatically to the function
    // when setting up the preload.
    var addCallbacks = preloadSetup.addCallbacks;
    // Optional setup for a legacy preload that will return an object immediately
    var legacyPreloadSetup = preloadSetup.legacyPreloadSetup;
    // Replace the original method with a wrapped version
    target[method] = this._wrapPromisePreload(
      target,
      target[method],
      addCallbacks
    );
    // If we are a global p5 instance and the target of the preload is this then
    // also add it to the window
    if (target === this && this._isGlobal) {
      window[method] = target[method];
    }
    // If a legacy preload is required
    if (legacyPreloadSetup) {
      // What is the name for this legacy preload
      var legacyMethod = legacyPreloadSetup.method;
      // Wrap the already wrapped Promise-returning method with the legacy setup
      target[legacyMethod] = this._legacyPreloadGenerator(
        legacyPreloadSetup,
        target[method]
      );
      if (target === this && this._isGlobal) {
        // If we are a global p5 instance and the target of the preload is this then
        // also add it to the window
        window[legacyMethod] = target[legacyMethod];
      }
    }
  }
};

p5.prototype._wrapPromisePreload = function(target, fn, addCallbacks) {
  return function() {
    // Uses the current preload counting mechanism for now.
    this._incrementPreload();
    // The arguments to be passed into the wrapped function
    var args = arguments;
    // A variable for the callback function if specified
    var callback;
    // A variable for the errorCallback function if specified
    var errorCallback;
    if (addCallbacks) {
      // We need to call array methods, so make args an actual array
      args = Array.prototype.slice.call(arguments);
      // Temporary holder for callbacks
      var fns = [];
      // Loop from the end of the args array, pulling up to two functions off of
      // the end and putting them in fns
      for (var i = args.length - 1; i >= 0 && fns.length < 2; i--) {
        if (typeof args[i] !== 'function') {
          break;
        }
        fns.unshift(args.pop());
      }
      // Set our callback variables
      callback = fns[0];
      errorCallback = fns[1];
    }
    // Call the underlying funciton and pass it to Promise.resolve,
    // so that even if it didn't return a promise we can still
    // act on the result as if it did.
    var promise = Promise.resolve(fn.apply(target, args));
    // Add the optional callbacks
    if (callback) {
      promise.then(callback);
    }
    if (errorCallback) {
      promise.catch(errorCallback);
    }
    // Decrement the preload counter only if the promise resolved
    promise.then(this._decrementPreload.bind(this));
    // Return the original promise so that neither callback changes the result.
    return promise;
  }.bind(this);
};

var objectCreator = function() {
  return {};
};

p5.prototype._legacyPreloadGenerator = function(legacyPreloadSetup, fn) {
  // Create a function that will generate an object before the preload is
  // launched. For example, if the object should be an array or be an instance
  // of a specific class.
  var baseValueGenerator = legacyPreloadSetup.createBaseObject || objectCreator;
  return function() {
    // Our then clause needs to run before setup, so we also increment the preload counter
    this._incrementPreload();
    // Generate the return value based on the generator.
    var returnValue = baseValueGenerator.apply(this, arguments);
    // Run the original wrapper
    fn
      .apply(this, arguments)
      .then(function(data) {
        // Copy each key from the resolved value into returnValue
        for (var key in data) {
          returnValue[key] = data[key];
        }
      })
      // Decrement the preload counter, to allow setup to continue.
      .then(this._decrementPreload.bind(this));
    return returnValue;
  }.bind(this);
};
