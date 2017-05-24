/**
 * @module Data 
 * @submodule Dictionary
 * @for p5
 */
var p5 = require('./core');
//var constants = require('./constants');
/**
 *
 * A simple table class to use a String as a lookup for another String value.
 *
 *
 * @class p5.StringDict
 * @constructor
 * @extends p5.Element
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @param {Boolean} whether we're using it as main canvas
 */

p5.StringDict = function(keys, values) {

  this.data = {};
  this.count = 0;

  if(arguments.length === 1) {
    if(keys instanceof Object) {
      this.data = keys;
      this.count = Object.keys(keys).length;
    }
  } /*else if(arguments.length > 1) {
    this.count = keys.length;
    if(count >= 1) {
      for(var i=0; i<count; i++) {
        this.data.push({
          keys[i]: values[i];
        });
      }
    }
  }*/

  return this;
};

p5.StringDict.prototype.size = function(){
  return this.count;
};

p5.StringDict.prototype.get = function(key) {
  if(this.data.hasOwnProperty(key)){
    return this.data.key;
  }else{
    throw key + ' does not exist in this Dictionary';
  }
};

p5.StringDict.prototype.add = function(key, value) {
  if(arguments.length === 1) {
    if(key instanceof Object) {
      this.data.push(key);
      this.count += Object.keys(key).length;
    }
  } else if (arguments.length === 2) {
    //another type check here probably
    this.data.push({
      key: value
    });
    count++;
  }
};

p5.StringDict.prototype.clear = function(){
  this.data = {};
  this.count = 0;
};

p5.StringDict.prototype.remove = function(key) {
  if(this.data.hasOwnProperty(key)) {
    delete this.data.key;
    this.count--;
  } else {
    throw key + ' does not exist in this Dictionary';
  }
};

p5.StringDict.prototype.print = function() {
  for(var i=0; i<this.count; i++) {
    console.log(Object.keys(this.data[i] + \n));
  }
};


module.exports = p5.StringDict;
