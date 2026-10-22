import { Vector } from '../math/p5.Vector';

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
}

export { GeometryPart, createPartState, createUserVertexProperty };
