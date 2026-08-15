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
    normalTexture: null, // map_Bump -> p5.Image | null
    normalScale: 1 // map_Bump -bm -> bump strength multiplier
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
}

export { GeometryPart, createPartState, createUserVertexProperty };
