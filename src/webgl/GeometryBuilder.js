import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 * @private
 * A class responsible for converting successive WebGL draw calls into a single
 * `p5.Geometry` that can be reused and drawn with `model()`.
 */
class GeometryBuilder {
  constructor(renderer) {
    this.renderer = renderer;
    renderer._pInst.push();
    this.identityMatrix = new p5.Matrix();
    renderer.uModelMatrix = new p5.Matrix();
    this.geometry = new p5.Geometry();
    this.geometry.gid = `_p5_GeometryBuilder_${GeometryBuilder.nextGeometryId}`;
    GeometryBuilder.nextGeometryId++;
    this.hasTransform = false;
  }

  /**
   * @private
   * Applies the current transformation matrix to each vertex.
   */
  transformVertices(vertices) {
    if (!this.hasTransform) return vertices;

    return vertices.map(v => this.renderer.uModelMatrix.multiplyPoint(v));
  }

  /**
   * @private
   * Applies the current normal matrix to each normal.
   */
  transformNormals(normals) {
    if (!this.hasTransform) return normals;

    return normals.map(
      v => this.renderer.uNMatrix.multiplyVec3(v)
    );
  }

  /**
   * @private
   * Adds a p5.Geometry to the builder's combined geometry, flattening
   * transformations.
   */
  addGeometry(input) {
    this.hasTransform = !this.renderer.uModelMatrix.mat4
      .every((v, i) => v === this.identityMatrix.mat4[i]);

    if (this.hasTransform) {
      this.renderer.uNMatrix.inverseTranspose(this.renderer.uModelMatrix);
    }

    let startIdx = this.geometry.vertices.length;
    this.geometry.vertices.push(...this.transformVertices(input.vertices));
    this.geometry.vertexNormals.push(
      ...this.transformNormals(input.vertexNormals)
    );
    this.geometry.uvs.push(...input.uvs);

    if (this.renderer._doFill) {
      this.geometry.faces.push(
        ...input.faces.map(f => f.map(idx => idx + startIdx))
      );
    }
    if (this.renderer._doStroke) {
      this.geometry.edges.push(
        ...input.edges.map(edge => edge.map(idx => idx + startIdx))
      );
    }
    const vertexColors = [...input.vertexColors];
    while (vertexColors.length < input.vertices.length * 4) {
      vertexColors.push(...this.renderer.curFillColor);
    }
    this.geometry.vertexColors.push(...vertexColors);
  }

  /**
   * Adds geometry from the renderer's immediate mode into the builder's
   * combined geometry.
   */
  addImmediate() {
    const geometry = this.renderer.immediateMode.geometry;
    const shapeMode = this.renderer.immediateMode.shapeMode;
    const faces = [];

    if (this.renderer._doFill) {
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
      } else {
        for (let i = 0; i < geometry.vertices.length; i += 3) {
          faces.push([i, i + 1, i + 2]);
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
    this.addGeometry(geometry.model);
  }

  /**
   * Cleans up the state of the renderer and returns the combined geometry that
   * was built.
   * @returns p5.Geometry The flattened, combined geometry
   */
  finish() {
    this.renderer._pInst.pop();
    return this.geometry;
  }
}

/**
 * Keeps track of how many custom geometry objects have been made so that each
 * can be assigned a unique ID.
 */
GeometryBuilder.nextGeometryId = 0;

export default GeometryBuilder;
