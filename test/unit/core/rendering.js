import p5 from '../../../src/app.js';
import { vi, expect } from 'vitest';

suite('Rendering', function() {
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

  suite('p5.prototype.webglVersion', function() {
    test('should return P2D if not using WebGL at all', function() {
      myp5.createCanvas(10, 10);
      assert.equal(myp5.webglVersion, myp5.P2D);
    });
  });

  suite('p5.prototype.createCanvas', function() {
    test('should have correct initial colors', function() {
      var white = myp5.color(255, 255, 255)._array;
      var black = myp5.color(0, 0, 0)._array;
      assert.deepEqual(myp5.color(myp5._renderer._getFill())._array, white);
      assert.deepEqual(myp5.color(myp5._renderer._getStroke())._array, black);
      assert.deepEqual(myp5.color(myp5.drawingContext.fillStyle)._array, white);
      assert.deepEqual(
        myp5.color(myp5.drawingContext.strokeStyle)._array,
        black
      );
      myp5.createCanvas(100, 100);
      assert.deepEqual(myp5.color(myp5._renderer._getFill())._array, white);
      assert.deepEqual(myp5.color(myp5._renderer._getStroke())._array, black);
      assert.deepEqual(myp5.color(myp5.drawingContext.fillStyle)._array, white);
      assert.deepEqual(
        myp5.color(myp5.drawingContext.strokeStyle)._array,
        black
      );
    });
  });

  suite('p5.prototype.resizeCanvas', function() {
    let glStub;

    afterEach(() => {
      if (glStub) {
        vi.restoreAllMocks();
        glStub = null;
      }
    });

    test('should resize canvas', function() {
      myp5.resizeCanvas(10, 20);
      assert.equal(myp5.canvas.width, 10 * myp5.pixelDensity());
      assert.equal(myp5.canvas.height, 20 * myp5.pixelDensity());
    });

    test('should restore fill color', function() {
      myp5.fill('#f0f0f0');
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.fillStyle, '#f0f0f0');
    });

    test('should restore stroke color', function() {
      myp5.stroke('#f0f0f0');
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.strokeStyle, '#f0f0f0');
    });

    test('should restore stroke weight', function() {
      myp5.strokeWeight(323);
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.lineWidth, 323);
    });

    test('should restore stroke cap', function() {
      myp5.strokeCap(myp5.PROJECT);
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.lineCap, myp5.PROJECT);
    });

    test.todo('should resize framebuffers', function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      const fbo = myp5.createFramebuffer();
      myp5.resizeCanvas(5, 15);
      assert.equal(fbo.width, 5);
      assert.equal(fbo.height, 15);
    });

    test.todo('should resize graphic framebuffers', function() {
      const graphic = myp5.createGraphics(10, 10, myp5.WEBGL);
      const fbo = graphic.createFramebuffer();
      graphic.resizeCanvas(5, 15);
      assert.equal(fbo.width, 5);
      assert.equal(fbo.height, 15);
    });

    test('should limit dimensions of canvas based on max texture size on create', function() {
      glStub = vi.spyOn(p5.RendererGL.prototype, '_getMaxTextureSize');
      const fakeMaxTextureSize = 100;
      glStub.mockReturnValue(fakeMaxTextureSize);
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.pixelDensity(1);
      myp5.resizeCanvas(200, 200);
      assert.equal(myp5.width, 100);
      assert.equal(myp5.height, 100);
    });

    test('should limit dimensions of canvas based on max texture size on resize', function() {
      glStub = vi.spyOn(p5.RendererGL.prototype, '_getMaxTextureSize');
      const fakeMaxTextureSize = 100;
      glStub.mockReturnValue(fakeMaxTextureSize);
      const prevRatio = window.devicePixelRatio;
      window.devicePixelRatio = 1;
      myp5.createCanvas(200, 200, myp5.WEBGL);
      window.devicePixelRatio = prevRatio;
      assert.equal(myp5.width, 100);
      assert.equal(myp5.height, 100);
    });
  });

  suite('p5.prototype.blendMode', function() {
    var drawX = function() {
      myp5.strokeWeight(30);
      myp5.stroke(80, 150, 255);
      myp5.line(25, 25, 75, 75);
      myp5.stroke(255, 50, 50);
      myp5.line(75, 25, 25, 75);
    };
    test('should be a function', function() {
      assert.ok(myp5.blendMode);
      assert.typeOf(myp5.blendMode, 'function');
    });
    test.todo('should be able to ADD', function() {
      myp5.blendMode(myp5.ADD);
      drawX();
    });
    test.todo('should be able to MULTIPLY', function() {
      myp5.blendMode(myp5.MULTIPLY);
      drawX();
    });
  });

  suite('p5.prototype.setAttributes', function() {
    test.todo('_glAttributes should be null at start', function() {
      assert.deepEqual(myp5._glAttributes, null);
    });
    test('_glAttributes should modify with setAttributes', function() {
      myp5.setAttributes({ antialias: false, perPixelLighting: true });
      assert.deepEqual(myp5._glAttributes.antialias, false);
      assert.deepEqual(myp5._glAttributes.perPixelLighting, true);
    });
    test('_glAttributes.antialias modify with smooth()', function() {
      myp5.smooth();
      assert.deepEqual(myp5._glAttributes.antialias, true);
    });
  });

  var webglMethods = [
    'rotateX', 'rotateY', 'rotateZ',
    'camera', 'perspective', 'ortho', 'frustum', 'orbitControl',
    'ambientLight', 'directionalLight', 'pointLight', 'lights', 'specularColor', 'spotLight',
    'model',
    'shader',
    'normalMaterial', 'texture', 'ambientMaterial', 'emissiveMaterial', 'specularMaterial',
    'shininess', 'lightFalloff', 'metalness',
    'plane', 'box', 'sphere', 'cylinder', 'cone', 'ellipsoid', 'torus'
  ];

  suite.todo('webgl assertions', function() {
    for (var i = 0; i < webglMethods.length; i++) {
      var webglMethod = webglMethods[i];
      test(
        webglMethod + '() should throw a WEBGL assertion Error',
        (function(webglMethod) {
          return function() {
            var validateParamters = myp5.validateParameters;
            myp5.validateParameters = false;
            try {
              expect(function() {
                myp5[webglMethod].call(myp5);
              }).toThrow(Error, /is only supported in WEBGL mode/);
            } finally {
              myp5.validateParameters = validateParamters;
            }
          };
        })(webglMethod)
      );
    }
  });

  suite('spline functions', function() {
    test('setting via splineProperty()', function() {
      myp5.splineProperty('tightness', 2);
      expect(myp5.splineProperty('tightness')).toEqual(2);
      expect(myp5.splineProperties()).toMatchObject({ tightness: 2 });
    });

    test('setting via splineProperties()', function() {
      myp5.splineProperties({ tightness: 2 });
      expect(myp5.splineProperty('tightness')).toEqual(2);
      expect(myp5.splineProperties()).toMatchObject({ tightness: 2 });
    });
  });
});
