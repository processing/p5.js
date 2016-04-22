/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Geometry');
/**
 * Draw a plane with given a width and height
 * @method plane
 * @param  {Number} width      width of the plane
 * @param  {Number} height     height of the plane
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * //draw a plane with width 200 and height 200
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   plane(200, 200);
 * }
 * </code>
 * </div>
 */
p5.prototype.plane = function(width, height){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  width = width || 50;
  height = height || width;
  var detailX = typeof args[2] === 'number' ? args[2] : 1;
  var detailY = typeof args[3] === 'number' ? args[3] : 1;

  var gId = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _plane = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          p = new p5.Vector(width * u - width/2,
            height * v - height/2,
            0);
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var planeGeom =
    new p5.Geometry(detailX, detailY, _plane);
    planeGeom
      .computeFaces()
      .computeNormals();
    this._renderer.createBuffers(gId, planeGeom);
  }

  this._renderer.drawBuffers(gId);

};

/**
 * Draw a box with given width, height and depth
 * @method  box
 * @param  {Number} width  width of the box
 * @param  {Number} height height of the box
 * @param  {Number} depth  depth of the box
 * @return {p5}            the p5 object
 * @example
 * <div>
 * <code>
 * //draw a spining box with width, height and depth 200
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(200, 200, 200);
 * }
 * </code>
 * </div>
 */
p5.prototype.box = function(width, height, depth){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  width = width || 50;
  height = height || width;
  depth = depth || width;

  var detailX = typeof args[3] === 'number' ? args[3] : 4;
  var detailY = typeof args[4] === 'number' ? args[4] : 4;
  var gId = 'box|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _box = function(){
      var cubeIndices = [
        [0, 4, 2, 6],// -1, 0, 0],// -x
        [1, 3, 5, 7],// +1, 0, 0],// +x
        [0, 1, 4, 5],// 0, -1, 0],// -y
        [2, 6, 3, 7],// 0, +1, 0],// +y
        [0, 2, 1, 3],// 0, 0, -1],// -z
        [4, 5, 6, 7]// 0, 0, +1] // +z
      ];
      var id=0;
      for (var i = 0; i < cubeIndices.length; i++) {
        var cubeIndex = cubeIndices[i];
        var v = i * 4;
        for (var j = 0; j < 4; j++) {
          var d = cubeIndex[j];
          //inspired by lightgl:
          //https://github.com/evanw/lightgl.js
          //octants:https://en.wikipedia.org/wiki/Octant_(solid_geometry)
          var octant = new p5.Vector(
            ((d & 1) * 2 - 1)*width/2,
            ((d & 2) - 1) *height/2,
            ((d & 4) / 2 - 1) * depth/2);
          this.vertices.push( octant );
          this.uvs.push([j & 1, (j & 2) / 2]);
          id++;
        }
        this.faces.push([v, v + 1, v + 2]);
        this.faces.push([v + 2, v + 1, v + 3]);
      }
    };
    var boxGeom = new p5.Geometry(detailX,detailY, _box);
    boxGeom.computeNormals();
    //initialize our geometry buffer with
    //the key val pair:
    //geometry Id, Geom object
    this._renderer.createBuffers(gId, boxGeom);
  }
  this._renderer.drawBuffers(gId);

  return this;

};

/**
 * Draw a sphere with given radius
 * @method sphere
 * @param  {Number} radius            radius of circle
 * @param  {Number} [detailX]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
 * @param  {Number} [detailY]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 16
 * @return {p5}                       the p5 object
 * @example
 * <div>
 * <code>
 * // draw a sphere with radius 200
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   sphere(200);
 * }
 * </code>
 * </div>
 */
p5.prototype.sphere = function(radius){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  //@todo validate params here
  //
  radius = radius || 50;
  var detailX = typeof args[1] === 'number' ? args[1] : 24;
  var detailY = typeof args[2] === 'number' ? args[2] : 16;
  var gId = 'sphere|'+radius+'|'+detailX+'|'+detailY;
  if(!this._renderer.geometryInHash(gId)){
    var _sphere = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          var theta = 2 * Math.PI * u;
          var phi = Math.PI * v - Math.PI / 2;
          p = new p5.Vector(radius * Math.cos(phi) * Math.sin(theta),
            radius * Math.sin(phi),
            radius * Math.cos(phi) * Math.cos(theta));
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var sphereGeom = new p5.Geometry(detailX, detailY, _sphere);
    sphereGeom
      .computeFaces()
      .computeNormals();
    this._renderer.createBuffers(gId, sphereGeom);
  }
  this._renderer.drawBuffers(gId);

  return this;
};


/**
 * Creates vertices for a truncated cone, which is like a cylinder
 * except that it has different top and bottom radii. A truncated cone
 * can also be used to create cylinders and regular cones. The
 * truncated cone will be created centered about the origin, with the
 * y axis as its vertical axis. The created cone has position, normal
 * and uv streams.
 *
 * @param {number} bottomRadius Bottom radius of truncated cone.
 * @param {number} topRadius Top radius of truncated cone.
 * @param {number} height Height of truncated cone.
 * @param {number} detailXdivisions The number of subdivisions around the
 *     truncated cone.
 * @param {number} detailYdivisions The number of subdivisions down the
 *     truncated cone.
 * @param {boolean} [topCap] Create top cap. Default = true.
 * @param {boolean} [bottomCap] Create bottom cap. Default =
 *        true.
 * @return {Object.<string, TypedArray>} The
 *         created plane vertices.
 * @memberOf module:primitives
*/
var _truncatedCone = function(
  bottomRadius,
  topRadius,
  height,
  detailX,
  detailY,
  topCap,
  bottomCap) {
  detailX = (detailX < 3) ? 3 : detailX;
  detailY = (detailY < 1) ? 1 : detailY;
  topCap = (topCap === undefined) ? true : topCap;
  bottomCap = (bottomCap === undefined) ? true : bottomCap;
  var extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);
  var vertsAroundEdge = detailX + 1;

  // The slant of the cone is constant across its surface
  var slant = Math.atan2(bottomRadius - topRadius, height);
  var start = topCap ? -2 : 0;
  var end = detailY + (bottomCap ? 2 : 0);
  var yy, ii;//@TODO
  for (yy = start; yy <= end; ++yy) {
    var v = yy / detailY;
    var y = height * v;
    var ringRadius;
    if (yy < 0) {
      y = 0;
      v = 1;
      ringRadius = bottomRadius;
    } else if (yy > detailY) {
      y = height;
      v = 1;
      ringRadius = topRadius;
    } else {
      ringRadius = bottomRadius +
        (topRadius - bottomRadius) * (yy / detailY);
    }
    if (yy === -2 || yy === detailY + 2) {
      ringRadius = 0;
      v = 0;
    }
    y -= height / 2;
    for (ii = 0; ii < vertsAroundEdge; ++ii) {
      //VERTICES
      this.vertices.push(
        new p5.Vector(
          Math.sin(ii*Math.PI * 2 /detailX) * ringRadius,
          y,
          Math.cos(ii*Math.PI * 2 /detailX) * ringRadius)
        );
      //VERTEX NORMALS
      this.vertexNormals.push(
        new p5.Vector(
          (yy < 0 || yy > detailY) ? 0 :
          (Math.sin(ii * Math.PI * 2 / detailX) * Math.cos(slant)),
          (yy < 0) ? -1 : (yy > detailY ? 1 : Math.sin(slant)),
          (yy < 0 || yy > detailY) ? 0 :
          (Math.cos(ii * Math.PI * 2 / detailX) * Math.cos(slant)))
        );
      //UVs
      this.uvs.push([(ii / detailX), v]);
    }
  }
  for (yy = 0; yy < detailY + extra; ++yy) {
    for (ii = 0; ii < detailX; ++ii) {
      this.faces.push([vertsAroundEdge * (yy + 0) + 0 + ii,
        vertsAroundEdge * (yy + 0) + 1 + ii,
        vertsAroundEdge * (yy + 1) + 1 + ii]);
      this.faces.push([vertsAroundEdge * (yy + 0) + 0 + ii,
        vertsAroundEdge * (yy + 1) + 1 + ii,
        vertsAroundEdge * (yy + 1) + 0 + ii]);
    }
  }
};

/**
 * Draw a cylinder with given radius and height
 * @method  cylinder
 * @param  {Number} radius            radius of the surface
 * @param  {Number} height            height of the cylinder
 * @param  {Number} [detail]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
 * @return {p5}                       the p5 object
 * @example
 * <div>
 * <code>
 * //draw a spining sylinder with radius 200 and height 200
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateZ(frameCount * 0.01);
 *   cylinder(200, 200);
 * }
 * </code>
 * </div>
 */
p5.prototype.cylinder = function(radius, height){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  radius = radius || 50;
  height = height || 50;
  var detailX = typeof args[2] === 'number' ? args[2] : 24;
  var detailY = typeof args[3] === 'number' ? args[3] : 16;
  var gId = 'cylinder|'+radius+'|'+height+'|'+detailX+'|'+detailY;
  if(!this._renderer.geometryInHash(gId)){
    var cylinderGeom = new p5.Geometry(detailX, detailY);
    _truncatedCone.call(
      cylinderGeom,
      radius,
      radius,
      height,
      detailX,
      detailY,
      true,true);
    cylinderGeom
      .computeNormals();
    this._renderer.createBuffers(gId, cylinderGeom);
  }

  this._renderer.drawBuffers(gId);

  return this;
};


/**
 * Draw a cone with given radius and height
 * @method cone
 * @param  {Number} radius            radius of the bottom surface
 * @param  {Number} height            height of the cone
 * @param  {Number} [detailX]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
 * @param  {Number} [detailY]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 16
 * @return {p5}                       the p5 object
 * @example
 * <div>
 * <code>
 * //draw a spining cone with radius 200 and height 200
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateZ(frameCount * 0.01);
 *   cone(200, 200);
 * }
 * </code>
 * </div>
 */
p5.prototype.cone = function(radius, height){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  radius = radius || 50;
  height = height || 50;
  var detailX = typeof args[2] === 'number' ? args[2] : 24;
  var detailY = typeof args[3] === 'number' ? args[3] : 16;
  radius = radius || 50;
  height = height || 50;
  var gId = 'cone|'+radius+'|'+height+'|'+detailX+'|'+detailY;
  if(!this._renderer.geometryInHash(gId)){
    var coneGeom = new p5.Geometry(detailX, detailY);
    _truncatedCone.call(coneGeom,
      radius,
      0,
      height,
      detailX,
      detailY,
      true,
      true);
    //for cones we need to average Normals
    coneGeom
      .computeNormals();
    this._renderer.createBuffers(gId, coneGeom);
  }

  this._renderer.drawBuffers(gId);

  return this;
};

/**
 * Draw an ellipsoid with given raduis
 * @method ellipsoid
 * @param  {Number} radiusx           xradius of circle
 * @param  {Number} radiusy           yradius of circle
 * @param  {Number} radiusz           zradius of circle
 * @param  {Number} [detail]          number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24. Avoid detail number above
 *                                    150. It may crash the browser.
 * @return {p5}                       the p5 object
 * @example
 * <div>
 * <code>
 * // draw an ellipsoid with radius 200, 300 and 400 .
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   ellipsoid(200,300,400);
 * }
 * </code>
 * </div>
 */
p5.prototype.ellipsoid =
function(radiusx, radiusy, radiusz){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  var detailX = typeof args[2] === 'number' ? args[2] : 24;
  var detailY = typeof args[3] === 'number' ? args[3] : 24;
  radiusx = radiusx || 50;
  radiusy = radiusy || 50;
  radiusz = radiusz || 50;

  var gId = 'ellipsoid|'+radiusx+'|'+radiusy+
  '|'+radiusz+'|'+detailX+'|'+detailY;


  if(!this._renderer.geometryInHash(gId)){
    var _ellipsoid = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          var theta = 2 * Math.PI * u;
          var phi = Math.PI * v - Math.PI / 2;
          p = new p5.Vector(radiusx * Math.cos(phi) * Math.sin(theta),
            radiusy * Math.sin(phi),
            radiusz * Math.cos(phi) * Math.cos(theta));
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var ellipsoidGeom = new p5.Geometry(detailX, detailY,_ellipsoid);
    ellipsoidGeom
      .computeFaces()
      .computeNormals();
    this._renderer.createBuffers(gId, ellipsoidGeom);
  }

  this._renderer.drawBuffers(gId);

  return this;
};

/**
 * Draw a torus with given radius and tube radius
 * @method torus
 * @param  {Number} radius            radius of the whole ring
 * @param  {Number} tubeRadius        radius of the tube
 * @param  {Number} [detail]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
 * @return {p5}                       the p5 object
 * @example
 * <div>
 * <code>
 * //draw a spining torus with radius 200 and tube radius 60
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   torus(200, 60);
 * }
 * </code>
 * </div>
 */
p5.prototype.torus = function(radius, tubeRadius){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  var detailX = typeof args[2] === 'number' ? args[2] : 24;
  var detailY = typeof args[3] === 'number' ? args[3] : 16;

  radius = radius || 50;
  tubeRadius = tubeRadius || 10;

  var gId = 'torus|'+radius+'|'+tubeRadius+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _torus = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          var theta = 2 * Math.PI * u;
          var phi = 2 * Math.PI * v;
          p = new p5.Vector(
            (radius + tubeRadius * Math.cos(phi)) * Math.cos(theta),
            (radius + tubeRadius * Math.cos(phi)) * Math.sin(theta),
            tubeRadius * Math.sin(phi));
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var torusGeom = new p5.Geometry(detailX, detailY, _torus);
    torusGeom
      .computeFaces()
      .computeNormals();
    this._renderer.createBuffers(gId, torusGeom);
  }

  this._renderer.drawBuffers(gId);

  return this;
};

///////////////////////
/// 2D primitives
/// @TODO turn this from immediate mode
/// to retained mode
/////////////////////////
p5.Renderer3D.prototype.point = function(x, y, z){
  var gl = this.GL;
  this._primitives2D([x, y, z]);
  gl.drawArrays(gl.POINTS, 0, 1);
  return this;
};

/**
 * @todo need to rework line geometry to accommodate line weights
 * and stroke vals
 */
// p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
//   var gId = 'line|'+x1+'|'+y1+'|'+z1+'|'+x2+'|'+y2+'|'+z2;
//   if(!this.geometryInHash(gId)){
//     var _line = {
//       start: new p5.Vector(x1,y1,z1),
//       end: new p5.Vector(x2,y2,z2)
//     };
//     //starting point
//     var lineGeom = new p5.Geometry(_line);
//     this.createBuffers(gId, lineGeom);
//   }

//   this.drawBuffers(gId);
//   return this;
// };

p5.Renderer3D.prototype.triangle = function
(args){
  var x1=args[0], y1=args[1], z1=args[2];
  var x2=args[3], y2=args[4], z2=args[5];
  var x3=args[6], y3=args[7], z3=args[8];
  var gId = 'tri|'+x1+'|'+y1+'|'+z1+'|'+
  x2+'|'+y2+'|'+z2+
  x3+'|'+y3+'|'+z3;
  if(!this.geometryInHash(gId)){
    var _triangle = function(){
      var vertices = [];
      vertices.push(new p5.Vector(x1,y1,z1));
      vertices.push(new p5.Vector(x2,y2,z2));
      vertices.push(new p5.Vector(x3,y3,z3));
      this.vertices = vertices;
      this.faces = [[0,1,2]];
      this.uvs = [[0,0],[0,1],[1,1]];
    };
    var triGeom = new p5.Geometry(1,1,_triangle);
    triGeom.computeNormals();
    this.createBuffers(gId, triGeom);
  }

  this.drawBuffers(gId);
  return this;
};

/**
 * Draws an ellipse (oval) to the screen. An ellipse with equal width and
 * height is a circle. By default, the first two parameters set the location,
 * and the third and fourth parameters set the shape's width and height. The
 * origin may be changed with the ellipseMode() function.
 *
 * @method ellipse
 * @param  {Array} args an array of numbers containing:
 *                       args[0] : x-coordinate of the ellipse.
 *                       args[1] : y-coordinate of the ellipse.
 *                       args[2] : z-coordinate of the ellipse.
 *                       args[3] : width of the ellipse.
 *                       args[4] : height of the ellipse.
 *                       [ args[5]]: optional detailX of the ellipse
 *                       [ args[6]]: optional detailY of the ellipse.
 * @return {p5.Renderer3D} the Renderer3D object
 * @example
 * <div>
 * <code>
 * ellipse(56, 46, -100, 55, 55);
 * </code>
 * </div>
 * @todo handle other ellipseModes
 */
p5.Renderer3D.prototype.ellipse = function
(args){
  var x = args[0];
  var y = args[1];
  var z = args[2];
  var width = args[3];
  var height = args[4];
  //detailX and Y are optional 6th & 7th
  //arguments
  var detailX = args[5] || 24;
  var detailY = args[6] || 16;
  var gId = 'ellipse|'+args[0]+'|'+args[1]+'|'+args[2]+'|'+
  args[3]+'|'+args[4];
  if(!this.geometryInHash(gId)){
    var _ellipse = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          var theta = 2 * Math.PI * u;
          if(v === 0){
            p = new p5.Vector(x, y, z);
          }
          else{
            var _x = x + width * Math.sin(theta);
            var _y = y + height * Math.cos(theta);
            var _z = z;
            p = new p5.Vector(_x, _y, _z);
          }
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var ellipseGeom = new p5.Geometry(detailX,detailY,_ellipse);
    ellipseGeom
      .computeFaces()
      .computeNormals();
    this.createBuffers(gId, ellipseGeom);
  }
  this.drawBuffers(gId);
  return this;
};
/**
 * Draws a Rectangle.
 * @type {p5.Renderer3D} the Renderer3D object
 * @todo check and handle for rectMode(CENTER)
 */
p5.Renderer3D.prototype.rect = function
(args){
  // var x3 = x + width;
  // var y3 = y + height;
  // var x4 = x + width;
  // var y4 = y;
  var gId = 'rect|'+args[0]+'|'+args[1]+'|'+args[2]+'|'+
  args[3]+'|'+args[4];
  var x = args[0];
  var y = args[1];
  var width = args[3];
  var height = args[4];
  //detailX and Y are optional 6th & 7th
  //arguments
  var detailX = args[5] || 24;
  var detailY = args[6] || 16;
  if(!this.geometryInHash(gId)){
    var _rect = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          p = new p5.Vector(
            (x + width) * u,
            (y + height) * v,
            0
          );
          this.vertices.push(p);
          this.uvs.push([u,v]);
        }
      }
    };
    var rectGeom = new p5.Geometry(detailX,detailY,_rect);
    rectGeom
      .computeFaces()
      .computeNormals();
    this.createBuffers(gId, rectGeom);
  }
  this.drawBuffers(gId);
  return this;
};

/**
 * [quad description]
 * @type {[type]}
 * @todo currently buggy, due to vertex winding
 */
// p5.Renderer3D.prototype.quad = function
// (x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
//   var gId = 'quad|'+x1+'|'+y1+'|'+z1+'|'+
//   x2+'|'+y2+'|'+z2+
//   x3+'|'+y3+'|'+z3+
//   x4+'|'+y4+'|'+z4;
//   if(!this.geometryInHash(gId)){
//     var _quad = function(){
//       this.vertices.push(new p5.Vector(x1,y1,z1));
//       p2: new p5.Vector(x2,y2,z2),
//       p3: new p5.Vector(x3,y3,z3),
//       p4: new p5.Vector(x4,y4,z4)
//     };
//     //starting point
//     var quadGeom = new p5.Geometry(2,2,_quad);
//     quadGeom
//       .computeNormals()
//       .computeUVs();
//     function(){
//       this.faces = [[0,1,2],[2,3,1]];
//       this.computeNormals().computeUVs();
//     });
//     this.createBuffers(gId, quadGeom);
//   }
//   this.drawBuffers(gId);
//   return this;
// };

module.exports = p5;