import { Vector } from '../math/p5.Vector';

const GLB_MAGIC = 0x46546c67;
const GLB_CHUNK_JSON = 0x4e4f534a;
const GLB_CHUNK_BIN = 0x004e4942;

const COMPONENT_ARRAYS = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};

const TYPE_SIZES = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

const NORMALIZED_DIVISORS = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };

// extensions that only change data p5.js already reads
const SUPPORTED_EXTENSIONS = ['KHR_mesh_quantization'];

const TRIANGLES = 4;
const TRIANGLE_STRIP = 5;
const TRIANGLE_FAN = 6;

function invalid(message) {
  return new Error(`Invalid glTF file: ${message}`);
}

function parseGLB(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  if (view.byteLength < 12 || view.getUint32(0, true) !== GLB_MAGIC) {
    throw new Error('Not a valid GLB file');
  }
  let json;
  let bin;
  let offset = 12;
  while (offset + 8 <= view.byteLength) {
    const length = view.getUint32(offset, true);
    const type = view.getUint32(offset + 4, true);
    const start = offset + 8;
    if (start + length > view.byteLength) {
      throw new Error('GLB file is cut off');
    }
    if (type === GLB_CHUNK_JSON) {
      const bytes = new Uint8Array(arrayBuffer, start, length);
      json = JSON.parse(new TextDecoder().decode(bytes));
    } else if (type === GLB_CHUNK_BIN && bin === undefined) {
      bin = arrayBuffer.slice(start, start + length);
    }
    offset = start + length;
  }
  if (!json) throw new Error('GLB file has no JSON chunk');
  return { json, bin };
}

// files that need draco, meshopt etc. would otherwise load as an empty model
function checkRequiredExtensions(gltf) {
  const required = (gltf.extensionsRequired || []).filter(
    name => !SUPPORTED_EXTENSIONS.includes(name)
  );
  if (required.length > 0) {
    throw new Error(
      `This glTF file needs ${required.join(', ')}, which p5.js does not support yet`
    );
  }
}

function typedView(gltf, buffers, viewIndex, byteOffset, ArrayType, length) {
  const view = gltf.bufferViews?.[viewIndex];
  if (!view) throw invalid(`bufferView ${viewIndex} is missing`);
  const buffer = buffers[view.buffer];
  if (!buffer) throw invalid(`buffer ${view.buffer} is missing`);
  const start = (view.byteOffset || 0) + (byteOffset || 0);
  if (start + length * ArrayType.BYTES_PER_ELEMENT > buffer.byteLength) {
    throw invalid(`bufferView ${viewIndex} reads past the end of its buffer`);
  }
  return new ArrayType(buffer, start, length);
}

function readFlat(gltf, buffers, index) {
  const accessor = gltf.accessors?.[index];
  const size = TYPE_SIZES[accessor?.type];
  const ArrayType = COMPONENT_ARRAYS[accessor?.componentType];
  if (!size || !ArrayType) {
    throw invalid(`accessor ${index} is missing or has an unknown type`);
  }
  const { count } = accessor;
  const divisor = accessor.normalized
    ? NORMALIZED_DIVISORS[accessor.componentType] || 1
    : 1;
  const read = value =>
    divisor === 1 ? value : Math.max(value / divisor, -1);
  const data = new (divisor === 1 ? ArrayType : Float32Array)(count * size);

  if (accessor.bufferView !== undefined && count > 0) {
    const byteStride = gltf.bufferViews?.[accessor.bufferView]?.byteStride;
    const stride = byteStride ? byteStride / ArrayType.BYTES_PER_ELEMENT : size;
    const source = typedView(
      gltf,
      buffers,
      accessor.bufferView,
      accessor.byteOffset,
      ArrayType,
      (count - 1) * stride + size
    );
    if (stride === size && divisor === 1) {
      data.set(source);
    } else {
      for (let i = 0; i < count; i++) {
        for (let c = 0; c < size; c++) {
          data[i * size + c] = read(source[i * stride + c]);
        }
      }
    }
  }

  if (accessor.sparse) {
    const { count: sparseCount, indices, values } = accessor.sparse;
    const IndexType = COMPONENT_ARRAYS[indices.componentType];
    if (!IndexType) throw invalid(`accessor ${index} has bad sparse indices`);
    const targets = typedView(
      gltf,
      buffers,
      indices.bufferView,
      indices.byteOffset,
      IndexType,
      sparseCount
    );
    const replacements = typedView(
      gltf,
      buffers,
      values.bufferView,
      values.byteOffset,
      ArrayType,
      sparseCount * size
    );
    for (let i = 0; i < sparseCount; i++) {
      if (targets[i] >= count) {
        throw invalid(`accessor ${index} has a sparse index out of range`);
      }
      for (let c = 0; c < size; c++) {
        data[targets[i] * size + c] = read(replacements[i * size + c]);
      }
    }
  }
  return { data, size, count };
}

function readAccessor(gltf, buffers, index) {
  const { data, size, count } = readFlat(gltf, buffers, index);
  return Array.from({ length: count }, (_, i) =>
    Array.from(data.subarray(i * size, i * size + size))
  );
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 4; k++) {
        out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
      }
    }
  }
  return out;
}

function fromTRS(t = [0, 0, 0], r = [0, 0, 0, 1], s = [1, 1, 1]) {
  const [x, y, z, w] = r;
  return [
    (1 - 2 * (y * y + z * z)) * s[0],
    2 * (x * y + z * w) * s[0],
    2 * (x * z - y * w) * s[0],
    0,
    2 * (x * y - z * w) * s[1],
    (1 - 2 * (x * x + z * z)) * s[1],
    2 * (y * z + x * w) * s[1],
    0,
    2 * (x * z + y * w) * s[2],
    2 * (y * z - x * w) * s[2],
    (1 - 2 * (x * x + y * y)) * s[2],
    0,
    t[0],
    t[1],
    t[2],
    1
  ];
}

const IDENTITY = fromTRS();

function nodeMatrix(node) {
  if (node.matrix) return node.matrix;
  return fromTRS(node.translation, node.rotation, node.scale);
}

// inverse transpose, so non-uniform scale keeps normals perpendicular
function normalMatrix(m) {
  const [a, b, c, d, e, f, g, h, i] = [
    m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]
  ];
  const det = a * (e * i - f * h) - d * (b * i - c * h) + g * (b * f - c * e);
  const inv = 1 / (det || 1);
  return {
    det,
    rows: [
      [(e * i - f * h) * inv, (c * h - b * i) * inv, (b * f - c * e) * inv],
      [(f * g - d * i) * inv, (a * i - c * g) * inv, (c * d - a * f) * inv],
      [(d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv]
    ]
  };
}

function transformPoints(m, { data, count }) {
  const out = new Float64Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    out[i * 3] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[i * 3 + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[i * 3 + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
  }
  return out;
}

function transformNormals({ rows }, { data, count }) {
  const out = new Float64Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const n = rows.map(row => row[0] * x + row[1] * y + row[2] * z);
    const length = Math.hypot(...n) || 1;
    for (let c = 0; c < 3; c++) out[i * 3 + c] = n[c] / length;
  }
  return out;
}

function faceNormal(p, a, b, c) {
  const at = (i, k) => p[i * 3 + k];
  const u = [0, 1, 2].map(k => at(b, k) - at(a, k));
  const v = [0, 1, 2].map(k => at(c, k) - at(a, k));
  const n = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0]
  ];
  const length = Math.hypot(...n) || 1;
  return n.map(k => k / length);
}

function toTriangles(mode, indices) {
  if (mode === TRIANGLES) return indices;
  const out = [];
  if (mode === TRIANGLE_STRIP) {
    for (let i = 0; i + 2 < indices.length; i++) {
      if (i % 2 === 0) out.push(indices[i], indices[i + 1], indices[i + 2]);
      else out.push(indices[i + 1], indices[i], indices[i + 2]);
    }
  } else {
    for (let i = 1; i + 1 < indices.length; i++) {
      out.push(indices[0], indices[i], indices[i + 1]);
    }
  }
  return out;
}

function roughnessToShininess(roughness) {
  const alpha = roughness * roughness;
  return Math.min(200, Math.max(1, 2 / (alpha * alpha + 1e-4) - 2));
}

// the metallic-roughness map isn't read yet, so assume non-metal, half rough
function gltfMaterialToMtl(material = {}) {
  const pbr = material.pbrMetallicRoughness || {};
  const base = pbr.baseColorFactor || [1, 1, 1, 1];
  const hasMap = !!pbr.metallicRoughnessTexture;
  const metallic = hasMap ? 0 : pbr.metallicFactor ?? 1;
  const roughness = (pbr.roughnessFactor ?? 1) * (hasMap ? 0.5 : 1);
  const strength = (1 - roughness) ** 2 + 0.05;

  const result = {
    diffuseColor: base.slice(0, 3),
    opacity: material.alphaMode === 'BLEND' ? base[3] : 1,
    specularColor: base
      .slice(0, 3)
      .map(c => (0.04 + (c - 0.04) * metallic) * strength),
    shininess: roughnessToShininess(roughness)
  };
  if (pbr.baseColorTexture) {
    result.textureIndex = pbr.baseColorTexture.index;
    if (metallic > 0) {
      result.specularTextureIndex = pbr.baseColorTexture.index;
      const level = (0.04 + 0.96 * metallic) * strength;
      result.specularColor = [level, level, level];
    }
  }
  if (material.normalTexture) {
    result.normalTextureIndex = material.normalTexture.index;
    result.bumpScale = material.normalTexture.scale ?? 1;
  }
  return result;
}

function sceneRoots(gltf) {
  const scenes = gltf.scenes || [];
  const scene = scenes[gltf.scene ?? 0];
  if (scene) return scene.nodes || [];
  const children = new Set();
  (gltf.nodes || []).forEach(node =>
    (node.children || []).forEach(child => children.add(child))
  );
  return (gltf.nodes || []).map((_, i) => i).filter(i => !children.has(i));
}

function parseGLTF(model, gltf, buffers) {
  const faceMaterials = [];
  let skippedModes = false;

  const pushVertex = (p, pi, n, ni, uvs, ui) => {
    model.vertices.push(new Vector(p[pi * 3], p[pi * 3 + 1], p[pi * 3 + 2]));
    model.vertexNormals.push(
      ni === undefined
        ? new Vector(...n)
        : new Vector(n[ni * 3], n[ni * 3 + 1], n[ni * 3 + 2])
    );
    model.uvs.push(uvs ? [uvs.data[ui * uvs.size], uvs.data[ui * uvs.size + 1]] : [0, 0]);
    return model.vertices.length - 1;
  };

  const addPrimitive = (primitive, matrix) => {
    const mode = primitive.mode ?? TRIANGLES;
    if (![TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN].includes(mode)) {
      skippedModes = true;
      return;
    }
    const { attributes = {} } = primitive;
    if (attributes.POSITION === undefined) return;

    const position = readFlat(gltf, buffers, attributes.POSITION);
    const vertexCount = position.count;
    const positions = transformPoints(matrix, position);
    const normalMat = normalMatrix(matrix);
    const readAttribute = name => {
      if (attributes[name] === undefined) return null;
      const attribute = readFlat(gltf, buffers, attributes[name]);
      if (attribute.count < vertexCount) {
        throw invalid(`${name} has fewer items than POSITION`);
      }
      return attribute;
    };
    const normal = readAttribute('NORMAL');
    const normals = normal ? transformNormals(normalMat, normal) : null;
    const uvs = readAttribute('TEXCOORD_0');
    let indices;
    if (primitive.indices !== undefined) {
      indices = readFlat(gltf, buffers, primitive.indices).data;
      for (let i = 0; i < indices.length; i++) {
        if (!(indices[i] >= 0 && indices[i] < vertexCount)) {
          throw invalid(`an index is outside the ${vertexCount} vertices`);
        }
      }
    } else {
      indices = Array.from({ length: vertexCount }, (_, i) => i);
    }
    indices = toTriangles(mode, indices);
    const material = primitive.material ?? null;
    // a mirrored transform flips the winding, so swap it back
    const flip = normalMat.det < 0;

    if (normals) {
      const base = model.vertices.length;
      for (let i = 0; i < vertexCount; i++) {
        pushVertex(positions, i, normals, i, uvs, i);
      }
      for (let i = 0; i + 2 < indices.length; i += 3) {
        const [a, b, c] = [indices[i], indices[i + 1], indices[i + 2]];
        if (a === b || b === c || a === c) continue;
        model.faces.push(
          flip ? [base + a, base + c, base + b] : [base + a, base + b, base + c]
        );
        faceMaterials.push(material);
      }
      return;
    }

    // without normals the spec asks for flat shading
    for (let i = 0; i + 2 < indices.length; i += 3) {
      let [a, b, c] = [indices[i], indices[i + 1], indices[i + 2]];
      if (a === b || b === c || a === c) continue;
      if (flip) [b, c] = [c, b];
      const n = faceNormal(positions, a, b, c);
      model.faces.push(
        [a, b, c].map(v => pushVertex(positions, v, n, undefined, uvs, v))
      );
      faceMaterials.push(material);
    }
  };

  const addMesh = (meshIndex, matrix) => {
    const mesh = gltf.meshes?.[meshIndex];
    if (!mesh) throw invalid(`mesh ${meshIndex} is missing`);
    (mesh.primitives || []).forEach(primitive => addPrimitive(primitive, matrix));
  };

  const visiting = new Set();
  const visit = (nodeIndex, parentMatrix) => {
    const node = gltf.nodes[nodeIndex];
    if (!node) throw invalid(`node ${nodeIndex} is missing`);
    if (visiting.has(nodeIndex)) {
      throw invalid(`node ${nodeIndex} is its own ancestor`);
    }
    visiting.add(nodeIndex);
    const matrix = multiply(parentMatrix, nodeMatrix(node));
    if (node.mesh !== undefined) addMesh(node.mesh, matrix);
    (node.children || []).forEach(child => visit(child, matrix));
    visiting.delete(nodeIndex);
  };

  if (gltf.nodes && gltf.nodes.length) {
    sceneRoots(gltf).forEach(root => visit(root, IDENTITY));
  } else {
    (gltf.meshes || []).forEach((_, i) => addMesh(i, IDENTITY));
  }

  if (skippedModes) {
    console.warn('glTF: points and lines are not drawn yet, they were skipped');
  }
  return faceMaterials;
}

export {
  parseGLB,
  checkRequiredExtensions,
  readAccessor,
  parseGLTF,
  gltfMaterialToMtl,
  roughnessToShininess
};
