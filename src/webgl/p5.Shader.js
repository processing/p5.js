'use strict';

var p5 = require('../core/core');

/**
 * p5 Shader class
 * @constructor
 * @param  {String} fragShader Location of a fragment shader file
 * @param  {String} vertShader Location of a vertex shader file
 *
 */
p5.Shader = function(fragShader, vertShader){
  var fragSource;
  var vertSource;

  this.shaderKey = fragShader + '|' + vertShader;
  this.uniforms = {};

  //TODO: Come up with a better system for loading external files
  //TODO: Make sure this works in instance mode
  //TODO: Actually, re-write all of this so that the code is unified in renderer
  window.loadStrings(fragShader, function(result) {
    fragSource = result.join('\n');

    window.loadStrings(vertShader, function(result) {
      vertSource = result.join('\n');

      var gl = window._renderer.GL;
      //set up our default shaders by:
      // 1. create the shader,
      // 2. load the shader source,
      // 3. compile the shader
      var _vertShader = gl.createShader(gl.VERTEX_SHADER);
      //load in our default vertex shader
      gl.shaderSource(_vertShader, vertSource);
      gl.compileShader(_vertShader);
      // if our vertex shader failed compilation?
      if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
        alert('Yikes! An error occurred compiling the shaders:' +
          gl.getShaderInfoLog(_vertShader));
        return null;
      }

      var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      //load in our material frag shader
      gl.shaderSource(_fragShader, fragSource);
      gl.compileShader(_fragShader);
      // if our frag shader failed compilation?
      if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
        alert('Darn! An error occurred compiling the shaders:' +
          gl.getShaderInfoLog(_fragShader));
        return null;
      }

      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, _vertShader);
      gl.attachShader(shaderProgram, _fragShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Snap! Error linking shader program');
      }

      window._renderer._getLocation(shaderProgram);

      //TODO: Ideally, we should only do one of these.
      this.shaderProgram = shaderProgram;
      window._renderer.mHash[this.shaderKey] = this.shaderProgram;
    }.bind(this));
  }.bind(this));
};

p5.Shader.prototype.getUniform = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.uniforms);
  window._renderer._getUniform.apply(window._renderer, args);
};

p5.Shader.prototype.setUniform = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.uniforms);
  window._renderer._setUniform.apply(window._renderer, args);
};

p5.Shader.prototype._useShader = function(){
  if(this.shaderProgram) {
    var gl = window._renderer.GL;
    gl.useProgram(this.shaderProgram);

    window._renderer.curShaderId = this.shaderKey;
    window._renderer.customShader = this;
  }
  return this;
};

module.exports = p5.Shader;