/**
 * @module Data 
 * @submodule Dictionary
 * @for p5
 */

var p5 = require('./core');
var constants = require('./constants');

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
this.count = keys.length;
this.data = {};
  if(count >= 1) {
    for(var i=0; i<count; i++) {
      this.data.push({
        key: keys[i];
        value: values[i];
      });
    }
  }
  

  return this;
};

p5.StringDict.prototype.size = function(){
  return this.count;
};

p5.StringDict.prototype.get = function(key) {
  if(key in this.data){
      return this.data[key];
  } else {
      throw key + ' does not exist in this Dictionary';
   }
};

p5.StringDict.prototype.clear = function(){
  this.data = {};
  this.count = 0;
}

p5.Graphics.prototype.remove = function(key) {
    var index = this.data.indexOf(key);
    if(index > -1) {
      this.data.splice(index, 1);
      this.count--;
    } else {
      throw key + ' does not exist in this Dictionary';
    }
};

module.exports = p5.StringDict;
