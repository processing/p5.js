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
        reject("Success callback executed");
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
      }, (err) => {
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

  test('inconsistent vertex coloring throws error', async function() {
    // Attempt to load the model and catch the error
    await expect(mockP5Prototype.loadModel(inconsistentColorObjFile))
      .rejects
      .toThrow('Model coloring is inconsistent. Either all vertices should have colors or none should.');
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
    await mockP5Prototype.loadModel(validFile, (model) => {
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
});
