/**
 * Creates a loading indicator
 */

let loadingIndicator = null;

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

export function hideLoadingIndicator() {
  loadingIndicator?.remove();
  loadingIndicator = null;
}