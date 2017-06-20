/**
 * @module Data
 * @submodule Dictionary
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * This module defines the p5 methods for the p5 Dictionary classes
 * these classes StringDict and NumberDict are for storing and working
 * with key, value pairs
 */

/**
 * Creates a new p5.StringDict using the key-value pair that you pass in
 *
 *
 *
 * @alt
 * ALT TEXT HERE EVENTUALLY
 */
p5.prototype.createStringDict = function() {
  return new p5.StringDict(arguments[0], arguments[1]);
};

// /**
//  * Creates a new p5.NumberDict using the key-value pair that you pass in
//  *
//  * @method createNumberDict()
//  * @param {}
//  * @param {}
//  * @return {p5.NumberDict}
//  * @example
//  * <div>
//  * <code>
//  * </code>
//  * </div>
//  *
//  * @alt
//  * ALT TEXT HERE EVENTUALLY
//  */
p5.prototype.createNumberDict = function() {
  return new p5.NumberDict(arguments[0], arguments[1]);
};

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
 *
 */
p5.TypedDict.prototype.size = function(){
  return Object.keys(this.data).length;
};

/**
 * Returns true if dictionary has key value pair
 *
 *
 */
p5.TypedDict.prototype.hasKey = function(key) {
  return this.data.hasOwnProperty(key);
};

/**
 * Returns the key-value pair located at key
 *
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
 * Changes the value of key if in Dictionary otherwise makes new one
 *
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
 * Creates a new key-value pair in Dictionary object
 *
 *
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
 * Empties out Dictionary object
 *
 *
 */
p5.TypedDict.prototype.clear = function(){
  for(var key in this.data) {
    delete this.data[key];
  }
};

/**
 * Removes a key-value pair in the Dictionary
 *
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
 * Logs the list of items currently in the Dictionary
 *
 *
 */
p5.TypedDict.prototype.print = function() {
  for (var item in this.data) {
    console.log('key:' + item + ' value:' + this.data[item]);
  }
};

p5.TypedDict.prototype.saveTable = function() {
  var output = '';

  for (var key in this.data) {
    output += key + ',' + this.data[key] + '\n';
  }

  var filename = arguments[0] || 'mycsv';
  var file = new Blob([output], {type: 'text/csv'});
  var href = window.URL.createObjectURL(file);

  p5.prototype.downloadFile(href, filename, 'csv');
};

p5.TypedDict.prototype.saveJSON = function(filename, opt) {
  p5.prototype.saveJSON(this.data, filename, opt);
};


p5.TypedDict.prototype._validate = function(key, value) {
  return true;
};

// /**
//  *
//  * A simple Dictionary class for Strings.
//  *
//  *
//  * @class p5.StringDict
//  * @constructor
//  * @extends p5.Element
//  * @param {String}
//  */


p5.StringDict = function() {
  p5.TypedDict.call(this, arguments);
};

p5.StringDict.prototype = Object.create(p5.TypedDict.prototype);

p5.StringDict.prototype._validate = function(value) {
  return (typeof value === 'string');
};



// /**
//  *
//  * A simple Dictionary class for Numbers.
//  *
//  *
//  * @class p5.NumberDict
//  * @constructor
//  * @extends p5.TypedDict
//  * @param
//  */
p5.NumberDict = function() {
  p5.TypedDict.call(this, arguments);
};

p5.NumberDict.prototype = Object.create(p5.TypedDict.prototype);

p5.NumberDict.prototype._validate = function(value) {
  return (typeof value === 'number');
};

/**
 * Add an amount to the current value in the Dictionary
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
 * Subtract an amount from a current value in the Dictionary
 *
 *
 */
p5.NumberDict.prototype.sub = function(key, amount) {
  this.add(key, -amount);
};

/**
 * Multiply a current value in the Dictionary
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
 * Divide a current value in the Dictionary
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
 * Return the lowest value
 *
 *
 */
p5.NumberDict.prototype.minValue = function() {
  return this._valueTest(1);
};

p5.NumberDict.prototype.maxValue = function() {
  return this._valueTest(-1);
};

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
 * Return the lowest key
 *
 *
 */
p5.NumberDict.prototype.minKey = function() {
  return this._keyTest(1);
};

p5.NumberDict.prototype.maxKey = function() {
  return this._keyTest(-1);
};




module.exports = p5.TypedDict;
