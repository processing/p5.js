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
    fill: null,           // Kd + d -> [r, g, b, a] | null, each 0..1
    ambientColor: null,   // Ka -> [r, g, b] | null, each 0..1
    specularColor: null,  // Ks -> [r, g, b] | null, each 0..1
    shininess: null,      // Ns -> number | null
    texture: null         // map_Kd -> p5.Image | null
  };
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
    this.faces = [];
    this.uvs = [];
    this.vertexColors = [];

    this.partState = partState || createPartState();
    this.dirtyFlags = {};

    // custom per-vertex attributes (p5.strands). empty for parsed parts; the
    // single-part wrap points this back at the parent geometry.
    this.userVertexProperties = {};
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

export { GeometryPart, createPartState };
