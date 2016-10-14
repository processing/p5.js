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
  this.gHash[gId] = {'attributes': {}};
  this.gHash[gId].attributes.vertex = {'buffer': gl.createBuffer()};
  this.gHash[gId].attributes.normal = {'buffer': gl.createBuffer()};
  this.gHash[gId].attributes.uv = {'buffer': gl.createBuffer()};
  this.gHash[gId].attributes.index = {'buffer': gl.createBuffer()};
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

  this.gHash[gId].attributes.vertex.size = 3;
  this.gHash[gId].attributes.vertex.type = gl.FLOAT;
  this.gHash[gId].attributes.vertex.name = 'aPosition';
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].attributes.vertex.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( vToNArray(obj.vertices) ),
    gl.STATIC_DRAW);

  this.gHash[gId].attributes.normal.size = 3;
  this.gHash[gId].attributes.normal.type = gl.FLOAT;
  this.gHash[gId].attributes.normal.name = 'aNormal';
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].attributes.normal.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( vToNArray(obj.vertexNormals) ),
    gl.STATIC_DRAW);

  this.gHash[gId].attributes.uv.size = 2;
  this.gHash[gId].attributes.uv.type = gl.FLOAT;
  this.gHash[gId].attributes.uv.name = 'aTexCoord';
  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].attributes.uv.buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( flatten(obj.uvs) ),
    gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,
                this.gHash[gId].attributes.index.buffer);
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
  var shaderProgram, shaderKey;
  if(this.currentShader.vertSource === undefined ||
     this.currentShader.fragSource === undefined) {
    // The shader isn't loaded, so don't render anything this pass
    return;
  } else {
    shaderProgram = this._compileShader(this.currentShader);
    shaderKey = this.curShaderId;
  }
  gl.useProgram(shaderProgram);

  for(var attribName in this.gHash[gId].attributes) {
    if(attribName !== 'index') {
      var attribute = this.gHash[gId].attributes[attribName];
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
      var attribLocation = gl.getAttribLocation(shaderProgram, attribute.name);
      if(attribLocation !== -1) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation,
                               attribute.size, attribute.type, false, 0, 0);
      }
    }
  }

  //TODO: This re-binds the textures each render call, which could be more
  //efficient
  this.texCount = 0;
  this._applyUniforms();
  this._applyUniforms(this.currentShader._uniforms);

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
