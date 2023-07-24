import p5 from '../core/main';
import * as constants from '../core/constants';

class GeometryBuilder {
  constructor(renderer) {
    this.renderer = renderer;
    renderer.push();
    this.identityMatrix = new p5.Matrix();
    renderer.uMVMatrix = new p5.Matrix();
    this.geometry = new p5.Geometry();
    this.geometry.gid = `_p5_GeometryBuilder_${renderer.nextGeometryId}`;
    renderer.nextGeometryId++;
    this.hasTransform = false;
  }

  /**
   * @private
   */
  transformVertices(vertices) {
    if (!this.hasTransform) return vertices;

    return vertices.map(v => this.renderer.uMVMatrix.multiplyPoint(v));
  }

  /**
   * @private
   */
  transformNormals(normals) {
    if (!this.hasTransform) return normals;

    return normals.map(v => this.renderer.uNMatrix.multiplyVec3Direction(v));
  }

  /**
   * @private
   */
  addGeometry(input) {
    this.hasTransform = this.renderer.uMVMatrix.mat4
      .every((v, i) => v === this.identity.mat4[i]);

    if (this.hasTransform) {
      this.renderer.uNMatrix.inverseTranspose(this.renderer.uMVMatrix);
    }

    const startIdx = this.geometry.vertices.length;
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
      vertexColors.push(this.renderer.curFillColor);
    }
    this.geometry.vertexColors.push(...vertexColors);
  }

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
      } else if (shapeMode === this.p5.TRIANGLE_FAN) {
        for (let i = 2; i < geometry.vertices.length; i++) {
          faces.push([0, i - 1, i]);
        }
      } else {
        for (let i = 0; i < geometry.vertices.length; i += 3) {
          faces.push([i, i + 1, i + 2]);
        }
      }
    }

    this.addGeometry(Object.assign({}, geometry, faces));
  }

  addRetained(geometry) {
    this.addGeometry(geometry.model);
  }

  finish() {
    renderer.pop();
    return this.geometry;
  }
}

export default GeometryBuilder;
