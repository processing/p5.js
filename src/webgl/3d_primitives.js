/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

import p5 from '../core/main';
import './p5.Geometry';
import * as constants from '../core/constants';

/**
 * Starts creating a new p5.Geometry. Subsequent shapes drawn will be added
 * to the geometry and then returned when
 * <a href="#/p5/endGeometry">endGeometry()</a> is called. One can also use
 * <a href="#/p5/buildGeometry">buildGeometry()</a> to pass a function that
 * draws shapes.
 *
 * If you need to draw complex shapes every frame which don't change over time,
 * combining them upfront with `beginGeometry()` and `endGeometry()` and then
 * drawing that will run faster than repeatedly drawing the individual pieces.
 *
 * @method beginGeometry
 *
 * @example
 * <div>
 * <code>
 * let shapes;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   makeShapes();
 * }
 *
 * function makeShapes() {
 *   beginGeometry();
 *   scale(0.18);
 *
 *   push();
 *   translate(100, -50);
 *   scale(0.5);
 *   rotateX(PI/4);
 *   cone();
 *   pop();
 *   cone();
 *
 *   beginShape();
 *   vertex(-20, -50);
 *   quadraticVertex(
 *     -40, -70,
 *     0, -60
 *   );
 *   endShape();
 *
 *   beginShape(TRIANGLE_STRIP);
 *   for (let y = 20; y <= 60; y += 10) {
 *     for (let x of [20, 60]) {
 *       vertex(x, y);
 *     }
 *   }
 *   endShape();
 *
 *   beginShape();
 *   vertex(-100, -120);
 *   vertex(-120, -110);
 *   vertex(-105, -100);
 *   endShape();
 *
 *   shapes = endGeometry();
 * }
 *
 * function draw() {
 *   background(255);
 *   lights();
 *   orbitControl();
 *   model(shapes);
 * }
 * </code>
 * </div>
 *
 * @alt
 * A series of different flat, curved, and 3D shapes floating in space.
 */
p5.prototype.beginGeometry = function() {
  return this._renderer.beginGeometry();
};

/**
 * Finishes creating a new <a href="#/p5.Geometry">p5.Geometry</a> that was
 * started using <a href="#/p5/beginGeometry">beginGeometry()</a>. One can also
 * use <a href="#/p5/buildGeometry">buildGeometry()</a> to pass a function that
 * draws shapes.
 *
 * @method endGeometry
 * @returns {p5.Geometry} The model that was built.
 */
p5.prototype.endGeometry = function() {
  return this._renderer.endGeometry();
};

/**
 * Creates a new <a href="#/p5.Geometry">p5.Geometry</a> that contains all
 * the shapes drawn in a provided callback function. The returned combined shape
 * can then be drawn all at once using <a href="#/p5/model">model()</a>.
 *
 * If you need to draw complex shapes every frame which don't change over time,
 * combining them with `buildGeometry()` once and then drawing that will run
 * faster than repeatedly drawing the individual pieces.
 *
 * One can also draw shapes directly between
 * <a href="#/p5/beginGeometry">beginGeometry()</a> and
 * <a href="#/p5/endGeometry">endGeometry()</a> instead of using a callback
 * function.
 *
 * @method buildGeometry
 * @param {Function} callback A function that draws shapes.
 * @returns {p5.Geometry} The model that was built from the callback function.
 *
 * @example
 * <div>
 * <code>
 * let particles;
 * let button;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   button = createButton('New');
 *   button.mousePressed(makeParticles);
 *   makeParticles();
 * }
 *
 * function makeParticles() {
 *   if (particles) freeGeometry(particles);
 *
 *   particles = buildGeometry(() => {
 *     for (let i = 0; i < 60; i++) {
 *       push();
 *       translate(
 *         randomGaussian(0, 20),
 *         randomGaussian(0, 20),
 *         randomGaussian(0, 20)
 *       );
 *       sphere(5);
 *       pop();
 *     }
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   noStroke();
 *   lights();
 *   orbitControl();
 *   model(particles);
 * }
 * </code>
 * </div>
 *
 * @alt
 * A cluster of spheres.
 */
p5.prototype.buildGeometry = function(callback) {
  return this._renderer.buildGeometry(callback);
};

/**
 * Clears the resources of a model to free up browser memory. A model whose
 * resources have been cleared can still be drawn, but the first time it is
 * drawn again, it might take longer.
 *
 * This method works on models generated with
 * <a href="#/p5/buildGeometry">buildGeometry()</a> as well as those loaded
 * from <a href="#/p5/loadModel">loadModel()</a>.
 *
 * @method freeGeometry
 * @param {p5.Geometry} geometry The geometry whose resources should be freed
 */
p5.prototype.freeGeometry = function(geometry) {
  this._renderer._freeBuffers(geometry.gid);
};

/**
 * Draw a plane with given a width and height
 * @method plane
 * @param  {Number} [width]    width of the plane
 * @param  {Number} [height]   height of the plane
 * @param  {Integer} [detailX]  Optional number of triangle
 *                             subdivisions in x-dimension
 * @param {Integer} [detailY]   Optional number of triangle
 *                             subdivisions in y-dimension
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a plane
 * // with width 50 and height 50
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('a white plane with black wireframe lines');
 * }
 *
 * function draw() {
 *   background(200);
 *   plane(50, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Nothing displayed on canvas
 * Rotating interior view of a box with sides that change color.
 * 3d red and green gradient.
 * Rotating interior view of a cylinder with sides that change color.
 * Rotating view of a cylinder with sides that change color.
 * 3d red and green gradient.
 * rotating view of a multi-colored cylinder with concave sides.
 */
p5.prototype.plane = function(
  width = 50,
  height = width,
  detailX = 1,
  detailY = 1
) {
  this._assert3d('plane');
  p5._validateParameters('plane', arguments);

  const gId = `plane|${detailX}|${detailY}`;

  if (!this._renderer.geometryInHash(gId)) {
    const _plane = function() {
      let u, v, p;
      for (let i = 0; i <= this.detailY; i++) {
        v = i / this.detailY;
        for (let j = 0; j <= this.detailX; j++) {
          u = j / this.detailX;
          p = new p5.Vector(u - 0.5, v - 0.5, 0);
          this.vertices.push(p);
          this.uvs.push(u, v);
        }
      }
    };
    const planeGeom = new p5.Geometry(detailX, detailY, _plane);
    planeGeom.computeFaces().computeNormals();
    if (detailX <= 1 && detailY <= 1) {
      planeGeom._makeTriangleEdges()._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw stroke on plane objects with more' +
        ' than 1 detailX or 1 detailY'
      );
    }
    this._renderer.createBuffers(gId, planeGeom);
  }

  this._renderer.drawBuffersScaled(gId, width, height, 1);
  return this;
};

/**
 * Draw a box with given width, height and depth
 * @method  box
 * @param  {Number} [width]     width of the box
 * @param  {Number} [height]    height of the box
 * @param  {Number} [depth]     depth of the box
 * @param {Integer} [detailX]  Optional number of triangle
 *                            subdivisions in x-dimension
 * @param {Integer} [detailY]  Optional number of triangle
 *                            subdivisions in y-dimension
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a spinning box
 * // with width, height and depth of 50
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   describe('a white box rotating in 3D space');
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(50);
 * }
 * </code>
 * </div>
 */
p5.prototype.box = function(width, height, depth, detailX, detailY) {
  this._assert3d('box');
  p5._validateParameters('box', arguments);
  if (typeof width === 'undefined') {
    width = 50;
  }
  if (typeof height === 'undefined') {
    height = width;
  }
  if (typeof depth === 'undefined') {
    depth = height;
  }

  const perPixelLighting =
    this._renderer.attributes && this._renderer.attributes.perPixelLighting;
  if (typeof detailX === 'undefined') {
    detailX = perPixelLighting ? 1 : 4;
  }
  if (typeof detailY === 'undefined') {
    detailY = perPixelLighting ? 1 : 4;
  }

  const gId = `box|${detailX}|${detailY}`;
  if (!this._renderer.geometryInHash(gId)) {
    const _box = function() {
      const cubeIndices = [
        [0, 4, 2, 6], // -1, 0, 0],// -x
        [1, 3, 5, 7], // +1, 0, 0],// +x
        [0, 1, 4, 5], // 0, -1, 0],// -y
        [2, 6, 3, 7], // 0, +1, 0],// +y
        [0, 2, 1, 3], // 0, 0, -1],// -z
        [4, 5, 6, 7] // 0, 0, +1] // +z
      ];
      //using custom edges
      //to avoid diagonal stroke lines across face of box
      this.edges = [
        [0, 1],
        [1, 3],
        [3, 2],
        [6, 7],
        [8, 9],
        [9, 11],
        [14, 15],
        [16, 17],
        [17, 19],
        [18, 19],
        [20, 21],
        [22, 23]
      ];

      cubeIndices.forEach((cubeIndex, i) => {
        const v = i * 4;
        for (let j = 0; j < 4; j++) {
          const d = cubeIndex[j];
          //inspired by lightgl:
          //https://github.com/evanw/lightgl.js
          //octants:https://en.wikipedia.org/wiki/Octant_(solid_geometry)
          const octant = new p5.Vector(
            ((d & 1) * 2 - 1) / 2,
            ((d & 2) - 1) / 2,
            ((d & 4) / 2 - 1) / 2
          );
          this.vertices.push(octant);
          this.uvs.push(j & 1, (j & 2) / 2);
        }
        this.faces.push([v, v + 1, v + 2]);
        this.faces.push([v + 2, v + 1, v + 3]);
      });
    };
    const boxGeom = new p5.Geometry(detailX, detailY, _box);
    boxGeom.computeNormals();
    if (detailX <= 4 && detailY <= 4) {
      boxGeom._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw stroke on box objects with more' +
        ' than 4 detailX or 4 detailY'
      );
    }
    //initialize our geometry buffer with
    //the key val pair:
    //geometry Id, Geom object
    this._renderer.createBuffers(gId, boxGeom);
  }
  this._renderer.drawBuffersScaled(gId, width, height, depth);

  return this;
};

/**
 * Draw a sphere with given radius.
 *
 * DetailX and detailY determines the number of subdivisions in the x-dimension
 * and the y-dimension of a sphere. More subdivisions make the sphere seem
 * smoother. The recommended maximum values are both 24. Using a value greater
 * than 24 may cause a warning or slow down the browser.
 * @method sphere
 * @param  {Number} [radius]          radius of circle
 * @param  {Integer} [detailX]        optional number of subdivisions in x-dimension
 * @param  {Integer} [detailY]        optional number of subdivisions in y-dimension
 *
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a sphere with radius 40
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('a white sphere with black wireframe lines');
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   sphere(40);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * let detailX;
 * // slide to see how detailX works
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailX = createSlider(3, 24, 3);
 *   detailX.position(10, height + 5);
 *   detailX.style('width', '80px');
 *   describe(
 *     'a white sphere with low detail on the x-axis, including a slider to adjust detailX'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateY(millis() / 1000);
 *   sphere(40, detailX.value(), 16);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * let detailY;
 * // slide to see how detailY works
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailY = createSlider(3, 16, 3);
 *   detailY.position(10, height + 5);
 *   detailY.style('width', '80px');
 *   describe(
 *     'a white sphere with low detail on the y-axis, including a slider to adjust detailY'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateY(millis() / 1000);
 *   sphere(40, 16, detailY.value());
 * }
 * </code>
 * </div>
 */
p5.prototype.sphere = function(radius = 50, detailX = 24, detailY = 16) {
  this._assert3d('sphere');
  p5._validateParameters('sphere', arguments);

  this.ellipsoid(radius, radius, radius, detailX, detailY);

  return this;
};

/**
 * @private
 * Helper function for creating both cones and cylinders
 * Will only generate well-defined geometry when bottomRadius, height > 0
 * and topRadius >= 0
 * If topRadius == 0, topCap should be false
 */
const _truncatedCone = function(
  bottomRadius,
  topRadius,
  height,
  detailX,
  detailY,
  bottomCap,
  topCap
) {
  bottomRadius = bottomRadius <= 0 ? 1 : bottomRadius;
  topRadius = topRadius < 0 ? 0 : topRadius;
  height = height <= 0 ? bottomRadius : height;
  detailX = detailX < 3 ? 3 : detailX;
  detailY = detailY < 1 ? 1 : detailY;
  bottomCap = bottomCap === undefined ? true : bottomCap;
  topCap = topCap === undefined ? topRadius !== 0 : topCap;
  const start = bottomCap ? -2 : 0;
  const end = detailY + (topCap ? 2 : 0);
  //ensure constant slant for interior vertex normals
  const slant = Math.atan2(bottomRadius - topRadius, height);
  const sinSlant = Math.sin(slant);
  const cosSlant = Math.cos(slant);
  let yy, ii, jj;
  for (yy = start; yy <= end; ++yy) {
    let v = yy / detailY;
    let y = height * v;
    let ringRadius;
    if (yy < 0) {
      //for the bottomCap edge
      y = 0;
      v = 0;
      ringRadius = bottomRadius;
    } else if (yy > detailY) {
      //for the topCap edge
      y = height;
      v = 1;
      ringRadius = topRadius;
    } else {
      //for the middle
      ringRadius = bottomRadius + (topRadius - bottomRadius) * v;
    }
    if (yy === -2 || yy === detailY + 2) {
      //center of bottom or top caps
      ringRadius = 0;
    }

    y -= height / 2; //shift coordiate origin to the center of object
    for (ii = 0; ii < detailX; ++ii) {
      const u = ii / (detailX - 1);
      const ur = 2 * Math.PI * u;
      const sur = Math.sin(ur);
      const cur = Math.cos(ur);

      //VERTICES
      this.vertices.push(new p5.Vector(sur * ringRadius, y, cur * ringRadius));

      //VERTEX NORMALS
      let vertexNormal;
      if (yy < 0) {
        vertexNormal = new p5.Vector(0, -1, 0);
      } else if (yy > detailY && topRadius) {
        vertexNormal = new p5.Vector(0, 1, 0);
      } else {
        vertexNormal = new p5.Vector(sur * cosSlant, sinSlant, cur * cosSlant);
      }
      this.vertexNormals.push(vertexNormal);
      //UVs
      this.uvs.push(u, v);
    }
  }

  let startIndex = 0;
  if (bottomCap) {
    for (jj = 0; jj < detailX; ++jj) {
      const nextjj = (jj + 1) % detailX;
      this.faces.push([
        startIndex + jj,
        startIndex + detailX + nextjj,
        startIndex + detailX + jj
      ]);
    }
    startIndex += detailX * 2;
  }
  for (yy = 0; yy < detailY; ++yy) {
    for (ii = 0; ii < detailX; ++ii) {
      const nextii = (ii + 1) % detailX;
      this.faces.push([
        startIndex + ii,
        startIndex + nextii,
        startIndex + detailX + nextii
      ]);
      this.faces.push([
        startIndex + ii,
        startIndex + detailX + nextii,
        startIndex + detailX + ii
      ]);
    }
    startIndex += detailX;
  }
  if (topCap) {
    startIndex += detailX;
    for (ii = 0; ii < detailX; ++ii) {
      this.faces.push([
        startIndex + ii,
        startIndex + (ii + 1) % detailX,
        startIndex + detailX
      ]);
    }
  }
};

/**
 * Draw a cylinder with given radius and height
 *
 * DetailX and detailY determines the number of subdivisions in the x-dimension
 * and the y-dimension of a cylinder. More subdivisions make the cylinder seem smoother.
 * The recommended maximum value for detailX is 24. Using a value greater than 24
 * may cause a warning or slow down the browser.
 *
 * @method cylinder
 * @param  {Number}  [radius]    radius of the surface
 * @param  {Number}  [height]    height of the cylinder
 * @param  {Integer} [detailX]   number of subdivisions in x-dimension;
 *                               default is 24
 * @param  {Integer} [detailY]   number of subdivisions in y-dimension;
 *                               default is 1
 * @param  {Boolean} [bottomCap] whether to draw the bottom of the cylinder
 * @param  {Boolean} [topCap]    whether to draw the top of the cylinder
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a spinning cylinder
 * // with radius 20 and height 50
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('a rotating white cylinder');
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateX(frameCount * 0.01);
 *   rotateZ(frameCount * 0.01);
 *   cylinder(20, 50);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailX works
 * let detailX;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailX = createSlider(3, 24, 3);
 *   detailX.position(10, height + 5);
 *   detailX.style('width', '80px');
 *   describe(
 *     'a rotating white cylinder with limited X detail, with a slider that adjusts detailX'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateY(millis() / 1000);
 *   cylinder(20, 75, detailX.value(), 1);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailY works
 * let detailY;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailY = createSlider(1, 16, 1);
 *   detailY.position(10, height + 5);
 *   detailY.style('width', '80px');
 *   describe(
 *     'a rotating white cylinder with limited Y detail, with a slider that adjusts detailY'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateY(millis() / 1000);
 *   cylinder(20, 75, 16, detailY.value());
 * }
 * </code>
 * </div>
 */
p5.prototype.cylinder = function(
  radius = 50,
  height = radius,
  detailX = 24,
  detailY = 1,
  bottomCap = true,
  topCap = true
) {
  this._assert3d('cylinder');
  p5._validateParameters('cylinder', arguments);

  const gId = `cylinder|${detailX}|${detailY}|${bottomCap}|${topCap}`;
  if (!this._renderer.geometryInHash(gId)) {
    const cylinderGeom = new p5.Geometry(detailX, detailY);
    _truncatedCone.call(
      cylinderGeom,
      1,
      1,
      1,
      detailX,
      detailY,
      bottomCap,
      topCap
    );
    // normals are computed in call to _truncatedCone
    if (detailX <= 24 && detailY <= 16) {
      cylinderGeom._makeTriangleEdges()._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw stroke on cylinder objects with more' +
        ' than 24 detailX or 16 detailY'
      );
    }
    this._renderer.createBuffers(gId, cylinderGeom);
  }

  this._renderer.drawBuffersScaled(gId, radius, height, radius);

  return this;
};

/**
 * Draw a cone with given radius and height
 *
 * DetailX and detailY determine the number of subdivisions in the x-dimension and
 * the y-dimension of a cone. More subdivisions make the cone seem smoother. The
 * recommended maximum value for detailX is 24. Using a value greater than 24
 * may cause a warning or slow down the browser.
 * @method cone
 * @param  {Number}  [radius]  radius of the bottom surface
 * @param  {Number}  [height]  height of the cone
 * @param  {Integer} [detailX] number of segments,
 *                             the more segments the smoother geometry
 *                             default is 24
 * @param  {Integer} [detailY] number of segments,
 *                             the more segments the smoother geometry
 *                             default is 1
 * @param  {Boolean} [cap]     whether to draw the base of the cone
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a spinning cone
 * // with radius 40 and height 70
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('a rotating white cone');
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateZ(frameCount * 0.01);
 *   cone(40, 70);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailx works
 * let detailX;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailX = createSlider(3, 16, 3);
 *   detailX.position(10, height + 5);
 *   detailX.style('width', '80px');
 *   describe(
 *     'a rotating white cone with limited X detail, with a slider that adjusts detailX'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   rotateY(millis() / 1000);
 *   cone(30, 65, detailX.value(), 16);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailY works
 * let detailY;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailY = createSlider(3, 16, 3);
 *   detailY.position(10, height + 5);
 *   detailY.style('width', '80px');
 *   describe(
 *     'a rotating white cone with limited Y detail, with a slider that adjusts detailY'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   rotateY(millis() / 1000);
 *   cone(30, 65, 16, detailY.value());
 * }
 * </code>
 * </div>
 */
p5.prototype.cone = function(
  radius = 50,
  height = radius,
  detailX = 24,
  detailY = 1,
  cap = true
) {
  this._assert3d('cone');
  p5._validateParameters('cone', arguments);

  const gId = `cone|${detailX}|${detailY}|${cap}`;
  if (!this._renderer.geometryInHash(gId)) {
    const coneGeom = new p5.Geometry(detailX, detailY);
    _truncatedCone.call(coneGeom, 1, 0, 1, detailX, detailY, cap, false);
    if (detailX <= 24 && detailY <= 16) {
      coneGeom._makeTriangleEdges()._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw stroke on cone objects with more' +
        ' than 24 detailX or 16 detailY'
      );
    }
    this._renderer.createBuffers(gId, coneGeom);
  }

  this._renderer.drawBuffersScaled(gId, radius, height, radius);

  return this;
};

/**
 * Draw an ellipsoid with given radius
 *
 * DetailX and detailY determine the number of subdivisions in the x-dimension and
 * the y-dimension of a cone. More subdivisions make the ellipsoid appear to be smoother.
 * Avoid detail number above 150, it may crash the browser.
 * @method ellipsoid
 * @param  {Number} [radiusx]         x-radius of ellipsoid
 * @param  {Number} [radiusy]         y-radius of ellipsoid
 * @param  {Number} [radiusz]         z-radius of ellipsoid
 * @param  {Integer} [detailX]        number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 24. Avoid detail number above
 *                                    150, it may crash the browser.
 * @param  {Integer} [detailY]        number of segments,
 *                                    the more segments the smoother geometry
 *                                    default is 16. Avoid detail number above
 *                                    150, it may crash the browser.
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw an ellipsoid
 * // with radius 30, 40 and 40.
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('a white 3d ellipsoid');
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   ellipsoid(30, 40, 40);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailX works
 * let detailX;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailX = createSlider(2, 24, 12);
 *   detailX.position(10, height + 5);
 *   detailX.style('width', '80px');
 *   describe(
 *     'a rotating white ellipsoid with limited X detail, with a slider that adjusts detailX'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 94);
 *   rotateY(millis() / 1000);
 *   ellipsoid(30, 40, 40, detailX.value(), 8);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailY works
 * let detailY;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   detailY = createSlider(2, 24, 6);
 *   detailY.position(10, height + 5);
 *   detailY.style('width', '80px');
 *   describe(
 *     'a rotating white ellipsoid with limited Y detail, with a slider that adjusts detailY'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 105, 9);
 *   rotateY(millis() / 1000);
 *   ellipsoid(30, 40, 40, 12, detailY.value());
 * }
 * </code>
 * </div>
 */
p5.prototype.ellipsoid = function(
  radiusX = 50,
  radiusY = radiusX,
  radiusZ = radiusX,
  detailX = 24,
  detailY = 16
) {
  this._assert3d('ellipsoid');
  p5._validateParameters('ellipsoid', arguments);

  const gId = `ellipsoid|${detailX}|${detailY}`;

  if (!this._renderer.geometryInHash(gId)) {
    const _ellipsoid = function() {
      for (let i = 0; i <= this.detailY; i++) {
        const v = i / this.detailY;
        const phi = Math.PI * v - Math.PI / 2;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        for (let j = 0; j <= this.detailX; j++) {
          const u = j / this.detailX;
          const theta = 2 * Math.PI * u;
          const cosTheta = Math.cos(theta);
          const sinTheta = Math.sin(theta);
          const p = new p5.Vector(cosPhi * sinTheta, sinPhi, cosPhi * cosTheta);
          this.vertices.push(p);
          this.vertexNormals.push(p);
          this.uvs.push(u, v);
        }
      }
    };
    const ellipsoidGeom = new p5.Geometry(detailX, detailY, _ellipsoid);
    ellipsoidGeom.computeFaces();
    if (detailX <= 24 && detailY <= 24) {
      ellipsoidGeom._makeTriangleEdges()._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw stroke on ellipsoids with more' +
        ' than 24 detailX or 24 detailY'
      );
    }
    this._renderer.createBuffers(gId, ellipsoidGeom);
  }

  this._renderer.drawBuffersScaled(gId, radiusX, radiusY, radiusZ);

  return this;
};

/**
 * Draw a torus with given radius and tube radius
 *
 * DetailX and detailY determine the number of subdivisions in the x-dimension and
 * the y-dimension of a torus. More subdivisions make the torus appear to be smoother.
 * The default and maximum values for detailX and detailY are 24 and 16, respectively.
 * Setting them to relatively small values like 4 and 6 allows you to create new
 * shapes other than a torus.
 * @method torus
 * @param  {Number} [radius]      radius of the whole ring
 * @param  {Number} [tubeRadius]  radius of the tube
 * @param  {Integer} [detailX]    number of segments in x-dimension,
 *                                the more segments the smoother geometry
 *                                default is 24
 * @param  {Integer} [detailY]    number of segments in y-dimension,
 *                                the more segments the smoother geometry
 *                                default is 16
 * @chainable
 * @example
 * <div>
 * <code>
 * // draw a spinning torus
 * // with ring radius 30 and tube radius 15
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   describe('a rotating white torus');
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   torus(30, 15);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailX works
 * let detailX;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   detailX = createSlider(3, 24, 3);
 *   detailX.position(10, height + 5);
 *   detailX.style('width', '80px');
 *   describe(
 *     'a rotating white torus with limited X detail, with a slider that adjusts detailX'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   rotateY(millis() / 1000);
 *   torus(30, 15, detailX.value(), 12);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // slide to see how detailY works
 * let detailY;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   detailY = createSlider(3, 16, 3);
 *   detailY.position(10, height + 5);
 *   detailY.style('width', '80px');
 *   describe(
 *     'a rotating white torus with limited Y detail, with a slider that adjusts detailY'
 *   );
 * }
 *
 * function draw() {
 *   background(205, 102, 94);
 *   rotateY(millis() / 1000);
 *   torus(30, 15, 16, detailY.value());
 * }
 * </code>
 * </div>
 */
p5.prototype.torus = function(radius, tubeRadius, detailX, detailY) {
  this._assert3d('torus');
  p5._validateParameters('torus', arguments);
  if (typeof radius === 'undefined') {
    radius = 50;
  } else if (!radius) {
    return; // nothing to draw
  }

  if (typeof tubeRadius === 'undefined') {
    tubeRadius = 10;
  } else if (!tubeRadius) {
    return; // nothing to draw
  }

  if (typeof detailX === 'undefined') {
    detailX = 24;
  }
  if (typeof detailY === 'undefined') {
    detailY = 16;
  }

  const tubeRatio = (tubeRadius / radius).toPrecision(4);
  const gId = `torus|${tubeRatio}|${detailX}|${detailY}`;

  if (!this._renderer.geometryInHash(gId)) {
    const _torus = function() {
      for (let i = 0; i <= this.detailY; i++) {
        const v = i / this.detailY;
        const phi = 2 * Math.PI * v;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const r = 1 + tubeRatio * cosPhi;

        for (let j = 0; j <= this.detailX; j++) {
          const u = j / this.detailX;
          const theta = 2 * Math.PI * u;
          const cosTheta = Math.cos(theta);
          const sinTheta = Math.sin(theta);

          const p = new p5.Vector(
            r * cosTheta,
            r * sinTheta,
            tubeRatio * sinPhi
          );

          const n = new p5.Vector(cosPhi * cosTheta, cosPhi * sinTheta, sinPhi);

          this.vertices.push(p);
          this.vertexNormals.push(n);
          this.uvs.push(u, v);
        }
      }
    };
    const torusGeom = new p5.Geometry(detailX, detailY, _torus);
    torusGeom.computeFaces();
    if (detailX <= 24 && detailY <= 16) {
      torusGeom._makeTriangleEdges()._edgesToVertices();
    } else if (this._renderer._doStroke) {
      console.log(
        'Cannot draw strokes on torus object with more' +
        ' than 24 detailX or 16 detailY'
      );
    }
    this._renderer.createBuffers(gId, torusGeom);
  }
  this._renderer.drawBuffersScaled(gId, radius, radius, radius);

  return this;
};

///////////////////////
/// 2D primitives
/////////////////////////
//
// Note: Documentation is not generated on the p5.js website for functions on
// the p5.RendererGL prototype.

/**
 * Draws a point, a coordinate in space at the dimension of one pixel,
 * given x, y and z coordinates. The color of the point is determined
 * by the current stroke, while the point size is determined by current
 * stroke weight.
 * @private
 * @param {Number} x x-coordinate of point
 * @param {Number} y y-coordinate of point
 * @param {Number} z z-coordinate of point
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(50);
 *   stroke(255);
 *   strokeWeight(4);
 *   point(25, 0);
 *   strokeWeight(3);
 *   point(-25, 0);
 *   strokeWeight(2);
 *   point(0, 25);
 *   strokeWeight(1);
 *   point(0, -25);
 * }
 * </code>
 * </div>
 */
p5.RendererGL.prototype.point = function(x, y, z = 0) {

  const _vertex = [];
  _vertex.push(new p5.Vector(x, y, z));
  this._drawPoints(_vertex, this.immediateMode.buffers.point);

  return this;
};

p5.RendererGL.prototype.triangle = function(args) {
  const x1 = args[0],
    y1 = args[1];
  const x2 = args[2],
    y2 = args[3];
  const x3 = args[4],
    y3 = args[5];

  const gId = 'tri';
  if (!this.geometryInHash(gId)) {
    const _triangle = function() {
      const vertices = [];
      vertices.push(new p5.Vector(0, 0, 0));
      vertices.push(new p5.Vector(1, 0, 0));
      vertices.push(new p5.Vector(0, 1, 0));
      this.edges = [[0, 1], [1, 2], [2, 0]];
      this.vertices = vertices;
      this.faces = [[0, 1, 2]];
      this.uvs = [0, 0, 1, 0, 1, 1];
    };
    const triGeom = new p5.Geometry(1, 1, _triangle);
    triGeom._edgesToVertices();
    triGeom.computeNormals();
    this.createBuffers(gId, triGeom);
  }

  // only one triangle is cached, one point is at the origin, and the
  // two adjacent sides are tne unit vectors along the X & Y axes.
  //
  // this matrix multiplication transforms those two unit vectors
  // onto the required vector prior to rendering, and moves the
  // origin appropriately.
  const uModelMatrix = this.uModelMatrix.copy();
  try {
    // triangle orientation.
    const orientation = Math.sign(x1*y2-x2*y1 + x2*y3-x3*y2 + x3*y1-x1*y3);
    const mult = new p5.Matrix([
      x2 - x1, y2 - y1, 0, 0, // the resulting unit X-axis
      x3 - x1, y3 - y1, 0, 0, // the resulting unit Y-axis
      0, 0, orientation, 0,   // the resulting unit Z-axis (Reflect the specified order of vertices)
      x1, y1, 0, 1            // the resulting origin
    ]).mult(this.uModelMatrix);

    this.uModelMatrix = mult;

    this.drawBuffers(gId);
  } finally {
    this.uModelMatrix = uModelMatrix;
  }

  return this;
};

p5.RendererGL.prototype.ellipse = function(args) {
  this.arc(
    args[0],
    args[1],
    args[2],
    args[3],
    0,
    constants.TWO_PI,
    constants.OPEN,
    args[4]
  );
};

p5.RendererGL.prototype.arc = function(...args) {
  const x = args[0];
  const y = args[1];
  const width = args[2];
  const height = args[3];
  const start = args[4];
  const stop = args[5];
  const mode = args[6];
  const detail = args[7] || 25;

  let shape;
  let gId;

  // check if it is an ellipse or an arc
  if (Math.abs(stop - start) >= constants.TWO_PI) {
    shape = 'ellipse';
    gId = `${shape}|${detail}|`;
  } else {
    shape = 'arc';
    gId = `${shape}|${start}|${stop}|${mode}|${detail}|`;
  }

  if (!this.geometryInHash(gId)) {
    const _arc = function() {

      // if the start and stop angles are not the same, push vertices to the array
      if (start.toFixed(10) !== stop.toFixed(10)) {
        // if the mode specified is PIE or null, push the mid point of the arc in vertices
        if (mode === constants.PIE || typeof mode === 'undefined') {
          this.vertices.push(new p5.Vector(0.5, 0.5, 0));
          this.uvs.push([0.5, 0.5]);
        }

        // vertices for the perimeter of the circle
        for (let i = 0; i <= detail; i++) {
          const u = i / detail;
          const theta = (stop - start) * u + start;

          const _x = 0.5 + Math.cos(theta) / 2;
          const _y = 0.5 + Math.sin(theta) / 2;

          this.vertices.push(new p5.Vector(_x, _y, 0));
          this.uvs.push([_x, _y]);

          if (i < detail - 1) {
            this.faces.push([0, i + 1, i + 2]);
            this.edges.push([i + 1, i + 2]);
          }
        }

        // check the mode specified in order to push vertices and faces, different for each mode
        switch (mode) {
          case constants.PIE:
            this.faces.push([
              0,
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.edges.push([0, 1]);
            this.edges.push([
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.edges.push([0, this.vertices.length - 1]);
            break;

          case constants.CHORD:
            this.edges.push([0, 1]);
            this.edges.push([0, this.vertices.length - 1]);
            break;

          case constants.OPEN:
            this.edges.push([0, 1]);
            break;

          default:
            this.faces.push([
              0,
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.edges.push([
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
        }
      }
    };

    const arcGeom = new p5.Geometry(detail, 1, _arc);
    arcGeom.computeNormals();

    if (detail <= 50) {
      arcGeom._edgesToVertices(arcGeom);
    } else if (this._doStroke) {
      console.log(
        `Cannot apply a stroke to an ${shape} with more than 50 detail`
      );
    }

    this.createBuffers(gId, arcGeom);
  }

  const uModelMatrix = this.uModelMatrix.copy();

  try {
    this.uModelMatrix.translate([x, y, 0]);
    this.uModelMatrix.scale(width, height, 1);

    this.drawBuffers(gId);
  } finally {
    this.uModelMatrix = uModelMatrix;
  }

  return this;
};

p5.RendererGL.prototype.rect = function(args) {
  const x = args[0];
  const y = args[1];
  const width = args[2];
  const height = args[3];

  if (typeof args[4] === 'undefined') {
    // Use the retained mode for drawing rectangle,
    // if args for rounding rectangle is not provided by user.
    const perPixelLighting = this._pInst._glAttributes.perPixelLighting;
    const detailX = args[4] || (perPixelLighting ? 1 : 24);
    const detailY = args[5] || (perPixelLighting ? 1 : 16);
    const gId = `rect|${detailX}|${detailY}`;
    if (!this.geometryInHash(gId)) {
      const _rect = function() {
        for (let i = 0; i <= this.detailY; i++) {
          const v = i / this.detailY;
          for (let j = 0; j <= this.detailX; j++) {
            const u = j / this.detailX;
            const p = new p5.Vector(u, v, 0);
            this.vertices.push(p);
            this.uvs.push(u, v);
          }
        }
        // using stroke indices to avoid stroke over face(s) of rectangle
        if (detailX > 0 && detailY > 0) {
          this.edges = [
            [0, detailX],
            [detailX, (detailX + 1) * (detailY + 1) - 1],
            [(detailX + 1) * (detailY + 1) - 1, (detailX + 1) * detailY],
            [(detailX + 1) * detailY, 0]
          ];
        }
      };
      const rectGeom = new p5.Geometry(detailX, detailY, _rect);
      rectGeom
        .computeFaces()
        .computeNormals()
        ._edgesToVertices();
      this.createBuffers(gId, rectGeom);
    }

    // only a single rectangle (of a given detail) is cached: a square with
    // opposite corners at (0,0) & (1,1).
    //
    // before rendering, this square is scaled & moved to the required location.
    const uModelMatrix = this.uModelMatrix.copy();
    try {
      this.uModelMatrix.translate([x, y, 0]);
      this.uModelMatrix.scale(width, height, 1);

      this.drawBuffers(gId);
    } finally {
      this.uModelMatrix = uModelMatrix;
    }
  } else {
    // Use Immediate mode to round the rectangle corner,
    // if args for rounding corners is provided by user
    let tl = args[4];
    let tr = typeof args[5] === 'undefined' ? tl : args[5];
    let br = typeof args[6] === 'undefined' ? tr : args[6];
    let bl = typeof args[7] === 'undefined' ? br : args[7];

    let a = x;
    let b = y;
    let c = width;
    let d = height;

    c += a;
    d += b;

    if (a > c) {
      const temp = a;
      a = c;
      c = temp;
    }

    if (b > d) {
      const temp = b;
      b = d;
      d = temp;
    }

    const maxRounding = Math.min((c - a) / 2, (d - b) / 2);
    if (tl > maxRounding) tl = maxRounding;
    if (tr > maxRounding) tr = maxRounding;
    if (br > maxRounding) br = maxRounding;
    if (bl > maxRounding) bl = maxRounding;

    let x1 = a;
    let y1 = b;
    let x2 = c;
    let y2 = d;

    this.beginShape();
    if (tr !== 0) {
      this.vertex(x2 - tr, y1);
      this.quadraticVertex(x2, y1, x2, y1 + tr);
    } else {
      this.vertex(x2, y1);
    }
    if (br !== 0) {
      this.vertex(x2, y2 - br);
      this.quadraticVertex(x2, y2, x2 - br, y2);
    } else {
      this.vertex(x2, y2);
    }
    if (bl !== 0) {
      this.vertex(x1 + bl, y2);
      this.quadraticVertex(x1, y2, x1, y2 - bl);
    } else {
      this.vertex(x1, y2);
    }
    if (tl !== 0) {
      this.vertex(x1, y1 + tl);
      this.quadraticVertex(x1, y1, x1 + tl, y1);
    } else {
      this.vertex(x1, y1);
    }

    this.immediateMode.geometry.uvs.length = 0;
    for (const vert of this.immediateMode.geometry.vertices) {
      const u = (vert.x - x1) / width;
      const v = (vert.y - y1) / height;
      this.immediateMode.geometry.uvs.push(u, v);
    }

    this.endShape(constants.CLOSE);
  }
  return this;
};

/* eslint-disable max-len */
p5.RendererGL.prototype.quad = function(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, detailX=2, detailY=2) {
  /* eslint-enable max-len */

  const gId =
    `quad|${x1}|${y1}|${z1}|${x2}|${y2}|${z2}|${x3}|${y3}|${z3}|${x4}|${y4}|${z4}|${detailX}|${detailY}`;

  if (!this.geometryInHash(gId)) {
    const quadGeom = new p5.Geometry(detailX, detailY, function() {
      //algorithm adapted from c++ to js
      //https://stackoverflow.com/questions/16989181/whats-the-correct-way-to-draw-a-distorted-plane-in-opengl/16993202#16993202
      let xRes = 1.0 / (this.detailX - 1);
      let yRes = 1.0 / (this.detailY - 1);
      for (let y = 0; y < this.detailY; y++) {
        for (let x = 0; x < this.detailX; x++) {
          let pctx = x * xRes;
          let pcty = y * yRes;

          let linePt0x = (1 - pcty) * x1 + pcty * x4;
          let linePt0y = (1 - pcty) * y1 + pcty * y4;
          let linePt0z = (1 - pcty) * z1 + pcty * z4;
          let linePt1x = (1 - pcty) * x2 + pcty * x3;
          let linePt1y = (1 - pcty) * y2 + pcty * y3;
          let linePt1z = (1 - pcty) * z2 + pcty * z3;

          let ptx = (1 - pctx) * linePt0x + pctx * linePt1x;
          let pty = (1 - pctx) * linePt0y + pctx * linePt1y;
          let ptz = (1 - pctx) * linePt0z + pctx * linePt1z;

          this.vertices.push(new p5.Vector(ptx, pty, ptz));
          this.uvs.push([pctx, pcty]);
        }
      }
    });

    quadGeom.faces = [];
    for(let y = 0; y < detailY-1; y++){
      for(let x = 0; x < detailX-1; x++){
        let pt0 = x + y * detailX;
        let pt1 = (x + 1) + y * detailX;
        let pt2 = (x + 1) + (y + 1) * detailX;
        let pt3 = x + (y + 1) * detailX;
        quadGeom.faces.push([pt0, pt1, pt2]);
        quadGeom.faces.push([pt0, pt2, pt3]);
      }
    }
    quadGeom.computeNormals();
    quadGeom.edges.length = 0;
    const vertexOrder = [0, 2, 3, 1];
    for (let i = 0; i < vertexOrder.length; i++) {
      const startVertex = vertexOrder[i];
      const endVertex = vertexOrder[(i + 1) % vertexOrder.length];
      quadGeom.edges.push([startVertex, endVertex]);
    }
    quadGeom._edgesToVertices();
    this.createBuffers(gId, quadGeom);
  }
  this.drawBuffers(gId);
  return this;
};

//this implementation of bezier curve
//is based on Bernstein polynomial
// pretier-ignore
p5.RendererGL.prototype.bezier = function(
  x1,
  y1,
  z1, // x2
  x2, // y2
  y2, // x3
  z2, // y3
  x3, // x4
  y3, // y4
  z3,
  x4,
  y4,
  z4
) {
  if (arguments.length === 8) {
    y4 = y3;
    x4 = x3;
    y3 = z2;
    x3 = y2;
    y2 = x2;
    x2 = z1;
    z1 = z2 = z3 = z4 = 0;
  }
  const bezierDetail = this._pInst._bezierDetail || 20; //value of Bezier detail
  this.beginShape();
  for (let i = 0; i <= bezierDetail; i++) {
    const c1 = Math.pow(1 - i / bezierDetail, 3);
    const c2 = 3 * (i / bezierDetail) * Math.pow(1 - i / bezierDetail, 2);
    const c3 = 3 * Math.pow(i / bezierDetail, 2) * (1 - i / bezierDetail);
    const c4 = Math.pow(i / bezierDetail, 3);
    this.vertex(
      x1 * c1 + x2 * c2 + x3 * c3 + x4 * c4,
      y1 * c1 + y2 * c2 + y3 * c3 + y4 * c4,
      z1 * c1 + z2 * c2 + z3 * c3 + z4 * c4
    );
  }
  this.endShape();
  return this;
};

// pretier-ignore
p5.RendererGL.prototype.curve = function(
  x1,
  y1,
  z1, // x2
  x2, // y2
  y2, // x3
  z2, // y3
  x3, // x4
  y3, // y4
  z3,
  x4,
  y4,
  z4
) {
  if (arguments.length === 8) {
    x4 = x3;
    y4 = y3;
    x3 = y2;
    y3 = x2;
    x2 = z1;
    y2 = x2;
    z1 = z2 = z3 = z4 = 0;
  }
  const curveDetail = this._pInst._curveDetail;
  this.beginShape();
  for (let i = 0; i <= curveDetail; i++) {
    const c1 = Math.pow(i / curveDetail, 3) * 0.5;
    const c2 = Math.pow(i / curveDetail, 2) * 0.5;
    const c3 = i / curveDetail * 0.5;
    const c4 = 0.5;
    const vx =
      c1 * (-x1 + 3 * x2 - 3 * x3 + x4) +
      c2 * (2 * x1 - 5 * x2 + 4 * x3 - x4) +
      c3 * (-x1 + x3) +
      c4 * (2 * x2);
    const vy =
      c1 * (-y1 + 3 * y2 - 3 * y3 + y4) +
      c2 * (2 * y1 - 5 * y2 + 4 * y3 - y4) +
      c3 * (-y1 + y3) +
      c4 * (2 * y2);
    const vz =
      c1 * (-z1 + 3 * z2 - 3 * z3 + z4) +
      c2 * (2 * z1 - 5 * z2 + 4 * z3 - z4) +
      c3 * (-z1 + z3) +
      c4 * (2 * z2);
    this.vertex(vx, vy, vz);
  }
  this.endShape();
  return this;
};

/**
 * Draw a line given two points
 * @private
 * @param {Number} x0 x-coordinate of first vertex
 * @param {Number} y0 y-coordinate of first vertex
 * @param {Number} z0 z-coordinate of first vertex
 * @param {Number} x1 x-coordinate of second vertex
 * @param {Number} y1 y-coordinate of second vertex
 * @param {Number} z1 z-coordinate of second vertex
 * @chainable
 * @example
 * <div>
 * <code>
 * //draw a line
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   // Use fill instead of stroke to change the color of shape.
 *   fill(255, 0, 0);
 *   line(10, 10, 0, 60, 60, 20);
 * }
 * </code>
 * </div>
 */
p5.RendererGL.prototype.line = function(...args) {
  if (args.length === 6) {
    this.beginShape(constants.LINES);
    this.vertex(args[0], args[1], args[2]);
    this.vertex(args[3], args[4], args[5]);
    this.endShape();
  } else if (args.length === 4) {
    this.beginShape(constants.LINES);
    this.vertex(args[0], args[1], 0);
    this.vertex(args[2], args[3], 0);
    this.endShape();
  }
  return this;
};

p5.RendererGL.prototype.bezierVertex = function(...args) {
  if (this.immediateMode._bezierVertex.length === 0) {
    throw Error('vertex() must be used once before calling bezierVertex()');
  } else {
    let w_x = [];
    let w_y = [];
    let w_z = [];
    let t, _x, _y, _z, i, k, m;
    // variable i for bezierPoints, k for components, and m for anchor points.
    const argLength = args.length;

    t = 0;

    if (
      this._lookUpTableBezier.length === 0 ||
      this._lutBezierDetail !== this._pInst._curveDetail
    ) {
      this._lookUpTableBezier = [];
      this._lutBezierDetail = this._pInst._curveDetail;
      const step = 1 / this._lutBezierDetail;
      let start = 0;
      let end = 1;
      let j = 0;
      while (start < 1) {
        t = parseFloat(start.toFixed(6));
        this._lookUpTableBezier[j] = this._bezierCoefficients(t);
        if (end.toFixed(6) === step.toFixed(6)) {
          t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
          ++j;
          this._lookUpTableBezier[j] = this._bezierCoefficients(t);
          break;
        }
        start += step;
        end -= step;
        ++j;
      }
    }

    const LUTLength = this._lookUpTableBezier.length;

    // fillColors[0]: start point color
    // fillColors[1],[2]: control point color
    // fillColors[3]: end point color
    const fillColors = [];
    for (m = 0; m < 4; m++) fillColors.push([]);
    fillColors[0] = this.immediateMode.geometry.vertexColors.slice(-4);
    fillColors[3] = this.curFillColor.slice();

    // Do the same for strokeColor.
    const strokeColors = [];
    for (m = 0; m < 4; m++) strokeColors.push([]);
    strokeColors[0] = this.immediateMode.geometry.vertexStrokeColors.slice(-4);
    strokeColors[3] = this.curStrokeColor.slice();

    if (argLength === 6) {
      this.isBezier = true;

      w_x = [this.immediateMode._bezierVertex[0], args[0], args[2], args[4]];
      w_y = [this.immediateMode._bezierVertex[1], args[1], args[3], args[5]];
      // The ratio of the distance between the start point, the two control-
      // points, and the end point determines the intermediate color.
      let d0 = Math.hypot(w_x[0]-w_x[1], w_y[0]-w_y[1]);
      let d1 = Math.hypot(w_x[1]-w_x[2], w_y[1]-w_y[2]);
      let d2 = Math.hypot(w_x[2]-w_x[3], w_y[2]-w_y[3]);
      const totalLength = d0 + d1 + d2;
      d0 /= totalLength;
      d2 /= totalLength;
      for (k = 0; k < 4; k++) {
        fillColors[1].push(
          fillColors[0][k] * (1-d0) + fillColors[3][k] * d0
        );
        fillColors[2].push(
          fillColors[0][k] * d2 + fillColors[3][k] * (1-d2)
        );
        strokeColors[1].push(
          strokeColors[0][k] * (1-d0) + strokeColors[3][k] * d0
        );
        strokeColors[2].push(
          strokeColors[0][k] * d2 + strokeColors[3][k] * (1-d2)
        );
      }

      for (i = 0; i < LUTLength; i++) {
        // Interpolate colors using control points
        this.curFillColor = [0, 0, 0, 0];
        this.curStrokeColor = [0, 0, 0, 0];
        _x = _y = 0;
        for (m = 0; m < 4; m++) {
          for (k = 0; k < 4; k++) {
            this.curFillColor[k] +=
              this._lookUpTableBezier[i][m] * fillColors[m][k];
            this.curStrokeColor[k] +=
              this._lookUpTableBezier[i][m] * strokeColors[m][k];
          }
          _x += w_x[m] * this._lookUpTableBezier[i][m];
          _y += w_y[m] * this._lookUpTableBezier[i][m];
        }
        this.vertex(_x, _y);
      }
      // so that we leave currentColor with the last value the user set it to
      this.curFillColor = fillColors[3];
      this.curStrokeColor = strokeColors[3];
      this.immediateMode._bezierVertex[0] = args[4];
      this.immediateMode._bezierVertex[1] = args[5];
    } else if (argLength === 9) {
      this.isBezier = true;

      w_x = [this.immediateMode._bezierVertex[0], args[0], args[3], args[6]];
      w_y = [this.immediateMode._bezierVertex[1], args[1], args[4], args[7]];
      w_z = [this.immediateMode._bezierVertex[2], args[2], args[5], args[8]];
      // The ratio of the distance between the start point, the two control-
      // points, and the end point determines the intermediate color.
      let d0 = Math.hypot(w_x[0]-w_x[1], w_y[0]-w_y[1], w_z[0]-w_z[1]);
      let d1 = Math.hypot(w_x[1]-w_x[2], w_y[1]-w_y[2], w_z[1]-w_z[2]);
      let d2 = Math.hypot(w_x[2]-w_x[3], w_y[2]-w_y[3], w_z[2]-w_z[3]);
      const totalLength = d0 + d1 + d2;
      d0 /= totalLength;
      d2 /= totalLength;
      for (k = 0; k < 4; k++) {
        fillColors[1].push(
          fillColors[0][k] * (1-d0) + fillColors[3][k] * d0
        );
        fillColors[2].push(
          fillColors[0][k] * d2 + fillColors[3][k] * (1-d2)
        );
        strokeColors[1].push(
          strokeColors[0][k] * (1-d0) + strokeColors[3][k] * d0
        );
        strokeColors[2].push(
          strokeColors[0][k] * d2 + strokeColors[3][k] * (1-d2)
        );
      }
      for (i = 0; i < LUTLength; i++) {
        // Interpolate colors using control points
        this.curFillColor = [0, 0, 0, 0];
        this.curStrokeColor = [0, 0, 0, 0];
        _x = _y = _z = 0;
        for (m = 0; m < 4; m++) {
          for (k = 0; k < 4; k++) {
            this.curFillColor[k] +=
              this._lookUpTableBezier[i][m] * fillColors[m][k];
            this.curStrokeColor[k] +=
              this._lookUpTableBezier[i][m] * strokeColors[m][k];
          }
          _x += w_x[m] * this._lookUpTableBezier[i][m];
          _y += w_y[m] * this._lookUpTableBezier[i][m];
          _z += w_z[m] * this._lookUpTableBezier[i][m];
        }
        this.vertex(_x, _y, _z);
      }
      // so that we leave currentColor with the last value the user set it to
      this.curFillColor = fillColors[3];
      this.curStrokeColor = strokeColors[3];
      this.immediateMode._bezierVertex[0] = args[6];
      this.immediateMode._bezierVertex[1] = args[7];
      this.immediateMode._bezierVertex[2] = args[8];
    }
  }
};

p5.RendererGL.prototype.quadraticVertex = function(...args) {
  if (this.immediateMode._quadraticVertex.length === 0) {
    throw Error('vertex() must be used once before calling quadraticVertex()');
  } else {
    let w_x = [];
    let w_y = [];
    let w_z = [];
    let t, _x, _y, _z, i, k, m;
    // variable i for bezierPoints, k for components, and m for anchor points.
    const argLength = args.length;

    t = 0;

    if (
      this._lookUpTableQuadratic.length === 0 ||
      this._lutQuadraticDetail !== this._pInst._curveDetail
    ) {
      this._lookUpTableQuadratic = [];
      this._lutQuadraticDetail = this._pInst._curveDetail;
      const step = 1 / this._lutQuadraticDetail;
      let start = 0;
      let end = 1;
      let j = 0;
      while (start < 1) {
        t = parseFloat(start.toFixed(6));
        this._lookUpTableQuadratic[j] = this._quadraticCoefficients(t);
        if (end.toFixed(6) === step.toFixed(6)) {
          t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
          ++j;
          this._lookUpTableQuadratic[j] = this._quadraticCoefficients(t);
          break;
        }
        start += step;
        end -= step;
        ++j;
      }
    }

    const LUTLength = this._lookUpTableQuadratic.length;

    // fillColors[0]: start point color
    // fillColors[1]: control point color
    // fillColors[2]: end point color
    const fillColors = [];
    for (m = 0; m < 3; m++) fillColors.push([]);
    fillColors[0] = this.immediateMode.geometry.vertexColors.slice(-4);
    fillColors[2] = this.curFillColor.slice();

    // Do the same for strokeColor.
    const strokeColors = [];
    for (m = 0; m < 3; m++) strokeColors.push([]);
    strokeColors[0] = this.immediateMode.geometry.vertexStrokeColors.slice(-4);
    strokeColors[2] = this.curStrokeColor.slice();

    if (argLength === 4) {
      this.isQuadratic = true;

      w_x = [this.immediateMode._quadraticVertex[0], args[0], args[2]];
      w_y = [this.immediateMode._quadraticVertex[1], args[1], args[3]];

      // The ratio of the distance between the start point, the control-
      // point, and the end point determines the intermediate color.
      let d0 = Math.hypot(w_x[0]-w_x[1], w_y[0]-w_y[1]);
      let d1 = Math.hypot(w_x[1]-w_x[2], w_y[1]-w_y[2]);
      const totalLength = d0 + d1;
      d0 /= totalLength;
      for (k = 0; k < 4; k++) {
        fillColors[1].push(
          fillColors[0][k] * (1-d0) + fillColors[2][k] * d0
        );
        strokeColors[1].push(
          strokeColors[0][k] * (1-d0) + strokeColors[2][k] * d0
        );
      }

      for (i = 0; i < LUTLength; i++) {
        // Interpolate colors using control points
        this.curFillColor = [0, 0, 0, 0];
        this.curStrokeColor = [0, 0, 0, 0];
        _x = _y = 0;
        for (m = 0; m < 3; m++) {
          for (k = 0; k < 4; k++) {
            this.curFillColor[k] +=
              this._lookUpTableQuadratic[i][m] * fillColors[m][k];
            this.curStrokeColor[k] +=
              this._lookUpTableQuadratic[i][m] * strokeColors[m][k];
          }
          _x += w_x[m] * this._lookUpTableQuadratic[i][m];
          _y += w_y[m] * this._lookUpTableQuadratic[i][m];
        }
        this.vertex(_x, _y);
      }

      // so that we leave currentColor with the last value the user set it to
      this.curFillColor = fillColors[2];
      this.curStrokeColor = strokeColors[2];
      this.immediateMode._quadraticVertex[0] = args[2];
      this.immediateMode._quadraticVertex[1] = args[3];
    } else if (argLength === 6) {
      this.isQuadratic = true;

      w_x = [this.immediateMode._quadraticVertex[0], args[0], args[3]];
      w_y = [this.immediateMode._quadraticVertex[1], args[1], args[4]];
      w_z = [this.immediateMode._quadraticVertex[2], args[2], args[5]];

      // The ratio of the distance between the start point, the control-
      // point, and the end point determines the intermediate color.
      let d0 = Math.hypot(w_x[0]-w_x[1], w_y[0]-w_y[1], w_z[0]-w_z[1]);
      let d1 = Math.hypot(w_x[1]-w_x[2], w_y[1]-w_y[2], w_z[1]-w_z[2]);
      const totalLength = d0 + d1;
      d0 /= totalLength;
      for (k = 0; k < 4; k++) {
        fillColors[1].push(
          fillColors[0][k] * (1-d0) + fillColors[2][k] * d0
        );
        strokeColors[1].push(
          strokeColors[0][k] * (1-d0) + strokeColors[2][k] * d0
        );
      }

      for (i = 0; i < LUTLength; i++) {
        // Interpolate colors using control points
        this.curFillColor = [0, 0, 0, 0];
        this.curStrokeColor = [0, 0, 0, 0];
        _x = _y = _z = 0;
        for (m = 0; m < 3; m++) {
          for (k = 0; k < 4; k++) {
            this.curFillColor[k] +=
              this._lookUpTableQuadratic[i][m] * fillColors[m][k];
            this.curStrokeColor[k] +=
              this._lookUpTableQuadratic[i][m] * strokeColors[m][k];
          }
          _x += w_x[m] * this._lookUpTableQuadratic[i][m];
          _y += w_y[m] * this._lookUpTableQuadratic[i][m];
          _z += w_z[m] * this._lookUpTableQuadratic[i][m];
        }
        this.vertex(_x, _y, _z);
      }

      // so that we leave currentColor with the last value the user set it to
      this.curFillColor = fillColors[2];
      this.curStrokeColor = strokeColors[2];
      this.immediateMode._quadraticVertex[0] = args[3];
      this.immediateMode._quadraticVertex[1] = args[4];
      this.immediateMode._quadraticVertex[2] = args[5];
    }
  }
};

p5.RendererGL.prototype.curveVertex = function(...args) {
  let w_x = [];
  let w_y = [];
  let w_z = [];
  let t, _x, _y, _z, i;
  t = 0;
  const argLength = args.length;

  if (
    this._lookUpTableBezier.length === 0 ||
    this._lutBezierDetail !== this._pInst._curveDetail
  ) {
    this._lookUpTableBezier = [];
    this._lutBezierDetail = this._pInst._curveDetail;
    const step = 1 / this._lutBezierDetail;
    let start = 0;
    let end = 1;
    let j = 0;
    while (start < 1) {
      t = parseFloat(start.toFixed(6));
      this._lookUpTableBezier[j] = this._bezierCoefficients(t);
      if (end.toFixed(6) === step.toFixed(6)) {
        t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
        ++j;
        this._lookUpTableBezier[j] = this._bezierCoefficients(t);
        break;
      }
      start += step;
      end -= step;
      ++j;
    }
  }

  const LUTLength = this._lookUpTableBezier.length;

  if (argLength === 2) {
    this.immediateMode._curveVertex.push(args[0]);
    this.immediateMode._curveVertex.push(args[1]);
    if (this.immediateMode._curveVertex.length === 8) {
      this.isCurve = true;
      w_x = this._bezierToCatmull([
        this.immediateMode._curveVertex[0],
        this.immediateMode._curveVertex[2],
        this.immediateMode._curveVertex[4],
        this.immediateMode._curveVertex[6]
      ]);
      w_y = this._bezierToCatmull([
        this.immediateMode._curveVertex[1],
        this.immediateMode._curveVertex[3],
        this.immediateMode._curveVertex[5],
        this.immediateMode._curveVertex[7]
      ]);
      for (i = 0; i < LUTLength; i++) {
        _x =
          w_x[0] * this._lookUpTableBezier[i][0] +
          w_x[1] * this._lookUpTableBezier[i][1] +
          w_x[2] * this._lookUpTableBezier[i][2] +
          w_x[3] * this._lookUpTableBezier[i][3];
        _y =
          w_y[0] * this._lookUpTableBezier[i][0] +
          w_y[1] * this._lookUpTableBezier[i][1] +
          w_y[2] * this._lookUpTableBezier[i][2] +
          w_y[3] * this._lookUpTableBezier[i][3];
        this.vertex(_x, _y);
      }
      for (i = 0; i < argLength; i++) {
        this.immediateMode._curveVertex.shift();
      }
    }
  } else if (argLength === 3) {
    this.immediateMode._curveVertex.push(args[0]);
    this.immediateMode._curveVertex.push(args[1]);
    this.immediateMode._curveVertex.push(args[2]);
    if (this.immediateMode._curveVertex.length === 12) {
      this.isCurve = true;
      w_x = this._bezierToCatmull([
        this.immediateMode._curveVertex[0],
        this.immediateMode._curveVertex[3],
        this.immediateMode._curveVertex[6],
        this.immediateMode._curveVertex[9]
      ]);
      w_y = this._bezierToCatmull([
        this.immediateMode._curveVertex[1],
        this.immediateMode._curveVertex[4],
        this.immediateMode._curveVertex[7],
        this.immediateMode._curveVertex[10]
      ]);
      w_z = this._bezierToCatmull([
        this.immediateMode._curveVertex[2],
        this.immediateMode._curveVertex[5],
        this.immediateMode._curveVertex[8],
        this.immediateMode._curveVertex[11]
      ]);
      for (i = 0; i < LUTLength; i++) {
        _x =
          w_x[0] * this._lookUpTableBezier[i][0] +
          w_x[1] * this._lookUpTableBezier[i][1] +
          w_x[2] * this._lookUpTableBezier[i][2] +
          w_x[3] * this._lookUpTableBezier[i][3];
        _y =
          w_y[0] * this._lookUpTableBezier[i][0] +
          w_y[1] * this._lookUpTableBezier[i][1] +
          w_y[2] * this._lookUpTableBezier[i][2] +
          w_y[3] * this._lookUpTableBezier[i][3];
        _z =
          w_z[0] * this._lookUpTableBezier[i][0] +
          w_z[1] * this._lookUpTableBezier[i][1] +
          w_z[2] * this._lookUpTableBezier[i][2] +
          w_z[3] * this._lookUpTableBezier[i][3];
        this.vertex(_x, _y, _z);
      }
      for (i = 0; i < argLength; i++) {
        this.immediateMode._curveVertex.shift();
      }
    }
  }
};

p5.RendererGL.prototype.image = function(
  img,
  sx,
  sy,
  sWidth,
  sHeight,
  dx,
  dy,
  dWidth,
  dHeight
) {
  if (this._isErasing) {
    this.blendMode(this._cachedBlendMode);
  }

  this._pInst.push();

  this._pInst.noLights();
  this._pInst.noStroke();

  this._pInst.texture(img);
  this._pInst.textureMode(constants.NORMAL);

  let u0 = 0;
  if (sx <= img.width) {
    u0 = sx / img.width;
  }

  let u1 = 1;
  if (sx + sWidth <= img.width) {
    u1 = (sx + sWidth) / img.width;
  }

  let v0 = 0;
  if (sy <= img.height) {
    v0 = sy / img.height;
  }

  let v1 = 1;
  if (sy + sHeight <= img.height) {
    v1 = (sy + sHeight) / img.height;
  }

  this.beginShape();
  this.vertex(dx, dy, 0, u0, v0);
  this.vertex(dx + dWidth, dy, 0, u1, v0);
  this.vertex(dx + dWidth, dy + dHeight, 0, u1, v1);
  this.vertex(dx, dy + dHeight, 0, u0, v1);
  this.endShape(constants.CLOSE);

  this._pInst.pop();

  if (this._isErasing) {
    this.blendMode(constants.REMOVE);
  }
};

export default p5;
