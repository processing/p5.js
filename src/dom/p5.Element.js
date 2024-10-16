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

import p5 from '../core/main';

// =============================================================================
//                         p5.Element additions
// =============================================================================

/**
 * Calls a function when the element changes.
 *
 * Calling `myElement.changed(false)` disables the function.
 *
 * @method changed
 * @param  {Function|Boolean} fxn function to call when the element changes.
 *                                `false` disables the function.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let dropdown;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a dropdown menu and add a few color options.
 *   dropdown = createSelect();
 *   dropdown.position(0, 0);
 *   dropdown.option('red');
 *   dropdown.option('green');
 *   dropdown.option('blue');
 *
 *   // Call paintBackground() when the color option changes.
 *   dropdown.changed(paintBackground);
 *
 *   describe('A gray square with a dropdown menu at the top. The square changes color when an option is selected.');
 * }
 *
 * // Paint the background with the selected color.
 * function paintBackground() {
 *   let c = dropdown.value();
 *   background(c);
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
 *   background(200);
 *
 *   // Create a checkbox and place it beneath the canvas.
 *   checkbox = createCheckbox(' circle');
 *   checkbox.position(0, 100);
 *
 *   // Call repaint() when the checkbox changes.
 *   checkbox.changed(repaint);
 *
 *   describe('A gray square with a checkbox underneath it that says "circle". A white circle appears when the box is checked and disappears otherwise.');
 * }
 *
 * // Paint the background gray and determine whether to draw a circle.
 * function repaint() {
 *   background(200);
 *   if (checkbox.checked() === true) {
 *     circle(50, 50, 30);
 *   }
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.changed = function (fxn) {
  p5.Element._adjustListener('change', fxn, this);
  return this;
};

/**
 *
 * Adds a class to the element.
 *
 * @for p5.Element
 * @method addClass
 * @param  {String} class name of class to add.
 * @chainable
 *
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a div element.
 *   let div = createDiv('div');
 *
 *   // Add a class to the div.
 *   div.addClass('myClass');
 *
 *   describe('A gray square.');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.addClass = function (c) {
  if (this.elt.className) {
    if (!this.hasClass(c)) {
      this.elt.className = this.elt.className + ' ' + c;
    }
  } else {
    this.elt.className = c;
  }
  return this;
};

/**
 * Removes a class from the element.
 *
 * @method removeClass
 * @param  {String} class name of class to remove.
 * @chainable
 *
 * @example
 * <div class='norender'>
 * <code>
 * // In this example, a class is set when the div is created
 * // and removed when mouse is pressed. This could link up
 * // with a CSS style rule to toggle style properties.
 *
 * let div;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a div element.
 *   div = createDiv('div');
 *
 *   // Add a class to the div.
 *   div.addClass('myClass');
 *
 *   describe('A gray square.');
 * }
 *
 * // Remove 'myClass' from the div when the user presses the mouse.
 * function mousePressed() {
 *   div.removeClass('myClass');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.removeClass = function (c) {
  // Note: Removing a class that does not exist does NOT throw an error in classList.remove method
  this.elt.classList.remove(c);
  return this;
};

/**
 * Checks if a class is already applied to element.
 *
 * @method hasClass
 * @returns {boolean} a boolean value if element has specified class.
 * @param c {String} name of class to check.
 *
 * @example
 * <div class='norender'>
 * <code>
 * let div;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a div element.
 *   div = createDiv('div');
 *
 *   // Add the class 'show' to the div.
 *   div.addClass('show');
 *
 *   describe('A gray square.');
 * }
 *
 * // Toggle the class 'show' when the mouse is pressed.
 * function mousePressed() {
 *   if (div.hasClass('show')) {
 *     div.addClass('show');
 *   } else {
 *     div.removeClass('show');
 *   }
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.hasClass = function (c) {
  return this.elt.classList.contains(c);
};

/**
 * Toggles whether a class is applied to the element.
 *
 * @method toggleClass
 * @param c {String} class name to toggle.
 * @chainable
 *
 * @example
 * <div class='norender'>
 * <code>
 * let div;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a div element.
 *   div = createDiv('div');
 *
 *   // Add the 'show' class to the div.
 *   div.addClass('show');
 *
 *   describe('A gray square.');
 * }
 *
 * // Toggle the 'show' class when the mouse is pressed.
 * function mousePressed() {
 *   div.toggleClass('show');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.toggleClass = function (c) {
  // classList also has a toggle() method, but we cannot use that yet as support is unclear.
  // See https://github.com/processing/p5.js/issues/3631
  // this.elt.classList.toggle(c);
  if (this.elt.classList.contains(c)) {
    this.elt.classList.remove(c);
  } else {
    this.elt.classList.add(c);
  }
  return this;
};

/**
 * Attaches the element as a child of another element.
 *
 * `myElement.child()` accepts either a string ID, DOM node, or
 * <a href="#/p5.Element">p5.Element</a>. For example,
 * `myElement.child(otherElement)`. If no argument is provided, an array of
 * children DOM nodes is returned.
 *
 * @method child
 * @returns {Node[]} an array of child nodes.
 *
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div elements.
 *   let div0 = createDiv('Parent');
 *   let div1 = createDiv('Child');
 *
 *   // Make div1 the child of div0
 *   // using the p5.Element.
 *   div0.child(div1);
 *
 *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
 * }
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div elements.
 *   let div0 = createDiv('Parent');
 *   let div1 = createDiv('Child');
 *
 *   // Give div1 an ID.
 *   div1.id('apples');
 *
 *   // Make div1 the child of div0
 *   // using its ID.
 *   div0.child('apples');
 *
 *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
 * }
 * </code>
 * </div>
 *
 * <div class='norender notest'>
 * <code>
 * // This example assumes there is a div already on the page
 * // with id "myChildDiv".
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div elements.
 *   let div0 = createDiv('Parent');
 *
 *   // Select the child element by its ID.
 *   let elt = document.getElementById('myChildDiv');
 *
 *   // Make div1 the child of div0
 *   // using its HTMLElement object.
 *   div0.child(elt);
 *
 *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
 * }
 * </code>
 * </div>
 */
/**
 * @method child
 * @param  {String|p5.Element} [child] the ID, DOM node, or <a href="#/p5.Element">p5.Element</a>
 *                         to add to the current element
 * @chainable
 */
p5.Element.prototype.child = function (childNode) {
  if (typeof childNode === 'undefined') {
    return this.elt.childNodes;
  }
  if (typeof childNode === 'string') {
    if (childNode[0] === '#') {
      childNode = childNode.substring(1);
    }
    childNode = document.getElementById(childNode);
  } else if (childNode instanceof p5.Element) {
    childNode = childNode.elt;
  }

  if (childNode instanceof HTMLElement) {
    this.elt.appendChild(childNode);
  }
  return this;
};

/**
 * Centers the element either vertically, horizontally, or both.
 *
 * `center()` will center the element relative to its parent or according to
 * the page's body if the element has no parent.
 *
 * If no argument is passed, as in `myElement.center()` the element is aligned
 * both vertically and horizontally.
 *
 * @method center
 * @param  {String} [align] passing 'vertical', 'horizontal' aligns element accordingly
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div element and style it.
 *   let div = createDiv('');
 *   div.size(10, 10);
 *   div.style('background-color', 'orange');
 *
 *   // Center the div relative to the page's body.
 *   div.center();
 *
 *   describe('A gray square and an orange rectangle. The rectangle is at the center of the page.');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.center = function (align) {
  const style = this.elt.style.display;
  const hidden = this.elt.style.display === 'none';
  const parentHidden = this.parent().style.display === 'none';
  const pos = { x: this.elt.offsetLeft, y: this.elt.offsetTop };

  if (hidden) this.show();
  if (parentHidden) this.parent().show();
  this.elt.style.display = 'block';

  this.position(0, 0);
  const wOffset = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth);
  const hOffset = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight);

  if (align === 'both' || align === undefined) {
    this.position(
      wOffset / 2 + this.parent().offsetLeft,
      hOffset / 2 + this.parent().offsetTop
    );
  } else if (align === 'horizontal') {
    this.position(wOffset / 2 + this.parent().offsetLeft, pos.y);
  } else if (align === 'vertical') {
    this.position(pos.x, hOffset / 2 + this.parent().offsetTop);
  }

  this.style('display', style);
  if (hidden) this.hide();
  if (parentHidden) this.parent().hide();

  return this;
};

/**
 * Sets the inner HTML of the element, replacing any existing HTML.
 *
 * The second parameter, `append`, is optional. If `true` is passed, as in
 * `myElement.html('hi', true)`, the HTML is appended instead of replacing
 * existing HTML.
 *
 * If no arguments are passed, as in `myElement.html()`, the element's inner
 * HTML is returned.
 *
 * @for p5.Element
 * @method html
 * @returns {String} the inner HTML of the element
 *
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create the div element and set its size.
 *   let div = createDiv('');
 *   div.size(100, 100);
 *
 *   // Set the inner HTML to "hi".
 *   div.html('hi');
 *
 *   describe('A gray square with the word "hi" written beneath it.');
 * }
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div element and set its size.
 *   let div = createDiv('Hello ');
 *   div.size(100, 100);
 *
 *   // Append "World" to the div's HTML.
 *   div.html('World', true);
 *
 *   describe('A gray square with the text "Hello World" written beneath it.');
 * }
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create the div element.
 *   let div = createDiv('Hello');
 *
 *   // Prints "Hello" to the console.
 *   print(div.html());
 *
 *   describe('A gray square with the word "Hello!" written beneath it.');
 * }
 * </code>
 * </div>
 */
/**
 * @method html
 * @param  {String} [html] the HTML to be placed inside the element
 * @param  {Boolean} [append] whether to append HTML to existing
 * @chainable
 */
p5.Element.prototype.html = function (...args) {
  if (args.length === 0) {
    return this.elt.innerHTML;
  } else if (args[1]) {
    this.elt.insertAdjacentHTML('beforeend', args[0]);
    return this;
  } else {
    this.elt.innerHTML = args[0];
    return this;
  }
};

/**
 * Sets the element's position.
 *
 * The first two parameters, `x` and `y`, set the element's position relative
 * to the top-left corner of the web page.
 *
 * The third parameter, `positionType`, is optional. It sets the element's
 * <a target="_blank"
 * href="https://developer.mozilla.org/en-US/docs/Web/CSS/position">positioning scheme</a>.
 * `positionType` is a string that can be either `'static'`, `'fixed'`,
 * `'relative'`, `'sticky'`, `'initial'`, or `'inherit'`.
 *
 * If no arguments passed, as in `myElement.position()`, the method returns
 * the element's position in an object, as in `{ x: 0, y: 0 }`.
 *
 * @method position
 * @returns {Object} object of form `{ x: 0, y: 0 }` containing the element's position.
 *
 * @example
 * <div>
 * <code class='norender'>
 * function setup() {
 *   let cnv = createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Positions the canvas 50px to the right and 100px
 *   // below the top-left corner of the window.
 *   cnv.position(50, 100);
 *
 *   describe('A gray square that is 50 pixels to the right and 100 pixels down from the top-left corner of the web page.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code class='norender'>
 * function setup() {
 *   let cnv = createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Positions the canvas at the top-left corner
 *   // of the window with a 'fixed' position type.
 *   cnv.position(0, 0, 'fixed');
 *
 *   describe('A gray square in the top-left corner of the web page.');
 * }
 * </code>
 * </div>
 */
/**
 * @method position
 * @param  {Number} [x] x-position relative to top-left of window (optional)
 * @param  {Number} [y] y-position relative to top-left of window (optional)
 * @param  {String} [positionType] it can be static, fixed, relative, sticky, initial or inherit (optional)
 * @chainable
 */
p5.Element.prototype.position = function (...args) {
  if (args.length === 0) {
    return { x: this.elt.offsetLeft, y: this.elt.offsetTop };
  } else {
    let positionType = 'absolute';
    if (
      args[2] === 'static' ||
      args[2] === 'fixed' ||
      args[2] === 'relative' ||
      args[2] === 'sticky' ||
      args[2] === 'initial' ||
      args[2] === 'inherit'
    ) {
      positionType = args[2];
    }
    this.elt.style.position = positionType;
    this.elt.style.left = args[0] + 'px';
    this.elt.style.top = args[1] + 'px';
    this.x = args[0];
    this.y = args[1];
    return this;
  }
};

/* Helper method called by p5.Element.style() */
p5.Element.prototype._translate = function (...args) {
  this.elt.style.position = 'absolute';
  // save out initial non-translate transform styling
  let transform = '';
  if (this.elt.style.transform) {
    transform = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
    transform = transform.replace(/translate[X-Z]?\(.*\)/g, '');
  }
  if (args.length === 2) {
    this.elt.style.transform =
      'translate(' + args[0] + 'px, ' + args[1] + 'px)';
  } else if (args.length > 2) {
    this.elt.style.transform =
      'translate3d(' +
      args[0] +
      'px,' +
      args[1] +
      'px,' +
      args[2] +
      'px)';
    if (args.length === 3) {
      this.elt.parentElement.style.perspective = '1000px';
    } else {
      this.elt.parentElement.style.perspective = args[3] + 'px';
    }
  }
  // add any extra transform styling back on end
  this.elt.style.transform += transform;
  return this;
};

/* Helper method called by p5.Element.style() */
p5.Element.prototype._rotate = function (...args) {
  // save out initial non-rotate transform styling
  let transform = '';
  if (this.elt.style.transform) {
    transform = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
    transform = transform.replace(/rotate[X-Z]?\(.*\)/g, '');
  }

  if (args.length === 1) {
    this.elt.style.transform = 'rotate(' + args[0] + 'deg)';
  } else if (args.length === 2) {
    this.elt.style.transform =
      'rotate(' + args[0] + 'deg, ' + args[1] + 'deg)';
  } else if (args.length === 3) {
    this.elt.style.transform = 'rotateX(' + args[0] + 'deg)';
    this.elt.style.transform += 'rotateY(' + args[1] + 'deg)';
    this.elt.style.transform += 'rotateZ(' + args[2] + 'deg)';
  }
  // add remaining transform back on
  this.elt.style.transform += transform;
  return this;
};

/**
 * Applies a style to the element by adding a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax" target="_blank">CSS declaration</a>.
 *
 * The first parameter, `property`, is a string. If the name of a style
 * property is passed, as in `myElement.style('color')`, the method returns
 * the current value as a string or `null` if it hasn't been set. If a
 * `property:style` string is passed, as in
 * `myElement.style('color:deeppink')`, the method sets the style `property`
 * to `value`.
 *
 * The second parameter, `value`, is optional. It sets the property's value.
 * `value` can be a string, as in
 * `myElement.style('color', 'deeppink')`, or a
 * <a href="#/p5.Color">p5.Color</a> object, as in
 * `myElement.style('color', myColor)`.
 *
 * @method style
 * @param  {String} property style property to set.
 * @returns {String} value of the property.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a paragraph element and set its font color to "deeppink".
 *   let p = createP('p5*js');
 *   p.position(25, 20);
 *   p.style('color', 'deeppink');
 *
 *   describe('The text p5*js written in pink on a gray background.');
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
 *   // Create a p5.Color object.
 *   let c = color('deeppink');
 *
 *   // Create a paragraph element and set its font color using a p5.Color object.
 *   let p = createP('p5*js');
 *   p.position(25, 20);
 *   p.style('color', c);
 *
 *   describe('The text p5*js written in pink on a gray background.');
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
 *   // Create a paragraph element and set its font color to "deeppink"
 *   // using property:value syntax.
 *   let p = createP('p5*js');
 *   p.position(25, 20);
 *   p.style('color:deeppink');
 *
 *   describe('The text p5*js written in pink on a gray background.');
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
 *   // Create an empty paragraph element and set its font color to "deeppink".
 *   let p = createP();
 *   p.position(5, 5);
 *   p.style('color', 'deeppink');
 *
 *   // Get the element's color as an  RGB color string.
 *   let c = p.style('color');
 *
 *   // Set the element's inner HTML using the RGB color string.
 *   p.html(c);
 *
 *   describe('The text "rgb(255, 20, 147)" written in pink on a gray background.');
 * }
 * </code>
 * </div>
 */
/**
 * @method style
 * @param  {String} property
 * @param  {String|p5.Color} value value to assign to the property.
 * @return {String} value of the property.
 * @chainable
 */
p5.Element.prototype.style = function (prop, val) {
  const self = this;

  if (val instanceof p5.Color) {
    val =
      'rgba(' +
      val.levels[0] +
      ',' +
      val.levels[1] +
      ',' +
      val.levels[2] +
      ',' +
      val.levels[3] / 255 +
      ')';
  }

  if (typeof val === 'undefined') {
    if (prop.indexOf(':') === -1) {
      // no value set, so assume requesting a value
      let styles = window.getComputedStyle(self.elt);
      let style = styles.getPropertyValue(prop);
      return style;
    } else {
      // value set using `:` in a single line string
      const attrs = prop.split(';');
      for (let i = 0; i < attrs.length; i++) {
        const parts = attrs[i].split(':');
        if (parts[0] && parts[1]) {
          this.elt.style[parts[0].trim()] = parts[1].trim();
        }
      }
    }
  } else {
    // input provided as key,val pair
    this.elt.style[prop] = val;
    if (
      prop === 'width' ||
      prop === 'height' ||
      prop === 'left' ||
      prop === 'top'
    ) {
      let styles = window.getComputedStyle(self.elt);
      let styleVal = styles.getPropertyValue(prop);
      let numVal = styleVal.replace(/[^\d.]/g, '');
      this[prop] = Math.round(parseFloat(numVal, 10));
    }
  }
  return this;
};

/**
 * Adds an
 * <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started#attributes" target="_blank">attribute</a>
 * to the element.
 *
 * This method is useful for advanced tasks. Most commonly-used attributes,
 * such as `id`, can be set with their dedicated methods. For example,
 * `nextButton.id('next')` sets an element's `id` attribute. Calling
 * `nextButton.attribute('id', 'next')` has the same effect.
 *
 * The first parameter, `attr`, is the attribute's name as a string. Calling
 * `myElement.attribute('align')` returns the attribute's current value as a
 * string or `null` if it hasn't been set.
 *
 * The second parameter, `value`, is optional. It's a string used to set the
 * attribute's value. For example, calling
 * `myElement.attribute('align', 'center')` sets the element's horizontal
 * alignment to `center`.
 *
 * @method attribute
 * @return {String} value of the attribute.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a container div element and place it at the top-left corner.
 *   let container = createDiv();
 *   container.position(0, 0);
 *
 *   // Create a paragraph element and place it within the container.
 *   // Set its horizontal alignment to "left".
 *   let p1 = createP('hi');
 *   p1.parent(container);
 *   p1.attribute('align', 'left');
 *
 *   // Create a paragraph element and place it within the container.
 *   // Set its horizontal alignment to "center".
 *   let p2 = createP('hi');
 *   p2.parent(container);
 *   p2.attribute('align', 'center');
 *
 *   // Create a paragraph element and place it within the container.
 *   // Set its horizontal alignment to "right".
 *   let p3 = createP('hi');
 *   p3.parent(container);
 *   p3.attribute('align', 'right');
 *
 *   describe('A gray square with the text "hi" written on three separate lines, each placed further to the right.');
 * }
 * </code>
 * </div>
 */
/**
 * @method attribute
 * @param  {String} attr       attribute to set.
 * @param  {String} value      value to assign to the attribute.
 * @chainable
 */
p5.Element.prototype.attribute = function (attr, value) {
  //handling for checkboxes and radios to ensure options get
  //attributes not divs
  if (
    this.elt.firstChild != null &&
    (this.elt.firstChild.type === 'checkbox' ||
      this.elt.firstChild.type === 'radio')
  ) {
    if (typeof value === 'undefined') {
      return this.elt.firstChild.getAttribute(attr);
    } else {
      for (let i = 0; i < this.elt.childNodes.length; i++) {
        this.elt.childNodes[i].setAttribute(attr, value);
      }
    }
  } else if (typeof value === 'undefined') {
    return this.elt.getAttribute(attr);
  } else {
    this.elt.setAttribute(attr, value);
    return this;
  }
};

/**
 * Removes an attribute from the element.
 *
 * The parameter `attr` is the attribute's name as a string. For example,
 * calling `myElement.removeAttribute('align')` removes its `align`
 * attribute if it's been set.
 *
 * @method removeAttribute
 * @param  {String} attr       attribute to remove.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let p;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a paragraph element and place it in the center of the canvas.
 *   // Set its "align" attribute to "center".
 *   p = createP('hi');
 *   p.position(0, 20);
 *   p.attribute('align', 'center');
 *
 *   describe('The text "hi" written in black at the center of a gray square. The text moves to the left edge when double-clicked.');
 * }
 *
 * // Remove the 'align' attribute when the user double-clicks the paragraph.
 * function doubleClicked() {
 *   p.removeAttribute('align');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.removeAttribute = function (attr) {
  if (
    this.elt.firstChild != null &&
    (this.elt.firstChild.type === 'checkbox' ||
      this.elt.firstChild.type === 'radio')
  ) {
    for (let i = 0; i < this.elt.childNodes.length; i++) {
      this.elt.childNodes[i].removeAttribute(attr);
    }
  }
  this.elt.removeAttribute(attr);
  return this;
};

/**
 * Returns or sets the element's value.
 *
 * Calling `myElement.value()` returns the element's current value.
 *
 * The parameter, `value`, is an optional number or string. If provided,
 * as in `myElement.value(123)`, it's used to set the element's value.
 *
 * @method value
 * @return {String|Number} value of the element.
 *
 * @example
 * <div>
 * <code>
 * let input;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a text input and place it beneath the canvas.
 *   // Set its default value to "hello".
 *   input = createInput('hello');
 *   input.position(0, 100);
 *
 *   describe('The text from an input box is displayed on a gray square.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Use the input's value to display a message.
 *   let msg = input.value();
 *   text(msg, 0, 55);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let input;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a text input and place it beneath the canvas.
 *   // Set its default value to "hello".
 *   input = createInput('hello');
 *   input.position(0, 100);
 *
 *   describe('The text from an input box is displayed on a gray square. The text resets to "hello" when the user double-clicks the square.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Use the input's value to display a message.
 *   let msg = input.value();
 *   text(msg, 0, 55);
 * }
 *
 * // Reset the input's value.
 * function doubleClicked() {
 *   input.value('hello');
 * }
 * </code>
 * </div>
 */
/**
 * @method value
 * @param  {String|Number}     value
 * @chainable
 */
p5.Element.prototype.value = function (...args) {
  if (args.length > 0) {
    this.elt.value = args[0];
    return this;
  } else {
    if (this.elt.type === 'range') {
      return parseFloat(this.elt.value);
    } else return this.elt.value;
  }
};

/**
 * Shows the current element.
 *
 * @method show
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let p;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a paragraph element and hide it.
 *   p = createP('p5*js');
 *   p.position(10, 10);
 *   p.hide();
 *
 *   describe('A gray square. The text "p5*js" appears when the user double-clicks the square.');
 * }
 *
 * // Show the paragraph when the user double-clicks.
 * function doubleClicked() {
 *   p.show();
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.show = function () {
  this.elt.style.display = 'block';
  return this;
};

/**
 * Hides the current element.
 *
 * @method hide
 * @chainable
 *
 * @example
 * let p;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a paragraph element.
 *   p = createP('p5*js');
 *   p.position(10, 10);
 *
 *   describe('The text "p5*js" at the center of a gray square. The text disappears when the user double-clicks the square.');
 * }
 *
 * // Hide the paragraph when the user double-clicks.
 * function doubleClicked() {
 *   p.hide();
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.hide = function () {
  this.elt.style.display = 'none';
  return this;
};

/**
 * Sets the element's width and height.
 *
 * Calling `myElement.size()` without an argument returns the element's size
 * as an object with the properties `width` and `height`. For example,
 *  `{ width: 20, height: 10 }`.
 *
 * The first parameter, `width`, is optional. It's a number used to set the
 * element's width. Calling `myElement.size(10)`
 *
 * The second parameter, 'height`, is also optional. It's a
 * number used to set the element's height. For example, calling
 * `myElement.size(20, 10)` sets the element's width to 20 pixels and height
 * to 10 pixels.
 *
 * The constant `AUTO` can be used to adjust one dimension at a time while
 * maintaining the aspect ratio, which is `width / height`. For example,
 * consider an element that's 200 pixels wide and 100 pixels tall. Calling
 * `myElement.size(20, AUTO)` sets the width to 20 pixels and height to 10
 * pixels.
 *
 * Note: In the case of elements that need to load data, such as images, wait
 * to call `myElement.size()` until after the data loads.
 *
 * @method size
 * @return {Object} width and height of the element in an object.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a pink div element and place it at the top-left corner.
 *   let div = createDiv();
 *   div.position(10, 10);
 *   div.style('background-color', 'deeppink');
 *
 *   // Set the div's width to 80 pixels and height to 20 pixels.
 *   div.size(80, 20);
 *
 *   describe('A gray square with a pink rectangle near its top.');
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
 *   // Create a pink div element and place it at the top-left corner.
 *   let div = createDiv();
 *   div.position(10, 10);
 *   div.style('background-color', 'deeppink');
 *
 *   // Set the div's width to 80 pixels and height to 40 pixels.
 *   div.size(80, 40);
 *
 *   // Get the div's size as an object.
 *   let s = div.size();
 *
 *   // Display the div's dimensions.
 *   div.html(`${s.width} x ${s.height}`);
 *
 *   describe('A gray square with a pink rectangle near its top. The text "80 x 40" is written within the rectangle.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img1;
 * let img2;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Load an image of an astronaut on the moon
 *   // and place it at the top-left of the canvas.
 *   img1 = createImg(
 *     'assets/moonwalk.jpg',
 *     'An astronaut walking on the moon',
 *     ''
 *   );
 *   img1.position(0, 0);
 *
 *   // Load an image of an astronaut on the moon
 *   // and place it at the top-left of the canvas.
 *   // Resize the image once it's loaded.
 *   img2 = createImg(
 *     'assets/moonwalk.jpg',
 *     'An astronaut walking on the moon',
 *     '',
 *     resizeImage
 *   );
 *   img2.position(0, 0);
 *
 *   describe('A gray square two copies of a space image at the top-left. The copy in front is smaller.');
 * }
 *
 * // Resize img2 and keep its aspect ratio.
 * function resizeImage() {
 *   img2.size(50, AUTO);
 * }
 * </code>
 * </div>
 */
/**
 * @method size
 * @param  {(Number|AUTO)} [w]   width of the element, either AUTO, or a number.
 * @param  {(Number|AUTO)} [h] height of the element, either AUTO, or a number.
 * @chainable
 */
p5.Element.prototype.size = function (w, h) {
  if (arguments.length === 0) {
    return { width: this.elt.offsetWidth, height: this.elt.offsetHeight };
  } else {
    let aW = w;
    let aH = h;
    const AUTO = p5.prototype.AUTO;
    if (aW !== AUTO || aH !== AUTO) {
      if (aW === AUTO) {
        aW = h * this.width / this.height;
      } else if (aH === AUTO) {
        aH = w * this.height / this.width;
      }
      // set diff for cnv vs normal div
      if (this.elt instanceof HTMLCanvasElement) {
        const j = {};
        const k = this.elt.getContext('2d');
        let prop;
        for (prop in k) {
          j[prop] = k[prop];
        }
        this.elt.setAttribute('width', aW * this._pInst._pixelDensity);
        this.elt.setAttribute('height', aH * this._pInst._pixelDensity);
        this.elt.style.width = aW + 'px';
        this.elt.style.height = aH + 'px';
        this._pInst.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
        for (prop in j) {
          this.elt.getContext('2d')[prop] = j[prop];
        }
      } else {
        this.elt.style.width = aW + 'px';
        this.elt.style.height = aH + 'px';
        this.elt.width = aW;
        this.elt.height = aH;
      }
      this.width = aW;
      this.height = aH;
      if (this._pInst && this._pInst._curElement) {
        // main canvas associated with p5 instance
        if (this._pInst._curElement.elt === this.elt) {
          this._pInst.width = aW;
          this._pInst.height = aH;
        }
      }
    }
    return this;
  }
};

/**
 * Removes the element, stops all audio/video streams, and removes all
 * callback functions.
 *
 * @method remove
 *
 * @example
 * <div>
 * <code>
 * let p;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a paragraph element.
 *   p = createP('p5*js');
 *   p.position(10, 10);
 *
 *   describe('The text "p5*js" written at the center of a gray square. ');
 * }
 *
 * // Remove the paragraph when the user double-clicks.
 * function doubleClicked() {
 *   p.remove();
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.remove = function () {
  // stop all audios/videos and detach all devices like microphone/camera etc
  // used as input/output for audios/videos.
  if (this instanceof p5.MediaElement) {
    this.stop();
    const sources = this.elt.srcObject;
    if (sources !== null) {
      const tracks = sources.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }
  }

  // delete the reference in this._pInst._elements
  const index = this._pInst._elements.indexOf(this);
  if (index !== -1) {
    this._pInst._elements.splice(index, 1);
  }

  // deregister events
  for (let ev in this._events) {
    this.elt.removeEventListener(ev, this._events[ev]);
  }
  if (this.elt && this.elt.parentNode) {
    this.elt.parentNode.removeChild(this.elt);
  }
};

/**
 * Calls a function when the user drops a file on the element.
 *
 * The first parameter, `callback`, is a function to call once the file loads.
 * The callback function should have one parameter, `file`, that's a
 * <a href="#/p5.File">p5.File</a> object. If the user drops multiple files on
 * the element, `callback`, is called once for each file.
 *
 * The second parameter, `fxn`, is a function to call when the browser detects
 * one or more dropped files. The callback function should have one
 * parameter, `event`, that's a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DragEvent">DragEvent</a>.
 *
 * @method drop
 * @param  {Function} callback  called when a file loads. Called once for each file dropped.
 * @param  {Function} [fxn]     called once when any files are dropped.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Drop an image on the canvas to view
 * // this example.
 * let img;
 *
 * function setup() {
 *   let c = createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Call handleFile() when a file that's dropped on the canvas has loaded.
 *   c.drop(handleFile);
 *
 *   describe('A gray square. When the user drops an image on the square, it is displayed.');
 * }
 *
 * // Remove the existing image and display the new one.
 * function handleFile(file) {
 *   // Remove the current image, if any.
 *   if (img) {
 *     img.remove();
 *   }
 *
 *   // Create an <img> element with the
 *   // dropped file.
 *   img = createImg(file.data, '');
 *   img.hide();
 *
 *   // Draw the image.
 *   image(img, 0, 0, width, height);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Drop an image on the canvas to view
 * // this example.
 * let img;
 * let msg;
 *
 * function setup() {
 *   let c = createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Call functions when the user drops a file on the canvas
 *   // and when the file loads.
 *   c.drop(handleFile, handleDrop);
 *
 *   describe('A gray square. When the user drops an image on the square, it is displayed. The id attribute of canvas element is also displayed.');
 * }
 *
 * // Display the image when it loads.
 * function handleFile(file) {
 *   // Remove the current image, if any.
 *   if (img) {
 *     img.remove();
 *   }
 *
 *   // Create an img element with the dropped file.
 *   img = createImg(file.data, '');
 *   img.hide();
 *
 *   // Draw the image.
 *   image(img, 0, 0, width, height);
 * }
 *
 * // Display the file's name when it loads.
 * function handleDrop(event) {
 *   // Remove current paragraph, if any.
 *   if (msg) {
 *     msg.remove();
 *   }
 *
 *   // Use event to get the drop target's id.
 *   let id = event.target.id;
 *
 *   // Write the canvas' id beneath it.
 *   msg = createP(id);
 *   msg.position(0, 100);
 *
 *   // Set the font color randomly for each drop.
 *   let c = random(['red', 'green', 'blue']);
 *   msg.style('color', c);
 *   msg.style('font-size', '12px');
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.drop = function (callback, fxn) {
  // Is the file stuff supported?
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    if (!this._dragDisabled) {
      this._dragDisabled = true;

      const preventDefault = function (evt) {
        evt.preventDefault();
      };

      // If you want to be able to drop you've got to turn off
      // a lot of default behavior.
      // avoid `attachListener` here, since it overrides other handlers.
      this.elt.addEventListener('dragover', preventDefault);

      // If this is a drag area we need to turn off the default behavior
      this.elt.addEventListener('dragleave', preventDefault);
    }

    // Deal with the files
    p5.Element._attachListener(
      'drop',
      function (evt) {
        evt.preventDefault();
        // Call the second argument as a callback that receives the raw drop event
        if (typeof fxn === 'function') {
          fxn.call(this, evt);
        }
        // A FileList
        const files = evt.dataTransfer.files;

        // Load each one and trigger the callback
        for (const f of files) {
          p5.File._load(f, callback);
        }
      },
      this
    );
  } else {
    console.log('The File APIs are not fully supported in this browser.');
  }

  return this;
};

/**
 * Makes the element draggable.
 *
 * The parameter, `elmnt`, is optional. If another
 * <a href="#/p5.Element">p5.Element</a> object is passed, as in
 * `myElement.draggable(otherElement)`, the other element will become draggable.
 *
 * @method draggable
 * @param  {p5.Element} [elmnt]  another <a href="#/p5.Element">p5.Element</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let stickyNote;
 * let textInput;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a div element and style it.
 *   stickyNote = createDiv('Note');
 *   stickyNote.position(5, 5);
 *   stickyNote.size(80, 20);
 *   stickyNote.style('font-size', '16px');
 *   stickyNote.style('font-family', 'Comic Sans MS');
 *   stickyNote.style('background', 'orchid');
 *   stickyNote.style('padding', '5px');
 *
 *   // Make the note draggable.
 *   stickyNote.draggable();
 *
 *   // Create a panel div and style it.
 *   let panel = createDiv('');
 *   panel.position(5, 40);
 *   panel.size(80, 50);
 *   panel.style('background', 'orchid');
 *   panel.style('font-size', '16px');
 *   panel.style('padding', '5px');
 *   panel.style('text-align', 'center');
 *
 *   // Make the panel draggable.
 *   panel.draggable();
 *
 *   // Create a text input and style it.
 *   textInput = createInput('Note');
 *   textInput.size(70);
 *
 *   // Add the input to the panel.
 *   textInput.parent(panel);
 *
 *   // Call handleInput() when text is input.
 *   textInput.input(handleInput);
 *
 *   describe(
 *     'A gray square with two purple rectangles that move when dragged. The top rectangle displays the text that is typed into the bottom rectangle.'
 *   );
 * }
 *
 * // Update stickyNote's HTML when text is input.
 * function handleInput() {
 *   stickyNote.html(textInput.value());
 * }
 * </code>
 * </div>
 */
p5.Element.prototype.draggable = function (elmMove) {
  let isTouch = 'ontouchstart' in window;

  let x = 0,
    y = 0,
    px = 0,
    py = 0,
    elmDrag,
    dragMouseDownEvt = isTouch ? 'touchstart' : 'mousedown',
    closeDragElementEvt = isTouch ? 'touchend' : 'mouseup',
    elementDragEvt = isTouch ? 'touchmove' : 'mousemove';

  if (elmMove === undefined) {
    elmMove = this.elt;
    elmDrag = elmMove;
  } else if (elmMove !== this.elt && elmMove.elt !== this.elt) {
    elmMove = elmMove.elt;
    elmDrag = this.elt;
  }

  elmDrag.addEventListener(dragMouseDownEvt, dragMouseDown, false);
  elmDrag.style.cursor = 'move';

  function dragMouseDown(e) {
    e = e || window.event;

    if (isTouch) {
      const touches = e.changedTouches;
      px = parseInt(touches[0].clientX);
      py = parseInt(touches[0].clientY);
    } else {
      px = parseInt(e.clientX);
      py = parseInt(e.clientY);
    }

    document.addEventListener(closeDragElementEvt, closeDragElement, false);
    document.addEventListener(elementDragEvt, elementDrag, false);
    return false;
  }

  function elementDrag(e) {
    e = e || window.event;

    if (isTouch) {
      const touches = e.changedTouches;
      x = px - parseInt(touches[0].clientX);
      y = py - parseInt(touches[0].clientY);
      px = parseInt(touches[0].clientX);
      py = parseInt(touches[0].clientY);
    } else {
      x = px - parseInt(e.clientX);
      y = py - parseInt(e.clientY);
      px = parseInt(e.clientX);
      py = parseInt(e.clientY);
    }

    elmMove.style.left = elmMove.offsetLeft - x + 'px';
    elmMove.style.top = elmMove.offsetTop - y + 'px';
  }

  function closeDragElement() {
    document.removeEventListener(closeDragElementEvt, closeDragElement, false);
    document.removeEventListener(elementDragEvt, elementDrag, false);
  }

  return this;
};

/*** SCHEDULE EVENTS ***/

// Cue inspired by JavaScript setTimeout, and the
// Tone.js Transport Timeline Event, MIT License Yotam Mann 2015 tonejs.org
// eslint-disable-next-line no-unused-vars
class Cue {
  constructor(callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  }
}

export default p5;
