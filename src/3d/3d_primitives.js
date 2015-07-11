'use strict';

var p5 = require('../core/core');
require('./p5.Geometry3D');

/**
 * draw a plane with given a width and height
 * @param  {Number} width             the width of the plane
 * @param  {Number} height            the height of the plane
 * @param  {Number} detailX(optional) number of vertices on horizontal surface
 * @param  {Number} detailY(optional) number of vertices on horizontal surface
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   plane(100, 100);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.plane = function(width, height, detailX, detailY){

  width = width || 1;
  height = height || 1;

  detailX = detailX || 1;
  detailY = detailY || 1;

  var gId = 'plane|'+width+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

    var geometry3d = new p5.Geometry3D();

    var createPlane = function(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = 0;
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createPlane, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(gId, obj);

  }

  this._graphics.drawBuffer(gId);

};

/**
 * draw a sphere with given raduis
 * @param  {Number} radius            radius of the sphere
 * @param  {Number} detailX(optional) number of vertices on horizontal surface
 * @param  {Number} detailY(optional) number of vertices on vertical surface
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   sphere(100);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.sphere = function(radius, detailX, detailY){

  radius = radius || 50;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var gId = 'sphere|'+radius+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

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

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(gId, obj);
  }

  this._graphics.drawBuffer(gId);

  return this;
};

/**
 * draw a cylinder with given radius and height
 * @param  {Number} radius            radius of the surface
 * @param  {Number} height            height of the cylinder
 * @param  {Number} detailX(optional) number of vertices on horizontal surface
 * @param  {Number} detailY(optional) number of vertices on vertical surface
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   cylinder(100, 200);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.cylinder = function(radius, height, detailX, detailY){

  radius = radius || 50;
  height = height || 50;

  detailX = detailX || 12;
  detailY = detailY || 8;

  var gId = 'cylinder|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

    var geometry3d = new p5.Geometry3D();

    var createCylinder = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCylinder, detailX, detailY);
    geometry3d.mergeVertices();

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

    geometry3d.parametricGeometry(
      createTop, detailX, 1, geometry3d.vertices.length);

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

    geometry3d.parametricGeometry(
      createBottom, detailX, 1, geometry3d.vertices.length);

    var obj = geometry3d.generateObj(true);

    this._graphics.initBuffer(gId, obj);
  }

  this._graphics.drawBuffer(gId);

  return this;
};


/**
 * draw a cone with given radius and height
 * @param  {Number} radius            radius of the bottom surface
 * @param  {Number} height            height of the cone
 * @param  {Number} detailX(optional) number of vertices on horizontal surface
 * @param  {Number} detailY(optional) number of vertices on vertical surface
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   cone(100, 200);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.cone = function(radius, height, detailX, detailY){

  radius = radius || 50;
  height = height || 50;

  detailX = detailX || 10;
  detailY = detailY || 6;

  var gId = 'cone|'+radius+'|'+height+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

    var geometry3d = new p5.Geometry3D();

    var createCone = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(createCone, detailX, detailY);
    geometry3d.mergeVertices();

    var createBottom = function(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(-theta);
      var y = -height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    };

    geometry3d.parametricGeometry(
      createBottom, detailX, 1, geometry3d.vertices.length);

    var obj = geometry3d.generateObj(true);

    this._graphics.initBuffer(gId, obj);
  }

  this._graphics.drawBuffer(gId);

  return this;
};


/**
 * draw a torus with given radius and tube radius
 * @param  {Number} radius            radius of the whole ring
 * @param  {Number} tubeRadius        radius of the tube
 * @param  {Number} detailX(optional) number of vertices on horizontal surface
 * @param  {Number} detailY(optional) number of vertices on vertical surface
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   torus(100, 20);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.torus = function(radius, tubeRadius, detailX, detailY){

  radius = radius || 50;
  tubeRadius = tubeRadius || 20;

  detailX = detailX || 12;
  detailY = detailY || 6;

  var gId = 'torus|'+radius+'|'+tubeRadius+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

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

    var obj = geometry3d.generateObj();

    this._graphics.initBuffer(gId, obj);
  }

  this._graphics.drawBuffer(gId);

  return this;
};

/**
 * draw a box with given widht, height and depth
 * @param  {Number} width  width of the box
 * @param  {Number} height height of the box
 * @param  {Number} depth  depth of the box
 * example
 * <div class="norender">
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 *
 * var theta = 0;
 *
 * function draw(){
 *   background(255, 255, 255, 255);
 *   translate(0, 0, -100);
 *   push();
 *   rotateZ(theta);
 *   rotateX(theta);
 *   rotateY(theta);
 *   box(100, 100, 100);
 *   pop();
 *   theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.box = function(width, height, depth){

  width = width || 10;
  height = height || width;
  depth = depth || width;

  //detail for box as optional
  var detailX = typeof arguments[3] === Number ? arguments[3] : 1;
  var detailY = typeof arguments[4] === Number ? arguments[4] : 1;

  var gId = 'cube|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(!this._graphics.geometryInHash(gId)){

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

    var obj = geometry3d.generateObj(true);

    this._graphics.initBuffer(gId, obj);
  }

  this._graphics.drawBuffer(gId);

  return this;

};

module.exports = p5;
