/**
 * @module Data 
 * @submodule Dictionary
 * @for p5
 *@requires core
 */

var p5 = require('../core/core');

//TESTED
p5.prototype.createStringDict = function(key, value) {
  return new p5.StringDict(key, value);
}

p5.TypedDict = function() {
};

//TESTED
p5.TypedDict.prototype.size = function(){
  return this.count;
};

//TESTED
p5.TypedDict.prototype.get = function(key) {
  if(this.data.hasOwnProperty(key)){
    return this.data[key];
  }else{
    console.log(key + ' does not exist in this Dictionary');
  }
};

//TESTED
p5.TypedDict.prototype.set = function(key, value) {
   if (arguments.length === 2) {
    if(!this.data.hasOwnProperty(key)){
      this.create(key, value);
    } else {
      this.data[key] = value;
    }
  }
};

//TESTED
p5.TypedDict.prototype._add = function(obj) {
 for (var key in obj) {
   if(this._validate(obj[key])) {
     this.data[key] = obj[key];
     this.count++;
   }
  }
}


//TESTED
p5.TypedDict.prototype.create = function(key, value) {
  if(arguments.length === 1) {
    if(key instanceof Object) {
      this._add(key);
    }
  }
  else if(this._validate(value)) {
    this.data[key] = value;
    this.count++;
  } else {
    console.log('those values dont work for this dictionary type');
  }
};

//TESTED
p5.TypedDict.prototype.clear = function(){
  for(var key in this.data) {
    delete this.data[key];
  }
  this.count = 0;
};

//TESTED
p5.TypedDict.prototype.remove = function(key) {
  if(this.data.hasOwnProperty(key)) {
    delete this.data[key];
    this.count--;
  } else {
    throw key + ' does not exist in this Dictionary';
  }
};


//TESTED
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
    if(keys instanceof Object) {
      this.data = keys;
      this.count = Object.keys(keys).length;
    }
  } else {
    this.data[key] = value;
    this.count++;
  }
  return this;
};


p5.StringDict.prototype = Object.create(p5.TypedDict.prototype);

//TESTED
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

p5.NumberDict.prototype.add = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] += amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};

//After Dan Shiffman's design
p5.NumberDict.prototype.sub = function(key, amount) {
  this.add(key, -amount);
};

p5.NumberDict.prototype.mult = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] *= amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};

p5.NumberDict.prototype.div = function(key, amount) {
  if(this.data.hasOwnProperty(key)){
    this.data[key] /= amount;
  } else {
    console.log('The key - ' + key + ' does not exist in this dictionary.');
  }
};



module.exports = p5.TypedDict;
