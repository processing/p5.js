/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

//some of the functions are adjusted from Three.js(http://threejs.org)

import * as constants from '../core/constants';
import { DataArray } from './p5.DataArray';
import { Vector } from '../math/p5.Vector';

class Geometry {
  constructor(detailX, detailY, callback, renderer) {
    this.renderer = renderer;
    this.vertices = [];

    this.boundingBoxCache = null;


    //an array containing every vertex for stroke drawing
    this.lineVertices = new DataArray();

    // The tangents going into or out of a vertex on a line. Along a straight
    // line segment, both should be equal. At an endpoint, one or the other
    // will not exist and will be all 0. In joins between line segments, they
    // may be different, as they will be the tangents on either side of the join.
    this.lineTangentsIn = new DataArray();
    this.lineTangentsOut = new DataArray();

    // When drawing lines with thickness, entries in this buffer represent which
    // side of the centerline the vertex will be placed. The sign of the number
    // will represent the side of the centerline, and the absolute value will be
    // used as an enum to determine which part of the cap or join each vertex
    // represents. See the doc comments for _addCap and _addJoin for diagrams.
    this.lineSides = new DataArray();

    this.vertexNormals = [];

    this.faces = [];

    this.uvs = [];
    // a 2D array containing edge connectivity pattern for create line vertices
    //based on faces for most objects;
    this.edges = [];
    this.vertexColors = [];

    // One color per vertex representing the stroke color at that vertex
    this.vertexStrokeColors = [];

    this.userVertexProperties = {};

    // One color per line vertex, generated automatically based on
    // vertexStrokeColors in _edgesToVertices()
    this.lineVertexColors = new DataArray();
    this.detailX = detailX !== undefined ? detailX : 1;
    this.detailY = detailY !== undefined ? detailY : 1;
    this.dirtyFlags = {};

    this._hasFillTransparency = undefined;
    this._hasStrokeTransparency = undefined;

    this.gid = `_p5_Geometry_${Geometry.nextId}`;
    Geometry.nextId++;
    if (callback instanceof Function) {
      callback.call(this);
    }
  }

  /**
 * Calculates the position and size of the smallest box that contains the geometry.
 *
 * A bounding box is the smallest rectangular prism that contains the entire
 * geometry. It's defined by the box's minimum and maximum coordinates along
 * each axis, as well as the size (length) and offset (center).
 *
 * Calling `myGeometry.calculateBoundingBox()` returns an object with four
 * properties that describe the bounding box:
 *
 * ```js
 * // Get myGeometry's bounding box.
 * let bbox = myGeometry.calculateBoundingBox();
 *
 * // Print the bounding box to the console.
 * console.log(bbox);
 *
 * // {
 * //  // The minimum coordinate along each axis.
 * //  min: { x: -1, y: -2, z: -3 },
 * //
 * //  // The maximum coordinate along each axis.
 * //  max: { x: 1, y: 2, z: 3},
 * //
 * //  // The size (length) along each axis.
 * //  size: { x: 2, y: 4, z: 6},
 * //
 * //  // The offset (center) along each axis.
 * //  offset: { x: 0, y: 0, z: 0}
 * // }
 * ```
 *
 * @returns {Object} bounding box of the geometry.
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * let particles;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a new p5.Geometry object with random spheres.
 *   particles = buildGeometry(createParticles);
 *
 *   describe('Ten white spheres placed randomly against a gray background. A box encloses the spheres.');
 * }
 *
 * function draw() {
 *   background(50);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on the lights.
 *   lights();
 *
 *   // Style the particles.
 *   noStroke();
 *   fill(255);
 *
 *   // Draw the particles.
 *   model(particles);
 *
 *   // Calculate the bounding box.
 *   let bbox = particles.calculateBoundingBox();
 *
 *   // Translate to the bounding box's center.
 *   translate(bbox.offset.x, bbox.offset.y, bbox.offset.z);
 *
 *   // Style the bounding box.
 *   stroke(255);
 *   noFill();
 *
 *   // Draw the bounding box.
 *   box(bbox.size.x, bbox.size.y, bbox.size.z);
 * }
 *
 * function createParticles() {
 *   for (let i = 0; i < 10; i += 1) {
 *     // Calculate random coordinates.
 *     let x = randomGaussian(0, 15);
 *     let y = randomGaussian(0, 15);
 *     let z = randomGaussian(0, 15);
 *
 *     push();
 *     // Translate to the particle's coordinates.
 *     translate(x, y, z);
 *     // Draw the particle.
 *     sphere(3);
 *     pop();
 *   }
 * }
 * </code>
 * </div>
 */
  calculateBoundingBox() {
    if (this.boundingBoxCache) {
      return this.boundingBoxCache; // Return cached result if available
    }

    let minVertex = new Vector(
      Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    let maxVertex = new Vector(
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
    let size = new Vector(maxVertex.x - minVertex.x,
      maxVertex.y - minVertex.y, maxVertex.z - minVertex.z);
    let offset = new Vector((minVertex.x + maxVertex.x) / 2,
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

    for (const propName in this.userVertexProperties){
      this.userVertexProperties[propName].delete();
    }
    this.userVertexProperties = {};

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
   * Removes the geometry’s internal colors.
   *
   * `p5.Geometry` objects can be created with "internal colors" assigned to
   * vertices or the entire shape. When a geometry has internal colors,
   * <a href="#/p5/fill">fill()</a> has no effect. Calling
   * `myGeometry.clearColors()` allows the
   * <a href="#/p5/fill">fill()</a> function to apply color to the geometry.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Geometry object.
   *   // Set its internal color to red.
   *   let myGeometry = buildGeometry(function() {
   *     fill(255, 0, 0);
   *     plane(20);
   *   });
   *
   *   // Style the shape.
   *   noStroke();
   *
   *   // Draw the p5.Geometry object (center).
   *   model(myGeometry);
   *
   *   // Translate the origin to the bottom-right.
   *   translate(25, 25, 0);
   *
   *   // Try to fill the geometry with green.
   *   fill(0, 255, 0);
   *
   *   // Draw the geometry again (bottom-right).
   *   model(myGeometry);
   *
   *   // Clear the geometry's colors.
   *   myGeometry.clearColors();
   *
   *   // Fill the geometry with blue.
   *   fill(0, 0, 255);
   *
   *   // Translate the origin up.
   *   translate(0, -50, 0);
   *
   *   // Draw the geometry again (top-right).
   *   model(myGeometry);
   *
   *   describe(
   *     'Three squares drawn against a gray background. Red squares are at the center and the bottom-right. A blue square is at the top-right.'
   *   );
   * }
   * </code>
   * </div>
   */
  clearColors() {
    this.vertexColors = [];
    return this;
  }

  /**
   * The `saveObj()` function exports `p5.Geometry` objects as
   * 3D models in the Wavefront .obj file format.
   * This way, you can use the 3D shapes you create in p5.js in other software
   * for rendering, animation, 3D printing, or more.
   *
   * The exported .obj file will include the faces and vertices of the `p5.Geometry`,
   * as well as its texture coordinates and normals, if it has them.
   *
   * @method saveObj
   * @param {String} [fileName='model.obj'] The name of the file to save the model as.
   *                                        If not specified, the default file name will be 'model.obj'.
   * @example
   * <div>
   * <code>
   * let myModel;
   * let saveBtn;
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myModel = buildGeometry(function()) {
   *     for (let i = 0; i < 5; i++) {
   *       push();
   *       translate(
   *         random(-75, 75),
   *         random(-75, 75),
   *         random(-75, 75)
   *       );
   *       sphere(random(5, 50));
   *       pop();
   *     }
   *   });
   *
   *   saveBtn = createButton('Save .obj');
   *   saveBtn.mousePressed(() => myModel.saveObj());
   *
   *   describe('A few spheres rotating in space');
   * }
   *
   * function draw() {
   *   background(0);
   *   noStroke();
   *   lights();
   *   rotateX(millis() * 0.001);
   *   rotateY(millis() * 0.002);
   *   model(myModel);
   * }
   * </code>
   * </div>
   */
  saveObj(fileName = 'model.obj') {
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
    // Faces, obj vertex indices begin with 1 and not 0
    // texture coordinate (uvs) and vertexNormal indices
    // are indicated with trailing ints vertex/normal/uv
    // ex 1/1/1 or 2//2 for vertices without uvs
    this.faces.forEach(face => {
      let faceStr = 'f';
      face.forEach(index =>{
        faceStr += ' ';
        faceStr += index + 1;
        if (this.vertexNormals.length > 0 || this.uvs.length > 0) {
          faceStr += '/';
          if (this.uvs.length > 0) {
            faceStr += index + 1;
          }
          faceStr += '/';
          if (this.vertexNormals.length > 0) {
            faceStr += index + 1;
          }
        }
      });
      objStr += faceStr + '\n';
    });

    const blob = new Blob([objStr], { type: 'text/plain' });
    fn.downloadFile(blob, fileName , 'obj');

  }

  /**
   * The `saveStl()` function exports `p5.Geometry` objects as
   * 3D models in the STL stereolithography file format.
   * This way, you can use the 3D shapes you create in p5.js in other software
   * for rendering, animation, 3D printing, or more.
   *
   * The exported .stl file will include the faces, vertices, and normals of the `p5.Geometry`.
   *
   * By default, this method saves a text-based .stl file. Alternatively, you can save a more compact
   * but less human-readable binary .stl file by passing `{ binary: true }` as a second parameter.
   *
   * @method saveStl
   * @param {String} [fileName='model.stl'] The name of the file to save the model as.
   *                                        If not specified, the default file name will be 'model.stl'.
   * @param {Object} [options] Optional settings. Options can include a boolean `binary` property, which
   * controls whether or not a binary .stl file is saved. It defaults to false.
   * @example
   * <div>
   * <code>
   * let myModel;
   * let saveBtn1;
   * let saveBtn2;
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myModel = buildGeometry(function() {
   *     for (let i = 0; i < 5; i++) {
   *       push();
   *       translate(
   *         random(-75, 75),
   *         random(-75, 75),
   *         random(-75, 75)
   *       );
   *       sphere(random(5, 50));
   *       pop();
   *     }
   *   });
   *
   *   saveBtn1 = createButton('Save .stl');
   *   saveBtn1.mousePressed(function() {
   *     myModel.saveStl();
   *   });
   *   saveBtn2 = createButton('Save binary .stl');
   *   saveBtn2.mousePressed(function() {
   *     myModel.saveStl('model.stl', { binary: true });
   *   });
   *
   *   describe('A few spheres rotating in space');
   * }
   *
   * function draw() {
   *   background(0);
   *   noStroke();
   *   lights();
   *   rotateX(millis() * 0.001);
   *   rotateY(millis() * 0.002);
   *   model(myModel);
   * }
   * </code>
   * </div>
   */
  saveStl(fileName = 'model.stl', { binary = false } = {}){
    let modelOutput;
    let name = fileName.substring(0, fileName.lastIndexOf('.'));
    let faceNormals = [];
    for (let f of this.faces) {
      const U = Vector.sub(this.vertices[f[1]], this.vertices[f[0]]);
      const V = Vector.sub(this.vertices[f[2]], this.vertices[f[0]]);
      const nx = U.y * V.z - U.z * V.y;
      const ny = U.z * V.x - U.x * V.z;
      const nz = U.x * V.y - U.y * V.x;
      faceNormals.push(new Vector(nx, ny, nz).normalize());
    }
    if (binary) {
      let offset = 80;
      const bufferLength =
        this.faces.length * 2 + this.faces.length * 3 * 4 * 4 + 80 + 4;
      const arrayBuffer = new ArrayBuffer(bufferLength);
      modelOutput = new DataView(arrayBuffer);
      modelOutput.setUint32(offset, this.faces.length, true);
      offset += 4;
      for (const [key, f] of Object.entries(this.faces)) {
        const norm = faceNormals[key];
        modelOutput.setFloat32(offset, norm.x, true);
        offset += 4;
        modelOutput.setFloat32(offset, norm.y, true);
        offset += 4;
        modelOutput.setFloat32(offset, norm.z, true);
        offset += 4;
        for (let vertexIndex of f) {
          const vert = this.vertices[vertexIndex];
          modelOutput.setFloat32(offset, vert.x, true);
          offset += 4;
          modelOutput.setFloat32(offset, vert.y, true);
          offset += 4;
          modelOutput.setFloat32(offset, vert.z, true);
          offset += 4;
        }
        modelOutput.setUint16(offset, 0, true);
        offset += 2;
      }
    } else {
      modelOutput = 'solid ' + name + '\n';

      for (const [key, f] of Object.entries(this.faces)) {
        const norm = faceNormals[key];
        modelOutput +=
          ' facet norm ' + norm.x + ' ' + norm.y + ' ' + norm.z + '\n';
        modelOutput += '  outer loop' + '\n';
        for (let vertexIndex of f) {
          const vert = this.vertices[vertexIndex];
          modelOutput +=
            '   vertex ' + vert.x + ' ' + vert.y + ' ' + vert.z + '\n';
        }
        modelOutput += '  endloop' + '\n';
        modelOutput += ' endfacet' + '\n';
      }
      modelOutput += 'endsolid ' + name + '\n';
    }
    const blob = new Blob([modelOutput], { type: 'text/plain' });
    fn.downloadFile(blob, fileName, 'stl');
  }

  /**
   * Flips the geometry’s texture u-coordinates.
   *
   * In order for <a href="#/p5/texture">texture()</a> to work, the geometry
   * needs a way to map the points on its surface to the pixels in a rectangular
   * image that's used as a texture. The geometry's vertex at coordinates
   * `(x, y, z)` maps to the texture image's pixel at coordinates `(u, v)`.
   *
   * The <a href="#/p5.Geometry/uvs">myGeometry.uvs</a> array stores the
   * `(u, v)` coordinates for each vertex in the order it was added to the
   * geometry. Calling `myGeometry.flipU()` flips a geometry's u-coordinates
   * so that the texture appears mirrored horizontally.
   *
   * For example, a plane's four vertices are added clockwise starting from the
   * top-left corner. Here's how calling `myGeometry.flipU()` would change a
   * plane's texture coordinates:
   *
   * ```js
   * // Print the original texture coordinates.
   * // Output: [0, 0, 1, 0, 0, 1, 1, 1]
   * console.log(myGeometry.uvs);
   *
   * // Flip the u-coordinates.
   * myGeometry.flipU();
   *
   * // Print the flipped texture coordinates.
   * // Output: [1, 0, 0, 0, 1, 1, 0, 1]
   * console.log(myGeometry.uvs);
   *
   * // Notice the swaps:
   * // Top vertices: [0, 0, 1, 0] --> [1, 0, 0, 0]
   * // Bottom vertices: [0, 1, 1, 1] --> [1, 1, 0, 1]
   * ```
   *
   * @for p5.Geometry
   *
   * @example
   * <div>
   * <code>
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/laDefense.jpg');
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create p5.Geometry objects.
   *   let geom1 = buildGeometry(createShape);
   *   let geom2 = buildGeometry(createShape);
   *
   *   // Flip geom2's U texture coordinates.
   *   geom2.flipU();
   *
   *   // Left (original).
   *   push();
   *   translate(-25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom1);
   *   pop();
   *
   *   // Right (flipped).
   *   push();
   *   translate(25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom2);
   *   pop();
   *
   *   describe(
   *     'Two photos of a ceiling on a gray background. The photos are mirror images of each other.'
   *   );
   * }
   *
   * function createShape() {
   *   plane(40);
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
   * Flips the geometry’s texture v-coordinates.
   *
   * In order for <a href="#/p5/texture">texture()</a> to work, the geometry
   * needs a way to map the points on its surface to the pixels in a rectangular
   * image that's used as a texture. The geometry's vertex at coordinates
   * `(x, y, z)` maps to the texture image's pixel at coordinates `(u, v)`.
   *
   * The <a href="#/p5.Geometry/uvs">myGeometry.uvs</a> array stores the
   * `(u, v)` coordinates for each vertex in the order it was added to the
   * geometry. Calling `myGeometry.flipV()` flips a geometry's v-coordinates
   * so that the texture appears mirrored vertically.
   *
   * For example, a plane's four vertices are added clockwise starting from the
   * top-left corner. Here's how calling `myGeometry.flipV()` would change a
   * plane's texture coordinates:
   *
   * ```js
   * // Print the original texture coordinates.
   * // Output: [0, 0, 1, 0, 0, 1, 1, 1]
   * console.log(myGeometry.uvs);
   *
   * // Flip the v-coordinates.
   * myGeometry.flipV();
   *
   * // Print the flipped texture coordinates.
   * // Output: [0, 1, 1, 1, 0, 0, 1, 0]
   * console.log(myGeometry.uvs);
   *
   * // Notice the swaps:
   * // Left vertices: [0, 0] <--> [1, 0]
   * // Right vertices: [1, 0] <--> [1, 1]
   * ```
   *
   * @method flipV
   * @for p5.Geometry
   *
   * @example
   * <div>
   * <code>
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/laDefense.jpg');
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create p5.Geometry objects.
   *   let geom1 = buildGeometry(createShape);
   *   let geom2 = buildGeometry(createShape);
   *
   *   // Flip geom2's V texture coordinates.
   *   geom2.flipV();
   *
   *   // Left (original).
   *   push();
   *   translate(-25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom1);
   *   pop();
   *
   *   // Right (flipped).
   *   push();
   *   translate(25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom2);
   *   pop();
   *
   *   describe(
   *     'Two photos of a ceiling on a gray background. The photos are mirror images of each other.'
   *   );
   * }
   *
   * function createShape() {
   *   plane(40);
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
   * Computes the geometry's faces using its vertices.
   *
   * All 3D shapes are made by connecting sets of points called *vertices*. A
   * geometry's surface is formed by connecting vertices to form triangles that
   * are stitched together. Each triangular patch on the geometry's surface is
   * called a *face*. `myGeometry.computeFaces()` performs the math needed to
   * define each face based on the distances between vertices.
   *
   * The geometry's vertices are stored as <a href="#/p5.Vector">p5.Vector</a>
   * objects in the <a href="#/p5.Geometry/vertices">myGeometry.vertices</a>
   * array. The geometry's first vertex is the
   * <a href="#/p5.Vector">p5.Vector</a> object at `myGeometry.vertices[0]`,
   * its second vertex is `myGeometry.vertices[1]`, its third vertex is
   * `myGeometry.vertices[2]`, and so on.
   *
   * Calling `myGeometry.computeFaces()` fills the
   * <a href="#/p5.Geometry/faces">myGeometry.faces</a> array with three-element
   * arrays that list the vertices that form each face. For example, a geometry
   * made from a rectangle has two faces because a rectangle is made by joining
   * two triangles. <a href="#/p5.Geometry/faces">myGeometry.faces</a> for a
   * rectangle would be the two-dimensional array
   * `[[0, 1, 2], [2, 1, 3]]`. The first face, `myGeometry.faces[0]`, is the
   * array `[0, 1, 2]` because it's formed by connecting
   * `myGeometry.vertices[0]`, `myGeometry.vertices[1]`,and
   * `myGeometry.vertices[2]`. The second face, `myGeometry.faces[1]`, is the
   * array `[2, 1, 3]` because it's formed by connecting
   * `myGeometry.vertices[2]`, `myGeometry.vertices[1]`, and
   * `myGeometry.vertices[3]`.
   *
   * Note: `myGeometry.computeFaces()` only works when geometries have four or more vertices.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = new p5.Geometry();
   *
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(0, 40, 0);
   *   let v3 = createVector(40, 0, 0);
   *
   *   // Add the vertices to myGeometry's vertices array.
   *   myGeometry.vertices.push(v0, v1, v2, v3);
   *
   *   // Compute myGeometry's faces array.
   *   myGeometry.computeFaces();
   *
   *   describe('A red square drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the shape.
   *   noStroke();
   *   fill(255, 0, 0);
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object using a callback function.
   *   myGeometry = new p5.Geometry(1, 1, createShape);
   *
   *   describe('A red square drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the shape.
   *   noStroke();
   *   fill(255, 0, 0);
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(0, 40, 0);
   *   let v3 = createVector(40, 0, 0);
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   this.vertices.push(v0, v1, v2, v3);
   *
   *   // Compute the faces array.
   *   this.computeFaces();
   * }
   * </code>
   * </div>
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
    const ab = Vector.sub(vB, vA);
    const ac = Vector.sub(vC, vA);
    const n = Vector.cross(ab, ac);
    const ln = Vector.mag(n);
    let sinAlpha = ln / (Vector.mag(ab) * Vector.mag(ac));
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
   * Calculates the normal vector for each vertex on the geometry.
   *
   * All 3D shapes are made by connecting sets of points called *vertices*. A
   * geometry's surface is formed by connecting vertices to create triangles
   * that are stitched together. Each triangular patch on the geometry's
   * surface is called a *face*. `myGeometry.computeNormals()` performs the
   * math needed to orient each face. Orientation is important for lighting
   * and other effects.
   *
   * A face's orientation is defined by its *normal vector* which points out
   * of the face and is normal (perpendicular) to the surface. Calling
   * `myGeometry.computeNormals()` first calculates each face's normal vector.
   * Then it calculates the normal vector for each vertex by averaging the
   * normal vectors of the faces surrounding the vertex. The vertex normals
   * are stored as <a href="#/p5.Vector">p5.Vector</a> objects in the
   * <a href="#/p5.Geometry/vertexNormals">myGeometry.vertexNormals</a> array.
   *
   * The first parameter, `shadingType`, is optional. Passing the constant
   * `FLAT`, as in `myGeometry.computeNormals(FLAT)`, provides neighboring
   * faces with their own copies of the vertices they share. Surfaces appear
   * tiled with flat shading. Passing the constant `SMOOTH`, as in
   * `myGeometry.computeNormals(SMOOTH)`, makes neighboring faces reuse their
   * shared vertices. Surfaces appear smoother with smooth shading. By
   * default, `shadingType` is `FLAT`.
   *
   * The second parameter, `options`, is also optional. If an object with a
   * `roundToPrecision` property is passed, as in
   * `myGeometry.computeNormals(SMOOTH, { roundToPrecision: 5 })`, it sets the
   * number of decimal places to use for calculations. By default,
   * `roundToPrecision` uses 3 decimal places.
   *
   * @param {(FLAT|SMOOTH)} [shadingType=FLAT] shading type. either FLAT or SMOOTH. Defaults to `FLAT`.
   * @param {Object} [options] shading options.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(function() {
   *     torus();
   *   });
   *
   *   // Compute the vertex normals.
   *   myGeometry.computeNormals();
   *
   *   describe(
   *     "A white torus drawn on a dark gray background. Red lines extend outward from the torus' vertices."
   *   );
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateX(1);
   *
   *   // Style the helix.
   *   stroke(0);
   *
   *   // Display the helix.
   *   model(myGeometry);
   *
   *   // Style the normal vectors.
   *   stroke(255, 0, 0);
   *
   *   // Iterate over the vertices and vertexNormals arrays.
   *   for (let i = 0; i < myGeometry.vertices.length; i += 1) {
   *
   *     // Get the vertex p5.Vector object.
   *     let v = myGeometry.vertices[i];
   *
   *     // Get the vertex normal p5.Vector object.
   *     let n = myGeometry.vertexNormals[i];
   *
   *     // Calculate a point along the vertex normal.
   *     let p = p5.Vector.mult(n, 5);
   *
   *     // Draw the vertex normal as a red line.
   *     push();
   *     translate(v);
   *     line(0, 0, 0, p.x, p.y, p.z);
   *     pop();
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object using a callback function.
   *   myGeometry = new p5.Geometry();
   *
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(0, 40, 0);
   *   let v3 = createVector(40, 0, 0);
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   myGeometry.vertices.push(v0, v1, v2, v3);
   *
   *   // Compute the faces array.
   *   myGeometry.computeFaces();
   *
   *   // Compute the surface normals.
   *   myGeometry.computeNormals();
   *
   *   describe('A red square drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a white point light.
   *   pointLight(255, 255, 255, 0, 0, 10);
   *
   *   // Style the p5.Geometry object.
   *   noStroke();
   *   fill(255, 0, 0);
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(createShape);
   *
   *   // Compute normals using default (FLAT) shading.
   *   myGeometry.computeNormals(FLAT);
   *
   *   describe('A white, helical structure drawn on a dark gray background. Its faces appear faceted.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateX(1);
   *
   *   // Style the helix.
   *   noStroke();
   *
   *   // Display the helix.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create a helical shape.
   *   beginShape();
   *   for (let i = 0; i < TWO_PI * 3; i += 0.5) {
   *     let x = 30 * cos(i);
   *     let y = 30 * sin(i);
   *     let z = map(i, 0, TWO_PI * 3, -40, 40);
   *     vertex(x, y, z);
   *   }
   *   endShape();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(createShape);
   *
   *   // Compute normals using smooth shading.
   *   myGeometry.computeNormals(SMOOTH);
   *
   *   describe('A white, helical structure drawn on a dark gray background.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateX(1);
   *
   *   // Style the helix.
   *   noStroke();
   *
   *   // Display the helix.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create a helical shape.
   *   beginShape();
   *   for (let i = 0; i < TWO_PI * 3; i += 0.5) {
   *     let x = 30 * cos(i);
   *     let y = 30 * sin(i);
   *     let z = map(i, 0, TWO_PI * 3, -40, 40);
   *     vertex(x, y, z);
   *   }
   *   endShape();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(createShape);
   *
   *   // Create an options object.
   *   let options = { roundToPrecision: 5 };
   *
   *   // Compute normals using smooth shading.
   *   myGeometry.computeNormals(SMOOTH, options);
   *
   *   describe('A white, helical structure drawn on a dark gray background.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateX(1);
   *
   *   // Style the helix.
   *   noStroke();
   *
   *   // Display the helix.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create a helical shape.
   *   beginShape();
   *   for (let i = 0; i < TWO_PI * 3; i += 0.5) {
   *     let x = 30 * cos(i);
   *     let y = 30 * sin(i);
   *     let z = map(i, 0, TWO_PI * 3, -40, 40);
   *     vertex(x, y, z);
   *   }
   *   endShape();
   * }
   * </code>
   * </div>
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
      vertexNormals.push(new Vector());
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
   * @private
   * @chainable
   */
  averageNormals() {
    for (let i = 0; i <= this.detailY; i++) {
      const offset = this.detailX + 1;
      let temp = Vector.add(
        this.vertexNormals[i * offset],
        this.vertexNormals[i * offset + this.detailX]
      );

      temp = Vector.div(temp, 2);
      this.vertexNormals[i * offset] = temp;
      this.vertexNormals[i * offset + this.detailX] = temp;
    }
    return this;
  }

  /**
   * Averages pole normals.  Used in spherical primitives
   * @private
   * @chainable
   */
  averagePoleNormals() {
    //average the north pole
    let sum = new Vector(0, 0, 0);
    for (let i = 0; i < this.detailX; i++) {
      sum.add(this.vertexNormals[i]);
    }
    sum = Vector.div(sum, this.detailX);

    for (let i = 0; i < this.detailX; i++) {
      this.vertexNormals[i] = sum;
    }

    //average the south pole
    sum = new Vector(0, 0, 0);
    for (
      let i = this.vertices.length - 1;
      i > this.vertices.length - 1 - this.detailX;
      i--
    ) {
      sum.add(this.vertexNormals[i]);
    }
    sum = Vector.div(sum, this.detailX);

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
   * @example
   * <div>
   * <code>
   * let tetrahedron;
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   describe('A rotating tetrahedron');
   *
   *   tetrahedron = new p5.Geometry();
   *
   *   // Give each geometry a unique gid
   *   tetrahedron.gid = 'tetrahedron';
   *
   *   // Add four points of the tetrahedron
   *
   *   let radius = 50;
   *   // A 2D triangle:
   *   tetrahedron.vertices.push(createVector(radius, 0, 0));
   *   tetrahedron.vertices.push(createVector(radius, 0, 0).rotate(TWO_PI / 3));
   *   tetrahedron.vertices.push(createVector(radius, 0, 0).rotate(TWO_PI * 2 / 3));
   *   // Add a tip in the z axis:
   *   tetrahedron.vertices.push(createVector(0, 0, radius));
   *
   *   // Create the four faces by connecting the sets of three points
   *   tetrahedron.faces.push([0, 1, 2]);
   *   tetrahedron.faces.push([0, 1, 3]);
   *   tetrahedron.faces.push([0, 2, 3]);
   *   tetrahedron.faces.push([1, 2, 3]);
   *   tetrahedron.makeEdgesFromFaces();
   * }
   * function draw() {
   *   background(200);
   *   strokeWeight(2);
   *   orbitControl();
   *   rotateY(millis() * 0.001);
   *   model(tetrahedron);
   * }
   * </code>
   * </div>
   */
  makeEdgesFromFaces() {
    this._makeTriangleEdges();
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
      const prevColor = (this.vertexStrokeColors.length > 0 && prevEdge)
        ? this.vertexStrokeColors.slice(
          prevEdge[1] * 4,
          (prevEdge[1] + 1) * 4
        )
        : [0, 0, 0, 0];
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
      if (!this.renderer?._simpleLines) {
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
                prevColor
              );
              potentialCaps.delete(prevEdge[1]);
              connected.add(prevEdge[1]);
            } else {
              // Close off the last segment with a cap
              potentialCaps.set(prevEdge[1], {
                point: this.vertices[prevEdge[1]],
                dir: lastValidDir,
                color: prevColor
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
    if (!this.renderer?._simpleLines) {
      this.lineVertexColors.push(
        ...fromColor,
        ...toColor,
        ...fromColor,
        ...toColor,
        ...toColor,
        ...fromColor
      );
    }
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
   * Transforms the geometry's vertices to fit snugly within a 100×100×100 box
   * centered at the origin.
   *
   * Calling `myGeometry.normalize()` translates the geometry's vertices so that
   * they're centered at the origin `(0, 0, 0)`. Then it scales the vertices so
   * that they fill a 100×100×100 box. As a result, small geometries will grow
   * and large geometries will shrink.
   *
   * Note: `myGeometry.normalize()` only works when called in the
   * <a href="#/p5/setup">setup()</a> function.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a very small torus.
   *   myGeometry = buildGeometry(function() {;
   *     torus(1, 0.25);
   *   });
   *
   *   // Normalize the torus so its vertices fill
   *   // the range [-100, 100].
   *   myGeometry.normalize();
   *
   *   describe('A white torus rotates slowly against a dark gray background.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Style the torus.
   *   noStroke();
   *
   *   // Draw the torus.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
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

      const center = Vector.lerp(maxPosition, minPosition, 0.5);
      const dist = Vector.sub(maxPosition, minPosition);
      const longestDist = Math.max(Math.max(dist.x, dist.y), dist.z);
      const scale = 200 / longestDist;

      for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].sub(center);
        this.vertices[i].mult(scale);
      }
    }
    return this;
  }

  /** Sets the shader's vertex property or attribute variables.
   *
   * A vertex property, or vertex attribute, is a variable belonging to a vertex in a shader. p5.js provides some
   * default properties, such as `aPosition`, `aNormal`, `aVertexColor`, etc. These are
   * set using <a href="#/p5/vertex">vertex()</a>, <a href="#/p5/normal">normal()</a>
   * and <a href="#/p5/fill">fill()</a> respectively. Custom properties can also
   * be defined within <a href="#/p5/beginShape">beginShape()</a> and
   * <a href="#/p5/endShape">endShape()</a>.
   *
   * The first parameter, `propertyName`, is a string with the property's name.
   * This is the same variable name which should be declared in the shader, as in
   * `in vec3 aProperty`, similar to .`setUniform()`.
   *
   * The second parameter, `data`, is the value assigned to the shader variable. This value
   * will be pushed directly onto the Geometry object. There should be the same number
   * of custom property values as vertices, this method should be invoked once for each
   * vertex.
   *
   * The `data` can be a Number or an array of numbers. Tn the shader program the type
   * can be declared according to the WebGL specification. Common types include `float`,
   * `vec2`, `vec3`, `vec4` or matrices.
   *
   * See also the global <a href="#/p5/vertexProperty">vertexProperty()</a> function.
   *
   * @example
   * <div>
   * <code>
   * let geo;
   *
   * function cartesianToSpherical(x, y, z) {
   *   let r = sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2));
   *   let theta = acos(z / r);
   *   let phi = atan2(y, x);
   *   return { theta, phi };
   * }
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Modify the material shader to display roughness.
   *   const myShader = baseMaterialShader().modify({
   *     vertexDeclarations:`in float aRoughness;
   *                         out float vRoughness;`,
   *     fragmentDeclarations: 'in float vRoughness;',
   *     'void afterVertex': `() {
   *         vRoughness = aRoughness;
   *     }`,
   *     'vec4 combineColors': `(ColorComponents components) {
   *             vec4 color = vec4(0.);
   *             color.rgb += components.diffuse * components.baseColor * (1.0-vRoughness);
   *             color.rgb += components.ambient * components.ambientColor;
   *             color.rgb += components.specular * components.specularColor * (1.0-vRoughness);
   *             color.a = components.opacity;
   *             return color;
   *     }`
   *   });
   *
   *   // Create the Geometry object.
   *   geo = buildGeometry(function() {
   *     fill('hotpink');
   *     sphere(45, 50, 50);
   *   });
   *
   *   // Set the roughness value for every vertex.
   *   for (let v of geo.vertices){
   *
   *     // convert coordinates to spherical coordinates
   *     let spherical = cartesianToSpherical(v.x, v.y, v.z);
   *
   *     // Set the custom roughness vertex property.
   *     let roughness = noise(spherical.theta*5, spherical.phi*5);
   *     geo.vertexProperty('aRoughness', roughness);
   *   }
   *
   *   // Use the custom shader.
   *   shader(myShader);
   *
   *   describe('A rough pink sphere rotating on a blue background.');
   * }
   *
   * function draw() {
   *   // Set some styles and lighting
   *   background('lightblue');
   *   noStroke();
   *
   *   specularMaterial(255,125,100);
   *   shininess(2);
   *
   *   directionalLight('white', -1, 1, -1);
   *   ambientLight(320);
   *
   *   rotateY(millis()*0.001);
   *
   *   // Draw the geometry
   *   model(geo);
   * }
   * </code>
   * </div>
   *
   * @param {String} propertyName the name of the vertex property.
   * @param {Number|Number[]} data the data tied to the vertex property.
   * @param {Number} [size] optional size of each unit of data.
   */
  vertexProperty(propertyName, data, size){
    let prop;
    if (!this.userVertexProperties[propertyName]){
      prop = this.userVertexProperties[propertyName] =
        this._userVertexPropertyHelper(propertyName, data, size);
    }
    prop = this.userVertexProperties[propertyName];
    if (size){
      prop.pushDirect(data);
    } else{
      prop.setCurrentData(data);
      prop.pushCurrentData();
    }
  }

  _userVertexPropertyHelper(propertyName, data, size){
    const geometryInstance = this;
    const prop = this.userVertexProperties[propertyName] = {
      name: propertyName,
      dataSize: size ? size : data.length ? data.length : 1,
      geometry: geometryInstance,
      // Getters
      getName(){
        return this.name;
      },
      getCurrentData(){
        if (this.currentData === undefined) {
          this.currentData = new Array(this.getDataSize()).fill(0);
        }
        return this.currentData;
      },
      getDataSize() {
        return this.dataSize;
      },
      getSrcName() {
        const src = this.name.concat('Src');
        return src;
      },
      getDstName() {
        const dst = this.name.concat('Buffer');
        return dst;
      },
      getSrcArray() {
        const srcName = this.getSrcName();
        return this.geometry[srcName];
      },
      //Setters
      setCurrentData(data) {
        const size = data.length ? data.length : 1;
        // if (size != this.getDataSize()){
        //   p5._friendlyError(`Custom vertex property '${this.name}' has been set with various data sizes. You can change it's name, or if it was an accident, set '${this.name}' to have the same number of inputs each time!`, 'vertexProperty()');
        // }
        this.currentData = data;
      },
      // Utilities
      pushCurrentData(){
        const data = this.getCurrentData();
        this.pushDirect(data);
      },
      pushDirect(data) {
        if (data.length){
          this.getSrcArray().push(...data);
        } else{
          this.getSrcArray().push(data);
        }
      },
      resetSrcArray(){
        this.geometry[this.getSrcName()] = [];
      },
      delete() {
        const srcName = this.getSrcName();
        delete this.geometry[srcName];
        delete this;
      }
    };
    this[prop.getSrcName()] = [];
    return this.userVertexProperties[propertyName];
  }
};

/**
 * Keeps track of how many custom geometry objects have been made so that each
 * can be assigned a unique ID.
 */
Geometry.nextId = 0;

function geometry(p5, fn){
  /**
   * A class to describe a 3D shape.
   *
   * Each `p5.Geometry` object represents a 3D shape as a set of connected
   * points called *vertices*. All 3D shapes are made by connecting vertices to
   * form triangles that are stitched together. Each triangular patch on the
   * geometry's surface is called a *face*. The geometry stores information
   * about its vertices and faces for use with effects such as lighting and
   * texture mapping.
   *
   * The first parameter, `detailX`, is optional. If a number is passed, as in
   * `new p5.Geometry(24)`, it sets the number of triangle subdivisions to use
   * along the geometry's x-axis. By default, `detailX` is 1.
   *
   * The second parameter, `detailY`, is also optional. If a number is passed,
   * as in `new p5.Geometry(24, 16)`, it sets the number of triangle
   * subdivisions to use along the geometry's y-axis. By default, `detailX` is
   * 1.
   *
   * The third parameter, `callback`, is also optional. If a function is passed,
   * as in `new p5.Geometry(24, 16, createShape)`, it will be called once to add
   * vertices to the new 3D shape.
   *
   * @class p5.Geometry
   * @param  {Integer} [detailX] number of vertices along the x-axis.
   * @param  {Integer} [detailY] number of vertices along the y-axis.
   * @param {function} [callback] function to call once the geometry is created.
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = new p5.Geometry();
   *
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(40, 0, 0);
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   myGeometry.vertices.push(v0, v1, v2);
   *
   *   describe('A white triangle drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object using a callback function.
   *   myGeometry = new p5.Geometry(1, 1, createShape);
   *
   *   describe('A white triangle drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(40, 0, 0);
   *
   *   // "this" refers to the p5.Geometry object being created.
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   this.vertices.push(v0, v1, v2);
   *
   *   // Add an array to list which vertices belong to the face.
   *   // Vertices are listed in clockwise "winding" order from
   *   // left to top to right.
   *   this.faces.push([0, 1, 2]);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object using a callback function.
   *   myGeometry = new p5.Geometry(1, 1, createShape);
   *
   *   describe('A white triangle drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(40, 0, 0);
   *
   *   // "this" refers to the p5.Geometry object being created.
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   this.vertices.push(v0, v1, v2);
   *
   *   // Add an array to list which vertices belong to the face.
   *   // Vertices are listed in clockwise "winding" order from
   *   // left to top to right.
   *   this.faces.push([0, 1, 2]);
   *
   *   // Compute the surface normals to help with lighting.
   *   this.computeNormals();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * // Adapted from Paul Wheeler's wonderful p5.Geometry tutorial.
   * // https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/
   * // CC-BY-SA 4.0
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the p5.Geometry object.
   *   // Set detailX to 48 and detailY to 2.
   *   // >>> try changing them.
   *   myGeometry = new p5.Geometry(48, 2, createShape);
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the p5.Geometry object.
   *   strokeWeight(0.2);
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   *
   * function createShape() {
   *   // "this" refers to the p5.Geometry object being created.
   *
   *   // Define the Möbius strip with a few parameters.
   *   let spread = 0.1;
   *   let radius = 30;
   *   let stripWidth = 15;
   *   let xInterval = 4 * PI / this.detailX;
   *   let yOffset = -stripWidth / 2;
   *   let yInterval = stripWidth / this.detailY;
   *
   *   for (let j = 0; j <= this.detailY; j += 1) {
   *     // Calculate the "vertical" point along the strip.
   *     let v = yOffset + yInterval * j;
   *
   *     for (let i = 0; i <= this.detailX; i += 1) {
   *       // Calculate the angle of rotation around the strip.
   *       let u = i * xInterval;
   *
   *       // Calculate the coordinates of the vertex.
   *       let x = (radius + v * cos(u / 2)) * cos(u) - sin(u / 2) * 2 * spread;
   *       let y = (radius + v * cos(u / 2)) * sin(u);
   *       if (u < TWO_PI) {
   *         y += sin(u) * spread;
   *       } else {
   *         y -= sin(u) * spread;
   *       }
   *       let z = v * sin(u / 2) + sin(u / 4) * 4 * spread;
   *
   *       // Create a p5.Vector object to position the vertex.
   *       let vert = createVector(x, y, z);
   *
   *       // Add the vertex to the p5.Geometry object's vertices array.
   *       this.vertices.push(vert);
   *     }
   *   }
   *
   *   // Compute the faces array.
   *   this.computeFaces();
   *
   *   // Compute the surface normals to help with lighting.
   *   this.computeNormals();
   * }
   * </code>
   * </div>
   */
  p5.Geometry = Geometry;

  /**
   * An array with the geometry's vertices.
   *
   * The geometry's vertices are stored as
   * <a href="#/p5.Vector">p5.Vector</a> objects in the `myGeometry.vertices`
   * array. The geometry's first vertex is the
   * <a href="#/p5.Vector">p5.Vector</a> object at `myGeometry.vertices[0]`,
   * its second vertex is `myGeometry.vertices[1]`, its third vertex is
   * `myGeometry.vertices[2]`, and so on.
   *
   * @property vertices
   * @for p5.Geometry
   * @name vertices
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = new p5.Geometry();
   *
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(40, 0, 0);
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   myGeometry.vertices.push(v0, v1, v2);
   *
   *   describe('A white triangle drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the p5.Geometry object.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(function() {
   *     torus(30, 15, 10, 8);
   *   });
   *
   *   describe('A white torus rotates slowly against a dark gray background. Red spheres mark its vertices.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateY(frameCount * 0.01);
   *
   *   // Style the p5.Geometry object.
   *   fill(255);
   *   stroke(0);
   *
   *   // Display the p5.Geometry object.
   *   model(myGeometry);
   *
   *   // Style the vertices.
   *   fill(255, 0, 0);
   *   noStroke();
   *
   *   // Iterate over the vertices array.
   *   for (let v of myGeometry.vertices) {
   *     // Draw a sphere to mark the vertex.
   *     push();
   *     translate(v);
   *     sphere(2.5);
   *     pop();
   *   }
   * }
   * </code>
   * </div>
   */

  /**
   * An array with the vectors that are normal to the geometry's vertices.
   *
   * A face's orientation is defined by its *normal vector* which points out
   * of the face and is normal (perpendicular) to the surface. Calling
   * `myGeometry.computeNormals()` first calculates each face's normal
   * vector. Then it calculates the normal vector for each vertex by
   * averaging the normal vectors of the faces surrounding the vertex. The
   * vertex normals are stored as <a href="#/p5.Vector">p5.Vector</a>
   * objects in the `myGeometry.vertexNormals` array.
   *
   * @property vertexNormals
   * @name vertexNormals
   * @for p5.Geometry
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(function() {
   *     torus(30, 15, 10, 8);
   *   });
   *
   *   // Compute the vertex normals.
   *   myGeometry.computeNormals();
   *
   *   describe(
   *     'A white torus rotates against a dark gray background. Red lines extend outward from its vertices.'
   *   );
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Rotate the coordinate system.
   *   rotateY(frameCount * 0.01);
   *
   *   // Style the p5.Geometry object.
   *   stroke(0);
   *
   *   // Display the p5.Geometry object.
   *   model(myGeometry);
   *
   *   // Style the normal vectors.
   *   stroke(255, 0, 0);
   *
   *   // Iterate over the vertices and vertexNormals arrays.
   *   for (let i = 0; i < myGeometry.vertices.length; i += 1) {
   *
   *     // Get the vertex p5.Vector object.
   *     let v = myGeometry.vertices[i];
   *
   *     // Get the vertex normal p5.Vector object.
   *     let n = myGeometry.vertexNormals[i];
   *
   *     // Calculate a point along the vertex normal.
   *     let p = p5.Vector.mult(n, 8);
   *
   *     // Draw the vertex normal as a red line.
   *     push();
   *     translate(v);
   *     line(0, 0, 0, p.x, p.y, p.z);
   *     pop();
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = new p5.Geometry();
   *
   *   // Create p5.Vector objects to position the vertices.
   *   let v0 = createVector(-40, 0, 0);
   *   let v1 = createVector(0, -40, 0);
   *   let v2 = createVector(0, 40, 0);
   *   let v3 = createVector(40, 0, 0);
   *
   *   // Add the vertices to the p5.Geometry object's vertices array.
   *   myGeometry.vertices.push(v0, v1, v2, v3);
   *
   *   // Compute the faces array.
   *   myGeometry.computeFaces();
   *
   *   // Compute the surface normals.
   *   myGeometry.computeNormals();
   *
   *   describe('A red square drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a white point light.
   *   pointLight(255, 255, 255, 0, 0, 10);
   *
   *   // Style the p5.Geometry object.
   *   noStroke();
   *   fill(255, 0, 0);
   *
   *   // Display the p5.Geometry object.
   *   model(myGeometry);
   * }
   * </code>
   * </div>
   */

  /**
   * An array that lists which of the geometry's vertices form each of its
   * faces.
   *
   * All 3D shapes are made by connecting sets of points called *vertices*. A
   * geometry's surface is formed by connecting vertices to form triangles
   * that are stitched together. Each triangular patch on the geometry's
   * surface is called a *face*.
   *
   * The geometry's vertices are stored as
   * <a href="#/p5.Vector">p5.Vector</a> objects in the
   * <a href="#/p5.Geometry/vertices">myGeometry.vertices</a> array. The
   * geometry's first vertex is the <a href="#/p5.Vector">p5.Vector</a>
   * object at `myGeometry.vertices[0]`, its second vertex is
   * `myGeometry.vertices[1]`, its third vertex is `myGeometry.vertices[2]`,
   * and so on.
   *
   * For example, a geometry made from a rectangle has two faces because a
   * rectangle is made by joining two triangles. `myGeometry.faces` for a
   * rectangle would be the two-dimensional array `[[0, 1, 2], [2, 1, 3]]`.
   * The first face, `myGeometry.faces[0]`, is the array `[0, 1, 2]` because
   * it's formed by connecting `myGeometry.vertices[0]`,
   * `myGeometry.vertices[1]`,and `myGeometry.vertices[2]`. The second face,
   * `myGeometry.faces[1]`, is the array `[2, 1, 3]` because it's formed by
   * connecting `myGeometry.vertices[2]`, `myGeometry.vertices[1]`,and
   * `myGeometry.vertices[3]`.
   *
   * @property faces
   * @name faces
   * @for p5.Geometry
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let myGeometry;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Geometry object.
   *   myGeometry = buildGeometry(function() {
   *     sphere();
   *   });
   *
   *   describe("A sphere drawn on a gray background. The sphere's surface is a grayscale patchwork of triangles.");
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the p5.Geometry object.
   *   noStroke();
   *
   *   // Set a random seed.
   *   randomSeed(1234);
   *
   *   // Iterate over the faces array.
   *   for (let face of myGeometry.faces) {
   *
   *     // Style the face.
   *     let g = random(0, 255);
   *     fill(g);
   *
   *     // Draw the face.
   *     beginShape();
   *     // Iterate over the vertices that form the face.
   *     for (let f of face) {
   *       // Get the vertex's p5.Vector object.
   *       let v = myGeometry.vertices[f];
   *       vertex(v.x, v.y, v.z);
   *     }
   *     endShape();
   *
   *   }
   * }
   * </code>
   * </div>
   */

  /**
   * An array that lists the texture coordinates for each of the geometry's
   * vertices.
   *
   * In order for <a href="#/p5/texture">texture()</a> to work, the geometry
   * needs a way to map the points on its surface to the pixels in a
   * rectangular image that's used as a texture. The geometry's vertex at
   * coordinates `(x, y, z)` maps to the texture image's pixel at coordinates
   * `(u, v)`.
   *
   * The `myGeometry.uvs` array stores the `(u, v)` coordinates for each
   * vertex in the order it was added to the geometry. For example, the
   * first vertex, `myGeometry.vertices[0]`, has its `(u, v)` coordinates
   * stored at `myGeometry.uvs[0]` and `myGeometry.uvs[1]`.
   *
   * @property uvs
   * @name uvs
   * @for p5.Geometry
   *
   * @example
   * <div>
   * <code>
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/laDefense.jpg');
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create p5.Geometry objects.
   *   let geom1 = buildGeometry(createShape);
   *   let geom2 = buildGeometry(createShape);
   *
   *   // Left (original).
   *   push();
   *   translate(-25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom1);
   *   pop();
   *
   *   // Set geom2's texture coordinates.
   *   geom2.uvs = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75];
   *
   *   // Right (zoomed in).
   *   push();
   *   translate(25, 0, 0);
   *   texture(img);
   *   noStroke();
   *   model(geom2);
   *   pop();
   *
   *   describe(
   *     'Two photos of a ceiling on a gray background. The photo on the right zooms in to the center of the photo.'
   *   );
   * }
   *
   * function createShape() {
   *   plane(40);
   * }
   * </code>
   * </div>
   */
}

export default geometry;
export { Geometry };

if(typeof p5 !== 'undefined'){
  geometry(p5, p5.prototype);
}
