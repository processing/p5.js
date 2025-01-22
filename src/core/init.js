import p5 from '../core/main';
import { initialize as initTranslator } from './internationalization';

/**
 * This file setup global mode automatic instantiation
 *
 * if sketch is on window
 * assume "global" mode
 * and instantiate p5 automatically
 * otherwise do nothing
 *
 * @private
 * @return {Undefined}
 */
export const _globalInit = () => {
  // Could have been any property defined within the p5 constructor.
  // If that property is already a part of the global object,
  // this code has already run before, likely due to a duplicate import
  if (typeof window._setupDone !== 'undefined') {
    console.warn(
      'p5.js seems to have been imported multiple times. Please remove the duplicate import'
    );
    return;
  }

  if (!window.mocha) {
    const p5ReadyEvent = new Event('p5Ready');
    window.dispatchEvent(p5ReadyEvent);

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

// make a promise that resolves when the document is ready
export const waitForDocumentReady = () =>
  new Promise((resolve, reject) => {
    // if the page is ready, initialize p5 immediately
    if (document.readyState === 'complete') {
      resolve();
      // if the page is still loading, add an event listener
      // and initialize p5 as soon as it finishes loading
    } else {
      window.addEventListener('load', resolve, false);
    }
  });

// only load translations if we're using the full, un-minified library
export const waitingForTranslator =
  typeof IS_MINIFIED === 'undefined' ? initTranslator() :
    Promise.resolve();
