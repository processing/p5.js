/**
 * @module Data
 * @submodule LocalStorage
 * @requires core
 *
 * This module defines the p5 methods for working with local storage
 */

import p5 from '../core/main';
/**
 *
 * Stores a value in local storage under the key name.
 * Local storage is saved in the browser and persists
 * between browsing sessions and page reloads.
 * The key can be the name of the variable but doesn't
 * have to be. To retrieve stored items
 * see <a href="#/p5/getItem">getItem</a>.
 *
 * Sensitive data such as passwords or personal information
 * should not be stored in local storage.
 *
 * @method storeItem
 * @for p5
 * @param {String} key
 * @param {String|Number|Object|Boolean|p5.Color|p5.Vector} value
 *
 * @example
 * <div><code>
 * // Type to change the letter in the
 * // center of the canvas.
 * // If you reload the page, it will
 * // still display the last key you entered
 *
 * let myText;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   myText = getItem('myText');
 *   if (myText === null) {
 *     myText = '';
 *   }
 *   describe(`When you type the key name is displayed as black text on white background.
 *   If you reload the page, the last letter typed is still displaying.`);
 * }
 *
 * function draw() {
 *   textSize(40);
 *   background(255);
 *   text(myText, width / 2, height / 2);
 * }
 *
 * function keyPressed() {
 *   myText = key;
 *   storeItem('myText', myText);
 * }
 * </code></div>
 */
p5.prototype.storeItem = function(key, value) {
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
 *
 * Returns the value of an item that was stored in local storage
 * using storeItem()
 *
 * @method getItem
 * @for p5
 * @param {String} key name that you wish to use to store in local storage
 * @return {Number|Object|String|Boolean|p5.Color|p5.Vector} Value of stored item
 *
 * @example
 * <div><code>
 * // Click the mouse to change
 * // the color of the background
 * // Once you have changed the color
 * // it will stay changed even when you
 * // reload the page.
 *
 * let myColor;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   myColor = getItem('myColor');
 * }
 *
 * function draw() {
 *   if (myColor !== null) {
 *     background(myColor);
 *   }
 *   describe(`If you click, the canvas changes to a random color.·
 *     If you reload the page, the canvas is still the color it was when the
 *     page was previously loaded.`);
 * }
 *
 * function mousePressed() {
 *   myColor = color(random(255), random(255), random(255));
 *   storeItem('myColor', myColor);
 * }
 * </code></div>
 */
p5.prototype.getItem = function(key) {
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
        value = JSON.parse(value);
        value = this.color(...value.levels);
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
 *
 * Clears all local storage items set with storeItem()
 * for the current domain.
 *
 * @method clearStorage
 * @for p5
 *
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   let myNum = 10;
 *   let myBool = false;
 *   storeItem('myNum', myNum);
 *   storeItem('myBool', myBool);
 *   print(getItem('myNum')); // logs 10 to the console
 *   print(getItem('myBool')); // logs false to the console
 *   clearStorage();
 *   print(getItem('myNum')); // logs null to the console
 *   print(getItem('myBool')); // logs null to the console
 * }
 * </code></div>
 */
p5.prototype.clearStorage = function() {
  localStorage.clear();
};

/**
 *
 * Removes an item that was stored with storeItem()
 *
 * @method removeItem
 * @param {String} key
 * @for p5
 *
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   let myVar = 10;
 *   storeItem('myVar', myVar);
 *   print(getItem('myVar')); // logs 10 to the console
 *   removeItem('myVar');
 *   print(getItem('myVar')); // logs null to the console
 * }
 * </code></div>
 */
p5.prototype.removeItem = function(key) {
  if (typeof key !== 'string') {
    console.log(
      `The argument that you passed to removeItem() - ${key} is not a string.`
    );
  }
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}p5TypeID`);
};
