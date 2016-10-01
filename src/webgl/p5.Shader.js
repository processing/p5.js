'use strict';

var p5 = require('../core/core');

/**
 * p5 Shader class
 * @constructor
 * @param  {String} fragShader Source code of a fragment shader as
 * @param  {String} vertShader Source code of a vertex shader as a string
 *
 */
p5.Shader = function(fragSource, vertSource){
  this._uniforms = {};

  this.fragSource = fragSource;
  this.vertSource = vertSource;
};

p5.Shader.prototype.set = function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  var uObj = this._uniforms;
  var uName = args.shift();

  var uType;
  if(typeof args[args.length - 1] === 'string') {
    uType = args.pop();
  }
  var uData = args.length === 1 ? args[0] : args;

  if(typeof uData === 'number') { // If this is a floating point number
    uType = uType || '1f';
  } else if(Array.isArray(uData) && uData.length <= 4) {
    uType = uData.length + 'fv';
  } else if(uData instanceof p5.Vector) {
    uType = '3fv';
  } else if(uData instanceof p5.Color) {
    uType = '4fv';
  } else if(uData instanceof p5.Matrix) {
    if('mat3' in uData) {
      uType = 'Matrix3fv';
    } else {
      uType = 'Matrix4fv';
    }
  } else if(uData instanceof p5.Graphics ||
            uData instanceof p5.Image ||
            (typeof p5.MediaElement !== 'undefined' &&
             uData instanceof p5.MediaElement)) {
    uType = 'texture';
  } else {
    console.error('Didn\'t recognize the type of this uniform.');
  }

  if(!(uName in uObj)) {
    uObj[uName] = {};
    uObj[uName].type = uType;
    uObj[uName].data = uData;
    uObj[uName].location = [];
  } else {
    uObj[uName].data = uData;
  }
};

/* Shader Globals */
p5.Shader._uniforms = {};

p5.Shader._getGlobal = function(uName) {
  return p5.Shader._uniforms[uName].data;
};

p5.Shader._setGlobal = function() {
  p5.Shader.prototype.set.apply(p5.Shader, arguments);
};

module.exports = p5.Shader;