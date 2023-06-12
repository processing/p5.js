// requestAnim shim layer by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/
// requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
window.requestAnimationFrame = (() =>
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((callback, element) => {
    // should '60' here be framerate?
    window.setTimeout(callback, 1000 / 60);
  }))();

/**
 * shim for Uint8ClampedArray.slice
 * (allows arrayCopy to work with pixels[])
 * with thanks to http://halfpapstudios.com/blog/tag/html5-canvas/
 * Enumerable set to false to protect for...in from
 * Uint8ClampedArray.prototype pollution.
 */
(() => {
  if (
    typeof Uint8ClampedArray !== 'undefined' &&
    !Uint8ClampedArray.prototype.slice
  ) {
    Object.defineProperty(Uint8ClampedArray.prototype, 'slice', {
      value: Array.prototype.slice,
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
})();

/**
 * this is implementation of Object.assign() which is unavailable in
 * IE11 and (non-Chrome) Android browsers.
 * The assign() method is used to copy the values of all enumerable
 * own properties from one or more source objects to a target object.
 * It will return the target object.
 * Modified from https://github.com/ljharb/object.assign
 */
(() => {
  if (!Object.assign) {
    const keys = Object.keys;
    const defineProperty = Object.defineProperty;
    const canBeObject = obj => typeof obj !== 'undefined' && obj !== null;
    const hasSymbols =
      typeof Symbol === 'function' && typeof Symbol() === 'symbol';
    const propIsEnumerable = Object.prototype.propertyIsEnumerable;
    const isEnumerableOn = obj =>
      (function isEnumerable(prop) {
        return propIsEnumerable.call(obj, prop);
      });

    // per ES6 spec, this function has to have a length of 2
    const assignShim = function assign(target, source1) {
      if (!canBeObject(target)) {
        throw new TypeError('target must be an object');
      }
      const objTarget = Object(target);
      let s, source, i, props;
      for (s = 1; s < arguments.length; ++s) {
        source = Object(arguments[s]);
        props = keys(source);
        if (hasSymbols && Object.getOwnPropertySymbols) {
          props.push(
            ...Object.getOwnPropertySymbols(source)
              .filter(isEnumerableOn(source))
          );
        }
        for (i = 0; i < props.length; ++i) {
          objTarget[props[i]] = source[props[i]];
        }
      }
      return objTarget;
    };

    defineProperty(Object, 'assign', {
      value: assignShim,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
})();
