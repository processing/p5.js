/**
 * @module Loading
 * @for p5
 * @private
 *
 * Handles the logic for creating a loading indicator.
 * Currently, the loading indicator is basic and can be extended in the future.
 */

/**
 * Creates a loading indicator when the sketch's setup() function is running.
 * It is called and removed automatically using the presetup and postsetup lifecycles hooks.
 *
 * @param {*} p5 The p5 constructor
 * @param {*} fn The p5 prototype object
 * @param {*} lifecycles Lifecycle hooks for the sketch
 */
export default function loading(p5, fn, lifecycles) {
  lifecycles.presetup = function () {
    if (typeof window === 'undefined' || this._loadingIndicator) {
      return;
    }

    const canvasParent = this.canvas?.parentElement;
    let container = this._userNode || canvasParent || document.body;

    if (typeof container === 'string') {
      container = document.getElementById(container) || document.body;
    }

    this._loadingIndicator = createLoadingIndicator(container);
  };

  lifecycles.postsetup = function () {
    if (this._loadingIndicator) {
      this._loadingIndicator.remove();
      this._loadingIndicator = null;
    }
  };
}

/**
 * Creates and stylizes the loading indicator.
 * As a helper function, it can be extensible and modified in future versions.
 *
 * @private
 * @param {HTMLElement} container The HTML element to append the indicator to
 * @returns {HTMLElement} The loading indicator div element
 */
function createLoadingIndicator(container) {
  if (!document.getElementById('p5-loading-style')) {
    const loadingStyle = document.createElement('style');
    loadingStyle.id = 'p5-loading-style';
    loadingStyle.textContent =
      '@keyframes p5-loading-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(loadingStyle);
  }

  const indicator = document.createElement('div');
  indicator.className = 'loading-indicator';
  indicator.style.cssText = `
    position: fixed;
    inset: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    border-radius: 50%;

    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: rgba(0, 0, 0, 0.8);
    animation: p5-loading-spin 1s linear infinite;
    z-index: 9999;
  `;

  container.appendChild(indicator);
  return indicator;
}
