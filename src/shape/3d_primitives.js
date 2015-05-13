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

  // p5.prototype.geometry = function() {
  //   this.vertices = [];
  //   this.triangle = [];
  //   this.addVertexBuffer = function(name, attribute){

  //   };
  //   this.addIndexBuffer = function(name){

  //   },
  //   this.complie = function(){

  //   };
  // };

  // //@TODO fill with 3d primitives
  // p5.prototype.plane = function(detailY, detailX) {
  //   p5.prototype.geometry.call(this);
  //   for (var y = 0; y <= detailY; y++) {
  //     var t = y / detailY;
  //     for (var x = 0; x <= detailX; x++) {
  //       var s = x / detailX;
  //       this.vertices.push([2 * s - 1, 2 * t - 1, 0]);
  //       if (x < detailX && y < detailY) {
  //         var i = x + y * (detailX + 1);
  //         this.triangles.push([i, i + 1, i + detailX + 1]);
  //         this.triangles.push([i + detailX + 1, i + 1, i + detailX + 2]);
  //       }
  //     }
  //   }
  //   return this;
  // };

  // p5.prototype.sphere = function(radius, widthSegment, HeightSegment) {
  //   var radius = radius;
  //   widthSegment = widthSegment || 6;
  //   widthSegment = widthSegment || 6;
  //   //[0,1]???
  //   for(){
  //     for(){

  //     }
  //   }
  // };

  return p5;
});