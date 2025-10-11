/**
 * @module p5.viewport
 * @submodule p5.viewport
 * @for p5
 * @version 0.0.1
 * @author om balgude
 * @description This addon provides a setViewport function to remap the canvas coordinate system.
 *
 */

(function() {
  /**
   * The viewportAddon function is automatically called by p5.js to add the addon
   * functionality to the p5.js library.
   *
   * @private
   * @param {Object} p5 - The p5.js instance.
   * @param {Object} fn - The p5.js prototype object.
   * @param {Object} lifecycles - The p5.js lifecycle hooks.
   */
  function viewportAddon(p5, fn, lifecycles) {
    /**
     * Sets the coordinate system to a new viewport.
     *
     * Calling `setViewport(xmin, xmax, ymin, ymax)` remaps the canvas's
     * coordinate system. The top-left corner of the canvas will be `(xmin, ymin)`
     * and the bottom-right corner will be `(xmax, ymax)`.
     *
     * @method setViewport
     * @param {Number} xmin The minimum x-value of the viewport.
     * @param {Number} xmax The maximum x-value of the viewport.
     * @param {Number} ymin The minimum y-value of the viewport.
     * @param {Number} ymax The maximum y-value of the viewport.
     * @chainable
     */
    fn.setViewport = function(xmin, xmax, ymin, ymax) {
      this.resetMatrix();
      const scaleX = this.width / (xmax - xmin);
      const scaleY = this.height / (ymax - ymin);
      this.scale(scaleX, scaleY);
      this.translate(-xmin, -ymin);
      return this;
    };
  }

  // Register the addon with p5.js
  if (typeof p5 !== 'undefined') {
    p5.registerAddon(viewportAddon);
  }
})();
