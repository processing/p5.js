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
  width = width || 50;
  height = height || width;

  var detailX = typeof arguments[2] === Number ? arguments[2] : 1;
  var detailY = typeof arguments[3] === Number ? arguments[3] : 1;

  var gId = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _plane = function(u, v){
      var x = width * u - width/2;
      var y = height * v - height/2;
      var z = 0;
      return new p5.Vector(x, y, z);
    };
    var planeGeom =
    new p5.Geometry(_plane, detailX, detailY);
    this._renderer.createBuffer(gId, planeGeom);
  }

  this._renderer.drawBuffer(gId);

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

  width = width || 50;
  height = height || width;
  depth = depth || width;

  var detailX = typeof arguments[3] === Number ? arguments[3] : 1;
  var detailY = typeof arguments[4] === Number ? arguments[4] : 1;

  var gId = 'box|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _box = {
      //RIGHT
      // right:function(u, v){
      //   var _width = width/2;
      //   var _height = height/2;
      //   var _depth = depth/2;
      //   console.log('drawing right');
      //   var x = _width;
      //   var y = 2 * _height * u - _height;
      //   var z = 2 * _depth * v - _depth;
      //   return new p5.Vector(x, y, z);
      // }//,
      // bottom: function(u, v){
      //   console.log('drawing bottom');
      //   var x = 2 * width * ( 1 - u ) - width;
      //   var y = 2 * height * v - height;
      //   var z = -depth;
      //   return new p5.Vector(x, y, z);
      // }//,
      // left: function(u, v){
      //   console.log('drawing left');
      //   var x = 2 * width * ( 1 - u ) - width;
      //   var y = height;
      //   var z = 2 * depth * v - depth;
      //   return new p5.Vector(x, y, z);
      // },
      // right: function(u, v){
      //   console.log('drawing right');
      //   var x = 2 * width * u - width;
      //   var y = -height;
      //   var z = 2 * depth * v - depth;
      //   return new p5.Vector(x, y, z);
      // },
      // front: function(u, v){
      //   console.log('drawing front');
      //   var x = 2 * width * u - width;
      //   var y = 2 * height * v - height;
      //   var z = depth;
      //   return new p5.Vector(x, y, z);
      // },
      // back: function(u, v){
      //   console.log('drawing back');
      //   var x = -width;
      //   var y = 2 * height * ( 1 - u ) - height;
      //   var z = 2 * depth * v - depth;
      //   return new p5.Vector(x, y, z);
      // }
    };
    var boxGeom = new p5.Geometry(
      _box, detailX, detailY);//, boxGeom.vertices.length);
    //initialize our geometry buffer with
    //the key val pair:
    //geometry Id, Geom object
    this._renderer.createBuffer(gId, boxGeom);
    console.log(boxGeom.getVertices());
  }
  this._renderer.drawBuffer(gId);

  return this;

};

/**
 * Draw a sphere with given raduis
 * @method sphere
 * @param  {Number} radius            radius of circle
 * @param  {Number} [detail]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
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
p5.prototype.sphere = function(radius, detail){

  radius = radius || 50;

  var detailX = detail || 24;
  var detailY = detail || 16;

  var gId = 'sphere|'+radius+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _sphere = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * v - Math.PI / 2;
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.sin(phi);
      var z = radius * Math.cos(phi) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };
    var sphereGeom = new p5.Geometry(_sphere, detailX, detailY);
    //for spheres we need to average the normals
    //and poles
    sphereGeom.averageNormals().averagePoleNormals();
    this._renderer.createBuffer(gId, sphereGeom);
  }

  this._renderer.drawBuffer(gId);

  return this;
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
p5.prototype.cylinder = function(radius, height, detail){

  radius = radius || 50;
  height = height || 50;

  var detailX = detail || 24;
  var detailY = detail || 16;

  var gId = 'cylinder|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _cylinder = {
      side: function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(theta);
        var y = 2 * height * v - height;
        var z = radius * Math.cos(theta);
        return new p5.Vector(x, y, z);
      },
      top: function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(-theta);
        var y = height;
        var z = radius * Math.cos(theta);
        if(v === 0){
          return new p5.Vector(0, height, 0);
        }
        else{
          return new p5.Vector(x, y, z);
        }
      },
      bottom: function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * Math.sin(theta);
        var y = -height;
        var z = radius * Math.cos(theta);
        if(v === 0){
          return new p5.Vector(0, -height, 0);
        }else{
          return new p5.Vector(x, y, z);
        }
      }
    };
    var cylinderGeom = new p5.Geometry(_cylinder, detailX, detailY);
    //for cylinders we need to average normals
    cylinderGeom.averageNormals();
    this._renderer.createBuffer(gId, cylinderGeom);
  }

  this._renderer.drawBuffer(gId);

  return this;
};


/**
 * Draw a cone with given radius and height
 * @method cone
 * @param  {Number} radius            radius of the bottom surface
 * @param  {Number} height            height of the cone
 * @param  {Number} [detail]          optional: number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24
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
p5.prototype.cone = function(radius, height, detail){

  radius = radius || 50;
  height = height || 50;

  var detailX = detail || 24;
  var detailY = detail || 16;

  var gId = 'cone|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _cone = {
      side: function(u,v){
        var theta = 2 * Math.PI * u;
        var x = radius * (1 - v) * Math.sin(theta);
        var y = 2 * height * v - height;
        var z = radius * (1 - v) * Math.cos(theta);
        return new p5.Vector(x, y, z);
      },
      bottom: function(u, v){
        var theta = 2 * Math.PI * u;
        var x = radius * (1 - v) * Math.sin(-theta);
        var y = -height;
        var z = radius * (1 - v) * Math.cos(theta);
        return new p5.Vector(x, y, z);
      }
    };
    var coneGeom =
    new p5.Geometry(_cone, detailX, detailY);
    //for cones we need to average Normals
    coneGeom.averageNormals();
    this._renderer.createBuffer(gId, coneGeom);
  }

  this._renderer.drawBuffer(gId);

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
p5.prototype.torus = function(radius, tubeRadius, detail){

  radius = radius || 50;
  tubeRadius = tubeRadius || 10;

  var detailX = detail || 24;
  var detailY = detail || 16;

  var gId = 'torus|'+radius+'|'+tubeRadius+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _torus = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = 2 * Math.PI * v;
      var x = (radius + tubeRadius * Math.cos(phi)) * Math.cos(theta);
      var y = (radius + tubeRadius * Math.cos(phi)) * Math.sin(theta);
      var z = tubeRadius * Math.sin(phi);
      return new p5.Vector(x, y, z);
    };
    var torusGeom =
    new p5.Geometry(_torus, detailX, detailY);
    //for torus we need to average normals
    torusGeom.averageNormals();
    this._renderer.createBuffer(gId, torusGeom);
  }

  this._renderer.drawBuffer(gId);

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

p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
  var gId = 'line|'+x1+'|'+y1+'|'+z1+'|'+x2+'|'+y2+'|'+z2;
  if(!this.geometryInHash(gId)){
    var _line = {
      start: new p5.Vector(x1,y1,z1),
      end: new p5.Vector(x2,y2,z2)
    };
    //starting point
    var lineGeom = new p5.Geometry(_line);
    this.createBuffer(gId, lineGeom);
  }

  this.drawBuffer(gId);
  return this;
};

p5.Renderer3D.prototype.triangle = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3){
  var gId = 'tri|'+x1+'|'+y1+'|'+z1+'|'+
  x2+'|'+y2+'|'+z2+
  x3+'|'+y3+'|'+z3;
  if(!this.geometryInHash(gId)){
    var _triangle = {
      p1: new p5.Vector(x1,y1,z1),
      p2: new p5.Vector(x2,y2,z2),
      p3: new p5.Vector(x3,y3,z3)
    };
    var triGeom = new p5.Geometry(_triangle);
    this.createBuffer(gId, triGeom);
  }

  this.drawBuffer(gId);
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
 */
p5.Renderer3D.prototype.ellipse = function
(args){
  //detailX and Y are optional 6th & 7th
  //arguments
  var detailX = args[5] || 24;
  var detailY = args[6] || 16;
  var gId = 'ellipse|'+args[0]+'|'+args[1]+'|'+args[2]+'|'+
  args[3]+'|'+args[4];
  if(!this.geometryInHash(gId)){
    var _ellipse = function(u, v){
      var theta = 2 * Math.PI * u;
      var _x = args[0] + args[3] * Math.sin(theta);
      var _y = args[1] + args[4] * Math.cos(theta);
      var _z = args[2];
      if(v === 0){
        return new p5.Vector(args[0], args[1], args[2]);
      }
      else{
        return new p5.Vector(_x, _y, _z);
      }
    };
    var ellipseGeom = new p5.Geometry(_ellipse, detailX, detailY);
    this.createBuffer(gId, ellipseGeom);
  }
  this.drawBuffer(gId);
  return this;
};

p5.Renderer3D.prototype.quad = function
(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
  var gId = 'quad|'+x1+'|'+y1+'|'+z1+'|'+
  x2+'|'+y2+'|'+z2+
  x3+'|'+y3+'|'+z3+
  x4+'|'+y4+'|'+z4;
  if(!this.geometryInHash(gId)){
    var _quad = {
      p1: new p5.Vector(x1,y1,z1),
      p2: new p5.Vector(x2,y2,z2),
      p3: new p5.Vector(x3,y3,z3),
      p4: new p5.Vector(x4,y4,z4)
    };
    //starting point
    var quadGeom = new p5.Geometry(_quad);
    this.createBuffer(gId, quadGeom);
  }
  this.drawBuffer(gId);
  return this;
};

module.exports = p5;