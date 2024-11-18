import * as constants from '../core/constants';
import { Geometry } from './p5.Geometry';
import libtess from 'libtess'; // Fixed with exporting module from libtess
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
    this.shapeMode = constants.TESS;
    this.geometry = new Geometry();
    this.geometry.gid = '__IMMEDIATE_MODE_GEOMETRY__';

    this.contourIndices = [];
    this._useUserVertexProperties = undefined;

    this._bezierVertex = [];
    this._quadraticVertex = [];
    this._curveVertex = [];

    // Used to distinguish between user calls to vertex() and internal calls
    this.isProcessingVertices = false;

    // Used for converting shape outlines into triangles for rendering
    this._tessy = this._initTessy();
    this.tessyVertexSize = INITIAL_VERTEX_SIZE;
    this.bufferStrides = { ...INITIAL_BUFFER_STRIDES };
  }

  beginShape(mode = constants.TESS) {
    this.shapeMode = mode;
    if (this._useUserVertexProperties === true){
      this._resetUserVertexProperties();
    }
    this.geometry.reset();
    this.contourIndices = [];
  }

  endShape = function(
    mode,
    isCurve,
    isBezier,
    isQuadratic,
    isContour,
    shapeKind,
    count = 1
  ) {
    if (this.shapeMode === constants.POINTS) {
      // @TODO(dave) move to renderer directly
      this.renderer._drawPoints(
        this.geometry.vertices,
        this.renderer.buffers.point
      );
      return this;
    }
    // When we are drawing a shape then the shape mode is TESS,
    // but in case of triangle we can skip the breaking into small triangle
    // this can optimize performance by skipping the step of breaking it into triangles
    if (this.geometry.vertices.length === 3 &&
        this.shapeMode === constants.TESS
    ) {
      this.shapeMode === constants.TRIANGLES;
    }

    this.isProcessingVertices = true;
    this._processVertices(...arguments);
    this.isProcessingVertices = false;

    // WebGL doesn't support the QUADS and QUAD_STRIP modes, so we
    // need to convert them to a supported format. In `vertex()`, we reformat
    // the input data into the formats specified below.
    if (this.shapeMode === constants.QUADS) {
      this.shapeMode = constants.TRIANGLES;
    } else if (this.shapeMode === constants.QUAD_STRIP) {
      this.shapeMode = constants.TRIANGLE_STRIP;
    }

    this.isBezier = false;
    this.isQuadratic = false;
    this.isCurve = false;
    this._bezierVertex.length = 0;
    this._quadraticVertex.length = 0;
    this._curveVertex.length = 0;
  }

  beginContour() {
    if (this.shapeMode !== constants.TESS) {
      throw new Error('WebGL mode can only use contours with beginShape(TESS).');
    }
    this.contourIndices.push(
      this.geometry.vertices.length
    );
  }

  vertex(x, y) {
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
            ...buffer.slice(buffer.length - stride, buffer.length)
          );
        }
      }
    }

    let z, u, v;

    // default to (x, y) mode: all other arguments assumed to be 0.
    z = u = v = 0;

    if (arguments.length === 3) {
      // (x, y, z) mode: (u, v) assumed to be 0.
      z = arguments[2];
    } else if (arguments.length === 4) {
      // (x, y, u, v) mode: z assumed to be 0.
      u = arguments[2];
      v = arguments[3];
    } else if (arguments.length === 5) {
      // (x, y, z, u, v) mode
      z = arguments[2];
      u = arguments[3];
      v = arguments[4];
    }
    const vert = new Vector(x, y, z);
    this.geometry.vertices.push(vert);
    this.geometry.vertexNormals.push(this.renderer.states._currentNormal);

    for (const propName in this.geometry.userVertexProperties){
      const geom = this.geometry;
      const prop = geom.userVertexProperties[propName];
      const verts = geom.vertices;
      if (prop.getSrcArray().length === 0 && verts.length > 1) {
        const numMissingValues = prop.getDataSize() * (verts.length - 1);
        const missingValues = Array(numMissingValues).fill(0);
        prop.pushDirect(missingValues);
      }
      prop.pushCurrentData();
    }

    const vertexColor = this.renderer.states.curFillColor || [0.5, 0.5, 0.5, 1.0];
    this.geometry.vertexColors.push(
      vertexColor[0],
      vertexColor[1],
      vertexColor[2],
      vertexColor[3]
    );
    const lineVertexColor = this.renderer.states.curStrokeColor || [0.5, 0.5, 0.5, 1];
    this.geometry.vertexStrokeColors.push(
      lineVertexColor[0],
      lineVertexColor[1],
      lineVertexColor[2],
      lineVertexColor[3]
    );

    if (this.renderer.states.textureMode === constants.IMAGE && !this.isProcessingVertices) {
      if (this.renderer.states._tex !== null) {
        if (this.renderer.states._tex.width > 0 && this.renderer.states._tex.height > 0) {
          u /= this.renderer.states._tex.width;
          v /= this.renderer.states._tex.height;
        }
      } else if (
        this.renderer.states.userFillShader !== undefined ||
        this.renderer.states.userStrokeShader !== undefined ||
        this.renderer.states.userPointShader !== undefined ||
        this.renderer.states.userImageShader !== undefined
      ) {
      // Do nothing if user-defined shaders are present
      } else if (
        this.renderer.states._tex === null &&
        arguments.length >= 4
      ) {
        // Only throw this warning if custom uv's have  been provided
        console.warn(
          'You must first call texture() before using' +
            ' vertex() with image based u and v coordinates'
        );
      }
    }

    this.geometry.uvs.push(u, v);

    this._bezierVertex[0] = x;
    this._bezierVertex[1] = y;
    this._bezierVertex[2] = z;

    this._quadraticVertex[0] = x;
    this._quadraticVertex[1] = y;
    this._quadraticVertex[2] = z;

    return this;
  }

  vertexProperty(propertyName, data) {
    if (!this._useUserVertexProperties) {
      this._useUserVertexProperties = true;
      this.geometry.userVertexProperties = {};
    }
    const propertyExists = this.geometry.userVertexProperties[propertyName];
    let prop;
    if (propertyExists){
      prop = this.geometry.userVertexProperties[propertyName];
    } else {
      prop = this.geometry._userVertexPropertyHelper(propertyName, data);
      this.tessyVertexSize += prop.getDataSize();
      this.bufferStrides[prop.getSrcName()] = prop.getDataSize();
      this.renderer.buffers.user.push(
        new RenderBuffer(prop.getDataSize(), prop.getSrcName(), prop.getDstName(), propertyName, this.renderer)
      );
    }
    prop.setCurrentData(data);
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
   * Interpret the vertices of the current geometry according to
   * the current shape mode, and convert them to something renderable (either
   * triangles or lines.)
   * @private
   */
  _processVertices(mode) {
    if (this.geometry.vertices.length === 0) return;

    const calculateStroke = this.renderer.states.strokeColor;
    const shouldClose = mode === constants.CLOSE;
    if (calculateStroke) {
      this.geometry.edges = this._calculateEdges(
        this.shapeMode,
        this.geometry.vertices,
        shouldClose
      );
      if (!this.renderer.geometryBuilder) {
        this.geometry._edgesToVertices();
      }
    }

    // For hollow shapes, user must set mode to TESS
    const convexShape = this.shapeMode === constants.TESS;
    // If the shape has a contour, we have to re-triangulate to cut out the
    // contour region
    const hasContour = this.contourIndices.length > 0;
    // We tesselate when drawing curves or convex shapes
    const shouldTess =
      this.renderer.states.fillColor &&
      (
        this.isBezier ||
        this.isQuadratic ||
        this.isCurve ||
        convexShape ||
        hasContour
      ) &&
      this.shapeMode !== constants.LINES;

    if (shouldTess) {
      this._tesselateShape();
    }
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
    shouldClose
  ) {
    const res = [];
    let i = 0;
    const contourIndices = this.contourIndices.slice();
    let contourStart = 0;
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
          res.push([i + 3, i + 5]);
          res.push([i + 4, i + 5]);
        }
        break;
      case constants.QUAD_STRIP:
        // 0---2---4
        // |   |   |
        // 1---3---5
        for (i = 0; i < verts.length - 2; i += 2) {
          res.push([i, i + 1]);
          res.push([i, i + 2]);
          res.push([i + 1, i + 3]);
        }
        res.push([i, i + 1]);
        break;
      default:
        // TODO: handle contours in other modes too
        for (i = 0; i < verts.length; i++) {
          // Handle breaks between contours
          if (i + 1 < verts.length && i + 1 !== contourIndices[0]) {
            res.push([i, i + 1]);
          } else {
            if (shouldClose || contourStart) {
              res.push([i, contourStart]);
            }
            if (contourIndices.length > 0) {
              contourStart = contourIndices.shift();
            }
          }
        }
        break;
    }
    if (shapeMode !== constants.TESS && shouldClose) {
      res.push([verts.length - 1, 0]);
    }
    return res;
  }

  /**
   * Called from _processVertices() when applicable. This function tesselates immediateMode.geometry.
   * @private
   */
  _tesselateShape() {
    // TODO: handle non-TESS shape modes that have contours
    this.shapeMode = constants.TRIANGLES;
    const contours = [[]];
    for (let i = 0; i < this.geometry.vertices.length; i++) {
      if (
        this.contourIndices.length > 0 &&
        this.contourIndices[0] === i
      ) {
        this.contourIndices.shift();
        contours.push([]);
      }
      contours[contours.length-1].push(
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
    for (
      let j = 0, polyTriLength = polyTriangles.length;
      j < polyTriLength;
      j = j + this.tessyVertexSize
    ) {
      colors.push(...polyTriangles.slice(j + 5, j + 9));
      this.renderer.normal(...polyTriangles.slice(j + 9, j + 12));
      {
        let offset = 12;
        for (const propName in this.geometry.userVertexProperties){
            const prop = this.geometry.userVertexProperties[propName];
            const size = prop.getDataSize();
            const start = j + offset;
            const end = start + size;
            prop.setCurrentData(polyTriangles.slice(start, end));
            offset += size;
        }
      }
      this.vertex(...polyTriangles.slice(j, j + 5));
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

  _initTessy() {
    // function called for each vertex of tesselator output
    function vertexCallback(data, polyVertArray) {
      for (const element of data) {
        polyVertArray.push(element);
      }
    }

    function begincallback(type) {
      if (type !== libtess.primitiveType.GL_TRIANGLES) {
        console.log(`expected TRIANGLES but got type: ${type}`);
      }
    }

    function errorcallback(errno) {
      console.log('error callback');
      console.log(`error number: ${errno}`);
    }

    // callback for when segments intersect and must be split
    const combinecallback = (coords, data, weight) => {
      const result = new Array(this.tessyVertexSize).fill(0);
      for (let i = 0; i < weight.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (weight[i] === 0 || !data[i]) continue;
          result[j] += data[i][j] * weight[i];
        }
      }
      return result;
    };

    function edgeCallback(flag) {
      // don't really care about the flag, but need no-strip/no-fan behavior
    }

    const tessy = new libtess.GluTesselator();
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);
    tessy.gluTessProperty(
      libtess.gluEnum.GLU_TESS_WINDING_RULE,
      libtess.windingRule.GLU_TESS_WINDING_NONZERO
    );

    return tessy;
  }

  /**
   * Runs vertices through libtess to convert them into triangles
   * @private
   */
  _triangulate(contours) {
    // libtess will take 3d verts and flatten to a plane for tesselation.
    // libtess is capable of calculating a plane to tesselate on, but
    // if all of the vertices have the same z values, we'll just
    // assume the face is facing the camera, letting us skip any performance
    // issues or bugs in libtess's automatic calculation.
    const z = contours[0] ? contours[0][2] : undefined;
    let allSameZ = true;
    for (const contour of contours) {
      for (
        let j = 0;
        j < contour.length;
        j += this.tessyVertexSize
      ) {
        if (contour[j + 2] !== z) {
          allSameZ = false;
          break;
        }
      }
    }
    if (allSameZ) {
      this._tessy.gluTessNormal(0, 0, 1);
    } else {
      // Let libtess pick a plane for us
      this._tessy.gluTessNormal(0, 0, 0);
    }

    const triangleVerts = [];
    this._tessy.gluTessBeginPolygon(triangleVerts);

    for (const contour of contours) {
      this._tessy.gluTessBeginContour();
      for (
        let j = 0;
        j < contour.length;
        j += this.tessyVertexSize
      ) {
        const coords = contour.slice(
          j,
          j + this.tessyVertexSize
        );
        this._tessy.gluTessVertex(coords, coords);
      }
      this._tessy.gluTessEndContour();
    }

    // finish polygon
    this._tessy.gluTessEndPolygon();

    return triangleVerts;
  }
};
