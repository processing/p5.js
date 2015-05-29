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

    this._graphics.drawGeometry(_flatten(this.vertices), _flatten(this.faces));
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

    //@TODO: figure out a better way to this
    //other than do it 6 times
    
    for (var y1 = 0; y1 <= detailY; y1++) {
      var t1 = y1 / detailY;
      for (var x1 = 0; x1 <= detailX; x1++) {
        var s1 = x1 / detailX;
        this.vertices.push([
          2 * width * s1 - width,
          2 * height * t1 - height,
          depth
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

    var len1 = this.vertices.length;

    for (var y2 = 0; y2 <= detailY; y2++) {
      var t2 = y2 / detailY;
      for (var x2 = 0; x2 <= detailX; x2++) {
        var s2 = x2 / detailX;
        this.vertices.push([
          2 * width * s2 - width,
          2 * height * t2 - height,
          -depth
        ]);

        this.uvs.push([s2, t2]);

        this.faceNormals.push([0, 0, -1]);

        if (x2 < detailX && y2 < detailY) {
          var i2 = x2 + y2 * (detailX + 1) + len1;
          this.faces.push([i2, i2 + 1, i2 + detailX + 1]);
          this.faces.push([i2 + detailX + 1, i2 + 1, i2 + detailX + 2]);
        }
      }
    }

    var len2 = this.vertices.length;

    for (var y3 = 0; y3 <= detailY; y3++) {
      var t3 = y3 / detailY;
      for (var z3 = 0; z3 <= detailZ; z3++) {
        var s3 = z3 / detailZ;
        this.vertices.push([
          width,
          2 * height * t3 - height,
          2 * depth * s3 - depth
        ]);

        this.uvs.push([s3, t3]);

        this.faceNormals.push([1, 0, 0]);

        if (y3 < detailY && z3 < detailZ) {
          var i3 = z3 + y3 * (detailZ + 1) + len2;
          this.faces.push([i3, i3 + 1, i3 + detailZ + 1]);
          this.faces.push([i3 + detailZ + 1, i3 + 1, i3 + detailZ + 2]);
        }
      }
    }

    var len3 = this.vertices.length;

    for (var y4 = 0; y4 <= detailY; y4++) {
      var t4 = y4 / detailY;
      for (var z4 = 0; z4 <= detailZ; z4++) {
        var s4 = z4 / detailZ;
        this.vertices.push([
          -width,
          2 * height * t4 - height,
          2 * depth * s4 - depth
        ]);

        this.uvs.push([s4, t4]);

        this.faceNormals.push([-1, 0, 0]);

        if (y4 < detailY && z4 < detailZ) {
          var i4 = z4 + y4 * (detailZ + 1) + len3;
          this.faces.push([i4, i4 + 1, i4 + detailZ + 1]);
          this.faces.push([i4 + detailZ + 1, i4 + 1, i4 + detailZ + 2]);
        }
      }
    }

    var len4 = this.vertices.length;

    for (var x5 = 0; x5 <= detailX; x5++) {
      var t5 = x5 / detailX;
      for (var z5 = 0; z5 <= detailZ; z5++) {
        var s5 = z5 / detailZ;
        this.vertices.push([
          2 * width * s5 - width,
          height,
          2 * depth * t5 - depth
        ]);

        this.uvs.push([s5, t5]);

        this.faceNormals.push([0, 1, 0]);

        if (x5 < detailX && z5 < detailZ) {
          var i5 = z5 + x5 * (detailZ + 1) + len4;
          this.faces.push([i5, i5 + 1, i5 + detailZ + 1]);
          this.faces.push([i5 + detailZ + 1, i5 + 1, i5 + detailZ + 2]);
        }
      }
    }

    var len5 = this.vertices.length;

    for (var x6 = 0; x6 <= detailX; x6++) {
      var t6 = x6 / detailX;
      for (var z6 = 0; z6 <= detailZ; z6++) {
        var s6 = z6 / detailZ;
        this.vertices.push([
          2 * width * s6 - width,
          -height,
          2 * depth * t6 - depth
        ]);

        this.uvs.push([s6, t6]);

        this.faceNormals.push([0, -1, 0]);

        if (x6 < detailX && z6 < detailZ) {
          var i6 = z6 + x6 * (detailZ + 1) + len5;
          this.faces.push([i6, i6 + 1, i6 + detailZ + 1]);
          this.faces.push([i6 + detailZ + 1, i6 + 1, i6 + detailZ + 2]);
        }
      }
    }

    this._graphics.drawGeometry(_flatten(this.vertices), _flatten(this.faces));
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
  
  //inspired by three.js SphereGeometry.js
  p5.prototype.sphere = function(radius, detailX, detailY) {

    p5.prototype.Geometry3D.call(this);

    radius = radius || 50;
    detailX = Math.max( 2, Math.floor( detailX ) || 6 );
    detailY = Math.max( 2, Math.floor( detailY ) || 6 );

    var x, y;
    var verticesArr = [];
    // var uvsArr = [];

    for(y = 0; y <= detailY; y++){

      var verticesRow = [];
      // var uvsRow = [];

      for(x = 0; x <= detailX; x++){

        var u = x / detailX;
        var v = y / detailY;

        var phi = Math.PI * 2 * u;
        var theta = Math.PI * v;

        var a = -radius * Math.cos( phi ) * Math.sin( theta );
        var b = radius * Math.cos( theta );
        var c = radius * Math.sin( phi ) * Math.sin( theta );
        
        this.vertices.push([a, b, c]);

        verticesRow.push(this.vertices.length - 1);
        //uvsRow.push([u, 1 - v]);
      }

      verticesArr.push(verticesRow);
      //uvsArr.push(uvsRow);

    }

    for (y = 0; y < detailY; y++) {

      for (x = 0; x < detailX; x++) {

        var v1 = verticesArr[ y ][ x + 1 ];
        var v2 = verticesArr[ y ][ x ];
        var v3 = verticesArr[ y + 1 ][ x ];
        var v4 = verticesArr[ y + 1 ][ x + 1 ];

        // var n1 = this.vertices[ v1 ].clone().normalize();
        // var n2 = this.vertices[ v2 ].clone().normalize();
        // var n3 = this.vertices[ v3 ].clone().normalize();
        // var n4 = this.vertices[ v4 ].clone().normalize();

        // var uv1 = uvs[ y ][ x + 1 ].clone();
        // var uv2 = uvs[ y ][ x ].clone();
        // var uv3 = uvs[ y + 1 ][ x ].clone();
        // var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

        if (Math.abs( this.vertices[ v1 ][2] ) === radius) {
          this.faces.push([v1, v3, v4]);
          //this.normals.push([ n1, n3, n4 ]);
          //this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

        } else if ( Math.abs( this.vertices[ v3 ][2] ) === radius) {
          this.faces.push([v1, v2, v3]);
          //this.normals.push([ n1, n2, n3 ]);
          //this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

        } else {

          this.faces.push([v1, v2, v4]);
          this.faces.push([v2, v3, v4]);
          //this.normals.push([ n2.clone(), n3, n4.clone() ]);
          //this.faceVertexUvs[ 0 ].push( uv2.clone(), uv3, uv4.clone()] );
        }

      }
    }

    this._graphics.drawGeometry(_flatten(this.vertices), _flatten(this.faces));
    return this;
  };

  function _flatten(arrs){
    return arrs.reduce(function(a, b){
      return a.concat(b);
    });
  }

  return p5;
});