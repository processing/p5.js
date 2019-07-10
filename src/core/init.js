'use strict';

import p5 from '../core/main';

/**
 * _globalInit
 *
 * TODO: ???
 * if sketch is on window
 * assume "global" mode
 * and instantiate p5 automatically
 * otherwise do nothing
 *
 * @private
 * @return {Undefined}
 */
var _globalInit = function() {
  if (!window.mocha) {
    // If there is a setup or draw function on the window
    // then instantiate p5 in "global" mode
    if (
      ((window.setup && typeof window.setup === 'function') ||
        (window.draw && typeof window.draw === 'function')) &&
      !p5.instance
    ) {
      new p5();
    }
  }
};

// TODO: ???

// if the page is ready, initialize p5 immediately
if (document.readyState === 'complete') {
  _globalInit();
  // if the page is still loading, add an event listener
  // and initialize p5 as soon as it finishes loading
} else {
  window.addEventListener('load', _globalInit, false);
}
