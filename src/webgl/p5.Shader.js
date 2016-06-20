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
p5.Shader = function(fragShader, vertShader){
  this.shaderKey = fragShader + '|' + vertShader;
  this._uniforms = {};

  //TODO: Come up with a better system for loading external files
  //TODO: Make sure this works in instance mode
  //TODO: Actually, re-write all of this so that the code is unified in renderer
  window.loadStrings(fragShader, function(result) {
    this.fragSource = result.join('\n');
  }.bind(this));

  window.loadStrings(vertShader, function(result) {
    this.vertSource = result.join('\n');
  }.bind(this));
};

p5.Shader.prototype.getUniform = function() {
  renderer.prototype._getUniform.apply(this, arguments);
};

p5.Shader.prototype.setUniform = function() {
  renderer.prototype._setUniform.apply(this, arguments);
};

module.exports = p5.Shader;