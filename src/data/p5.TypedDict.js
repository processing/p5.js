/**
 * @module Data 
 * @submodule Dictionary
 * @for p5
 *@requires core
 */

var p5 = require('../core/core');

/**
 * This module defines the p5 methods for the p5 Dictionary classes
 * these classes StringDict and NumberDict are for storing and working
 * with key, value pairs
 */

/** 
 * Creates a new p5.StringDict using the key-value pair that you pass in
 * 
 * @method createStringDict()
 * @param {}
 * @param {}
 * @return {p5.StringDict}
 * @example
 * <div>
 * <code>
 * EXAMPLE GOES HERE EVENTUALLY
 * </code>
 * </div>
 *
 * @alt
 * ALT TEXT HERE EVENTUALLY
 */

p5.prototype.createStringDict = function() {
  return new p5.StringDict(arguments[0], arguments[1]);
};

/** 
 * Creates a new p5.NumberDict using the key-value pair that you pass in
 * 
 * @method createNumberDict()
 * @param {}
 * @param {}
 * @return {p5.NumberDict}
 * @example
 * <div>
 * <code>
 * EXAMPLE GOES HERE EVENTUALLY
 * </code>
 * </div>
 *
 * @alt
 * ALT TEXT HERE EVENTUALLY
 */

p5.prototype.createNumberDict = function() {
  return new p5.StringDict(arguments[0], arguments[1]);
};

p5.TypedDict = function() {
};

/**
 * Returns the number of key-value pairs currently in Dictionary object
 * 
 *
 */

p5.TypedDict.prototype.size = function(){
  return this.count;
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


p5.TypedDict.prototype._add = function(obj) {
 for (var key in obj) {
   if(this._validate(obj[key])) {
     this.data[key] = obj[key];
     this.count++;
   }
  }
}


/**
 * Creates a new key-value pair in Dictionary object
 * 
 *
 */

p5.TypedDict.prototype.create = function() {
  if(arguments.length === 1) {
    if(arguments[0] instanceof Object) {
      this._addObj(arguments[0]);
    }
  }
  else if(arguments.length === 2) {
    var key = arguments[0];
    var value = arguments[1];
    if (this._validate(value)) {
      this.data[key] = value;
      this.count++;
    } else {
      console.log('those values dont work for this dictionary type');
    }
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
  this.count = 0;
};

/**
 * Removes a key-value pair in the Dictionary 
 * 
 *
 */

p5.TypedDict.prototype.remove = function(key) {
  if(this.data.hasOwnProperty(key)) {
    delete this.data[key];
    this.count--;
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

p5.TypedDict.prototype._validate = function(key, value) {
  return true;
};

/**
 *
 * A simple Dictionary class for Strings.
 *
 *
 * @class p5.StringDict
 * @constructor
 * @extends p5.Element
 * @param {String} 
 */

p5.StringDict = function(key, value) {
  this.data = {};
  this.count = 0;

  if(arguments.length === 1) {
    if(key instanceof Object) {
      this.data = key;
      this.count = Object.keys(keys).length;
    }
  } else {
    this.data[key] = value;
    this.count++;
  }
  return this;
};


p5.StringDict.prototype = Object.create(p5.TypedDict.prototype);


p5.StringDict.prototype._validate = function(value) {
  return (typeof value === 'string');  
};

/**
 *
 * A simple Dictionary class for Strings.
 *
 *
 * @class p5.NumberDict
 * @constructor
 * @extends p5.TypedDict
 * @param
 */


p5.NumberDict.prototype = Object.create(p5.TypedDict.prototype);

p5.NumberDict.prototype._validate = function(key, value) {
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



module.exports = p5.TypedDict;
