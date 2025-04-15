/**
 * @module Typography
 * @requires core
 */

import { Renderer } from '../core/p5.Renderer';

export const textCoreConstants = {
  IDEOGRAPHIC: 'ideographic',
  RIGHT_TO_LEFT: 'rtl',
  LEFT_TO_RIGHT: 'ltr',
  _CTX_MIDDLE: 'middle',
  _TEXT_BOUNDS: '_textBoundsSingle',
  _FONT_BOUNDS: '_fontBoundsSingle',
  HANGING: 'hanging',
  START: 'start',
  END: 'end',
}

function textCore(p5, fn) {
  const LeadingScale = 1.275;
  const DefaultFill = '#000000';
  const LinebreakRe = /\r?\n/g;
  const CommaDelimRe = /,\s+/;
  const QuotedRe = /^".*"$/;
  const TabsRe = /\t/g;

  const FontVariationSettings = 'fontVariationSettings';
  const VariableAxes = ['wght', 'wdth', 'ital', 'slnt', 'opsz'];
  const VariableAxesRe = new RegExp(`(?:${VariableAxes.join('|')})`);

  const textFunctions = [
    'text',
    'textAlign',
    'textAscent',
    'textDescent',
    'textLeading',
    'textMode',
    'textFont',
    'textSize',
    'textStyle',
    'textWidth',
    'textWrap',
    'textBounds',
    'textDirection',
    'textProperty',
    'textProperties',
    'fontBounds',
    'fontWidth',
    'fontAscent',
    'fontDescent',
    'textWeight'
  ];

  /**
   * Draws text to the canvas.
   *
   * The first parameter, `str`, is the text to be drawn. The second and third
   * parameters, `x` and `y`, set the coordinates of the text's bottom-left
   * corner. See <a href="#/p5/textAlign">textAlign()</a> for other ways to
   * align text.
   *
   * The fourth and fifth parameters, `maxWidth` and `maxHeight`, are optional.
   * They set the dimensions of the invisible rectangle containing the text. By
   * default, they set its  maximum width and height. See
   * <a href="#/p5/rectMode">rectMode()</a> for other ways to define the
   * rectangular text box. Text will wrap to fit within the text box. Text
   * outside of the box won't be drawn.
   *
   * Text can be styled a few ways. Call the <a href="#/p5/fill">fill()</a>
   * function to set the text's fill color. Call
   * <a href="#/p5/stroke">stroke()</a> and
   * <a href="#/p5/strokeWeight">strokeWeight()</a> to set the text's outline.
   * Call <a href="#/p5/textSize">textSize()</a> and
   * <a href="#/p5/textFont">textFont()</a> to set the text's size and font,
   * respectively.
   *
   * Note: `WEBGL` mode only supports fonts loaded with
   * <a href="#/p5/loadFont">loadFont()</a>. Calling
   * <a href="#/p5/stroke">stroke()</a> has no effect in `WEBGL` mode.
   *
   * @method text
   * @param {String|Object|Array|Number|Boolean} str text to be displayed.
   * @param {Number} x          x-coordinate of the text box.
   * @param {Number} y          y-coordinate of the text box.
   * @param {Number} [maxWidth] maximum width of the text box. See
   *                            <a href="#/p5/rectMode">rectMode()</a> for
   *                            other options.
   * @param {Number} [maxHeight] maximum height of the text box. See
   *                            <a href="#/p5/rectMode">rectMode()</a> for
   *                            other options.
   *
   * @for p5
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   text('hi', 50, 50);
   *
   *   describe('The text "hi" written in black in the middle of a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background('skyblue');
   *   textSize(100);
   *   text('🌈', 0, 100);
   *
   *   describe('A rainbow in a blue sky.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   textSize(32);
   *   fill(255);
   *   stroke(0);
   *   strokeWeight(4);
   *   text('hi', 50, 50);
   *
   *   describe('The text "hi" written in white with a black outline.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background('black');
   *   textSize(22);
   *   fill('yellow');
   *   text('rainbows', 6, 20);
   *   fill('cornflowerblue');
   *   text('rainbows', 6, 45);
   *   fill('tomato');
   *   text('rainbows', 6, 70);
   *   fill('limegreen');
   *   text('rainbows', 6, 95);
   *
   *   describe('The text "rainbows" written on several lines, each in a different color.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   let s = 'The quick brown fox jumps over the lazy dog.';
   *   text(s, 10, 10, 70, 80);
   *
   *   describe('The sample text "The quick brown fox..." written in black across several lines.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   rectMode(CENTER);
   *   let s = 'The quick brown fox jumps over the lazy dog.';
   *   text(s, 50, 50, 70, 80);
   *
   *   describe('The sample text "The quick brown fox..." written in black across several lines.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div modernizr='webgl'>
   * <code>
   * let font;
   *
   * async function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   font = await loadFont('assets/inconsolata.otf');
   *   textFont(font);
   *   textSize(32);
   *   textAlign(CENTER, CENTER);
   * }
   *
   * function draw() {
   *   background(200);
   *   rotateY(frameCount / 30);
   *   text('p5*js', 0, 0);
   *
   *   describe('The text "p5*js" written in white and spinning in 3D.');
   * }
   * </code>
   * </div>
   */

  /**
   * Sets the way text is aligned when <a href="#/p5/text">text()</a> is called.
   *
   * By default, calling `text('hi', 10, 20)` places the bottom-left corner of
   * the text's bounding box at (10, 20).
   *
   * The first parameter, `horizAlign`, changes the way
   * <a href="#/p5/text">text()</a> interprets x-coordinates. By default, the
   * x-coordinate sets the left edge of the bounding box. `textAlign()` accepts
   * the following values for `horizAlign`: `LEFT`, `CENTER`, or `RIGHT`.
   *
   * The second parameter, `vertAlign`, is optional. It changes the way
   * <a href="#/p5/text">text()</a> interprets y-coordinates. By default, the
   * y-coordinate sets the bottom edge of the bounding box. `textAlign()`
   * accepts the following values for `vertAlign`: `TOP`, `BOTTOM`, `CENTER`,
   * or `BASELINE`.
   *
   * @method textAlign
   * @for p5
   * @param {LEFT|CENTER|RIGHT} horizAlign horizontal alignment
   * @param {TOP|BOTTOM|CENTER|BASELINE} [vertAlign] vertical alignment
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw a vertical line.
   *   strokeWeight(0.5);
   *   line(50, 0, 50, 100);
   *
   *   // Top line.
   *   textSize(16);
   *   textAlign(RIGHT);
   *   text('ABCD', 50, 30);
   *
   *   // Middle line.
   *   textAlign(CENTER);
   *   text('EFGH', 50, 50);
   *
   *   // Bottom line.
   *   textAlign(LEFT);
   *   text('IJKL', 50, 70);
   *
   *   describe('The letters ABCD displayed at top-left, EFGH at center, and IJKL at bottom-right. A vertical line divides the canvas in half.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   strokeWeight(0.5);
   *
   *   // First line.
   *   line(0, 12, width, 12);
   *   textAlign(CENTER, TOP);
   *   text('TOP', 50, 12);
   *
   *   // Second line.
   *   line(0, 37, width, 37);
   *   textAlign(CENTER, CENTER);
   *   text('CENTER', 50, 37);
   *
   *   // Third line.
   *   line(0, 62, width, 62);
   *   textAlign(CENTER, BASELINE);
   *   text('BASELINE', 50, 62);
   *
   *   // Fourth line.
   *   line(0, 97, width, 97);
   *   textAlign(CENTER, BOTTOM);
   *   text('BOTTOM', 50, 97);
   *
   *   describe('The words "TOP", "CENTER", "BASELINE", and "BOTTOM" each drawn relative to a horizontal line. Their positions demonstrate different vertical alignments.');
   * }
   * </code>
   * </div>
   */

  /**
   * Returns the ascent of the text.
   *
   * The `textAscent()` function calculates the distance from the baseline to the
   * highest point of the current font. This value represents the ascent, which is essential
   * for determining the overall height of the text along with `textDescent()`. If
   * a text string is provided as an argument, the ascent is calculated based on that specific
   * string; otherwise, the ascent of the current font is returned.
   *
   * @method textAscent
   * @for p5
   *
   * @param {String} [txt] - (Optional) The text string for which to calculate the ascent.
   *                         If omitted, the function returns the ascent for the current font.
   * @returns {Number} The ascent value in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(400, 300);
   *   background(220);
   *
   *   textSize(48);
   *   textAlign(LEFT, BASELINE);
   *   textFont('Georgia');
   *
   *   let s = "Hello, p5.js!";
   *   let x = 50, y = 150;
   *
   *   fill(0);
   *   text(s, x, y);
   *
   *   // Get the ascent of the current font
   *   let asc = textAscent();
   *
   *   // Draw a red line at the baseline and a blue line at the ascent position
   *   stroke('red');
   *   line(x, y, x + 200, y); // Baseline
   *   stroke('blue');
   *   line(x, y - asc, x + 200, y - asc); // Ascent (top of text)
   *
   *   noStroke();
   *   fill(0);
   *   textSize(16);
   *   text("textAscent: " + asc.toFixed(2) + " pixels", x, y - asc - 10);
   * }
   * </code>
   * </div>
   *
   *
   * @example
   * <div>
   * <code>
   * let font;
   *
   * async function setup()  {
   *   font = await loadFont('assets/inconsolata.otf');
   *
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textFont(font);
   *
   *   // Different for each font.
   *   let fontScale = 0.8;
   *
   *   let baseY = 75;
   *   strokeWeight(0.5);
   *
   *   // Draw small text.
   *   textSize(24);
   *   text('dp', 0, baseY);
   *
   *   // Draw baseline and ascent.
   *   let a = textAscent() * fontScale;
   *   line(0, baseY, 23, baseY);
   *   line(23, baseY - a, 23, baseY);
   *
   *   // Draw large text.
   *   textSize(48);
   *   text('dp', 45, baseY);
   *
   *   // Draw baseline and ascent.
   *   a = textAscent() * fontScale;
   *   line(45, baseY, 91, baseY);
   *   line(91, baseY - a, 91, baseY);
   *
   *   describe('The letters "dp" written twice in different sizes. Each version has a horizontal baseline. A vertical line extends upward from each baseline to the top of the "d".');
   * }
   * </code>
   * </div>
   */


  /**
   * Returns the descent of the text.
   *
   * The `textDescent()` function calculates the distance from the baseline to the
   * lowest point of the current font. This value represents the descent, which, when combined
   * with the ascent (from `textAscent()`), determines the overall vertical span of the text.
   * If a text string is provided as an argument, the descent is calculated based on that specific string;
   * otherwise, the descent of the current font is returned.
   *
   * @method textDescent
   * @for p5
   *
   * @param {String} [txt] - (Optional) The text string for which to calculate the descent.
   *                         If omitted, the function returns the descent for the current font.
   * @returns {Number} The descent value in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(400, 300);
   *   background(220);
   *
   *   textSize(48);
   *   textAlign(LEFT, BASELINE);
   *   textFont('Georgia');
   *
   *   let s = "Hello, p5.js!";
   *   let x = 50, y = 150;
   *
   *   fill(0);
   *   text(s, x, y);
   *
   *   // Get the descent of the current font
   *   let desc = textDescent();
   *
   *   // Draw a red line at the baseline and a blue line at the bottom of the text
   *   stroke('red');
   *   line(x, y, x + 200, y); // Baseline
   *   stroke('blue');
   *   line(x, y + desc, x + 200, y + desc); // Descent (bottom of text)
   *
   *   noStroke();
   *   fill(0);
   *   textSize(16);
   *   text("textDescent: " + desc.toFixed(2) + " pixels", x, y + desc + 20);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * let font;
   *
   * async function setup()  {
   *   font = await loadFont('assets/inconsolata.otf');
   *
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the font.
   *   textFont(font);
   *
   *   // Different for each font.
   *   let fontScale = 0.9;
   *
   *   let baseY = 75;
   *   strokeWeight(0.5);
   *
   *   // Draw small text.
   *   textSize(24);
   *   text('dp', 0, baseY);
   *
   *   // Draw baseline and descent.
   *   let d = textDescent() * fontScale;
   *   line(0, baseY, 23, baseY);
   *   line(23, baseY, 23, baseY + d);
   *
   *   // Draw large text.
   *   textSize(48);
   *   text('dp', 45, baseY);
   *
   *   // Draw baseline and descent.
   *   d = textDescent() * fontScale;
   *   line(45, baseY, 91, baseY);
   *   line(91, baseY, 91, baseY + d);
   *
   *   describe('The letters "dp" written twice in different sizes. Each version has a horizontal baseline. A vertical line extends downward from each baseline to the bottom of the "p".');
   * }
   * </code>
   * </div>
   */

/**
 * Sets the spacing between lines of text when
 * <a href="#/p5/text">text()</a> is called.
 *
 * Note: Spacing is measured in pixels.
 *
 * Calling `textLeading()` without an argument returns the current spacing.
 *
 * @method textLeading
 * @for p5
 * @param {Number} leading The new text leading to apply, in pixels
 * @returns {Number} If no arguments are provided, the current text leading
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // "\n" starts a new line of text.
 *   let lines = 'one\ntwo';
 *
 *   // Left.
 *   text(lines, 10, 25);
 *
 *   // Right.
 *   textLeading(30);
 *   text(lines, 70, 25);
 *
 *   describe('The words "one" and "two" written on separate lines twice. The words on the left have less vertical spacing than the words on the right.');
 * }
 * </code>
 * </div>
 */
 /*
  * @method textLeading
  * @for p5
  */

  /**
   * Sets the font used by the <a href="#/p5/text">text()</a> function.
   *
   * The first parameter, `font`, sets the font. `textFont()` recognizes either
   * a <a href="#/p5.Font">p5.Font</a> object or a string with the name of a
   * system font. For example, `'Courier New'`.
   *
   * The second parameter, `size`, is optional. It sets the font size in pixels.
   * This has the same effect as calling <a href="#/p5/textSize">textSize()</a>.
   *
   * Note: `WEBGL` mode only supports fonts loaded with
   * <a href="#/p5/loadFont">loadFont()</a>.
   *
   * @method textFont
   * @param {p5.Font|String|Object} font The font to apply
   * @param {Number} [size] An optional text size to apply.
   * @for p5
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   textFont('Courier New');
   *   textSize(24);
   *   text('hi', 35, 55);
   *
   *   describe('The text "hi" written in a black, monospace font on a gray background.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background('black');
   *   fill('palegreen');
   *   textFont('Courier New', 10);
   *   text('You turn to the left and see a door. Do you enter?', 5, 5, 90, 90);
   *   text('>', 5, 70);
   *
   *   describe('A text prompt from a game is written in a green, monospace font on a black background.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   textFont('Verdana');
   *   let currentFont = textFont();
   *   text(currentFont, 25, 50);
   *
   *   describe('The text "Verdana" written in a black, sans-serif font on a gray background.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * let fontRegular;
   * let fontItalic;
   * let fontBold;
   *
   * async function setup() {
   *   createCanvas(100, 100);
   *   fontRegular = await loadFont('assets/Regular.otf');
   *   fontItalic = await loadFont('assets/Italic.ttf');
   *   fontBold = await loadFont('assets/Bold.ttf');
   *
   *   background(200);
   *   textFont(fontRegular);
   *   text('I am Normal', 10, 30);
   *   textFont(fontItalic);
   *   text('I am Italic', 10, 50);
   *   textFont(fontBold);
   *   text('I am Bold', 10, 70);
   *
   *   describe('The statements "I am Normal", "I am Italic", and "I am Bold" written in black on separate lines. The statements have normal, italic, and bold fonts, respectively.');
   * }
   * </code>
   * </div>
   */

  /**
   * Sets or gets the current text size.
   *
   * The `textSize()` function is used to specify the size of the text
   * that will be rendered on the canvas. When called with an argument, it sets the
   * text size to the specified value (which can be a number representing pixels or a
   * CSS-style string, e.g., '32px', '2em'). When called without an argument, it
   * returns the current text size in pixels.
   *
   * @method textSize
   * @for p5
   *
   * @param {Number} size - The size to set for the text.
   * @returns {Number} If no arguments are provided, the current text size in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(600, 200);
   *   background(240);
   *
   *   // Set the text size to 48 pixels
   *   textSize(48);
   *   textAlign(CENTER, CENTER);
   *   textFont("Georgia");
   *
   *   // Draw text using the current text size
   *   fill(0);
   *   text("Hello, p5.js!", width / 2, height / 2);
   *
   *   // Retrieve and display the current text size
   *   let currentSize = textSize();
   *   fill(50);
   *   textSize(16);
   *   text("Current text size: " + currentSize, width / 2, height - 20);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top.
   *   textSize(12);
   *   text('Font Size 12', 10, 30);
   *
   *   // Middle.
   *   textSize(14);
   *   text('Font Size 14', 10, 60);
   *
   *   // Bottom.
   *   textSize(16);
   *   text('Font Size 16', 10, 90);
   *
   *   describe('The text "Font Size 12" drawn small, "Font Size 14" drawn medium, and "Font Size 16" drawn large.');
   * }
   * </code>
   * </div>
   */
   /**
    * @method textSize
    * @for p5
    * @returns {Number} The current text size in pixels.
    */

  /**
   * Sets the style for system fonts when
   * <a href="#/p5/text">text()</a> is called.
   *
   * The parameter, `style`, can be either `NORMAL`, `ITALIC`, `BOLD`, or
   * `BOLDITALIC`.
   *
   * `textStyle()` may be overridden by CSS styling. This function doesn't
   * affect fonts loaded with <a href="#/p5/loadFont">loadFont()</a>.
   *
   * @method textStyle
   * @for p5
   * @param {NORMAL|ITALIC|BOLD|BOLDITALIC} style The style to use
   * @returns {NORMAL|ITALIC|BOLD|BOLDITALIC} If no arguments are provided, the current style
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(12);
   *   textAlign(CENTER);
   *
   *   // First row.
   *   textStyle(NORMAL);
   *   text('Normal', 50, 15);
   *
   *   // Second row.
   *   textStyle(ITALIC);
   *   text('Italic', 50, 40);
   *
   *   // Third row.
   *   textStyle(BOLD);
   *   text('Bold', 50, 65);
   *
   *   // Fourth row.
   *   textStyle(BOLDITALIC);
   *   text('Bold Italic', 50, 90);
   *
   *   describe('The words "Normal" displayed normally, "Italic" in italic, "Bold" in bold, and "Bold Italic" in bold italics.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method textStyle
   * @for p5
   * @returns {NORMAL|BOLD|ITALIC|BOLDITALIC}
   */


  /**
   * Calculates the width of the given text string in pixels.
   *
   * The `textWidth()` function processes the provided text string to determine its tight bounding box
   * based on the current text properties such as font, textSize, and textStyle. Internally, it splits
   * the text into individual lines (if line breaks are present) and computes the bounding box for each
   * line using the renderer’s measurement functions. The final width is determined as the maximum width
   * among all these lines.
   *
   * For example, if the text contains multiple lines due to wrapping or explicit line breaks, textWidth()
   * will return the width of the longest line.
   *
   * @method textWidth
   * @for p5
   * @param {String} text The text to measure
   * @returns {Number} The width of the text
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(200, 200);
   *   background(220);
   *
   *   // Set text size and alignment
   *   textSize(48);
   *   textAlign(LEFT, TOP);
   *
   *   let myText = "Hello";
   *
   *   // Calculate the width of the text
   *   let tw = textWidth(myText);
   *
   *   // Draw the text on the canvas
   *   fill(0);
   *   text(myText, 50, 50);
   *
   *   // Display the text width below
   *   noStroke();
   *   fill(0);
   *   textSize(20);
   *   text("Text width: " + tw, 10, 150);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(28);
   *   strokeWeight(0.5);
   *
   *   // Calculate the text width.
   *   let s = 'yoyo';
   *   let w = textWidth(s);
   *
   *   // Display the text.
   *   text(s, 22, 55);
   *
   *   // Underline the text.
   *   line(22, 55, 22 + w, 55);
   *
   *   describe('The word "yoyo" underlined.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(28);
   *   strokeWeight(0.5);
   *
   *   // Calculate the text width.
   *   // "\n" starts a new line.
   *   let s = 'yo\nyo';
   *   let w = textWidth(s);
   *
   *   // Display the text.
   *   text(s, 22, 55);
   *
   *   // Underline the text.
   *   line(22, 55, 22 + w, 55);
   *
   *   describe('The word "yo" written twice, one copy beneath the other. The words are divided by a horizontal line.');
   * }
   * </code>
   * </div>
   */

  /**
   * Sets the style for wrapping text when
   * <a href="#/p5/text">text()</a> is called.
   *
   * The parameter, `style`, can be one of the following values:
   *
   * `WORD` starts new lines of text at spaces. If a string of text doesn't
   * have spaces, it may overflow the text box and the canvas. This is the
   * default style.
   *
   * `CHAR` starts new lines as needed to stay within the text box.
   *
   * `textWrap()` only works when the maximum width is set for a text box. For
   * example, calling `text('Have a wonderful day', 0, 10, 100)` sets the
   * maximum width to 100 pixels.
   *
   * Calling `textWrap()` without an argument returns the current style.
   *
   * @method textWrap
   * @for p5
   *
   * @param {WORD|CHAR} style The wrapping style to use
   * @returns {CHAR|WORD} If no arguments are provided, the current wrapping style
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(20);
   *   textWrap(WORD);
   *
   *   // Display the text.
   *   text('Have a wonderful day', 0, 10, 100);
   *
   *   describe('The text "Have a wonderful day" written across three lines.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(20);
   *   textWrap(CHAR);
   *
   *   // Display the text.
   *   text('Have a wonderful day', 0, 10, 100);
   *
   *   describe('The text "Have a wonderful day" written across two lines.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textSize(20);
   *   textWrap(CHAR);
   *
   *   // Display the text.
   *   text('祝你有美好的一天', 0, 10, 100);
   *
   *   describe('The text "祝你有美好的一天" written across two lines.');
   * }
   * </code>
   * </div>
   */
   /**
    * @method textWrap
    * @for p5
    * @returns {CHAR|WORD} The current wrapping style
    */


  /**
   * Computes the tight bounding box for a block of text.
   *
   * The `textBounds()` function calculates the precise pixel boundaries that enclose
   * the rendered text based on the current text properties (such as font, textSize, textStyle, and
   * alignment). If the text spans multiple lines (due to line breaks or wrapping), the function
   * measures each line individually and then aggregates these measurements into a single bounding box.
   * The resulting object contains the x and y coordinates along with the width (w) and height (h)
   * of the text block.
   *
   * @method textBounds
   * @for p5
   *
   * @param {String} str - The text string to measure.
   * @param {Number} x - The x-coordinate where the text is drawn.
   * @param {Number} y - The y-coordinate where the text is drawn.
   * @param {Number} [width] - (Optional) The maximum width available for the text block.
   *                           When specified, the text may be wrapped to fit within this width.
   * @param {Number} [height] - (Optional) The maximum height available for the text block.
   *                            Any lines exceeding this height will be truncated.
   * @returns {Object} An object with properties `x`, `y`, `w`, and `h` that represent the tight
   *                   bounding box of the rendered text.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 200);
   *   background(220);
   *
   *   // Set up text properties for clarity
   *   textSize(32);
   *   textAlign(LEFT, TOP);
   *
   *   let txt = "Hello, World!";
   *   // Compute the bounding box for the text starting at (50, 50)
   *   let bounds = textBounds(txt, 50, 50);
   *
   *   // Draw the text
   *   fill(0);
   *   text(txt, 50, 50);
   *
   *   // Draw the computed bounding box in red to visualize the measured area
   *   noFill();
   *   stroke('red');
   *   rect(bounds.x, bounds.y, bounds.w, bounds.h);
   * }
   * </code>
   * </div>
   */


  /**
   * Sets or gets the text drawing direction.
   *
   * The <code>textDirection()</code> function allows you to specify the direction in which text is
   * rendered on the canvas. When provided with a <code>direction</code> parameter (such as "ltr" for
   * left-to-right, "rtl" for right-to-left, or "inherit"), it updates the renderer's state with that
   * value and applies the new setting. When called without any arguments, it returns the current text
   * direction. This function is particularly useful for rendering text in languages with different
   * writing directions.
   *
   * @method textDirection
   * @for p5
   *
   * @param {String} direction - The text direction to set ("ltr", "rtl", or "inherit").
   * @returns {String} If no arguments are provided, the current text direction, either "ltr", "rtl", or "inherit"
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 300);
   *   background(240);
   *
   *   textSize(32);
   *   textFont("Georgia");
   *   textAlign(LEFT, TOP);
   *
   *   // Set text direction to right-to-left and draw Arabic text.
   *   textDirection("rtl");
   *   fill(0);
   *   text("مرحبًا!", 50, 50);
   *
   *   // Set text direction to left-to-right and draw English text.
   *   textDirection("ltr");
   *   text("Hello, p5.js!", 50, 150);
   *
   *   // Display the current text direction.
   *   textSize(16);
   *   fill(50);
   *   textAlign(LEFT, TOP);
   *   text("Current textDirection: " + textDirection(), 50, 250);
   * }
   * </code>
   * </div>
   */
   /**
    * @method textDirection
    * @for p5
    * @returns {String} The current text direction, either "ltr", "rtl", or "inherit"
    */

  /**
   * Sets or gets a single text property for the renderer.
   *
   * The `textProperty()` function allows you to set or retrieve a single text-related property,
   * such as `textAlign`, `textBaseline`, `fontStyle`, or any other property
   * that may be part of the renderer's state, its drawing context, or the canvas style.
   *
   * When called with a `prop` and a `value`, the function sets the property by checking
   * for its existence in the renderer's state, the drawing context, or the canvas style. If the property is
   * successfully modified, the function applies the updated text properties. If called with only the
   * `prop` parameter, the function returns the current value of that property.
   *
   * @method textProperty
   * @for p5
   *
   * @param {String} prop - The name of the text property to set or get.
   * @param value - The value to set for the specified text property. If omitted, the current
   *                      value of the property is returned
   * @returns If no arguments are provided, the current value of the specified text property
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 300);
   *   background(240);
   *
   *   // Set the text alignment to CENTER and the baseline to TOP using textProperty.
   *   textProperty("textAlign", CENTER);
   *   textProperty("textBaseline", TOP);
   *
   *   // Set additional text properties and draw the text.
   *   textSize(32);
   *   textFont("Georgia");
   *   fill(0);
   *   text("Hello, World!", width / 2, 50);
   *
   *   // Retrieve and display the current text properties.
   *   let currentAlign = textProperty("textAlign");
   *   let currentBaseline = textProperty("textBaseline");
   *
   *   textSize(16);
   *   textAlign(LEFT, TOP);
   *   fill(50);
   *   text("Current textAlign: " + currentAlign, 50, 150);
   *   text("Current textBaseline: " + currentBaseline, 50, 170);
   * }
   * </code>
   * </div>
   */
   /**
    * @method textProperty
    * @for p5
    * @param {String} prop - The name of the text property to set or get.
    * @returns The current value of the specified text property
    */

  /**
   * Gets or sets text properties in batch, similar to calling `textProperty()`
   * multiple times.
   *
   * If an object is passed in, `textProperty(key, value)` will be called for you
   * on every key/value pair in the object.
   *
   * If no arguments are passed in, an object will be returned with all the current
   * properties.
   *
   * @method textProperties
   * @for p5
   * @param {Object} properties An object whose keys are properties to set, and whose
   *                            values are what they should be set to.
   */
  /**
   * @method textProperties
   * @for p5
   * @returns {Object} An object with all the possible properties and their current values.
   */

  /**
   * Computes a generic (non-tight) bounding box for a block of text.
   *
   * The `fontBounds()` function calculates the bounding box for the text based on the
   * font's intrinsic metrics (such as `fontBoundingBoxAscent` and
   * `fontBoundingBoxDescent`). Unlike `textBounds()`, which measures the exact
   * pixel boundaries of the rendered text, `fontBounds()` provides a looser measurement
   * derived from the font’s default spacing. This measurement is useful for layout purposes where
   * a consistent approximation of the text's dimensions is desired.
   *
   * @method fontBounds
   * @for p5
   *
   * @param {String} str - The text string to measure.
   * @param {Number} x - The x-coordinate where the text is drawn.
   * @param {Number} y - The y-coordinate where the text is drawn.
   * @param {Number} [width] - (Optional) The maximum width available for the text block.
   *                           When specified, the text may be wrapped to fit within this width.
   * @param {Number} [height] - (Optional) The maximum height available for the text block.
   *                            Any lines exceeding this height will be truncated.
   * @returns {Object} An object with properties `x`, `y`, `w`, and `h` representing the loose
   *                   bounding box of the text based on the font's intrinsic metrics.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 200);
   *   background(240);
   *
   *   textSize(32);
   *   textAlign(LEFT, TOP);
   *   textFont('Georgia');
   *
   *   let txt = "Hello, World!";
   *   // Compute the bounding box based on the font's intrinsic metrics
   *   let bounds = fontBounds(txt, 50, 50);
   *
   *   fill(0);
   *   text(txt, 50, 50);
   *
   *   noFill();
   *   stroke('green');
   *   rect(bounds.x, bounds.y, bounds.w, bounds.h);
   *
   *   noStroke();
   *   fill(50);
   *   textSize(15);
   *   text("Font Bounds: x=" + bounds.x.toFixed(1) + ", y=" + bounds.y.toFixed(1) +
   *        ", w=" + bounds.w.toFixed(1) + ", h=" + bounds.h.toFixed(1), 8, 100);
   * }
   * </code>
   * </div>
   */


  /**
   * Returns the loose width of a text string based on the current font.
   *
   * The `fontWidth()` function measures the width of the provided text string using
   * the font's default measurement (i.e., the width property from the text metrics returned by
   * the browser). Unlike `textWidth()`, which calculates the tight pixel boundaries
   * of the text glyphs, `fontWidth()` uses the font's intrinsic spacing, which may include
   * additional space for character spacing and kerning. This makes it useful for scenarios where
   * an approximate width is sufficient for layout and positioning.
   *
   * @method fontWidth
   * @for p5
   *
   * @param {String} theText - The text string to measure.
   * @returns {Number} The loose width of the text in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 200);
   *   background(240);
   *
   *   textSize(32);
   *   textAlign(LEFT, TOP);
   *   textFont('Georgia');
   *
   *   let s = "Hello, World!";
   *   let fw = fontWidth(s);
   *
   *   fill(0);
   *   text(s, 50, 50);
   *
   *   stroke('blue');
   *   line(50, 90, 50 + fw, 90);
   *
   *   noStroke();
   *   fill(50);
   *   textSize(16);
   *   text("Font width: " + fw.toFixed(2) + " pixels", 50, 100);
   * }
   * </code>
   * </div>
   */


  /**
   * Returns the loose ascent of the text based on the font's intrinsic metrics.
   *
   * The `fontAscent()` function calculates the ascent of the text using the font's
   * intrinsic metrics (e.g., `fontBoundingBoxAscent`). This value represents the space
   * above the baseline that the font inherently occupies, and is useful for layout purposes when
   * an approximate vertical measurement is required.
   *
   * @method fontAscent
   * @for p5
   *
   * @returns {Number} The loose ascent value in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 300);
   *   background(220);
   *
   *   textSize(48);
   *   textAlign(LEFT, BASELINE);
   *   textFont('Georgia');
   *
   *   let s = "Hello, p5.js!";
   *   let x = 50, y = 150;
   *
   *   fill(0);
   *   text(s, x, y);
   *
   *   // Get the font descent of the current font
   *   let fasc = fontAscent();
   *
   *   // Draw a red line at the baseline and a blue line at the ascent position
   *   stroke('red');
   *   line(x, y, x + 200, y); // Baseline
   *   stroke('blue');
   *   line(x, y - fasc, x + 200, y - fasc); // Font ascent position
   *
   *   noStroke();
   *   fill(0);
   *   textSize(16);
   *   text("fontAscent: " + fasc.toFixed(2) + " pixels", x, y + fdesc + 20);
   * }
   * </code>
   * </div>
   */

  /**
   * Returns the loose descent of the text based on the font's intrinsic metrics.
   *
   * The `fontDescent()` function calculates the descent of the text using the font's
   * intrinsic metrics (e.g., `fontBoundingBoxDescent`). This value represents the space
   * below the baseline that the font inherently occupies, and is useful for layout purposes when
   * an approximate vertical measurement is required.
   *
   * @method fontDescent
   * @for p5
   *
   * @returns {Number} The loose descent value in pixels.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 300);
   *   background(220);
   *
   *   textSize(48);
   *   textAlign(LEFT, BASELINE);
   *   textFont('Georgia');
   *
   *   let s = "Hello, p5.js!";
   *   let x = 50, y = 150;
   *
   *   fill(0);
   *   text(s, x, y);
   *
   *   // Get the font descent of the current font
   *   let fdesc = fontDescent();
   *
   *   // Draw a red line at the baseline and a blue line at the descent position
   *   stroke('red');
   *   line(x, y, x + 200, y); // Baseline
   *   stroke('blue');
   *   line(x, y + fdesc, x + 200, y + fdesc); // Font descent position
   *
   *   noStroke();
   *   fill(0);
   *   textSize(16);
   *   text("fontDescent: " + fdesc.toFixed(2) + " pixels", x, y + fdesc + 20);
   * }
   * </code>
   * </div>
   */

  /**
   *
   * Sets or gets the current font weight.
   *
   * The <code>textWeight()</code> function is used to specify the weight (thickness) of the text.
   * When a numeric value is provided, it sets the font weight to that value and updates the
   * rendering properties accordingly (including the "font-variation-settings" on the canvas style).
   * When called without an argument, it returns the current font weight setting.
   *
   * @method textWeight
   * @for p5
   *
   * @param {Number} weight - The numeric weight value to set for the text.
   * @returns {Number} If no arguments are provided, the current font weight
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(300, 200);
   *   background(240);
   *
   *   // Set text alignment, size, and font
   *   textAlign(LEFT, TOP);
   *   textSize(20);
   *   textFont("Georgia");
   *
   *   // Draw text with a normal weight (lighter appearance)
   *   push();
   *   textWeight(400);  // Set font weight to 400
   *   fill(0);
   *   text("Normal", 50, 50);
   *   let normalWeight = textWeight();  // Should return 400
   *   pop();
   *
   *   // Draw text with a bold weight (heavier appearance)
   *   push();
   *   textWeight(900);  // Set font weight to 900
   *   fill(0);
   *   text("Bold", 50, 100);
   *   let boldWeight = textWeight();  // Should return 900
   *   pop();
   *
   *   // Display the current font weight values on the canvas
   *   textSize(16);
   *   fill(50);
   *   text("Normal Weight: " + normalWeight, 150, 52);
   *   text("Bold Weight: " + boldWeight, 150, 100);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let font;
   *
   * async function setup() {
   *   createCanvas(100, 100);
   *   font = await loadFont(
   *     'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'
   *   );
   * }
   *
   * function draw() {
   *   background(255);
   *   textFont(font);
   *   textAlign(LEFT, TOP);
   *   textSize(35);
   *   textWeight(sin(millis() * 0.002) * 200 + 400);
   *   text('p5*js', 0, 10);
   *   describe('The text p5*js pulsing its weight over time');
   * }
   * </code>
   * </div>
   */
  /**
   * @method textWeight
   * @for p5
   * @returns {Number} The current font weight
   */

  // attach each text func to p5, delegating to the renderer
  textFunctions.forEach(func => {
    fn[func] = function (...args) {
      if (!(func in Renderer.prototype)) {
        throw Error(`Renderer2D.prototype.${func} is not defined.`);
      }
      return this._renderer[func](...args);
    };
    // attach also to p5.Graphics.prototype
    p5.Graphics.prototype[func] = function (...args) {
      return this._renderer[func](...args);
    };
  });

  const RendererTextProps = {
    textAlign: { default: fn.LEFT, type: 'Context2d' },
    textBaseline: { default: fn.BASELINE, type: 'Context2d' },
    textFont: { default: { family: 'sans-serif' } },
    textLeading: { default: 15 },
    textSize: { default: 12 },
    textWrap: { default: fn.WORD },
    fontStretch: { default: fn.NORMAL, isShorthand: true },  // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded }
    fontWeight: { default: fn.NORMAL, isShorthand: true },   // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded }
    lineHeight: { default: fn.NORMAL, isShorthand: true },   // line-height: { default:  normal | number | length | percentage }
    fontVariant: { default: fn.NORMAL, isShorthand: true },  // font-variant: { default:  normal | small-caps }
    fontStyle: { default: fn.NORMAL, isShorthand: true },    // font-style: { default:  normal | italic | oblique } [was 'textStyle' in v1]
    direction: { default: 'inherit' }, // direction: { default: inherit | ltr | rtl }
  };

  // note: font must be first here otherwise it may reset other properties
  const ContextTextProps = ['font', 'direction', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'letterSpacing', 'textAlign', 'textBaseline', 'textRendering', 'wordSpacing'];

  // shorthand font properties that can be set with context2d.font
  const ShorthandFontProps = Object.keys(RendererTextProps).filter(p => RendererTextProps[p].isShorthand);

  // allowable values for font-stretch property for context2d.font
  const FontStretchKeys = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];

  let contextQueue, cachedDiv; // lazy

  ////////////////////////////// start API ///////////////////////////////

  Renderer.prototype.text = function (str, x, y, width, height) {

    let setBaseline = this.textDrawingContext().textBaseline; // store baseline

    // adjust {x,y,w,h} properties based on rectMode
    ({ x, y, width, height } = this._handleRectMode(x, y, width, height));

    // parse the lines according to width, height & linebreaks
    let lines = this._processLines(str, width, height);

    // add the adjusted positions [x,y] to each line
    lines = this._positionLines(x, y, width, height, lines);

    // render each line at the adjusted position
    lines.forEach(line => this._renderText(line.text, line.x, line.y));

    this.textDrawingContext().textBaseline = setBaseline; // restore baseline
  };

  /**
   * Computes the precise (tight) bounding box for a block of text
   * @param {String} str - the text to measure
   * @param {Number} x - the x-coordinate of the text
   * @param {Number} y - the y-coordinate of the text
   * @param {Number} width - the max width of the text block
   * @param {Number} height - the max height of the text block
   * @returns - a bounding box object for the text block: {x,y,w,h}
   * @private
   */
  Renderer.prototype.textBounds = function (str, x, y, width, height) {
    // delegate to _textBoundsSingle for measuring
    return this._computeBounds(textCoreConstants._TEXT_BOUNDS, str, x, y, width, height).bounds;
  };

  /**
   * Computes a generic (non-tight) bounding box for a block of text
   * @param {String} str - the text to measure
   * @param {Number} x - the x-coordinate of the text
   * @param {Number} y - the y-coordinate of the text
   * @param {Number} width - the max width of the text block
   * @param {Number} height - the max height of the text block
   * @returns - a bounding box object for the text block: {x,y,w,h}
   * @private
   */
  Renderer.prototype.fontBounds = function (str, x, y, width, height) {
    // delegate to _fontBoundsSingle for measuring
    return this._computeBounds(textCoreConstants._FONT_BOUNDS, str, x, y, width, height).bounds;
  };

  /**
   * Get the width of a text string in pixels (tight bounds)
   * @param {String} theText
   * @returns - the width of the text in pixels
   * @private
   */
  Renderer.prototype.textWidth = function (theText) {
    let lines = this._processLines(theText);
    // return the max width of the lines (using tight bounds)
    return Math.max(...lines.map(l => this._textWidthSingle(l)));
  };

  /**
   * Get the width of a text string in pixels (loose bounds)
   * @param {String} theText
   * @returns - the width of the text in pixels
   * @private
   */
  Renderer.prototype.fontWidth = function (theText) {
    // return the max width of the lines (using loose bounds)
    let lines = this._processLines(theText);
    return Math.max(...lines.map(l => this._fontWidthSingle(l)));
  };

  /**
   * @param {*} txt - optional text to measure, if provided will be
   * used to compute the ascent, otherwise the font's ascent will be used
   * @returns - the ascent of the text
   * @private
   */
  Renderer.prototype.textAscent = function (txt = '') {
    if (!txt.length) return this.fontAscent();
    return this.textDrawingContext().measureText(txt).actualBoundingBoxAscent;
  };

  /**
   * @returns - returns the ascent for the current font
   * @private
   */
  Renderer.prototype.fontAscent = function () {
    return this.textDrawingContext().measureText('_').fontBoundingBoxAscent;
  };

  /**
   * @param {*} txt - optional text to measure, if provided will
   * be used to compute the descent, otherwise the font's descent will be used
   * @returns - the descent of the text
   * @private
   */
  Renderer.prototype.textDescent = function (txt = '') {
    if (!txt.length) return this.fontDescent();
    return this.textDrawingContext().measureText(txt).actualBoundingBoxDescent;
  };

  Renderer.prototype.fontDescent = function () {
    return this.textDrawingContext().measureText('_').fontBoundingBoxDescent;
  };


  // setters/getters for text properties //////////////////////////

  Renderer.prototype.textAlign = function (h, v) {

    // the setter
    if (typeof h !== 'undefined') {
      this.states.setValue('textAlign', h);
      if (typeof v !== 'undefined') {
        if (v === fn.CENTER) {
          v = textCoreConstants._CTX_MIDDLE;
        }
        this.states.setValue('textBaseline', v);
      }
      return this._applyTextProperties();
    }
    // the getter
    return {
      horizontal: this.states.textAlign,
      vertical: this.states.textBaseline
    };
  };

  Renderer.prototype._currentTextFont = function () {
    return this.states.textFont.font || this.states.textFont.family;
  }

  /**
   * Set the font and [size] and [options] for rendering text
   * @param {p5.Font | string} font - the font to use for rendering text
   * @param {Number} size - the size of the text, can be a number or a css-style string
   * @param {Object} options - additional options for rendering text, see FontProps
   * @private
   */
  Renderer.prototype.textFont = function (font, size, options) {

    if (arguments.length === 0) {
      return this._currentTextFont();
    }

    let family = font;

    // do we have a custon loaded font ?
    if (font instanceof p5.Font) {
      family = font.face.family;
    }
    else if (font.data instanceof Uint8Array) {
      family = font.name.fontFamily;
      if (font.name?.fontSubfamily) {
        family += '-' + font.name.fontSubfamily;
      }
    }
    else if (typeof font === 'string') {
      // direct set the font-string if it contains size
      if (typeof size === 'undefined' && /[.0-9]+(%|em|p[xt])/.test(family)) {
        //console.log('direct set font-string: ', family);
        ({ family, size } = this._directSetFontString(family));
      }
    }

    if (typeof family !== 'string') throw Error('null font in textFont()');

    // handle two-arg case: textFont(font, options)
    if (arguments.length === 2 && typeof size === 'object') {
      options = size;
      size = undefined;
    }

    // update font properties in this.states
    this.states.setValue('textFont', { font, family, size });

    // convert/update the size in this.states
    if (typeof size !== 'undefined') {
      this._setTextSize(size);
    }

    // apply any options to this.states
    if (typeof options === 'object') {
      this.textProperties(options);
    }

    return this._applyTextProperties();
  }

  Renderer.prototype._directSetFontString = function (font, debug = 0) {
    if (debug) console.log('_directSetFontString"' + font + '"');

    let defaults = ShorthandFontProps.reduce((props, p) => {
      props[p] = RendererTextProps[p].default;
      return props;
    }, {});

    let el = this._cachedDiv(defaults);
    el.style.font = font;
    let style = getComputedStyle(el);
    ShorthandFontProps.forEach(prop => {
      this.states[prop] = style[prop];
      if (debug) console.log('  this.states.' + prop + '="' + style[prop] + '"');
    });

    return { family: style.fontFamily, size: style.fontSize };
  }

  Renderer.prototype.textLeading = function (leading) {
    // the setter
    if (typeof leading === 'number') {
      this.states.setValue('leadingSet', true);
      this.states.setValue('textLeading', leading);
      return this._applyTextProperties();
    }
    // the getter
    return this.states.textLeading;
  }

  Renderer.prototype.textWeight = function (weight) {
    // the setter
    if (typeof weight === 'number') {
      this.states.setValue('fontWeight', weight);
      this._applyTextProperties();

      // Safari works without weight set in the canvas style attribute, and actually
      // has buggy behavior if it is present, using the wrong weight when drawing
      // multiple times with different weights
      if (!p5.prototype._isSafari()) {
        this._setCanvasStyleProperty('font-variation-settings', `"wght" ${weight}`);
      }
      return;
    }
    // the getter
    return this.states.fontWeight;
  }

  /**
   * @param {*} size - the size of the text, can be a number or a css-style string
   * @private
   */
  Renderer.prototype.textSize = function (size) {

    // the setter
    if (typeof size !== 'undefined') {
      this._setTextSize(size);
      return this._applyTextProperties();
    }
    // the getter
    return this.states.textSize;
  }

  Renderer.prototype.textStyle = function (style) {

    // the setter
    if (typeof style !== 'undefined') {
      this.states.setValue('fontStyle', style);
      return this._applyTextProperties();
    }
    // the getter
    return this.states.fontStyle;
  }

  Renderer.prototype.textWrap = function (wrapStyle) {

    if (wrapStyle === fn.WORD || wrapStyle === fn.CHAR) {
      this.states.setValue('textWrap', wrapStyle);
      // no need to apply text properties here as not a context property
      return this._pInst;
    }
    return this.states.textWrap;
  };

  Renderer.prototype.textDirection = function (direction) {

    if (typeof direction !== 'undefined') {
      this.states.setValue('direction', direction);
      return this._applyTextProperties();
    }
    return this.states.direction;
  };

  /**
   * Sets/gets a single text property for the renderer (eg. fontStyle, fontStretch, etc.)
   * The property to be set can be a mapped or unmapped property on `this.states` or a property
   * on `this.textDrawingContext()` or on `this.canvas.style`
   * The property to get can exist in `this.states` or `this.textDrawingContext()` or `this.canvas.style`
   * @private
   */
  Renderer.prototype.textProperty = function (prop, value, opts) {

    let modified = false, debug = opts?.debug || false;

    // getter: return option from this.states or this.textDrawingContext()
    if (typeof value === 'undefined') {
      let props = this.textProperties();
      if (prop in props) return props[prop];
      throw Error('Unknown text option "' + prop + '"'); // FES?
    }

    // set the option in this.states if it exists
    if (prop in this.states && this.states[prop] !== value) {
      this.states[prop] = value;
      modified = true;
      if (debug) {
        console.log('this.states.' + prop + '="' + options[prop] + '"');
      }
    }
    // does it exist in CanvasRenderingContext2D ?
    else if (prop in this.textDrawingContext()) {
      this._setContextProperty(prop, value, debug);
      modified = true;
    }
    // does it exist in the canvas.style ?
    else if (prop in this.textCanvas().style) {
      this._setCanvasStyleProperty(prop, value, debug);
      modified = true;
    }
    else {
      console.warn('Ignoring unknown text option: "' + prop + '"\n'); // FES?
    }

    return modified ? this._applyTextProperties() : this._pInst;
  };

  /**
   * Batch set/get text properties for the renderer.
   * The properties can be either on `states` or `drawingContext`
   * @private
   */
  Renderer.prototype.textProperties = function (properties) {

    // setter
    if (typeof properties !== 'undefined') {
      Object.keys(properties).forEach(opt => {
        this.textProperty(opt, properties[opt]);
      });
      return this._pInst;
    }

    // getter: get props from drawingContext
    let context = this.textDrawingContext();
    properties = ContextTextProps.reduce((props, p) => {
      props[p] = context[p];
      return props;
    }, {});

    // add renderer props
    Object.keys(RendererTextProps).forEach(p => {
      if (RendererTextProps[p]?.type === 'Context2d') {
        properties[p] = context[p];
      }
      else { // a renderer.states property
        if (p === 'textFont') {
          // avoid circular ref. inside textFont
          let current = this._currentTextFont();
          if (typeof current === 'object' && '_pInst' in current) {
            current = Object.assign({}, current);
            delete current._pInst;
          }
          properties[p] = current;
        }
        else {
          properties[p] = this.states[p];
        }
      }
    });

    return properties;
  };

  Renderer.prototype.textMode = function () { /* no-op for processing api */ };

  /////////////////////////////// end API ////////////////////////////////

  Renderer.prototype._currentTextFont = function () {
    return this.states.textFont.font || this.states.textFont.family;
  }

  /*
    Compute the bounds for a block of text based on the specified
    measure function, either _textBoundsSingle or _fontBoundsSingle
   * @private
  */
  Renderer.prototype._computeBounds = function (type, str, x, y, width, height, opts) {

    let context = this.textDrawingContext();
    let setBaseline = context.textBaseline;
    let { textLeading, textAlign } = this.states;

    // adjust width, height based on current rectMode
    ({ width, height } = this._rectModeAdjust(x, y, width, height));

    // parse the lines according to the width & linebreaks
    let lines = this._processLines(str, width, height);

    // get the adjusted positions [x,y] for each line
    let boxes = lines.map((line, i) => this[type].bind(this)
      (line, x, y + i * textLeading));

    // adjust the bounding boxes based on horiz. text alignment
    if (lines.length > 1) {
      // Call the 2D mode version: the WebGL mode version does additional
      // alignment adjustments to account for how WebGL renders text.
      boxes.forEach(bb => bb.x += p5.Renderer2D.prototype._xAlignOffset.call(this, textAlign, width));
    }

    // adjust the bounding boxes based on vert. text alignment
    if (typeof height !== 'undefined') {
      // Call the 2D mode version: the WebGL mode version does additional
      // alignment adjustments to account for how WebGL renders text.
      p5.Renderer2D.prototype._yAlignOffset.call(this, boxes, height);
    }

    // get the bounds for the text block
    let bounds = boxes[0];
    if (lines.length > 1) {

      // get the bounds for the multi-line text block
      bounds = this._aggregateBounds(boxes);

      // align the multi-line bounds
      if (!opts?.ignoreRectMode) {
        this._rectModeAlign(bounds, width || 0, height || 0);
      }
    }

    if (0 && opts?.ignoreRectMode) boxes.forEach((b, i) => { // draw bounds for debugging
      let ss = context.strokeStyle;
      context.strokeStyle = 'green';
      context.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
      context.strokeStyle = ss;
    });

    context.textBaseline = setBaseline; // restore baseline

    return { bounds, lines };
  };

  /*
    Adjust width, height of bounds based on current rectMode
   * @private
  */
  Renderer.prototype._rectModeAdjust = function (x, y, width, height) {

    if (typeof width !== 'undefined') {
      switch (this.states.rectMode) {
        case fn.CENTER:
          break;
        case fn.CORNERS:
          width -= x;
          height -= y;
          break;
        case fn.RADIUS:
          width *= 2;
          height *= 2;
          break;
      }
    }
    return { x, y, width, height };
  }

  /*
    Attempts to set a property directly on the canvas.style object
   * @private
  */
  Renderer.prototype._setCanvasStyleProperty = function (opt, val, debug) {

    let value = val.toString(); // ensure its a string

    if (debug) console.log('canvas.style.' + opt + '="' + value + '"');

    // handle variable fonts options
    if (opt === FontVariationSettings) {
      this._handleFontVariationSettings(value);
    }

    // lets try to set it on the canvas style
    this.textCanvas().style[opt] = value;

    // check if the value was set successfully
    if (this.textCanvas().style[opt] !== value) {

      // fails on precision for floating points, also quotes and spaces

      if (0) console.warn(`Unable to set '${opt}' property` // FES?
        + ' on canvas.style. It may not be supported. Expected "'
        + value + '" but got: "' + this.textCanvas().style[opt] + "'");
    }
  };

  /*
    Parses the fontVariationSettings string and sets the font properties, only font-weight
    working consistently across browsers at present
   * @private
  */
  Renderer.prototype._handleFontVariationSettings = function (value, debug = false) {
    // check if the value is a string or an object
    if (typeof value === 'object') {
      value = Object.keys(value).map(k => k + ' ' + value[k]).join(', ');
    }
    let values = value.split(CommaDelimRe);
    values.forEach(v => {
      v = v.replace(/["']/g, ''); // remove quotes
      let matches = VariableAxesRe.exec(v);
      //console.log('matches: ', matches);
      if (matches && matches.length) {
        let axis = matches[0];
        // get the value to 3 digits of precision with no trailing zeros
        let val = parseFloat(parseFloat(v.replace(axis, '').trim()).toFixed(3));
        switch (axis) {
          case 'wght':
            if (debug) console.log('setting font-weight=' + val);
            // manually set the font-weight via the font string
            if (this.states.fontWeight !== val) this.textWeight(val);
            return val;
          case 'wdth':
            if (0) { // attempt to map font-stretch to allowed keywords
              const FontStretchMap = {
                "ultra-condensed": 50,
                "extra-condensed": 62.5,
                "condensed": 75,
                "semi-condensed": 87.5,
                "normal": 100,
                "semi-expanded": 112.5,
                "expanded": 125,
                "extra-expanded": 150,
                "ultra-expanded": 200,
              };
              let values = Object.values(FontStretchMap);
              const indexArr = values.map(function (k) { return Math.abs(k - val) })
              const min = Math.min.apply(Math, indexArr)
              let idx = indexArr.indexOf(min);
              let stretch = Object.keys(FontStretchMap)[idx];
              this.states.setValue('fontStretch', stretch);
            }
            break;
          case 'ital':
            if (debug) console.log('setting font-style=' + (val ? 'italic' : 'normal'));
            break;
          case 'slnt':
            if (debug) console.log('setting font-style=' + (val ? 'oblique' : 'normal'));
            break;
          case 'opsz':
            if (debug) console.log('setting font-optical-size=' + val);
            break;
        }
      }
    });
  };




  /*
    For properties not directly managed by the renderer in this.states
      we check if it has a mapping to a property in this.states
    Otherwise, add the property to the context-queue for later application
  */
  Renderer.prototype._setContextProperty = function (prop, val, debug = false) {

    // check if the value is actually different, else short-circuit
    if (this.textDrawingContext()[prop] === val) {
      return this._pInst;
    }

    // otherwise, we will set the property directly on the `this.textDrawingContext()`
    // by adding [property, value] to context-queue for later application
    (contextQueue ??= []).push([prop, val]);

    if (debug) console.log('queued context2d.' + prop + '="' + val + '"');
  };

  /*
     Adjust parameters (x,y,w,h) based on current rectMode
  */
  Renderer.prototype._handleRectMode = function (x, y, width, height) {

    let rectMode = this.states.rectMode;

    if (typeof width !== 'undefined') {
      switch (rectMode) {
        case fn.RADIUS:
          width *= 2;
          x -= width / 2;
          if (typeof height !== 'undefined') {
            height *= 2;
            y -= height / 2;
          }
          break;
        case fn.CENTER:
          x -= width / 2;
          if (typeof height !== 'undefined') {
            y -= height / 2;
          }
          break;
        case fn.CORNERS:
          width -= x;
          if (typeof height !== 'undefined') {
            height -= y;
          }
          break;
      }
    }
    return { x, y, width, height };
  };

  /*
    Get the computed font-size in pixels for a given size string
    @param {String} size - the font-size string to compute
    @returns {number} - the computed font-size in pixels
   * @private
   */
  Renderer.prototype._fontSizePx = function (theSize, { family } = this.states.textFont) {

    const isNumString = (num) => !isNaN(num) && num.trim() !== '';

    // check for a number in a string, eg '12'
    if (isNumString(theSize)) {
      return parseFloat(theSize);
    }
    let ele = this._cachedDiv({ fontSize: theSize });
    ele.style.fontSize = theSize;
    ele.style.fontFamily = family;
    let fontSizeStr = getComputedStyle(ele).fontSize;
    let fontSize = parseFloat(fontSizeStr);
    if (typeof fontSize !== 'number') {
      throw Error('textSize: invalid font-size');
    }
    return fontSize;
  };

  Renderer.prototype._cachedDiv = function (props) {
    if (typeof cachedDiv === 'undefined') {
      let ele = document.createElement('div');
      ele.ariaHidden = 'true';
      ele.style.display = 'none';
      Object.entries(props).forEach(([prop, val]) => {
        ele.style[prop] = val;
      });
      this.textCanvas().appendChild(ele);
      cachedDiv = ele;
    }
    return cachedDiv;
  }


  /*
    Aggregate the bounding boxes of multiple lines of text
    @param {Array} bboxes - the bounding boxes to aggregate
    @returns {object} - the aggregated bounding box
   * @private
  */
  Renderer.prototype._aggregateBounds = function (bboxes) {
    // loop over the bounding boxes to get the min/max x/y values
    let minX = Math.min(...bboxes.map(b => b.x));
    let minY = Math.min(...bboxes.map(b => b.y));
    let maxY = Math.max(...bboxes.map(b => b.y + b.h));
    let maxX = Math.max(...bboxes.map(b => b.x + b.w));
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  };

  // Renderer.prototype._aggregateBounds = function (tx, ty, bboxes) {
  //   let x = Math.min(...bboxes.map(b => b.x));
  //   let y = Math.min(...bboxes.map(b => b.y));
  //   // the width is the max of the x-offset + the box width
  //   let w = Math.max(...bboxes.map(b => (b.x - tx) + b.w));
  //   let h = bboxes[bboxes.length - 1].y - bboxes[0].y + bboxes[bboxes.length - 1].h;


  //   return { x, y, w, h };
  // };

  /*
    Process the text string to handle line-breaks and text wrapping
    @param {String} str - the text to process
    @param {Number} width - the width to wrap the text to
    @returns {array} - the processed lines of text
   * @private
  */
  Renderer.prototype._processLines = function (str, width, height) {

    if (typeof width !== 'undefined') { // only for text with bounds
      let drawingContext = this.textDrawingContext();
      if (drawingContext.textBaseline === fn.BASELINE) {
        this.drawingContext.textBaseline = fn.TOP;
      }
    }

    let lines = this._splitOnBreaks(str.toString());
    let hasLineBreaks = lines.length > 1;
    let hasWidth = typeof width !== 'undefined';
    let exceedsWidth = hasWidth && lines.some(l => this._textWidthSingle(l) > width);
    let { textLeading: leading, textWrap } = this.states;

    //if (!hasLineBreaks && !exceedsWidth) return lines; // a single-line
    if (hasLineBreaks || exceedsWidth) {
      if (hasWidth) lines = this._lineate(textWrap, lines, width);
    }

    // handle height truncation
    if (hasWidth && typeof height !== 'undefined') {

      if (typeof leading === 'undefined') {
        throw Error('leading is required if height is specified');
      }

      // truncate lines that exceed the height
      for (let i = 0; i < lines.length; i++) {
        let lh = leading * (i + 1);
        if (lh > height) {
          //console.log('TRUNCATING: ', i, '-', lines.length, '"' + lines.slice(i) + '"');
          lines = lines.slice(0, i);
          break;
        }
      }
    }

    return lines;
  };

  /*
    Get the x-offset for text given the width and textAlign property
  */
  Renderer.prototype._xAlignOffset = function (textAlign, width) {
    switch (textAlign) {
      case fn.LEFT:
        return 0;
      case fn.CENTER:
        return width / 2;
      case fn.RIGHT:
        return width;
      case textCoreConstants.START:
        return 0;
      case textCoreConstants.END:
        throw new Error('textBounds: END not yet supported for textAlign');
      default:
        return 0;
    }
  }

  /*
    Align the bounding box based on the current rectMode setting
  */
  Renderer.prototype._rectModeAlign = function (bb, width, height) {
    if (typeof width !== 'undefined') {

      switch (this.states.rectMode) {
        case fn.CENTER:
          bb.x -= (width - bb.w) / 2;
          bb.y -= (height - bb.h) / 2;
          break;
        case fn.CORNERS:
          bb.w += bb.x;
          bb.h += bb.y;
          break;
        case fn.RADIUS:
          bb.x -= (width - bb.w) / 2;
          bb.y -= (height - bb.h) / 2;
          bb.w /= 2;
          bb.h /= 2;
          break;
      }
      return bb;
    }
  }

  Renderer.prototype._rectModeAlignRevert = function (bb, width, height) {
    if (typeof width !== 'undefined') {

      switch (this.states.rectMode) {
        case fn.CENTER:
          bb.x += (width - bb.w) / 2;
          bb.y += (height - bb.h) / 2;
          break;
        case fn.CORNERS:
          bb.w -= bb.x;
          bb.h -= bb.y;
          break;
        case fn.RADIUS:
          bb.x += (width - bb.w) / 2;
          bb.y += (height - bb.h) / 2;
          bb.w *= 2;
          bb.h *= 2;
          break;
      }
      return bb;
    }
  }

  /*
    Get the (tight) width of a single line of text
  */
  Renderer.prototype._textWidthSingle = function (s) {
    let metrics = this.textDrawingContext().measureText(s);
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return abr + abl;
  };

  /*
    Get the (loose) width of a single line of text as specified by the font
  */
  Renderer.prototype._fontWidthSingle = function (s) {
    return this.textDrawingContext().measureText(s).width;
  };

  /*
    Get the (tight) bounds of a single line of text based on its actual bounding box
  */
  Renderer.prototype._textBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.textDrawingContext().measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return { x: x - abl, y: y - asc, w: abr + abl, h: asc + desc };
  };

  /*
    Get the (loose) bounds of a single line of text based on its font's bounding box
  */
  Renderer.prototype._fontBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.textDrawingContext().measureText(s);
    let asc = metrics.fontBoundingBoxAscent;
    let desc = metrics.fontBoundingBoxDescent;
    x -= this._xAlignOffset(this.states.textAlign, metrics.width);
    return { x, y: y - asc, w: metrics.width, h: asc + desc };;
  };

  /*
    Set the textSize property in `this.states` if it has changed
    @param {number | string} theSize - the font-size to set
    @returns {boolean} - true if the size was changed, false otherwise
   */
  Renderer.prototype._setTextSize = function (theSize) {

    if (typeof theSize === 'string') {
      // parse the size string via computed style, eg '2em'
      theSize = this._fontSizePx(theSize);
    }

    // should be a number now
    if (typeof theSize === 'number') {

      // set it in `this.states` if its been changed
      if (this.states.textSize !== theSize) {
        this.states.setValue('textSize', theSize);

        // handle leading here, if not set otherwise
        if (!this.states.leadingSet) {
          this.states.setValue('textLeading', this.states.textSize * LeadingScale);
        }
        return true; // size was changed
      }
    }
    else {
      console.warn('textSize: invalid size: ' + theSize);
    }

    return false;
  };

  /*
    Split the lines of text based on the width and the textWrap property
    @param {Array} lines - the lines of text to split
    @param {Number} maxWidth - the maximum width of the lines
    @param {Object} opts - additional options for splitting the lines
    @returns {array} - the split lines of text
   * @private
  */
  Renderer.prototype._lineate = function (textWrap, lines, maxWidth = Infinity, opts = {}) {

    let splitter = opts.splitChar ?? (textWrap === fn.WORD ? ' ' : '');
    let line, testLine, testWidth, words, newLines = [];

    for (let lidx = 0; lidx < lines.length; lidx++) {
      line = '';
      words = lines[lidx].split(splitter);
      for (let widx = 0; widx < words.length; widx++) {
        testLine = `${line + words[widx]}` + splitter;
        testWidth = this._textWidthSingle(testLine);
        if (line.length > 0 && testWidth > maxWidth) {
          newLines.push(line.trim());
          line = `${words[widx]}` + splitter;
        } else {
          line = testLine;
        }
      }
      newLines.push(line.trim());
    }
    return newLines;
  };

  /*
    Split the text into lines based on line-breaks and tabs
  */
  Renderer.prototype._splitOnBreaks = function (s) {
    if (!s || s.length === 0) return [''];
    return s.replace(TabsRe, '  ').split(LinebreakRe);
  };

  /*
    Parse the font-family string to handle complex names, fallbacks, etc.
  */
  Renderer.prototype._parseFontFamily = function (familyStr) {

    let parts = familyStr.split(CommaDelimRe);
    let family = parts.map(part => {
      part = part.trim();
      if (part.indexOf(' ') > -1 && !QuotedRe.test(part)) {
        part = `"${part}"`; // quote font names with spaces
      }
      return part;
    }).join(', ');

    return family;
  };

  Renderer.prototype._applyFontString = function () {
    /*
      Create the font-string according to the CSS font-string specification:
      If font is specified as a shorthand for several font-related properties, then:
      - it must include values for: <font-size> and <font-family>
      - it may optionally include values for:
          [<font-style>, <font-variant>, <font-weight>, <font-stretch>, <line-height>]
      Format:
      - font-style, font-variant and font-weight must precede font-size
      - font-variant may only specify the values defined in CSS 2.1, that is 'normal' and 'small-caps'.
      - font-stretch may only be a single keyword value.
      - line-height must immediately follow font-size, preceded by "/", eg 16px/3.
      - font-family must be the last value specified.
    */
    let { textFont, textSize, lineHeight, fontStyle, fontWeight, fontVariant } = this.states;
    let drawingContext = this.textDrawingContext();

    let family = this._parseFontFamily(textFont.family);
    let style = fontStyle !== fn.NORMAL ? `${fontStyle} ` : '';
    let weight = fontWeight !== fn.NORMAL ? `${fontWeight} ` : '';
    let variant = fontVariant !== fn.NORMAL ? `${fontVariant} ` : '';
    let fsize = `${textSize}px` + (lineHeight !== fn.NORMAL ? `/${lineHeight} ` : ' ');
    let fontString = `${style}${variant}${weight}${fsize}${family}`.trim();
    //console.log('fontString="' + fontString + '"');

    // set the font string on the context
    drawingContext.font = fontString;

    // verify that it was set successfully
    if (drawingContext.font !== fontString) {
      let expected = fontString;
      let actual = drawingContext.font;
      if (expected !== actual) {
        //console.warn(`Unable to set font property on context2d. It may not be supported.`);
        //console.log('Expected "' + expected + '" but got: "' + actual + '"'); // TMP
        return false;
      }
    }
    return true;
  }

  /*
    Apply the text properties in `this.states` to the `this.textDrawingContext()`
    Then apply any properties in the context-queue
   */
  Renderer.prototype._applyTextProperties = function (debug = false) {

    this._applyFontString();

    // set these after the font so they're not overridden
    let context = this.textDrawingContext();
    context.direction = this.states.direction;
    context.textAlign = this.states.textAlign;
    context.textBaseline = this.states.textBaseline;

    // set manually as (still) not fully supported as part of font-string
    let stretch = this.states.fontStretch;
    if (FontStretchKeys.includes(stretch) && context.fontStretch !== stretch) {
      context.fontStretch = stretch;
    }

    // apply each property in queue after the font so they're not overridden
    while (contextQueue?.length) {

      let [prop, val] = contextQueue.shift();
      if (debug) console.log('apply context property "' + prop + '" = "' + val + '"');
      context[prop] = val;

      // check if the value was set successfully
      if (context[prop] !== val) {
        console.warn(`Unable to set '${prop}' property on context2d. It may not be supported.`); // FES?
        console.log('Expected "' + val + '" but got: "' + context[prop] + '"');
      }
    }

    return this._pInst;
  };

  if (p5.Renderer2D) {
    p5.Renderer2D.prototype.textCanvas = function () {
      return this.canvas;
    };
    p5.Renderer2D.prototype.textDrawingContext = function () {
      return this.drawingContext;
    };

    p5.Renderer2D.prototype._renderText = function (text, x, y, maxY, minY) {
      let states = this.states;
      let context = this.textDrawingContext();

      if (y < minY || y >= maxY) {
        return; // don't render lines beyond minY/maxY
      }

      this.push();

      // no stroke unless specified by user
      if (states.strokeColor && states.strokeSet) {
        context.strokeText(text, x, y);
      }

      if (!this._clipping && states.fillColor) {

        // if fill hasn't been set by user, use default text fill
        if (!states.fillSet) {
          this._setFill(DefaultFill);
        }
        context.fillText(text, x, y);
      }

      this.pop();
    };

    /*
      Position the lines of text based on their textAlign/textBaseline properties
    */
    p5.Renderer2D.prototype._positionLines = function (x, y, width, height, lines) {

      let { textLeading, textAlign } = this.states;
      let adjustedX, lineData = new Array(lines.length);
      let adjustedW = typeof width === 'undefined' ? 0 : width;
      let adjustedH = typeof height === 'undefined' ? 0 : height;

      for (let i = 0; i < lines.length; i++) {
        switch (textAlign) {
          case textCoreConstants.START:
            throw new Error('textBounds: START not yet supported for textAlign'); // default to LEFT
          case fn.LEFT:
            adjustedX = x;
            break;
          case fn.CENTER:
            adjustedX = x + adjustedW / 2;
            break;
          case fn.RIGHT:
            adjustedX = x + adjustedW;
            break;
          case textCoreConstants.END:
            throw new Error('textBounds: END not yet supported for textAlign');
        }
        lineData[i] = { text: lines[i], x: adjustedX, y: y + i * textLeading };
      }

      return this._yAlignOffset(lineData, adjustedH);
    };

    /*
      Get the y-offset for text given the height, leading, line-count and textBaseline property
    */
    p5.Renderer2D.prototype._yAlignOffset = function (dataArr, height) {

      if (typeof height === 'undefined') {
        throw Error('_yAlignOffset: height is required');
      }

      let { textLeading, textBaseline } = this.states;
      let yOff = 0, numLines = dataArr.length;
      let ydiff = height - (textLeading * (numLines - 1));
      switch (textBaseline) { // drawingContext ?
        case fn.TOP:
          break; // ??
        case fn.BASELINE:
          break;
        case textCoreConstants._CTX_MIDDLE:
          yOff = ydiff / 2;
          break;
        case fn.BOTTOM:
          yOff = ydiff;
          break;
        case textCoreConstants.IDEOGRAPHIC:
          console.warn('textBounds: IDEOGRAPHIC not yet supported for textBaseline'); // FES?
          break;
        case textCoreConstants.HANGING:
          console.warn('textBounds: HANGING not yet supported for textBaseline'); // FES?
          break;
      }
      dataArr.forEach(ele => ele.y += yOff);
      return dataArr;
    }
  }

  if (p5.RendererGL) {
    p5.RendererGL.prototype.textCanvas = function() {
      if (!this._textCanvas) {
        this._textCanvas = document.createElement('canvas');
        this._textCanvas.width = 1;
        this._textCanvas.height = 1;
        this._textCanvas.style.display = 'none';
        // Has to be added to the DOM for measureText to work properly!
        this.canvas.parentElement.insertBefore(this._textCanvas, this.canvas);
      }
      return this._textCanvas;
    };
    p5.RendererGL.prototype.textDrawingContext = function() {
      if (!this._textDrawingContext) {
        const textCanvas = this.textCanvas();
        this._textDrawingContext = textCanvas.getContext('2d');
      }
      return this._textDrawingContext;
    };
    const oldRemove = p5.RendererGL.prototype.remove;
    p5.RendererGL.prototype.remove = function() {
      if (this._textCanvas) {
        this._textCanvas.parentElement.removeChild(this._textCanvas);
      }
      oldRemove.call(this);
    };

    p5.RendererGL.prototype._positionLines = function (x, y, width, height, lines) {

      let { textLeading, textAlign } = this.states;
      const widths = lines.map((line) => this._fontWidthSingle(line));
      let adjustedX, lineData = new Array(lines.length);
      let adjustedW = typeof width === 'undefined' ? Math.max(0, ...widths) : width;
      let adjustedH = typeof height === 'undefined' ? 0 : height;

      for (let i = 0; i < lines.length; i++) {
        switch (textAlign) {
          case textCoreConstants.START:
            throw new Error('textBounds: START not yet supported for textAlign'); // default to LEFT
          case fn.LEFT:
            adjustedX = x;
            break;
          case fn.CENTER:
            adjustedX = x + (adjustedW - widths[i]) / 2 - adjustedW / 2 + (width || 0) / 2;
            break;
          case fn.RIGHT:
            adjustedX = x + adjustedW - widths[i] - adjustedW + (width || 0);
            break;
          case textCoreConstants.END:
            throw new Error('textBounds: END not yet supported for textAlign');
        }
        lineData[i] = { text: lines[i], x: adjustedX, y: y + i * textLeading };
      }

      return this._yAlignOffset(lineData, adjustedH);
    };

    p5.RendererGL.prototype._yAlignOffset = function (dataArr, height) {

      if (typeof height === 'undefined') {
        throw Error('_yAlignOffset: height is required');
      }

      let { textLeading, textBaseline, textSize, textFont } = this.states;
      let yOff = 0, numLines = dataArr.length;
      let totalHeight = textSize * numLines + ((textLeading - textSize) * (numLines - 1));
      switch (textBaseline) { // drawingContext ?
        case fn.TOP:
          yOff = textSize;
          break;
        case fn.BASELINE:
          break;
        case textCoreConstants._CTX_MIDDLE:
          yOff = -totalHeight / 2 + textSize + (height || 0) / 2;
          break;
        case fn.BOTTOM:
          yOff = -(totalHeight - textSize) + (height || 0);
          break;
        default:
          console.warn(`${textBaseline} is not supported in WebGL mode.`); // FES?
          break;
      }
      yOff += this.states.textFont.font?._verticalAlign(textSize) || 0; // Does this function exist?
      dataArr.forEach(ele => ele.y += yOff);
      return dataArr;
    }
  }
}

export default textCore;

if (typeof p5 !== 'undefined') {
  textCore(p5, p5.prototype);
}
