/**
 * The web is much more than just canvas and the DOM functionality makes it easy to interact
 * with other HTML5 objects, including text, hyperlink, image, input, video,
 * audio, and webcam.
 * There is a set of creation methods, DOM manipulation methods, and
 * an extended <a href="#/p5.Element">p5.Element</a> that supports a range of HTML elements. See the
 * <a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>
 * beyond the canvas tutorial</a> for a full overview of how this addon works.
 *
 * See <a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>tutorial: beyond the canvas</a>
 * for more info on how to use this library.</a>
 *
 * @module DOM
 * @submodule DOM
 * @for p5
 * @requires p5
 */

import { Element } from './p5.Element';
import { MediaElement } from './p5.MediaElement';
import { File } from './p5.File';

function dom(p5, fn){
  /**
   * Searches the page for the first element that matches the given
   * <a href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics#different_types_of_selectors" target="_blank">CSS selector string</a>.
   *
   * The selector string can be an ID, class, tag name, or a combination.
   * `select()` returns a <a href="#/p5.Element">p5.Element</a> object if it
   * finds a match and `null` if not.
   *
   * The second parameter, `container`, is optional. It specifies a container to
   * search within. `container` can be CSS selector string, a
   * <a href="#/p5.Element">p5.Element</a> object, or an
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a> object.
   *
   * @method select
   * @param  {String} selectors CSS selector string of element to search for.
   * @param  {String|p5.Element|HTMLElement} [container] CSS selector string, <a href="#/p5.Element">p5.Element</a>, or
   *                                             <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a> to search within.
   * @return {p5.Element|null} <a href="#/p5.Element">p5.Element</a> containing the element.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *
   *   // Select the canvas by its tag.
   *   let cnv = select('canvas');
   *   cnv.style('border', '5px deeppink dashed');
   *
   *   describe('A gray square with a dashed pink border.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   // Add a class attribute to the canvas.
   *   cnv.class('pinkborder');
   *
   *   background(200);
   *
   *   // Select the canvas by its class.
   *   cnv = select('.pinkborder');
   *
   *   // Style its border.
   *   cnv.style('border', '5px deeppink dashed');
   *
   *   describe('A gray square with a dashed pink border.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   // Set the canvas' ID.
   *   cnv.id('mycanvas');
   *
   *   background(200);
   *
   *   // Select the canvas by its ID.
   *   cnv = select('#mycanvas');
   *
   *   // Style its border.
   *   cnv.style('border', '5px deeppink dashed');
   *
   *   describe('A gray square with a dashed pink border.');
   * }
   * </code>
   * </div>
   */
  fn.select = function (e, p) {
    // p5._validateParameters('select', arguments);
    const container = this._getContainer(p);
    const res = container.querySelector(e);
    if (res) {
      return this._wrapElement(res);
    } else {
      return null;
    }
  };

  /**
   * Searches the page for all elements that matches the given
   * <a href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics#different_types_of_selectors" target="_blank">CSS selector string</a>.
   *
   * The selector string can be an ID, class, tag name, or a combination.
   * `selectAll()` returns an array of <a href="#/p5.Element">p5.Element</a>
   * objects if it finds any matches and an empty array if none are found.
   *
   * The second parameter, `container`, is optional. It specifies a container to
   * search within. `container` can be CSS selector string, a
   * <a href="#/p5.Element">p5.Element</a> object, or an
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a> object.
   *
   * @method selectAll
   * @param  {String} selectors CSS selector string of element to search for.
   * @param  {String|p5.Element|HTMLElement} [container] CSS selector string, <a href="#/p5.Element">p5.Element</a>, or
   *                                             <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a> to search within.
   * @return {p5.Element[]} array of <a href="#/p5.Element">p5.Element</a>s containing any elements found.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create three buttons.
   *   createButton('1');
   *   createButton('2');
   *   createButton('3');
   *
   *   // Select the buttons by their tag.
   *   let buttons = selectAll('button');
   *
   *   // Position the buttons.
   *   for (let i = 0; i < 3; i += 1) {
   *     buttons[i].position(0, i * 30);
   *   }
   *
   *   describe('Three buttons stacked vertically. The buttons are labeled, "1", "2", and "3".');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create three buttons and position them.
   *   let b1 = createButton('1');
   *   b1.position(0, 0);
   *   let b2 = createButton('2');
   *   b2.position(0, 30);
   *   let b3 = createButton('3');
   *   b3.position(0, 60);
   *
   *   // Add a class attribute to each button.
   *   b1.class('btn');
   *   b2.class('btn btn-pink');
   *   b3.class('btn');
   *
   *   // Select the buttons by their class.
   *   let buttons = selectAll('.btn');
   *   let pinkButtons = selectAll('.btn-pink');
   *
   *   // Style the selected buttons.
   *   buttons.forEach(setFont);
   *   pinkButtons.forEach(setColor);
   *
   *   describe('Three buttons stacked vertically. The buttons are labeled, "1", "2", and "3". Buttons "1" and "3" are gray. Button "2" is pink.');
   * }
   *
   * // Set a button's font to Comic Sans MS.
   * function setFont(btn) {
   *   btn.style('font-family', 'Comic Sans MS');
   * }
   *
   * // Set a button's background and font color.
   * function setColor(btn) {
   *   btn.style('background', 'deeppink');
   *   btn.style('color', 'white');
   * }
   * </code>
   * </div>
   */
  fn.selectAll = function (e, p) {
    // p5._validateParameters('selectAll', arguments);
    const arr = [];
    const container = this._getContainer(p);
    const res = container.querySelectorAll(e);
    if (res) {
      for (let j = 0; j < res.length; j++) {
        const obj = this._wrapElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };

  /**
   * Helper function for select and selectAll
   */
  fn._getContainer = function (p) {
    let container = document;
    if (typeof p === 'string') {
      container = document.querySelector(p) || document;
    } else if (p instanceof Element) {
      container = p.elt;
    } else if (p instanceof HTMLElement) {
      container = p;
    }
    return container;
  };

  /**
   * Helper function for getElement and getElements.
   */
  fn._wrapElement = function (elt) {
    const children = Array.prototype.slice.call(elt.children);
    if (elt.tagName === 'INPUT' && elt.type === 'checkbox') {
      let converted = new Element(elt, this);
      converted.checked = function (...args) {
        if (args.length === 0) {
          return this.elt.checked;
        } else if (args[0]) {
          this.elt.checked = true;
        } else {
          this.elt.checked = false;
        }
        return this;
      };
      return converted;
    } else if (elt.tagName === 'VIDEO' || elt.tagName === 'AUDIO') {
      return new MediaElement(elt, this);
    } else if (elt.tagName === 'SELECT') {
      return this.createSelect(new Element(elt, this));
    } else if (
      children.length > 0 &&
      children.every(function (c) {
        return c.tagName === 'INPUT' || c.tagName === 'LABEL';
      }) &&
      (elt.tagName === 'DIV' || elt.tagName === 'SPAN')
    ) {
      return this.createRadio(new Element(elt, this));
    } else {
      return new Element(elt, this);
    }
  };

  /**
   * Creates a new <a href="#/p5.Element">p5.Element</a> object.
   *
   * The first parameter, `tag`, is a string an HTML tag such as `'h5'`.
   *
   * The second parameter, `content`, is optional. It's a string that sets the
   * HTML content to insert into the new element. New elements have no content
   * by default.
   *
   * @method createElement
   * @param  {String} tag tag for the new element.
   * @param  {String} [content] HTML content to insert into the element.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an h5 element with nothing in it.
   *   createElement('h5');
   *
   *   describe('A gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an h5 element with the content "p5*js".
   *   let h5 = createElement('h5', 'p5*js');
   *
   *   // Set the element's style and position.
   *   h5.style('color', 'deeppink');
   *   h5.position(30, 15);
   *
   *   describe('The text "p5*js" written in pink in the middle of a gray square.');
   * }
   * </code>
   * </div>
   */
  fn.createElement = function (tag, content) {
    // p5._validateParameters('createElement', arguments);
    const elt = document.createElement(tag);
    if (typeof content !== 'undefined') {
      elt.innerHTML = content;
    }
    return addElement(elt, this);
  };

  /**
   * Removes all elements created by p5.js, including any event handlers.
   *
   * There are two exceptions:
   * canvas elements created by <a href="#/p5/createCanvas">createCanvas()</a>
   * and <a href="#/p5.Renderer">p5.Render</a> objects created by
   * <a href="#/p5/createGraphics">createGraphics()</a>.
   *
   * @method removeElements
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and place
   *   // it in the middle of the canvas.
   *   let p = createP('p5*js');
   *   p.position(25, 25);
   *
   *   describe('A gray square with the text "p5*js" written in its center. The text disappears when the mouse is pressed.');
   * }
   *
   * // Remove all elements when the mouse is pressed.
   * function mousePressed() {
   *   removeElements();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a paragraph element and place
   *   // it at the top of the canvas.
   *   let p = createP('p5*js');
   *   p.position(25, 25);
   *
   *   // Create a slider element and place it
   *   // beneath the canvas.
   *   slider = createSlider(0, 255, 200);
   *   slider.position(0, 100);
   *
   *   describe('A gray square with the text "p5*js" written in its center and a range slider beneath it. The square changes color when the slider is moved. The text and slider disappear when the square is double-clicked.');
   * }
   *
   * function draw() {
   *   // Use the slider value to change the background color.
   *   let g = slider.value();
   *   background(g);
   * }
   *
   * // Remove all elements when the mouse is double-clicked.
   * function doubleClicked() {
   *   removeElements();
   * }
   * </code>
   * </div>
   */
  fn.removeElements = function (e) {
    // p5._validateParameters('removeElements', arguments);
    // el.remove splices from this._elements, so don't mix iteration with it
    const isNotCanvasElement = el => !(el.elt instanceof HTMLCanvasElement);
    const removeableElements = this._elements.filter(isNotCanvasElement);
    removeableElements.map(el => el.remove());
  };

  /**
   * Helpers for create methods.
   */
  function addElement(elt, pInst, media) {
    const node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    const c = media
      ? new MediaElement(elt, pInst)
      : new Element(elt, pInst);
    pInst._elements.push(c);
    return c;
  }

  /**
   * Creates a `&lt;div&gt;&lt;/div&gt;` element.
   *
   * `&lt;div&gt;&lt;/div&gt;` elements are commonly used as containers for
   * other elements.
   *
   * The parameter `html` is optional. It accepts a string that sets the
   * inner HTML of the new `&lt;div&gt;&lt;/div&gt;`.
   *
   * @method createDiv
   * @param  {String} [html] inner HTML for the new `&lt;div&gt;&lt;/div&gt;` element.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element and set its position.
   *   let div = createDiv('p5*js');
   *   div.position(25, 35);
   *
   *   describe('A gray square with the text "p5*js" written in its center.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an h3 element within the div.
   *   let div = createDiv('<h3>p5*js</h3>');
   *   div.position(20, 5);
   *
   *   describe('A gray square with the text "p5*js" written in its center.');
   * }
   * </code>
   * </div>
   */
  fn.createDiv = function (html = '') {
    let elt = document.createElement('div');
    elt.innerHTML = html;
    return addElement(elt, this);
  };

  /**
   * Creates a paragraph element.
   *
   * `&lt;p&gt;&lt;/p&gt;` elements are commonly used for paragraph-length text.
   *
   * The parameter `html` is optional. It accepts a string that sets the
   * inner HTML of the new `&lt;p&gt;&lt;/p&gt;`.
   *
   * @method createP
   * @param  {String} [html] inner HTML for the new `&lt;p&gt;&lt;/p&gt;` element.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and set its position.
   *   let p = createP('Tell me a story.');
   *   p.position(5, 0);
   *
   *   describe('A gray square displaying the text "Tell me a story." written in black.');
   * }
   * </code>
   * </div>
   */
  fn.createP = function (html = '') {
    let elt = document.createElement('p');
    elt.innerHTML = html;
    return addElement(elt, this);
  };

  /**
   * Creates a `&lt;span&gt;&lt;/span&gt;` element.
   *
   * `&lt;span&gt;&lt;/span&gt;` elements are commonly used as containers
   * for inline elements. For example, a `&lt;span&gt;&lt;/span&gt;`
   * can hold part of a sentence that's a
   * <span style="color: deeppink;">different</span> style.
   *
   * The parameter `html` is optional. It accepts a string that sets the
   * inner HTML of the new `&lt;span&gt;&lt;/span&gt;`.
   *
   * @method createSpan
   * @param  {String} [html] inner HTML for the new `&lt;span&gt;&lt;/span&gt;` element.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a span element and set its position.
   *   let span = createSpan('p5*js');
   *   span.position(25, 35);
   *
   *   describe('A gray square with the text "p5*js" written in its center.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   background(200);
   *
   *   // Create a div element as a container.
   *   let div = createDiv();
   *
   *   // Place the div at the center.
   *   div.position(25, 35);
   *
   *   // Create a span element.
   *   let s1 = createSpan('p5');
   *
   *   // Create a second span element.
   *   let s2 = createSpan('*');
   *
   *   // Set the second span's font color.
   *   s2.style('color', 'deeppink');
   *
   *   // Create a third span element.
   *   let s3 = createSpan('js');
   *
   *   // Add all the spans to the container div.
   *   s1.parent(div);
   *   s2.parent(div);
   *   s3.parent(div);
   *
   *   describe('A gray square with the text "p5*js" written in black at its center. The asterisk is pink.');
   * }
   * </code>
   * </div>
   */
  fn.createSpan = function (html = '') {
    let elt = document.createElement('span');
    elt.innerHTML = html;
    return addElement(elt, this);
  };

  /**
   * Creates an `&lt;img&gt;` element that can appear outside of the canvas.
   *
   * The first parameter, `src`, is a string with the path to the image file.
   * `src` should be a relative path, as in `'assets/image.png'`, or a URL, as
   * in `'https://example.com/image.png'`.
   *
   * The second parameter, `alt`, is a string with the
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt#usage_notes" target="_blank">alternate text</a>
   * for the image. An empty string `''` can be used for images that aren't displayed.
   *
   * The third parameter, `crossOrigin`, is optional. It's a string that sets the
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes" target="_blank">crossOrigin property</a>
   * of the image. Use `'anonymous'` or `'use-credentials'` to fetch the image
   * with cross-origin access.
   *
   * The fourth parameter, `callback`, is also optional. It sets a function to
   * call after the image loads. The new image is passed to the callback
   * function as a <a href="#/p5.Element">p5.Element</a> object.
   *
   * @method createImg
   * @param  {String} src relative path or URL for the image.
   * @param  {String} alt alternate text for the image.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   let img = createImg(
   *     'https://p5js.org/assets/img/asterisk-01.png',
   *     'The p5.js magenta asterisk.'
   *   );
   *   img.position(0, -10);
   *
   *   describe('A gray square with a magenta asterisk in its center.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method createImg
   * @param  {String} src
   * @param  {String} alt
   * @param  {String} [crossOrigin] crossOrigin property to use when fetching the image.
   * @param  {Function} [successCallback] function to call once the image loads. The new image will be passed
   *                                      to the function as a <a href="#/p5.Element">p5.Element</a> object.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   */
  fn.createImg = function () {
    // p5._validateParameters('createImg', arguments);
    const elt = document.createElement('img');
    const args = arguments;
    let self;
    if (args.length > 1 && typeof args[1] === 'string') {
      elt.alt = args[1];
    }
    if (args.length > 2 && typeof args[2] === 'string') {
      elt.crossOrigin = args[2];
    }
    elt.src = args[0];
    self = addElement(elt, this);
    elt.addEventListener('load', function () {
      self.width = elt.offsetWidth || elt.width;
      self.height = elt.offsetHeight || elt.height;
      const last = args[args.length - 1];
      if (typeof last === 'function') last(self);
    });
    return self;
  };

  /**
   * Creates an `&lt;a&gt;&lt;/a&gt;` element that links to another web page.
   *
   * The first parmeter, `href`, is a string that sets the URL of the linked
   * page.
   *
   * The second parameter, `html`, is a string that sets the inner HTML of the
   * link. It's common to use text, images, or buttons as links.
   *
   * The third parameter, `target`, is optional. It's a string that tells the
   * web browser where to open the link. By default, links open in the current
   * browser tab. Passing `'_blank'` will cause the link to open in a new
   * browser tab. MDN describes a few
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target" target="_blank">other options</a>.
   *
   * @method createA
   * @param  {String} href       URL of linked page.
   * @param  {String} html       inner HTML of link element to display.
   * @param  {String} [target]   target where the new link should open,
   *                             either `'_blank'`, `'_self'`, `'_parent'`, or `'_top'`.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an anchor element that links to p5js.org.
   *   let a = createA('https://p5js.org/', 'p5*js');
   *   a.position(25, 35);
   *
   *   describe('The text "p5*js" written at the center of a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   background(200);
   *
   *   // Create an anchor tag that links to p5js.org.
   *   // Open the link in a new tab.
   *   let a = createA('https://p5js.org/', 'p5*js', '_blank');
   *   a.position(25, 35);
   *
   *   describe('The text "p5*js" written at the center of a gray square.');
   * }
   * </code>
   * </div>
   */
  fn.createA = function (href, html, target) {
    // p5._validateParameters('createA', arguments);
    const elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    return addElement(elt, this);
  };

  /* INPUT */
  /**
   * Creates a slider `&lt;input&gt;&lt;/input&gt;` element.
   *
   * Range sliders are useful for quickly selecting numbers from a given range.
   *
   * The first two parameters, `min` and `max`, are numbers that set the
   * slider's minimum and maximum.
   *
   * The third parameter, `value`, is optional. It's a number that sets the
   * slider's default value.
   *
   * The fourth parameter, `step`, is also optional. It's a number that sets the
   * spacing between each value in the slider's range. Setting `step` to 0
   * allows the slider to move smoothly from `min` to `max`.
   *
   * @method createSlider
   * @param  {Number} min minimum value of the slider.
   * @param  {Number} max maximum value of the slider.
   * @param  {Number} [value] default value of the slider.
   * @param  {Number} [step] size for each step in the slider's range.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a slider and place it at the top of the canvas.
   *   slider = createSlider(0, 255);
   *   slider.position(10, 10);
   *   slider.size(80);
   *
   *   describe('A dark gray square with a range slider at the top. The square changes color when the slider is moved.');
   * }
   *
   * function draw() {
   *   // Use the slider as a grayscale value.
   *   let g = slider.value();
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a slider and place it at the top of the canvas.
   *   // Set its default value to 0.
   *   slider = createSlider(0, 255, 0);
   *   slider.position(10, 10);
   *   slider.size(80);
   *
   *   describe('A black square with a range slider at the top. The square changes color when the slider is moved.');
   * }
   *
   * function draw() {
   *   // Use the slider as a grayscale value.
   *   let g = slider.value();
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a slider and place it at the top of the canvas.
   *   // Set its default value to 0.
   *   // Set its step size to 50.
   *   slider = createSlider(0, 255, 0, 50);
   *   slider.position(10, 10);
   *   slider.size(80);
   *
   *   describe('A black square with a range slider at the top. The square changes color when the slider is moved.');
   * }
   *
   * function draw() {
   *   // Use the slider as a grayscale value.
   *   let g = slider.value();
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a slider and place it at the top of the canvas.
   *   // Set its default value to 0.
   *   // Set its step size to 0 so that it moves smoothly.
   *   slider = createSlider(0, 255, 0, 0);
   *   slider.position(10, 10);
   *   slider.size(80);
   *
   *   describe('A black square with a range slider at the top. The square changes color when the slider is moved.');
   * }
   *
   * function draw() {
   *   // Use the slider as a grayscale value.
   *   let g = slider.value();
   *   background(g);
   * }
   * </code>
   * </div>
   */
  fn.createSlider = function (min, max, value, step) {
    // p5._validateParameters('createSlider', arguments);
    const elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (step === 0) {
      elt.step = 0.000000000000000001; // smallest valid step
    } else if (step) {
      elt.step = step;
    }
    if (typeof value === 'number') elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a `&lt;button&gt;&lt;/button&gt;` element.
   *
   * The first parameter, `label`, is a string that sets the label displayed on
   * the button.
   *
   * The second parameter, `value`, is optional. It's a string that sets the
   * button's value. See
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#value" target="_blank">MDN</a>
   * for more details.
   *
   * @method createButton
   * @param  {String} label label displayed on the button.
   * @param  {String} [value] value of the button.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a button and place it beneath the canvas.
   *   let button = createButton('click me');
   *   button.position(0, 100);
   *
   *   // Call repaint() when the button is pressed.
   *   button.mousePressed(repaint);
   *
   *   describe('A gray square with a button that says "click me" beneath it. The square changes color when the button is clicked.');
   * }
   *
   * // Change the background color.
   * function repaint() {
   *   let g = random(255);
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let button;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a button and set its value to 0.
   *   // Place the button beneath the canvas.
   *   button = createButton('click me', 'red');
   *   button.position(0, 100);
   *
   *   // Call randomColor() when the button is pressed.
   *   button.mousePressed(randomColor);
   *
   *   describe('A red square with a button that says "click me" beneath it. The square changes color when the button is clicked.');
   * }
   *
   * function draw() {
   *   // Use the button's value to set the background color.
   *   let c = button.value();
   *   background(c);
   * }
   *
   * // Set the button's value to a random color.
   * function randomColor() {
   *   let c = random(['red', 'green', 'blue', 'yellow']);
   *   button.value(c);
   * }
   * </code>
   * </div>
   */
  fn.createButton = function (label, value) {
    // p5._validateParameters('createButton', arguments);
    const elt = document.createElement('button');
    elt.innerHTML = label;
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a checkbox `&lt;input&gt;&lt;/input&gt;` element.
   *
   * Checkboxes extend the <a href="#/p5.Element">p5.Element</a> class with a
   * `checked()` method. Calling `myBox.checked()` returns `true` if it the box
   * is checked and `false` if not.
   *
   * The first parameter, `label`, is optional. It's a string that sets the label
   * to display next to the checkbox.
   *
   * The second parameter, `value`, is also optional. It's a boolean that sets the
   * checkbox's value.
   *
   * @method createCheckbox
   * @param  {String} [label] label displayed after the checkbox.
   * @param  {Boolean} [value] value of the checkbox. Checked is `true` and unchecked is `false`.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let checkbox;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a checkbox and place it beneath the canvas.
   *   checkbox = createCheckbox();
   *   checkbox.position(0, 100);
   *
   *   describe('A black square with a checkbox beneath it. The square turns white when the box is checked.');
   * }
   *
   * function draw() {
   *   // Use the checkbox to set the background color.
   *   if (checkbox.checked()) {
   *     background(255);
   *   } else {
   *     background(0);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let checkbox;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a checkbox and place it beneath the canvas.
   *   // Label the checkbox "white".
   *   checkbox = createCheckbox(' white');
   *   checkbox.position(0, 100);
   *
   *   describe('A black square with a checkbox labeled "white" beneath it. The square turns white when the box is checked.');
   * }
   *
   * function draw() {
   *   // Use the checkbox to set the background color.
   *   if (checkbox.checked()) {
   *     background(255);
   *   } else {
   *     background(0);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let checkbox;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a checkbox and place it beneath the canvas.
   *   // Label the checkbox "white" and set its value to true.
   *   checkbox = createCheckbox(' white', true);
   *   checkbox.position(0, 100);
   *
   *   describe('A white square with a checkbox labeled "white" beneath it. The square turns black when the box is unchecked.');
   * }
   *
   * function draw() {
   *   // Use the checkbox to set the background color.
   *   if (checkbox.checked()) {
   *     background(255);
   *   } else {
   *     background(0);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.createCheckbox = function (...args) {
    // p5._validateParameters('createCheckbox', args);

    // Create a container element
    const elt = document.createElement('div');

    // Create checkbox type input element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // Create label element and wrap it around checkbox
    const label = document.createElement('label');
    label.appendChild(checkbox);

    // Append label element inside the container
    elt.appendChild(label);

    //checkbox must be wrapped in p5.Element before label so that label appears after
    const self = addElement(elt, this);

    self.checked = function (...args) {
      const cb = self.elt.firstElementChild.getElementsByTagName('input')[0];
      if (cb) {
        if (args.length === 0) {
          return cb.checked;
        } else if (args[0]) {
          cb.checked = true;
        } else {
          cb.checked = false;
        }
      }
      return self;
    };

    this.value = function (val) {
      self.value = val;
      return this;
    };

    // Set the span element innerHTML as the label value if passed
    if (args[0]) {
      self.value(args[0]);
      const span = document.createElement('span');
      span.innerHTML = args[0];
      label.appendChild(span);
    }

    // Set the checked value of checkbox if passed
    if (args[1]) {
      checkbox.checked = true;
    }

    return self;
  };

  /**
   * Creates a dropdown menu `&lt;select&gt;&lt;/select&gt;` element.
   *
   * The parameter is optional. If `true` is passed, as in
   * `let mySelect = createSelect(true)`, then the dropdown will support
   * multiple selections. If an existing `&lt;select&gt;&lt;/select&gt;` element
   * is passed, as in `let mySelect = createSelect(otherSelect)`, the existing
   * element will be wrapped in a new <a href="#/p5.Element">p5.Element</a>
   * object.
   *
   * Dropdowns extend the <a href="#/p5.Element">p5.Element</a> class with a few
   * helpful methods for managing options:
   * - `mySelect.option(name, [value])` adds an option to the menu. The first paremeter, `name`, is a string that sets the option's name and value. The second parameter, `value`, is optional. If provided, it sets the value that corresponds to the key `name`. If an option with `name` already exists, its value is changed to `value`.
   * - `mySelect.value()` returns the currently-selected option's value.
   * - `mySelect.selected()` returns the currently-selected option.
   * - `mySelect.selected(option)` selects the given option by default.
   * - `mySelect.disable()` marks the whole dropdown element as disabled.
   * - `mySelect.disable(option)` marks a given option as disabled.
   * - `mySelect.enable()` marks the whole dropdown element as enabled.
   * - `mySelect.enable(option)` marks a given option as enabled.
   *
   * @method createSelect
   * @param {Boolean} [multiple] support multiple selections.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let mySelect;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a dropdown and place it beneath the canvas.
   *   mySelect = createSelect();
   *   mySelect.position(0, 100);
   *
   *   // Add color options.
   *   mySelect.option('red');
   *   mySelect.option('green');
   *   mySelect.option('blue');
   *   mySelect.option('yellow');
   *
   *   // Set the selected option to "red".
   *   mySelect.selected('red');
   *
   *   describe('A red square with a dropdown menu beneath it. The square changes color when a new color is selected.');
   * }
   *
   * function draw() {
   *   // Use the selected value to paint the background.
   *   let c = mySelect.selected();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let mySelect;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a dropdown and place it beneath the canvas.
   *   mySelect = createSelect();
   *   mySelect.position(0, 100);
   *
   *   // Add color options.
   *   mySelect.option('red');
   *   mySelect.option('green');
   *   mySelect.option('blue');
   *   mySelect.option('yellow');
   *
   *   // Set the selected option to "red".
   *   mySelect.selected('red');
   *
   *   // Disable the "yellow" option.
   *   mySelect.disable('yellow');
   *
   *   describe('A red square with a dropdown menu beneath it. The square changes color when a new color is selected.');
   * }
   *
   * function draw() {
   *   // Use the selected value to paint the background.
   *   let c = mySelect.selected();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let mySelect;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a dropdown and place it beneath the canvas.
   *   mySelect = createSelect();
   *   mySelect.position(0, 100);
   *
   *   // Add color options with names and values.
   *   mySelect.option('one', 'red');
   *   mySelect.option('two', 'green');
   *   mySelect.option('three', 'blue');
   *   mySelect.option('four', 'yellow');
   *
   *   // Set the selected option to "one".
   *   mySelect.selected('one');
   *
   *   describe('A red square with a dropdown menu beneath it. The square changes color when a new color is selected.');
   * }
   *
   * function draw() {
   *   // Use the selected value to paint the background.
   *   let c = mySelect.selected();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Hold CTRL to select multiple options on Windows and Linux.
   * // Hold CMD to select multiple options on macOS.
   * let mySelect;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a dropdown and allow multiple selections.
   *   // Place it beneath the canvas.
   *   mySelect = createSelect(true);
   *   mySelect.position(0, 100);
   *
   *   // Add color options.
   *   mySelect.option('red');
   *   mySelect.option('green');
   *   mySelect.option('blue');
   *   mySelect.option('yellow');
   *
   *   describe('A gray square with a dropdown menu beneath it. Colorful circles appear when their color is selected.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use the selected value(s) to draw circles.
   *   let colors = mySelect.selected();
   *   for (let i = 0; i < colors.length; i += 1) {
   *     // Calculate the x-coordinate.
   *     let x = 10 + i * 20;
   *
   *     // Access the color.
   *     let c = colors[i];
   *
   *     // Draw the circle.
   *     fill(c);
   *     circle(x, 50, 20);
   *   }
   * }
   * </code>
   * </div>
   */
  /**
   * @method createSelect
   * @param {Object} existing select element to wrap, either as a <a href="#/p5.Element">p5.Element</a> or
   *                          a <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement" target="_blank">HTMLSelectElement</a>.
   * @return {p5.Element}
   */

  fn.createSelect = function (...args) {
    // p5._validateParameters('createSelect', args);
    let self;
    let arg = args[0];
    if (arg instanceof Element && arg.elt instanceof HTMLSelectElement) {
      // If given argument is p5.Element of select type
      self = arg;
      this.elt = arg.elt;
    } else if (arg instanceof HTMLSelectElement) {
      self = addElement(arg, this);
      this.elt = arg;
    } else {
      const elt = document.createElement('select');
      if (arg && typeof arg === 'boolean') {
        elt.setAttribute('multiple', 'true');
      }
      self = addElement(elt, this);
      this.elt = elt;
    }
    self.option = function (name, value) {
      let index;

      // if no name is passed, return
      if (name === undefined) {
        return;
      }
      //see if there is already an option with this name
      for (let i = 0; i < this.elt.length; i += 1) {
        if (this.elt[i].textContent === name) {
          index = i;
          break;
        }
      }
      //if there is an option with this name we will modify it
      if (index !== undefined) {
        //if the user passed in false then delete that option
        if (value === false) {
          this.elt.remove(index);
        } else {
          // Update the option at index with the value
          this.elt[index].value = value;
        }
      } else {
        //if it doesn't exist create it
        const opt = document.createElement('option');
        opt.textContent = name;
        opt.value = value === undefined ? name : value;
        this.elt.appendChild(opt);
        this._pInst._elements.push(opt);
      }
    };

    self.selected = function (value) {
      // Update selected status of option
      if (value !== undefined) {
        for (let i = 0; i < this.elt.length; i += 1) {
          if (this.elt[i].value.toString() === value.toString()) {
            this.elt.selectedIndex = i;
          }
        }
        return this;
      } else {
        if (this.elt.getAttribute('multiple')) {
          let arr = [];
          for (const selectedOption of this.elt.selectedOptions) {
            arr.push(selectedOption.value);
          }
          return arr;
        } else {
          return this.elt.value;
        }
      }
    };

    self.disable = function (value) {
      if (typeof value === 'string') {
        for (let i = 0; i < this.elt.length; i++) {
          if (this.elt[i].value.toString() === value) {
            this.elt[i].disabled = true;
            this.elt[i].selected = false;
          }
        }
      } else {
        this.elt.disabled = true;
      }
      return this;
    };

    self.enable = function (value) {
      if (typeof value === 'string') {
        for (let i = 0; i < this.elt.length; i++) {
          if (this.elt[i].value.toString() === value) {
            this.elt[i].disabled = false;
            this.elt[i].selected = false;
          }
        }
      } else {
        this.elt.disabled = false;
        for (let i = 0; i < this.elt.length; i++) {
          this.elt[i].disabled = false;
          this.elt[i].selected = false;
        }
      }
      return this;
    };

    return self;
  };

  /**
   * Creates a radio button element.
   *
   * The parameter is optional. If a string is passed, as in
   * `let myRadio = createSelect('food')`, then each radio option will
   * have `"food"` as its `name` parameter: `&lt;input name="food"&gt;&lt;/input&gt;`.
   * If an existing `&lt;div&gt;&lt;/div&gt;` or `&lt;span&gt;&lt;/span&gt;`
   * element is passed, as in `let myRadio = createSelect(container)`, it will
   * become the radio button's parent element.
   *
   * Radio buttons extend the <a href="#/p5.Element">p5.Element</a> class with a few
   * helpful methods for managing options:
   * - `myRadio.option(value, [label])` adds an option to the menu. The first paremeter, `value`, is a string that sets the option's value and label. The second parameter, `label`, is optional. If provided, it sets the label displayed for the `value`. If an option with `value` already exists, its label is changed and its value is returned.
   * - `myRadio.value()` returns the currently-selected option's value.
   * - `myRadio.selected()` returns the currently-selected option.
   * - `myRadio.selected(value)` selects the given option and returns it as an <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement" target="_blank">`HTMLInputElement`</a>.
   * - `myRadio.disable(shouldDisable)` enables the entire radio button if `true` is passed and disables it if `false` is passed.
   *
   * @method createRadio
   * @param  {Object} [containerElement] container HTML Element, either a `&lt;div&gt;&lt;/div&gt;`
   * or `&lt;span&gt;&lt;/span&gt;`.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let style = document.createElement('style');
   * style.innerHTML = `
   * .p5-radio label {
   *    display: flex;
   *    align-items: center;
   *  }
   *  .p5-radio input {
   *    margin-right: 5px;
   *  }
   *  `;
   * document.head.appendChild(style);
   *
   * let myRadio;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a radio button element and place it
   *   // in the top-left corner.
   *   myRadio = createRadio();
   *   myRadio.position(0, 0);
   *   myRadio.class('p5-radio');
   *   myRadio.size(60);
   *
   *   // Add a few color options.
   *   myRadio.option('red');
   *   myRadio.option('yellow');
   *   myRadio.option('blue');
   *
   *   // Choose a default option.
   *   myRadio.selected('yellow');
   *
   *   describe('A yellow square with three color options listed, "red", "yellow", and "blue". The square changes color when the user selects a new option.');
   * }
   *
   * function draw() {
   *   // Set the background color using the radio button.
   *   let g = myRadio.value();
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myRadio;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a radio button element and place it
   *   // in the top-left corner.
   *   myRadio = createRadio();
   *   myRadio.position(0, 0);
   *   myRadio.size(50);
   *
   *   // Add a few color options.
   *   // Color values are labeled with
   *   // emotions they evoke.
   *   myRadio.option('red', 'love');
   *   myRadio.option('yellow', 'joy');
   *   myRadio.option('blue', 'trust');
   *
   *   // Choose a default option.
   *   myRadio.selected('yellow');
   *
   *   describe('A yellow square with three options listed, "love", "joy", and "trust". The square changes color when the user selects a new option.');
   * }
   *
   * function draw() {
   *   // Set the background color using the radio button.
   *   let c = myRadio.value();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myRadio;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a radio button element and place it
   *   // in the top-left corner.
   *   myRadio = createRadio();
   *   myRadio.position(0, 0);
   *   myRadio.size(50);
   *
   *   // Add a few color options.
   *   myRadio.option('red');
   *   myRadio.option('yellow');
   *   myRadio.option('blue');
   *
   *   // Choose a default option.
   *   myRadio.selected('yellow');
   *
   *   // Create a button and place it beneath the canvas.
   *   let btn = createButton('disable');
   *   btn.position(0, 100);
   *
   *   // Call disableRadio() when btn is pressed.
   *   btn.mousePressed(disableRadio);
   *
   *   describe('A yellow square with three options listed, "red", "yellow", and "blue". The square changes color when the user selects a new option. A "disable" button beneath the canvas disables the color options when pressed.');
   * }
   *
   * function draw() {
   *   // Set the background color using the radio button.
   *   let c = myRadio.value();
   *   background(c);
   * }
   *
   * // Disable myRadio.
   * function disableRadio() {
   *   myRadio.disable(true);
   * }
   * </code>
   * </div>
   */
  /**
   * @method createRadio
   * @param {String} [name] name parameter assigned to each option's `&lt;input&gt;&lt;/input&gt;` element.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   */
  /**
   * @method createRadio
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   */
  //counter for unique names on radio button
  let counter = 0;
  fn.createRadio = function (...args) {
    // Creates a div, adds each option as an individual input inside it.
    // If already given with a containerEl, will search for all input[radio]
    // it, create a p5.Element out of it, add options to it and return the p5.Element.

    let self;
    let radioElement;
    let name;
    const arg0 = args[0];
    if (
      arg0 instanceof Element &&
      (arg0.elt instanceof HTMLDivElement || arg0.elt instanceof HTMLSpanElement)
    ) {
      // If given argument is p5.Element of div/span type
      self = arg0;
      this.elt = arg0.elt;
    } else if (
      // If existing radio Element is provided as argument 0
      arg0 instanceof HTMLDivElement ||
      arg0 instanceof HTMLSpanElement
    ) {
      self = addElement(arg0, this);
      this.elt = arg0;
      radioElement = arg0;
      if (typeof args[1] === 'string') name = args[1];
    } else {
      if (typeof arg0 === 'string') name = arg0;
      radioElement = document.createElement('div');
      self = addElement(radioElement, this);
      this.elt = radioElement;
    }
    self._name = name || `radioOption_${counter++}`;

    // setup member functions
    const isRadioInput = el =>
      el instanceof HTMLInputElement && el.type === 'radio';
    const isLabelElement = el => el instanceof HTMLLabelElement;
    const isSpanElement = el => el instanceof HTMLSpanElement;

    self._getOptionsArray = function () {
      return Array.from(this.elt.children)
        .filter(
          el =>
            isRadioInput(el) ||
            (isLabelElement(el) && isRadioInput(el.firstElementChild))
        )
        .map(el => (isRadioInput(el) ? el : el.firstElementChild));
    };

    self.option = function (value, label) {
      // return an option with this value, create if not exists.
      let optionEl;
      for (const option of self._getOptionsArray()) {
        if (option.value === value) {
          optionEl = option;
          break;
        }
      }

      // Create a new option, add it to radioElement and return it.
      if (optionEl === undefined) {
        optionEl = document.createElement('input');
        optionEl.setAttribute('type', 'radio');
        optionEl.setAttribute('value', value);
      }
      optionEl.setAttribute('name', self._name);

      // Check if label element exists, else create it
      let labelElement;
      if (!isLabelElement(optionEl.parentElement)) {
        labelElement = document.createElement('label');
        labelElement.insertAdjacentElement('afterbegin', optionEl);
      } else {
        labelElement = optionEl.parentElement;
      }

      // Check if span element exists, else create it
      let spanElement;
      if (!isSpanElement(labelElement.lastElementChild)) {
        spanElement = document.createElement('span');
        optionEl.insertAdjacentElement('afterend', spanElement);
      } else {
        spanElement = labelElement.lastElementChild;
      }

      // Set the innerHTML of span element as the label text
      spanElement.innerHTML = label === undefined ? value : label;

      // Append the label element, which includes option element and
      // span element to the radio container element
      this.elt.appendChild(labelElement);

      return optionEl;
    };

    self.remove = function (value) {
      for (const optionEl of self._getOptionsArray()) {
        if (optionEl.value === value) {
          if (isLabelElement(optionEl.parentElement)) {
            // Remove parent label which also removes children elements
            optionEl.parentElement.remove();
          } else {
            // Remove the option input if parent label does not exist
            optionEl.remove();
          }
          return;
        }
      }
    };

    self.value = function () {
      let result = '';
      for (const option of self._getOptionsArray()) {
        if (option.checked) {
          result = option.value;
          break;
        }
      }
      return result;
    };

    self.selected = function (value) {
      let result = null;
      if (value === undefined) {
        for (const option of self._getOptionsArray()) {
          if (option.checked) {
            result = option;
            break;
          }
        }
      } else {
        // forEach loop to uncheck all radio buttons before
        // setting any one as checked.
        self._getOptionsArray().forEach(option => {
          option.checked = false;
          option.removeAttribute('checked');
        });

        for (const option of self._getOptionsArray()) {
          if (option.value === value) {
            option.setAttribute('checked', true);
            option.checked = true;
            result = option;
          }
        }
      }
      return result;
    };

    self.disable = function (shouldDisable = true) {
      for (const radioInput of self._getOptionsArray()) {
        radioInput.setAttribute('disabled', shouldDisable);
      }
    };

    return self;
  };

  /**
   * Creates a color picker element.
   *
   * The parameter, `value`, is optional. If a color string or
   * <a href="#/p5.Color">p5.Color</a> object is passed, it will set the default
   * color.
   *
   * Color pickers extend the <a href="#/p5.Element">p5.Element</a> class with a
   * couple of helpful methods for managing colors:
   * - `myPicker.value()` returns the current color as a hex string in the format `'#rrggbb'`.
   * - `myPicker.color()` returns the current color as a <a href="#/p5.Color">p5.Color</a> object.
   *
   * @method createColorPicker
   * @param {String|p5.Color} [value] default color as a <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color" target="_blank">CSS color string</a>.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let myPicker;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a color picker and set its position.
   *   myPicker = createColorPicker('deeppink');
   *   myPicker.position(0, 100);
   *
   *   describe('A pink square with a color picker beneath it. The square changes color when the user picks a new color.');
   * }
   *
   * function draw() {
   *   // Use the color picker to paint the background.
   *   let c = myPicker.color();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myPicker;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a color picker and set its position.
   *   myPicker = createColorPicker('deeppink');
   *   myPicker.position(0, 100);
   *
   *   describe('A number with the format "#rrggbb" is displayed on a pink canvas. The background color and number change when the user picks a new color.');
   * }
   *
   * function draw() {
   *   // Use the color picker to paint the background.
   *   let c = myPicker.value();
   *   background(c);
   *
   *   // Display the current color as a hex string.
   *   text(c, 25, 55);
   * }
   * </code>
   * </div>
   */
  fn.createColorPicker = function (value) {
    // p5._validateParameters('createColorPicker', arguments);
    // TODO: This implementation needs to be rechecked or reimplemented
    // The way it worked with color is a bit too complex
    const elt = document.createElement('input');
    let self;
    elt.type = 'color';
    if (value) {
      if (value instanceof p5.Color) {
        elt.value = value.toString('#rrggbb');
      } else {
        this.push();
        this.colorMode('rgb');
        elt.value = this.color(value).toString('#rrggbb');
        this.pop();
      }
    } else {
      elt.value = '#000000';
    }
    self = addElement(elt, this);
    // Method to return a p5.Color object for the given color.
    const inst = this;
    self.color = function () {
      inst.push();
      if (value) {
        if (value.mode) {
          inst.colorMode(value.mode, ...(value?.maxes ? value.maxes[value.mode] || [] : []));
        }
      }
      const c = inst.color(this.elt.value);
      inst.pop();
      return c;
    };
    return self;
  };

  /**
   * Creates a text `&lt;input&gt;&lt;/input&gt;` element.
   *
   * Call `myInput.size()` to set the length of the text box.
   *
   * The first parameter, `value`, is optional. It's a string that sets the
   * input's default value. The input is blank by default.
   *
   * The second parameter, `type`, is also optional. It's a string that
   * specifies the type of text being input. See MDN for a full
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input" target="_blank">list of options</a>.
   * The default is `'text'`.
   *
   * @method createInput
   * @param {String} [value] default value of the input box. Defaults to an empty string `''`.
   * @param {String} [type] type of input. Defaults to `'text'`.
   * @return {p5.Element} new <a href="#/p5.Element">p5.Element</a> object.
   *
   * @example
   * <div>
   * <code>
   * let myInput;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create an input element and place it
   *   // beneath the canvas.
   *   myInput = createInput();
   *   myInput.position(0, 100);
   *
   *   describe('A gray square with a text box beneath it. The text in the square changes when the user types something new in the input bar.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use the input to display a message.
   *   let msg = myInput.value();
   *   text(msg, 25, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myInput;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create an input element and place it
   *   // beneath the canvas. Set its default
   *   // text to "hello!".
   *   myInput = createInput('hello!');
   *   myInput.position(0, 100);
   *
   *   describe('The text "hello!" written at the center of a gray square. A text box beneath the square also says "hello!". The text in the square changes when the user types something new in the input bar.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use the input to display a message.
   *   let msg = myInput.value();
   *   text(msg, 25, 55);
   * }
   * </code>
   * </div>
   */
  /**
   * @method createInput
   * @param {String} [value]
   * @return {p5.Element}
   */
  fn.createInput = function (value = '', type = 'text') {
    // p5._validateParameters('createInput', arguments);
    let elt = document.createElement('input');
    elt.setAttribute('value', value);
    elt.setAttribute('type', type);
    return addElement(elt, this);
  };

  /**
   * Creates an `&lt;input&gt;&lt;/input&gt;` element of type `'file'`.
   *
   * `createFileInput()` allows users to select local files for use in a sketch.
   * It returns a <a href="#/p5.File">p5.File</a> object.
   *
   * The first parameter, `callback`, is a function that's called when the file
   * loads. The callback function should have one parameter, `file`, that's a
   * <a href="#/p5.File">p5.File</a> object.
   *
   * The second parameter, `multiple`, is optional. It's a boolean value that
   * allows loading multiple files if set to `true`. If `true`, `callback`
   * will be called once per file.
   *
   * @method createFileInput
   * @param  {Function} callback function to call once the file loads.
   * @param  {Boolean} [multiple] allow multiple files to be selected.
   * @return {p5.File} new <a href="#/p5.File">p5.File</a> object.
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to select an image to
   * // load and display.
   * let input;
   * let img;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a file input and place it beneath
   *   // the canvas.
   *   input = createFileInput(handleImage);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user selects an image file to load, it is displayed on the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the image if loaded.
   *   if (img) {
   *     image(img, 0, 0, width, height);
   *   }
   * }
   *
   * // Create an image if the file is an image.
   * function handleImage(file) {
   *   if (file.type === 'image') {
   *     img = createImg(file.data, '');
   *     img.hide();
   *   } else {
   *     img = null;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Use the file input to select multiple images
   * // to load and display.
   * let input;
   * let images = [];
   *
   * function setup() {
   *   // Create a file input and place it beneath
   *   // the canvas. Allow it to load multiple files.
   *   input = createFileInput(handleImage, true);
   *   input.position(0, 100);
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the images if loaded. Each image
   *   // is drawn 20 pixels lower than the
   *   // previous image.
   *   for (let i = 0; i < images.length; i += 1) {
   *     // Calculate the y-coordinate.
   *     let y = i * 20;
   *
   *     // Draw the image.
   *     image(img, 0, y, 100, 100);
   *   }
   *
   *   describe('A gray square with a file input beneath it. If the user selects multiple image files to load, they are displayed on the square.');
   * }
   *
   * // Create an image if the file is an image,
   * // then add it to the images array.
   * function handleImage(file) {
   *   if (file.type === 'image') {
   *     let img = createImg(file.data, '');
   *     img.hide();
   *     images.push(img);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.createFileInput = function (callback, multiple = false) {
    // p5._validateParameters('createFileInput', arguments);

    const handleFileSelect = function (event) {
      for (const file of event.target.files) {
        File._load(file, callback);
      }
    };

    // If File API's are not supported, throw Error
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      console.log(
        'The File APIs are not fully supported in this browser. Cannot create element.'
      );
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    if (multiple) fileInput.setAttribute('multiple', true);
    fileInput.addEventListener('change', handleFileSelect, false);
    return addElement(fileInput, this);
  };
}

export default dom;

if(typeof p5 !== 'undefined'){
  dom(p5, p5.prototype);
}
