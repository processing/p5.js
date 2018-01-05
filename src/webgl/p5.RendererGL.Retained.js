//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
'use strict';

var p5 = require('../core/core');

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
  this._setDefaultCamera();
  //initialize the gl buffers for our geom groups
  this._initBufferDefaults(gId);

  var geometry = this.gHash[gId];

  geometry.numberOfItems = obj.faces.length * 3;
  geometry.lineVertexCount = obj.lineVertices.length;

  this._useColorShader();

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
};

/**
 * Draws buffers given a geometry key ID
 * @private
 * @param  {String} gId     ID in our geom hash
 * @chainable
 */
p5.RendererGL.prototype.drawBuffers = function(gId) {
  this._setDefaultCamera();
  var gl = this.GL;
  this._useColorShader();
  var geometry = this.gHash[gId];
  if (this.curStrokeShader.active !== false && geometry.lineVertexCount > 0) {
    this.curStrokeShader.bindShader();
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
    this._drawArrays(gl.TRIANGLES, gId);
    this.curStrokeShader.unbindShader();
  }
  if (this.curFillShader.active !== false) {
    this.curFillShader.bindShader();

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

    this._drawElements(gl.TRIANGLES, gId);
    this.curFillShader.unbindShader();
  }
  return this;
};

p5.RendererGL.prototype.drawBuffersScaled = function(
  gId,
  scaleX,
  scaleY,
  scaleZ
) {
  var uMVMatrix = this.uMVMatrix.copy();
  this.uMVMatrix.scale(scaleX, scaleY, scaleZ);
  try {
    this.drawBuffers(gId);
  } finally {
    this.uMVMatrix = uMVMatrix;
  }
};

p5.RendererGL.prototype._drawArrays = function(drawMode, gId) {
  this.GL.drawArrays(drawMode, 0, this.gHash[gId].lineVertexCount);
  return this;
};

p5.RendererGL.prototype._drawElements = function(drawMode, gId) {
  this.GL.drawElements(
    drawMode,
    this.gHash[gId].numberOfItems,
    this.GL.UNSIGNED_SHORT,
    0
  );
};

module.exports = p5.RendererGL;
