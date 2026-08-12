import * as constants from '../core/constants';
import { Matrix } from '../math/p5.Matrix';
import { Geometry } from './p5.Geometry';
import { GeometryPart, createPartState } from './p5.GeometryPart';

/**
 * @private
 * A class responsible for converting successive WebGL draw calls into a single
 * `p5.Geometry` that can be reused and drawn with `model()`.
 */
class GeometryBuilder {
  constructor(renderer) {
    this.renderer = renderer;
    renderer._pInst.push();
    this.identityMatrix = new Matrix(4);
    renderer.states.setValue('uModelMatrix', new Matrix(4));
    this.geometry = new Geometry(
      undefined,
      undefined,
      undefined,
      this.renderer
    );
    this.geometry.gid = `_p5_GeometryBuilder_${GeometryBuilder.nextGeometryId}`;
    GeometryBuilder.nextGeometryId++;
    this.hasTransform = false;

    // material parts. when the material state (texture, specular, ambient,
    // shininess) changes between draws inside the callback, a new part is
    // opened, so model() renders the result per part like a multi-material obj.
    // fill stays baked into vertexColors, so a plain fill change never splits.
    this.parts = [];
    this.currentPart = null;
  }

  /**
   * @private
   * Applies the current transformation matrix to each vertex.
   */
  transformVertices(vertices) {
    if (!this.hasTransform) return vertices;

    return vertices.map(v =>
      this.renderer.states.uModelMatrix.multiplyPoint(v)
    );
  }

  /**
   * @private
   * Applies the current normal matrix to each normal.
   */
  transformNormals(normals) {
    if (!this.hasTransform) return normals;

    return normals.map(
      v => this.renderer.scratchMat3.multiplyVec(v) // this is a vec3
    );
  }

  /**
   * @private
   * Adds a p5.Geometry to the builder's combined geometry, flattening
   * transformations.
   */
  addGeometry(input) {
    this.hasTransform = !this.renderer.states.uModelMatrix.mat4.every(
      (v, i) => v === this.identityMatrix.mat4[i]
    );

    if (this.hasTransform) {
      this.renderer.scratchMat3.inverseTranspose4x4(
        this.renderer.states.uModelMatrix
      );
    }

    const transformedVertices = this.transformVertices(input.vertices);
    const transformedNormals = this.transformNormals(input.vertexNormals);
    let startIdx = this.geometry.vertices.length;
    for (const v of transformedVertices) {
      this.geometry.vertices.push(v);
    }
    for (const vn of transformedNormals) {
      this.geometry.vertexNormals.push(vn);
    }
    for (const val of input.uvs) {
      this.geometry.uvs.push(val);
    }

    const inputUserVertexProps = input.userVertexProperties;
    const builtUserVertexProps = this.geometry.userVertexProperties;
    const numPreviousVertices =
      this.geometry.vertices.length - input.vertices.length;

    for (const propName in builtUserVertexProps) {
      if (propName in inputUserVertexProps) {
        continue;
      }
      const prop = builtUserVertexProps[propName];
      const size = prop.getDataSize();
      const numMissingValues = size * input.vertices.length;
      const missingValues = Array(numMissingValues).fill(0);
      prop.pushDirect(missingValues);
    }
    for (const propName in inputUserVertexProps) {
      const prop = inputUserVertexProps[propName];
      const data = prop.getSrcArray();
      const size = prop.getDataSize();
      if (numPreviousVertices > 0 && !(propName in builtUserVertexProps)) {
        const numMissingValues = size * numPreviousVertices;
        const missingValues = Array(numMissingValues).fill(0);
        this.geometry.vertexProperty(propName, missingValues, size);
      }
      this.geometry.vertexProperty(propName, data, size);
    }

    if (this.renderer.states.fillColor) {
      this.geometry.faces.push(
        ...input.faces.map(f => f.map(idx => idx + startIdx))
      );
    }
    if (this.renderer.states.strokeColor) {
      for (const edge of input.edges.map(edge =>
        edge.map(idx => idx + startIdx)
      )) {
        this.geometry.edges.push(edge);
      }
    }
    const vertexColors = [...input.vertexColors];
    while (vertexColors.length < input.vertices.length * 4) {
      vertexColors.push(...this.renderer.states.curFillColor);
    }
    for (const c of vertexColors) {
      this.geometry.vertexColors.push(c);
    }

    this._addToCurrentPart(
      input,
      transformedVertices,
      transformedNormals,
      vertexColors
    );
  }

  /**
   * @private
   * snapshot the material state that can't live per vertex (texture, specular,
   * ambient, shininess), in p5's own state names. fill stays in vertexColors, so
   * a plain fill() change never opens a new part.
   */
  _snapshotPartState() {
    const s = this.renderer.states;
    const state = createPartState();
    if (s._tex) state.texture = s._tex;
    if (s._useSpecularMaterial) state.specularColor = s.curSpecularColor;
    if (s._hasSetAmbient) state.ambientColor = s.curAmbientColor;
    if (s._useShininess !== 1) state.shininess = s._useShininess;
    return state;
  }

  _sameColor(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  _sameMaterial(a, b) {
    return a.texture === b.texture &&
      a.shininess === b.shininess &&
      this._sameColor(a.specularColor, b.specularColor) &&
      this._sameColor(a.ambientColor, b.ambientColor);
  }

  /**
   * @private
   * append one draw to the current part, opening a new part when the material
   * changed. copied element by element like the combined geometry above, so the
   * part stays aligned whatever shape the uvs are.
   */
  _addToCurrentPart(input, vertices, normals, vertexColors) {
    // parts are made of fills; a stroke-only draw contributes no faces
    if (!this.renderer.states.fillColor) return;

    const state = this._snapshotPartState();
    if (
      !this.currentPart ||
      !this._sameMaterial(state, this.currentPart.partState)
    ) {
      this.currentPart = new GeometryPart(
        `${this.geometry.gid}|part${this.parts.length}`,
        state
      );
      this.parts.push(this.currentPart);
    }

    const part = this.currentPart;
    const startIdx = part.vertices.length;
    for (const v of vertices) {
      part.vertices.push(v);
    }
    for (const vn of normals) {
      part.vertexNormals.push(vn);
    }
    for (const val of input.uvs) {
      part.uvs.push(val);
    }
    for (const c of vertexColors) {
      part.vertexColors.push(c);
    }
    for (const f of input.faces) {
      part.faces.push(f.map(idx => idx + startIdx));
    }
  }

  /**
   * Adds geometry from the renderer's immediate mode into the builder's
   * combined geometry.
   */
  addImmediate(geometry, shapeMode, { validateFaces = false } = {}) {
    const faces = [];

    if (this.renderer.states.fillColor) {
      if (
        shapeMode === constants.TRIANGLE_STRIP ||
        shapeMode === constants.QUAD_STRIP
      ) {
        for (let i = 2; i < geometry.vertices.length; i++) {
          if (i % 2 === 0) {
            faces.push([i, i - 1, i - 2]);
          } else {
            faces.push([i, i - 2, i - 1]);
          }
        }
      } else if (shapeMode === constants.TRIANGLE_FAN) {
        for (let i = 2; i < geometry.vertices.length; i++) {
          faces.push([0, i - 1, i]);
        }
      } else if (shapeMode === constants.TRIANGLES) {
        for (let i = 0; i < geometry.vertices.length; i += 3) {
          if (
            !validateFaces ||
            geometry.vertices[i]
              .copy()
              .sub(geometry.vertices[i + 1])
              .cross(geometry.vertices[i].copy().sub(geometry.vertices[i + 2]))
              .magSq() > 0
          ) {
            faces.push([i, i + 1, i + 2]);
          }
        }
      }
    }
    this.addGeometry(Object.assign({}, geometry, { faces }));
  }

  /**
   * Adds geometry from the renderer's retained mode into the builder's
   * combined geometry.
   */
  addRetained(geometry) {
    this.addGeometry(geometry);
  }

  /**
   * Cleans up the state of the renderer and returns the combined geometry that
   * was built.
   * @returns p5.Geometry The flattened, combined geometry
   */
  finish() {
    this.renderer._pInst.pop();
    // expose the material parts only when there really are multiple materials,
    // and not while custom per-vertex attributes are in play (those aren't
    // split per part yet). single-material builds keep the geometry as its own
    // part, so nothing changes for them (zero regression).
    const hasUserProps =
      Object.keys(this.geometry.userVertexProperties).length > 0;
    if (this.parts.length >= 2 && !hasUserProps) {
      this.geometry.parts = this.parts;
    }
    return this.geometry;
  }
}

/**
 * Keeps track of how many custom geometry objects have been made so that each
 * can be assigned a unique ID.
 */
GeometryBuilder.nextGeometryId = 0;

export default GeometryBuilder;
