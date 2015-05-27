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

  var p5 = require('core');

  //@TODO fill with 3d primitives
  //inspire by lightgl.js 
  //https://github.com/evanw/lightgl.js
  p5.prototype.Geometry3D = function() {
    this.vertices = [];
    this.faces = [];
    this.faceNormals = [];
    this.uvs = [];
  };

  /**
   * generate plane geomery
   * @param  {Number} width   the width of the plane
   * @param  {Number} height  the height of the plane
   * @param  {Number} detailX how many segments in the x axis
   * @param  {Number} detailY how many segments in the y axis
   * @return {[type]}         [description]        
   */
  p5.prototype.plane = function(width, height, detailX, detailY) {

    p5.prototype.Geometry3D.call(this);

    width = width || 1;
    height = height || 1;

    detailX = detailX || 1;
    detailY = detailY || 1;

    for (var y = 0; y <= detailY; y++) {
      var t = y / detailY;
      for (var x = 0; x <= detailX; x++) {
        var s = x / detailX;
        this.vertices.push([
          2 * width * s - width,
          2 * height * t - height,
          0
        ]);

        this.uvs.push([s, t]);

        this.faceNormals.push([0, 0, 1]);

        if (x < detailX && y < detailY) {
          var i = x + y * (detailX + 1);
          this.faces.push([i, i + 1, i + detailX + 1]);
          this.faces.push([i + detailX + 1, i + 1, i + detailX + 2]);
        }
      }
    }

    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };

  /**
   * generate cube geometry
   * @param  {Number} width   the width of the cube
   * @param  {Number} height  the height of the cube
   * @param  {Number} depth   the depth of the cube
   * @param  {Number} detailX how many segments in the x axis
   * @param  {Number} detailY how many segments in the y axis
   * @param  {Number} detailZ how many segments in the z axis
   * @return {[type]}         [description]
   */
  p5.prototype.cube =
  function(width, height, depth, detailX, detailY, detailZ) {

    p5.prototype.Geometry3D.call(this);

    width = width || 1;
    height = height || 1;
    depth = depth || 1;

    detailX = detailX || 1;
    detailY = detailY || 1;
    detailZ = detailZ || 1;

    //@TODO: figure out a better way to generate 6 faces
    
    for (var y1 = 0; y1 <= detailY; y1++) {
      var t1 = y1 / detailY;
      for (var x1 = 0; x1 <= detailX; x1++) {
        var s1 = x1 / detailX;
        this.vertices.push([
          2 * width * s1 - width,
          2 * height * t1 - height,
          depth / 2
        ]);

        this.uvs.push([s1, t1]);

        this.faceNormals.push([0, 0, 1]);

        if (x1 < detailX && y1 < detailY) {
          var i1 = x1 + y1 * (detailX + 1);
          this.faces.push([i1, i1 + 1, i1 + detailX + 1]);
          this.faces.push([i1 + detailX + 1, i1 + 1, i1 + detailX + 2]);
        }
      }
    }

    for (var y2 = 0; y2 <= detailY; y2++) {
      var t2 = y2 / detailY;
      for (var x2 = 0; x2 <= detailX; x2++) {
        var s2 = x2 / detailX;
        this.vertices.push([
          2 * width * s2 - width,
          2 * height * t2 - height,
          -depth / 2
        ]);

        this.uvs.push([s2, t2]);

        this.faceNormals.push([0, 0, -1]);

        if (x2 < detailX && y2 < detailY) {
          var i2 = x2 + y2 * (detailX + 1);
          this.faces.push([i2, i2 + 1, i2 + detailX + 1]);
          this.faces.push([i2 + detailX + 1, i2 + 1, i2 + detailX + 2]);
        }
      }
    }


    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };

  /**
   * generate sphere geometry
   * @param  {Number} radius  the radius of the sphere
   * @param  {Number} detailX how many segments in the x axis
   * @param  {Number} detailY how many segments in the y axis
   * @param  {Number} detailZ how many segments in the z axis
   * @return {[type]}         [description]
   */
  p5.prototype.sphere = function(radius, detailX, detailY, detalZ) {

    p5.prototype.Geometry3D.call(this);

    radius = radius || 6;
    detailX = detailX || 1;
    detailY = detailY || 1;

    //@TODO: figure out how to generate vertices
    var vertices = verticesArray(this.faces, this.vertices);
    this._graphics.drawGeometry(vertices);
    return this;
  };

  /**
   * get vertices array according to the faces array
   * @param {Array} faces    the faces array
   * @param {Array} vertices the vertex array
   */
  function verticesArray(faces, vertices) {
    var output = [];
    faces.forEach(function(face) {
      face.forEach(function(index) {
        vertices[index].forEach(function(vertex) {
          output.push(vertex);
        });
      });
    });
    return output;
  }

  return p5;
});