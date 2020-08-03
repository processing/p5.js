/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
const descContainer = '_Description'; //Fallback container
const fallbackDesc = '_fallbackDesc'; //Fallback description
const fallbackTable = '_fallbackTable'; //Fallback Table
const fallbackTableElement = '_fte_'; //Fallback Table Element
const labelContainer = '_Label'; //Label container
const labelDesc = '_labelDesc'; //Label description
const labelTable = '_labelTable'; //Label Table
const labelTableElement = '_lte_'; //Label Table Element

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
  const cnvId = this.canvas.id;
  p5._validateParameters('describe', arguments);
  //Creates a sub DOM inside of the canvas element and populates
  //it with description text.
  if (typeof text !== 'string') {
    return;
  }
  text = this._descriptionText(text);
  if (document.getElementById(cnvId + descContainer) === null) {
    document.getElementById(cnvId).innerHTML =
      '<div id="' +
      cnvId +
      descContainer +
      '" role="region" aria-label="Canvas Description"><p id="' +
      cnvId +
      fallbackDesc +
      '"></p></div>';
  } else if (document.getElementById(cnvId + fallbackDesc) === null) {
    document
      .getElementById(cnvId + fallbackTable)
      .insertAdjacentHTML(
        'beforebegin',
        '<p id="' + cnvId + fallbackDesc + '"></p>'
      );
  }
  if (document.getElementById(cnvId + fallbackDesc).innerHTML !== text) {
    document.getElementById(cnvId + fallbackDesc).innerHTML = text;
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //description text.
  if (display === this.LABEL) {
    if (document.getElementById(cnvId + labelContainer) === null) {
      document
        .getElementById(cnvId)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            cnvId +
            labelContainer +
            '" class="p5Label"><p id=' +
            cnvId +
            labelDesc +
            '></p></div>'
        );
    } else if (document.getElementById(cnvId + labelDesc) === null) {
      document
        .getElementById(cnvId + labelTable)
        .insertAdjacentHTML(
          'beforebegin',
          '<p id=' + cnvId + labelDesc + '></p>'
        );
    }
    if (document.getElementById(cnvId + labelDesc).innerHTML !== text) {
      document.getElementById(cnvId + labelDesc).innerHTML = text;
    }
  }
};

/**
 * Helper function for describe() and describeElement().
 */

p5.prototype._descriptionText = function(text) {
  if (text === this.LABEL || text === this.FALLBACK) {
    throw new Error('description should not be LABEL or FALLBACK');
  }
  //if string does not end with '.'
  if (!text.endsWith('.') && !text.endsWith('?') && !text.endsWith('!')) {
    //add '.' to the end of string
    text = text + '.';
  }
  //if first character of string is not capitalized
  if (!/^[A-Z]/.test(text)) {
    //capitalize first character of string
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
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
  text = this._descriptionText(text);
  let elementName = this._elementName(name);
  //Creates a sub DOM inside of the canvas with a table, populates
  //a row header cell with the name of the elements and adds the description
  //of the element in adjecent cell.
  if (document.getElementById(cnvId + descContainer) === null) {
    document.getElementById(cnvId).innerHTML =
      '<div id="' +
      cnvId +
      descContainer +
      '" role="region" aria-label="Canvas Description"><table id="' +
      cnvId +
      fallbackTable +
      '"><caption>Canvas elements and their descriptions</caption></table></div>';
  } else if (document.getElementById(cnvId + fallbackTable) === null) {
    document
      .getElementById(cnvId + fallbackDesc)
      .insertAdjacentHTML(
        'afterend',
        '<table id="' +
          cnvId +
          fallbackTable +
          '"><caption>Canvas elements and their descriptions</caption></table>'
      );
  }
  if (document.getElementById(cnvId + fallbackTableElement + name) === null) {
    let tableRow = document.createElement('tr');
    tableRow.id = cnvId + fallbackTableElement + name;
    document.getElementById(cnvId + fallbackTable).appendChild(tableRow);
  }
  if (
    document.getElementById(cnvId + fallbackTableElement + name).innerHTML !==
    '<th scope="row">' + elementName + '</th><td>' + text + '</td>'
  ) {
    document.getElementById(cnvId + fallbackTableElement + name).innerHTML =
      '<th scope="row">' + elementName + '</th><td>' + text + '</td>';
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //a table, a row header cell with the name of the elements,
  //and adds the description of the element in adjecent cell.
  if (display === this.LABEL) {
    if (document.getElementById(cnvId + labelContainer) === null) {
      document
        .getElementById(cnvId)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            cnvId +
            labelContainer +
            '" class="p5Label"><table id="' +
            cnvId +
            labelTable +
            '"></table></div>'
        );
    } else if (document.getElementById(cnvId + labelTable) === null) {
      document
        .getElementById(cnvId + labelDesc)
        .insertAdjacentHTML(
          'afterend',
          '<table id="' + cnvId + labelTable + '"></table>'
        );
    }
    if (document.getElementById(cnvId + labelTableElement + name) === null) {
      let tableRow = document.createElement('tr');
      tableRow.id = cnvId + labelTableElement + name;
      document.getElementById(cnvId + labelTable).appendChild(tableRow);
    }

    if (
      document.getElementById(cnvId + labelTableElement + name).innerHTML !==
      '<th scope="row">' + elementName + '</th><td>' + text + '</td>'
    ) {
      document.getElementById(cnvId + labelTableElement + name).innerHTML =
        '<th scope="row">' + elementName + '</th><td>' + text + '</td>';
    }
  }
};
/**
 * Helper function for describeElement().
 */
p5.prototype._elementName = function(name) {
  if (name === this.LABEL || name === this.FALLBACK) {
    throw new Error('element name should not be LABEL or FALLBACK');
  }
  let lm = name[name.length - 1];
  //check if last character of string n is '.', ';', or ','
  if (lm === '.' || lm === ';' || lm === ',') {
    //replace last character with ':'
    name = name.replace(/.$/, ':');
    //if string n does not end with ':'
  } else if (!name.endsWith(':')) {
    //add ':'' at the end of string
    name = name + ':';
  }
  //if first character of string is not capitalized
  if (!/^[A-Z]/.test(name)) {
    //capitalize first character
    name = name[0].toUpperCase() + name.slice(1);
  }
  return name;
};

export default p5;
