/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry3D
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Geometry3D');

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
  height = height || 50;

  //details for plane are highly optional
  var detailX = typeof arguments[2] === Number ? arguments[2] : 1;
  var detailY = typeof arguments[3] === Number ? arguments[3] : 1;

  var gId = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){

    var geometry3d = new p5.Geometry3D();

    var createPlane = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = 0;
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createPlane, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._renderer.initBuffer(gId, [obj]);

  }

  this._renderer.drawBuffer(gId);

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

    var geometry3d = new p5.Geometry3D();

    var createSphere = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * v - Math.PI / 2;
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.sin(phi);
      var z = radius * Math.cos(phi) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createSphere, detailX, detailY);

    var obj = geometry3d.generateObj(true, true);

    this._renderer.initBuffer(gId, [obj]);
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

    var geometry3d = new p5.Geometry3D();

    var createCylinder = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCylinder, detailX, detailY);
    var obj = geometry3d.generateObj(true);

    var createTop = function(u, v){
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
    };

    var geometry3d1 = new p5.Geometry3D();
    geometry3d1.parametricGeometry(
      createTop, detailX, 1);
    var obj1 = geometry3d1.generateObj();

    var createBottom = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * Math.sin(theta);
      var y = -height;
      var z = radius * Math.cos(theta);
      if(v === 0){
        return new p5.Vector(0, -height, 0);
      }else{
        return new p5.Vector(x, y, z);
      }
    };

    var geometry3d2 = new p5.Geometry3D();
    geometry3d2.parametricGeometry(
      createBottom, detailX, 1);
    var obj2 = geometry3d2.generateObj();


    this._renderer.initBuffer(gId, [obj, obj1, obj2]);
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

    var geometry3d = new p5.Geometry3D();

    var createCone = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCone, detailX, detailY);
    var obj = geometry3d.generateObj(true);

    var geometry3d1 = new p5.Geometry3D();
    var createBottom = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(-theta);
      var y = -height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d1.parametricGeometry(
      createBottom, detailX, 1);
    var obj1 = geometry3d1.generateObj();

    this._renderer.initBuffer(gId, [obj, obj1]);
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

    var geometry3d = new p5.Geometry3D();

    var createTorus = function(u, v){
      var theta = 2 * Math.PI * u;
      var phi = 2 * Math.PI * v;
      var x = (radius + tubeRadius * Math.cos(phi)) * Math.cos(theta);
      var y = (radius + tubeRadius * Math.cos(phi)) * Math.sin(theta);
      var z = tubeRadius * Math.sin(phi);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createTorus, detailX, detailY);

    var obj = geometry3d.generateObj(true);

    this._renderer.initBuffer(gId, [obj]);
  }

  this._renderer.drawBuffer(gId);

  return this;
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

  //details for box are highly optional
  var detailX = typeof arguments[3] === Number ? arguments[3] : 1;
  var detailY = typeof arguments[4] === Number ? arguments[4] : 1;

  var gId = 'cube|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){

    var geometry3d = new p5.Geometry3D();

    var createPlane1 = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane2 = function(u, v){
      var x = 2 * width * ( 1 - u ) - width;
      var y = 2 * height * v - height;
      var z = -depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane3 = function(u, v){
      var x = 2 * width * ( 1 - u ) - width;
      var y = height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane4 = function(u, v){
      var x = 2 * width * u - width;
      var y = -height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane5 = function(u, v){
      var x = width;
      var y = 2 * height * u - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };
    var createPlane6 = function(u, v){
      var x = -width;
      var y = 2 * height * ( 1 - u ) - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(
      createPlane1, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane2, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane3, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane4, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane5, detailX, detailY, geometry3d.vertices.length);
    geometry3d.parametricGeometry(
      createPlane6, detailX, detailY, geometry3d.vertices.length);

    var obj = geometry3d.generateObj();

    this._renderer.initBuffer(gId, [obj]);
  }

  this._renderer.drawBuffer(gId);

  return this;

};

module.exports = p5;