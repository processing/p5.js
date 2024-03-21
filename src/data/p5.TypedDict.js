/**
 * @module Data
 * @submodule Dictionary
 * @for p5.TypedDict
 * @requires core
 *
 * This module defines the p5 methods for the p5 Dictionary classes.
 * The classes StringDict and NumberDict are for storing and working
 * with key-value pairs.
 */

import p5 from '../core/main';

/**
 *
 * Creates a new instance of p5.StringDict using the key-value pair
 * or the object you provide.
 *
 * @method createStringDict
 * @for p5
 * @param {String} key
 * @param {String} value
 * @return {p5.StringDict}
 *
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   let myDictionary = createStringDict('p5', 'js');
 *   print(myDictionary.hasKey('p5')); // logs true to console
 *
 *   let anotherDictionary = createStringDict({ happy: 'coding' });
 *   print(anotherDictionary.hasKey('happy')); // logs true to console
 * }
 * </code></div>
 */
/**
 * @method createStringDict
 * @param {Object} object object
 * @return {p5.StringDict}
 */

p5.prototype.createStringDict = function (key, value) {
  p5._validateParameters('createStringDict', arguments);
  return new p5.StringDict(key, value);
};

/**
 *
 * Creates a new instance of <a href="#/p5.NumberDict">p5.NumberDict</a> using the key-value pair
 * or object you provide.
 *
 * @method createNumberDict
 * @for p5
 * @param {Number} key
 * @param {Number} value
 * @return {p5.NumberDict}
 *
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   let myDictionary = createNumberDict(100, 42);
 *   print(myDictionary.hasKey(100)); // logs true to console
 *
 *   let anotherDictionary = createNumberDict({ 200: 84 });
 *   print(anotherDictionary.hasKey(200)); // logs true to console
 * }
 * </code></div>
 */
/**
 * @method createNumberDict
 * @param {Object} object object
 * @return {p5.NumberDict}
 */

p5.prototype.createNumberDict = function (key, value) {
  p5._validateParameters('createNumberDict', arguments);
  return new p5.NumberDict(key, value);
};

/**
 *
 * Base class for all p5.Dictionary types. Specifically
 * typed Dictionary classes inherit from this class.
 *
 * @class p5.TypedDict
 */
p5.TypedDict = class TypedDict {
  constructor(key, value) {
    if (key instanceof Object) {
      this.data = key;
    } else {
      this.data = {};
      this.data[key] = value;
    }
    return this;
  }

  /**
   * Returns the number of key-value pairs currently stored in the Dictionary.
   *
   * @return {Integer} the number of key-value pairs in the Dictionary
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict(1, 10);
   *   myDictionary.create(2, 20);
   *   myDictionary.create(3, 30);
   *   print(myDictionary.size()); // logs 3 to the console
   * }
   * </code></div>
   */
  size() {
    return Object.keys(this.data).length;
  }

  /**
   * Returns true if the given key exists in the Dictionary,
   * otherwise returns false.
   *
   * @param {Number|String} key that you want to look up
   * @return {Boolean} whether that key exists in Dictionary
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   print(myDictionary.hasKey('p5')); // logs true to console
   * }
   * </code></div>
   */

  hasKey(key) {
    return this.data.hasOwnProperty(key);
  }

  /**
   * Returns the value stored at the given key.
   *
   * @param {Number|String} the key you want to access
   * @return {Number|String} the value stored at that key
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   let myValue = myDictionary.get('p5');
   *   print(myValue === 'js'); // logs true to console
   * }
   * </code></div>
   */

  get(key) {
    if (this.data.hasOwnProperty(key)) {
      return this.data[key];
    } else {
      console.log(`${key} does not exist in this Dictionary`);
    }
  }

  /**
   * Updates the value associated with the given key in case it already exists
   * in the Dictionary. Otherwise a new key-value pair is added.
   *
   * @param {Number|String} key
   * @param {Number|String} value
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   myDictionary.set('p5', 'JS');
   *   myDictionary.print(); // logs "key: p5 - value: JS" to console
   * }
   * </code></div>
   */

  set(key, value) {
    if (this._validate(value)) {
      this.data[key] = value;
    } else {
      console.log('Those values dont work for this dictionary type.');
    }
  }

  /**
   * private helper function to handle the user passing in objects
   * during construction or calls to create()
   */

  _addObj(obj) {
    for (const key in obj) {
      this.set(key, obj[key]);
    }
  }

  /**
   * Creates a new key-value pair in the Dictionary.
   *
   * @param {Number|String} key
   * @param {Number|String} value
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   myDictionary.create('happy', 'coding');
   *   myDictionary.print();
   *   // above logs "key: p5 - value: js, key: happy - value: coding" to console
   * }
   * </code></div>
   */
  /**
   * @param {Object} obj key/value pair
   */
  create(key, value) {
    if (key instanceof Object && typeof value === 'undefined') {
      this._addObj(key);
    } else if (typeof key !== 'undefined') {
      this.set(key, value);
    } else {
      console.log(
        'In order to create a new Dictionary entry you must pass ' +
        'an object or a key, value pair'
      );
    }
  }

  /**
   * Removes all previously stored key-value pairs from the Dictionary.
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   print(myDictionary.hasKey('p5')); // prints 'true'
   *   myDictionary.clear();
   *   print(myDictionary.hasKey('p5')); // prints 'false'
   * }
   * </code>
   * </div>
   */
  clear() {
    this.data = {};
  }

  /**
   * Removes the key-value pair stored at the given key from the Dictionary.
   *
   * @param {Number|String} key for the pair to remove
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   myDictionary.create('happy', 'coding');
   *   myDictionary.print();
   *   // above logs "key: p5 - value: js, key: happy - value: coding" to console
   *   myDictionary.remove('p5');
   *   myDictionary.print();
   *   // above logs "key: happy value: coding" to console
   * }
   * </code></div>
   */
  remove(key) {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
    } else {
      throw new Error(`${key} does not exist in this Dictionary`);
    }
  }

  /**
   * Logs the set of items currently stored in the Dictionary to the console.
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let myDictionary = createStringDict('p5', 'js');
   *   myDictionary.create('happy', 'coding');
   *   myDictionary.print();
   *   // above logs "key: p5 - value: js, key: happy - value: coding" to console
   * }
   * </code>
   * </div>
   */
  print() {
    for (const item in this.data) {
      console.log(`key:${item} value:${this.data[item]}`);
    }
  }

  /**
   * Converts the Dictionary into a CSV file for local download.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   text('click here to save', 10, 10, 70, 80);
   * }
   *
   * function mousePressed() {
   *   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *     createStringDict({
   *       john: 1940,
   *       paul: 1942,
   *       george: 1943,
   *       ringo: 1940
   *     }).saveTable('beatles');
   *   }
   * }
   * </code>
   * </div>
   */
  saveTable(filename) {
    let output = '';

    for (const key in this.data) {
      output += `${key},${this.data[key]}\n`;
    }

    const blob = new Blob([output], { type: 'text/csv' });
    p5.prototype.downloadFile(blob, filename || 'mycsv', 'csv');
  }

  /**
   * Converts the Dictionary into a JSON file for local download.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(200);
   *   text('click here to save', 10, 10, 70, 80);
   * }
   *
   * function mousePressed() {
   *   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
   *     createStringDict({
   *       john: 1940,
   *       paul: 1942,
   *       george: 1943,
   *       ringo: 1940
   *     }).saveJSON('beatles');
   *   }
   * }
   * </code>
   * </div>
   */
  saveJSON(filename, opt) {
    p5.prototype.saveJSON(this.data, filename, opt);
  }

  /**
   * private helper function to ensure that the user passed in valid
   * values for the Dictionary type
   */
  _validate(value) {
    return true;
  }
};

/**
 *
 * A simple Dictionary class for Strings.
 *
 * @class p5.StringDict
 * @extends p5.TypedDict
 */
p5.StringDict = class StringDict extends p5.TypedDict {
  constructor(...args) {
    super(...args);
  }

  _validate(value) {
    return typeof value === 'string';
  }
};

/**
 *
 * A simple Dictionary class for Numbers.
 *
 * @class p5.NumberDict
 * @extends p5.TypedDict
 */

p5.NumberDict = class NumberDict extends p5.TypedDict {
  constructor(...args) {
    super(...args);
  }

  /**
   * private helper function to ensure that the user passed in valid
   * values for the Dictionary type
   */
  _validate(value) {
    return typeof value === 'number';
  }

  /**
   * Add the given number to the value currently stored at the given key.
   * The sum then replaces the value previously stored in the Dictionary.
   *
   * @param {Number} Key for the value you wish to add to
   * @param {Number} Number to add to the value
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict(2, 5);
   *   myDictionary.add(2, 2);
   *   print(myDictionary.get(2)); // logs 7 to console.
   * }
   * </code></div>
   *
   */
  add(key, amount) {
    if (this.data.hasOwnProperty(key)) {
      this.data[key] += amount;
    } else {
      console.log(`The key - ${key} does not exist in this dictionary.`);
    }
  }

  /**
   * Subtract the given number from the value currently stored at the given key.
   * The difference then replaces the value previously stored in the Dictionary.
   *
   * @param {Number} Key for the value you wish to subtract from
   * @param {Number} Number to subtract from the value
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict(2, 5);
   *   myDictionary.sub(2, 2);
   *   print(myDictionary.get(2)); // logs 3 to console.
   * }
   * </code></div>
   *
   */
  sub(key, amount) {
    this.add(key, -amount);
  }

  /**
   * Multiply the given number with the value currently stored at the given key.
   * The product then replaces the value previously stored in the Dictionary.
   *
   * @param {Number} Key for value you wish to multiply
   * @param {Number} Amount to multiply the value by
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict(2, 4);
   *   myDictionary.mult(2, 2);
   *   print(myDictionary.get(2)); // logs 8 to console.
   * }
   * </code></div>
   *
   */
  mult(key, amount) {
    if (this.data.hasOwnProperty(key)) {
      this.data[key] *= amount;
    } else {
      console.log(`The key - ${key} does not exist in this dictionary.`);
    }
  }

  /**
   * Divide the given number with the value currently stored at the given key.
   * The quotient then replaces the value previously stored in the Dictionary.
   *
   * @param {Number} Key for value you wish to divide
   * @param {Number} Amount to divide the value by
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict(2, 8);
   *   myDictionary.div(2, 2);
   *   print(myDictionary.get(2)); // logs 4 to console.
   * }
   * </code></div>
   *
   */
  div(key, amount) {
    if (this.data.hasOwnProperty(key)) {
      this.data[key] /= amount;
    } else {
      console.log(`The key - ${key} does not exist in this dictionary.`);
    }
  }

  /**
   * private helper function for finding lowest or highest value
   * the argument 'flip' is used to flip the comparison arrow
   * from 'less than' to 'greater than'
   */
  _valueTest(flip) {
    if (Object.keys(this.data).length === 0) {
      throw new Error(
        'Unable to search for a minimum or maximum value on an empty NumberDict'
      );
    } else if (Object.keys(this.data).length === 1) {
      return this.data[Object.keys(this.data)[0]];
    } else {
      let result = this.data[Object.keys(this.data)[0]];
      for (const key in this.data) {
        if (this.data[key] * flip < result * flip) {
          result = this.data[key];
        }
      }
      return result;
    }
  }

  /**
   * Return the lowest number currently stored in the Dictionary.
   *
   * @return {Number}
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict({ 2: -10, 4: 0.65, 1.2: 3 });
   *   let lowestValue = myDictionary.minValue(); // value is -10
   *   print(lowestValue);
   * }
   * </code></div>
   */
  minValue() {
    return this._valueTest(1);
  }

  /**
   * Return the highest number currently stored in the Dictionary.
   *
   * @return {Number}
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict({ 2: -10, 4: 0.65, 1.2: 3 });
   *   let highestValue = myDictionary.maxValue(); // value is 3
   *   print(highestValue);
   * }
   * </code></div>
   */
  maxValue() {
    return this._valueTest(-1);
  }

  /**
   * private helper function for finding lowest or highest key
   * the argument 'flip' is used to flip the comparison arrow
   * from 'less than' to 'greater than'
   */
  _keyTest(flip) {
    if (Object.keys(this.data).length === 0) {
      throw new Error('Unable to use minValue on an empty NumberDict');
    } else if (Object.keys(this.data).length === 1) {
      return Object.keys(this.data)[0];
    } else {
      let result = Object.keys(this.data)[0];
      for (let i = 1; i < Object.keys(this.data).length; i++) {
        if (Object.keys(this.data)[i] * flip < result * flip) {
          result = Object.keys(this.data)[i];
        }
      }
      return result;
    }
  }

  /**
   * Return the lowest key currently used in the Dictionary.
   *
   * @return {Number}
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict({ 2: 4, 4: 6, 1.2: 3 });
   *   let lowestKey = myDictionary.minKey(); // value is 1.2
   *   print(lowestKey);
   * }
   * </code></div>
   */
  minKey() {
    return this._keyTest(1);
  }

  /**
   * Return the highest key currently used in the Dictionary.
   *
   * @return {Number}
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let myDictionary = createNumberDict({ 2: 4, 4: 6, 1.2: 3 });
   *   let highestKey = myDictionary.maxKey(); // value is 4
   *   print(highestKey);
   * }
   * </code></div>
   */
  maxKey() {
    return this._keyTest(-1);
  }
};

export default p5.TypedDict;
