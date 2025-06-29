import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('Graphics', function() {
  var myp5;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  function assertValidGraphSizes(graph, w, h, density) {
    assert.strictEqual(graph.pixelDensity(), density, 'invalid pixel density');
    assert.strictEqual(graph.width, w, 'invalid width');
    assert.strictEqual(graph.height, h, 'invalid height');
  }

  function assertValidCanvasSizes(canvas, w, h, density) {
    assert.strictEqual(canvas.width, w * density, 'canvas.width');
    assert.strictEqual(canvas.height, h * density, 'canvas.height');
    assert.strictEqual(
      canvas.style.width,
      '' + w + 'px',
      'invalid canvas.style.width'
    );
    assert.strictEqual(
      canvas.style.height,
      '' + h + 'px',
      'invalid canvas.style.height'
    );
  }

  function assertValidPixels(graph, w, h, density) {
    graph.loadPixels();
    var real = graph.pixels.length;
    var expected = w * density * h * density * 4;
    assert.strictEqual(real, expected, 'invalid number of pixels');
  }

  suite('p5.prototype.createGraphics', function() {
    test('it creates a graphics', function() {
      var graph = myp5.createGraphics(10, 17);
      assert.isObject(graph);
    });

  });

  suite('p5.Graphics', function() {
    test('it has necessary properties', function() {
      var graph = myp5.createGraphics(10, 17);
      assert.property(graph, 'width');
      assert.property(graph, 'height');
      assert.property(graph, 'canvas');
      assert.property(graph, 'pixelDensity');
      assert.property(graph, 'loadPixels');
      assert.property(graph, 'pixels');
    });

    test('it has consistent sizes', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidGraphSizes(graph, 10, 17, 1);
    });

    test('its canvas has consistent sizes', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidCanvasSizes(graph.canvas, 10, 17, 1);
    });

    test('it has a valid pixels array', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidPixels(graph, 10, 17, 1);
    });
  });

  suite('p5.Graphics.pixelDensity', function() {
    test('it can change density', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assert.strictEqual(graph.pixelDensity(), 1);
      graph.pixelDensity(3);
      assert.strictEqual(graph.pixelDensity(), 3);
    });

    test('it keeps valid sizes after change', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidGraphSizes(graph, 10, 17, 1);
      graph.pixelDensity(3);
      assertValidGraphSizes(graph, 10, 17, 3);
    });

    test('its canvas keeps valid sizes after change', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidCanvasSizes(graph.canvas, 10, 17, 1);
      graph.pixelDensity(3);
      assertValidCanvasSizes(graph.canvas, 10, 17, 3);
    });

    test('it keeps a valid pixel array after change', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      assertValidPixels(graph, 10, 17, 1);

      graph.pixelDensity(3);
      assertValidPixels(graph, 10, 17, 3);
    });
  });

  suite('p5.Graphics.prototype.splineVertex', function() {
    test('should be a function in graphics', function() {
      let g = myp5.createGraphics(10, 10);
      assert.ok(g.splineVertex);
      assert.typeOf(g.splineVertex, 'function');
    });
  });
  
  suite('p5.Graphics.resizeCanvas', function() {
    let glStub;

    afterEach(() => {
      if (glStub) {
        vi.restoreAllMocks();
        glStub = null;
      }
    });

    test('it can call resizeCanvas', function() {
      var graph = myp5.createGraphics(10, 17);
      var resize = function() {
        graph.resizeCanvas(19, 16);
      };
      assert.doesNotThrow(resize);
    });

    test('it resizes properly with pixelDensity 1', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      graph.resizeCanvas(19, 16);
      assertValidGraphSizes(graph, 19, 16, 1);
    });

    test('its canvas resizes properly with pixelDensity 1', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      graph.resizeCanvas(19, 16);
      assertValidCanvasSizes(graph.canvas, 19, 16, 1);
    });

    test('it resizes properly the pixels array with density 1', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(1);
      graph.resizeCanvas(19, 16);
      assertValidPixels(graph, 19, 16, 1);
    });

    test('it resizes properly with pixelDensity 2', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(2);
      graph.resizeCanvas(19, 16);
      assertValidGraphSizes(graph, 19, 16, 2);
    });

    test('its canvas resizes properly with pixelDensity 2', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(2);
      graph.resizeCanvas(19, 16);
      assertValidCanvasSizes(graph.canvas, 19, 16, 2);
    });

    test('it resizes properly the pixels array with density 2', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.pixelDensity(2);
      graph.resizeCanvas(19, 16);
      assertValidPixels(graph, 19, 16, 2);
    });

    // NOTE: check this
    test('it resizes the graphics based on max texture size', function() {
      glStub = vi.spyOn(p5.RendererGL.prototype, '_getMaxTextureSize');
      const fakeMaxTextureSize = 100;
      glStub.mockReturnValue(fakeMaxTextureSize);
      const graph = myp5.createGraphics(200, 200, myp5.WEBGL);
      assert(graph.width, 100);
      assert(graph.height, 100);
    });
  });

  suite('p5.Graphics.remove()', function() {
    test('it sets properties to undefined after removal', function() {
      var graph = myp5.createGraphics(10, 17);
      graph.remove();
      assert.isUndefined(graph.canvas);
      assert.isUndefined(graph._renderer);
      assert.isUndefined(graph.elt);
    });
  });
});
