/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var Filters = require('filters');
  require('p5.Color');

  /**
   * <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
   * /Global_Objects/Uint8ClampedArray' target='_blank'>Uint8ClampedArray</a>
   * containing the values for all the pixels in the display
   * window. These values are numbers. This array is the size of the display 
   * window x4, representing the R, G, B, A values in order for each pixel, 
   * moving from left to right across each row, then down each column. For 
   * example, if the image is 100x100 pixels, there will be 40000. The 
   * first four values (indices 0-3) in the array will be the R, G, B, A  
   * values of the pixel at (0, 0). The second four values (indices 4-7) will 
   * contain the R, G, B, A values of the pixel at (1, 0). More generally, to 
   * set values for a pixel at (x, y): 
   * <br>
   * <code>pixels[y*width+x] = r; 
   * pixels[y*width+x+1] = g;
   * pixels[y*width+x+2] = b;
   * pixels[y*width+x+3] = a;</code>
   * <br><br>
   * Before accessing this array, the data must loaded with the loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
   * <br><br>
   * Note that this is not a standard javascript array.  This means that 
   * standard javascript functions such as <code>slice()</code> or 
   * <code>arrayCopy()</code> do not
   * work.
   *
   * @property pixels[]   
   * @example
   * <div>
   * <code>
   * var pink = color(255, 102, 204);
   * loadPixels();
   * for (var i = 0; i < 4*(width*height/2); i+=4) {
   *   pixels[i] = red(pink);
   *   pixels[i+1] = green(pink);
   *   pixels[i+2] = blue(pink);
   *   pixels[i+3] = alpha(pink);
   * }
   * updatePixels();
   * </code>
   * </div>
   */
  p5.prototype.pixels = [];

  /**
   * Copies a region of pixels from one image to another, using a specified
   * blend mode to do the operation.<br><br>
   * Available blend modes are: BLEND | DARKEST | LIGHTEST | DIFFERENCE | 
   * MULTIPLY| EXCLUSION | SCREEN | REPLACE | OVERLAY | HARD_LIGHT | 
   * SOFT_LIGHT | DODGE | BURN | ADD | NORMAL
   *
   * 
   * @method blend
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   * @param  {Integer} blendMode the blend mode
   *
   * @example
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST);
   * }
   * </code></div>
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, DARKEST);
   * }
   * </code></div>
   * <div><code>
   * var img0;
   * var img1;
   *
   * function preload() {
   *   img0 = loadImage("assets/rockies.jpg");
   *   img1 = loadImage("assets/bricks_third.jpg");
   * }
   * 
   * function setup() {
   *   background(img0);
   *   image(img1, 0, 0);
   *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, ADD);
   * }
   * </code></div>
   */
  p5.prototype.blend = function() {
    this._graphics.blend.apply(this._graphics, arguments);
  };

  /**
   * Copies a region of the canvas to another region of the canvas  
   * and copies a region of pixels from an image used as the srcImg parameter
   * into the canvas srcImage is specified this is used as the source. If
   * the source and destination regions aren't the same size, it will
   * automatically resize source pixels to fit the specified
   * target region.
   *
   * @method copy
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   */
  p5.prototype.copy = function () {
    p5.Graphics2D._copyHelper.apply(this, arguments);
  };

  /**
   * Applies a filter to the canvas
   * 
   * @method filter
   * @param  {String}           operation one of threshold, gray, invert,
   *                                      posterize and opaque. see filters.js
   *                                      for docs on each available filter
   * @param  {Number|undefined} value
   */
  p5.prototype.filter = function(operation, value) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  };

  /**
   * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
   * an image. If no parameters are specified, the entire image is returned. 
   * Use the x and y parameters to get the value of one pixel. Get a section of
   * the display window by specifying additional w and h parameters. When 
   * getting an image, the x and y parameters define the coordinates for the 
   * upper-left corner of the image, regardless of the current imageMode().
   *
   * If the pixel requested is outside of the image window, [0,0,0,255] is 
   * returned. To get the numbers scaled according to the current color ranges
   * and taking into account colorMode, use getColor instead of get.
   *
   * Getting the color of a single pixel with get(x, y) is easy, but not as fast
   * as grabbing the data directly from pixels[]. The equivalent statement to
   * get(x, y) using pixels[] is [ pixels[y*width+x], pixels[y*width+x+1], 
   * pixels[y*width+x+2], pixels[y*width+3] ]. See the reference for
   * pixels[] for more information.
   *
   * @method get
   * @param  {Number}         [x] x-coordinate of the pixel
   * @param  {Number}         [y] y-coordinate of the pixel
   * @param  {Number}         [w] width
   * @param  {Number}         [h] height
   * @return {Array|p5.Image}     values of pixel at x,y in array format
   *                              [R, G, B, A] or p5.Image
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * function setup() {
   *   image(img, 0, 0);
   *   var c = get();
   *   image(c, width/2, 0);
   * }
   * </code>
   * </div>
   * 
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * function setup() {
   *   image(img, 0, 0);
   *   var c = get(50, 90);
   *   fill(c);
   *   noStroke();
   *   rect(25, 25, 50, 50);
   * }
   * </code>
   * </div>
   */
  p5.prototype.get = function(x, y, w, h){
    return this._graphics.get(x, y, w, h);
  };

  /**
   * Loads the pixel data for the display window into the pixels[] array. This
   * function must always be called before reading from or writing to pixels[].
   *
   * @method loadPixels   
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * 
   * function setup() {
   *   image(img, 0, 0);
   *   var halfImage = 4 * img.width * img.height/2;
   *   loadPixels();
   *   for (var i = 0; i < halfImage; i++) {
   *     pixels[i+halfImage] = pixels[i];
   *   }
   *   updatePixels();
   * }
   * </code>
   * </div>
   */
  p5.prototype.loadPixels = function() {
    this._graphics.loadPixels();
  };

  /**
   * <p>Changes the color of any pixel, or writes an image directly to the 
   * display window.</p>
   * <p>The x and y parameters specify the pixel to change and the c parameter
   * specifies the color value. This can be a p5.COlor object, or [R, G, B, A]
   * pixel array. It can also be a single grayscale value.
   * When setting an image, the x and y parameters define the coordinates for
   * the upper-left corner of the image, regardless of the current imageMode().
   * </p>
   * <p>
   * After using set(), you must call updatePixels() for your changes to 
   * appear.  This should be called once all pixels have been set.
   * </p>
   * <p>Setting the color of a single pixel with set(x, y) is easy, but not as
   * fast as putting the data directly into pixels[]. The equivalent statement
   * to set(x, y, [100, 50, 10, 255]) using pixels[] is:</p>
   * <pre><code class="language-markup">pixels[4*(y*width+x)] = 100;
   * pixels[4*(y*width+x)+1] = 50;
   * pixels[4*(y*width+x)+2] = 10;
   * pixels[4*(y*width+x)+3] = 255;</code></pre>
   * <p>See the reference for pixels[] for more information.</p>
   *
   * @method set
   * @param {Number}              x x-coordinate of the pixel
   * @param {Number}              y y-coordinate of the pixel
   * @param {Number|Array|Object} c insert a grayscale value | a pixel array |
   *                                a p5.Color object | a p5.Image to copy   
   * @example
   * <div>
   * <code>
   * var black = color(0);
   * set(30, 20, black);
   * set(85, 20, black);
   * set(85, 75, black);
   * set(30, 75, black);
   * updatePixels();
   * </code>
   * </div> 
   *
   * <div>
   * <code>
   * for (var i = 30; i < width-15; i++) {
   *   for (var j = 20; j < height-25; j++) {
   *     var c = color(204-j, 153-i, 0);
   *     set(i, j, c);
   *   }
   * }
   * updatePixels();
   * </code>
   * </div> 
   *
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   *
   * function setup() {
   *   set(0, 0, img);
   *   updatePixels();
   *   line(0, 0, width, height);
   *   line(0, height, width, 0);
   * }
   * </code>
   * </div>
   */
  p5.prototype.set = function (x, y, imgOrCol) {
    this._graphics.set(x, y, imgOrCol);
  };
  /**
   * Updates the display window with the data in the pixels[] array.
   * Use in conjunction with loadPixels(). If you're only reading pixels from
   * the array, there's no need to call updatePixels() — updating is only
   * necessary to apply changes. updatePixels() should be called anytime the 
   * pixels array is manipulated or set() is called.
   *
   * @method updatePixels  
   * @param  {Number} [x]    x-coordinate of the upper-left corner of region 
   *                         to update
   * @param  {Number} [y]    y-coordinate of the upper-left corner of region 
   *                         to update
   * @param  {Number} [w]    width of region to update
   * @param  {Number} [w]    height of region to update
   * @example
   * <div>
   * <code>
   * var img;
   * function preload() {
   *   img = loadImage("assets/rockies.jpg");
   * }
   * 
   * function setup() {
   *   image(img, 0, 0);
   *   var halfImage = 4 * img.width * img.height/2;
   *   loadPixels();
   *   for (var i = 0; i < halfImage; i++) {
   *     pixels[i+halfImage] = pixels[i];
   *   }
   *   updatePixels();
   * }
   * </code>
   * </div>
   */
  p5.prototype.updatePixels = function (x, y, w, h) {
    this._graphics.updatePixels(x, y, w, h);
  };

  return p5;

});
