//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
'use strict';

var p5 = require('../core/core');
var hashCount = 0;
/**
 * _initBufferDefaults
 * @description initializes buffer defaults. runs each time a new geometry is
 * registered
 * @param  {String} gId  key of the geometry object
 */
p5.RendererGL.prototype._initBufferDefaults = function(gId) {
  //@TODO remove this limit on hashes in gHash
  hashCount ++;
  if(hashCount > 1000){
    var key = Object.keys(this.gHash)[0];
    delete this.gHash[key];
    hashCount --;
  }

  var gl = this.GL;
  //create a new entry in our gHash
  this.gHash[gId] = {};
  this.gHash[gId].vertexBuffer = {'buffer': gl.createBuffer()};
  this.gHash[gId].normalBuffer = {'buffer': gl.createBuffer()};
  this.gHash[gId].uvBuffer = {'buffer': gl.createBuffer()};
  this.gHash[gId].indexBuffer = {'buffer': gl.createBuffer()};
};
/**
 * createBuffers description
 * @param  {String} gId    key of the geometry object
 * @param  {p5.Geometry}  obj contains geometry data
 */
p5.RendererGL.prototype.createBuffers = function(gId, obj) {
  var gl = this.GL;
  this._setDefaultCamera();
  //initialize the gl buffers for our geom groups
  this._initBufferDefaults(gId);

  //@todo rename "numberOfItems" property to something more descriptive
  //we mult the num geom faces by 3
  this.gHash[gId].numberOfItems = obj.faces.length * 3;

  this.gHash[gId].vertexBuffer.size = 3;
  this.gHash[gId].vertexBuffer.type = gl.FLOAT;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( vToNArray(obj.vertices) ),
    gl.STATIC_DRAW);

  this.gHash[gId].normalBuffer.size = 3;
  this.gHash[gId].normalBuffer.type = gl.FLOAT;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( vToNArray(obj.vertexNormals) ),
    gl.STATIC_DRAW);

  this.gHash[gId].uvBuffer.size = 2;
  this.gHash[gId].uvBuffer.type = gl.FLOAT;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( flatten(obj.uvs) ),
    gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer.buffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array( flatten(obj.faces) ),
    gl.STATIC_DRAW);
};

/**
 * Draws buffers given a geometry key ID
 * @param  {String} gId     ID in our geom hash
 * @return {p5.RendererGL} this
 */
p5.RendererGL.prototype.drawBuffers = function(gId) {
  this._setDefaultCamera();
  var gl = this.GL;
  var shaderKey = this._getCurShaderId();
  var shaderProgram = this.mHash[shaderKey];
  if(this.customShader) {
    if(this.customShader.shaderKey in this.mHash) {
      shaderKey = this.customShader.shaderKey;
      shaderProgram = this.mHash[shaderKey];
    } else if(this.customShader.vertSource === undefined ||
              this.customShader.fragSource === undefined) {
      // The shader isn't loaded, so don't render anything this pass
      return;
    } else {
      shaderProgram = this._compileShaders(this.customShader.vertSource,
                                           this.customShader.fragSource);
      shaderKey = this.customShader.shaderKey;
      this.mHash[shaderKey] = shaderProgram;
    }
  }
  gl.useProgram(shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer.buffer);
  shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer.buffer);
  shaderProgram.vertexNormalAttribute =
      gl.getAttribLocation(shaderProgram, 'aNormal');
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
                         3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer.buffer);
  shaderProgram.textureCoordAttribute =
      gl.getAttribLocation(shaderProgram, 'aTexCoord');
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,
                         2, gl.FLOAT, false, 0, 0);

  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer.buffer);

  //TODO: This re-binds the textures each render call, which could be more
  //efficient
  this.texCount = 0;
  this._applyUniforms(shaderKey, undefined);
  if(this.customShader) {
    this._applyUniforms(shaderKey, this.customShader._uniforms);
  }
  gl.drawElements(
    gl.TRIANGLES, this.gHash[gId].numberOfItems,
    gl.UNSIGNED_SHORT, 0);
  return this;
};
///////////////////////////////
//// UTILITY FUNCTIONS
//////////////////////////////
/**
 * turn a two dimensional array into one dimensional array
 * @param  {Array} arr 2-dimensional array
 * @return {Array}     1-dimensional array
 * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
 */
function flatten(arr){
  if (arr.length>0){
    return arr.reduce(function(a, b){
      return a.concat(b);
    });
  } else {
    return [];
  }
}

/**
 * turn a p5.Vector Array into a one dimensional number array
 * @param  {Array} arr  an array of p5.Vector
 * @return {Array]}     a one dimensional array of numbers
 * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
 * [1, 2, 3, 4, 5, 6]
 */
function vToNArray(arr){
  return flatten(arr.map(function(item){
    return [item.x, item.y, item.z];
  }));
}
module.exports = p5.RendererGL;
