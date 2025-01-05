import p5 from '../../../src/app.js';
import { ComputeShader } from '../../../src/core/compute-shader.js';

suite('compute_shader', function() {
  let myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  test('ComputeShader initialization', function() {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 100,
      particleStruct: {
        position: 'vec3',
        velocity: 'vec2',
        age: 'float'
      },
      computeFunction: `
        Particle compute(Particle p) {
          p.position += vec3(p.velocity, 0.0);
          p.age += 0.01;
          return p;
        }
      `
    });

    assert(computeShader instanceof ComputeShader, 'ComputeShader was not created successfully');
    assert(computeShader.particleCount === 100, 'Particle count was not set correctly');
    assert(Object.keys(computeShader.particleStruct).length === 3, 'Particle struct does not have the correct number of properties');
    assert(computeShader.particleStruct.position === 'vec3', 'Position type is incorrect');
    assert(computeShader.particleStruct.velocity === 'vec2', 'Velocity type is incorrect');
    assert(computeShader.particleStruct.age === 'float', 'Age type is incorrect');
  });

  test('ComputeShader texture size calculation', function() {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 1000,
      particleStruct: {
        position: 'vec3',
        velocity: 'vec3',
        color: 'vec3',
        size: 'float'
      },
      computeFunction: `
        Particle compute(Particle p) {
          return p;
        }
      `
    });

    const expectedPixelsPerParticle = 3; // (3 + 3 + 3 + 1) components / 4 components per pixel, rounded up
    const expectedTextureWidth = 1000 * expectedPixelsPerParticle;

    assert(computeShader.textureWidth === expectedTextureWidth, `Texture width should be ${expectedTextureWidth}`);
    assert(computeShader.textureHeight === 1, 'Texture height should be 1');
  });

  test('ComputeShader setParticles and getParticles', function() {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 2,
      particleStruct: {
        position: 'vec3',
        velocity: 'vec2',
        age: 'float'
      },
      computeFunction: `
        Particle compute(Particle p) {
          return p;
        }
      `
    });

    const initialParticles = [
      { position: [0, 0, 0], velocity: [1, 1], age: 0 },
      { position: [1, 1, 1], velocity: [-1, -1], age: 1 }
    ];

    computeShader.setParticles(initialParticles);
    const retrievedParticles = computeShader.getParticles();

    assert(retrievedParticles.length === 2, 'Retrieved particles count is incorrect');
    assert.deepEqual(retrievedParticles[0], initialParticles[0], 'First particle data does not match');
    assert.deepEqual(retrievedParticles[1], initialParticles[1], 'Second particle data does not match');
  });

  test('ComputeShader compute function', function() {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 1,
      particleStruct: {
        position: 'vec3',
        velocity: 'vec2',
        age: 'float'
      },
      computeFunction: `
        Particle compute(Particle p) {
          p.position += vec3(p.velocity, 0.0);
          p.age += 1.0;
          return p;
        }
      `
    });

    const initialParticle = [
      { position: [0, 0, 0], velocity: [0.1, 0.2], age: 0 }
    ];

    computeShader.setParticles(initialParticle);
    computeShader.compute();
    const updatedParticle = computeShader.getParticles()[0];

    assert.closeTo(updatedParticle.position[0], 0.1, 0.001, 'X position not updated correctly');
    assert.closeTo(updatedParticle.position[1], 0.2, 0.001, 'Y position not updated correctly');
    assert.closeTo(updatedParticle.position[2], 0, 0.001, 'Z position should not change');
    assert.closeTo(updatedParticle.age, 1, 0.001, 'Age not updated correctly');
  });
});