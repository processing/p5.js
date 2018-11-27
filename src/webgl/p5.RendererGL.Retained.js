//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
'use strict';

var p5 = require('../core/main');

var hashCount = 0;
/**
 * _initBufferDefaults
 * @private
 * @description initializes buffer defaults. runs each time a new geometry is
 * registered
 * @param  {String} gId  key of the geometry object
 */
p5.RendererGL.prototype._initBufferDefaults = function(gId) {
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
  geometry.vertexBuffer && gl.deleteBuffer(geometry.vertexBuffer);
  geometry.normalBuffer && gl.deleteBuffer(geometry.normalBuffer);
  geometry.lineNormalBuffer && gl.deleteBuffer(geometry.lineNormalBuffer);
  geometry.uvBuffer && gl.deleteBuffer(geometry.uvBuffer);
  geometry.indexBuffer && gl.deleteBuffer(geometry.indexBuffer);
  geometry.lineVertexBuffer && gl.deleteBuffer(geometry.lineVertexBuffer);
};
/**
 * createBuffers description
 * @private
 * @param  {String} gId    key of the geometry object
 * @param  {p5.Geometry}  obj contains geometry data
 */
p5.RendererGL.prototype.createBuffers = function(gId, obj) {
  var gl = this.GL;
  //initialize the gl buffers for our geom groups
  this._initBufferDefaults(gId);

  var geometry = this.gHash[gId];

  geometry.numberOfItems = obj.faces.length * 3;
  geometry.lineVertexCount = obj.lineVertices.length;

  this._useColorShader();

  // initialize the stroke shader's 'aPosition' buffer, if used
  if (this.curStrokeShader.attributes.aPosition) {
    geometry.lineVertexBuffer = gl.createBuffer();

    this._bindBuffer(
      geometry.lineVertexBuffer,
      gl.ARRAY_BUFFER,
      this._flatten(obj.lineVertices),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curStrokeShader.enableAttrib(
      this.curStrokeShader.attributes.aPosition.location,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the stroke shader's 'aDirection' buffer, if used
  if (this.curStrokeShader.attributes.aDirection) {
    geometry.lineNormalBuffer = gl.createBuffer();

    this._bindBuffer(
      geometry.lineNormalBuffer,
      gl.ARRAY_BUFFER,
      this._flatten(obj.lineNormals),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curStrokeShader.enableAttrib(
      this.curStrokeShader.attributes.aDirection.location,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the fill shader's 'aPosition' buffer, if used
  if (this.curFillShader.attributes.aPosition) {
    geometry.vertexBuffer = gl.createBuffer();

    // allocate space for vertex positions
    this._bindBuffer(
      geometry.vertexBuffer,
      gl.ARRAY_BUFFER,
      this._vToNArray(obj.vertices),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aPosition.location,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // allocate space for faces
  geometry.indexBuffer = gl.createBuffer();
  this._bindBuffer(
    geometry.indexBuffer,
    gl.ELEMENT_ARRAY_BUFFER,
    this._flatten(obj.faces),
    Uint16Array,
    gl.STATIC_DRAW
  );

  // initialize the fill shader's 'aNormal' buffer, if used
  if (this.curFillShader.attributes.aNormal) {
    geometry.normalBuffer = gl.createBuffer();

    // allocate space for normals
    this._bindBuffer(
      geometry.normalBuffer,
      gl.ARRAY_BUFFER,
      this._vToNArray(obj.vertexNormals),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aNormal.location,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the fill shader's 'aTexCoord' buffer, if used
  if (this.curFillShader.attributes.aTexCoord) {
    geometry.uvBuffer = gl.createBuffer();

    // tex coords
    this._bindBuffer(
      geometry.uvBuffer,
      gl.ARRAY_BUFFER,
      this._flatten(obj.uvs),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aTexCoord.location,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
  }
  //}
  return geometry;
};

/**
 * Draws buffers given a geometry key ID
 * @private
 * @param  {String} gId     ID in our geom hash
 * @chainable
 */
p5.RendererGL.prototype.drawBuffers = function(gId) {
  var gl = this.GL;
  this._useColorShader();
  var geometry = this.gHash[gId];

  if (this._doStroke && geometry.lineVertexCount > 0) {
    this.curStrokeShader.bindShader();

    // bind the stroke shader's 'aPosition' buffer
    if (geometry.lineVertexBuffer) {
      this._bindBuffer(geometry.lineVertexBuffer, gl.ARRAY_BUFFER);
      this.curStrokeShader.enableAttrib(
        this.curStrokeShader.attributes.aPosition.location,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    // bind the stroke shader's 'aDirection' buffer
    if (geometry.lineNormalBuffer) {
      this._bindBuffer(geometry.lineNormalBuffer, gl.ARRAY_BUFFER);
      this.curStrokeShader.enableAttrib(
        this.curStrokeShader.attributes.aDirection.location,
        4,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    this._applyColorBlend(this.curStrokeColor);
    this._drawArrays(gl.TRIANGLES, gId);
    this.curStrokeShader.unbindShader();
  }

  if (this._doFill !== false) {
    this.curFillShader.bindShader();

    // bind the fill shader's 'aPosition' buffer
    if (geometry.vertexBuffer) {
      //vertex position buffer
      this._bindBuffer(geometry.vertexBuffer, gl.ARRAY_BUFFER);
      this.curFillShader.enableAttrib(
        this.curFillShader.attributes.aPosition.location,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    if (geometry.indexBuffer) {
      //vertex index buffer
      this._bindBuffer(geometry.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
    }

    // bind the fill shader's 'aNormal' buffer
    if (geometry.normalBuffer) {
      this._bindBuffer(geometry.normalBuffer, gl.ARRAY_BUFFER);
      this.curFillShader.enableAttrib(
        this.curFillShader.attributes.aNormal.location,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    // bind the fill shader's 'aTexCoord' buffer
    if (geometry.uvBuffer) {
      // uv buffer
      this._bindBuffer(geometry.uvBuffer, gl.ARRAY_BUFFER);
      this.curFillShader.enableAttrib(
        this.curFillShader.attributes.aTexCoord.location,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    this._applyColorBlend(this.curFillColor);
    this._drawElements(gl.TRIANGLES, gId);
    this.curFillShader.unbindShader();
  }
  return this;
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

p5.RendererGL.prototype._drawArrays = function(drawMode, gId) {
  this.GL.drawArrays(drawMode, 0, this.gHash[gId].lineVertexCount);
  this._pInst._pixelsDirty = true;
  return this;
};

p5.RendererGL.prototype._drawElements = function(drawMode, gId) {
  this.GL.drawElements(
    drawMode,
    this.gHash[gId].numberOfItems,
    this.GL.UNSIGNED_SHORT,
    0
  );
  this._pInst._pixelsDirty = true;
};

p5.RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
  var gl = this.GL;

  this._bindBuffer(
    vertexBuffer,
    gl.ARRAY_BUFFER,
    this._vToNArray(vertices),
    Float32Array,
    gl.STATIC_DRAW
  );

  this.curPointShader.enableAttrib(
    this.curPointShader.attributes.aPosition.location,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.drawArrays(gl.Points, 0, vertices.length);
};

module.exports = p5.RendererGL;
