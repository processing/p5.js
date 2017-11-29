/**
 * @module Data
 * @submodule Dictionary
 * @for p5.TypedDict
 * @requires core
 *
 * This module defines the p5 methods for the p5 Dictionary classes
 * these classes StringDict and NumberDict are for storing and working
 * with key, value pairs
 */

'use strict';

var p5 = require('../core/core');

/**
 *
 * Creates a new instance of p5.StringDict using the key, value pair
 * or object you provide.
 *
 * @method createStringDict
 * @param {String|Object} key or object
 * @param {String} value
 * @return {p5.StringDict}
 *
 */

p5.prototype.createStringDict = function() {
  return new p5.StringDict(arguments[0], arguments[1]);
};

/**
 *
 * Creates a new instance of p5.NumberDict using the key, value pair
 * or object you provide.
 *
 * @method createNumberDict
 * @param {Number|Object} key or object
 * @param {Number} value
 * @return {p5.NumberDict}
 *
 */

p5.prototype.createNumberDict = function() {
  return new p5.NumberDict(arguments[0], arguments[1]);
};

/**
 *
 * Base class for all p5.Dictionary types. More specifically
 * typed Dictionary objects inherit from this
 *
 * @class p5.TypedDict
 * @constructor
 *
 */

p5.TypedDict = function() {
  this.data = {};
  if(arguments[0][0] instanceof Object) {
    this.data = arguments[0][0];
  } else {
    this.data[arguments[0][0]] = arguments[0][1];
  }
  return this;
};

/**
 * Returns the number of key-value pairs currently in Dictionary object
 *
 * @method size
 * @return {Number} the number of key-value pairs in Dictionary object
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createNumberDict(1, 10);
 *   myDictionary.create(2, 20);
 *   myDictionary.create(3, 30);
 *   var amt = myDictionary.size(); // value of amt is 3
 * }
 *
 * </code></div>
 *
 */
p5.TypedDict.prototype.size = function(){
  return Object.keys(this.data).length;
};

/**
 * Returns true if key exists in Dictionary
 * otherwise returns false
 *
 * @method hasKey
 * @param {Number|String} key that you want to access
 * @return {Boolean} whether that key exists in Dictionary
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createStringDict('p5', 'js');
 *   print(myDictionary.hasKey('p5')); // logs true to console
 * }
 *
 * </code></div>
 *
 */

p5.TypedDict.prototype.hasKey = function(key) {
  return this.data.hasOwnProperty(key);
};

/**
 * Returns value stored at supplied key.
 *
 * @method get
 * @param {Number|String} key that you want to access
 * @return {Number|String} the value stored at that key
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createStringDict('p5', 'js');
 *   var myValue = myDictionary.get('p5');
 *   print(myValue === 'js'); // logs true to console
 * }
 *
 * </code></div>
 *
 */

p5.TypedDict.prototype.get = function(key) {
  if(this.data.hasOwnProperty(key)){
    return this.data[key];
  }else{
    console.log(key + ' does not exist in this Dictionary');
  }
};

/**
 * Changes the value of key if in it already exists in
 * in the Dictionary otherwise makes a new key-value pair
 *
 * @method set
 * @param {Number|String} key
 * @param {Number|String} value
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createStringDict('p5', 'js');
 *   myDictionary.set('p5', 'JS');
 *   myDictionary.print()
 *   // above logs "key: p5 - value: JS" to console
 * }
 *
 * </code></div>
 *
 */

p5.TypedDict.prototype.set = function(key, value) {
  if (arguments.length === 2) {
    if(!this.data.hasOwnProperty(key)){
      this.create(key, value);
    } else {
      this.data[key] = value;
    }
  }
};

/**
 * private helper function to handle the user passing objects in
 * during construction or calls to create()
 */

p5.TypedDict.prototype._addObj = function(obj) {
  for (var key in obj) {
    if(this._validate(obj[key])) {
      this.data[key] = obj[key];
    } else {
      console.log('Those values dont work for this dictionary type.');
    }
  }
};

/**
 * Removes a key-value pair in the Dictionary
 *
 * @method create
 * @param {Number|String} key
 * @param {Number|String} value
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createStringDict('p5', 'js');
 *   myDictionary.create('happy', 'coding');
 *   myDictionary.print()
 *   // above logs "key: p5 - value: js, key: happy - value: coding" to console
 * }
 *
 * </code></div>
 */
/**
 * @method create
 * @param {Object} obj key/value pair
 */

p5.TypedDict.prototype.create = function() {
  if(arguments.length === 1 && arguments[0] instanceof Object) {
    this._addObj(arguments[0]);
  }
  else if(arguments.length === 2) {
    var obj = {};
    obj[arguments[0]] = arguments[1];
    this._addObj(obj);
  } else {
    console.log('In order to create a new Dictionary entry you must pass ' +
      'an object or a key, value pair');
  }
};

/**
 * Empties Dictionary of all key-value pairs
 * @method clear
 *
 *
 */

p5.TypedDict.prototype.clear = function(){
  this.data = {};
};

/**
 * Removes a key-value pair in the Dictionary
 *
 * @method remove
 * @param {Number|String} key for the pair to remove
 *
 * @example
 * <div class="norender">
 * <code>
 *
 * function setup() {
 *   var myDictionary = createStringDict('p5', 'js');
 *   myDictionary.create('happy', 'coding');
 *   myDictionary.print()
 *   // above logs "key: p5 - value: js, key: happy - value: coding" to console
 *   myDictionary.remove('p5');
 *   myDictionary.print();
 *   // above logs "key: happy value: coding" to console
 * }
 *
 * </code></div>
 *
 */

p5.TypedDict.prototype.remove = function(key) {
  if(this.data.hasOwnProperty(key)) {
    delete this.data[key];
  } else {
    throw key + ' does not exist in this Dictionary';
  }
};

/**
 * Logs the list of items currently in the Dictionary to the console
 *
 * @method print
 */

p5.TypedDict.prototype.print = function() {
  for (var item in this.data) {
    console.log('key:' + item + ' value:' + this.data[item]);
  }
};

/**
 * Converts the Dictionary into a CSV file for local
 * storage.
 *
 * @method saveTable
 */

p5.TypedDict.prototype.saveTable = function() {
  var output = '';

  for (var key in this.data) {
    output += key + ',' + this.data[key] + '\n';
  }

  var filename = arguments[0] || 'mycsv';
  var blob = new Blob([output], {type: 'text/csv'});
  p5.prototype.downloadFile(blob, filename, 'csv');
};

/**
 * Converts the Dictionary into a JSON file for local
 * storage.
 *
 * @method saveJSON
 */

p5.TypedDict.prototype.saveJSON = function(filename, opt) {
  p5.prototype.saveJSON(this.data, filename, opt);
};

/**
 * private helper function to ensure that the user passed in valid
 * values for the Dictionary type
 */

p5.TypedDict.prototype._validate = function(key, value) {
  return true;
};

/**
 *
 * A  Dictionary class for Strings.
 *
 *
 * @class p5.StringDict
 * @constructor
 * @extends p5.TypedDict
 *
 */

p5.StringDict = function() {
  p5.TypedDict.call(this, arguments);
};

p5.StringDict.prototype = Object.create(p5.TypedDict.prototype);

p5.StringDict.prototype._validate = function(value) {
  return (typeof value === 'string');
};

/**
 *
 * A simple Dictionary class for Numbers.
 *
 *
 * @class p5.NumberDict
 * @constructor
 * @extends p5.TypedDict
 *
 */

p5.NumberDict = function() {
  p5.TypedDict.call(this, arguments);
};

p5.NumberDict.prototype = Object.create(p5.TypedDict.prototype);

/**
 * private helper function to ensure that the user passed in valid
 * values for the Dictionary type
 */

p5.NumberDict.prototype._validate = function(value) {
  return (typeof value === 'number');
};

/**
 * Add to a value stored at a certain key
 * The sum is stored in that location in the Dictionary.
 *
 * @method add
 * @param {Number} Key for value you wish to add to
 * @param {Number} Amount to add to the value
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict(2, 5);
 *   myDictionary.add(2, 2);
 *   console.log(myDictionary.get(2)); // logs 7 to console.
 * }
 * </code></div>
 *
 *
 */

p5.NumberDict.prototype.add = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] += amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};

/**
 * Subtract from a value stored at a certain key
 * The difference is stored in that location in the Dictionary.
 *
 * @method sub
 * @param {Number} Key for value you wish to subtract from
 * @param {Number} Amount to subtract from the value
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict(2, 5);
 *   myDictionary.sub(2, 2);
 *   console.log(myDictionary.get(2)); // logs 3 to console.
 * }
 * </code></div>
 *
 *
 */

p5.NumberDict.prototype.sub = function(key, amount) {
  this.add(key, -amount);
};

/**
 * Multiply a value stored at a certain key
 * The product is stored in that location in the Dictionary.
 *
 * @method mult
 * @param {Number} Key for value you wish to multiply
 * @param {Number} Amount to multiply the value by
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict(2, 4);
 *   myDictionary.mult(2, 2);
 *   console.log(myDictionary.get(2)); // logs 8 to console.
 * }
 * </code></div>
 *
 *
 */

p5.NumberDict.prototype.mult = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] *= amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};

/**
 * Divide a value stored at a certain key
 * The quotient is stored in that location in the Dictionary.
 *
 * @method div
 * @param {Number} Key for value you wish to divide
 * @param {Number} Amount to divide the value by
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict(2, 8);
 *   myDictionary.div(2, 2);
 *   console.log(myDictionary.get(2)); // logs 4 to console.
 * }
 * </code></div>
 *
 *
 */

p5.NumberDict.prototype.div = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] /= amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};

/**
 * private helper function for finding lowest or highest value
 * the argument 'flip' is used to flip the comparison arrow
 * from 'less than' to 'greater than'
 *
 */

p5.NumberDict.prototype._valueTest = function(flip) {
  if(Object.keys(this.data).length === 0) {
    throw 'Unable to search for a minimum or maximum value on an empty NumberDict';
  } else if(Object.keys(this.data).length === 1) {
    return this.data[Object.keys(this.data)[0]];
  } else {
    var result = this.data[Object.keys(this.data)[0]];
    for(var key in this.data) {
      if(this.data[key] * flip < result * flip) {
        result = this.data[key];
      }
    }
    return result;
  }
};

/**
 * Return the lowest value.
 *
 * @method minValue
 * @return {Number}
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict({2 : -10, 4 : 0.65, 1.2 : 3});
 *   var lowestValue = myDictionary.minValue(); // value is -10
 * }
 * </code></div>
 *
 */

p5.NumberDict.prototype.minValue = function() {
  return this._valueTest(1);
};

/**
 * Return the highest value.
 *
 * @method maxValue
 * @return {Number}
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict({2 : -10, 4 : 0.65, 1.2 : 3});
 *   var highestValue = myDictionary.maxValue(); // value is 3
 * }
 * </code></div>
 *
 */

p5.NumberDict.prototype.maxValue = function() {
  return this._valueTest(-1);
};

/**
 * private helper function for finding lowest or highest key
 * the argument 'flip' is used to flip the comparison arrow
 * from 'less than' to 'greater than'
 *
 */

p5.NumberDict.prototype._keyTest = function(flip) {
  if(Object.keys(this.data).length === 0) {
    throw 'Unable to use minValue on an empty NumberDict';
  } else if(Object.keys(this.data).length === 1) {
    return Object.keys(this.data)[0];
  } else {
    var result = Object.keys(this.data)[0];
    for(var i=1; i<Object.keys(this.data).length; i++) {
      if(Object.keys(this.data)[i] * flip < result * flip) {
        result = Object.keys(this.data)[i];
      }
    }
    return result;
  }
};

/**
 * Return the lowest key.
 *
 * @method minKey
 * @return {Number}
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict({2 : 4, 4 : 6, 1.2 : 3});
 *   var lowestKey = myDictionary.minKey(); // value is 1.2
 * }
 * </code></div>
 *
 */

p5.NumberDict.prototype.minKey = function() {
  return this._keyTest(1);
};

/**
 * Return the highest key.
 *
 * @method maxKey
 * @return {Number}
 * @example
 * <div class='norender'>
 * <code>
 * function setup() {
 *   var myDictionary = createNumberDict({ 2 : 4, 4 : 6, 1.2 : 3});
 *   var highestKey = myDictionary.maxKey(); // value is 4
 * }
 * </code></div>
 *
 */

p5.NumberDict.prototype.maxKey = function() {
  return this._keyTest(-1);
};

module.exports = p5.TypedDict;