/**
 * @module Accessibility
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
 * <code>describe(str, LABEL)</code> displays the description to all users as a
 * <a href="https://en.wikipedia.org/wiki/Museum_label" target="_blank"> tombstone or exhibit label/caption</a>
 * by creating a <code>&lt;div id="label"&gt;</code> with the description right after the canvas.
 * You can style it as you wish in your CSS.
 *
 * <code>describe(str, FALLBACK)</code> makes the description accessible to screen-reader users only in
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
 * a sub DOM inside the canvas element</a>.
 * If a second parameter is not specified, by default, the description will only be available to screen-reader users.
 *
 * @method describe
 * @param  {String} text      string describing the canvas
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *   background(220);
 *   fill(255);
 *   ellipse(25, height / 2, 35, 20);
 *   ellipse(75, height / 2, 35, 20);
 *   fill('orange');
 *   ellipse(25, height / 2, 15, 15);
 *   ellipse(75, height / 2, 15, 15);
 *   fill(0);
 *   ellipse(25, height / 2, 2.5, 2.5);
 *   ellipse(75, height / 2, 2.5, 2.5);
 *   describe('orange eyes over a gray background', LABEL);
 * }
 * </code>
 * </div>
 *
 * @alt
 */
p5.prototype.describe = function(t, display) {
  p5._validateParameters('describe', arguments);
  const canvasID = this.canvas.id;
  //Creates a sub DOM inside of the canvas element and populates
  //it with description text.
  if (document.getElementById(canvasID + 'Description') === null) {
    document.getElementById(canvasID).innerHTML =
      '<div id="' +
      canvasID +
      'Description" role="region" aria-label="Canvas Description"><p id="' +
      canvasID +
      'desc"></p></div>';
  } else if (document.getElementById(canvasID + 'desc') === null) {
    document
      .getElementById(canvasID + 'elDes')
      .insertAdjacentHTML('beforebegin', '<p id="' + canvasID + 'desc"></p>');
  }
  if (document.getElementById(canvasID + 'desc').innerHTML !== t) {
    document.getElementById(canvasID + 'desc').innerHTML = t;
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //description text.
  if (display === 'label') {
    if (document.getElementById(canvasID + 'Label') === null) {
      document
        .getElementById(canvasID)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            canvasID +
            'Label"><p id=' +
            canvasID +
            'dLbl></p></div>'
        );
    } else if (document.getElementById(canvasID + 'dLbl') === null) {
      document
        .getElementById(canvasID + 'eLbl')
        .insertAdjacentHTML('beforebegin', '<p id=' + canvasID + 'dLbl></p>');
    }
    if (document.getElementById(canvasID + 'dLbl').innerHTML !== t) {
      document.getElementById(canvasID + 'dLbl').innerHTML = t;
    }
  }
};

/**
 * <code>describeElement()</code> creates a screen-reader accessible description for
 * elements —shapes or groups of shapes that create meaning together— in the canvas sub DOM.
 * The first paramater should be the name of the element. The second parameter should be a
 * string with a description of the element.
 * The third parameter is optional.
 * If specified, it determines how the element description is displayed.
 *
 * <code>describeElement(name, str, LABEL)</code> displays the element description to all users as a
 * <a href="https://en.wikipedia.org/wiki/Museum_label" target="_blank"> tombstone or exhibit label/caption</a>
 * by creating a <code>&lt;div id="label"&gt;</code> with the element description right after the canvas.
 * You can style it as you wish in your CSS.
 *
 * <code>describeElement(name, str, FALLBACK)</code> makes the element description accessible to screen-reader users only in
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
 * a sub DOM inside the canvas element</a>.
 * If a second parameter is not specified, by default, the element description will only be available to screen-reader users.
 *
 * @method describeElement
 * @param  {String} name      name of the element
 * @param  {String} text      string describing the element
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 100);
 *   describe('Two emojis over a pink background', LABEL);
 * }
 * function draw() {
 *   background('pink');
 *   fill('yellow');
 *   noStroke();
 *   describeElement(
 *     'Grinning face',
 *     'An emoji with open eyes and a broad open smile showing upper teeth.',
 *     LABEL
 *   );
 *   ellipse(50, 50, 70, 70);
 *   fill('#ad5240');
 *   arc(50, 55, 40, 40, radians(0), radians(180), PIE);
 *   fill(0);
 *   ellipse(40, 35, 15, 20);
 *   ellipse(60, 35, 15, 20);
 *   fill(255);
 *   arc(50, 55, 40, 20, radians(0), radians(180), PIE);
 *   ellipse(43, 35, 5, 5);
 *   ellipse(63, 35, 5, 5);
 *   describeElement(
 *     'Smiling face with heart-eyes',
 *     'A yellow face located to the right. It has an open smile, and red, cartoon-styled hearts for eyes. Often conveys enthusiastic feelings of love.',
 *     LABEL
 *   );
 *   fill('yellow');
 *   ellipse(150, 50, 70, 70);
 *   fill('#ad5240');
 *   arc(150, 55, 40, 40, radians(0), radians(180), PIE);
 *   fill('red');
 *   ellipse(143, 35, 10, 10);
 *   ellipse(137, 35, 10, 10);
 *   triangle(132, 35, 140, 45, 148, 35);
 *   ellipse(157, 35, 10, 10);
 *   ellipse(163, 35, 10, 10);
 *   triangle(168, 35, 160, 45, 152, 35);
 * }
 * </code>
 * </div>
 *
 * @alt
 */

p5.prototype.describeElement = function(name, t, display) {
  p5._validateParameters('describeElement', arguments);
  const canvasID = this.canvas.id;
  //Creates a sub DOM inside of the canvas with a table, populates
  //a row header cell with the name of the elements and adds the description
  //of the element in adjecent cell.
  if (document.getElementById(canvasID + 'Description') === null) {
    document.getElementById(canvasID).innerHTML =
      '<div id="' +
      canvasID +
      'Description" role="region" aria-label="Canvas Description"><table id="' +
      canvasID +
      'elDes"></table></div>';
  } else if (document.getElementById(canvasID + 'elDes') === null) {
    document
      .getElementById(canvasID + 'desc')
      .insertAdjacentHTML(
        'afterend',
        '<table id="' + canvasID + 'elDes"></table>'
      );
  }
  if (document.getElementById(canvasID + name) === null) {
    let tr = document.createElement('tr');
    tr.id = canvasID + name;
    document.getElementById(canvasID + 'elDes').appendChild(tr);
  }
  if (
    document.getElementById(canvasID + name).innerHTML !==
    '<th>' + name + '</th><td>' + t + '</td>'
  ) {
    document.getElementById(canvasID + name).innerHTML =
      '<th>' + name + '</th><td>' + t + '</td>';
  }
  //If display is LABEL creates a div adjacent to the canvas element with
  //a table, a row header cell with the name of the elements,
  //and adds the description of the element in adjecent cell.
  if (display === 'label') {
    if (document.getElementById(canvasID + 'Label') === null) {
      document
        .getElementById(canvasID)
        .insertAdjacentHTML(
          'afterend',
          '<div id="' +
            canvasID +
            '<div id="' +
            canvasID +
            'Label"><table id="' +
            canvasID +
            'eLbl"></table></div>'
        );
    } else if (document.getElementById(canvasID + 'eLbl') === null) {
      document
        .getElementById(canvasID + 'dLbl')
        .insertAdjacentHTML(
          'afterend',
          '<table id="' + canvasID + 'eLbl"></table>'
        );
    }
    if (document.getElementById(canvasID + name + 'Lbl') === null) {
      let tr = document.createElement('tr');
      tr.id = canvasID + name + 'Lbl';
      document.getElementById(canvasID + 'eLbl').appendChild(tr);
    }

    if (
      document.getElementById(canvasID + name + 'Lbl').innerHTML !==
      '<th>' + name + '</th><td>' + t + '</td>'
    ) {
      document.getElementById(canvasID + name + 'Lbl').innerHTML =
        '<th>' + name + '</th><td>' + t + '</td>';
    }
  }
};

export default p5;
