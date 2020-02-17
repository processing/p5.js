import p5 from '../core/main';
import { initialize as initTranslator } from './internationalization';

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
const _globalInit = () => {
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

// make a promise that resolves when the document is ready
const waitForDocumentReady = () =>
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

Promise.all([waitForDocumentReady(), initTranslator()]).then(_globalInit);
