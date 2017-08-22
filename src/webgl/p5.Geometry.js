//some of the functions are adjusted from Three.js(http://threejs.org)

'use strict';

var p5 = require('../core/core');

/**
 * p5 Geometry class
 * @class p5.Geometry
 * @constructor
 * @param  {Function | Object} vertData callback function or Object
 *                     containing routine(s) for vertex data generation
 * @param  {Number} [detailX] number of vertices on horizontal surface
 * @param  {Number} [detailY] number of vertices on horizontal surface
 * @param {Function} [callback] function to call upon object instantiation.
 *
 */
p5.Geometry = function
(detailX, detailY, callback){
  //an array containing every vertex
  //@type [p5.Vector]
  this.vertices = [];

  /****AN ARRAY FOR STORING THE VERTICES OF LINES ***/
  this.lineVertices = [];

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
  /*** A 2D ARRAY CONTAINING EDGE CONNECTIVITY INFORMATION ***/
  this.edges = []
  this.detailX = (detailX !== undefined) ? detailX: 1;
  this.detailY = (detailY !== undefined) ? detailY: 1;
  if(callback instanceof Function){
    callback.call(this);
  }
  return this;
};

p5.Geometry.prototype.computeFaces = function(){
  var sliceCount = this.detailX + 1;
  var a, b, c, d;
  for (var i = 0; i < this.detailY; i++){
    for (var j = 0; j < this.detailX; j++){
      a = i * sliceCount + j;// + offset;
      b = i * sliceCount + j + 1;// + offset;
      c = (i + 1)* sliceCount + j + 1;// + offset;
      d = (i + 1)* sliceCount + j;// + offset;
      this.faces.push([a, b, d]);
      this.faces.push([d, b, c]);
    }
  }
  return this;
};

p5.Geometry.prototype._getFaceNormal = function(faceId,vertId){
  //This assumes that vA->vB->vC is a counter-clockwise ordering
  var face = this.faces[faceId];
  var vA = this.vertices[face[vertId%3]];
  var vB = this.vertices[face[(vertId+1)%3]];
  var vC = this.vertices[face[(vertId+2)%3]];
  var n = p5.Vector.cross(
    p5.Vector.sub(vB,vA),
    p5.Vector.sub(vC,vA));
  var sinAlpha = p5.Vector.mag(n) /
  (p5.Vector.mag(p5.Vector.sub(vB,vA))*
    p5.Vector.mag(p5.Vector.sub(vC,vA)));
  n = n.normalize();
  return n.mult(Math.asin(sinAlpha));
};
/**
 * computes smooth normals per vertex as an average of each
 * face.
 */
p5.Geometry.prototype.computeNormals = function (){
  for(var v=0; v < this.vertices.length; v++){
    var normal = new p5.Vector();
    for(var i=0; i < this.faces.length; i++){
      //if our face contains a given vertex
      //calculate an average of the normals
      //of the triangles adjacent to that vertex
      if(this.faces[i][0] === v ||
        this.faces[i][1] === v ||
        this.faces[i][2] === v)
      {
        normal = normal.add(this._getFaceNormal(i, v));
      }
    }
    normal = normal.normalize();
    this.vertexNormals.push(normal);
  }
  return this;
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

/**ANOTHER EXAMPLE OF HOW THIS WAS BEING DONE BEFORE**/
// p5.Geometry.prototype._makeTriangleEdges = function() {
//     for(var i = 0; i <= this.vertices.length; i+=3) {
//       var i0 = i;
//       var i1 = i+1;
//       var i2 = i+2;

//       //connections then boolean for whether it closes the triangle
//       //also checks to see that we don't go over
//       if(i1 <= this.vertices.length-1)
//         this.edges[i] = [i0, i1, false];
//       if(i2 <= this.vertices.length-1) {
//         this.edges[i+1] = [i1, i2, false];
//         this.edges[i+2] = [i2, i0, true];
//       }
//     }
//   return this;
// };

/**THIS ACHIEVES IDENTICAL RESULTS TO ABOVE BUT RESEMBLES PROCESSING MORE**/
p5.Geometry.prototype._makeTriangleEdges = function() {
  if (Array.isArray(this.strokeIndices)) {
    for (var index of this.strokeIndices) {
      this.edges.push(index);
    }
  }
  else {
    for (var face of this.faces) {
      this._addEdge(face[0], face[1]);
      this._addEdge(face[1], face[2]);
      this._addEdge(face[2], face[0]);
    }
  }


  /*
      for(var i = 0; i < this.vertices.length/3; i++) {
        var i0 = 3 * i;
        var i1 = 3 * i + 1;
        var i2 = 3 * i + 2;
        if(this.vertices.length > i1)
          this._addEdge(i0, i1, true, false);
        // else
        //   this._addEdge(3, 0);
        if(this.vertices.length > i2)
        {
          this._addEdge(i1, i2, false, false);
          this._addEdge(i2, i0, false, true);
        }
        // else
        // {
        //   this._addEdge(0,2);
        //   this._addEdge(2,3);
        // }
        // console.log('HEREER');
      }
      */
  return this;
};

p5.Geometry.prototype._addEdge = function(i, j, start, end) {
  var edge = [i, j];
  // edge.push((start ? 1 : 0) + 2 * (end ? 1 : 0));
  this.edges.push(edge);
};

p5.Geometry.prototype._edgesToVertices = function() {
  // This is where we want to start to make sure our lines are nice rectangles.
  // Assign a color to each rectangle (lerp hue based on start index). -- check where color is in shaders.

  this.lineVertices = [];
  var vertices = this.lineVertices;

  function store(verts) {
    //console.log("Line verts: ", verts);
    for (var i = 0; i < verts.length; i += 1) {
      vertices.push(verts[i].array());
    }
  }
  this.vertexNormals.length = 0;
  for(var i = 0; i < this.edges.length; i++)
  {
    // Go ahead and spread vertices out based on their orientation.
    // Something like:
    var a, b, c, d;
    var halfWidth = 3.0; // @todo parametrize line width
    var begin = this.vertices[this.edges[i][0]];
    var end = this.vertices[this.edges[i][1]];
    var dir = end.copy().sub(begin).normalize();
    // arbitrary; want up to be different from dir
    // in future, would like to use screen vector toward viewer as other component of basis.
    var up = new p5.Vector(0, 0, 1);
    var normal = p5.Vector.cross(dir, up);
    var offset = normal.mult(halfWidth); // beware: normal has changed after this call.
    a = begin;//.copy().add(offset.x, offset.y, offset.z);
    b = begin;//.copy().sub(offset.x, offset.y, offset.z);
    c = end;//.copy().add(offset.x, offset.y, offset.z);
    d = end;//.copy().sub(offset.x, offset.y, offset.z);
    var dirAdd = dir.array();//.push(1);
    dirAdd.push(1);
    var dirSub = dir.array();//.push(-1);
    dirSub.push(-1);
    //related to passing offset to shader
    // a.xyzw
     // a = begin.array();
     // //a.push(1);
     // //a.w = 1;
     // //a.xyz = a.xyz + offset * 1;
     // b = begin.array();
     // //b.w = -1;
     // //b.xyz = b.xyz + offset * -1;
     // //b.push(-1);
     // c = end.array();
     // //c.w = 1;
     // //c.xyz = c.xyz + offset * 1;
     // //c.push(1);
     // d = end.array();
     //d.w = -1
     //d.xyz = d.xyz + offset * -1;
     //d.push(-1);
    // b = [x, y, z, -1];
    // vert.xyz = vert.xyz + offset * vert.w;
    // store([a, b, c]); // put vertices into array in order
    //this.vertexNormals.push(dir, dir, dir, dir, dir, dir);
    this.vertexNormals.push(dirAdd,dirSub,dirAdd,dirAdd,dirSub,dirAdd);
    store([a, b, c, c, b, d]);
    // store([a, b, b, c, c, a]);
    // store([c, b, b, d, d, c]);

  }
  // Let's not draw lines as indexed geometry;
  // There is no memory benefit on the GPU.
  // 6 * 3 = 18 for
  // 4 * 3 + 6 = 18
  return this;
};

/**TEMPORARILY PUT THIS HELPER FUNCTION IN HERE**/
function flatten(arr){
  if (arr.length>0){
    return arr.reduce(function(a, b){
      return a.concat(b);
    });
  } else {
    return [];
  }
};

/**
 * Modifies all vertices to be centered within the range -100 to 100.
 * @return {p5.Geometry}
 */
p5.Geometry.prototype.normalize = function() {
  if(this.vertices.length > 0) {
    // Find the corners of our bounding box
    var maxPosition = this.vertices[0].copy();
    var minPosition = this.vertices[0].copy();

    for(var i = 0; i < this.vertices.length; i++) {
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

    for(i = 0; i < this.vertices.length; i++) {
      this.vertices[i].sub(center);
      this.vertices[i].mult(scale);
    }
  }
  return this;
};

module.exports = p5.Geometry;
