//some of the functions are adjusted from Three.js(http://threejs.org)

'use strict';

var p5 = require('../core/core');

/**
 * p5 Geometry class
 */
p5.Geometry = function
(vertData, detailX, detailY, offset){
  //an array containing every vertex
  //@type [p5.Vector]
  this.vertices = [];
  //an array containing each normals for each vertex
  //each normal is a p5.Vector
  //[p5.Vector, p5.Vector, p5.Vector,p5.Vector, p5.Vector, p5.Vector,...]
  this.vertexNormals = [];
  //an array containing each three vertex indices that form a face
  //[[0, 1, 2], [2, 1, 3], ...]
  this.faces = [];
  //an array containing every normal for each face
  //each faceNormal is a p5.Vector
  //[[p5.Vector, p5.Vector, p5.Vector],[p5.Vector, p5.Vector, p5.Vector],...]
  this.faceNormals = [];
  //an array of array containing uvs (group according to faces)
  //[[[0, 0], [1, 0], [1, 0]],...]
  this.uvs = [];
  this.detailX = (detailX !== undefined) ? detailX: 1;
  this.detailY = (detailY !== undefined) ? detailY: 1;
  this._init(vertData, offset);

  return this;
};

/**
 * Initialize geometry with vertex data and parameters
 * @param  {Function | Object} vertData callback function or Object
 *                     containing routine(s) for vertex data generation
 * @param  {Number} detailX number of vertices on horizontal surface
 * @param  {Number} detailY number of vertices on horizontal surface
 * @param  {Number} offset  offset of vertices index
 */
p5.Geometry.prototype._init = function
(vertData, offset){
  offset = offset || 0;
  if(vertData instanceof Function){
    this._computeVertices(vertData);
  }
  //otherwise it's an Object
  else {
    //traverse the vertData Object
    //either directly pushing vertices,
    //or calculating them by passing func
    for(var item in vertData){
      if(vertData.hasOwnProperty(item)){
        if (vertData[item] instanceof p5.Vector){
          this.vertices.push(vertData[item]);
        }
        //otherwise the item is a vertex func
        else {
          this._computeVertices(vertData[item]);
        }
      }
    }
  }
  this._computeFaces(offset);
  this._computeUVs();
  this._computeFaceNormals();
  this._computeVertexNormals();
};

p5.Geometry.prototype._computeVertices = function(vertFunc){
  var u,v,p;
  for (var i = 0; i <= this.detailY; i++){
    v = i / this.detailY;
    for (var j = 0; j <= this.detailX; j++){
      u = j / this.detailX;
      p = vertFunc(u, v);
      this.vertices.push(p);
    }
  }
};

p5.Geometry.prototype.getVertices = function()
{
  return this.vertices;
};

p5.Geometry.prototype._computeFaces = function(offset){
  var sliceCount = this.detailX + 1;
  var a, b, c, d;
  for (var i = 0; i < this.detailY; i++){
    for (var j = 0; j < this.detailX; j++){
      a = i * sliceCount + j + offset;
      b = i * sliceCount + j + 1 + offset;
      c = (i + 1)* sliceCount + j + 1 + offset;
      d = (i + 1)* sliceCount + j + offset;
      this.faces.push([a, b, d]);
      this.faces.push([d, b, c]);
      //this.faces.push([a, b, d]);
      //this.faces.push([b, c, d]);
    }
  }
};

p5.Geometry.prototype._computeUVs = function(){
  var uva, uvb, uvc, uvd;
  for (var i = 0; i < this.detailY; i++){
    for (var j = 0; j < this.detailX; j++){
      uva = [j/this.detailX, i/this.detailY];
      uvb = [(j + 1)/ this.detailX, i/this.detailY];
      uvc = [(j + 1)/ this.detailX, (i + 1)/this.detailY];
      uvd = [j/this.detailX, (i + 1)/this.detailY];
      this.uvs.push(uva, uvb, uvd);
      this.uvs.push(uvb, uvc, uvd);
    }
  }
};

/**
 * compute faceNormals for a geometry
 */
p5.Geometry.prototype._computeFaceNormals = function(){

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
p5.Geometry.prototype._computeVertexNormals = function (){

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
 * Averages the vertex normals. Used in curved
 * surfaces
 * @return {p5.Geometry}
 */
p5.Geometry.prototype.averageNormals = function() {

  for(var i = 0; i <= this.detailY; i++){
    var offset = this.detailX + 1;
    var temp = p5.Vector
      .add(this.vertexNormals[i*offset],
        this.vertexNormals[i*offset + this.detailX]);
    temp = p5.Vector.div(temp, 2);
    this.vertexNormals[i*offset] = temp;
    this.vertexNormals[i*offset + this.detailX] = temp;
  }
  return this;
};

/**
 * Averages pole normals.  Used in spherical primitives
 * @return {p5.Geometry}
 */
p5.Geometry.prototype.averagePoleNormals = function() {

  //average the north pole
  var sum = new p5.Vector(0, 0, 0);
  for(var i = 0; i < this.detailX; i++){
    sum.add(this.vertexNormals[i]);
  }
  sum = p5.Vector.div(sum, this.detailX);

  for(i = 0; i < this.detailX; i++){
    this.vertexNormals[i] = sum;
  }

  //average the south pole
  sum = new p5.Vector(0, 0, 0);
  for(i = this.vertices.length - 1;
    i > this.vertices.length - 1 - this.detailX; i--){
    sum.add(this.vertexNormals[i]);
  }
  sum = p5.Vector.div(sum, this.detailX);

  for(i = this.vertices.length - 1;
    i > this.vertices.length - 1 - this.detailX; i--){
    this.vertexNormals[i] = sum;
  }
  return this;
};

/**
 * [_generateUV description]
 * @param  {Array} faces [description]
 * @param  {Array} uvs   [description]
 * @todo  remove this function. unnecessary!
 */
// p5.Geometry.prototype._generateUV = function(faces, uvs){

//   faces = flatten(faces);
//   uvs = flatten(uvs);
//   var arr = [];
//   faces.forEach(function(item, index){
//     arr[item] = uvs[index];
//   });
//   return flatten(arr);
// };
module.exports = p5.Geometry;