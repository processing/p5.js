import p5 from "../../../src/app.js"
import { ComputeShader } from "../../../src/core/compute-shader.js"
import { suite, test, beforeAll, afterAll, assert } from "vitest"

suite("compute_shader", () => {
  let myp5

  beforeAll(() => {
    myp5 = new p5((p) => {
      p.setup = () => {
        p.createCanvas(100, 100, p.WEBGL)
      }
    })
  })

  afterAll(() => {
    myp5.remove()
  })

  test("ComputeShader initialization", () => {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 100,
      particleStruct: {
        position: "vec2",
        velocity: "vec2",
        age: "float",
      },
      computeFunction: `
        Particle compute(Particle p) {
          p.position += p.velocity;
          p.age += 0.01;
          return p;
        }
      `,
    })

    assert(computeShader instanceof ComputeShader, "ComputeShader was not created successfully")
    assert.strictEqual(computeShader.particleCount, 100, "Particle count was not set correctly")
    assert.strictEqual(
      Object.keys(computeShader.particleStruct).length,
      3,
      "Particle struct does not have the correct number of properties",
    )
    assert.strictEqual(computeShader.particleStruct.position, "vec2", "Position type is incorrect")
    assert.strictEqual(computeShader.particleStruct.velocity, "vec2", "Velocity type is incorrect")
    assert.strictEqual(computeShader.particleStruct.age, "float", "Age type is incorrect")
  })

  test("ComputeShader texture size calculation", () => {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 1000,
      particleStruct: {
        position: "vec2",
        velocity: "vec2",
        color: "vec3",
        size: "float",
      },
      computeFunction: `
        Particle compute(Particle p) {
          return p;
        }
      `,
    })

    const expectedPixelsPerParticle = 2 // (2 + 2 + 3 + 1) components / 4 components per pixel, rounded up
    const expectedTextureWidth = 1000 * expectedPixelsPerParticle

    assert.strictEqual(
      computeShader.textureWidth,
      expectedTextureWidth,
      `Texture width should be ${expectedTextureWidth}, but is ${computeShader.textureWidth}`,
    )
    assert.strictEqual(
      computeShader.textureHeight,
      1,
      `Texture height should be 1, but is ${computeShader.textureHeight}`,
    )
  })

  test("ComputeShader setParticles and getParticles", () => {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 2,
      particleStruct: {
        position: "vec2",
        velocity: "vec2",
        age: "float",
      },
      computeFunction: `
        Particle compute(Particle p) {
          return p;
        }
      `,
    })

    const initialParticles = [
      { position: [0, 0], velocity: [1, 1], age: 0 },
      { position: [1, 1], velocity: [-1, -1], age: 1 },
    ]

    computeShader.setParticles(initialParticles)
    const retrievedParticles = computeShader.getParticles()

    assert.strictEqual(
      retrievedParticles.length,
      2,
      `Retrieved particles count should be 2, but is ${retrievedParticles.length}`,
    )
    assert.deepStrictEqual(
      retrievedParticles[0],
      initialParticles[0],
      `First particle data does not match. Expected ${JSON.stringify(initialParticles[0])}, but got ${JSON.stringify(retrievedParticles[0])}`,
    )
    assert.deepStrictEqual(
      retrievedParticles[1],
      initialParticles[1],
      `Second particle data does not match. Expected ${JSON.stringify(initialParticles[1])}, but got ${JSON.stringify(retrievedParticles[1])}`,
    )
  })

  test("ComputeShader compute function", () => {
    const computeShader = new ComputeShader(myp5, {
      particleCount: 1,
      particleStruct: {
        position: "vec2",
        velocity: "vec2",
        age: "float",
      },
      computeFunction: `
        Particle compute(Particle p) {
          p.position += p.velocity;
          p.age += 1.0;
          return p;
        }
      `,
    })

    const initialParticle = [{ position: [0, 0], velocity: [0.1, 0.2], age: 0 }]

    computeShader.setParticles(initialParticle)
    computeShader.compute()
    const updatedParticle = computeShader.getParticles()[0]

    assert.approximately(
      updatedParticle.position[0],
      0.1,
      0.001,
      `X position not updated correctly. Expected 0.1, but got ${updatedParticle.position[0]}`,
    )
    assert.approximately(
      updatedParticle.position[1],
      0.2,
      0.001,
      `Y position not updated correctly. Expected 0.2, but got ${updatedParticle.position[1]}`,
    )
    assert.approximately(
      updatedParticle.age,
      1,
      0.001,
      `Age not updated correctly. Expected 1, but got ${updatedParticle.age}`,
    )
  })
})