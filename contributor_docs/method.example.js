/**
 * "This is a template for inline documentation of a method. Remove all text
 * between double quotes for using this template. Some description about the
 * method goes here. Explain in simple words, what the function does and what
 * would be good/bad use cases for it. If there are any corners cases or warnings,
 * do explain them over here."
 *
 * By default, the background is transparent.
 *
 * @method "methodName"
 * @param {dataType} "variableName" "Description of the parameter"
 * @param {dataType} ["variableName"] "Description of optional parameter"
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // "Comment explaining the example."
 * "Your code goes here."
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // "Comment explaining the example."
 * "Your code goes here"
 * </code>
 * </div>
 *
 * @alt
 * "A single line precisely describing the first example"
 * "A single line precisely describing the second example"
 */

// "If your method has more than one signatures, they can be documentated each
// in their own block with description about their parameters as follows."
/**
 * @method "methodName"
 * @param {"dataType"} "paramName" "Description of the param"
 * @param {"dataType"} "paramName" "Description of the param"
 * @chainable
 */
p5.prototype.methodName = function() {
  // Comment explaining the code.
  'Your code goes here';
};

// Here's a filled example for this template.
/**
 * The <a href="#/p5/background">background()</a> function sets the color used
 * for the background of the p5.js canvas. This function is typically used within
 * draw() to clear the display window at the beginning of each frame, but it can
 * be used inside setup() to set the background on the first frame of animation
 * or if the background need only be set once.
 *
 * By default, the background is transparent.
 *
 * @method background
 * @param {Number} gray specifies a value between white and black
 * @param {Number} [a] opacity of the background relative to current color
 *                     range (default is 0-255)
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * background(0);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * background(0,255,0);
 * </code>
 * </div>
 *
 * @alt
 * A canvas with a black background.
 * A canvas with a green background.
 */

/**
 * @method background
 * @param {String} colorString Color in string datatype, possible formats
 *                             include: integer, rgb(), rgba(), percentage rgb(),
 *                             percentage rgba(), 3 digit hex, 6 digit hex,
 * @param {Number} [a]
 * @chainable
 */
p5.prototype.background = function() {
  // Your code goes here.
};
