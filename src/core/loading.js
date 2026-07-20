/**
 * @module Loading
 * @for p5
 * @private
 *
 * Creates a loading indicator when the sketch's setup() function is running.
 * Currently, the loading indicator is basic and can be extended in the future.
 */

let loadingIndicator = null;

/**
 * Creates a simple loading indicator at the center of the webpage.
 *
 * @method showLoadingIndicator
 * @param {HTMLElement} canvas The canvas element of the webpage.
 * @private
 */
export function showLoadingIndicator(canvas) {
  if (!canvas || loadingIndicator) {
    return;
  }

  loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading...';

  loadingIndicator.style.cssText = `
    position: fixed;
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    display: grid;
    place-items: center;
  `;

  canvas.parentElement?.appendChild(loadingIndicator);
}

/**
 * Removes the loading indicator element from the webpage DOM.
 *
 * @method hideLoadingIndicator
 * @private
 */
export function hideLoadingIndicator() {
  loadingIndicator?.remove();
  loadingIndicator = null;
}