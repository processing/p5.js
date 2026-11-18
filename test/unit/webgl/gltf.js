import p5 from '../../../src/app.js';
import { vi } from 'vitest';
import {
  parseGLB,
  checkRequiredExtensions,
  readAccessor,
  parseGLTF,
  gltfMaterialToMtl,
  roughnessToShininess
} from '../../../src/webgl/gltf';

function triangleGltf(nodes, { withNormals = false } = {}) {
  const data = new Float32Array([
    0, 0, 0, 1, 0, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1
  ]);
  const attributes = { POSITION: 0 };
  if (withNormals) attributes.NORMAL = 1;
  return {
    gltf: {
      nodes,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      meshes: [{ primitives: [{ attributes }] }],
      accessors: [
        { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3' },
        { bufferView: 1, componentType: 5126, count: 3, type: 'VEC3' }
      ],
      bufferViews: [
        { buffer: 0, byteOffset: 0, byteLength: 36 },
        { buffer: 0, byteOffset: 36, byteLength: 36 }
      ]
    },
    buffers: [data.buffer]
  };
}

suite('glTF parsing', function () {
  let myp5;

  beforeAll(function () {
    myp5 = new p5(function (p) {
      p.setup = function () {};
      p.draw = function () {};
    });
  });

  afterAll(function () {
    myp5.remove();
  });

  suite('files and accessors', function () {
    test('rejects a file that is not a GLB', function () {
      const notGlb = new Uint8Array([1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0]);
      assert.throws(() => parseGLB(notGlb.buffer), /GLB/);
    });

    test('rejects files that need an extension p5.js cannot decode', function () {
      assert.throws(
        () =>
          checkRequiredExtensions({
            extensionsRequired: ['KHR_draco_mesh_compression']
          }),
        /KHR_draco_mesh_compression/
      );
      assert.doesNotThrow(() => checkRequiredExtensions({}));
    });

    test('allows quantized files, which only use plain or normalized ints', function () {
      assert.doesNotThrow(() =>
        checkRequiredExtensions({ extensionsRequired: ['KHR_mesh_quantization'] })
      );
    });

    test('rejects a GLB whose chunk runs past the end of the file', function () {
      const glb = new DataView(new ArrayBuffer(20));
      glb.setUint32(0, 0x46546c67, true);
      glb.setUint32(12, 1000, true);
      glb.setUint32(16, 0x4e4f534a, true);
      assert.throws(() => parseGLB(glb.buffer), /cut off/);
    });

    test('rejects an accessor that reads past the end of its buffer', function () {
      const gltf = {
        accessors: [{ bufferView: 0, componentType: 5126, count: 10, type: 'VEC3' }],
        bufferViews: [{ buffer: 0, byteLength: 120 }]
      };
      assert.throws(
        () => readAccessor(gltf, [new ArrayBuffer(36)], 0),
        /past the end/
      );
    });

    test('rejects an accessor of an unknown type', function () {
      const gltf = {
        accessors: [{ bufferView: 0, componentType: 9999, count: 1, type: 'VEC3' }],
        bufferViews: [{ buffer: 0, byteLength: 12 }]
      };
      assert.throws(
        () => readAccessor(gltf, [new ArrayBuffer(12)], 0),
        /unknown type/
      );
    });

    test('reads interleaved and normalized accessors', function () {
      const data = new Uint8Array([255, 0, 9, 9, 0, 255, 9, 9]);
      const gltf = {
        accessors: [
          {
            bufferView: 0,
            componentType: 5121,
            normalized: true,
            count: 2,
            type: 'VEC2'
          }
        ],
        bufferViews: [{ buffer: 0, byteLength: 8, byteStride: 4 }]
      };
      assert.deepEqual(readAccessor(gltf, [data.buffer], 0), [
        [1, 0],
        [0, 1]
      ]);
    });

    test('applies sparse values on top of the base data', function () {
      const base = new Float32Array([1, 2, 3]);
      const sparseIndices = new Uint16Array([2, 0]);
      const sparseValues = new Float32Array([30, 10]);
      const bytes = new Uint8Array(12 + 4 + 8);
      bytes.set(new Uint8Array(base.buffer), 0);
      bytes.set(new Uint8Array(sparseIndices.buffer), 12);
      bytes.set(new Uint8Array(sparseValues.buffer), 16);
      const gltf = {
        accessors: [
          {
            bufferView: 0,
            componentType: 5126,
            count: 3,
            type: 'SCALAR',
            sparse: {
              count: 2,
              indices: { bufferView: 1, componentType: 5123 },
              values: { bufferView: 2 }
            }
          }
        ],
        bufferViews: [
          { buffer: 0, byteOffset: 0, byteLength: 12 },
          { buffer: 0, byteOffset: 12, byteLength: 4 },
          { buffer: 0, byteOffset: 16, byteLength: 8 }
        ]
      };
      assert.deepEqual(readAccessor(gltf, [bytes.buffer], 0), [[10], [2], [30]]);
    });
  });

  suite('materials', function () {
    test('maps metallic-roughness onto colour, specular and shininess', function () {
      const mtl = gltfMaterialToMtl({
        pbrMetallicRoughness: {
          baseColorFactor: [0.5, 0.25, 1, 0.5],
          metallicFactor: 1,
          roughnessFactor: 0
        },
        alphaMode: 'BLEND',
        normalTexture: { index: 2, scale: 0.5 }
      });
      assert.deepEqual(mtl.diffuseColor, [0.5, 0.25, 1]);
      assert.equal(mtl.opacity, 0.5);
      mtl.specularColor.forEach((c, i) =>
        assert.closeTo(c, [0.5, 0.25, 1][i] * 1.05, 1e-9)
      );
      assert.equal(mtl.shininess, 200);
      assert.equal(mtl.normalTextureIndex, 2);
      assert.equal(mtl.bumpScale, 0.5);
    });

    test('the default material is a dim, rough highlight, not chrome', function () {
      const mtl = gltfMaterialToMtl({});
      assert.deepEqual(mtl.diffuseColor, [1, 1, 1]);
      mtl.specularColor.forEach(c => assert.isBelow(c, 0.1));
      assert.equal(mtl.shininess, 1);
    });

    test('a metallic colour map also tints the shine', function () {
      const metal = gltfMaterialToMtl({
        pbrMetallicRoughness: {
          baseColorTexture: { index: 3 },
          roughnessFactor: 0
        }
      });
      assert.equal(metal.specularTextureIndex, 3);
      metal.specularColor.forEach(c => assert.closeTo(c, 1.05, 1e-9));
      const plastic = gltfMaterialToMtl({
        pbrMetallicRoughness: {
          baseColorTexture: { index: 3 },
          metallicFactor: 0
        }
      });
      assert.equal(plastic.specularTextureIndex, undefined);
    });

    test('with a metallic-roughness map, a textured material is not treated as metal', function () {
      const mtl = gltfMaterialToMtl({
        pbrMetallicRoughness: {
          baseColorTexture: { index: 1 },
          metallicRoughnessTexture: { index: 0 }
        }
      });
      assert.equal(mtl.shininess, roughnessToShininess(0.5));
      assert.equal(mtl.specularTextureIndex, undefined);
      mtl.specularColor.forEach(c => assert.isBelow(c, 0.1));
    });

    test('opaque materials ignore the base colour alpha', function () {
      const mtl = gltfMaterialToMtl({
        pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 0.2] }
      });
      assert.equal(mtl.opacity, 1);
    });

    test('smoother surfaces get tighter highlights', function () {
      assert.isAbove(roughnessToShininess(0.3), roughnessToShininess(0.8));
    });
  });

  suite('geometry', function () {
    test('gives a primitive without normals flat normals', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }]);
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.equal(model.faces.length, 1);
      model.vertexNormals.forEach(n => assert.closeTo(n.z, 1, 1e-6));
    });

    test('a primitive without normals leaves the authored ones alone', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }, { mesh: 1 }], {
        withNormals: true
      });
      gltf.meshes.push({ primitives: [{ attributes: { POSITION: 0 } }] });
      // the authored normals point along +x on purpose, unlike the face
      new Float32Array(buffers[0], 36, 9).set([1, 0, 0, 1, 0, 0, 1, 0, 0]);
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.closeTo(model.vertexNormals[0].x, 1, 1e-6);
      assert.closeTo(model.vertexNormals[3].z, 1, 1e-6);
    });

    test('rotates normals with their node', function () {
      const { gltf, buffers } = triangleGltf(
        [{ mesh: 0, rotation: [0, 0, Math.SQRT1_2, Math.SQRT1_2] }],
        { withNormals: true }
      );
      new Float32Array(buffers[0], 36, 9).set([1, 0, 0, 1, 0, 0, 1, 0, 0]);
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.closeTo(model.vertices[1].y, 1, 1e-6);
      assert.closeTo(model.vertexNormals[0].x, 0, 1e-6);
      assert.closeTo(model.vertexNormals[0].y, 1, 1e-6);
    });

    test('keeps triangles facing out under a mirrored node', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0, scale: [-1, 1, 1] }], {
        withNormals: true
      });
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.deepEqual(model.faces[0], [0, 2, 1]);
      assert.closeTo(model.vertexNormals[0].z, 1, 1e-6);
    });

    function quadGltf(positions, indices) {
      const bytes = new Uint8Array(positions.byteLength + indices.byteLength);
      bytes.set(new Uint8Array(positions.buffer), 0);
      bytes.set(new Uint8Array(indices.buffer), positions.byteLength);
      return {
        gltf: {
          meshes: [
            { primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }
          ],
          accessors: [
            {
              bufferView: 0,
              componentType: 5126,
              count: positions.length / 3,
              type: 'VEC3'
            },
            {
              bufferView: 1,
              componentType: 5125,
              count: indices.length,
              type: 'SCALAR'
            }
          ],
          bufferViews: [
            { buffer: 0, byteOffset: 0, byteLength: positions.byteLength },
            {
              buffer: 0,
              byteOffset: positions.byteLength,
              byteLength: indices.byteLength
            }
          ]
        },
        buffers: [bytes.buffer]
      };
    }

    test('flat normals come from computeNormals(SEGMENTED)', function () {
      const { gltf, buffers } = quadGltf(
        new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0]),
        new Uint32Array([0, 1, 2, 2, 1, 3])
      );
      const spy = vi.spyOn(p5.Geometry.prototype, 'computeNormals');
      try {
        const model = new p5.Geometry();
        parseGLTF(model, gltf, buffers);
        const types = spy.mock.calls.map(([type]) => type);
        assert.deepEqual(types, [p5.prototype.SEGMENTED]);
        const used = model.faces.flat();
        assert.equal(new Set(used).size, used.length);
        used.forEach(i => assert.closeTo(model.vertexNormals[i].z, 1, 1e-6));
      } finally {
        spy.mockRestore();
      }
    });

    test('leaves out vertices no face uses', function () {
      const { gltf, buffers } = quadGltf(
        new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 9, 9, 9]),
        new Uint32Array([0, 1, 2])
      );
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.equal(model.vertices.length, 3);
    });

    test('skips faces with no area without a warning', function () {
      const { gltf, buffers } = quadGltf(
        new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]),
        new Uint32Array([0, 1, 2, 0, 3, 1])
      );
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const model = new p5.Geometry();
        parseGLTF(model, gltf, buffers);
        assert.equal(model.faces.length, 1);
        assert.equal(warn.mock.calls.length, 0);
      } finally {
        warn.mockRestore();
      }
    });

    test('loads a large primitive without normals', function () {
      const size = 180;
      const positions = new Float32Array(size * size * 3);
      for (let i = 0; i < size * size; i++) {
        positions.set([i % size, Math.floor(i / size), 0], i * 3);
      }
      const indices = [];
      for (let y = 0; y + 1 < size; y++) {
        for (let x = 0; x + 1 < size; x++) {
          const i = y * size + x;
          indices.push(i, i + 1, i + size, i + size, i + 1, i + size + 1);
        }
      }
      const { gltf, buffers } = quadGltf(positions, new Uint32Array(indices));
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.equal(model.faces.length, indices.length / 3);
    });

    test('reads quantized positions through the node scale', function () {
      const data = new Int16Array([0, 0, 0, 100, 0, 0, 0, 100, 0]);
      const gltf = {
        extensionsRequired: ['KHR_mesh_quantization'],
        nodes: [{ mesh: 0, scale: [0.01, 0.01, 0.01] }],
        scenes: [{ nodes: [0] }],
        meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
        accessors: [
          { bufferView: 0, componentType: 5122, count: 3, type: 'VEC3' }
        ],
        bufferViews: [{ buffer: 0, byteLength: 18 }]
      };
      assert.doesNotThrow(() => checkRequiredExtensions(gltf));
      const model = new p5.Geometry();
      parseGLTF(model, gltf, [data.buffer]);
      assert.closeTo(model.vertices[1].x, 1, 1e-6);
      assert.closeTo(model.vertices[2].y, 1, 1e-6);
    });

    test('bakes the colour map texture transform into the uvs', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }]);
      const uvs = new Float32Array([0, 0, 1, 0, 0, 1]);
      buffers.push(uvs.buffer);
      gltf.accessors.push({
        bufferView: 2,
        componentType: 5126,
        count: 3,
        type: 'VEC2'
      });
      gltf.bufferViews.push({ buffer: 1, byteLength: 24 });
      gltf.meshes[0].primitives[0].attributes.TEXCOORD_0 = 2;
      gltf.meshes[0].primitives[0].material = 0;
      gltf.materials = [
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              extensions: {
                KHR_texture_transform: {
                  offset: [0.5, 0],
                  scale: [2, 3],
                  rotation: Math.PI / 2
                }
              }
            }
          }
        }
      ];
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      const flat = model.uvs.flat();
      [0.5, 0, 0.5, -2, 3.5, 0].forEach((v, i) =>
        assert.closeTo(flat[i], v, 1e-6)
      );
    });

    function twoUvSets() {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }]);
      const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 0.5, 0, 0, 0.5]);
      buffers.push(uvs.buffer);
      gltf.accessors.push(
        { bufferView: 2, componentType: 5126, count: 3, type: 'VEC2' },
        { bufferView: 3, componentType: 5126, count: 3, type: 'VEC2' }
      );
      gltf.bufferViews.push(
        { buffer: 1, byteOffset: 0, byteLength: 24 },
        { buffer: 1, byteOffset: 24, byteLength: 24 }
      );
      const primitive = gltf.meshes[0].primitives[0];
      primitive.attributes.TEXCOORD_0 = 2;
      primitive.attributes.TEXCOORD_1 = 3;
      primitive.material = 0;
      return { gltf, buffers };
    }

    test('no warning when both maps mean the same transform', function () {
      const { gltf, buffers } = twoUvSets();
      gltf.materials = [
        {
          pbrMetallicRoughness: {
            baseColorTexture: {
              index: 0,
              extensions: { KHR_texture_transform: { offset: [0, 0] } }
            }
          },
          normalTexture: { index: 1, texCoord: 0 }
        }
      ];
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        parseGLTF(new p5.Geometry(), gltf, buffers);
        assert.equal(warn.mock.calls.length, 0);
      } finally {
        warn.mockRestore();
      }
    });

    test('uses the uv set the colour map asks for', function () {
      const { gltf, buffers } = twoUvSets();
      gltf.materials = [
        {
          pbrMetallicRoughness: { baseColorTexture: { index: 0, texCoord: 1 } }
        }
      ];
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.deepEqual(model.uvs[1], [0.5, 0]);
    });

    test('warns when the normal map has its own texture transform', function () {
      const { gltf, buffers } = twoUvSets();
      gltf.materials = [
        {
          pbrMetallicRoughness: { baseColorTexture: { index: 0 } },
          normalTexture: {
            index: 1,
            extensions: { KHR_texture_transform: { scale: [2, 2] } }
          }
        }
      ];
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        parseGLTF(new p5.Geometry(), gltf, buffers);
        const messages = warn.mock.calls.map(([msg]) => msg);
        assert.ok(messages.some(msg => /colour map's/.test(msg)));
      } finally {
        warn.mockRestore();
      }
    });

    test('keeps flat normals facing out under a mirrored node', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0, scale: [-1, 1, 1] }]);
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      model.vertexNormals.forEach(n => assert.closeTo(n.z, 1, 1e-6));
    });

    test('rejects an index outside the vertices', function () {
      for (const [withNormals, values] of [
        [false, [0, 1, 7]],
        [true, [0, 1, 7]],
        [true, [0, 1, -1]]
      ]) {
        const { gltf, buffers } = triangleGltf([{ mesh: 0 }], { withNormals });
        const indices = new Int16Array(values);
        buffers.push(indices.buffer);
        gltf.accessors.push({
          bufferView: 2,
          componentType: 5122,
          count: 3,
          type: 'SCALAR'
        });
        gltf.bufferViews.push({ buffer: 1, byteLength: 6 });
        gltf.meshes[0].primitives[0].indices = 2;
        assert.throws(
          () => parseGLTF(new p5.Geometry(), gltf, buffers),
          /outside the 3 vertices/
        );
      }
    });

    test('rejects normals that are fewer than the positions', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }], { withNormals: true });
      gltf.accessors[1].count = 1;
      assert.throws(
        () => parseGLTF(new p5.Geometry(), gltf, buffers),
        /NORMAL has fewer items/
      );
    });

    test('rejects a primitive whose buffer is missing', function () {
      const { gltf } = triangleGltf([{ mesh: 0 }]);
      assert.throws(
        () => parseGLTF(new p5.Geometry(), gltf, [undefined]),
        /buffer 0 is missing/
      );
    });

    test('rejects a node that is its own child', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0, children: [0] }]);
      assert.throws(
        () => parseGLTF(new p5.Geometry(), gltf, buffers),
        /own ancestor/
      );
    });

    test('turns strips and fans into triangles', function () {
      const quad = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0]);
      for (const [mode, expected] of [
        [5, [[0, 1, 2], [2, 1, 3]]],
        [6, [[0, 1, 2], [0, 2, 3]]]
      ]) {
        const gltf = {
          nodes: [{ mesh: 0 }],
          scenes: [{ nodes: [0] }],
          meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 0 }, mode }] }],
          accessors: [
            { bufferView: 0, componentType: 5126, count: 4, type: 'VEC3' }
          ],
          bufferViews: [{ buffer: 0, byteLength: 48 }]
        };
        const model = new p5.Geometry();
        parseGLTF(model, gltf, [quad.buffer]);
        assert.deepEqual(model.faces, expected);
      }
    });

    test('draws a mesh with no nodes at all', function () {
      const { gltf, buffers } = triangleGltf([]);
      delete gltf.nodes;
      delete gltf.scenes;
      const model = new p5.Geometry();
      parseGLTF(model, gltf, buffers);
      assert.equal(model.faces.length, 1);
    });

    test('tags each face with its primitive material', function () {
      const { gltf, buffers } = triangleGltf([{ mesh: 0 }, { mesh: 1 }]);
      gltf.meshes[0].primitives[0].material = 1;
      gltf.meshes.push({ primitives: [{ attributes: { POSITION: 0 } }] });
      const model = new p5.Geometry();
      assert.deepEqual(parseGLTF(model, gltf, buffers), [1, null]);
    });
  });
});
