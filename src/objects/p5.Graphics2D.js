define(function(require){

  var p5 = require('core');
  var constants = require('constants');
  require('p5.Graphics');
  /**
   * 2D graphics class.  Can also be used as an off-screen graphics buffer.
   * A p5.Graphics2D object can be constructed
   * with the <code>createGraphics2D()</code> function. The fields and methods
   * for this class are extensive, but mirror the normal drawing API for p5.
   *
   * @class p5.Graphics2D
   * @constructor
   * @extends p5.Element
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   * @example
   * <div>
   * <code>
   * var pg;
   * function setup() {
   *   createCanvas(100, 100);
   *   pg = createGraphics2D(40, 40);
   * }
   * function draw() {
   *   background(200);
   *   pg.background(100);
   *   pg.noStroke();
   *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
   *   image(pg, 9, 30);
   *   image(pg, 51, 30);
   * }
   * </code>
   * </div>
   */
  p5.Graphics2D = function(elt, pInst, isMainCanvas){
    p5.Graphics.call(this, elt, pInst, isMainCanvas);
    this.drawingContext = this.canvas.getContext('2d');
    this._pInst._setProperty('drawingContext', this.drawingContext);
    return this;
  };

  p5.Graphics2D.prototype = Object.create(p5.Graphics.prototype);

  p5.Graphics2D.prototype._applyDefaults = function() {
    this.drawingContext.fillStyle = '#FFFFFF';
    this.drawingContext.strokeStyle = '#000000';
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  };

  return p5.Graphics2D;
});