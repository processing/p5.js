//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
'use strict';

var p5 = require('../core/core');
require('./p5.RendererGL');

// a render buffer definition
function BufferDef(size, src, dst, attr, map) {
  this.size = size; // the number of FLOATs in each vertex
  this.src = src; // the name of the model's source array
  this.dst = dst; // the name of the geometry's buffer
  this.attr = attr; // the name of the vertex attribute
  this.map = map; // optional, a transformation function to apply to src
}

var _flatten = p5.RendererGL._flatten;
var _vToNArray = p5.RendererGL._vToNArray;

var strokeBuffers = [
  new BufferDef(3, 'lineVertices', 'lineVertexBuffer', 'aPosition', _flatten),
  new BufferDef(4, 'lineNormals', 'lineNormalBuffer', 'aDirection', _flatten)
];

var fillBuffers = [
  new BufferDef(3, 'vertices', 'vertexBuffer', 'aPosition', _vToNArray),
  new BufferDef(3, 'vertexNormals', 'normalBuffer', 'aNormal', _vToNArray),
  new BufferDef(4, 'vertexColors', 'colorBuffer', 'aMaterialColor'),
  new BufferDef(3, 'vertexAmbients', 'ambientBuffer', 'aAmbientColor'),
  new BufferDef(3, 'vertexSpeculars', 'specularBuffer', 'aSpecularColor'),
  new BufferDef(3, 'vertexEmissives', 'emissiveBuffer', 'aEmissiveColor'),
  new BufferDef(1, 'vertexShininesses', 'shininessBuffer', 'aSpecularPower'),
  new BufferDef(2, 'uvs', 'uvBuffer', 'aTexCoord', _flatten)
];

var hashCount = 0;
/**
 * _initBufferDefaults
 * @private
 * @description initializes buffer defaults. runs each time a new geometry is
 * registered
 * @param  {String} gId  key of the geometry object
 */
p5.RendererGL.prototype._initBufferDefaults = function(gId) {
  if (this.gHash.hasOwnProperty(gId)) return;

  this._freeBuffers(gId);

  //@TODO remove this limit on hashes in gHash
  hashCount++;
  if (hashCount > 1000) {
    var key = Object.keys(this.gHash)[0];
    delete this.gHash[key];
    hashCount--;
  }

  //create a new entry in our gHash
  this.gHash[gId] = {};
};

p5.RendererGL.prototype._freeBuffers = function(gId) {
  var geometry = this.gHash[gId];
  if (!geometry) {
    return;
  }

  delete this.gHash[gId];
  hashCount--;

  var gl = this.GL;
  geometry.indexBuffer && gl.deleteBuffer(geometry.indexBuffer);

  function freeBuffers(bds) {
    for (var i = 0; i < bds.length; i++) {
      var bd = bds[i];
      if (geometry[bd.dst]) {
        gl.deleteBuffer(geometry[bd.dst]);
        geometry[bd.dst] = null;
      }
    }
  }

  // free all the buffers
  freeBuffers(strokeBuffers);
  freeBuffers(fillBuffers);
};

/**
 * createBuffers description
 * @private
 * @param  {String} gId    key of the geometry object
 * @param  {p5.Geometry}  model contains geometry data
 */
p5.RendererGL.prototype.createBuffers = function(gId, model) {
  var gl = this.GL;
  this._setDefaultCamera();
  //initialize the gl buffers for our geom groups
  this._initBufferDefaults(gId);

  var geometry = this.gHash[gId];
  geometry.model = model;

  if (model.faces.length) {
    // allocate space for faces
    geometry.indexBuffer = this._createBuffer(
      geometry.indexBuffer,
      p5.RendererGL._flatten(model.faces),
      gl.ELEMENT_ARRAY_BUFFER,
      Uint16Array
    );

    // the vertex count is based on the number of faces
    geometry.vertexCount = model.faces.length * 3;
  } else {
    // the index buffer is unused, remove it
    if (geometry.indexBuffer) {
      gl.deleteBuffer(geometry.indexBuffer);
      geometry.indexBuffer = null;
    }
    // the vertex count comes directly from the model
    geometry.vertexCount = model.vertices && model.vertices.length;
  }

  geometry.lineVertexCount = model.lineVertices && model.lineVertices.length;
};

/**
 * Draws buffers given a geometry key ID
 * @private
 * @param  {String} gId     ID in our geom hash
 * @chainable
 */
p5.RendererGL.prototype.drawBuffers = function(gId, drawMode) {
  this._setDefaultCamera();

  var geometry = this.gHash[gId];

  // select the stroke shader to use
  var stroke = this.curStrokeShader;
  if (!stroke || !stroke.isStrokeShader()) {
    stroke = this._getLineShader();
  }
  // render the stroke
  this._renderStroke(geometry, stroke);

  // select the fill shader to use
  var fill = this.curFillShader;
  if (this._enableNormal) {
    fill = this._getNormalShader();
  } else if (this._enableLighting) {
    if (!fill || !fill.isLightShader()) {
      fill = this._getLightShader();
    }
  } else if (this._tex) {
    if (!fill || !fill.isTextureShader()) {
      fill = this._getTextureShader();
    }
  } else {
    if (!fill /* || !fill.isColorShader()*/) {
      fill = this._getColorShader();
    }
  }

  // render the fill
  this._renderFill(geometry, fill, drawMode);
};

/**
 * Calls drawBuffers() with a scaled model/view matrix.
 *
 * This is used by various 3d primitive methods (in primitives.js, eg. plane,
 * box, torus, etc...) to allow caching of un-scaled geometries. Those
 * geometries are generally created with unit-length dimensions, cached as
 * such, and then scaled appropriately in this method prior to rendering.
 *
 * @private
 * @method drawBuffersScaled
 * @param {String} gId     ID in our geom hash
 * @param {Number} scaleX  the amount to scale in the X direction
 * @param {Number} scaleY  the amount to scale in the Y direction
 * @param {Number} scaleZ  the amount to scale in the Z direction
 */
p5.RendererGL.prototype.drawBuffersScaled = function(
  gId,
  scaleX,
  scaleY,
  scaleZ
) {
  var uMVMatrix = this.uMVMatrix.copy();
  try {
    this.uMVMatrix.scale(scaleX, scaleY, scaleZ);
    this.drawBuffers(gId);
  } finally {
    this.uMVMatrix = uMVMatrix;
  }
};

p5.RendererGL.prototype._prepareBuffers = function(geometry, shader, bds) {
  var model = geometry.model;
  var attributes = shader.attributes;
  var gl = this.GL;

  // loop through each of the buffer definitions
  for (var i = 0; i < bds.length; i++) {
    var bd = bds[i];

    var attr = attributes[bd.attr];
    if (!attr) continue;

    var buffer = geometry[bd.dst];

    // check if the model has the appropriate source array
    var src = model[bd.src];
    if (src) {
      // check if we need to create the GL buffer
      var createBuffer = !buffer;
      if (createBuffer) {
        // create and remember the buffer
        geometry[bd.dst] = buffer = gl.createBuffer();
      }
      // bind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // check if we need to fill the buffer with data
      if (createBuffer || model.dirtyFlags[bd.src] !== false) {
        var map = bd.map;
        // get the values from the model, possibly transformed
        var values = map ? map(src) : src;

        // fill the buffer with the values
        this._bindBuffer(buffer, gl.ARRAY_BUFFER, values);

        // mark the model's source array as clean
        model.dirtyFlags[bd.src] = false;
      }
      // enable the attribute
      shader.enableAttrib(attr, bd.size);
    } else {
      if (buffer) {
        // remove the unused buffer
        gl.deleteBuffer(buffer);
        geometry[bd.dst] = null;
      }
      // disable the vertex
      gl.disableVertexAttribArray(attr.index);
    }
  }
};

p5.RendererGL.prototype._renderStroke = function(geometry, stroke) {
  // check if the stroke is enabled
  if (!this._doStroke || geometry.lineVertexCount < 2 || this._enableNormal) {
    return;
  }

  var gl = this.GL;

  stroke.bindShader();

  // set the uniform values
  stroke.setUniform('uStrokeColor', this._strokeColor);
  stroke.setUniform('uStrokeWeight', this._strokeWeight);

  // prepare the render buffers
  this._prepareBuffers(geometry, stroke, strokeBuffers);

  // render the stroke
  this._applyColorBlend(this._strokeColor);
  gl.drawArrays(gl.TRIANGLES, 0, geometry.lineVertexCount);

  stroke.unbindShader();
};

p5.RendererGL.prototype._renderFill = function(geometry, fill, drawMode) {
  // check if the fill is enabled
  if (!this._doFill || geometry.vertexCount < 3) {
    return;
  }

  var gl = this.GL;

  fill.bindShader();

  // TODO: optimize
  fill.setUniform('uAmbientColor', this._ambientColor);
  fill.setUniform('uMaterialColor', this._diffuseColor);
  fill.setUniform('uSpecularColor', this._specularColor);
  fill.setUniform('uSpecularPower', this._specularPower);
  fill.setUniform('isTexture', !!this._tex);
  if (this._tex) {
    fill.setUniform('uSampler', this._tex);
  }

  var pointLightCount = this.pointLightColors.length / 3;
  fill.setUniform('uPointLightCount', pointLightCount);
  fill.setUniform('uPointLightLocation', this.pointLightPositions);
  fill.setUniform('uPointLightColor', this.pointLightColors);
  fill.setUniform('uPointLightSpecularColor', this.pointLightSpecularColors);

  var directionalLightCount = this.directionalLightColors.length / 3;
  fill.setUniform('uDirectionalLightCount', directionalLightCount);
  fill.setUniform(
    'uDirectionalLightDirection',
    this.directionalLightDirections
  );
  fill.setUniform('uDirectionalLightColor', this.directionalLightColors);
  fill.setUniform(
    'uDirectionalLightSpecularColor',
    this.directionalLightSpecularColors
  );

  // TODO: sum these here...
  var ambientLightCount = this.ambientLightColors.length / 3;
  fill.setUniform('uAmbientLightCount', ambientLightCount);
  fill.setUniform('uAmbientLightColor', this.ambientLightColors);

  fill.setUniform('uConstantFalloff', this._constantFalloff);
  fill.setUniform('uLinearFalloff', this._linearFalloff);
  fill.setUniform('uQuadraticFalloff', this._quadraticFalloff);

  // bind the index buffer, if we have one
  if (geometry.indexBuffer) {
    this._bindBuffer(geometry.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
  }

  // prepare the other render buffers
  this._prepareBuffers(geometry, fill, fillBuffers);

  this._applyColorBlend(this._diffuseColor);

  // render the fill
  if (geometry.indexBuffer) {
    // we're drawing faces
    gl.drawElements(
      gl.TRIANGLES,
      geometry.vertexCount,
      this.GL.UNSIGNED_SHORT,
      0
    );
  } else {
    // drawing vertices
    gl.drawArrays(drawMode || gl.TRIANGLES, 0, geometry.vertexCount);
  }

  fill.unbindShader();
};

module.exports = p5.RendererGL;
