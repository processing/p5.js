'use strict';

var p5 = require('../core/core');
var renderer = require('./p5.RendererGL');

/**
 * p5 Shader class
 * @constructor
 * @param  {String} fragShader Source code of a fragment shader as
 * @param  {String} vertShader Source code of a vertex shader as a string
 *
 */
p5.Shader = function(fragSource, vertSource){
  //TODO: this key should be the hash of the optional fragSource and vertSource
  this.shaderKey = 'customShader';
  this._uniforms = {};

  this.fragSource = fragSource;
  this.vertSource = vertSource;
};

p5.Shader.prototype.set = function() {
  renderer.prototype._setUniform.apply(this, arguments);
};

module.exports = p5.Shader;