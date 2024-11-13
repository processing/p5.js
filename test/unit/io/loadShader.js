// import p5 from '../../../src/app.js';
// import { testSketchWithPromise, promisedSketch } from '../../js/p5_helpers';
import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import material from '../../../src/webgl/material';

suite('loadShader', function() {
  const invalidFile = '404file';
  const vertFile = '/test/unit/assets/vert.glsl';
  const fragFile = '/test/unit/assets/frag.glsl';

  beforeAll(async () => {
    material(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors in vert shader', async () => {
    await expect(mockP5Prototype.loadShader(invalidFile, fragFile))
      .rejects
      .toThrow('Not Found');
  });

  test('throws error when encountering HTTP errors in frag shader', async () => {
    await expect(mockP5Prototype.loadShader(vertFile, invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called for vert shader', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadShader(invalidFile, fragFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('error callback is called for frag shader', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadShader(vertFile, invalidFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadShader(vertFile, fragFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, (err) => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  // test('returns an object with correct data', async function() {
  //   const shader = await promisedSketch(function(sketch, resolve, reject) {
  //     var _shader;
  //     sketch.preload = function() {
  //       _shader = sketch.loadShader(vertFile, fragFile, function() {}, reject);
  //     };

  //     sketch.setup = function() {
  //       resolve(_shader);
  //     };
  //   });
  //   assert.instanceOf(shader, p5.Shader);
  // });

  // test('passes an object with correct data to callback', async function() {
  //   const model = await promisedSketch(function(sketch, resolve, reject) {
  //     sketch.preload = function() {
  //       sketch.loadShader(vertFile, fragFile, resolve, reject);
  //     };
  //   });
  //   assert.instanceOf(model, p5.Shader);
  // });

  // test('does not run setup after complete when called outside of preload', async function() {
  //   let setupCallCount = 0;
  //   await promisedSketch(function(sketch, resolve, reject) {
  //     sketch.setup = function() {
  //       setupCallCount++;
  //       sketch.loadShader(vertFile, fragFile, resolve, reject);
  //     };
  //   });
  //   assert.equal(setupCallCount, 1);
  // });
});
