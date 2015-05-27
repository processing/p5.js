// Inspired by lightgl.js by evanw
// https://github.com/evanw/lightgl.js/

/**
 * @module ? 
 * @submodule ? 
 * @requires ? 
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  require('Graphics3D');

  var tempMatrix = new Matrix();
  var resultMatrix = new Matrix();
  
  p5.Shader = function () {
    this.vertexSource = arguments[0];
    this.fragmentSource = arguments[1];
    gl = this.canvas.getContext('webgl');
    
    var header = '\
      uniform mat3 gl_NormalMatrix;\
      uniform mat4 gl_ModelViewMatrix;\
      uniform mat4 gl_ProjectionMatrix;\
      uniform mat4 gl_ModelViewProjectionMatrix;\
      uniform mat4 gl_ModelViewMatrixInverse;\
      uniform mat4 gl_ProjectionMatrixInverse;\
      uniform mat4 gl_ModelViewProjectionMatrixInverse;\
    ';
    var vertexHeader = header + '\
      attribute vec4 gl_Vertex;\
      attribute vec4 gl_TexCoord;\
      attribute vec3 gl_Normal;\
      attribute vec4 gl_Color;\
      vec4 ftransform() {\
        return gl_ModelViewProjectionMatrix * gl_Vertex;\
      }\
    ';
    var fragmentHeader = '\
      precision highp float;\
    ' + header;

    // Check for the use of built-in matrices that require expensive matrix
    // multiplications to compute, and record these in `usedMatrices`.
    var source = vertexSource + fragmentSource;
    var usedMatrices = {};
    regexMap(/\b(gl_[^;]*)\b;/g, header, function(groups) {
      var name = groups[1];
      if (source.indexOf(name) != -1) {
        var capitalLetters = name.replace(/[a-z_]/g, '');
        usedMatrices[capitalLetters] = LIGHTGL_PREFIX + name;
      }
    });
    if (source.indexOf('ftransform') != -1) usedMatrices.MVPM = LIGHTGL_PREFIX + 'gl_ModelViewProjectionMatrix';
    this.usedMatrices = usedMatrices;

    // The `gl_` prefix must be substituted for something else to avoid compile
    // errors, since it's a reserved prefix. This prefixes all reserved names with
    // `_`. The header is inserted after any extensions, since those must come
    // first.
    function fix(header, source) {
      var replaced = {};
      var match = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(source);
      source = match ? match[1] + header + source.substr(match[1].length) : header + source;
      regexMap(/\bgl_\w+\b/g, header, function(result) {
        if (!(result in replaced)) {
          source = source.replace(new RegExp('\\b' + result + '\\b', 'g'), LIGHTGL_PREFIX + result);
          replaced[result] = true;
        }
      });
      return source;
    }
    vertexSource = fix(vertexHeader, vertexSource);
    fragmentSource = fix(fragmentHeader, fragmentSource);

    function compileSource(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    this.program = gl.createProgram();
    gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error('link error: ' + gl.getProgramInfoLog(this.program));
    }
    this.attributes = {};
    this.uniformLocations = {};

    // Sampler uniforms need to be uploaded using `gl.uniform1i()` instead of `gl.uniform1f()`.
    // To do this automatically, we detect and remember all uniform samplers in the source code.
    var isSampler = {};
    regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, vertexSource + fragmentSource, function(groups) {
      isSampler[groups[2]] = 1;
    });
    this.isSampler = isSampler;
  };

  p5.Shader.prototype._isArray = function(obj) {
    var str = Object.prototype.toString.call(obj);
    return str == '[object Array]' || str == '[object Float32Array]';
  };

  p5.Shader.prototype._isNumber = function(obj) {
    var str = Object.prototype.toString.call(obj);
    return str == '[object Number]' || str == '[object Boolean]';
  };

  p5.Shader.prototype.setUniforms = function(uniforms) {

  };

}
