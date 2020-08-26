/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
const descContainer = '_Description'; //Fallback container
const fallbackDescId = '_fallbackDesc'; //Fallback description
const fallbackTableId = '_fallbackTable'; //Fallback Table
const fallbackTableElId = '_fte_'; //Fallback Table Element
const labelContainer = '_Label'; //Label container
const labelDescId = '_labelDesc'; //Label description
const labelTableId = '_labelTable'; //Label Table
const labelTableElId = '_lte_'; //Label Table Element

/**
 * Creates a screen reader accessible description for the canvas.
 * The first parameter should be a string with a description of the canvas.
 * The second parameter is optional. If specified, it determines how the
 * description is displayed.
 *
 * <code class="language-javascript">describe(text, LABEL)</code> displays
 * the description to all users as a <a
 * href="https://en.wikipedia.org/wiki/Museum_label" target="_blank">
 * tombstone or exhibit label/caption</a> in a
 * <code class="language-javascript">&lt;div class="p5Label"&gt;&lt;/div&gt;</code>
 * adjacent to the canvas. You can style it as you wish in your CSS.
 *
 * <code class="language-javascript">describe(text, FALLBACK)</code> makes the
 * description accessible to screen-reader users only, in
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
 * a sub DOM inside the canvas element</a>. If a second parameter is not
 * specified, by default, the description will only be available to
 * screen-reader users.
 *
 * @method describe
 * @param  {String} text      description of the canvas
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * describe('pink square with red heart in the bottom right corner', LABEL);
 * background('pink');
 * fill('red');
 * noStroke();
 * ellipse(67, 67, 20, 20);
 * ellipse(83, 67, 20, 20);
 * triangle(91, 73, 75, 95, 59, 73);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = 0;
 * function draw() {
 *   if (x > 100) {
 *     x = 0;
 *   }
 *   background(220);
 *   fill(0, 255, 0);
 *   ellipse(x, 50, 40, 40);
 *   x = x + 0.1;
 *   describe('green circle at x pos ' + round(x) + ' moving to the right');
 * }
 * </code>
 * </div>
 *
 */

p5.prototype.describe = function(text, display) {
  p5._validateParameters('describe', arguments);
  if (typeof text !== 'string') {
    return;
  }
  const cnvId = this.canvas.id;
  //calls function that adds punctuation for better screen reading
  text = _descriptionText(text);
  //if there is no dummyDOM
  if (!this.dummyDOM) {
    this.dummyDOM = document.getElementById(cnvId).parentNode;
  }
  if (!this.descriptions) {
    this.descriptions = {};
  }
  //check if html structure for description is ready
  if (this.descriptions.fallback) {
    //check if text is different from current description
    if (this.descriptions.fallback.innerHTML !== text) {
      //update description
      this.descriptions.fallback.innerHTML = text;
    }
  } else {
    //create fallback html structure
    this._describeHTML('fallback', text);
  }
  //if display is LABEL
  if (display === this.LABEL) {
    //check if html structure for label is ready
    if (this.descriptions.label) {
      //check if text is different from current label
      if (this.descriptions.label.innerHTML !== text) {
        //update label description
        this.descriptions.label.innerHTML = text;
      }
    } else {
      //create label html structure
      this._describeHTML('label', text);
    }
  }
};

/**
 * This function creates a screen-reader accessible
 * description for elements —shapes or groups of shapes that create
 * meaning together— in the canvas. The first paramater should
 * be the name of the element. The second parameter should be a string
 * with a description of the element. The third parameter is optional.
 * If specified, it determines how the element description is displayed.
 *
 * <code class="language-javascript">describeElement(name, text, LABEL)</code>
 * displays the element description to all users as a
 * <a href="https://en.wikipedia.org/wiki/Museum_label" target="_blank">
 * tombstone or exhibit label/caption</a> in a
 * <code class="language-javascript">&lt;div class="p5Label"&gt;&lt;/div&gt;</code>
 * adjacent to the canvas. You can style it as you wish in your CSS.
 *
 * <code class="language-javascript">describeElement(name, text, FALLBACK)</code>
 * makes the element description accessible to screen-reader users
 * only, in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
 * a sub DOM inside the canvas element</a>. If a second parameter is not
 * specified, by default, the element description will only be available
 * to screen-reader users.
 *
 * @method describeElement
 * @param  {String} name      name of the element
 * @param  {String} text      description of the element
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * describe('Heart and yellow circle over pink background', LABEL);
 * noStroke();
 * background('pink');
 * describeElement('Circle', 'Yellow circle in the top left corner', LABEL);
 * fill('yellow');
 * ellipse(25, 25, 40, 40);
 * describeElement('Heart', 'red heart in the bottom right corner', LABEL);
 * fill('red');
 * ellipse(66.6, 66.6, 20, 20);
 * ellipse(83.2, 66.6, 20, 20);
 * triangle(91.2, 72.6, 75, 95, 58.6, 72.6);
 * </code>
 * </div>
 */

p5.prototype.describeElement = function(name, text, display) {
  p5._validateParameters('describeElement', arguments);
  if (typeof text !== 'string' || typeof name !== 'string') {
    return;
  }
  const cnvId = this.canvas.id;
  //calls function that adds punctuation for better screen reading
  text = _descriptionText(text);
  //calls function that adds punctuation for better screen reading
  let elementName = _elementName(name);
  //remove any special characters from name to use it as html id
  name = name.replace(/[^a-zA-Z0-9 ]/g, '');
  //store element description
  let inner = `<th scope="row">${elementName}</th><td>${text}</td>`;
  //if there is no dummyDOM
  if (!this.dummyDOM) {
    this.dummyDOM = document.getElementById(cnvId).parentNode;
  }
  if (!this.descriptions) {
    this.descriptions = { fallbackElements: {} };
  } else if (!this.descriptions.fallbackElements) {
    this.descriptions.fallbackElements = {};
  }
  //check if html structure for element description is ready
  if (this.descriptions.fallbackElements[name]) {
    //if current element description is not the same as inner
    if (this.descriptions.fallbackElements[name].innerHTML !== inner) {
      //update element description
      this.descriptions.fallbackElements[name].innerHTML = inner;
    }
  } else {
    //create fallback html structure
    this._describeElementHTML('fallback', name, inner);
  }
  //if display is LABEL
  if (display === this.LABEL) {
    if (!this.descriptions.labelElements) {
      this.descriptions.labelElements = {};
    }
    //if html structure for label element description is ready
    if (this.descriptions.labelElements[name]) {
      //if label element description is different
      if (this.descriptions.labelElements[name].innerHTML !== inner) {
        //update label element description
        this.descriptions.labelElements[name].innerHTML = inner;
      }
    } else {
      //create label element html structure
      this._describeElementHTML('label', name, inner);
    }
  }
};

/*
 *
 * Helper functions for describe() and describeElement().
 *
 */

// check that text is not LABEL or FALLBACK and ensure text ends with punctuation mark
function _descriptionText(text) {
  if (text === 'label' || text === 'fallback') {
    throw new Error('description should not be LABEL or FALLBACK');
  }
  //if string does not end with '.'
  if (
    !text.endsWith('.') &&
    !text.endsWith(';') &&
    !text.endsWith(',') &&
    !text.endsWith('?') &&
    !text.endsWith('!')
  ) {
    //add '.' to the end of string
    text = text + '.';
  }
  return text;
}

/*
 * Helper functions for describe()
 */

//creates HTML structure for canvas descriptions
p5.prototype._describeHTML = function(type, text) {
  const cnvId = this.canvas.id;
  if (type === 'fallback') {
    //if there is no description container
    if (!this.dummyDOM.querySelector(`#${cnvId + descContainer}`)) {
      //if there are no accessible outputs (see textOutput() and gridOutput())
      let html = `<div id="${cnvId}${descContainer}" role="region" aria-label="Canvas Description"><p id="${cnvId}${fallbackDescId}"></p></div>`;
      if (!this.dummyDOM.querySelector(`#${cnvId}accessibleOutput`)) {
        //create description container + <p> for fallback description
        this.dummyDOM.querySelector(`#${cnvId}`).innerHTML = html;
      } else {
        //create description container + <p> for fallback description before outputs
        this.dummyDOM
          .querySelector(`#${cnvId}accessibleOutput`)
          .insertAdjacentHTML('beforebegin', html);
      }
    } else {
      //if describeElement() has already created the container and added a table of elements
      //create fallback description <p> before the table
      this.dummyDOM
        .querySelector('#' + cnvId + fallbackTableId)
        .insertAdjacentHTML(
          'beforebegin',
          `<p id="${cnvId + fallbackDescId}"></p>`
        );
    }
    //if the container for the description exists
    this.descriptions.fallback = this.dummyDOM.querySelector(
      `#${cnvId}${fallbackDescId}`
    );
    this.descriptions.fallback.innerHTML = text;
    return;
  } else if (type === 'label') {
    //if there is no label container
    if (!this.dummyDOM.querySelector(`#${cnvId + labelContainer}`)) {
      let html = `<div id="${cnvId}${labelContainer}" class="p5Label"><p id="${cnvId}${labelDescId}"></p></div>`;
      //if there are no accessible outputs (see textOutput() and gridOutput())
      if (!this.dummyDOM.querySelector(`#${cnvId}accessibleOutputLabel`)) {
        //create label container + <p> for label description
        this.dummyDOM
          .querySelector('#' + cnvId)
          .insertAdjacentHTML('afterend', html);
      } else {
        //create label container + <p> for label description before outputs
        this.dummyDOM
          .querySelector(`#${cnvId}accessibleOutputLabel`)
          .insertAdjacentHTML('beforebegin', html);
      }
    } else if (this.dummyDOM.querySelector(`#${cnvId + labelTableId}`)) {
      //if describeElement() has already created the container and added a table of elements
      //create label description <p> before the table
      this.dummyDOM
        .querySelector(`#${cnvId + labelTableId}`)
        .insertAdjacentHTML(
          'beforebegin',
          `<p id="${cnvId}${labelDescId}"></p>`
        );
    }
    this.descriptions.label = this.dummyDOM.querySelector(
      '#' + cnvId + labelDescId
    );
    this.descriptions.label.innerHTML = text;
    return;
  }
};

/*
 * Helper functions for describeElement().
 */

//check that name is not LABEL or FALLBACK and ensure text ends with colon
function _elementName(name) {
  if (name === 'label' || name === 'fallback') {
    throw new Error('element name should not be LABEL or FALLBACK');
  }
  //check if last character of string n is '.', ';', or ','
  if (name.endsWith('.') || name.endsWith(';') || name.endsWith(',')) {
    //replace last character with ':'
    name = name.replace(/.$/, ':');
  } else if (!name.endsWith(':')) {
    //if string n does not end with ':'
    //add ':'' at the end of string
    name = name + ':';
  }
  return name;
}

//creates HTML structure for element descriptions
p5.prototype._describeElementHTML = function(type, name, text) {
  const cnvId = this.canvas.id;
  if (type === 'fallback') {
    //if there is no description container
    if (!this.dummyDOM.querySelector(`#${cnvId + descContainer}`)) {
      //if there are no accessible outputs (see textOutput() and gridOutput())
      let html = `<div id="${cnvId}${descContainer}" role="region" aria-label="Canvas Description"><table id="${cnvId}${fallbackTableId}"><caption>Canvas elements and their descriptions</caption></table></div>`;
      if (!this.dummyDOM.querySelector(`#${cnvId}accessibleOutput`)) {
        //create container + table for element descriptions
        this.dummyDOM.querySelector('#' + cnvId).innerHTML = html;
      } else {
        //create container + table for element descriptions before outputs
        this.dummyDOM
          .querySelector(`#${cnvId}accessibleOutput`)
          .insertAdjacentHTML('beforebegin', html);
      }
    } else if (!this.dummyDOM.querySelector('#' + cnvId + fallbackTableId)) {
      //if describe() has already created the container and added a description
      //and there is no table create fallback table for element description after
      //fallback description
      this.dummyDOM
        .querySelector('#' + cnvId + fallbackDescId)
        .insertAdjacentHTML(
          'afterend',
          `<table id="${cnvId}${fallbackTableId}"><caption>Canvas elements and their descriptions</caption></table>`
        );
    }
    //create a table row for the element
    let tableRow = document.createElement('tr');
    tableRow.id = cnvId + fallbackTableElId + name;
    this.dummyDOM
      .querySelector('#' + cnvId + fallbackTableId)
      .appendChild(tableRow);
    //update element description
    this.descriptions.fallbackElements[name] = this.dummyDOM.querySelector(
      `#${cnvId}${fallbackTableElId}${name}`
    );
    this.descriptions.fallbackElements[name].innerHTML = text;
    return;
  } else if (type === 'label') {
    //If display is LABEL creates a div adjacent to the canvas element with
    //a table, a row header cell with the name of the elements,
    //and adds the description of the element in adjecent cell.
    //if there is no label description container
    if (!this.dummyDOM.querySelector(`#${cnvId + labelContainer}`)) {
      //if there are no accessible outputs (see textOutput() and gridOutput())
      let html = `<div id="${cnvId}${labelContainer}" class="p5Label"><table id="${cnvId}${labelTableId}"></table></div>`;
      if (!this.dummyDOM.querySelector(`#${cnvId}accessibleOutputLabel`)) {
        //create container + table for element descriptions
        this.dummyDOM
          .querySelector('#' + cnvId)
          .insertAdjacentHTML('afterend', html);
      } else {
        //create container + table for element descriptions before outputs
        this.dummyDOM
          .querySelector(`#${cnvId}accessibleOutputLabel`)
          .insertAdjacentHTML('beforebegin', html);
      }
    } else if (!this.dummyDOM.querySelector(`#${cnvId + labelTableId}`)) {
      //if describe() has already created the label container and added a description
      //and there is no table create label table for element description after
      //label description
      this.dummyDOM
        .querySelector('#' + cnvId + labelDescId)
        .insertAdjacentHTML(
          'afterend',
          `<table id="${cnvId + labelTableId}"></table>`
        );
    }
    //create a table row for the element label description
    let tableRow = document.createElement('tr');
    tableRow.id = cnvId + labelTableElId + name;
    this.dummyDOM
      .querySelector('#' + cnvId + labelTableId)
      .appendChild(tableRow);
    //update element label description
    this.descriptions.labelElements[name] = this.dummyDOM.querySelector(
      `#${cnvId}${labelTableElId}${name}`
    );
    this.descriptions.labelElements[name].innerHTML = text;
  }
};

export default p5;
