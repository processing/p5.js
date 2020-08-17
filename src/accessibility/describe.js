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
//dummy stores a copy of the DOM and previous descriptions
let dummy = { fallbackElements: {}, labelElements: {} };

/**
 * Creates a screen-reader accessible description for the canvas.
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

  //if it is the first time describe() is called
  if (!dummy[cnvId + 'fallbackDesc'] || !dummy[cnvId + 'labelDesc']) {
    //store copy of body dom in dummy
    _populateDummyDOM(cnvId);
  }

  //check if text is different
  if (dummy[cnvId + 'fallbackDesc'] !== text) {
    //if html structure for description is ready
    if (dummy[cnvId + 'updateFallbackDesc']) {
      //update description
      dummy[cnvId + 'DOM'].querySelector(
        '#' + cnvId + fallbackDescId
      ).innerHTML = text;
      //store updated description
      dummy[cnvId + 'fallbackDesc'] = text;
    } else {
      //create fallback html structure
      _describeFallbackHTML(cnvId, text);
    }
  }
  //if display is LABEL and label text is different
  if (display === this.LABEL && dummy[cnvId + 'labelDesc'] !== text) {
    //if html structure for label is ready
    if (dummy[cnvId + labelDescId]) {
      //update label description
      dummy[cnvId + 'DOM'].querySelector(
        '#' + cnvId + labelDescId
      ).innerHTML = text;
      //store updated label description
      dummy[cnvId + 'labelDesc'] = text;
    } else {
      //create label html structure
      _describeLabelHTML(cnvId, text);
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

  //if it is the first time describeElement() is called
  if (
    !dummy.fallbackElements[cnvId + name] ||
    !dummy.labelElements[cnvId + name]
  ) {
    //store copy of body dom in dummy
    _populateDummyDOM(cnvId);
  }

  //check if element description is different from current
  if (dummy.fallbackElements[cnvId + name] !== inner) {
    //if html structure for element description is ready
    if (dummy.fallbackElements[cnvId + name]) {
      //update element description
      dummy[cnvId + 'DOM'].querySelector(
        '#' + cnvId + fallbackTableElId + name
      ).innerHTML = inner;
      //store updated element description
      dummy.fallbackElements[cnvId + name] = inner;
    } else {
      //create fallback html structure
      _descElementFallbackHTML(cnvId, name, inner);
    }
  }
  //if display is LABEL and label element description is different
  if (display === this.LABEL && dummy.labelElements[cnvId + name] !== inner) {
    //if html structure for label element description is ready
    if (dummy.labelElements[cnvId + name]) {
      //update label element description
      dummy[cnvId + 'DOM'].querySelector(
        '#' + cnvId + labelTableElId + name
      ).innerHTML = inner;
      //store updated label element description
      dummy.labelElements[cnvId + name] = inner;
    } else {
      //create label element html structure
      _descElementLabelHTML(cnvId, name, inner);
    }
  }
};

/*
 *
 * Helper functions for describe() and describeElement().
 *
 */

//clear dummy
p5.prototype._clearDummy = function() {
  dummy = { fallbackElements: {}, labelElements: {} };
};

//stores html body in dummy
function _populateDummyDOM(cnvId) {
  dummy[cnvId + 'DOM'] = document.getElementsByTagName('body')[0];
}

// check that text is not LABEL or FALLBACK and ensure text ends with punctuation mark
function _descriptionText(text) {
  if (text === 'label' || text === 'fallback') {
    throw new Error('description should not be LABEL or FALLBACK');
  }
  //if string does not end with '.'
  if (
    !text.endsWith('.') &&
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

//creates fallback HTML structure
function _describeFallbackHTML(cnvId, text) {
  //if there is no description container
  if (!dummy[cnvId + descContainer]) {
    //create description container + <p> for fallback description
    dummy[cnvId + 'DOM'].querySelector(
      '#' + cnvId
    ).innerHTML = `<div id="${cnvId +
      descContainer}" role="region" aria-label="Canvas Description"><p id="${cnvId +
      fallbackDescId}"></p></div>`;
    //set container and fallbackDescId to true
    dummy[cnvId + descContainer] = true;
    dummy[cnvId + fallbackDescId] = true;
    //if describeElement() has already created the container and added a table of elements
  } else if (dummy[cnvId + fallbackTableId]) {
    //create fallback description <p> before the table
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + fallbackTableId)
      .insertAdjacentHTML(
        'beforebegin',
        `<p id="${cnvId + fallbackDescId}"></p>`
      );
    //set fallbackDescId to true
    dummy[cnvId + fallbackDescId] = true;
  }
  //If the container for the description exists
  if (dummy[cnvId + 'DOM'].querySelector('#' + cnvId + fallbackDescId)) {
    //update description
    dummy[cnvId + 'DOM'].querySelector(
      '#' + cnvId + fallbackDescId
    ).innerHTML = text;
    //store updated description
    dummy[cnvId + 'fallbackDesc'] = text;
    //html structure is ready for any description updates
    dummy[cnvId + 'updateFallbackDesc'] === true;
  }
  return;
}

//If display is LABEL create a div adjacent to the canvas element with
//description text.
function _describeLabelHTML(cnvId, text) {
  //if there is no label container
  if (!dummy[cnvId + labelContainer]) {
    //create label container + <p> for label description
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId)
      .insertAdjacentHTML(
        'afterend',
        `<div id="${cnvId + labelContainer}" class="p5Label"><p id="${cnvId +
          labelDescId}"></p></div>`
      );
    //set container and labelDescId to true
    dummy[cnvId + labelContainer] = true;
    dummy[cnvId + labelDescId] = true;
    //if describeElement() has already created the container and added a table of elements
  } else if (!dummy[cnvId + labelDescId] && dummy[cnvId + labelTableId]) {
    //create label description <p> before the table
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + labelTableId)
      .insertAdjacentHTML('beforebegin', `<p id="${cnvId}${labelDescId}"></p>`);
    //set fallbackDescId to true
    dummy[cnvId + labelDescId] = true;
  }
  //update description
  dummy[cnvId + 'DOM'].querySelector(
    '#' + cnvId + labelDescId
  ).innerHTML = text;
  //store updated description
  dummy[cnvId + 'labelDesc'] = text;
  return;
}

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
    //if string n does not end with ':'
  } else if (!name.endsWith(':')) {
    //add ':'' at the end of string
    name = name + ':';
  }
  return name;
}

//creates fallback HTML structure for element descriptions
function _descElementFallbackHTML(cnvId, name, inner) {
  //if there is no description container
  if (!dummy[cnvId + descContainer]) {
    //create container + table for element descriptions
    dummy[cnvId + 'DOM'].querySelector(
      '#' + cnvId
    ).innerHTML = `<div id="${cnvId +
      descContainer}" role="region" aria-label="Canvas Description"><table id="${cnvId +
      fallbackTableId}"><caption>Canvas elements and their descriptions</caption></table></div>`;
    //set container and fallbackTableId to true
    dummy[cnvId + descContainer] = true;
    dummy[cnvId + fallbackTableId] = true;
    //if describe() has already created the container and added a description
  } else if (document.getElementById(cnvId + fallbackDescId)) {
    //create fallback table for element description after fallback description
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + fallbackDescId)
      .insertAdjacentHTML(
        'afterend',
        `<table id="${cnvId +
          fallbackTableId}"><caption>Canvas elements and their descriptions</caption></table>`
      );
    //set fallbackTableId to true
    dummy[cnvId + fallbackTableId] = true;
  }
  //if it is the first time this element is being added to the table
  if (!dummy.fallbackElements[cnvId + name] && dummy[cnvId + fallbackTableId]) {
    //create a table row for the element
    let tableRow = document.createElement('tr');
    tableRow.id = cnvId + fallbackTableElId + name;
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + fallbackTableId)
      .appendChild(tableRow);
    //update element description
    dummy[cnvId + 'DOM'].querySelector(
      '#' + cnvId + fallbackTableElId + name
    ).innerHTML = inner;
    //store updated element description
    dummy.fallbackElements[cnvId + name] = inner;
  }
}
//If display is LABEL creates a div adjacent to the canvas element with
//a table, a row header cell with the name of the elements,
//and adds the description of the element in adjecent cell.
function _descElementLabelHTML(cnvId, name, inner) {
  //if there is no label description container
  if (!dummy[cnvId + labelContainer]) {
    //create container + table for element descriptions
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId)
      .insertAdjacentHTML(
        'afterend',
        `<div id="${cnvId +
          labelContainer}" class="p5Label"><table id="${cnvId +
          labelTableId}"></table></div>`
      );
    //set container and labelTableId to true
    dummy[cnvId + labelContainer] = true;
    dummy[cnvId + labelTableId] = true;
    //if describe() has already created the label container and added a description
  } else if (dummy[cnvId + 'DOM'].querySelector('#' + cnvId + labelDescId)) {
    //create label table for element description after label description
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + labelDescId)
      .insertAdjacentHTML(
        'afterend',
        `<table id="${cnvId + labelTableId}"></table>`
      );
    //set labelTableId to true
    dummy[cnvId + labelTableId] = true;
  }
  //if it is the first time this element is being added to the table
  if (!dummy.labelElements[cnvId + name] && dummy[cnvId + labelTableId]) {
    //create a table row for the element label description
    let tableRow = document.createElement('tr');
    tableRow.id = cnvId + labelTableElId + name;
    dummy[cnvId + 'DOM']
      .querySelector('#' + cnvId + labelTableId)
      .appendChild(tableRow);
    //update element label description
    dummy[cnvId + 'DOM'].querySelector(
      '#' + cnvId + labelTableElId + name
    ).innerHTML = inner;
    //store updated element label description
    dummy.labelElements[cnvId + name] = inner;
  }
}

export default p5;
