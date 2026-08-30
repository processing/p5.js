/**
 * @module Loading
 * @for p5
 * @private
 *
 * Handles the logic for creating a loading indicator.
 */

/**
 * Creates a loading indicator when the sketch's setup() function is running.
 * It is called and removed automatically using the presetup and postsetup lifecycle hooks.
 * Registers loading indicator decorators for createCanvas(), resizeCanvas(), and noCanvas() 
 * to manage the loading indicator overlay.
 *
 * @param {*} p5 The p5 constructor
 * @param {*} fn The p5 prototype object
 * @param {*} lifecycles Lifecycle hooks for the sketch
 */
export default function loading(p5, fn, lifecycles) {
  p5.registerDecorator('p5.prototype.createCanvas', _handleLoadingIndicator(true));
  p5.registerDecorator('p5.prototype.resizeCanvas', _handleLoadingIndicator(true));
  p5.registerDecorator('p5.prototype.noCanvas', _handleLoadingIndicator(false));

  lifecycles.presetup = function () {
    if (typeof window === 'undefined') {
      return;
    }
    this._isSketchLoading = true;
  };

  lifecycles.postsetup = function () {
    this._isSketchLoading = false;
    _removeLoadingOverlay(this);
  };
}

/**
 * Creates the loading canvas to directly overlay the sketch canvas
 * and starts the spinning logo animation loop.
 *
 * @private
 * @param {p5} pInst The p5 instance.
 */
function _createLoadingOverlay(pInst) {
  const actualCanvas = pInst.canvas?.elt || pInst.canvas;
  if (!actualCanvas) return;

  let overlay = pInst._loadingOverlay;

  // If overlay doesn't exist yet, create it and animate it
  if (!overlay) {
    overlay = document.createElement('canvas');
    overlay.id = `${actualCanvas.id || 'defaultCanvas0'}_loadingOverlay`;
    pInst._loadingOverlay = overlay;

    const ctx = overlay.getContext('2d');
    let frameCount = 0;

    const animate = () => {
      if (!pInst._isSketchLoading) return;

      ctx.clearRect(0, 0, overlay.width, overlay.height);
      _drawLoadingIndicator(
        ctx,
        overlay.width / 2,
        overlay.height / 2,
        frameCount++
      );

      pInst._loadingOverlayFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  // Positions the loading indicator to overlay the sketch canvas
  _positionCanvas(overlay, actualCanvas);

  if (overlay.parentNode !== actualCanvas.parentNode) {
    actualCanvas.parentNode.insertBefore(overlay, actualCanvas.nextSibling);
  }
}

/**
 * Matches the size and position of the loading canvas to the user's sketch canvas.
 *
 * @private
 * @param {HTMLCanvasElement} loadingCanvas The overlay canvas element.
 * @param {HTMLCanvasElement} actualCanvas The sketch canvas element.
 */
function _positionCanvas(loadingCanvas, actualCanvas) {
  loadingCanvas.width = actualCanvas.width;
  loadingCanvas.height = actualCanvas.height;

  const width = actualCanvas.style.width || `${actualCanvas.offsetWidth || actualCanvas.width}px`;
  const height = actualCanvas.style.height || `${actualCanvas.offsetHeight || actualCanvas.height}px`;

  Object.assign(loadingCanvas.style, {
    width,
    height,
    position: 'absolute',
    top: `${actualCanvas.offsetTop}px`,
    left: `${actualCanvas.offsetLeft}px`,
    margin: '0',
    padding: '0',
    pointerEvents: 'none',
    zIndex: '9999'
  });
}

/**
 * Stops the loading indicator animation and removes the overlay canvas from the DOM.
 *
 * Cancels the requestAnimationFrame loop and removes the overlay canvas
 * element from the document.
 *
 * @private
 * @param {p5} pInst The p5 instance.
 */
function _removeLoadingOverlay(pInst) {
  if (pInst._loadingOverlay) {
    cancelAnimationFrame(pInst._loadingOverlayFrame);
    pInst._loadingOverlay.remove();
    pInst._loadingOverlay = null;
  }
}

/**
 * Draws a canvas-based animated loading indicator.
 * The loading indcator is a spinning p5 logo.
 * 
 * Credits to Raphaël de Courville for creating the p5 logo sketch
 *
 * @private
 * @param {CanvasRenderingContext2D} ctx The 2D canvas context to draw on.
 * @param {Number} x The x-coordinate for the logo center.
 * @param {Number} y The y-coordinate for the logo center.
 * @param {Number} t The frame count used to calculate rotation.
 */
function _drawLoadingIndicator(ctx, x, y, t) {
  let rotationSpeed = 3.25;
  let indicatorSize = 1.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(indicatorSize, indicatorSize);

  ctx.rotate((t * rotationSpeed * Math.PI) / 180);
  ctx.translate(-14, -14);

  ctx.fillStyle = '#ED225D';
  ctx.beginPath();

  ctx.moveTo(16.909, 10.259);
  ctx.lineTo(25.442, 7.683);
  ctx.lineTo(27.118, 12.839);
  ctx.lineTo(18.62, 15.738);
  ctx.lineTo(23.895, 23.218);
  ctx.lineTo(19.448, 26.443);
  ctx.lineTo(13.895, 19.095);
  ctx.lineTo(8.487, 26.25);
  ctx.lineTo(4.169, 22.961);
  ctx.lineTo(9.444, 15.738);
  ctx.lineTo(0.88, 12.647);
  ctx.lineTo(2.558, 7.487);
  ctx.lineTo(11.156, 10.258);
  ctx.lineTo(11.156, 1.364);
  ctx.lineTo(16.91, 1.364);

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Intercepts canvas methods to create, update, or remove the loading indicator
 * 
 * @private
 * @internal
 * 
 * @param {Boolean} isLoading True to show the loading indicator; false to hide it.
 * @return {Function} A decorator function for the target canvas method.
 */
export function _handleLoadingIndicator(isLoading) {
  return function (target) {
    return function (...args) {
      const result = target.call(this, ...args);

      // Create loading sketch if canvas is loading
      if (isLoading) {
        if (this._isSketchLoading) {
          _createLoadingOverlay(this);
        }
      } 

      // Remove loading sketch if canvas isn't loading
      else {
        _removeLoadingOverlay(this);
      }

      return result;
    };
  };
}