/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core/core');
  require('3d/p5.Geometry3D');

  /**
   * generate plane geomery
   * @param  {Number} width   the width of the plane
   * @param  {Number} height  the height of the plane
   * @param  {Number} detailX how many segments in the x axis
   * @param  {Number} detailY how many segments in the y axis
   * @return {[type]}         [description]        
   */
  p5.prototype.plane = function(width, height, detailX, detailY){

    var uuid = 'plane-';
    var params = Array.prototype.slice.call(arguments, 0);
    params.forEach(function(param){
      uuid += (param + '-');
    });
 
    if(this._graphics.notInHash(uuid)){
      var geometry3d = new p5.Geometry3D();

      width = width || 1;
      height = height || 1;

      detailX = detailX || 1;
      detailY = detailY || 1;

      var createPlane = function(u, v){
        var x = 2 * width * u - width;
        var y = 2 * height * v - height;
        var z = 0;
        return new p5.Vector(x, y, z);
      };
      
      geometry3d.parametricGeometry(createPlane, detailX, detailY);
      
      var obj = geometry3d.generateObj();
 
      this._graphics.initGeometry(uuid, obj);
    
    }

    this._graphics.drawGeometry(uuid);

  };

  //TODO: a lookup table for sin cos

  /**
   * [sphere description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.sphere = function(radius, detailX, detailY){
    
    var geometry3d = new p5.Geometry3D();

    radius = radius || 50;

    detailX = detailX || 10;
    detailY = detailY || 6;

    function createSphere(u, v){
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * v - Math.PI / 2;
      var x = radius * Math.cos(phi) * Math.sin(theta);
      var y = radius * Math.sin(phi);
      var z = radius * Math.cos(phi) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    }

    geometry3d.parametricGeometry(createSphere, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.drawGeometry(obj);

    return this;
  };

  /**
   * [cylinder description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.cylinder = function(radius, height, detailX, detailY){
    
    var geometry3d = new p5.Geometry3D();

    radius = radius || 50;
    height = height || 50;

    detailX = detailX || 10;
    detailY = detailY || 6;

    function createCylinder(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * Math.cos(theta);
      return new p5.Vector(x, y, z);
    }
    
    geometry3d.parametricGeometry(createCylinder, detailX, detailY);

    //TODO: top and bottom faces
    //this.vertices.push(new p5.Vector(0, height/2, 0));  
    //this.vertices.push(new p5.Vector(0, -height/2, 0));

    var obj = geometry3d.generateObj();

    this._graphics.drawGeometry(obj);

    return this;
  };

  /**
   * [cone description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.cone = function(radius, height, detailX, detailY){
    
    var geometry3d = new p5.Geometry3D();

    radius = radius || 50;
    height = height || 50;

    detailX = detailX || 10;
    detailY = detailY || 6;

    function createCone(u, v){
      var theta = 2 * Math.PI * u;
      var x = radius * (1 - v) * Math.sin(theta);
      var y = 2 * height * v - height;
      var z = radius * (1 - v) * Math.cos(theta);
      return new p5.Vector(x, y, z);
    }

    geometry3d.parametricGeometry(createCone, detailX, detailY);

    //@TODO: add bottom face

    var obj = geometry3d.generateObj();

    this._graphics.drawGeometry(obj);

    return this;
  };

  /**
   * [torus description]
   * @param  {[type]} radius  [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.torus = function(radius, tube, detailX, detailY){
    
    var geometry3d = new p5.Geometry3D();

    radius = radius || 50;
    tube = tube || 20;

    detailX = detailX || 10;
    detailY = detailY || 6;

    function createTorus(u, v){
      var theta = 2 * Math.PI * u;
      var phi = 2 * Math.PI * v;
      var x = (radius + tube * Math.cos(phi)) * Math.cos(theta);
      var y = (radius + tube * Math.cos(phi)) * Math.sin(theta);
      var z = tube * Math.sin(phi);
      return new p5.Vector(x, y, z);
    }

    geometry3d.parametricGeometry(createTorus, detailX, detailY);

    var obj = geometry3d.generateObj();

    this._graphics.drawGeometry(obj);

    return this;
  };

  /**
   * [cube description]
   * @param  {[type]} width   [description]
   * @param  {[type]} height  [description]
   * @param  {[type]} depth   [description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   */
  p5.prototype.cube = function(width, height, depth, detailX, detailY){

    var geometry3d = new p5.Geometry3D();

    width = width || 1;
    height = height || 1;
    depth = depth || 1;

    detailX = detailX || 1;
    detailY = detailY || 1;

    function createPlane1(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = depth;
      return new p5.Vector(x, y, z);
    }
    function createPlane2(u, v){
      var x = 2 * width * u - width;
      var y = 2 * height * v - height;
      var z = -depth;
      return new p5.Vector(x, y, z);
    }
    function createPlane3(u, v){
      var x = 2 * width * u - width;
      var y = height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    }
    function createPlane4(u, v){
      var x = 2 * width * u - width;
      var y = -height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    }
    function createPlane5(u, v){
      var x = width;
      var y = 2 * height * u - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    }
    function createPlane6(u, v){
      var x = -width;
      var y = 2 * height * u - height;
      var z = 2 * depth * v - depth;
      return new p5.Vector(x, y, z);
    }
    
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

    this._graphics.drawGeometry(obj);

  };

  return p5;

});