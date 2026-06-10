/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 */

// fresh part state. fields use p5 names (fill, texture...), not obj/mtl tokens.
// importers translate into this and drop anything we can't draw yet.
function createPartState() {
  return {
    fill: null,           // Kd
    ambientColor: null,   // Ka
    specularColor: null,  // Ks
    shininess: null,      // Ns
    texture: null         // map_Kd
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
  }
}

function geometryPart(p5, fn) {
  p5.GeometryPart = GeometryPart;
}

export default geometryPart;
export { GeometryPart, createPartState };

if (typeof p5 !== 'undefined') {
  geometryPart(p5, p5.prototype);
}
