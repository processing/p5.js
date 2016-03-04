/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 * @todo complex geometries currently fail test
 * because of face index calculation.  This affects the following primitives:
 * box, cone, cylinder
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
        }
      }
    };
    var planeGeom =
    new p5.Geometry(_plane, detailX, detailY, function(){
      this.computeFaces().computeNormals().computeUVs();
    });
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

  width = width || 50;
  height = height || width;
  depth = depth || width;

  var detailX = typeof arguments[3] === Number ? arguments[3] : 4;
  var detailY = typeof arguments[4] === Number ? arguments[4] : 4;
  var gId = 'box|'+width+'|'+height+'|'+depth+'|'+detailX+'|'+detailY;

  if(!this._renderer.geometryInHash(gId)){
    var _box = {};
    var faces = [];
    var cubeData = [
      [0, 4, 2, 6],// -1, 0, 0],// -x
      [1, 3, 5, 7],// +1, 0, 0],// +x
      [0, 1, 4, 5],// 0, -1, 0],// -y
      [2, 6, 3, 7],// 0, +1, 0],// +y
      [0, 2, 1, 3],// 0, 0, -1],// -z
      [4, 5, 6, 7]// 0, 0, +1] // +z
    ];
    //inspired by lightgl:
    //https://github.com/evanw/lightgl.js
    //octants:https://en.wikipedia.org/wiki/Octant_(solid_geometry)
    var pickOctant = function(i) {
      return new p5.Vector(((i & 1) * 2 - 1)*width/2,
        ((i & 2) - 1) *height/2,
        ((i & 4) / 2 - 1) * depth/2);
    };
    var id=0;
    for (var i = 0; i < cubeData.length; i++) {
      var data = cubeData[i];
      var v = i * 4;
      for (var j = 0; j < 4; j++) {
        var d = data[j];
        _box[id] = pickOctant(d);
        //if (mesh.coords) mesh.coords.push([j & 1, (j & 2) / 2]);
        //if (mesh.normals) mesh.normals.push(data.slice(4, 7));
        id++;
      }
      faces.push([v, v + 1, v + 2]);
      faces.push([v + 2, v + 1, v + 3]);
    }
    var boxGeom = new p5.Geometry(
      _box,
      detailX,
      detailY,
      function(){
        this.faces = faces;
        this.computeNormals().computeUVs();
      }
    );
    //initialize our geometry buffer with
    //the key val pair:
    //geometry Id, Geom object
    this._renderer.createBuffers(gId, boxGeom);
  }
  this._renderer.drawBuffers(gId);

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
        }
      }
    };
    var sphereGeom = new p5.Geometry(_sphere, detailX, detailY,
      function(){
        this.computeFaces().computeNormals().computeUVs();
      }
    );
    //for spheres we need to average the normals
    //and poles
    sphereGeom.averageNormals().averagePoleNormals();
    this._renderer.createBuffers(gId, sphereGeom);
  }

  this._renderer.drawBuffers(gId);

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
      side: function(){
        var u,v,p;
        for (var i = 0; i <= this.detailY; i++){
          v = i / this.detailY;
          for (var j = 0; j <= this.detailX; j++){
            u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            var x = radius * Math.sin(theta);
            var y = 2 * height * v - height;
            var z = radius * Math.cos(theta);
            p = new p5.Vector(x,y,z);
            this.vertices.push(p);
          }
        }
      },
      top: function(){
        var u,v,p;
        for (var i = 0; i <= this.detailY; i++){
          v = i / this.detailY;
          for (var j = 0; j <= this.detailX; j++){
            u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            if(v === 0){
              p = new p5.Vector(0, height, 0);
            }else{
              var x = radius * Math.sin(-theta);
              var y = height;
              var z = radius * Math.cos(theta);
              p = new p5.Vector(x,y,z);
            }
            this.vertices.push(p);
          }
        }
      },
      bottom: function(){
        var u,v,p;
        for (var i = 0; i <= this.detailY; i++){
          v = i / this.detailY;
          for (var j = 0; j <= this.detailX; j++){
            u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            if(v === 0){
              p = new p5.Vector(0, -height, 0);
            }else{
              var x = radius * Math.sin(theta);
              var y = -height;
              var z = radius * Math.cos(theta);
              p = new p5.Vector(x,y,z);
            }
            this.vertices.push(p);
          }
        }
      }
    };
    var cylinderGeom = new p5.Geometry(_cylinder, detailX, detailY,
      function(){
        this.computeFaces().computeNormals().computeUVs();
      }
    );
    //for cylinders we need to average normals
    cylinderGeom.averageNormals();
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
      side: function(){
        var u,v,p;
        for (var i = 0; i <= this.detailY; i++){
          v = i / this.detailY;
          for (var j = 0; j <= this.detailX; j++){
            u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            var x = radius * (1 - v) * Math.sin(theta);
            var y = 2 * height * v - height;
            var z = radius * (1 - v) * Math.cos(theta);
            p = new p5.Vector(x,y,z);
            this.vertices.push(p);
          }
        }
      },
      bottom: function(){
        var u,v,p;
        for (var i = 0; i <= this.detailY; i++){
          v = i / this.detailY;
          for (var j = 0; j <= this.detailX; j++){
            u = j / this.detailX;
            var theta = 2 * Math.PI * u;
            var x = radius * (1 - v) * Math.sin(-theta);
            var y = -height;
            var z = radius * (1 - v) * Math.cos(theta);
            p = new p5.Vector(x,y,z);
            this.vertices.push(p);
          }
        }
      }
    };
    var _createCone = function (){

    };
    var coneGeom =
    new p5.Geometry(_createCone,
      detailX, detailY//,
      // function(){
      //   this.computeFaces().computeNormals().computeUVs();
      // }
    );
    //for cones we need to average Normals
    // coneGeom.averageNormals();
    this._renderer.createBuffers(gId, coneGeom);
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
   * @param {number} radialSubdivisions The number of subdivisions around the
   *     truncated cone.
   * @param {number} verticalSubdivisions The number of subdivisions down the
   *     truncated cone.
   * @param {boolean} [opt_topCap] Create top cap. Default = true.
   * @param {boolean} [opt_bottomCap] Create bottom cap. Default =
   *        true.
   * @return {Object.<string, TypedArray>} The
   *         created plane vertices.
   * @memberOf module:primitives
   */
  function createTruncatedConeVertices(
      bottomRadius,
      topRadius,
      height,
      radialSubdivisions,
      verticalSubdivisions,
      opt_topCap,
      opt_bottomCap) {
    if (radialSubdivisions < 3) {
      throw Error('radialSubdivisions must be 3 or greater');
    }

    if (verticalSubdivisions < 1) {
      throw Error('verticalSubdivisions must be 1 or greater');
    }

    var topCap = (opt_topCap === undefined) ? true : opt_topCap;
    var bottomCap = (opt_bottomCap === undefined) ? true : opt_bottomCap;

    var extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

    var vertsAroundEdge = radialSubdivisions + 1;

    // The slant of the cone is constant across its surface
    var slant = Math.atan2(bottomRadius - topRadius, height);
    var start = topCap ? -2 : 0;
    var end = verticalSubdivisions + (bottomCap ? 2 : 0);
    var yy, ii;//@TODO
    for (yy = start; yy <= end; ++yy) {
      var v = yy / verticalSubdivisions;
      var y = height * v;
      var ringRadius;
      if (yy < 0) {
        y = 0;
        v = 1;
        ringRadius = bottomRadius;
      } else if (yy > verticalSubdivisions) {
        y = height;
        v = 1;
        ringRadius = topRadius;
      } else {
        ringRadius = bottomRadius +
          (topRadius - bottomRadius) * (yy / verticalSubdivisions);
      }
      if (yy === -2 || yy === verticalSubdivisions + 2) {
        ringRadius = 0;
        v = 0;
      }
      y -= height / 2;
      for (ii = 0; ii < vertsAroundEdge; ++ii) {
        this.vertices.push(
          new p5.Vector(
            Math.sin(ii * Math.PI * 2 / radialSubdivisions) * ringRadius,
            y,
            Math.cos(ii * Math.PI * 2 / radialSubdivisions) * ringRadius)
          );
        //VERTEX NORMALS
        this.vertexNormals.push(
          new p5.Vector(
            (yy < 0 || yy > verticalSubdivisions) ? 0 :
            (Math.sin(ii * Math.PI * 2 / radialSubdivisions) * Math.cos(slant)),
            (yy < 0) ? -1 : (yy > verticalSubdivisions ? 1 : Math.sin(slant)),
            (yy < 0 || yy > verticalSubdivisions) ? 0 :
            (Math.cos(ii * Math.PI * 2 / radialSubdivisions) * Math.cos(slant)))
          );
        this.uvs.push([(ii / radialSubdivisions), 1 - v]);
      }
    }
    for (yy = 0; yy < verticalSubdivisions + extra; ++yy) {
      for (ii = 0; ii < radialSubdivisions; ++ii) {
        this.faces.push([vertsAroundEdge * (yy + 0) + 0 + ii,
          vertsAroundEdge * (yy + 0) + 1 + ii,
          vertsAroundEdge * (yy + 1) + 1 + ii]);
        this.faces.push([vertsAroundEdge * (yy + 0) + 0 + ii,
          vertsAroundEdge * (yy + 1) + 1 + ii,
          vertsAroundEdge * (yy + 1) + 0 + ii]);
      }
    }
  }

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
function(radiusx, radiusy, radiusz, detail){

  radiusx = radiusx || 50;
  radiusy = radiusy || 50;
  radiusz = radiusz || 50;

  var detailX = detail || 24;
  var detailY = detail || 24;

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
        }
      }
    };
    var ellipsoidGeom = new p5.Geometry(_ellipsoid, detailX, detailY,
      function(){
        this.computeFaces().computeNormals().computeUVs();
      });
    ellipsoidGeom.averageNormals().averagePoleNormals();
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
p5.prototype.torus = function(radius, tubeRadius, detail){

  radius = radius || 50;
  tubeRadius = tubeRadius || 10;

  var detailX = detail || 24;
  var detailY = detail || 16;

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
        }
      }
    };
    var torusGeom =
    new p5.Geometry(_torus, detailX, detailY,
      function(){
        this.computeFaces().computeNormals().computeUVs();
      }
    );
    //for torus we need to average normals
    torusGeom.averageNormals();
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

p5.Renderer3D.prototype.line = function(x1, y1, z1, x2, y2, z2){
  var gId = 'line|'+x1+'|'+y1+'|'+z1+'|'+x2+'|'+y2+'|'+z2;
  if(!this.geometryInHash(gId)){
    var _line = {
      start: new p5.Vector(x1,y1,z1),
      end: new p5.Vector(x2,y2,z2)
    };
    //starting point
    var lineGeom = new p5.Geometry(_line);
    this.createBuffers(gId, lineGeom);
  }

  this.drawBuffers(gId);
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
    var triGeom =
    new p5.Geometry(_triangle,1,1,
      function(){
        this.faces = [[0,1,2]];
        this.computeNormals().computeUVs();
      }
    );
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
    var _ellipse = function(){
      var u,v,p;
      for (var i = 0; i <= this.detailY; i++){
        v = i / this.detailY;
        for (var j = 0; j <= this.detailX; j++){
          u = j / this.detailX;
          var theta = 2 * Math.PI * u;
          if(v === 0){
            p = new p5.Vector(args[0], args[1], args[2]);
          }
          else{
            var x = args[0] + args[3] * Math.sin(theta);
            var y = args[1] + args[4] * Math.cos(theta);
            var z = args[2];
            p = new p5.Vector(x, y, z);
          }
          this.vertices.push(p);
        }
      }
    };
    var ellipseGeom =
    new p5.Geometry(_ellipse,detailX,detailY,function(){
      this.computeFaces().computeNormals().computeUVs();
    });
    this.createBuffers(gId, ellipseGeom);
  }
  this.drawBuffers(gId);
  return this;
};
/**
 * Draws a Rectangle.
 * @type {p5.Renderer3D} the Renderer3D object
 */
p5.Renderer3D.prototype.rect = function
(x, y, z, width,height){
  var x2 = x;
  var y2 = y + height;
  var x3 = x + width;
  var y3 = y + height;
  var x4 = x + width;
  var y4 = y;
  this.quad(x,y,z,x2,y2,z,x3,y3,z,x4,y4,z);
  return this;
};

/**
 * [quad description]
 * @type {[type]}
 * @todo currently buggy, due to vertex winding
 */
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
    var quadGeom =
    new p5.Geometry(_quad,1,1,function(){
      this.faces = [[0,1,2],[2,3,1]];
      this.computeNormals().computeUVs();
    });
    this.createBuffers(gId, quadGeom);
  }
  this.drawBuffers(gId);
  return this;
};

module.exports = p5;