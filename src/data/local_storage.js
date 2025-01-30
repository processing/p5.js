/**
 * @module Data
 * @submodule LocalStorage
 * @requires core
 *
 * This module defines the p5 methods for working with local storage
 */

function storage(p5, fn){
  /**
   * Stores a value in the web browser's local storage.
   *
   * Web browsers can save small amounts of data using the built-in
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localStorage object</a>.
   * Data stored in `localStorage` can be retrieved at any point, even after
   * refreshing a page or restarting the browser. Data are stored as key-value
   * pairs.
   *
   * `storeItem()` makes it easy to store values in `localStorage` and
   * <a href="#/p5/getItem">getItem()</a> makes it easy to retrieve them.
   *
   * The first parameter, `key`, is the name of the value to be stored as a
   * string.
   *
   * The second parameter, `value`, is the value to be stored. Values can have
   * any type.
   *
   * Note: Sensitive data such as passwords or personal information shouldn't be
   * stored in `localStorage`.
   *
   * @method storeItem
   * @for p5
   * @param {String} key name of the value.
   * @param {String|Number|Boolean|Object|Array} value value to be stored.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Store the player's name.
   *   storeItem('name', 'Feist');
   *
   *   // Store the player's score.
   *   storeItem('score', 1234);
   *
   *   describe('The text "Feist: 1234" written in black on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER, CENTER);
   *   textSize(14);
   *
   *   // Retrieve the name.
   *   let name = getItem('name');
   *
   *   // Retrieve the score.
   *   let score = getItem('score');
   *
   *   // Display the score.
   *   text(`${name}: ${score}`, 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create an object.
   *   let p = { x: 50, y: 50 };
   *
   *   // Store the object.
   *   storeItem('position', p);
   *
   *   describe('A white circle on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Retrieve the object.
   *   let p = getItem('position');
   *
   *   // Draw the circle.
   *   circle(p.x, p.y, 30);
   * }
   * </code>
   * </div>
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.Color object.
   *   let c = color('deeppink');
   *
   *   // Store the object.
   *   storeItem('color', c);
   *
   *   describe('A pink circle on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Retrieve the object.
   *   let c = getItem('color');
   *
   *   // Style the circle.
   *   fill(c);
   *
   *   // Draw the circle.
   *   circle(50, 50, 30);
   * }
   * </code>
   * </div>
   */
  fn.storeItem = function(key, value) {
    if (typeof key !== 'string') {
      console.log(
        `The argument that you passed to storeItem() - ${key} is not a string.`
      );
    }
    if (key.endsWith('p5TypeID')) {
      console.log(
        `The argument that you passed to storeItem() - ${key} must not end with 'p5TypeID'.`
      );
    }

    if (typeof value === 'undefined') {
      console.log('You cannot store undefined variables using storeItem().');
    }
    let type = typeof value;
    switch (type) {
      case 'number':
      case 'boolean':
        value = value.toString();
        break;
      case 'object':
        if (value instanceof p5.Color) {
          type = 'p5.Color';
          value = value.toString();
        } else if (value instanceof p5.Vector) {
          type = 'p5.Vector';
          const coord = [value.x, value.y, value.z];
          value = coord;
        }
        value = JSON.stringify(value);
        break;
      case 'string':
      default:
        break;
    }

    localStorage.setItem(key, value);
    const typeKey = `${key}p5TypeID`;
    localStorage.setItem(typeKey, type);
  };

  /**
   * Returns a value in the web browser's local storage.
   *
   * Web browsers can save small amounts of data using the built-in
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localStorage object</a>.
   * Data stored in `localStorage` can be retrieved at any point, even after
   * refreshing a page or restarting the browser. Data are stored as key-value
   * pairs.
   *
   * <a href="#/p5/storeItem">storeItem()</a> makes it easy to store values in
   * `localStorage` and `getItem()` makes it easy to retrieve them.
   *
   * The first parameter, `key`, is the name of the value to be stored as a
   * string.
   *
   * The second parameter, `value`, is the value to be retrieved a string. For
   * example, calling `getItem('size')` retrieves the value with the key `size`.
   *
   * Note: Sensitive data such as passwords or personal information shouldn't be
   * stored in `localStorage`.
   *
   * @method getItem
   * @for p5
   * @param {String} key name of the value.
   * @return {String|Number|Boolean|Object|Array} stored item.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Store the player's name.
   *   storeItem('name', 'Feist');
   *
   *   // Store the player's score.
   *   storeItem('score', 1234);
   *
   *   describe('The text "Feist: 1234" written in black on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER, CENTER);
   *   textSize(14);
   *
   *   // Retrieve the name.
   *   let name = getItem('name');
   *
   *   // Retrieve the score.
   *   let score = getItem('score');
   *
   *   // Display the score.
   *   text(`${name}: ${score}`, 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create an object.
   *   let p = { x: 50, y: 50 };
   *
   *   // Store the object.
   *   storeItem('position', p);
   *
   *   describe('A white circle on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Retrieve the object.
   *   let p = getItem('position');
   *
   *   // Draw the circle.
   *   circle(p.x, p.y, 30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.Color object.
   *   let c = color('deeppink');
   *
   *   // Store the object.
   *   storeItem('color', c);
   *
   *   describe('A pink circle on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Retrieve the object.
   *   let c = getItem('color');
   *
   *   // Style the circle.
   *   fill(c);
   *
   *   // Draw the circle.
   *   circle(50, 50, 30);
   * }
   * </code>
   * </div>
   */
  fn.getItem = function(key) {
    let value = localStorage.getItem(key);
    const type = localStorage.getItem(`${key}p5TypeID`);
    if (typeof type === 'undefined') {
      console.log(
        `Unable to determine type of item stored under ${key}in local storage. Did you save the item with something other than setItem()?`
      );
    } else if (value !== null) {
      switch (type) {
        case 'number':
          value = parseFloat(value);
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'object':
          value = JSON.parse(value);
          break;
        case 'p5.Color':
          value = this.color(JSON.parse(value));
          break;
        case 'p5.Vector':
          value = JSON.parse(value);
          value = this.createVector(...value);
          break;
        case 'string':
        default:
          break;
      }
    }
    return value;
  };

  /**
   * Removes all items in the web browser's local storage.
   *
   * Web browsers can save small amounts of data using the built-in
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localStorage object</a>.
   * Data stored in `localStorage` can be retrieved at any point, even after
   * refreshing a page or restarting the browser. Data are stored as key-value
   * pairs. Calling `clearStorage()` removes all data from `localStorage`.
   *
   * Note: Sensitive data such as passwords or personal information shouldn't be
   * stored in `localStorage`.
   *
   * @method clearStorage
   * @for p5
   *
   * @example
   * <div>
   * <code>
   * // Double-click to clear localStorage.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Store the player's name.
   *   storeItem('name', 'Feist');
   *
   *   // Store the player's score.
   *   storeItem('score', 1234);
   *
   *   describe(
   *     'The text "Feist: 1234" written in black on a gray background. The text "null: null" appears when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER, CENTER);
   *   textSize(14);
   *
   *   // Retrieve the name.
   *   let name = getItem('name');
   *
   *   // Retrieve the score.
   *   let score = getItem('score');
   *
   *   // Display the score.
   *   text(`${name}: ${score}`, 50, 50);
   * }
   *
   * // Clear localStorage when the user double-clicks.
   * function doubleClicked() {
   *   clearStorage();
   * }
   * </code>
   * </div>
   */
  fn.clearStorage = function () {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.endsWith('p5TypeID')) {
        this.removeItem(key.replace('p5TypeID', ''));
      }
    });
  };

  /**
   * Removes an item from the web browser's local storage.
   *
   * Web browsers can save small amounts of data using the built-in
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localStorage object</a>.
   * Data stored in `localStorage` can be retrieved at any point, even after
   * refreshing a page or restarting the browser. Data are stored as key-value
   * pairs.
   *
   * <a href="#/p5/storeItem">storeItem()</a> makes it easy to store values in
   * `localStorage` and `removeItem()` makes it easy to delete them.
   *
   * The parameter, `key`, is the name of the value to remove as a string. For
   * example, calling `removeItem('size')` removes the item with the key `size`.
   *
   * Note: Sensitive data such as passwords or personal information shouldn't be
   * stored in `localStorage`.
   *
   * @method removeItem
   * @param {String} key name of the value to remove.
   * @for p5
   *
   * @example
   * <div>
   * <code>
   * // Double-click to remove an item from localStorage.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Store the player's name.
   *   storeItem('name', 'Feist');
   *
   *   // Store the player's score.
   *   storeItem('score', 1234);
   *
   *   describe(
   *     'The text "Feist: 1234" written in black on a gray background. The text "Feist: null" appears when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER, CENTER);
   *   textSize(14);
   *
   *   // Retrieve the name.
   *   let name = getItem('name');
   *
   *   // Retrieve the score.
   *   let score = getItem('score');
   *
   *   // Display the score.
   *   text(`${name}: ${score}`, 50, 50);
   * }
   *
   * // Remove the word from localStorage when the user double-clicks.
   * function doubleClicked() {
   *   removeItem('score');
   * }
   * </code>
   * </div>
   */
  fn.removeItem = function(key) {
    if (typeof key !== 'string') {
      console.log(
        `The argument that you passed to removeItem() - ${key} is not a string.`
      );
    }
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}p5TypeID`);
  };
}

export default storage;

if(typeof p5 !== 'undefined'){
  storage(p5, p5.prototype);
}
