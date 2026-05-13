import p5 from '../../../src/app.js';
import rendererWebGPU from "../../../src/webgpu/p5.RendererWebGPU";

p5.registerAddon(rendererWebGPU);

suite('WebGPU p5.RendererWebGPU', function() {
  let myp5;
  let prevPixelRatio;

  beforeAll(async function() {
    prevPixelRatio = window.devicePixelRatio;
    window.devicePixelRatio = 1;
    myp5 = new p5(function(p) {
      p.setup = function() {};
    });
  });

  beforeEach(async function() {
    await myp5.createCanvas(50, 50, myp5.WEBGPU);
  });

  afterEach(function() {
    myp5.remove();
  });

  afterAll(function() {
    window.devicePixelRatio = prevPixelRatio;
  });

  suite('Buffer Pooling', function() {
    test('drawing geometry twice reuses vertex buffers', async function() {
      // Create a simple geometry
      const geom = myp5.buildGeometry(() => {
        myp5.triangle(0, 0, 10, 0, 5, 10);
      });

      // Draw the geometry once
      myp5.background(255);
      myp5.model(geom);

      // Check the vertex buffer pool size for position attribute
      const poolForVertexBuffer = geom._vertexBufferPools?.vertexBuffer;
      expect(poolForVertexBuffer).to.exist;
      const initialPoolSize = poolForVertexBuffer.length;
      const initialInUseSize = geom._vertexBuffersInUse?.vertexBuffer?.length || 0;

      // Draw the geometry again
      myp5.background(255);
      myp5.model(geom);

      // Verify the pool hasn't grown - buffers should be reused
      const finalPoolSize = poolForVertexBuffer.length;
      const finalInUseSize = geom._vertexBuffersInUse?.vertexBuffer?.length || 0;

      // Pool size should stay the same or be smaller (buffers moved from pool to in-use)
      // The total number of buffers (pool + in-use) should remain constant
      expect(initialPoolSize + initialInUseSize).to.equal(finalPoolSize + finalInUseSize);
    });

    test('freeGeometry causes new buffer allocation on next draw', async function() {
      // Create a simple geometry
      const geom = myp5.buildGeometry(() => {
        myp5.triangle(0, 0, 10, 0, 5, 10);
      });

      // Draw the geometry once
      myp5.background(255);
      myp5.model(geom);

      // Get initial buffer count
      const poolForVertexBuffer = geom._vertexBufferPools?.vertexBuffer;
      expect(poolForVertexBuffer).to.exist;
      const initialTotalBuffers = poolForVertexBuffer.length +
        (geom._vertexBuffersInUse?.vertexBuffer?.length || 0);

      // Free the geometry
      myp5.freeGeometry(geom);

      // Draw the geometry again
      myp5.background(255);
      myp5.model(geom);

      // After freeGeometry, new buffers should be allocated
      const finalTotalBuffers = poolForVertexBuffer.length +
        (geom._vertexBuffersInUse?.vertexBuffer?.length || 0);

      // We should have more buffers now since freeGeometry marks geometry as dirty
      // and new buffers need to be created
      expect(finalTotalBuffers).to.be.greaterThan(initialTotalBuffers);
    });

    test('immediate mode geometry reuses buffers across frames', async function() {
      // Function to draw the same shape using immediate mode
      const drawSameShape = () => {
        myp5.background(255);
        myp5.beginShape();
        myp5.vertex(0, 0);
        myp5.vertex(10, 0);
        myp5.vertex(5, 10);
        myp5.endShape();
      };

      // Draw the shape for the first frame
      drawSameShape();
      await myp5._renderer.finishDraw();

      // Get the immediate mode geometry (shapeBuilder geometry)
      const immediateGeom = myp5._renderer.shapeBuilder.geometry;
      const poolForVertexBuffer = immediateGeom._vertexBufferPools?.vertexBuffer;
      expect(poolForVertexBuffer).to.exist;

      const initialTotalBuffers = poolForVertexBuffer.length +
        (immediateGeom._vertexBuffersInUse?.vertexBuffer?.length || 0);

      // Draw the same shape for several more frames
      for (let frame = 0; frame < 5; frame++) {
        drawSameShape();
        await myp5._renderer.finishDraw();

        // Check that total buffer count hasn't increased
        const currentTotalBuffers = poolForVertexBuffer.length +
          (immediateGeom._vertexBuffersInUse?.vertexBuffer?.length || 0);

        expect(currentTotalBuffers).to.equal(initialTotalBuffers,
          `Buffer count should stay constant across frames (frame ${frame})`);
      }
    });
  });

  suite('noSmooth()', function() {
    test('disables antialiasing on the main canvas framebuffer', async function() {
      await myp5.noSmooth();
      expect(myp5._renderer.mainFramebuffer.antialias).to.equal(false);
    });
  });

  suite('Stability', function() {
    test('pixelDensity() after setAttributes() should not crash', async function() {
      // This test simulates the issue where a synchronous call (pixelDensity)
      // happens before an asynchronous initialization (setAttributes -> _resetContext)
      // is complete.
      await new Promise((resolve, reject) => {
        try {
          myp5 = new p5(p => {
            p.setup = async function() {
              try {
                await p.createCanvas(100, 100, p.WEBGPU);

                await p.setAttributes({ antialias: true });

                expect(() => {
                  p.pixelDensity(1);
                }).not.toThrow();

                resolve();
              } catch (err) {
                reject(err);
              }
            };
          });
        } catch (err) {
          reject(err);
        }
      });

      // Verify stability after the async reset
      expect(myp5._renderer).to.exist;
    });
  });

  suite('StorageBuffer.read()', function() {
    test('reads back float array data', async function() {
      const input = new Float32Array([1, 2, 3, 4]);
      const buf = myp5.createStorage(input);

      const result = await buf.read();

      expect(result).to.be.instanceOf(Float32Array);
      expect(result.length).to.equal(input.length);
      for (let i = 0; i < input.length; i++) {
        expect(result[i]).to.be.closeTo(input[i], 0.001);
      }
    });

    test('reads back struct array data', async function() {
      const input = [
        { x: 1.0, y: 2.0 },
        { x: 3.0, y: 4.0 },
      ];
      const buf = myp5.createStorage(input);

      const result = await buf.read();

      expect(result).to.be.an('array');
      expect(result.length).to.equal(input.length);
      for (let i = 0; i < input.length; i++) {
        expect(result[i].x).to.be.closeTo(input[i].x, 0.001);
        expect(result[i].y).to.be.closeTo(input[i].y, 0.001);
      }
    });

    test('read after update returns new data', async function() {
      const buf = myp5.createStorage(new Float32Array([10, 20, 30]));
      const updated = new Float32Array([100, 200, 300]);
      buf.update(updated);

      const result = await buf.read();

      for (let i = 0; i < updated.length; i++) {
        expect(result[i]).to.be.closeTo(updated[i], 0.001);
      }
    });

    test('reads back struct with vector fields as p5.Vector', async function() {
      const input = [
        { position: myp5.createVector(1, 2), speed: 5.0 },
        { position: myp5.createVector(3, 4), speed: 10.0 },
      ];
      const buf = myp5.createStorage(input);

      const result = await buf.read();

      expect(result).to.be.an('array');
      expect(result.length).to.equal(2);
      // Vector fields come back as p5.Vector
      expect(result[0].position.isVector).to.be.true;
      expect(result[0].position.x).to.be.closeTo(1, 0.001);
      expect(result[0].position.y).to.be.closeTo(2, 0.001);
      expect(result[0].speed).to.be.closeTo(5.0, 0.001);
      expect(result[1].position.isVector).to.be.true;
      expect(result[1].position.x).to.be.closeTo(3, 0.001);
      expect(result[1].position.y).to.be.closeTo(4, 0.001);
      expect(result[1].speed).to.be.closeTo(10.0, 0.001);
    });

    test('reads back data modified by a compute shader', async function() {
      const input = new Float32Array([1, 2, 3, 4]);
      const buf = myp5.createStorage(input);

      const computeShader = myp5.buildComputeShader(() => {
        const d = myp5.uniformStorage();
        const idx = myp5.index.x;
        d[idx] = d[idx] * 2;
      }, { myp5 });

      computeShader.setUniform('d', buf);
      myp5.compute(computeShader, 4);

      const result = await buf.read();

      expect(result).to.be.instanceOf(Float32Array);
      for (let i = 0; i < input.length; i++) {
        expect(result[i]).to.be.closeTo(input[i] * 2, 0.001);
      }
    });
  });

  suite('StorageBuffer.set()', function() {
    test('updates a single float value at the given index', async function() {
      const buf = myp5.createStorage(new Float32Array([1, 2, 3, 4]));
      buf.set(2, 9.5);

      const result = await buf.read();

      expect(result[0]).to.be.closeTo(1, 0.001);
      expect(result[1]).to.be.closeTo(2, 0.001);
      expect(result[2]).to.be.closeTo(9.5, 0.001); // only this changed
      expect(result[3]).to.be.closeTo(4, 0.001);
    });

    test('updates a single struct element without touching neighbours', async function() {
      const input = [
        { x: 1.0, y: 2.0 },
        { x: 3.0, y: 4.0 },
        { x: 5.0, y: 6.0 },
      ];
      const buf = myp5.createStorage(input);

      // Replace only the middle element
      buf.set(1, { x: 99.0, y: 88.0 });

      const result = await buf.read();

      expect(result.length).to.be.at.least(3);
      // Element 0 unchanged
      expect(result[0].x).to.be.closeTo(1.0, 0.001);
      expect(result[0].y).to.be.closeTo(2.0, 0.001);
      // Element 1 updated
      expect(result[1].x).to.be.closeTo(99.0, 0.001);
      expect(result[1].y).to.be.closeTo(88.0, 0.001);
      // Element 2 unchanged
      expect(result[2].x).to.be.closeTo(5.0, 0.001);
      expect(result[2].y).to.be.closeTo(6.0, 0.001);
    });

    test('set() then read() reflects the new value immediately', async function() {
      const buf = myp5.createStorage(new Float32Array([0, 0, 0]));
      buf.set(0, 42);

      const result = await buf.read();
      expect(result[0]).to.be.closeTo(42, 0.001);
    });

    test('throws on out-of-bounds index for float buffer', function() {
      const buf = myp5.createStorage(new Float32Array([1, 2, 3]));
      expect(() => buf.set(10, 5.0)).to.throw();
    });

    test('throws on out-of-bounds index for struct buffer', function() {
      const buf = myp5.createStorage([{ x: 1.0 }, { x: 2.0 }]);
      expect(() => buf.set(99, { x: 3.0 })).to.throw();
    });

    test('throws when passing a non-number to a float buffer', function() {
      const buf = myp5.createStorage(new Float32Array([1, 2, 3]));
      expect(() => buf.set(0, { x: 1 })).to.throw();
    });

    test('throws when passing a non-object to a struct buffer', function() {
      const buf = myp5.createStorage([{ x: 1.0 }, { x: 2.0 }]);
      expect(() => buf.set(0, 42)).to.throw();
    });
  });
});
