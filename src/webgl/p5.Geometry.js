//some of the functions are adjusted from Three.js(http://threejs.org)

'use strict';

var p5 = require('../core/main');
/**
 * p5 Geometry class
 * @class p5.Geometry
 * @constructor
 * @param  {Integer} [detailX] number of vertices on horizontal surface
 * @param  {Integer} [detailY] number of vertices on horizontal surface
 * @param {function} [callback] function to call upon object instantiation.
 *
 */
p5.Geometry = function(detailX, detailY, callback) {
  //an array containing every vertex
  //@type [p5.Vector]
  this.vertices = [];

  //an array containing every vertex for stroke drawing
  this.lineVertices = [];

  //an array 1 normal per lineVertex with
  //final position representing which direction to
  //displace for strokeWeight
  //[[0,0,-1,1], [0,1,0,-1] ...];
  this.lineNormals = [];

  //an array containing 1 normal per vertex
  //@type [p5.Vector]
  //[p5.Vector, p5.Vector, p5.Vector,p5.Vector, p5.Vector, p5.Vector,...]
  this.vertexNormals = [];
  //an array containing each three vertex indices that form a face
  //[[0, 1, 2], [2, 1, 3], ...]
  this.faces = [];
  //a 2D array containing uvs for every vertex
  //[[0.0,0.0],[1.0,0.0], ...]
  this.uvs = [];
  // a 2D array containing edge connectivity pattern for create line vertices
  //based on faces for most objects;
  this.edges = [];
  this.detailX = detailX !== undefined ? detailX : 1;
  this.detailY = detailY !== undefined ? detailY : 1;
  if (callback instanceof Function) {
    callback.call(this);
  }
  return this; // TODO: is this a constructor?
};

/**
 * @method computeFaces
 * @chainable
 */
p5.Geometry.prototype.computeFaces = function() {
  this.faces.length = 0;
  var sliceCount = this.detailX + 1;
  var a, b, c, d;
  for (var i = 0; i < this.detailY; i++) {
    for (var j = 0; j < this.detailX; j++) {
      a = i * sliceCount + j; // + offset;
      b = i * sliceCount + j + 1; // + offset;
      c = (i + 1) * sliceCount + j + 1; // + offset;
      d = (i + 1) * sliceCount + j; // + offset;
      this.faces.push([a, b, d]);
      this.faces.push([d, b, c]);
    }
  }
  return this;
};

p5.Geometry.prototype._getFaceNormal = function(faceId) {
  //This assumes that vA->vB->vC is a counter-clockwise ordering
  var face = this.faces[faceId];
  var vA = this.vertices[face[0]];
  var vB = this.vertices[face[1]];
  var vC = this.vertices[face[2]];
  var ab = p5.Vector.sub(vB, vA);
  var ac = p5.Vector.sub(vC, vA);
  var n = p5.Vector.cross(ab, ac);
  var ln = p5.Vector.mag(n);
  var sinAlpha = ln / (p5.Vector.mag(ab) * p5.Vector.mag(ac));
  if (sinAlpha === 0 || isNaN(sinAlpha)) {
    console.warn(
      'p5.Geometry.prototype._getFaceNormal:',
      'face has colinear sides or a repeated vertex'
    );
    return n;
  }
  if (sinAlpha > 1) sinAlpha = 1; // handle float rounding error
  return n.mult(Math.asin(sinAlpha) / ln);
};
/**
 * computes smooth normals per vertex as an average of each
 * face.
 * @method computeNormals
 * @chainable
 */
p5.Geometry.prototype.computeNormals = function() {
  var vertexNormals = this.vertexNormals;
  var vertices = this.vertices;
  var faces = this.faces;
  var iv;

  // initialize the vertexNormals array with empty vectors
  vertexNormals.length = 0;
  for (iv = 0; iv < vertices.length; ++iv) {
    vertexNormals.push(new p5.Vector());
  }

  // loop through all the faces adding its normal to the normal
  // of each of its vertices
  for (var f = 0; f < faces.length; ++f) {
    var face = faces[f];
    var faceNormal = this._getFaceNormal(f);

    // all three vertices get the normal added
    for (var fv = 0; fv < 3; ++fv) {
      var vertexIndex = face[fv];
      vertexNormals[vertexIndex].add(faceNormal);
    }
  }

  // normalize the normals
  for (iv = 0; iv < vertices.length; ++iv) {
    vertexNormals[iv].normalize();
  }

  return this;
};

/**
 * Averages the vertex normals. Used in curved
 * surfaces
 * @method averageNormals
 * @chainable
 */
p5.Geometry.prototype.averageNormals = function() {
  for (var i = 0; i <= this.detailY; i++) {
    var offset = this.detailX + 1;
    var temp = p5.Vector.add(
      this.vertexNormals[i * offset],
      this.vertexNormals[i * offset + this.detailX]
    );

    temp = p5.Vector.div(temp, 2);
    this.vertexNormals[i * offset] = temp;
    this.vertexNormals[i * offset + this.detailX] = temp;
  }
  return this;
};

/**
 * Averages pole normals.  Used in spherical primitives
 * @method averagePoleNormals
 * @chainable
 */
p5.Geometry.prototype.averagePoleNormals = function() {
  //average the north pole
  var sum = new p5.Vector(0, 0, 0);
  for (var i = 0; i < this.detailX; i++) {
    sum.add(this.vertexNormals[i]);
  }
  sum = p5.Vector.div(sum, this.detailX);

  for (i = 0; i < this.detailX; i++) {
    this.vertexNormals[i] = sum;
  }

  //average the south pole
  sum = new p5.Vector(0, 0, 0);
  for (
    i = this.vertices.length - 1;
    i > this.vertices.length - 1 - this.detailX;
    i--
  ) {
    sum.add(this.vertexNormals[i]);
  }
  sum = p5.Vector.div(sum, this.detailX);

  for (
    i = this.vertices.length - 1;
    i > this.vertices.length - 1 - this.detailX;
    i--
  ) {
    this.vertexNormals[i] = sum;
  }
  return this;
};

/**
 * Create a 2D array for establishing stroke connections
 * @private
 * @chainable
 */
p5.Geometry.prototype._makeTriangleEdges = function() {
  this.edges.length = 0;
  if (Array.isArray(this.strokeIndices)) {
    for (var i = 0, max = this.strokeIndices.length; i < max; i++) {
      this.edges.push(this.strokeIndices[i]);
    }
  } else {
    for (var j = 0; j < this.faces.length; j++) {
      this.edges.push([this.faces[j][0], this.faces[j][1]]);
      this.edges.push([this.faces[j][1], this.faces[j][2]]);
      this.edges.push([this.faces[j][2], this.faces[j][0]]);
    }
  }
  return this;
};

/**
 * Create 4 vertices for each stroke line, two at the beginning position
 * and two at the end position. These vertices are displaced relative to
 * that line's normal on the GPU
 * @private
 * @chainable
 */
p5.Geometry.prototype._edgesToVertices = function() {
  this.lineVertices.length = 0;
  this.lineNormals.length = 0;

  for (var i = 0; i < this.edges.length; i++) {
    var begin = this.vertices[this.edges[i][0]];
    var end = this.vertices[this.edges[i][1]];
    var dir = end
      .copy()
      .sub(begin)
      .normalize();
    var a = begin.array();
    var b = begin.array();
    var c = end.array();
    var d = end.array();
    var dirAdd = dir.array();
    var dirSub = dir.array();
    // below is used to displace the pair of vertices at beginning and end
    // in opposite directions
    dirAdd.push(1);
    dirSub.push(-1);
    this.lineNormals.push(dirAdd, dirSub, dirAdd, dirAdd, dirSub, dirSub);
    this.lineVertices.push(a, b, c, c, b, d);
  }
  return this;
};

/**
 * Modifies all vertices to be centered within the range -100 to 100.
 * @method normalize
 * @chainable
 */
p5.Geometry.prototype.normalize = function() {
  if (this.vertices.length > 0) {
    // Find the corners of our bounding box
    var maxPosition = this.vertices[0].copy();
    var minPosition = this.vertices[0].copy();

    for (var i = 0; i < this.vertices.length; i++) {
      maxPosition.x = Math.max(maxPosition.x, this.vertices[i].x);
      minPosition.x = Math.min(minPosition.x, this.vertices[i].x);
      maxPosition.y = Math.max(maxPosition.y, this.vertices[i].y);
      minPosition.y = Math.min(minPosition.y, this.vertices[i].y);
      maxPosition.z = Math.max(maxPosition.z, this.vertices[i].z);
      minPosition.z = Math.min(minPosition.z, this.vertices[i].z);
    }

    var center = p5.Vector.lerp(maxPosition, minPosition, 0.5);
    var dist = p5.Vector.sub(maxPosition, minPosition);
    var longestDist = Math.max(Math.max(dist.x, dist.y), dist.z);
    var scale = 200 / longestDist;

    for (i = 0; i < this.vertices.length; i++) {
      this.vertices[i].sub(center);
      this.vertices[i].mult(scale);
    }
  }
  return this;
};

module.exports = p5.Geometry;
