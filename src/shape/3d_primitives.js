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

  //inspire by lightgl.js 
  //https://github.com/evanw/lightgl.js
  p5.prototype.Geometry3D = function () {
    this.vertices = [];
    this.faces = [];
    this.faceNormals = [];
    this.uvs = [];
  };

  /**
   * [plane description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   * @example
   * <div>
   * <code>
   * plane(5);
   * plane(20, 10);
   * </code>
   * </div>
   */
  p5.prototype.plane = function (width, height, detailX, detailY) {

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

    var vertices = VerticesArray(this.faces, this.vertices);
    this._graphics.plane(vertices);
    return this;
  };

  /**
   * [cube description]
   * @return {[type]} [description]
   */
  p5.prototype.cube = function (
    width, height, depth,
    detailX, detailY, detailZ) {

    p5.prototype.Geometry3D.call(this);

    // width = width || 1;
    // height = height || 1;
    // depth = depth || 1;

    // detailX = detailX || 1;
    // detailY = detailY || 1;
    // detailZ = detailZ || 1;

    // for (var y1 = 0; y1 <= detailY; y1++) {
    //   var t1 = y1 / detailY;
    //   for (var x1 = 0; x1 <= detailX; x1++) {
    //     var s1 = x1 / detailX;
    //     this.vertices.push([
    //       2 * width * s1 - width,
    //       2 * height * t1 - height,
    //       depth / 2
    //     ]);

    //     this.uvs.push([s1, t1]);

    //     this.faceNormals.push([0, 0, 1]);

    //     if (x1 < detailX && y1 < detailY) {
    //       var i1 = x1 + y1 * (detailX + 1);
    //       this.faces.push([i1, i1 + 1, i1 + detailX + 1]);
    //       this.faces.push([i1 + detailX + 1, i1 + 1, i1 + detailX + 2]);
    //     }
    //   }
    // }

    // for (var y2 = 0; y2 <= detailY; y2++) {
    //   var t2 = y2 / detailY;
    //   for (var x2 = 0; x2 <= detailX; x2++) {
    //     var s2 = x2 / detailX;
    //     this.vertices.push([
    //       2 * width * s2 - width,
    //       2 * height * t2 - height,
    //       -depth / 2
    //     ]);

    //     this.uvs.push([s2, t2]);

    //     this.faceNormals.push([0, 0, -1]);

    //     if (x2 < detailX && y2 < detailY) {
    //       var i2 = x2 + y2 * (detailX + 1);
    //       this.faces.push([i2, i2 + 1, i2 + detailX + 1]);
    //       this.faces.push([i2 + detailX + 1, i2 + 1, i2 + detailX + 2]);
    //     }
    //   }
    // }

    // for (var y3 = 0; y3 <= detailY; y3++) {
    //   var t3 = y3 / detailY;
    //   for (var z3 = 0; z3 <= detailZ; z3++) {
    //     var s3 = z3 / detailZ;
    //     this.vertices.push([
    //       width / 2,
    //       2 * height * t3 - height,
    //       2 * depth * s3 - depth,
    //     ]);

    //     this.uvs.push([s3, t3]);

    //     this.faceNormals.push([1, 0, 0]);

    //     if (y3 < detailY && z3 < detailZ) {
    //       var i3 = y3 + z3 * (detailY + 1);
    //       this.faces.push([i3, i3 + 1, i3 + detailY + 1]);
    //       this.faces.push([i3 + detailY + 1, i3 + 1, i3 + detailY + 2]);
    //     }
    //   }
    // }

    // for (var y4 = 0; y4 <= detailY; y4++) {
    //   var t4 = y4 / detailY;
    //   for (var z4 = 0; z4 <= detailZ; z4++) {
    //     var s4 = z4 / detailZ;
    //     this.vertices.push([
    //       -width / 2,
    //       2 * height * t4 - height,
    //       2 * depth * s4 - depth,
    //     ]);

    //     this.uvs.push([s4, t4]);

    //     this.faceNormals.push([-1, 0, 0]);

    //     if (y4 < detailY && z4 < detailZ) {
    //       var i4 = y4 + z4 * (detailY + 1);
    //       this.faces.push([i4, i4 + 1, i4 + detailY + 1]);
    //       this.faces.push([i4 + detailY + 1, i4 + 1, i4 + detailY + 2]);
    //     }
    //   }
    // }

    var vertices = VerticesArray(this.faces, this.vertices);
    this._graphics.cube(vertices);
    return this;
  };

  /**
   * [sphere description]
   * @return {[type]} [description]
   */
  p5.prototype.sphere = function (radius, detailX, detailY) {

    p5.prototype.Geometry3D.call(this);

    radius = radius || 6;
    detailX = detailX || 1;
    detailY = detailY || 1;

    //this._graphics.sphere();
    return this;
  };

  /**
   * get vertices array according to the faces array
   * then send the vertices array to the buffer
   * @param {[type]} faces    [description]
   * @param {[type]} vertices [description]
   */
  function VerticesArray(faces, vertices) {
    var output = [];
    faces.forEach(function (face) {
      face.forEach(function (index) {
        vertices[index].forEach(function (vertice) {
          output.push(vertice);
        });
      });
    });
    return output;
  }

  return p5;
});