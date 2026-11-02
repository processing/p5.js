import { Vector } from '../math/p5.Vector';
import { DataArray } from './p5.DataArray';
/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 */

// fresh part state. fields use p5 names (fill, texture...), not obj/mtl tokens.
// importers translate into this and drop anything we can't draw yet. every color
// channel is 0..1 (same range as the renderer's curFillColor), not 0..255.
function createPartState() {
  return {
    fill: null, // Kd + d -> [r, g, b, a] | null, each 0..1
    ambientColor: null, // Ka -> [r, g, b] | null, each 0..1
    specularColor: null, // Ks -> [r, g, b] | null, each 0..1
    shininess: null, // Ns -> number | null
    texture: null, // map_Kd -> p5.Image | null
    specularTexture: null, // map_Ks -> p5.Image | null
    ambientTexture: null, // map_Ka -> p5.Image | null
    shininessTexture: null, // map_Ns -> p5.Image | null
    normalTexture: null, // map_Bump or norm -> p5.Image | null
    normalScale: 1, // -bm -> strength multiplier
    normalMapMode: 0 // 0 = normal map (norm), 1 = bump map (map_Bump)
  };
}

// build a custom vertex-property accessor bound to `owner` (a p5.Geometry or a
// GeometryPart). the raw data lives on owner[name + 'Src'] and the renderer
// reads it back through getSrcArray()/getDataSize(). shared between geometries
// and parts so a per-material part carries custom attributes the same way the
// whole geometry does.
function createUserVertexProperty(owner, propertyName, data, size) {
  const prop = (owner.userVertexProperties[propertyName] = {
    name: propertyName,
    dataSize: size ? size : data.length ? data.length : 1,
    geometry: owner,
    getName() {
      return this.name;
    },
    getCurrentData() {
      if (this.currentData === undefined) {
        this.currentData = new Array(this.getDataSize()).fill(0);
      }
      return this.currentData;
    },
    getDataSize() {
      return this.dataSize;
    },
    getSrcName() {
      return this.name.concat('Src');
    },
    getDstName() {
      return this.name.concat('Buffer');
    },
    getSrcArray() {
      return this.geometry[this.getSrcName()];
    },
    setCurrentData(data) {
      this.currentData = data;
    },
    pushCurrentData() {
      this.pushDirect(this.getCurrentData());
    },
    pushDirect(data) {
      if (data.length) {
        this.getSrcArray().push(...data);
      } else {
        this.getSrcArray().push(data);
      }
    },
    resetSrcArray() {
      this.geometry[this.getSrcName()] = [];
    },
    delete() {
      delete this.geometry[this.getSrcName()];
      delete this;
    }
  });
  owner[prop.getSrcName()] = [];
  return owner.userVertexProperties[propertyName];
}

// one part of a geometry. a multi-material model is a p5.Geometry made of
// several parts, each holding the verts/faces/uvs for one material plus the
// state to draw them. single-material models are just one part.
class GeometryPart {
  constructor(gid, partState) {
    // renderer caches buffers by this, derived from the parent geometry's gid
    this.gid = gid;

    this.vertices = [];
    this.vertexNormals = [];
    // surface tangents for normal mapping, flat [x, y, z, w] per vertex
    this.vertexTangents = [];
    this.faces = [];
    this.uvs = [];
    this.vertexColors = [];

    // A 2D array containing edge connectivity patterns
    // based on faces for most objects.
    this.edges = [];

    // One color per vertex representing the stroke color at that vertex.
    this.vertexStrokeColors = [];

    // An array containing every vertex for stroke drawing.
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

    // One color per line vertex, generated automatically based on
    // vertexStrokeColors in _edgesToVertices().
    this.lineVertexColors = new DataArray();

    this._hasStrokeTransparency = undefined;

    this.partState = partState || createPartState();
    this.dirtyFlags = {};

    // custom per-vertex attributes (p5.strands). empty for parsed parts; the
    // single-part wrap points this back at the parent geometry.
    this.userVertexProperties = {};
  }

  // append custom per-vertex attribute data to this part, same shape as
  // p5.Geometry.vertexProperty so the renderer binds it identically.
  vertexProperty(propertyName, data, size) {
    let prop = this.userVertexProperties[propertyName];
    if (!prop) {
      prop = createUserVertexProperty(this, propertyName, data, size);
    }
    if (size) {
      prop.pushDirect(data);
    } else {
      prop.setCurrentData(data);
      prop.pushCurrentData();
    }
  }

  // the renderer needs this to pick a blend mode. a part is transparent if its
  // fill has alpha below 1, or any of its vertex colors does.
  hasFillTransparency() {
    const fill = this.partState && this.partState.fill;
    if (fill && fill[3] < 1) return true;
    for (let i = 3; i < this.vertexColors.length; i += 4) {
      if (this.vertexColors[i] < 1) return true;
    }
    return false;
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
   * computes a per-vertex surface tangent from the uvs, needed for normal
   * (bump) mapping. the tangent points along the +u texture direction; its w
   * component stores the bitangent handedness so the shader can rebuild the
   * bitangent as cross(normal, tangent) * w. results are stored flat as
   * [x, y, z, w] per vertex on this.vertexTangents. needs uvs and vertex
   * normals, so run computeNormals() first if the model has none.
   * @private
   * @chainable
   */
  computeTangents() {
    const vertices = this.vertices;
    const faces = this.faces;
    const uvs = this.uvs.flat();
    const normals = this.vertexNormals;

    // nothing to build a tangent basis from without uvs and normals
    if (uvs.length === 0 || normals.length === 0) {
      this.vertexTangents = [];
      return this;
    }

    // accumulate the +u direction (tan) and +v direction (bitan) per vertex
    const tan = [];
    const bitan = [];
    for (let i = 0; i < vertices.length; i++) {
      tan.push(new Vector(0, 0, 0));
      bitan.push(new Vector(0, 0, 0));
    }
    const uvAt = i => ({ x: uvs[i * 2] || 0, y: uvs[i * 2 + 1] || 0 });

    for (const face of faces) {
      const [i0, i1, i2] = face;
      const e1 = Vector.sub(vertices[i1], vertices[i0]);
      const e2 = Vector.sub(vertices[i2], vertices[i0]);
      const w0 = uvAt(i0);
      const w1 = uvAt(i1);
      const w2 = uvAt(i2);
      const du1 = w1.x - w0.x;
      const dv1 = w1.y - w0.y;
      const du2 = w2.x - w0.x;
      const dv2 = w2.y - w0.y;

      const denom = du1 * dv2 - du2 * dv1;
      const r = denom === 0 ? 0 : 1 / denom;
      const sdir = Vector.sub(Vector.mult(e1, dv2), Vector.mult(e2, dv1)).mult(r);
      const tdir = Vector.sub(Vector.mult(e2, du1), Vector.mult(e1, du2)).mult(r);

      for (const idx of face) {
        tan[idx].add(sdir);
        bitan[idx].add(tdir);
      }
    }

    // orthonormalise each tangent against its normal and record handedness
    const tangents = [];
    for (let i = 0; i < vertices.length; i++) {
      const n = normals[i] || new Vector(0, 0, 1);
      let t = Vector.sub(tan[i], Vector.mult(n, n.dot(tan[i])));
      if (t.magSq() === 0) {
        // degenerate uvs: pick any direction perpendicular to the normal
        const seed = Math.abs(n.x) < 0.9 ? new Vector(1, 0, 0) : new Vector(0, 1, 0);
        t = Vector.sub(seed, Vector.mult(n, n.dot(seed)));
      }
      t.normalize();
      const handedness = Vector.cross(n, t).dot(bitan[i]) < 0 ? -1 : 1;
      tangents.push(t.x, t.y, t.z, handedness);
    }

    this.vertexTangents = tangents;
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
   *
   * function draw() {
   *   background(200);
   *   strokeWeight(2);
   *   orbitControl();
   *   rotateY(millis() * 0.001);
   *   model(tetrahedron);
   * }
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
  _edgesToVertices(renderer = this.renderer) {
    this.lineVertices.clear();
    this.lineTangentsIn.clear();
    this.lineTangentsOut.clear();
    this.lineSides.clear();
    this.lineVertexColors.clear();
    this._hasStrokeTransparency = undefined;

    const potentialCaps = new Map();
    const connected = new Set();
    let lastValidDir;
    for (let i = 0; i < this.edges.length; i++) {
      const prevEdge = this.edges[i - 1];
      const currEdge = this.edges[i];
      const isPoint = currEdge[0] === currEdge[1];
      const begin = this.vertices[currEdge[0]];
      const end = this.vertices[currEdge[1]];
      const prevColor =
        this.vertexStrokeColors.length > 0 && prevEdge
          ? this.vertexStrokeColors.slice(
              prevEdge[1] * 4,
              (prevEdge[1] + 1) * 4
            )
          : [0, 0, 0, 0];
      const fromColor =
        this.vertexStrokeColors.length > 0
          ? this.vertexStrokeColors.slice(
              currEdge[0] * 4,
              (currEdge[0] + 1) * 4
            )
          : [0, 0, 0, 0];
      const toColor =
        this.vertexStrokeColors.length > 0
          ? this.vertexStrokeColors.slice(
              currEdge[1] * 4,
              (currEdge[1] + 1) * 4
            )
          : [0, 0, 0, 0];
      const dir = isPoint
        ? new Vector(0, 1, 0)
        : end.copy().sub(begin).normalize();
      const dirOK = dir.magSq() > 0;
      if (dirOK) {
        this._addSegment(begin, end, fromColor, toColor, dir,renderer);
      }
      if (!renderer?._simpleLines) {
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
        } else if (isPoint) {
          this._addCap(begin, dir.copy().mult(-1), fromColor);
          this._addCap(begin, dir, fromColor);
        } else {
          // Start a new line
          if (dirOK && !connected.has(currEdge[0])) {
            const existingCap = potentialCaps.get(currEdge[0]);
            if (existingCap) {
              this._addJoin(begin, existingCap.dir, dir, fromColor);
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
          if (!isPoint && lastValidDir && !connected.has(prevEdge[1])) {
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
            this._addJoin(end, dir, existingCap.dir.copy().mult(-1), toColor);
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
  _addSegment(begin, end, fromColor, toColor, dir,renderer = this.renderer) {
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
    if (!renderer?._simpleLines) {
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
  _addJoin(point, fromTangent, toTangent, color) {
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

}

export { GeometryPart, createPartState, createUserVertexProperty };
