import { vi } from 'vitest';
import { SVGExportAddon } from '../../../src/shape/svg/svg_export.js';
import svg from '../../../src/shape/svg/p5.svg.js';
import { FES } from '../../../src/friendly_errors/fes.js';

function createMockColor(r = 255, g = 0, b = 0, a = 255, hexString = '#ff0000') {
  return {
    _getRGBA(mode) {
      return [r, g, b, a];
    },
    toString(format) {
      if (format === '#rrggbb') {
        return hexString;
      }
      return `rgba(${r},${g},${b},${a / 255})`;
    }
  };
}

suite('Addon Integration', function() {
  test('should register addon functions on fn (p5.prototype)', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon: vi.fn()
    };

    SVGExportAddon(mockP5, fn);

    assert.typeOf(fn.buildShape, 'function');
    assert.typeOf(fn.createShape, 'function');
    assert.isUndefined(fn.beginRecord);
    assert.isUndefined(fn.endRecord);
    assert.typeOf(fn.getSVG, 'function');
    assert.typeOf(fn.shape, 'function');
    assert.typeOf(fn.saveSVG, 'function');
    assert.typeOf(fn._svgCaptureAdapters, 'function');
    assert.typeOf(fn._svgCaptureState, 'function');
    assert.strictEqual(fn.CORNER, 'corner');
    assert.strictEqual(fn.CENTER, 'center');
    assert.strictEqual(fn.VIEWBOX, 'viewbox');
    assert.strictEqual(mockP5.CORNER, 'corner');
    assert.strictEqual(mockP5.CENTER, 'center');
    assert.strictEqual(mockP5.VIEWBOX, 'viewbox');
  });

  test('should record shapes using createShape, begin and end', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const shapeObj = pInst.createShape();
    assert.isUndefined(shapeObj.recorder);

    // Call begin
    shapeObj.begin();
    assert.isDefined(shapeObj.recorder);
    assert.isTrue(shapeObj.recorder.active);

    // Simulate drawing
    const shape = { accept() {} };
    pInst._renderer.drawShape(shape);

    // Call end
    shapeObj.end();
    assert.isUndefined(shapeObj.recorder);
    assert.strictEqual(shapeObj.data.type, 'scope');
    assert.strictEqual(shapeObj.data.children.length, 1);
    assert.strictEqual(shapeObj.data.children[0].type, 'shape');
  });

  test('should warn on mismatched shape.end()', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    // Mock console.warn
    const originalWarn = console.warn;
    const warnings = [];
    console.warn = (msg) => { warnings.push(msg); };

    try {
      const shapeObj = pInst.createShape();
      // 1. end without begin
      shapeObj.end();
      assert.strictEqual(warnings.length, 1);
      assert.include(warnings[0], 'end() called without a matching begin()');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('saveSVG should trigger download in browser environment', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      color() { return createMockColor(255, 0, 0, 255, '#ff0000'); }
    };
    Object.setPrototypeOf(pInst, fn);

    // Mock record
    const mockRecord = {
      toSVGElement(visitor) {
        visitor.addBackground({ color: createMockColor(255, 0, 0, 255, '#ff0000') });
      }
    };

    // Spy on DOM methods
    let elementCreated = false;
    let clicked = false;
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const el = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        elementCreated = true;
        el.click = () => { clicked = true; };
      }
      return el;
    };

    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    let createdUrl = '';
    URL.createObjectURL = (blob) => {
      createdUrl = 'blob:test';
      return createdUrl;
    };
    URL.revokeObjectURL = () => {};

    try {
      pInst.saveSVG(mockRecord, 'test-drawing.svg');
      assert.isTrue(elementCreated);
      assert.isTrue(clicked);
      assert.strictEqual(createdUrl, 'blob:test');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  test('should replay recorded shapes via shape() including strokeCap', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    let drawShapeCalled = false;
    let applyMatrixCalled = false;
    let strokeCapValue = null;

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() {
          return 'butt';
        },
        drawShape(shape) {
          drawShapeCalled = true;
          return shape;
        }
      },
      applyMatrix(a, b, c, d, e, f) {
        applyMatrixCalled = true;
      },
      push() {},
      pop() {},
      fill() {},
      stroke() {},
      noFill() {},
      noStroke() {},
      strokeWeight() {},
      strokeCap(cap) {
        strokeCapValue = cap;
      }
    };
    Object.setPrototypeOf(pInst, fn);

    const mockRecord = {
      type: 'scope',
      children: [
        {
          type: 'shape',
          shape: { accept() {} },
          state: {
            transform: { a: 1, b: 0, c: 0, d: 1, e: 10, f: 20 },
            fill: createMockColor(255, 0, 0, 255, '#ff0000'),
            stroke: createMockColor(0, 0, 0, 255, '#000000'),
            strokeWeight: 2,
            strokeCap: 'round'
          }
        }
      ]
    };

    pInst.shape(mockRecord);

    assert.isTrue(drawShapeCalled, 'drawShape should be called on the renderer');
    assert.isTrue(applyMatrixCalled, 'applyMatrix should be called to set transform');
    assert.strictEqual(strokeCapValue, 'round', 'strokeCap should be replayed');
  });

  test('should warn on invalid scale option in shape placement', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; }
      },
      translate() {},
      scale() {},
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const mockRecord = { type: 'scope', children: [] };
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (msg) => { warnings.push(msg); };

    try {
      // 1. Non-finite number: NaN
      pInst.shape(mockRecord, 10, 10, { scale: NaN });
      assert.strictEqual(warnings.length, 1);
      assert.include(warnings[0], 'Invalid scale option');

      // 2. Non-finite number: Infinity
      pInst.shape(mockRecord, 10, 10, { scale: Infinity });
      assert.strictEqual(warnings.length, 2);
      assert.include(warnings[1], 'Invalid scale option');

      // 3. String value
      pInst.shape(mockRecord, 10, 10, { scale: 'invalid' });
      assert.strictEqual(warnings.length, 3);
      assert.include(warnings[2], 'Invalid scale option');

      // 4. Array value (not a plain object, not a number)
      pInst.shape(mockRecord, 10, 10, { scale: [2, 3] });
      assert.strictEqual(warnings.length, 4);
      assert.include(warnings[3], 'Invalid scale option');

      // 5. Object with non-numeric fields
      pInst.shape(mockRecord, 10, 10, { scale: { x: 2, y: 'bad' } });
      assert.strictEqual(warnings.length, 5);
      assert.include(warnings[4], 'Invalid scale option');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('should warn on unknown alignment mode in shape placement', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; }
      },
      translate() {},
      scale() {},
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const mockRecord = { type: 'scope', children: [] };
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (msg) => { warnings.push(msg); };

    try {
      pInst.shape(mockRecord, 10, 10, { align: 'invalid_mode' });
      assert.strictEqual(warnings.length, 1);
      assert.include(warnings[0], 'Unknown alignment mode "invalid_mode"');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('should warn when CENTER alignment requested without coordinate bounds', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; }
      },
      translate() {},
      scale() {},
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const mockRecordWithoutBounds = { type: 'scope', children: [] };
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (msg) => { warnings.push(msg); };

    try {
      pInst.shape(mockRecordWithoutBounds, 10, 10, { align: 'center' });
      assert.strictEqual(warnings.length, 1);
      assert.include(warnings[0], 'CENTER alignment requested, but shape record has no valid coordinate bounds metadata');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('should record shapes via buildShape helper', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() {
          return 'butt';
        },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    let callbackCalled = false;
    const shapeObj = pInst.buildShape(() => {
      callbackCalled = true;
      const shape = { accept() {} };
      pInst._renderer.drawShape(shape);
    });

    assert.isTrue(callbackCalled);
    assert.strictEqual(shapeObj.data.type, 'scope');
    assert.strictEqual(shapeObj.data.children.length, 1);
    assert.isUndefined(shapeObj.recorder);
  });

  test('buildShape should end recording even if callback throws', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const popSpy = vi.fn();
    const pInst = {
      width: 600,
      height: 600,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop: popSpy
    };
    Object.setPrototypeOf(pInst, fn);

    let errorThrown = false;
    try {
      pInst.buildShape(() => {
        throw new Error('Test Callback Error');
      });
    } catch (e) {
      if (e.message === 'Test Callback Error') {
        errorThrown = true;
      }
    }

    assert.isTrue(errorThrown);
    // Recording should be properly stopped/ended even if it threw, which calls pop()
    assert.strictEqual(popSpy.mock.calls.length, 1, 'pop should have been called to restore state');
  });

  test('should replay recorded images via shape()', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    let imageCalled = false;
    let imageArgs = null;

    const pInst = {
      width: 600,
      height: 600,
      image(img, dx, dy, dw, dh, sx, sy, sw, sh) {
        imageCalled = true;
        imageArgs = [img, dx, dy, dw, dh, sx, sy, sw, sh];
      },
      push() {},
      pop() {},
      fill() {},
      stroke() {},
      noFill() {},
      noStroke() {},
      strokeWeight() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const mockRecord = {
      type: 'scope',
      children: [
        {
          type: 'image',
          img: 'mock-img-src',
          args: [0, 0, 100, 100, 10, 20, 200, 150],
          state: {}
        }
      ]
    };

    pInst.shape(mockRecord);

    assert.isTrue(imageCalled, 'image should be called on the p5 instance');
    assert.deepEqual(imageArgs, [
      'mock-img-src',
      10, 20, 200, 150, // dx, dy, dw, dh
      0, 0, 100, 100    // sx, sy, sw, sh
    ]);
  });
});

suite('getSVG — SVG string output', function() {

  test('returns a string containing <svg with correct width and height', function() {
    const fn = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn);

    const pInst = {
      width: 300,
      height: 200,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    // Build a record and call getSVG on it
    const shapeObj = pInst.buildShape(() => {
      // nothing — empty scope
    });

    const svgStr = pInst.getSVG(shapeObj);

    assert.typeOf(svgStr, 'string', 'getSVG must return a string');
    assert.include(svgStr, '<svg', 'must contain an <svg opening tag');
    assert.include(svgStr, 'width="300"', 'must carry the correct width');
    assert.include(svgStr, 'height="200"', 'must carry the correct height');
    assert.include(svgStr, 'http://www.w3.org/2000/svg', 'must declare the SVG namespace');
  });
});

suite('Lifecycle & Automatic SVG Export (saveSVG overload)', function() {

  test('should register predraw and postdraw lifecycle hooks', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };

    SVGExportAddon(mockP5, fn, lifecycles);

    assert.typeOf(lifecycles.predraw, 'function', 'predraw lifecycle hook should be registered');
    assert.typeOf(lifecycles.postdraw, 'function', 'postdraw lifecycle hook should be registered');
  });

  test('should set pendingExport and capture frame upon saveSVG(filename)', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn, lifecycles);

    const pInst = {
      width: 400,
      height: 400,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    // Spy DOM export calls
    let downloadedFilename = null;
    let clickCalled = false;
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const el = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        el.click = () => {
          clickCalled = true;
          downloadedFilename = el.download;
        };
      }
      return el;
    };
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:test-auto';
    URL.revokeObjectURL = () => {};

    try {
      // 1. Call saveSVG with custom filename string
      pInst.saveSVG('auto-export.svg');

      // 2. Trigger predraw (starts recording)
      lifecycles.predraw.call(pInst);

      // 3. Draw a shape during frame
      const shape = { accept() {} };
      pInst._renderer.drawShape(shape);

      // 4. Trigger postdraw (ends recording & exports)
      lifecycles.postdraw.call(pInst);

      assert.isTrue(clickCalled, 'Download link click should have been triggered');
      assert.strictEqual(downloadedFilename, 'auto-export.svg', 'Filename should match the argument passed to saveSVG');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  test('should default to "drawing.svg" when saveSVG() is called without arguments', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn, lifecycles);

    const pInst = {
      width: 400,
      height: 400,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    let downloadedFilename = null;
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const el = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        el.click = () => { downloadedFilename = el.download; };
      }
      return el;
    };
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:test-default';
    URL.revokeObjectURL = () => {};

    try {
      pInst.saveSVG(); // No args
      lifecycles.predraw.call(pInst);
      lifecycles.postdraw.call(pInst);

      assert.strictEqual(downloadedFilename, 'drawing.svg', 'Default filename should be drawing.svg');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  test('should handle saveSVG(filename) called during draw() execution', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn, lifecycles);

    const pInst = {
      width: 400,
      height: 400,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    let downloadedFilename = null;
    let exportCount = 0;
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const el = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        el.click = () => {
          exportCount++;
          downloadedFilename = el.download;
        };
      }
      return el;
    };
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:test-inside-draw';
    URL.revokeObjectURL = () => {};

    try {
      // Frame 1 predraw (no export pending)
      lifecycles.predraw.call(pInst);

      // Call saveSVG during draw() execution
      pInst.saveSVG('inside-draw.svg');

      // Frame 1 postdraw (shape was not started in Frame 1 predraw)
      lifecycles.postdraw.call(pInst);
      assert.strictEqual(exportCount, 0, 'Should not export immediately on frame 1 postdraw');

      // Frame 2 predraw (now pendingExport is picked up)
      lifecycles.predraw.call(pInst);

      // Frame 2 postdraw (completes capture and exports)
      lifecycles.postdraw.call(pInst);
      assert.strictEqual(exportCount, 1, 'Should export on frame 2 postdraw');
      assert.strictEqual(downloadedFilename, 'inside-draw.svg');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  test('should do nothing safely in predraw and postdraw when no export is pending', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn, lifecycles);

    const pInst = {
      width: 400,
      height: 400
    };
    Object.setPrototypeOf(pInst, fn);

    // Call predraw and postdraw without saveSVG
    assert.doesNotThrow(() => {
      lifecycles.predraw.call(pInst);
      lifecycles.postdraw.call(pInst);
    });
  });

  test('should export RecordedShape instance directly when passed to saveSVG', function() {
    const fn = {};
    const lifecycles = {};
    const mockP5 = {
      PrimitiveVisitor: class {},
      registerAddon() {}
    };
    SVGExportAddon(mockP5, fn, lifecycles);

    const pInst = {
      width: 400,
      height: 400,
      _renderer: {
        states: {
          fillColor: createMockColor(255, 0, 0, 255, '#ff0000'),
          strokeColor: createMockColor(0, 0, 0, 255, '#000000'),
          strokeWeight: 1
        },
        strokeCap() { return 'butt'; },
        drawShape(shape) { return shape; },
        push() {},
        pop() {}
      },
      color(...args) { return createMockColor(255, 0, 0, 255, '#ff0000'); },
      push() {},
      pop() {}
    };
    Object.setPrototypeOf(pInst, fn);

    const recordedShape = pInst.buildShape(() => {
      const shape = { accept() {} };
      pInst._renderer.drawShape(shape);
    });

    let downloadedFilename = null;
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const el = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        el.click = () => { downloadedFilename = el.download; };
      }
      return el;
    };
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:test-instance';
    URL.revokeObjectURL = () => {};

    try {
      pInst.saveSVG(recordedShape, 'direct-instance.svg');
      assert.strictEqual(downloadedFilename, 'direct-instance.svg', 'Should immediately download RecordedShape');
    } finally {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    }
  });

  suite('experimental usage warning', function () {
    let logSpy;

    beforeEach(function () {
      logSpy = vi.spyOn(FES, 'log');
    });

    afterEach(function () {
      logSpy.mockRestore();
    });

    test('logs experimental warning when invoking SVG functions', function () {
      const proto = {};
      const mockP5 = {
        PrimitiveVisitor: class {},
        disableFriendlyErrors: false,
        registerDecorator(pattern, decorator) {
          const fnName = pattern.replace('p5.prototype.', '');
          if (proto[fnName]) {
            proto[fnName] = decorator(proto[fnName]);
          }
        }
      };

      svg(mockP5, proto, {});

      assert.isFunction(proto.saveSVG);
      proto.saveSVG();

      assert.isTrue(logSpy.mock.calls.length > 0, 'FES.log should be called when invoking experimental SVG function');
    });
  });

});

