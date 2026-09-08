import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import loading from '../../../src/webgl/loading';
import { Geometry } from '../../../src/webgl/p5.Geometry';
import { vi } from 'vitest';

suite('loadModel', function () {
  const invalidFile = '404file';
  const validFile = '/test/unit/assets/teapot.obj';
  const validObjFileforMtl = '/test/unit/assets/octa-color.obj';
  const validSTLfile = '/test/unit/assets/ascii.stl';
  const inconsistentColorObjFile = '/test/unit/assets/eg1.obj';
  const objMtlMissing = '/test/unit/assets/objMtlMissing.obj';
  const validSTLfileWithoutExtension = '/test/unit/assets/ascii';
  const validCubeFile = '/test/unit/assets/cube.obj';
  const negativeIndexCubeFile = '/test/unit/assets/cube-negative-indices.obj';

  beforeAll(async () => {
    loading(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadModel(invalidFile)).rejects.toThrow(
      'Not Found'
    );
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadModel(
        invalidFile,
        () => {
          reject('Success callback executed');
        },
        () => {
          // Wait a bit so that if both callbacks are executed we will get an error.
          setTimeout(resolve, 50);
        }
      );
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadModel(
        validFile,
        () => {
          // Wait a bit so that if both callbacks are executed we will get an error.
          setTimeout(resolve, 50);
        },
        err => {
          reject(`Error callback called: ${err.toString()}`);
        }
      );
    });
  });

  test('loads OBJ file with associated MTL file correctly', async function () {
    const model = await mockP5Prototype.loadModel(validObjFileforMtl);

    const expectedColors = [
      0, 0, 0.5, 1, 0, 0, 0.5, 1, 0, 0, 0.5, 1, 0, 0, 0.942654, 1, 0, 0,
      0.942654, 1, 0, 0, 0.942654, 1, 0, 0.815632, 1, 1, 0, 0.815632, 1, 1, 0,
      0.815632, 1, 1, 0, 0.965177, 1, 1, 0, 0.965177, 1, 1, 0, 0.965177, 1, 1,
      0.848654, 1, 0.151346, 1, 0.848654, 1, 0.151346, 1, 0.848654, 1, 0.151346,
      1, 1, 0.888635, 0, 1, 1, 0.888635, 0, 1, 1, 0.888635, 0, 1, 1, 0.77791, 0,
      1, 1, 0.77791, 0, 1, 1, 0.77791, 0, 1, 0.5, 0, 0, 1, 0.5, 0, 0, 1, 0.5, 0,
      0, 1
    ];

    assert.deepEqual(model.vertexColors, expectedColors);
  });

  test('splits a multi-material OBJ into one part per material', async function () {
    const model = await mockP5Prototype.loadModel(validObjFileforMtl);

    // octa-color.obj uses 8 materials, one per face
    assert.equal(model.parts.length, 8);

    // every face ends up in exactly one part
    const totalFaces = model.parts.reduce((sum, p) => sum + p.faces.length, 0);
    assert.equal(totalFaces, model.faces.length);

    // first material (m000001) is Kd 0 0 0.5 -> part fill, opaque alpha
    assert.deepEqual(model.parts[0].partState.fill, [0, 0, 0.5, 1]);
    assert.equal(model.parts[0].partState.shininess, 100);

    // faces re-indexed against each part's own localised verts
    for (const part of model.parts) {
      for (const face of part.faces) {
        for (const idx of face) {
          assert.ok(idx >= 0 && idx < part.vertices.length);
        }
      }
    }
  });

  test('loads the diffuse texture (map_Kd) onto the part state', async function () {
    const fakeImage = { width: 1, height: 1 };
    mockP5Prototype.loadImage = async url => {
      // texture path is resolved relative to the model folder
      assert.ok(url.endsWith('/cat.jpg'));
      return fakeImage;
    };
    try {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/textured.obj'
      );
      // two materials, so two parts; the textured one carries the image.
      assert.equal(model.parts.length, 2);
      const textured = model.parts.find(p => p.partState.texture);
      assert.ok(textured, 'a part has the loaded texture');
      assert.equal(textured.partState.texture, fakeImage);
      assert.equal(textured.partState.shininess, 50);
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('a normal-mapped OBJ carries the normal map on its part', async function () {
    const fakeImage = { width: 1, height: 1 };
    mockP5Prototype.loadImage = async () => fakeImage;
    try {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/normal_mapped.obj'
      );
      // two materials, so two parts
      assert.equal(model.parts.length, 2);
      // the part with the normal map carries it
      const normalMapped = model.parts.find(p => p.partState.normalTexture);
      assert.ok(normalMapped, 'a part has the normal map');
      assert.equal(normalMapped.partState.normalTexture, fakeImage);
      // norm means read it as a normal map, not as heights
      assert.equal(normalMapped.partState.normalMapMode, 0);
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('a texture that fails to load is skipped without failing the model', async function () {
    mockP5Prototype.loadImage = async () => {
      throw new Error('Not Found');
    };
    try {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/textured.obj'
      );
      assert.equal(model.parts.length, 2);
      assert.ok(model.parts.every(p => p.partState.texture == null));
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('a single-material OBJ stays one part', async function () {
    // eg1.obj has one real material, so it is not split
    const model = await mockP5Prototype.loadModel(inconsistentColorObjFile);
    assert.equal(model.parts.length, 1);
    assert.equal(model.parts[0], model, 'the geometry is its own single part');
  });

  test('a single-material OBJ still receives its maps', async function () {
    const fakeImage = { width: 1, height: 1 };
    mockP5Prototype.loadImage = async () => fakeImage;
    try {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/single_material_textured.obj'
      );
      // one material, so no split: the geometry stays its own only part
      assert.equal(model.parts.length, 1);
      assert.equal(model.parts[0], model);
      // and it carries the material's state rather than dropping it
      assert.equal(model.partState.texture, fakeImage);
      assert.equal(model.partState.shininess, 60);
      assert.deepEqual(model.partState.specularColor, [0.5, 0.5, 0.5]);
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('a 12-material OBJ splits into 12 parts', async function () {
    const model = await mockP5Prototype.loadModel(
      '/test/unit/assets/multi_material_12.obj'
    );
    assert.equal(model.parts.length, 12);
    // every face still lands in exactly one part
    const totalFaces = model.parts.reduce((s, p) => s + p.faces.length, 0);
    assert.equal(totalFaces, model.faces.length);
  });

  test('parts get computed normals when the OBJ has none', async function () {
    // textured.obj has no vn lines, so normals are computed before the split
    const model = await mockP5Prototype.loadModel(
      '/test/unit/assets/textured.obj'
    );
    assert.equal(model.parts.length, 2);
    for (const part of model.parts) {
      assert.equal(
        part.vertexNormals.length,
        part.vertices.length,
        'each part has one computed normal per vertex'
      );
    }
  });

  test('each part carries its own localised uvs', async function () {
    const model = await mockP5Prototype.loadModel(
      '/test/unit/assets/textured.obj'
    );
    assert.equal(model.parts.length, 2);
    for (const part of model.parts) {
      assert.equal(
        part.uvs.length,
        part.vertices.length,
        'each part has one uv per localised vertex'
      );
    }
  });

  test('a failed texture load warns instead of failing silently', async function () {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockP5Prototype.loadImage = async () => {
      throw new Error('Not Found');
    };
    try {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/textured.obj'
      );
      // the model still loads with both material parts
      assert.equal(model.parts.length, 2);
      // the failed texture is skipped, so no part carries it
      assert.ok(model.parts.every(p => p.partState.texture == null));
      // and the failure is surfaced, not silent
      assert.ok(warnSpy.mock.calls.length > 0, 'a warning is emitted');
    } finally {
      delete mockP5Prototype.loadImage;
      warnSpy.mockRestore();
    }
  });

  test('mixed material coloring loads model with sentinel colors for uncolored vertices', async function () {
    const model = await mockP5Prototype.loadModel(inconsistentColorObjFile);
    assert.instanceOf(model, Geometry);
    assert.equal(
      model.vertexColors.length,
      model.vertices.length * 4,
      'vertexColors should have four entries per vertex'
    );
    const hasSentinel = model.vertexColors.some(
      (_, i) =>
        i % 4 === 0 &&
        model.vertexColors[i] === -1 &&
        model.vertexColors[i + 1] === -1 &&
        model.vertexColors[i + 2] === -1 &&
        model.vertexColors[i + 3] === -1
    );
    const hasRealColor = model.vertexColors.some(
      (_, i) => i % 4 === 0 && model.vertexColors[i] !== -1
    );
    assert.isTrue(hasSentinel, 'Uncolored vertices should have sentinel color');
    assert.isTrue(hasRealColor, 'Colored vertices should retain their color');
  });

  test('missing MTL file shows OBJ model without vertexColors', async function () {
    const model = await mockP5Prototype.loadModel(objMtlMissing);
    assert.instanceOf(model, Geometry);
    assert.equal(
      model.vertexColors.length,
      0,
      'Model should not have vertex colors'
    );
  });

  test('returns an object with correct data', async function () {
    const model = await mockP5Prototype.loadModel(validFile);
    assert.instanceOf(model, Geometry);
  });

  test('passes an object with correct data to callback', async function () {
    await mockP5Prototype.loadModel(validFile, model => {
      assert.instanceOf(model, Geometry);
    });
  });

  test('resolves STL file correctly', async function () {
    const model = await mockP5Prototype.loadModel(validSTLfile);
    assert.instanceOf(model, Geometry);
  });

  test('resolves STL file correctly with explicit extension', async function () {
    const model = await mockP5Prototype.loadModel(
      validSTLfileWithoutExtension,
      '.stl'
    );
    assert.instanceOf(model, Geometry);
  });

  test('resolves STL file correctly with case insensitive extension', async function () {
    const model = await mockP5Prototype.loadModel(
      validSTLfileWithoutExtension,
      '.STL'
    );
    assert.instanceOf(model, Geometry);
  });

  test('OBJ with negative vertex indices loads correctly', async function () {
    const model = await mockP5Prototype.loadModel(negativeIndexCubeFile);
    assert.instanceOf(model, Geometry);
    assert.isAbove(model.vertices.length, 0, 'Model should have vertices');
    assert.isAbove(model.faces.length, 0, 'Model should have faces');
  });

  test('OBJ negative indices produce same geometry as positive', async function () {
    const positiveModel = await mockP5Prototype.loadModel(validCubeFile);
    const negativeModel = await mockP5Prototype.loadModel(
      negativeIndexCubeFile
    );
    assert.equal(
      positiveModel.vertices.length,
      negativeModel.vertices.length,
      'Vertex count should match'
    );
    assert.equal(
      positiveModel.faces.length,
      negativeModel.faces.length,
      'Face count should match'
    );
  });

  suite('multi-material edge cases', function () {
    test('a two-material OBJ splits into one part per material', async function () {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/multi_material_2.obj'
      );
      assert.equal(model.parts.length, 2);
      assert.deepEqual(model.parts[0].partState.fill, [1, 0, 0, 1]);
      assert.deepEqual(model.parts[1].partState.fill, [0, 0, 1, 1]);
      // every face lands in exactly one part
      const total = model.parts.reduce((sum, p) => sum + p.faces.length, 0);
      assert.equal(total, model.faces.length);
    });

    test('usemtl naming a material the mtl does not define still loads', async function () {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/unknown_material.obj'
      );
      // the unknown group falls back to an empty material instead of throwing
      assert.equal(model.parts.length, 2);
      assert.deepEqual(model.parts[0].partState.fill, [0, 1, 0, 1]);
      assert.isNull(model.parts[1].partState.fill);
      const total = model.parts.reduce((sum, p) => sum + p.faces.length, 0);
      assert.equal(total, model.faces.length);
    });

    test('a material used in two separate groups collects into one part', async function () {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/duplicate_usemtl.obj'
      );
      // grouping is by material name, so the two 'a' groups share a part
      assert.equal(model.parts.length, 2);
      assert.deepEqual(
        model.parts.map(p => p.faces.length).sort(),
        [1, 2]
      );
      const total = model.parts.reduce((sum, p) => sum + p.faces.length, 0);
      assert.equal(total, model.faces.length);
    });

    test('an OBJ with no vn lines gets normals computed per part', async function () {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/no_normals.obj'
      );
      assert.equal(model.parts.length, 2);
      for (const part of model.parts) {
        assert.equal(part.vertexNormals.length, part.vertices.length);
      }
    });

    test('an OBJ with no mtllib loads as plain geometry', async function () {
      const model = await mockP5Prototype.loadModel(
        '/test/unit/assets/no_mtl.obj'
      );
      assert.isAbove(model.vertices.length, 0);
      assert.isAbove(model.faces.length, 0);
    });

    test('windows-style texture paths are resolved with forward slashes', async function () {
      const requested = [];
      mockP5Prototype.loadImage = async url => {
        requested.push(url);
        return { width: 1, height: 1 };
      };
      try {
        await mockP5Prototype.loadModel('/test/unit/assets/windows_path.obj');
        // the mtl writes `textures\cat.jpg`, which no server would resolve
        assert.equal(requested.length, 1);
        assert.notInclude(requested[0], '\\');
        assert.include(requested[0], 'textures/cat.jpg');
      } finally {
        delete mockP5Prototype.loadImage;
      }
    });
  });
});
