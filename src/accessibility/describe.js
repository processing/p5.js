/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a screen-reader accessible description for the canvas in the DOM.
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
p5.prototype.describe = function(t, d) {
  p5._validateParameters('describe', arguments);
  const cnvId = this.canvas.id;
  //Creates a sub DOM inside of the canvas element and populates
  //it with description text.
  t = this._descriptionText(t);
  if (document.getElementById(cnvId + '_Description') === null) {
    document.getElementById(cnvId).innerHTML =
      '<div id="' +
      cnvId +
      '_Description" role="region" aria-label="Canvas Description"><p id="' +
      cnvId +
      '_dsc"></p></div>';
  } else if (document.getElementById(cnvId + '_dsc') === null) {
    document
      .getElementById(cnvId + '_eDsc')
      .insertAdjacentHTML('beforebegin', '<p id="' + cnvId + '_dsc"></p>');
  }
  if (document.getElementById(cnvId + '_dsc').innerHTML !== t) {
    document.getElementById(cnvId + '_dsc').innerHTML = t;
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //description text.
  if (d === this.LABEL) {
    if (document.getElementById(cnvId + '_Label') === null) {
      document
        .getElementById(cnvId)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            cnvId +
            '_Label" class="p5Label"><p id=' +
            cnvId +
            '_dLbl></p></div>'
        );
    } else if (document.getElementById(cnvId + '_dLbl') === null) {
      document
        .getElementById(cnvId + '_eLbl')
        .insertAdjacentHTML('beforebegin', '<p id=' + cnvId + '_dLbl></p>');
    }
    if (document.getElementById(cnvId + '_dLbl').innerHTML !== t) {
      document.getElementById(cnvId + '_dLbl').innerHTML = t;
    }
  }
};

/**
 * Helper function for describe() and describeElement().
 */
p5.prototype._descriptionText = function(t) {
  if (t.endsWith('.') === false) {
    t = t + '.';
  }
  if (/^[A-Z]/.test(t) === false) {
    t = t[0].toUpperCase() + t.slice(1);
  }
  return t;
};

/**
 * This function creates a screen-reader accessible
 * description for elements —shapes or groups of shapes that create
 * meaning together— in the canvas sub DOM. The first paramater should
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

p5.prototype.describeElement = function(n, t, d) {
  p5._validateParameters('describeElement', arguments);
  const cnvId = this.canvas.id;
  t = this._descriptionText(t);
  n = this._elementName(n);
  //Creates a sub DOM inside of the canvas with a table, populates
  //a row header cell with the name of the elements and adds the description
  //of the element in adjecent cell.
  if (document.getElementById(cnvId + '_Description') === null) {
    document.getElementById(cnvId).innerHTML =
      '<div id="' +
      cnvId +
      '_Description" role="region" aria-label="Canvas Description"><table id="' +
      cnvId +
      '_eDsc"><caption>Canvas elements and their descriptions</caption></table></div>';
  } else if (document.getElementById(cnvId + '_eDsc') === null) {
    document
      .getElementById(cnvId + '_dsc')
      .insertAdjacentHTML(
        'afterend',
        '<table id="' +
          cnvId +
          '_eDsc"><caption>Canvas elements and their descriptions</caption></table>'
      );
  }
  if (document.getElementById(cnvId + n) === null) {
    let tr = document.createElement('tr');
    tr.id = cnvId + n;
    document.getElementById(cnvId + '_eDsc').appendChild(tr);
  }
  if (
    document.getElementById(cnvId + n).innerHTML !==
    '<th scope="row">' + n + '</th><td>' + t + '</td>'
  ) {
    document.getElementById(cnvId + n).innerHTML =
      '<th scope="row">' + n + '</th><td>' + t + '</td>';
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //a table, a row header cell with the name of the elements,
  //and adds the description of the element in adjecent cell.
  if (d === this.LABEL) {
    if (document.getElementById(cnvId + '_Label') === null) {
      document
        .getElementById(cnvId)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            cnvId +
            '_Label" class="p5Label"><table id="' +
            cnvId +
            '_eLbl"></table></div>'
        );
    } else if (document.getElementById(cnvId + '_eLbl') === null) {
      document
        .getElementById(cnvId + '_dLbl')
        .insertAdjacentHTML(
          'afterend',
          '<table id="' + cnvId + '_eLbl"></table>'
        );
    }
    if (document.getElementById(cnvId + n + 'Lbl') === null) {
      let tr = document.createElement('tr');
      tr.id = cnvId + n + 'Lbl';
      document.getElementById(cnvId + '_eLbl').appendChild(tr);
    }

    if (
      document.getElementById(cnvId + n + 'Lbl').innerHTML !==
      '<th scope="row">' + n + '</th><td>' + t + '</td>'
    ) {
      document.getElementById(cnvId + n + 'Lbl').innerHTML =
        '<th scope="row">' + n + '</th><td>' + t + '</td>';
    }
  }
};
/**
 * Helper function for describeElement().
 */
p5.prototype._elementName = function(n) {
  let lm = n[n.length - 1];
  if (lm === '.' || lm === ';' || lm === ',') {
    n = n.replace(/.$/, ':');
  } else if (n.endsWith(':') === false) {
    n = n + ':';
  }
  if (/^[A-Z]/.test(n) === false) {
    n = n[0].toUpperCase() + n.slice(1);
  }
  return n;
};

export default p5;
