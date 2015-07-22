'use strict';

var p5 = require('../core/core');

/**
 * p5 Geometry3D class
 */
p5.Geometry3D = function(){
  //an array holding every vertice
  //each vertex is a p5.Vector
  this.vertices = [];
  //an array holding each normals for each vertice
  //each normal is a p5.Vector
  this.vertexNormals = [];
  //an array holding each three indecies of vertices that form a face
  //[[0, 1, 2], [1, 2, 3], ...]
  this.faces = [];
  //an array holding every noraml for each face
  //each faceNormal is a p5.Vector
  //[[p5.Vector, p5.Vector, p5.Vector],[p5.Vector, p5.Vector, p5.Vector],...]
  this.faceNormals = [];
  //an array of p5.Vector holding uvs
  this.uvs = [];
};

/**
 * generate geometriy with parametric method
 * @param  {Function} func  callback function for how to generate geometry
 * @param  {Number} detailX number of vertices on horizontal surface
 * @param  {Number} detailY number of vertices on horizontal surface
 * @param  {Number} offset  offset of vertices index
 */
p5.Geometry3D.prototype.parametricGeometry = function
(func, detailX, detailY, offset){

  var i, j, p;
  var u, v;
  offset = offset || 0;

  var sliceCount = detailX + 1;
  for (i = 0; i <= detailY; i++){
    v = i / detailY;
    for (j = 0; j <= detailX; j++){
      u = j / detailX;
      p = func(u, v);
      this.vertices.push(p);
    }
  }

  var a, b, c, d;
  var uva, uvb, uvc, uvd;

  for (i = 0; i < detailY; i++){
    for (j = 0; j < detailX; j++){
      a = i * sliceCount + j + offset;
      b = i * sliceCount + j + 1 + offset;
      c = (i + 1)* sliceCount + j + 1 + offset;
      d = (i + 1)* sliceCount + j + offset;

      uva = [j/detailX, i/detailY];
      uvb = [(j + 1)/ detailX, i/detailY];
      uvc = [(j + 1)/ detailX, (i + 1)/detailY];
      uvd = [j/detailX, (i + 1)/detailY];

      this.faces.push([a, b, d]);
      this.uvs.push([uva, uvb, uvd]);

      this.faces.push([b, c, d]);
      this.uvs.push([uvb, uvc, uvd]);
    }
  }

};

/**
 * merge duplicated vertices
 */
p5.Geometry3D.prototype.mergeVertices= function () {

  var verticesMap = {};
  var unique = [], changes = [];

  var v, key;
  var precisionPoints = 4;
  var precision = Math.pow(10, precisionPoints);
  var i, face;
  var indices;

  for (i = 0; i < this.vertices.length; i ++) {

    v = this.vertices[i];
    key = Math.round(v.x * precision) + '_' +
    Math.round(v.y * precision) + '_' +
    Math.round(v.z * precision);

    if (verticesMap[key] === undefined) {
      verticesMap[key] = i;
      unique.push(this.vertices[i]);
      changes[i] = unique.length - 1;
    } else {
      changes[i] = changes[verticesMap[key]];
    }

  }
  // if faces are completely degenerate after merging vertices, we
  // have to remove them from the geometry.
  var faceIndicesToRemove = [];

  for (i = 0; i < this.faces.length; i ++) {

    face = this.faces[i];

    face[0] = changes[face[0]];
    face[1] = changes[face[1]];
    face[2] = changes[face[2]];

    indices = [face[0], face[1], face[2]];

    var dupIndex = - 1;

    // if any duplicate vertices are found in a Face
    // we have to remove the face as nothing can be saved
    for (var n = 0; n < 3; n ++) {
      if (indices[n] === indices[(n + 1) % 3]) {
        dupIndex = n;
        faceIndicesToRemove.push(i);
        break;
      }
    }
  }

  for (i = faceIndicesToRemove.length - 1; i >= 0; i --) {
    var idx = faceIndicesToRemove[i];
    this.faces.splice(idx, 1);
  }

  // Use unique set of vertices
  var diff = this.vertices.length - unique.length;
  this.vertices = unique;
  return diff;

};

/**
 * compute faceNormals for a geometry
 */
p5.Geometry3D.prototype.computeFaceNormals = function(){

  var cb = new p5.Vector();
  var ab = new p5.Vector();

  for (var f = 0; f < this.faces.length; f++){
    var face = this.faces[f];
    var vA = this.vertices[face[0]];
    var vB = this.vertices[face[1]];
    var vC = this.vertices[face[2]];

    p5.Vector.sub(vC, vB, cb);
    p5.Vector.sub(vA, vB, ab);

    var normal = p5.Vector.cross(ab, cb);
    normal.normalize();
    normal.mult(-1);
    this.faceNormals[f] = normal;
  }

};

/**
 * compute vertexNormals for a geometry
 */
p5.Geometry3D.prototype.computeVertexNormals = function (){

  var v, f, face, faceNormal, vertices;
  var vertexNormals = [];

  vertices = new Array(this.vertices.length);
  for (v = 0; v < this.vertices.length; v++) {
    vertices[v] = new p5.Vector();
  }

  for (f = 0; f < this.faces.length; f++) {
    face = this.faces[f];
    faceNormal = this.faceNormals[f];

    vertices[face[0]].add(faceNormal);
    vertices[face[1]].add(faceNormal);
    vertices[face[2]].add(faceNormal);
  }

  for (v = 0; v < this.vertices.length; v++) {
    vertices[v].normalize();
  }

  for (f = 0; f < this.faces.length; f++) {
    face = this.faces[f];
    vertexNormals[f] = [];
    vertexNormals[f][0]= vertices[face[0]].copy();
    vertexNormals[f][1]= vertices[face[1]].copy();
    vertexNormals[f][2]= vertices[face[2]].copy();
  }

  for (f = 0; f < this.faces.length; f++){
    face = this.faces[f];
    faceNormal = this.faceNormals[f];
    this.vertexNormals[face[0]] = vertexNormals[f][0];
    this.vertexNormals[face[1]] = vertexNormals[f][1];
    this.vertexNormals[face[2]] = vertexNormals[f][2];
  }

};

/**
 * generate an object containing information needed to create buffer
 */
p5.Geometry3D.prototype.generateObj = function(noMerge){
  if(!noMerge){
    this.mergeVertices();
  }
  this.computeFaceNormals();
  this.computeVertexNormals();

  var obj = {
    vertices: turnVectorArrayIntoNumberArray(this.vertices),
    vertexNormals: turnVectorArrayIntoNumberArray(this.vertexNormals),
    faces: flatten(this.faces),
    len: this.faces.length * 3
  };
  return obj;
};

/**
 * turn a two dimensional array into one dimensional array
 * @param  {Array} arr 2-dimensional array
 * @return {Array}     1-dimensional array
 * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
 */
function flatten(arr){
  return arr.reduce(function(a, b){
    return a.concat(b);
  });
}

/**
 * turn an array of Vector into a one dimensional array of numbers
 * @param  {Array} arr  an array of p5.Vector
 * @return {Array]}     a one dimensional array of numbers
 * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
 * [1, 2, 3, 4, 5, 6]
 */
function turnVectorArrayIntoNumberArray(arr){
  return flatten(arr.map(function(item){
    return [item.x, item.y, item.z];
  }));
}

module.exports = p5.Geometry3D;