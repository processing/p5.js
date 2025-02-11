import * as constants from '../core/constants';
import { Geometry } from './p5.Geometry';
import earcut, {flatten, deviation} from 'earcut';
import { Vector } from '../math/p5.Vector';
import { RenderBuffer } from './p5.RenderBuffer';

const INITIAL_BUFFER_STRIDES = {
  vertices: 1,
  vertexNormals: 1,
  vertexColors: 4,
  vertexStrokeColors: 4,
  uvs: 2
};

// The total number of properties per vertex, before additional
// user attributes are added.
const INITIAL_VERTEX_SIZE =
  Object.values(INITIAL_BUFFER_STRIDES).reduce((acc, next) => acc + next);

export class ShapeBuilder {
  constructor(renderer) {
    this.renderer = renderer;
    this.shapeMode = constants.PATH;
    this.geometry = new Geometry(undefined, undefined, undefined, this.renderer);
    this.geometry.gid = '_IMMEDIATE_MODE_GEOMETRY_';

    this.contourIndices = [];
    this._useUserVertexProperties = undefined;

    this._bezierVertex = [];
    this._quadraticVertex = [];
    this._curveVertex = [];

    // Used to distinguish between user calls to vertex() and internal calls
    this.isProcessingVertices = false;
    this.tessyVertexSize = INITIAL_VERTEX_SIZE;
    this.bufferStrides = { ...INITIAL_BUFFER_STRIDES };
  }

  constructFromContours(shape, contours) {
    if (this._useUserVertexProperties){
      this._resetUserVertexProperties();
    }
    this.geometry.reset();
    this.contourIndices = [];
    // TODO: handle just some contours having non-PATH mode
    this.shapeMode = shape.contours[0].kind;
    const shouldProcessEdges = !!this.renderer.states.strokeColor;

    const userVertexPropertyHelpers = {};
    if (shape.userVertexProperties) {
      this._useUserVertexProperties = true;
      for (const key in shape.userVertexProperties) {
        const name = shape.vertexPropertyName(key);
        const prop = this.geometry._userVertexPropertyHelper(name, [], shape.userVertexProperties[key]);
        userVertexPropertyHelpers[key] = prop;
        this.tessyVertexSize += prop.getDataSize();
        this.bufferStrides[prop.getSrcName()] = prop.getDataSize();
        this.renderer.buffers.user.push(
          new RenderBuffer(prop.getDataSize(), prop.getSrcName(), prop.getDstName(), name, this.renderer)
        );
      }
    } else {
      this._useUserVertexProperties = false;
    }

    for (const contour of contours) {
      this.contourIndices.push(this.geometry.vertices.length);
      for (const vertex of contour) {
        // WebGL doesn't support QUADS or QUAD_STRIP, so we duplicate data to turn
        // QUADS into TRIANGLES and QUAD_STRIP into TRIANGLE_STRIP. (There is no extra
        // work to convert QUAD_STRIP here, since the only difference is in how edges
        // are rendered.)
        if (this.shapeMode === constants.QUADS) {
          // A finished quad turned into triangles should leave 6 vertices in the
          // buffer:
          // 0--3     0   3--5
          // |  | --> | \  \ |
          // 1--2     1--2   4
          // When vertex index 3 is being added, add the necessary duplicates.
          if (this.geometry.vertices.length % 6 === 3) {
            for (const key in this.bufferStrides) {
              const stride = this.bufferStrides[key];
              const buffer = this.geometry[key];
              buffer.push(
                ...buffer.slice(
                  buffer.length - 3 * stride,
                  buffer.length - 2 * stride
                ),
                ...buffer.slice(buffer.length - stride, buffer.length),
              );
            }
          }
        }

        this.geometry.vertices.push(vertex.position);
        this.geometry.vertexNormals.push(vertex.normal || new Vector(0, 0, 0));
        this.geometry.uvs.push(vertex.textureCoordinates.x, vertex.textureCoordinates.y);
        if (this.renderer.states.fillColor) {
          this.geometry.vertexColors.push(...vertex.fill.array());
        } else {
          this.geometry.vertexColors.push(0, 0, 0, 0);
        }
        if (this.renderer.states.strokeColor) {
          this.geometry.vertexStrokeColors.push(...vertex.stroke.array());
        } else {
          this.geometry.vertexStrokeColors.push(0, 0, 0, 0);
        }
        for (const key in userVertexPropertyHelpers) {
          const prop = userVertexPropertyHelpers[key];
          if (key in vertex) {
            prop.setCurrentData(vertex[key]);
          }
          prop.pushCurrentData();
        }
      }
    }

    if (shouldProcessEdges) {
      this.geometry.edges = this._calculateEdges(this.shapeMode, this.geometry.vertices);
    }
    if (shouldProcessEdges && !this.renderer.geometryBuilder) {
      this.geometry._edgesToVertices();
    }

    if (this.shapeMode === constants.PATH) {
      this.isProcessingVertices = true;
      this._tesselateShape();
      this.isProcessingVertices = false;
    } else if (this.shapeMode === constants.QUAD_STRIP) {
      // The only difference between these two modes is which edges are
      // displayed, so after we've updated the edges, we switch the mode
      // to one that native WebGL knows how to render.
      this.shapeMode = constants.TRIANGLE_STRIP;
    } else if (this.shapeMode === constants.QUADS) {
      // We translate QUADS to TRIANGLES when vertices are being added,
      // since QUADS is just a p5 mode, whereas TRIANGLES is also a mode
      // that native WebGL knows how to render. Once we've processed edges,
      // everything should be set up for TRIANGLES mode.
      this.shapeMode = constants.TRIANGLES;
    }

    if (
      this.renderer.states.textureMode === constants.IMAGE &&
      this.renderer.states._tex !== null &&
      this.renderer.states._tex.width > 0 &&
      this.renderer.states._tex.height > 0
    ) {
      this.geometry.uvs = this.geometry.uvs.map((val, i) => {
        if (i % 2 === 0) {
          return val / this.renderer.states._tex.width;
        } else {
          return val / this.renderer.states._tex.height;
        }
      })
    }
  }

  _resetUserVertexProperties() {
    const properties = this.geometry.userVertexProperties;
    for (const propName in properties){
      const prop = properties[propName];
      delete this.bufferStrides[propName];
      prop.delete();
    }
    this._useUserVertexProperties = false;
    this.tessyVertexSize = INITIAL_VERTEX_SIZE;
    this.geometry.userVertexProperties = {};
  }

  /**
   * Called from _processVertices(). This function calculates the stroke vertices for custom shapes and
   * tesselates shapes when applicable.
   * @private
   * @returns  {Number[]} indices for custom shape vertices indicating edges.
   */
  _calculateEdges(
    shapeMode,
    verts,
  ) {
    const res = [];
    let i = 0;
    const contourIndices = this.contourIndices.slice();
    let contourStart = -1;
    switch (shapeMode) {
      case constants.TRIANGLE_STRIP:
        for (i = 0; i < verts.length - 2; i++) {
          res.push([i, i + 1]);
          res.push([i, i + 2]);
        }
        res.push([i, i + 1]);
        break;
      case constants.TRIANGLE_FAN:
        for (i = 1; i < verts.length - 1; i++) {
          res.push([0, i]);
          res.push([i, i + 1]);
        }
        res.push([0, verts.length - 1]);
        break;
      case constants.TRIANGLES:
        for (i = 0; i < verts.length - 2; i = i + 3) {
          res.push([i, i + 1]);
          res.push([i + 1, i + 2]);
          res.push([i + 2, i]);
        }
        break;
      case constants.LINES:
        for (i = 0; i < verts.length - 1; i = i + 2) {
          res.push([i, i + 1]);
        }
        break;
      case constants.QUADS:
        // Quads have been broken up into two triangles by `vertex()`:
        // 0   3--5
        // | \  \ |
        // 1--2   4
        for (i = 0; i < verts.length - 5; i += 6) {
          res.push([i, i + 1]);
          res.push([i + 1, i + 2]);
          res.push([i + 2, i + 5]);
          res.push([i + 5, i]);
        }
        break;
      case constants.QUAD_STRIP:
        // 0---2---4
        // |   |   |
        // 1---3---5
        for (i = 0; i < verts.length - 2; i += 2) {
          res.push([i, i + 1]);
          res.push([i + 1, i + 3]);
          res.push([i, i + 2]);
        }
        res.push([i, i + 1]);
        break;
      default:
        // TODO: handle contours in other modes too
        for (i = 0; i < verts.length; i++) {
          if (i === contourIndices[0]) {
            contourStart = contourIndices.shift();
          } else if (
            verts[contourStart] &&
            verts[i].equals(verts[contourStart])
          ) {
            res.push([i - 1, contourStart]);
          } else {
            res.push([i - 1, i]);
          }
        }
        break;
    }
    return res;
  }

  /**
   * Called from _processVertices() when applicable. This function tesselates immediateMode.geometry.
   * @private
   */
  _tesselateShape() {
    this.shapeMode = constants.TRIANGLES;
    const contours = [];
    for (let i = 0; i < this.geometry.vertices.length; i++) {
      if (this.contourIndices.length > 0 && this.contourIndices[0] === i) {
        this.contourIndices.shift();
        contours.push([]);
      }
      contours[contours.length - 1].push(
        this.geometry.vertices[i].x,
        this.geometry.vertices[i].y,
        this.geometry.vertices[i].z,
        this.geometry.uvs[i * 2],
        this.geometry.uvs[i * 2 + 1],
        this.geometry.vertexColors[i * 4],
        this.geometry.vertexColors[i * 4 + 1],
        this.geometry.vertexColors[i * 4 + 2],
        this.geometry.vertexColors[i * 4 + 3],
        this.geometry.vertexNormals[i].x,
        this.geometry.vertexNormals[i].y,
        this.geometry.vertexNormals[i].z
      );
      for (const propName in this.geometry.userVertexProperties) {
        const prop = this.geometry.userVertexProperties[propName];
        const start = i * prop.getDataSize();
        const end = start + prop.getDataSize();
        const vals = prop.getSrcArray().slice(start, end);
        contours[contours.length-1].push(...vals);
      }
    }
    const polyTriangles = this._triangulate(contours);
    const originalVertices = this.geometry.vertices;
    this.geometry.vertices = [];
    this.geometry.vertexNormals = [];
    this.geometry.uvs = [];
    for (const propName in this.geometry.userVertexProperties){
      const prop = this.geometry.userVertexProperties[propName];
      prop.resetSrcArray();
    }
    const colors = [];
    // Loop over each vertex (remember: each triangle vertex is packed in tessyVertexSize floats)
    for (let j = 0, len = polyTriangles.length; j < len; j += this.tessyVertexSize) {
      colors.push(...polyTriangles.slice(j + 5, j + 9));
      this.geometry.vertexNormals.push(new Vector(...polyTriangles.slice(j + 9, j + 12)));
      {
        let offset = 12;
        for (const propName in this.geometry.userVertexProperties){
          const prop = this.geometry.userVertexProperties[propName];
          const size = prop.getDataSize();
          const start = j + offset;
          const end = start + size;
          prop.setCurrentData(polyTriangles.slice(start, end));
          prop.pushCurrentData();
          offset += size;
        }
      }
      this.geometry.vertices.push(new Vector(...polyTriangles.slice(j, j + 3)));
      this.geometry.uvs.push(...polyTriangles.slice(j + 3, j + 5));
    }
    if (this.renderer.geometryBuilder) {
      // Tesselating the face causes the indices of edge vertices to stop being
      // correct. When rendering, this is not a problem, since _edgesToVertices
      // will have been called before this, and edge vertex indices are no longer
      // needed. However, the geometry builder still needs this information, so
      // when one is active, we need to update the indices.
      //
      // We record index mappings in a Map so that once we have found a
      // corresponding vertex, we don't need to loop to find it again.
      const newIndex = new Map();
      this.geometry.edges =
        this.geometry.edges.map(edge => edge.map(origIdx => {
          if (!newIndex.has(origIdx)) {
            const orig = originalVertices[origIdx];
            let newVertIndex = this.geometry.vertices.findIndex(
              v =>
                orig.x === v.x &&
                orig.y === v.y &&
                orig.z === v.z
            );
            if (newVertIndex === -1) {
              // The tesselation process didn't output a vertex with the exact
              // coordinate as before, potentially due to numerical issues. This
              // doesn't happen often, but in this case, pick the closest point
              let closestDist = Infinity;
              let closestIndex = 0;
              for (
                let i = 0;
                i < this.geometry.vertices.length;
                i++
              ) {
                const vert = this.geometry.vertices[i];
                const dX = orig.x - vert.x;
                const dY = orig.y - vert.y;
                const dZ = orig.z - vert.z;
                const dist = dX*dX + dY*dY + dZ*dZ;
                if (dist < closestDist) {
                  closestDist = dist;
                  closestIndex = i;
                }
              }
              newVertIndex = closestIndex;
            }
            newIndex.set(origIdx, newVertIndex);
          }
          return newIndex.get(origIdx);
        }));
    }
    this.geometry.vertexColors = colors;
  }

  _triangulate(contours) {
    const allTriangleVerts = [];
    const vertexSize = this.tessyVertexSize;
  
    // (A) Collect all 3D points from every contour.
    const allPoints3D = [];
    for (const contour of contours) {
      for (let j = 0; j < contour.length; j += vertexSize) {
        allPoints3D.push([contour[j], contour[j + 1], contour[j + 2]]);
      }
    }
    // Compute a projection basis from all points.
    const basis = this._computeProjectionBasis(allPoints3D);
  
    // (B) For each contour, build its 2D projection.
    let classifiedContours = contours.map(contour => {
      const polygon = [];
      for (let j = 0; j < contour.length; j += vertexSize) {
        const pt3 = [contour[j], contour[j + 1], contour[j + 2]];
        const pt2 = this._projectPoint(pt3, basis);
        polygon.push(pt2);
      }
      return {
        // We will decide later if this contour is outer or a hole.
        polygon,
        vertexData: contour
      };
    });
  
    const outerContours = [];
    const holeContours = [];
    for (let i = 0; i < classifiedContours.length; i++) {
      const c = classifiedContours[i];
      let contained = false;
      for (let j = 0; j < classifiedContours.length; j++) {
        if (i === j) continue;
        if (this._contains(classifiedContours[j].polygon, c.polygon[0])) {
          contained = true;
          break;
        }
      }
      if (!contained) {
        outerContours.push(c);
      } else {
        holeContours.push(c);
      }
    }
    // Group each outer contour with all holes contained in it.
    const contourGroups = outerContours.map(outer => ({
      outer,
      holes: holeContours.filter(hole => this._contains(outer.polygon, hole.polygon[0]))
    }));
  
    for (const group of contourGroups) {
      const { outer, holes } = group;
      const polygons = [outer.polygon, ...holes.map(h => h.polygon)];
      const { vertices: verts2D, holes: earcutHoles, dimensions } = flatten(polygons);
      const indices = earcut(verts2D, earcutHoles, dimensions);
  
      const vertexDataChunks = [];
      for (let j = 0; j < outer.vertexData.length; j += vertexSize) {
        vertexDataChunks.push(outer.vertexData.slice(j, j + vertexSize));
      }
      // Then add the holes’ vertexData (in the same order as flatten() does).
      for (const h of holes) {
        for (let j = 0; j < h.vertexData.length; j += vertexSize) {
          vertexDataChunks.push(h.vertexData.slice(j, j + vertexSize));
        }
      }
      // Build triangles using earcut’s indices.
      for (const idx of indices) {
        allTriangleVerts.push(...vertexDataChunks[idx]);
      }
    }
    return allTriangleVerts;
  };
  
  _projectPoint(pt, basis) {
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return [dot(pt, basis.u), dot(pt, basis.v)];
  };
  
  _computeProjectionBasis(points) {
    const epsilon = 1e-6;
    const firstZ = points[0][2];
    const isFlat2D = points.every(p => Math.abs(p[2] - firstZ) < epsilon);
    if (isFlat2D) {
      return {
        normal: [0, 0, 1],
        u: [1, 0, 0],
        v: [0, 1, 0]
      };
    }
    // Otherwise compute a normal via Newell's method.
    let normal = [0, 0, 0];
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      normal[0] += (current[1] - next[1]) * (current[2] + next[2]);
      normal[1] += (current[2] - next[2]) * (current[0] + next[0]);
      normal[2] += (current[0] - next[0]) * (current[1] + next[1]);
    }
    let len = Math.hypot(normal[0], normal[1], normal[2]);
    if (len === 0) {
      normal = [0, 0, 1];
    } else {
      normal = normal.map(n => n / len);
    }
    // Choose an arbitrary vector not parallel to the normal.
    let u;
    if (Math.abs(normal[0]) > Math.abs(normal[1])) {
      u = [-normal[2], 0, normal[0]];
    } else {
      u = [0, normal[2], -normal[1]];
    }
    let uLen = Math.hypot(u[0], u[1], u[2]);
    if (uLen === 0) u = [1, 0, 0];
    else u = u.map(x => x / uLen);
    // Compute v = normal cross u.
    const v = [
      normal[1] * u[2] - normal[2] * u[1],
      normal[2] * u[0] - normal[0] * u[2],
      normal[0] * u[1] - normal[1] * u[0]
    ];
    return { normal, u, v };
  };
  
  _contains(outerPolygon, [x, y]) {
    let inside = false;
    for (let i = 0, j = outerPolygon.length - 1; i < outerPolygon.length; j = i++) {
      const [xi, yi] = outerPolygon[i];
      const [xj, yj] = outerPolygon[j];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
};
