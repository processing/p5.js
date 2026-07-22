/**
 * @module Loading
 * @for p5
 * @private
 *
 * Creates a loading indicator when the sketch's setup() function is running.
 * Currently, the loading indicator is basic and can be extended in the future.
 */

let loadingIndicator = null;

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

function createLoadingIndicator(container) {
  if (!document.getElementById('loading-style')) {
    const style = document.createElement('style');
    style.id = 'loading-style';
    style.textContent = '@keyframes loading-spin { to { transform: translate(-50%, -50%) rotate(360deg);}}';
    document.head.appendChild(style);
  }

  const indicator = document.createElement('div');
  indicator.className = 'loading-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 50%;

    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: rgba(0, 0, 0, 0.8);
    animation: loading-spin 1s linear infinite;
    z-index: 9999;
  `;

  container.appendChild(indicator);
  return indicator;
}