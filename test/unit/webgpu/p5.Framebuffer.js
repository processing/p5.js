import p5 from '../../../src/app.js';
import rendererWebGPU from "../../../src/webgpu/p5.RendererWebGPU";

p5.registerAddon(rendererWebGPU);

suite('WebGPU p5.Framebuffer', function() {
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
    const renderer = await myp5.createCanvas(10, 10, 'webgpu');
    await myp5.setAttributes({
      forceFallbackAdapter: true
    });
  })

  afterAll(function() {
    myp5.remove();
    window.devicePixelRatio = prevPixelRatio;
  });

  suite('Creation and basic properties', function() {
    test('framebuffers can be created with WebGPU renderer', async function() {
      const fbo = myp5.createFramebuffer();

      expect(fbo).to.be.an('object');
      expect(fbo.width).to.equal(10);
      expect(fbo.height).to.equal(10);
      expect(fbo.autoSized()).to.equal(true);
    });

    test('framebuffers can be created with custom dimensions', async function() {
      const fbo = myp5.createFramebuffer({ width: 20, height: 30 });

      expect(fbo.width).to.equal(20);
      expect(fbo.height).to.equal(30);
      expect(fbo.autoSized()).to.equal(false);
    });

    test('framebuffers have color texture', async function() {
      const fbo = myp5.createFramebuffer();

      expect(fbo.color).to.be.an('object');
      expect(fbo.color.rawTexture).to.be.a('function');
    });

    test('framebuffers can specify different formats', async function() {
      const fbo = myp5.createFramebuffer({
        format: 'float',
        channels: 'rgb'
      });

      expect(fbo).to.be.an('object');
      expect(fbo.width).to.equal(10);
      expect(fbo.height).to.equal(10);
    });
  });

  suite('Auto-sizing behavior', function() {
    test('auto-sized framebuffers change size with canvas', async function() {
      myp5.pixelDensity(1);
      const fbo = myp5.createFramebuffer();

      expect(fbo.autoSized()).to.equal(true);
      expect(fbo.width).to.equal(10);
      expect(fbo.height).to.equal(10);
      expect(fbo.density).to.equal(1);

      myp5.resizeCanvas(15, 20);
      myp5.pixelDensity(2);
      expect(fbo.width).to.equal(15);
      expect(fbo.height).to.equal(20);
      expect(fbo.density).to.equal(2);
    });

    test('manually-sized framebuffers do not change size with canvas', async function() {
      myp5.pixelDensity(3);
      const fbo = myp5.createFramebuffer({ width: 25, height: 30, density: 1 });

      expect(fbo.autoSized()).to.equal(false);
      expect(fbo.width).to.equal(25);
      expect(fbo.height).to.equal(30);
      expect(fbo.density).to.equal(1);

      myp5.resizeCanvas(5, 15);
      myp5.pixelDensity(2);
      expect(fbo.width).to.equal(25);
      expect(fbo.height).to.equal(30);
      expect(fbo.density).to.equal(1);
    });

    test('manually-sized framebuffers can be made auto-sized', async function() {
      myp5.pixelDensity(1);
      const fbo = myp5.createFramebuffer({ width: 25, height: 30, density: 2 });

      expect(fbo.autoSized()).to.equal(false);
      expect(fbo.width).to.equal(25);
      expect(fbo.height).to.equal(30);
      expect(fbo.density).to.equal(2);

      // Make it auto-sized
      fbo.autoSized(true);
      expect(fbo.autoSized()).to.equal(true);

      myp5.resizeCanvas(8, 12);
      myp5.pixelDensity(3);
      expect(fbo.width).to.equal(8);
      expect(fbo.height).to.equal(12);
      expect(fbo.density).to.equal(3);
    });
  });

  suite('Manual resizing', function() {
    test('framebuffers can be manually resized', async function() {
      myp5.pixelDensity(1);
      const fbo = myp5.createFramebuffer();

      expect(fbo.width).to.equal(10);
      expect(fbo.height).to.equal(10);
      expect(fbo.density).to.equal(1);

      fbo.resize(20, 25);
      expect(fbo.width).to.equal(20);
      expect(fbo.height).to.equal(25);
      expect(fbo.autoSized()).to.equal(false);
    });

    test('resizing affects pixel density', async function() {
      myp5.pixelDensity(1);
      const fbo = myp5.createFramebuffer();

      fbo.pixelDensity(3);
      expect(fbo.density).to.equal(3);

      fbo.resize(15, 20);
      fbo.pixelDensity(2);
      expect(fbo.width).to.equal(15);
      expect(fbo.height).to.equal(20);
      expect(fbo.density).to.equal(2);
    });
  });

  suite('Drawing functionality', function() {
    test('can draw to framebuffer with draw() method', async function() {
      const fbo = myp5.createFramebuffer();

      myp5.background(0, 255, 0);

      fbo.draw(() => {
        myp5.background(0, 0, 255);
        // myp5.fill(0, 255, 0);
      });
      await myp5.loadPixels();
      // Drawing should have gone to the framebuffer, leaving the main
      // canvas the same
      expect([...myp5.pixels.slice(0, 3)]).toEqual([0, 255, 0]);
      await fbo.loadPixels();
      // The framebuffer should have content
      expect([...fbo.pixels.slice(0, 3)]).toEqual([0, 0, 255]);

      // The content can be drawn back to the main canvas
      myp5.imageMode(myp5.CENTER);
      myp5.image(fbo, 0, 0);
      await myp5.loadPixels();
      expect([...fbo.pixels.slice(0, 3)]).toEqual([0, 0, 255]);
      expect([...myp5.pixels.slice(0, 3)]).toEqual([0, 0, 255]);
    });

    test('can use framebuffer as texture', async function() {
      const fbo = myp5.createFramebuffer();

      fbo.draw(() => {
        myp5.background(255, 0, 0);
      });

      // Should not throw when used as texture
      expect(() => {
        myp5.texture(fbo);
        myp5.plane(10, 10);
      }).to.not.throw();
    });
  });

  suite('Pixel access', function() {
    test('loadPixels returns a promise in WebGPU', async function() {
      const fbo = myp5.createFramebuffer();

      fbo.draw(() => {
        myp5.background(255, 0, 0);
      });

      const result = fbo.loadPixels();
      expect(result).to.be.a('promise');

      const pixels = await result;
      expect(pixels).toBeInstanceOf(Uint8Array);
      expect(pixels.length).to.equal(10 * 10 * 4);
      expect([...pixels.slice(0, 4)]).toEqual([255, 0, 0, 255]);
    });

    test('pixels property is set after loadPixels resolves', async function() {
      const fbo = myp5.createFramebuffer();

      fbo.draw(() => {
        myp5.background(100, 150, 200);
      });

      const pixels = await fbo.loadPixels();
      expect(fbo.pixels).to.equal(pixels);
      expect(fbo.pixels.length).to.equal(10 * 10 * 4);
    });

    test('get() returns a promise for single pixel in WebGPU', async function() {
      const fbo = myp5.createFramebuffer();

      fbo.draw(() => {
        myp5.background(100, 150, 200);
      });

      const result = fbo.get(5, 5);
      expect(result).to.be.a('promise');

      const color = await result;
      expect(color).to.be.an('array');
      expect(color).to.have.length(4);
      expect([...color]).toEqual([100, 150, 200, 255]);
    });

    test('get() returns a promise for region in WebGPU', async function() {
      const fbo = myp5.createFramebuffer();

      fbo.draw(() => {
        myp5.background(100, 150, 200);
      });

      const result = fbo.get(2, 2, 4, 4);
      expect(result).to.be.a('promise');

      const region = await result;
      expect(region).to.be.an('object'); // Should be a p5.Image
      expect(region.width).to.equal(4);
      expect(region.height).to.equal(4);
      expect([...region.pixels.slice(0, 4)]).toEqual([100, 150, 200, 255]);
    });
  });
});
