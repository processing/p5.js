/**
 * @module Loading
 * @for p5
 * @private
 *
 * Handles the logic for creating a loading indicator.
 * Currently, the loading indicator is basic and can be extended in the future.
 */

let loadingIndicator = null;

/**
 * Creates a loading indicator when the sketch's setup() function is running.
 * It is called and removed automatically using the presetup and postsetup lifecycles hooks.
 *
 * @param {*} p5 The p5 constructor
 * @param {*} fn The p5 prototype object
 * @param {*} lifecycles Lifecycle hooks for the sketch
 */
export default function loading(p5, fn, lifecycles) {
  lifecycles.presetup = function() {
    if (typeof window === 'undefined' || loadingIndicator) return;

    const container = this.canvas?.parentElement || document.body;
    loadingIndicator = createLoadingIndicator(container);
  };

  lifecycles.postsetup = function() {
    loadingIndicator?.remove();
    loadingIndicator = null;
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
  if (!document.getElementById('loading-style')) {
    const loadingStyle = document.createElement('style');
    loadingStyle.id = 'loading-style';
    loadingStyle.textContent = '@keyframes loading-spin { to { transform: rotate(360deg); } }';
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
    animation: loading-spin 1s linear infinite;
  `;

  container.appendChild(indicator);
  return indicator;
}