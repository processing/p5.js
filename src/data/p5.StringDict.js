/**
 * @module Data 
 * @submodule Dictionary
 * @for p5
 */
var p5 = require('./core');

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
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @param {Boolean} whether we're using it as main canvas
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
}


p5.NumberDict.prototype = Object.create(p5.TypedDict.prototype);

p5.NumberDict.prototype._validate = function(key, value) {
  return (typeof value === 'number');
}


module.exports = p5.StringDict;
