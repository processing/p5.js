/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

//some of the functions are adjusted from Three.js(http://threejs.org)

import p5 from '../core/main';
import * as constants from '../core/constants';
/**
 * p5 Geometry class
 * @class p5.Geometry
 * @constructor
 * @param  {Integer} [detailX] number of vertices along the x-axis.
 * @param  {Integer} [detailY] number of vertices along the y-axis.
 * @param {function} [callback] function to call upon object instantiation.
 */
p5.Geometry = class Geometry {
  constructor(detailX, detailY, callback) {
    //an array containing every vertex
    //@type [p5.Vector]
    this.vertices = [];

    this.boundingBoxCache = null;


    //an array containing every vertex for stroke drawing
    this.lineVertices = new p5.DataArray();

    // The tangents going into or out of a vertex on a line. Along a straight
    // line segment, both should be equal. At an endpoint, one or the other
    // will not exist and will be all 0. In joins between line segments, they
    // may be different, as they will be the tangents on either side of the join.
    this.lineTangentsIn = new p5.DataArray();
    this.lineTangentsOut = new p5.DataArray();

    // When drawing lines with thickness, entries in this buffer represent which
    // side of the centerline the vertex will be placed. The sign of the number
    // will represent the side of the centerline, and the absolute value will be
    // used as an enum to determine which part of the cap or join each vertex
    // represents. See the doc comments for _addCap and _addJoin for diagrams.
    this.lineSides = new p5.DataArray();

    //an array containing 1 normal per vertex
    //@type [p5.Vector]
    //[p5.Vector, p5.Vector, p5.Vector,p5.Vector, p5.Vector, p5.Vector,...]
    this.vertexNormals = [];
    //an array containing each three vertex indices that form a face
    //[[0, 1, 2], [2, 1, 3], ...]
    this.faces = [];
    //a 2D array containing uvs for every vertex
    //[[0.0,0.0],[1.0,0.0], ...]
    this.uvs = [];
    // a 2D array containing edge connectivity pattern for create line vertices
    //based on faces for most objects;
    this.edges = [];
    this.vertexColors = [];

    // One color per vertex representing the stroke color at that vertex
    this.vertexStrokeColors = [];

    // One color per line vertex, generated automatically based on
    // vertexStrokeColors in _edgesToVertices()
    this.lineVertexColors = new p5.DataArray();
    this.detailX = detailX !== undefined ? detailX : 1;
    this.detailY = detailY !== undefined ? detailY : 1;
    this.dirtyFlags = {};

    this._hasFillTransparency = undefined;
    this._hasStrokeTransparency = undefined;

    if (callback instanceof Function) {
      callback.call(this);
    }
  }

  /**
 * Custom bounding box calculation based on the object's vertices.
 * The bounding box is a rectangular prism that encompasses the entire object.
 * It is defined by the minimum and maximum coordinates along each axis, as well
 * as the size and offset of the box.
 *
 * It returns an object containing the bounding box properties:
 *
 *   - `min`: The minimum coordinates of the bounding box as a p5.Vector.
 *   - `max`: The maximum coordinates of the bounding box as a p5.Vector.
 *   - `size`: The size of the bounding box as a p5.Vector.
 *   - `offset`: The offset of the bounding box as a p5.Vector.
 *
 * @method calculateBoundingBox
 * @memberof p5.Geometry.prototype
 * @returns {Object}
 *
 * @example
 *
 * <div>
 * <code>
 * let particles;
 * let button;
 * let resultParagraph;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   button = createButton('New');
 *   button.mousePressed(makeParticles);
 *
 *   resultParagraph = createElement('pre').style('width', '200px' );
 *   resultParagraph.style('font-family', 'monospace');
 *   resultParagraph.style('font-size', '12px');
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
 *         randomGaussian(0, 200),
 *         randomGaussian(0, 100),
 *         randomGaussian(0, 150)
 *       );
 *       sphere(10);
 *       pop();
 *     }
 *   });
 *
 *   const boundingBox = particles.calculateBoundingBox();
 *   resultParagraph.html('Bounding Box: \n' + JSON.stringify(boundingBox, null, 2));
 * }
 *
 * function draw() {
 *   background(255);
 *   noStroke();
 *   lights();
 *   orbitControl();
 *   model(particles);
 * }
 *
 * </code>
 * </div>
 *
 */

  calculateBoundingBox() {
    if (this.boundingBoxCache) {
      return this.boundingBoxCache; // Return cached result if available
    }

    let minVertex = new p5.Vector(
      Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    let maxVertex = new p5.Vector(
      Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);

    for (let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];
      minVertex.x = Math.min(minVertex.x, vertex.x);
      minVertex.y = Math.min(minVertex.y, vertex.y);
      minVertex.z = Math.min(minVertex.z, vertex.z);

      maxVertex.x = Math.max(maxVertex.x, vertex.x);
      maxVertex.y = Math.max(maxVertex.y, vertex.y);
      maxVertex.z = Math.max(maxVertex.z, vertex.z);
    }
    // Calculate size and offset properties
    let size = new p5.Vector(maxVertex.x - minVertex.x,
      maxVertex.y - minVertex.y, maxVertex.z - minVertex.z);
    let offset = new p5.Vector((minVertex.x + maxVertex.x) / 2,
      (minVertex.y + maxVertex.y) / 2, (minVertex.z + maxVertex.z) / 2);

    // Cache the result for future access
    this.boundingBoxCache = {
      min: minVertex,
      max: maxVertex,
      size: size,
      offset: offset
    };

    return this.boundingBoxCache;
  }

  reset() {
    this._hasFillTransparency = undefined;
    this._hasStrokeTransparency = undefined;

    this.lineVertices.clear();
    this.lineTangentsIn.clear();
    this.lineTangentsOut.clear();
    this.lineSides.clear();

    this.vertices.length = 0;
    this.edges.length = 0;
    this.vertexColors.length = 0;
    this.vertexStrokeColors.length = 0;
    this.lineVertexColors.clear();
    this.vertexNormals.length = 0;
    this.uvs.length = 0;

    this.dirtyFlags = {};
  }

  hasFillTransparency() {
    if (this._hasFillTransparency === undefined) {
      this._hasFillTransparency = false;
      for (let i = 0; i < this.vertexColors.length; i += 4) {
        if (this.vertexColors[i + 3] < 1) {
          this._hasFillTransparency = true;
          break;
        }
      }
    }
    return this._hasFillTransparency;
  }
  hasStrokeTransparency() {
    if (this._hasStrokeTransparency === undefined) {
      this._hasStrokeTransparency = false;
      for (let i = 0; i < this.lineVertexColors.length; i += 4) {
        if (this.lineVertexColors[i + 3] < 1) {
          this._hasStrokeTransparency = true;
          break;
        }
      }
    }
    return this._hasStrokeTransparency;
  }

  /**
   * Removes the internal colors of p5.Geometry.
   * Using `clearColors()`, you can use `fill()` to supply new colors before drawing each shape.
   * If `clearColors()` is not used, the shapes will use their internal colors by ignoring `fill()`.
   *
   * @method clearColors
   *
   * @example
   * <div>
   * <code>
   * let shape01;
   * let shape02;
   * let points = [];
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   points.push(new p5.Vector(-1, -1, 0), new p5.Vector(-1, 1, 0),
   *     new p5.Vector(1, -1, 0), new p5.Vector(-1, -1, 0));
   *   buildShape01();
   *   buildShape02();
   * }
   * function draw() {
   *   background(0);
   *   fill('pink'); // shape01 retains its internal blue color, so it won't turn pink.
   *   model(shape01);
   *   fill('yellow'); // Now, shape02 is yellow.
   *   model(shape02);
   * }
   *
   * function buildShape01() {
   *   beginGeometry();
   *   fill('blue'); // shape01's color is blue because its internal colors remain.
   *   beginShape();
   *   for (let vec of points) vertex(vec.x * 100, vec.y * 100, vec.z * 100);
   *   endShape(CLOSE);
   *   shape01 = endGeometry();
   * }
   *
   * function buildShape02() {
   *   beginGeometry();
   *   fill('red');  // shape02.clearColors() removes its internal colors. Now, shape02 is red.
   *   beginShape();
   *   for (let vec of points) vertex(vec.x * 200, vec.y * 200, vec.z * 200);
   *   endShape(CLOSE);
   *   shape02 = endGeometry();
   *   shape02.clearColors(); // Resets shape02's colors.
   * }
   * </code>
   * </div>
   */
  clearColors() {
    this.vertexColors = [];
    return this;
  }


  /**
 * The `saveObj()` function allows the export of p5.Geometry objects as
 * 3D models in the Wavefront .obj file format.
 * This functionality enables users to generate
 * custom 3D models within a p5.js sketch and then save them for use
 * in other applications or for further development in 3D modeling software.
 *
 * This method should be called on a custom p5.Geometry 3D object, which typically contains
 * vertices, faces, texture coordinates (UVs),
 * and vertex normals. The exported .obj file will include all these components formatted according
 * to the OBJ file specification.
 *
 * @method saveObj
 * @for p5.Geometry
 *
 * @param {String} [fileName='model.obj'] - The name of the file to save the model as.
 *                                          If not specified, the default file name will be 'model.obj'.
 * @example
 * <div>
 * <code>
 * //Creates a custom Octahedron
 * let octa;
 * let points = [];
 * let angleX = 0;
 * let angleY = 0;
 * function setup() {
 *   createCanvas(400, 400, WEBGL);
 *   points = [
 *     new p5.Vector(1, 0, 0),
 *     new p5.Vector(0, 1, 0),
 *     new p5.Vector(0, 0, 1),
 *     new p5.Vector(-1, 0, 0),
 *     new p5.Vector(0, -1, 0),
 *     new p5.Vector(0, 0, -1)
 *   ];
 *   buildOcta();
 * }
 *
 * function draw() {
 *   background(0);
 *   rotateX(angleX);
 *   rotateY(angleY);
 *   angleX += 0.01;
 *   angleY += 0.01;
 *   model(octa);
 * }
 * function buildOcta() {
 *   beginGeometry();
 *
 *   let faces = [
 *     [0, 4, 5],
 *     [1, 0, 5],
 *     [0, 1, 2],
 *     [3, 1, 5],
 *     [3, 4, 2],
 *     [4, 3, 5],
 *     [1, 3, 2],
 *     [4, 0, 2]
 *   ];
 *   faces.forEach(face => {
 *     beginShape();
 *     face.forEach(idx => {
 *       let v = points[idx];
 *       vertex(v.x * 100, v.y * 100, v.z * 100);
 *     });
 *     endShape(CLOSE);
 *   });
 *
 *   octa = endGeometry();
 *   octa.saveObj();
 * }
 * </code>
 * </div>
 */

  saveObj (fileName='model.obj'){
    let objStr= '';


    // Vertices
    this.vertices.forEach(v => {
      objStr += `v ${v.x} ${v.y} ${v.z}\n`;
    });

    // Texture Coordinates (UVs)
    if (this.uvs && this.uvs.length > 0) {
      for (let i = 0; i < this.uvs.length; i += 2) {
        objStr += `vt ${this.uvs[i]} ${this.uvs[i + 1]}\n`;
      }
    }

    // Vertex Normals
    if (this.vertexNormals && this.vertexNormals.length > 0) {
      this.vertexNormals.forEach(n => {
        objStr += `vn ${n.x} ${n.y} ${n.z}\n`;
      });

    }
    // Faces
    this.faces.forEach(face => {
      // OBJ format uses 1-based indices
      const faceStr = face.map(index => index + 1).join(' ');
      objStr += `f ${faceStr}\n`;
    });

    const blob = new Blob([objStr], { type: 'text/plain' });
    p5.prototype.downloadFile(blob, fileName , 'obj');

  }
  /**
 * Flips the U texture coordinates of the model.
 * @method flipU
 * @for p5.Geometry
 *
 * @returns {p5.Geometry}
 *
 * @example
 * <div>
 * <code>
 * let img;
 * let model1;
 * let model2;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(150, 150, WEBGL);
 *   background(200);
 *
 *   model1 = createShape(50, 50);
 *   model2 = createShape(50, 50);
 *   model2.flipU();
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // original
 *   push();
 *   translate(-40, 0, 0);
 *   texture(img);
 *   noStroke();
 *   plane(50);
 *   model(model1);
 *   pop();
 *
 *   // flipped
 *   push();
 *   translate(40, 0, 0);
 *   texture(img);
 *   noStroke();
 *   plane(50);
 *   model(model2);
 *   pop();
 * }
 *
 * function createShape(w, h) {
 *   return buildGeometry(() => {
 *     textureMode(NORMAL);
 *     beginShape();
 *     vertex(-w / 2, -h / 2, 0, 0);
 *     vertex(w / 2, -h / 2, 1, 0);
 *     vertex(w / 2, h / 2, 1, 1);
 *     vertex(-w / 2, h / 2, 0, 1);
 *     endShape(CLOSE);
 *   });
 * }
 * </code>
 * </div>
 */
  flipU() {
    this.uvs = this.uvs.flat().map((val, index) => {
      if (index % 2 === 0) {
        return 1 - val;
      } else {
        return val;
      }
    });
  }
  /**
 * Flips the V texture coordinates of the model.
 * @method flipV
 * @for p5.Geometry
 *
 * @returns {p5.Geometry}
 *
 * @example
 * <div>
 * <code>
 * let img;
 * let model1;
 * let model2;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(150, 150, WEBGL);
 *   background(200);
 *
 *   model1 = createShape(50, 50);
 *   model2 = createShape(50, 50);
 *   model2.flipV();
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // original
 *   push();
 *   translate(-40, 0, 0);
 *   texture(img);
 *   noStroke();
 *   plane(50);
 *   model(model1);
 *   pop();
 *
 *   // flipped
 *   push();
 *   translate(40, 0, 0);
 *   texture(img);
 *   noStroke();
 *   plane(50);
 *   model(model2);
 *   pop();
 * }
 *
 * function createShape(w, h) {
 *   return buildGeometry(() => {
 *     textureMode(NORMAL);
 *     beginShape();
 *     vertex(-w / 2, -h / 2, 0, 0);
 *     vertex(w / 2, -h / 2, 1, 0);
 *     vertex(w / 2, h / 2, 1, 1);
 *     vertex(-w / 2, h / 2, 0, 1);
 *     endShape(CLOSE);
 *   });
 * }
 * </code>
 * </div>
 */
  flipV() {
    this.uvs = this.uvs.flat().map((val, index) => {
      if (index % 2 === 0) {
        return val;
      } else {
        return 1 - val;
      }
    });
  }
  /**
 * computes faces for geometry objects based on the vertices.
 * @method computeFaces
 * @chainable
 */
  computeFaces() {
    this.faces.length = 0;
    const sliceCount = this.detailX + 1;
    let a, b, c, d;
    for (let i = 0; i < this.detailY; i++) {
      for (let j = 0; j < this.detailX; j++) {
        a = i * sliceCount + j; // + offset;
        b = i * sliceCount + j + 1; // + offset;
        c = (i + 1) * sliceCount + j + 1; // + offset;
        d = (i + 1) * sliceCount + j; // + offset;
        this.faces.push([a, b, d]);
        this.faces.push([d, b, c]);
      }
    }
    return this;
  }

  _getFaceNormal(faceId) {
    //This assumes that vA->vB->vC is a counter-clockwise ordering
    const face = this.faces[faceId];
    const vA = this.vertices[face[0]];
    const vB = this.vertices[face[1]];
    const vC = this.vertices[face[2]];
    const ab = p5.Vector.sub(vB, vA);
    const ac = p5.Vector.sub(vC, vA);
    const n = p5.Vector.cross(ab, ac);
    const ln = p5.Vector.mag(n);
    let sinAlpha = ln / (p5.Vector.mag(ab) * p5.Vector.mag(ac));
    if (sinAlpha === 0 || isNaN(sinAlpha)) {
      console.warn(
        'p5.Geometry.prototype._getFaceNormal:',
        'face has colinear sides or a repeated vertex'
      );
      return n;
    }
    if (sinAlpha > 1) sinAlpha = 1; // handle float rounding error
    return n.mult(Math.asin(sinAlpha) / ln);
  }
  /**
   * This function calculates normals for each face, where each vertex's normal is the average of the normals of all faces it's connected to.
   * i.e computes smooth normals per vertex as an average of each face.
   *
   * When using `FLAT` shading, vertices are disconnected/duplicated i.e each face has its own copy of vertices.
   * When using `SMOOTH` shading, vertices are connected/deduplicated i.e each face has its vertices shared with other faces.
   *
   * Options can include:
   * - `roundToPrecision`: Precision value for rounding computations. Defaults to 3.
   *
   * @method computeNormals
   * @param {String} [shadingType] shading type (`FLAT` for flat shading or `SMOOTH` for smooth shading) for buildGeometry() outputs. Defaults to `FLAT`.
   * @param {Object} [options] An optional object with configuration.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let helix;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   helix = buildGeometry(() => {
   *     beginShape();
   *
   *     for (let i = 0; i < TWO_PI * 3; i += 0.6) {
   *       let radius = 20;
   *       let x = cos(i) * radius;
   *       let y = sin(i) * radius;
   *       let z = map(i, 0, TWO_PI * 3, -30, 30);
   *       vertex(x, y, z);
   *     }
   *     endShape();
   *   });
   *   helix.computeNormals();
   * }
   * function draw() {
   *   background(255);
   *   stroke(0);
   *   fill(150, 200, 250);
   *   lights();
   *   rotateX(PI*0.2);
   *   orbitControl();
   *   model(helix);
   * }
   * </code>
   * </div>
   *
   * @alt
   * A 3D helix using the computeNormals() function by default uses `FLAT` to create a flat shading effect on the helix.
   *
   * @example
   * <div>
   * <code>
   * let star;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   star = buildGeometry(() => {
   *     beginShape();
   *     for (let i = 0; i < TWO_PI; i += PI / 5) {
   *       let outerRadius = 60;
   *       let innerRadius = 30;
   *       let xOuter = cos(i) * outerRadius;
   *       let yOuter = sin(i) * outerRadius;
   *       let zOuter = random(-20, 20);
   *       vertex(xOuter, yOuter, zOuter);
   *
   *       let nextI = i + PI / 5 / 2;
   *       let xInner = cos(nextI) * innerRadius;
   *       let yInner = sin(nextI) * innerRadius;
   *       let zInner = random(-20, 20);
   *       vertex(xInner, yInner, zInner);
   *     }
   *     endShape(CLOSE);
   *   });
   *   star.computeNormals(SMOOTH);
   * }
   * function draw() {
   *   background(255);
   *   stroke(0);
   *   fill(150, 200, 250);
   *   lights();
   *   rotateX(PI*0.2);
   *   orbitControl();
   *   model(star);
   * }
   * </code>
   * </div>
   *
   * @alt
   * A star-like geometry, here the computeNormals(SMOOTH) is applied for a smooth shading effect.
   * This helps to avoid the faceted appearance that can occur with flat shading.
   */
  computeNormals(shadingType = constants.FLAT, { roundToPrecision = 3 } = {}) {
    const vertexNormals = this.vertexNormals;
    let vertices = this.vertices;
    const faces = this.faces;
    let iv;

    if (shadingType === constants.SMOOTH) {
      const vertexIndices = {};
      const uniqueVertices = [];

      const power = Math.pow(10, roundToPrecision);
      const rounded = val => Math.round(val * power) / power;
      const getKey = vert =>
        `${rounded(vert.x)},${rounded(vert.y)},${rounded(vert.z)}`;

      // loop through each vertex and add uniqueVertices
      for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const key = getKey(vertex);
        if (vertexIndices[key] === undefined) {
          vertexIndices[key] = uniqueVertices.length;
          uniqueVertices.push(vertex);
        }
      }

      // update face indices to use the deduplicated vertex indices
      faces.forEach(face => {
        for (let fv = 0; fv < 3; ++fv) {
          const originalVertexIndex = face[fv];
          const originalVertex = vertices[originalVertexIndex];
          const key = getKey(originalVertex);
          face[fv] = vertexIndices[key];
        }
      });

      // update edge indices to use the deduplicated vertex indices
      this.edges.forEach(edge => {
        for (let ev = 0; ev < 2; ++ev) {
          const originalVertexIndex = edge[ev];
          const originalVertex = vertices[originalVertexIndex];
          const key = getKey(originalVertex);
          edge[ev] = vertexIndices[key];
        }
      });

      // update the deduplicated vertices
      this.vertices = vertices = uniqueVertices;
    }

    // initialize the vertexNormals array with empty vectors
    vertexNormals.length = 0;
    for (iv = 0; iv < vertices.length; ++iv) {
      vertexNormals.push(new p5.Vector());
    }

    // loop through all the faces adding its normal to the normal
    // of each of its vertices
    faces.forEach((face, f) => {
      const faceNormal = this._getFaceNormal(f);

      // all three vertices get the normal added
      for (let fv = 0; fv < 3; ++fv) {
        const vertexIndex = face[fv];
        vertexNormals[vertexIndex].add(faceNormal);
      }
    });

    // normalize the normals
    for (iv = 0; iv < vertices.length; ++iv) {
      vertexNormals[iv].normalize();
    }

    return this;
  }

  /**
 * Averages the vertex normals. Used in curved
 * surfaces
 * @method averageNormals
 * @chainable
 */
  averageNormals() {
    for (let i = 0; i <= this.detailY; i++) {
      const offset = this.detailX + 1;
      let temp = p5.Vector.add(
        this.vertexNormals[i * offset],
        this.vertexNormals[i * offset + this.detailX]
      );

      temp = p5.Vector.div(temp, 2);
      this.vertexNormals[i * offset] = temp;
      this.vertexNormals[i * offset + this.detailX] = temp;
    }
    return this;
  }

  /**
 * Averages pole normals.  Used in spherical primitives
 * @method averagePoleNormals
 * @chainable
 */
  averagePoleNormals() {
    //average the north pole
    let sum = new p5.Vector(0, 0, 0);
    for (let i = 0; i < this.detailX; i++) {
      sum.add(this.vertexNormals[i]);
    }
    sum = p5.Vector.div(sum, this.detailX);

    for (let i = 0; i < this.detailX; i++) {
      this.vertexNormals[i] = sum;
    }

    //average the south pole
    sum = new p5.Vector(0, 0, 0);
    for (
      let i = this.vertices.length - 1;
      i > this.vertices.length - 1 - this.detailX;
      i--
    ) {
      sum.add(this.vertexNormals[i]);
    }
    sum = p5.Vector.div(sum, this.detailX);

    for (
      let i = this.vertices.length - 1;
      i > this.vertices.length - 1 - this.detailX;
      i--
    ) {
      this.vertexNormals[i] = sum;
    }
    return this;
  }

  /**
 * Create a 2D array for establishing stroke connections
 * @private
 * @chainable
 */
  _makeTriangleEdges() {
    this.edges.length = 0;

    for (let j = 0; j < this.faces.length; j++) {
      this.edges.push([this.faces[j][0], this.faces[j][1]]);
      this.edges.push([this.faces[j][1], this.faces[j][2]]);
      this.edges.push([this.faces[j][2], this.faces[j][0]]);
    }

    return this;
  }

  /**
 * Converts each line segment into the vertices and vertex attributes needed
 * to turn the line into a polygon on screen. This will include:
 * - Two triangles line segment to create a rectangle
 * - Two triangles per endpoint to create a stroke cap rectangle. A fragment
 *   shader is responsible for displaying the appropriate cap style within
 *   that rectangle.
 * - Four triangles per join between adjacent line segments, creating a quad on
 *   either side of the join, perpendicular to the lines. A vertex shader will
 *   discard the quad in the "elbow" of the join, and a fragment shader will
 *   display the appropriate join style within the remaining quad.
 *
 * @private
 * @chainable
 */
  _edgesToVertices() {
    this.lineVertices.clear();
    this.lineTangentsIn.clear();
    this.lineTangentsOut.clear();
    this.lineSides.clear();

    const potentialCaps = new Map();
    const connected = new Set();
    let lastValidDir;
    for (let i = 0; i < this.edges.length; i++) {
      const prevEdge = this.edges[i - 1];
      const currEdge = this.edges[i];
      const begin = this.vertices[currEdge[0]];
      const end = this.vertices[currEdge[1]];
      const fromColor = this.vertexStrokeColors.length > 0
        ? this.vertexStrokeColors.slice(
          currEdge[0] * 4,
          (currEdge[0] + 1) * 4
        )
        : [0, 0, 0, 0];
      const toColor = this.vertexStrokeColors.length > 0
        ? this.vertexStrokeColors.slice(
          currEdge[1] * 4,
          (currEdge[1] + 1) * 4
        )
        : [0, 0, 0, 0];
      const dir = end
        .copy()
        .sub(begin)
        .normalize();
      const dirOK = dir.magSq() > 0;
      if (dirOK) {
        this._addSegment(begin, end, fromColor, toColor, dir);
      }

      if (i > 0 && prevEdge[1] === currEdge[0]) {
        if (!connected.has(currEdge[0])) {
          connected.add(currEdge[0]);
          potentialCaps.delete(currEdge[0]);
          // Add a join if this segment shares a vertex with the previous. Skip
          // actually adding join vertices if either the previous segment or this
          // one has a length of 0.
          //
          // Don't add a join if the tangents point in the same direction, which
          // would mean the edges line up exactly, and there is no need for a join.
          if (lastValidDir && dirOK && dir.dot(lastValidDir) < 1 - 1e-8) {
            this._addJoin(begin, lastValidDir, dir, fromColor);
          }
        }
      } else {
        // Start a new line
        if (dirOK && !connected.has(currEdge[0])) {
          const existingCap = potentialCaps.get(currEdge[0]);
          if (existingCap) {
            this._addJoin(
              begin,
              existingCap.dir,
              dir,
              fromColor
            );
            potentialCaps.delete(currEdge[0]);
            connected.add(currEdge[0]);
          } else {
            potentialCaps.set(currEdge[0], {
              point: begin,
              dir: dir.copy().mult(-1),
              color: fromColor
            });
          }
        }
        if (lastValidDir && !connected.has(prevEdge[1])) {
          const existingCap = potentialCaps.get(prevEdge[1]);
          if (existingCap) {
            this._addJoin(
              this.vertices[prevEdge[1]],
              lastValidDir,
              existingCap.dir.copy().mult(-1),
              fromColor
            );
            potentialCaps.delete(prevEdge[1]);
            connected.add(prevEdge[1]);
          } else {
            // Close off the last segment with a cap
            potentialCaps.set(prevEdge[1], {
              point: this.vertices[prevEdge[1]],
              dir: lastValidDir,
              color: fromColor
            });
          }
          lastValidDir = undefined;
        }
      }

      if (i === this.edges.length - 1 && !connected.has(currEdge[1])) {
        const existingCap = potentialCaps.get(currEdge[1]);
        if (existingCap) {
          this._addJoin(
            end,
            dir,
            existingCap.dir.copy().mult(-1),
            toColor
          );
          potentialCaps.delete(currEdge[1]);
          connected.add(currEdge[1]);
        } else {
          potentialCaps.set(currEdge[1], {
            point: end,
            dir,
            color: toColor
          });
        }
      }

      if (dirOK) {
        lastValidDir = dir;
      }
    }
    for (const { point, dir, color } of potentialCaps.values()) {
      this._addCap(point, dir, color);
    }
    return this;
  }

  /**
 * Adds the vertices and vertex attributes for two triangles making a rectangle
 * for a straight line segment. A vertex shader is responsible for picking
 * proper coordinates on the screen given the centerline positions, the tangent,
 * and the side of the centerline each vertex belongs to. Sides follow the
 * following scheme:
 *
 *  -1            -1
 *   o-------------o
 *   |             |
 *   o-------------o
 *   1             1
 *
 * @private
 * @chainable
 */
  _addSegment(
    begin,
    end,
    fromColor,
    toColor,
    dir
  ) {
    const a = begin.array();
    const b = end.array();
    const dirArr = dir.array();
    this.lineSides.push(1, 1, -1, 1, -1, -1);
    for (const tangents of [this.lineTangentsIn, this.lineTangentsOut]) {
      for (let i = 0; i < 6; i++) {
        tangents.push(...dirArr);
      }
    }
    this.lineVertices.push(...a, ...b, ...a, ...b, ...b, ...a);
    this.lineVertexColors.push(
      ...fromColor,
      ...toColor,
      ...fromColor,
      ...toColor,
      ...toColor,
      ...fromColor
    );
    return this;
  }

  /**
 * Adds the vertices and vertex attributes for two triangles representing the
 * stroke cap of a line. A fragment shader is responsible for displaying the
 * appropriate cap style within the rectangle they make.
 *
 * The lineSides buffer will include the following values for the points on
 * the cap rectangle:
 *
 *           -1  -2
 * -----------o---o
 *            |   |
 * -----------o---o
 *            1   2
 * @private
 * @chainable
 */
  _addCap(point, tangent, color) {
    const ptArray = point.array();
    const tanInArray = tangent.array();
    const tanOutArray = [0, 0, 0];
    for (let i = 0; i < 6; i++) {
      this.lineVertices.push(...ptArray);
      this.lineTangentsIn.push(...tanInArray);
      this.lineTangentsOut.push(...tanOutArray);
      this.lineVertexColors.push(...color);
    }
    this.lineSides.push(-1, 2, -2, 1, 2, -1);
    return this;
  }

  /**
 * Adds the vertices and vertex attributes for four triangles representing a
 * join between two adjacent line segments. This creates a quad on either side
 * of the shared vertex of the two line segments, with each quad perpendicular
 * to the lines. A vertex shader will discard all but the quad in the "elbow" of
 * the join, and a fragment shader will display the appropriate join style
 * within the remaining quad.
 *
 * The lineSides buffer will include the following values for the points on
 * the join rectangles:
 *
 *            -1     -2
 * -------------o----o
 *              |    |
 *       1 o----o----o -3
 *         |    | 0  |
 * --------o----o    |
 *        2|    3    |
 *         |         |
 *         |         |
 * @private
 * @chainable
 */
  _addJoin(
    point,
    fromTangent,
    toTangent,
    color
  ) {
    const ptArray = point.array();
    const tanInArray = fromTangent.array();
    const tanOutArray = toTangent.array();
    for (let i = 0; i < 12; i++) {
      this.lineVertices.push(...ptArray);
      this.lineTangentsIn.push(...tanInArray);
      this.lineTangentsOut.push(...tanOutArray);
      this.lineVertexColors.push(...color);
    }
    this.lineSides.push(-1, -3, -2, -1, 0, -3);
    this.lineSides.push(3, 1, 2, 3, 0, 1);
    return this;
  }

  /**
 * Modifies all vertices to be centered within the range -100 to 100.
 * @method normalize
 * @chainable
 */
  normalize() {
    if (this.vertices.length > 0) {
      // Find the corners of our bounding box
      const maxPosition = this.vertices[0].copy();
      const minPosition = this.vertices[0].copy();

      for (let i = 0; i < this.vertices.length; i++) {
        maxPosition.x = Math.max(maxPosition.x, this.vertices[i].x);
        minPosition.x = Math.min(minPosition.x, this.vertices[i].x);
        maxPosition.y = Math.max(maxPosition.y, this.vertices[i].y);
        minPosition.y = Math.min(minPosition.y, this.vertices[i].y);
        maxPosition.z = Math.max(maxPosition.z, this.vertices[i].z);
        minPosition.z = Math.min(minPosition.z, this.vertices[i].z);
      }

      const center = p5.Vector.lerp(maxPosition, minPosition, 0.5);
      const dist = p5.Vector.sub(maxPosition, minPosition);
      const longestDist = Math.max(Math.max(dist.x, dist.y), dist.z);
      const scale = 200 / longestDist;

      for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].sub(center);
        this.vertices[i].mult(scale);
      }
    }
    return this;
  }
};
export default p5.Geometry;
