import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import loading from '../../../src/webgl/loading';
import { Geometry } from '../../../src/webgl/p5.Geometry';

suite('loadModel', function() {
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
    await expect(mockP5Prototype.loadModel(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadModel(invalidFile, () => {
        reject('Success callback executed');
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadModel(validFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, err => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('loads OBJ file with associated MTL file correctly', async function(){
    const model = await mockP5Prototype.loadModel(validObjFileforMtl);

    const expectedColors = [
      0, 0, 0.5, 1,
      0, 0, 0.5, 1,
      0, 0, 0.5, 1,
      0, 0, 0.942654, 1,
      0, 0, 0.942654, 1,
      0, 0, 0.942654, 1,
      0, 0.815632, 1, 1,
      0, 0.815632, 1, 1,
      0, 0.815632, 1, 1,
      0, 0.965177, 1, 1,
      0, 0.965177, 1, 1,
      0, 0.965177, 1, 1,
      0.848654, 1, 0.151346, 1,
      0.848654, 1, 0.151346, 1,
      0.848654, 1, 0.151346, 1,
      1, 0.888635, 0, 1,
      1, 0.888635, 0, 1,
      1, 0.888635, 0, 1,
      1, 0.77791, 0, 1,
      1, 0.77791, 0, 1,
      1, 0.77791, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1
    ];

    assert.deepEqual(model.vertexColors, expectedColors);
  });

  test('splits a multi-material OBJ into one part per material', async function() {
    const model = await mockP5Prototype.loadModel(validObjFileforMtl);

    // octa-color.obj uses 8 materials, one per face
    assert.equal(model.parts.length, 8);

    // every face ends up in exactly one part
    const totalFaces = model.parts.reduce((sum, p) => sum + p.faces.length, 0);
    assert.equal(totalFaces, model.faces.length);

    // first material (m000001) is Kd 0 0 0.5 -> part fill
    assert.deepEqual(model.parts[0].partState.fill, [0, 0, 0.5]);
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

  test('loads the diffuse texture (map_Kd) onto the part state', async function() {
    const fakeImage = { width: 1, height: 1 };
    mockP5Prototype.loadImage = async url => {
      // texture path is resolved relative to the model folder
      assert.ok(url.endsWith('/cat.jpg'));
      return fakeImage;
    };
    try {
      const model = await mockP5Prototype.loadModel('/test/unit/assets/textured.obj');
      // single material -> one part carrying that material's state
      assert.equal(model.parts.length, 1);
      assert.equal(model.parts[0].partState.texture, fakeImage);
      assert.equal(model.parts[0].partState.shininess, 50);
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('a texture that fails to load is skipped without failing the model', async function() {
    mockP5Prototype.loadImage = async () => {
      throw new Error('Not Found');
    };
    try {
      const model = await mockP5Prototype.loadModel('/test/unit/assets/textured.obj');
      assert.equal(model.parts.length, 1);
      assert.equal(model.parts[0].partState.texture, null);
    } finally {
      delete mockP5Prototype.loadImage;
    }
  });

  test('mixed material coloring loads model with sentinel colors for uncolored vertices', async function() {
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

  test('missing MTL file shows OBJ model without vertexColors', async function() {
    const model = await mockP5Prototype.loadModel(objMtlMissing);
    assert.instanceOf(model, Geometry);
    assert.equal(model.vertexColors.length, 0, 'Model should not have vertex colors');
  });

  test('returns an object with correct data', async function() {
    const model = await mockP5Prototype.loadModel(validFile);
    assert.instanceOf(model, Geometry);
  });

  test('passes an object with correct data to callback', async function() {
    await mockP5Prototype.loadModel(validFile, model => {
      assert.instanceOf(model, Geometry);
    });
  });

  test('resolves STL file correctly', async function() {
    const model = await mockP5Prototype.loadModel(validSTLfile);
    assert.instanceOf(model, Geometry);
  });

  test('resolves STL file correctly with explicit extension', async function() {
    const model = await mockP5Prototype.loadModel(validSTLfileWithoutExtension, '.stl');
    assert.instanceOf(model, Geometry);
  });

  test('resolves STL file correctly with case insensitive extension', async function() {
    const model = await mockP5Prototype.loadModel(validSTLfileWithoutExtension, '.STL');
    assert.instanceOf(model, Geometry);
  });

  test('OBJ with negative vertex indices loads correctly', async function() {
    const model = await mockP5Prototype.loadModel(negativeIndexCubeFile);
    assert.instanceOf(model, Geometry);
    assert.isAbove(model.vertices.length, 0, 'Model should have vertices');
    assert.isAbove(model.faces.length, 0, 'Model should have faces');
  });

  test('OBJ negative indices produce same geometry as positive', async function() {
    const positiveModel = await mockP5Prototype.loadModel(validCubeFile);
    const negativeModel = await mockP5Prototype.loadModel(negativeIndexCubeFile);
    assert.equal(positiveModel.vertices.length, negativeModel.vertices.length,
      'Vertex count should match');
    assert.equal(positiveModel.faces.length, negativeModel.faces.length,
      'Face count should match');
  });
});
