import { SVGExportAddon } from '../../../src/shape/svg/svg_export.js';

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

// Setup mock p5.js environment for addon initialization
class MockPrimitiveVisitor {
  constructor() {}
}

const mockP5 = {
  PrimitiveVisitor: MockPrimitiveVisitor,
  registerAddon() {}
};

const fn = {};
SVGExportAddon(mockP5, fn);

function createPInst() {
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
      pop() {},
      translate() {},
      rotate() {},
      scale() {},
      background() {},
      clear() {}
    },
    color(...args) {
      if (args[0] && typeof args[0]._getRGBA === 'function') {
        return args[0];
      }
      let r = 255, g = 0, b = 0, a = 255;
      let hexString = '#ff0000';
      if (typeof args[0] === 'string') {
        hexString = args[0];
        if (hexString === 'red') { r = 255; g = 0; b = 0; hexString = '#ff0000'; }
        else if (hexString === 'green') { r = 0; g = 128; b = 0; hexString = '#008000'; }
        else if (hexString === 'blue') { r = 0; g = 0; b = 255; hexString = '#0000ff'; }
        else if (hexString === 'yellow') { r = 255; g = 255; b = 0; hexString = '#ffff00'; }
        else if (hexString === 'black') { r = 0; g = 0; b = 0; hexString = '#000000'; }
        else if (hexString === 'rgba(255,0,0,1)') { r = 255; g = 0; b = 0; a = 255; hexString = '#ff0000'; }
      } else if (typeof args[0] === 'number') {
        r = args[0];
        g = args[1] !== undefined ? args[1] : r;
        b = args[2] !== undefined ? args[2] : r;
        a = args[3] !== undefined ? args[3] : 255;
        hexString = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
      return createMockColor(r, g, b, a, hexString);
    },
    push() {},
    pop() {},
    translate() {},
    rotate() {},
    scale() {},
    background(...args) {
      if (this._renderer && typeof this._renderer.background === 'function') {
        return this._renderer.background.apply(this._renderer, args);
      }
    },
    clear(...args) {
      if (this._renderer && typeof this._renderer.clear === 'function') {
        return this._renderer.clear.apply(this._renderer, args);
      }
    }
  };
  Object.setPrototypeOf(pInst, fn);
  return pInst;
}

function createVisitor(pInst) {
  let visitor;
  const mockRecord = {
    toSVGElement(v) {
      visitor = v;
    }
  };
  pInst.getSVG(mockRecord);
  return visitor;
}

suite('SVGVisitor', function() {
  test('colorToSVG should convert colors to SVG strings correctly', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    // Falsy input -> 'none'
    assert.strictEqual(visitor.colorToSVG(null), 'none');
    assert.strictEqual(visitor.colorToSVG(undefined), 'none');

    // Color object with full opacity
    const blueColor = createMockColor(0, 0, 255, 255, '#0000ff');
    assert.strictEqual(visitor.colorToSVG(blueColor), '#0000ff');
    assert.strictEqual(visitor._currentOpacity, 1);

    // Color object with partial opacity
    const halfAlphaRed = createMockColor(255, 0, 0, 127.5, '#ff0000');
    assert.strictEqual(visitor.colorToSVG(halfAlphaRed), '#ff0000');
    assert.closeTo(visitor._currentOpacity, 0.5, 0.01);
  });

  test('_createElement should create SVG elements with namespaces and attributes', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const el = visitor._createElement('circle', {
      cx: 10,
      cy: 20,
      r: 30
    });

    assert.strictEqual(el.namespaceURI, 'http://www.w3.org/2000/svg');
    assert.strictEqual(el.tagName.toLowerCase(), 'circle');
    assert.strictEqual(el.getAttribute('cx'), '10');
    assert.strictEqual(el.getAttribute('cy'), '20');
    assert.strictEqual(el.getAttribute('r'), '30');
  });

  test('_applyStyle should apply fill, stroke, stroke-width and stroke-linecap based on currentState', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const el = visitor._createElement('rect');
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: createMockColor(0, 0, 255, 255, '#0000ff'),
      strokeWeight: 3,
      strokeCap: 'square'
    };

    visitor._applyStyle(el);
    assert.strictEqual(el.getAttribute('fill'), '#ff0000');
    assert.strictEqual(el.getAttribute('stroke'), '#0000ff');
    assert.strictEqual(el.getAttribute('stroke-width'), '3');
    assert.strictEqual(el.getAttribute('stroke-linecap'), 'square');
  });

  test('_appendShapeElement should wrap with matrix group if transform is not identity', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const circleEl = visitor._createElement('circle', { r: 10 });
    
    // Test with identity transform (no group wrapper)
    visitor.currentState = {
      transform: new DOMMatrix()
    };
    visitor._appendShapeElement(circleEl);
    assert.strictEqual(visitor.svgElement.lastChild, circleEl);

    // Test with translate transform (should create a group <g> wrapper)
    const gCircleEl = visitor._createElement('circle', { r: 20 });
    visitor.currentState = {
      transform: new DOMMatrix().translate(100, 200)
    };
    visitor._appendShapeElement(gCircleEl);

    const lastChild = visitor.svgElement.lastChild;
    assert.strictEqual(lastChild.tagName.toLowerCase(), 'g');
    assert.strictEqual(lastChild.getAttribute('transform'), 'matrix(1 0 0 1 100 200)');
    assert.strictEqual(lastChild.firstChild, gCircleEl);
  });

  test('visitEllipsePrimitive should generate circle or ellipse tags', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.currentState = {
      fill: createMockColor(255, 255, 0, 255, '#ffff00'),
      stroke: null,
      strokeWeight: 0,
      transform: new DOMMatrix()
    };

    // Width = Height -> Circle
    visitor.visitEllipsePrimitive({
      x: 10,
      y: 20,
      w: 40,
      h: 40
    });

    const circleEl = visitor.svgElement.lastChild;
    assert.strictEqual(circleEl.tagName.toLowerCase(), 'circle');
    assert.strictEqual(circleEl.getAttribute('cx'), '30'); // 10 + 40/2
    assert.strictEqual(circleEl.getAttribute('cy'), '40'); // 20 + 40/2
    assert.strictEqual(circleEl.getAttribute('r'), '20');  // 40/2
    assert.strictEqual(circleEl.getAttribute('fill'), '#ffff00');

    // Width != Height -> Ellipse
    visitor.visitEllipsePrimitive({
      x: 10,
      y: 20,
      w: 40,
      h: 80
    });

    const ellipseEl = visitor.svgElement.lastChild;
    assert.strictEqual(ellipseEl.tagName.toLowerCase(), 'ellipse');
    assert.strictEqual(ellipseEl.getAttribute('cx'), '30'); // 10 + 40/2
    assert.strictEqual(ellipseEl.getAttribute('cy'), '60'); // 20 + 80/2
    assert.strictEqual(ellipseEl.getAttribute('rx'), '20'); // 40/2
    assert.strictEqual(ellipseEl.getAttribute('ry'), '40'); // 80/2
  });

  test('addBackground and clear should draw bg rect and clear svg element children', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.addBackground({
      color: createMockColor(0, 128, 0, 255, '#008000')
    });

    assert.strictEqual(visitor.svgElement.children.length, 1);
    const bgRect = visitor.svgElement.firstChild;
    assert.strictEqual(bgRect.tagName.toLowerCase(), 'rect');
    assert.strictEqual(bgRect.getAttribute('fill'), '#008000');
    assert.strictEqual(bgRect.getAttribute('width'), '600');
    assert.strictEqual(bgRect.getAttribute('height'), '600');

    // Add another element
    const circle = visitor._createElement('circle');
    visitor.svgElement.appendChild(circle);
    assert.strictEqual(visitor.svgElement.children.length, 2);

    // Clear
    visitor.clear();
    assert.strictEqual(visitor.svgElement.children.length, 0);
  });

  test('buildSVG should return a valid serialized SVG string', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.addBackground({
      color: createMockColor(255, 0, 0, 255, '#ff0000')
    });

    const svgStr = visitor.buildSVG();
    assert.include(svgStr, 'width="600"');
    assert.include(svgStr, 'height="600"');
    assert.include(svgStr, 'viewBox="0 0 600 600"');
    assert.include(svgStr, '<rect');
    assert.include(svgStr, 'fill="#ff0000"');
  });

  test('visitAnchor and path segments should generate valid path data', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 1
    };

    // visitAnchor
    visitor.visitAnchor({
      getEndVertex() { return { position: { x: 10, y: 20 } }; }
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 20');

    // visitLineSegment (not closing - legacy single vertex getEndVertex)
    visitor.visitLineSegment({
      isClosing: false,
      getEndVertex() { return { position: { x: 30, y: 40 } }; }
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 20 L 30 40');

    // visitLineSegment (batched vertices array from p5.js 2.3.2)
    visitor.visitLineSegment({
      isClosing: false,
      vertices: [
        { position: { x: 50, y: 60 } },
        { position: { x: 70, y: 80 } }
      ]
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 20 L 30 40 L 50 60 L 70 80');

    // visitLineSegment (closing)
    visitor.visitLineSegment({
      isClosing: true
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 20 L 30 40 L 50 60 L 70 80 Z');
  });

  test('visitBezierSegment should append quadratic or cubic Bezier curves to path', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 1
    };

    // Set up path
    visitor.visitAnchor({
      getEndVertex() { return { position: { x: 10, y: 10 } }; }
    });

    // visitBezierSegment (order 2)
    visitor.visitBezierSegment({
      order: 2,
      vertices: [
        { position: { x: 20, y: 20 } },
        { position: { x: 30, y: 10 } }
      ]
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 10 Q 20 20 30 10');

    // visitBezierSegment (order 3)
    visitor.visitBezierSegment({
      order: 3,
      vertices: [
        { position: { x: 40, y: 0 } },
        { position: { x: 50, y: 20 } },
        { position: { x: 60, y: 10 } }
      ]
    });
    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 10 Q 20 20 30 10 C 40 0 50 20 60 10');
  });

  test('visitSplineSegment should append Catmull-Rom spline curves to path', function() {
    const pInst = createPInst();
    pInst.EXCLUDE = 'exclude';
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 1
    };

    // Set up path
    visitor.visitAnchor({
      getEndVertex() { return { position: { x: 10, y: 10 } }; }
    });

    const mockShape = {
      vertexToArray(v) { return [v.x, v.y]; },
      catmullRomToBezier(arr, tightness) {
        return [[ [20, 20], [30, 20], [40, 10] ]];
      }
    };

    visitor.visitSplineSegment({
      _shape: mockShape,
      _comesAfterSegment: true,
      _splineProperties: {
        ends: 'exclude',
        tightness: 0.5
      },
      getControlPoints() {
        return [{ x: 10, y: 10 }, { x: 40, y: 10 }];
      }
    });

    assert.strictEqual(visitor.currentPathElement.getAttribute('d'), 'M 10 10 C 20 20 30 20 40 10');
  });

  test('visitArcPrimitive should generate correct arc paths and elements', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: null,
      strokeWeight: 0
    };

    // Test full circle
    visitor.visitArcPrimitive({
      x: 0, y: 0, w: 100, h: 100,
      start: 0, stop: 2 * Math.PI
    });
    const fullCircleEl = visitor.svgElement.lastChild;
    assert.strictEqual(fullCircleEl.tagName.toLowerCase(), 'circle');
    assert.strictEqual(fullCircleEl.getAttribute('cx'), '50');
    assert.strictEqual(fullCircleEl.getAttribute('r'), '50');

    // Test arc segment (pie mode)
    visitor.visitArcPrimitive({
      x: 0, y: 0, w: 100, h: 100,
      start: 0, stop: Math.PI,
      mode: 'pie'
    });
    const pieEl = visitor.svgElement.lastChild;
    assert.strictEqual(pieEl.tagName.toLowerCase(), 'path');
    const pathD = pieEl.getAttribute('d');
    assert.include(pathD, 'M 100 50 A 50 50 0 0 1 0');
    assert.include(pathD, 'L 50 50 Z');
  });

  test('visitRectPrimitive should handle standard and rounded rectangles', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: createMockColor(0, 0, 255, 255, '#0000ff'),
      stroke: null,
      strokeWeight: 0
    };

    // Standard rect
    visitor.visitRectPrimitive({
      x: 10, y: 20, w: 100, h: 200
    });
    const rectEl = visitor.svgElement.lastChild;
    assert.strictEqual(rectEl.tagName.toLowerCase(), 'rect');
    assert.strictEqual(rectEl.getAttribute('x'), '10');
    assert.strictEqual(rectEl.getAttribute('width'), '100');

    // Rounded rect (single radius)
    visitor.visitRectPrimitive({
      x: 10, y: 20, w: 100, h: 200,
      tl: 10, tr: 10, br: 10, bl: 10
    });
    const roundedRectEl = visitor.svgElement.lastChild;
    assert.strictEqual(roundedRectEl.tagName.toLowerCase(), 'rect');
    assert.strictEqual(roundedRectEl.getAttribute('rx'), '10');

    // Rounded rect (different radii - path generated)
    visitor.visitRectPrimitive({
      x: 10, y: 20, w: 100, h: 200,
      tl: 5, tr: 10, br: 15, bl: 20
    });
    const roundedPathEl = visitor.svgElement.lastChild;
    assert.strictEqual(roundedPathEl.tagName.toLowerCase(), 'path');
    assert.include(roundedPathEl.getAttribute('d'), 'M 15 20');
  });

  test('visitPoint and visitLine should generate correct SVG line elements', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 2
    };

    // Point
    visitor.visitPoint({
      vertices: [{ position: { x: 50, y: 60 } }]
    });
    const pointEl = visitor.svgElement.lastChild;
    assert.strictEqual(pointEl.tagName.toLowerCase(), 'line');
    assert.strictEqual(pointEl.getAttribute('x1'), '50');
    assert.strictEqual(pointEl.getAttribute('stroke-linecap'), 'round');

    // Line
    visitor.visitLine({
      vertices: [
        { position: { x: 10, y: 20 } },
        { position: { x: 30, y: 40 } }
      ]
    });
    const lineEl = visitor.svgElement.lastChild;
    assert.strictEqual(lineEl.tagName.toLowerCase(), 'line');
    assert.strictEqual(lineEl.getAttribute('x1'), '10');
    assert.strictEqual(lineEl.getAttribute('x2'), '30');
  });

  test('visitTriangle and visitQuad should generate valid polygon tags', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 1
    };

    // Triangle
    visitor.visitTriangle({
      vertices: [
        { position: { x: 10, y: 10 } },
        { position: { x: 20, y: 30 } },
        { position: { x: 30, y: 10 } }
      ]
    });
    const triEl = visitor.svgElement.lastChild;
    assert.strictEqual(triEl.tagName.toLowerCase(), 'polygon');
    assert.strictEqual(triEl.getAttribute('points'), '10,10 20,30 30,10');

    // Quad
    visitor.visitQuad({
      vertices: [
        { position: { x: 10, y: 10 } },
        { position: { x: 30, y: 10 } },
        { position: { x: 30, y: 30 } },
        { position: { x: 10, y: 30 } }
      ]
    });
    const quadEl = visitor.svgElement.lastChild;
    assert.strictEqual(quadEl.tagName.toLowerCase(), 'polygon');
    assert.strictEqual(quadEl.getAttribute('points'), '10,10 30,10 30,30 10,30');
  });

  test('tessellation primitives should generate valid path elements', function() {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: null,
      strokeWeight: 0
    };

    // TriangleFan
    visitor.visitTriangleFan({
      vertices: [
        { position: { x: 0, y: 0 } },
        { position: { x: 10, y: 20 } },
        { position: { x: 20, y: 10 } }
      ]
    });
    const fanEl = visitor.svgElement.lastChild;
    assert.strictEqual(fanEl.tagName.toLowerCase(), 'path');
    assert.strictEqual(fanEl.getAttribute('d'), 'M 0 0 L 10 20 L 20 10 Z');

    // TriangleStrip
    visitor.visitTriangleStrip({
      vertices: [
        { position: { x: 0, y: 0 } },
        { position: { x: 10, y: 20 } },
        { position: { x: 20, y: 10 } }
      ]
    });
    const stripEl = visitor.svgElement.lastChild;
    assert.strictEqual(stripEl.tagName.toLowerCase(), 'path');
    assert.strictEqual(stripEl.getAttribute('d'), 'M 0 0 L 10 20 L 20 10 Z');

    // QuadStrip
    visitor.visitQuadStrip({
      vertices: [
        { position: { x: 0, y: 0 } },
        { position: { x: 0, y: 10 } },
        { position: { x: 10, y: 0 } },
        { position: { x: 10, y: 10 } }
      ]
    });
    const quadStripEl = visitor.svgElement.lastChild;
    assert.strictEqual(quadStripEl.tagName.toLowerCase(), 'path');
    assert.strictEqual(quadStripEl.getAttribute('d'), 'M 0 0 L 0 10 L 10 10 L 10 0 Z');
  });
});

suite('visitImage — SVG Image Exporting', function () {
  test('should export simple uncropped image', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    // Minimal currentState so style applications don't crash
    visitor.currentState = {
      fill: null,
      stroke: null,
      strokeWeight: 0
    };

    const mockCanvas = {
      toDataURL() {
        return 'data:image/png;base64,mockDataURL';
      }
    };
    const mockImg = {
      canvas: mockCanvas,
      width: 100,
      height: 100
    };

    // Args: [sx, sy, sw, sh, dx, dy, dw, dh]
    const imageNode = {
      img: mockImg,
      args: [0, 0, 100, 100, 10, 20, 200, 150]
    };

    visitor.visitImage(imageNode);

    const images = visitor.svgElement.querySelectorAll('image');
    assert.strictEqual(images.length, 1);

    const imgEl = images[0];
    assert.strictEqual(imgEl.getAttribute('x'), '10');
    assert.strictEqual(imgEl.getAttribute('y'), '20');
    assert.strictEqual(imgEl.getAttribute('width'), '200');
    assert.strictEqual(imgEl.getAttribute('height'), '150');
    assert.strictEqual(imgEl.getAttribute('preserveAspectRatio'), 'none');
    assert.strictEqual(imgEl.getAttribute('href'), 'data:image/png;base64,mockDataURL');
    assert.strictEqual(imgEl.getAttribute('xlink:href'), 'data:image/png;base64,mockDataURL');
  });

  test('should export cropped image with clipPath', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.currentState = {
      fill: null,
      stroke: null,
      strokeWeight: 0
    };

    const mockCanvas = {
      toDataURL() {
        return 'data:image/png;base64,mockCroppedData';
      }
    };
    const mockImg = {
      canvas: mockCanvas,
      width: 100,
      height: 100
    };

    // Cropped parameters: sx=10, sy=10, sw=80, sh=80, dx=5, dy=5, dw=40, dh=40
    const imageNode = {
      img: mockImg,
      args: [10, 10, 80, 80, 5, 5, 40, 40]
    };

    visitor.visitImage(imageNode);

    // Verify clipPath was created in defs
    const defs = visitor.svgElement.querySelector('defs');
    assert.isNotNull(defs);
    const clipPath = defs.querySelector('clipPath');
    assert.isNotNull(clipPath);
    const clipId = clipPath.getAttribute('id');
    assert.match(clipId, /^clip-p5svg-\d+$/);

    // Verify the clip path rect matches destination coordinates and dimensions
    const clipRect = clipPath.querySelector('rect');
    assert.isNotNull(clipRect);
    assert.strictEqual(clipRect.getAttribute('x'), '5');
    assert.strictEqual(clipRect.getAttribute('y'), '5');
    assert.strictEqual(clipRect.getAttribute('width'), '40');
    assert.strictEqual(clipRect.getAttribute('height'), '40');

    // Verify the image was correctly scaled and clipped
    const images = visitor.svgElement.querySelectorAll('image');
    assert.strictEqual(images.length, 1);
    const imgEl = images[0];

    // Scale factors: scaleX = dw/sw = 40/80 = 0.5. scaleY = dh/sh = 40/80 = 0.5.
    // fullW = imgW * scaleX = 100 * 0.5 = 50.
    // fullH = imgH * scaleY = 100 * 0.5 = 50.
    // imgX = dx - sx * scaleX = 5 - 10 * 0.5 = 0.
    // imgY = dy - sy * scaleY = 5 - 10 * 0.5 = 0.
    assert.strictEqual(imgEl.getAttribute('x'), '0');
    assert.strictEqual(imgEl.getAttribute('y'), '0');
    assert.strictEqual(imgEl.getAttribute('width'), '50');
    assert.strictEqual(imgEl.getAttribute('height'), '50');
    assert.strictEqual(imgEl.getAttribute('clip-path'), `url(#${clipId})`);
    assert.strictEqual(imgEl.getAttribute('href'), 'data:image/png;base64,mockCroppedData');
  });

  test('should handle string URL as image source', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.currentState = {
      fill: null,
      stroke: null,
      strokeWeight: 0
    };

    const imageNode = {
      img: 'http://example.com/image.png',
      args: [0, 0, 100, 100, 5, 5, 50, 50]
    };

    visitor.visitImage(imageNode);

    const images = visitor.svgElement.querySelectorAll('image');
    assert.strictEqual(images.length, 1);
    const imgEl = images[0];
    assert.strictEqual(imgEl.getAttribute('href'), 'http://example.com/image.png');
    assert.strictEqual(imgEl.getAttribute('x'), '5');
    assert.strictEqual(imgEl.getAttribute('y'), '5');
    assert.strictEqual(imgEl.getAttribute('width'), '50');
    assert.strictEqual(imgEl.getAttribute('height'), '50');
  });
});

// Tests 1 – 7: previously-uncovered SVGVisitor branches

// 1. _applyStyle: fill-opacity / stroke-opacity
suite('_applyStyle — opacity attributes', function () {

  test('fill-opacity is set when fill alpha < 1, absent when fully opaque', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    // Semi-transparent fill (alpha = 127.5 / 255 ≈ 0.5)
    const el = visitor._createElement('rect');
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 127.5, '#ff0000'),
      stroke: null,
      strokeWeight: 0
    };
    visitor._applyStyle(el);
    assert.isNotNull(el.getAttribute('fill-opacity'), 'fill-opacity should be set');
    assert.closeTo(parseFloat(el.getAttribute('fill-opacity')), 0.5, 0.01);

    // Fully opaque fill — attribute must be absent
    const el2 = visitor._createElement('rect');
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: null,
      strokeWeight: 0
    };
    visitor._applyStyle(el2);
    assert.isNull(el2.getAttribute('fill-opacity'), 'fill-opacity must NOT be set when alpha == 1');
  });

  test('stroke-opacity is set when stroke alpha < 1, absent when fully opaque', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    // Semi-transparent stroke (alpha = 51 / 255 = 0.2)
    const el = visitor._createElement('line');
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 51, '#000000'),
      strokeWeight: 2
    };
    visitor._applyStyle(el);
    assert.isNotNull(el.getAttribute('stroke-opacity'), 'stroke-opacity should be set');
    assert.closeTo(parseFloat(el.getAttribute('stroke-opacity')), 0.2, 0.01);

    // Fully opaque stroke
    const el2 = visitor._createElement('line');
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 2
    };
    visitor._applyStyle(el2);
    assert.isNull(el2.getAttribute('stroke-opacity'), 'stroke-opacity must NOT be set when alpha == 1');
  });
});

// 2. _applyStyle: stroke-width="0" when strokeWeight === 0
suite('_applyStyle — strokeWeight zero', function () {

  test('stroke-width="0" is emitted when strokeWeight is explicitly 0', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const el = visitor._createElement('circle');
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 0
    };
    visitor._applyStyle(el);
    // stroke is non-null so the strokeWeight branch fires
    assert.strictEqual(el.getAttribute('stroke-width'), '0');
  });

  test('stroke-width is absent when state.stroke is null (no stroke)', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const el = visitor._createElement('circle');
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: null,
      strokeWeight: 0
    };
    visitor._applyStyle(el);
    // stroke is null so the guard `state.stroke && ...` is false
    assert.isNull(el.getAttribute('stroke-width'));
  });
});

// 3. addBackground: semi-transparent vs fully opaque
suite('addBackground — alpha handling', function () {

  test('semi-transparent background produces fill-opacity on the bg rect', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    // alpha = 128 / 255 ≈ 0.502
    visitor.addBackground({
      color: createMockColor(0, 0, 255, 128, '#0000ff')
    });

    const rect = visitor.svgElement.lastChild;
    assert.strictEqual(rect.tagName.toLowerCase(), 'rect');
    assert.isNotNull(rect.getAttribute('fill-opacity'), 'fill-opacity expected on semi-transparent bg');
    assert.closeTo(parseFloat(rect.getAttribute('fill-opacity')), 128 / 255, 0.01);
  });

  test('fully opaque background produces no fill-opacity attribute', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor.addBackground({
      color: createMockColor(200, 200, 200, 255, '#c8c8c8')
    });

    const rect = visitor.svgElement.lastChild;
    assert.isNull(rect.getAttribute('fill-opacity'), 'fill-opacity must be absent for fully opaque bg');
  });
});

// 4. _getDefs: idempotency
suite('_getDefs — idempotency', function () {

  test('first call creates and inserts <defs> as first child of <svg>', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const defs1 = visitor._getDefs();
    assert.strictEqual(defs1.tagName.toLowerCase(), 'defs');
    assert.strictEqual(visitor.svgElement.firstChild, defs1);
  });

  test('second call returns the identical element — no duplicate <defs>', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const defs1 = visitor._getDefs();
    const defs2 = visitor._getDefs();

    assert.strictEqual(defs1, defs2, 'same element reference expected');
    // Only one <defs> in the SVG
    assert.strictEqual(visitor.svgElement.querySelectorAll('defs').length, 1);
  });

  test('<defs> remains first child after appending other elements', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    visitor._getDefs(); // create defs first
    visitor.svgElement.appendChild(visitor._createElement('rect'));

    // Calling again must not insert another defs
    visitor._getDefs();
    assert.strictEqual(visitor.svgElement.querySelectorAll('defs').length, 1);
    assert.strictEqual(visitor.svgElement.firstChild.tagName.toLowerCase(), 'defs');
  });
});

// 5. visitArcPrimitive — all four modes
suite('visitArcPrimitive — mode branches', function () {

  function makeVisitorWithState(fill, stroke, strokeWeight) {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: fill || null,
      stroke: stroke || null,
      strokeWeight: strokeWeight != null ? strokeWeight : 0,
      transform: new DOMMatrix()
    };
    return visitor;
  }

  // Helper arc args (quarter circle, 0 → π/2)
  const arc = { x: 0, y: 0, w: 100, h: 100, start: 0, stop: Math.PI / 2 };

  test('PIE mode: single closed path with L to center', function () {
    const visitor = makeVisitorWithState(
      createMockColor(255, 0, 0, 255, '#ff0000'),
      createMockColor(0, 0, 0, 255, '#000000'),
      1
    );
    visitor.visitArcPrimitive({ ...arc, mode: 'pie' });

    // dFill == dStroke → single <path>
    const paths = visitor.svgElement.querySelectorAll('path');
    assert.strictEqual(paths.length, 1, 'PIE emits exactly one <path>');
    const d = paths[0].getAttribute('d');
    // Must contain the arc and close with L center Z
    assert.include(d, 'L 50 50', 'PIE path must draw line to center (50, 50)');
    assert.include(d, 'Z', 'PIE path must close');
  });

  test('CHORD mode: single closed path without center line', function () {
    const visitor = makeVisitorWithState(
      createMockColor(0, 255, 0, 255, '#00ff00'),
      createMockColor(0, 0, 0, 255, '#000000'),
      1
    );
    visitor.visitArcPrimitive({ ...arc, mode: 'chord' });

    const paths = visitor.svgElement.querySelectorAll('path');
    assert.strictEqual(paths.length, 1, 'CHORD emits exactly one <path>');
    const d = paths[0].getAttribute('d');
    assert.include(d, 'Z', 'CHORD path must close');
    // Must NOT contain a line to center
    assert.notInclude(d, 'L 50 50', 'CHORD path must NOT draw line to center');
  });

  test('OPEN mode: single open path (no Z, no L to center)', function () {
    const visitor = makeVisitorWithState(
      createMockColor(0, 0, 255, 255, '#0000ff'),
      createMockColor(0, 0, 0, 255, '#000000'),
      1
    );
    visitor.visitArcPrimitive({ ...arc, mode: 'open' });

    const paths = visitor.svgElement.querySelectorAll('path');
    assert.strictEqual(paths.length, 1, 'OPEN emits exactly one <path>');
    const d = paths[0].getAttribute('d');
    assert.notInclude(d, 'Z', 'OPEN path must not close');
    assert.notInclude(d, 'L 50 50', 'OPEN path must not draw line to center');
  });

  test('default/undefined mode: two elements (fill=pie, stroke=open)', function () {
    // No mode → dFill !== dStroke → two separate path elements
    const visitor = makeVisitorWithState(
      createMockColor(255, 255, 0, 255, '#ffff00'),
      createMockColor(0, 0, 0, 255, '#000000'),
      1
    );
    visitor.visitArcPrimitive({ ...arc }); // no mode

    const paths = visitor.svgElement.querySelectorAll('path');
    assert.strictEqual(paths.length, 2, 'default mode emits two <path> elements');

    // One has fill (closed, pie-style), one has fill=none (open, stroke path)
    const fillPath = Array.from(paths).find(p => p.getAttribute('fill') !== 'none');
    const strokePath = Array.from(paths).find(p => p.getAttribute('fill') === 'none');
    assert.isNotNull(fillPath, 'a fill path must exist');
    assert.isNotNull(strokePath, 'a stroke path must exist');

    assert.include(fillPath.getAttribute('d'), 'Z', 'fill path (pie) must be closed');
    assert.notInclude(strokePath.getAttribute('d'), 'Z', 'stroke path (open) must not be closed');
  });

  test('default mode with no fill: only stroke path is emitted', function () {
    const visitor = makeVisitorWithState(
      null, // no fill
      createMockColor(0, 0, 0, 255, '#000000'),
      1
    );
    visitor.visitArcPrimitive({ ...arc }); // no mode

    const paths = visitor.svgElement.querySelectorAll('path');
    // hasFill is false, only stroke element is emitted
    assert.strictEqual(paths.length, 1, 'only stroke path when no fill');
    assert.strictEqual(paths[0].getAttribute('fill'), 'none');
  });

  test('default mode with no stroke: only fill path is emitted', function () {
    const visitor = makeVisitorWithState(
      createMockColor(255, 0, 0, 255, '#ff0000'),
      null, // no stroke
      0
    );
    visitor.visitArcPrimitive({ ...arc }); // no mode

    const paths = visitor.svgElement.querySelectorAll('path');
    // hasStroke is false, only fill element is emitted
    assert.strictEqual(paths.length, 1, 'only fill path when no stroke');
    assert.strictEqual(paths[0].getAttribute('stroke'), 'none');
  });
});

// 6. visitAnchor: second M appends to existing path element
suite('visitAnchor — multi-subpath (second M command)', function () {

  test('second visitAnchor appends M to existing d, does not create new <path>', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: null,
      stroke: createMockColor(0, 0, 0, 255, '#000000'),
      strokeWeight: 1
    };

    // First anchor — creates the path element
    visitor.visitAnchor({
      getEndVertex() { return { position: { x: 10, y: 20 } }; }
    });
    const firstPath = visitor.currentPathElement;
    assert.isNotNull(firstPath);
    assert.strictEqual(visitor.svgElement.querySelectorAll('path').length, 1);

    // Second anchor — must reuse same path element, appending " M ..."
    visitor.visitAnchor({
      getEndVertex() { return { position: { x: 50, y: 60 } }; }
    });

    assert.strictEqual(visitor.currentPathElement, firstPath, 'must be the same path element');
    assert.strictEqual(visitor.svgElement.querySelectorAll('path').length, 1, 'must not create a second <path>');

    const d = firstPath.getAttribute('d');
    assert.include(d, 'M 10 20', 'first M must be present');
    assert.include(d, 'M 50 60', 'second M must be appended');
  });
});

// 7. buildSVG: namespace + multiple elements
suite('buildSVG — serialization', function () {

  test('serialized SVG contains xmlns namespace declaration', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const svgStr = visitor.buildSVG();
    assert.include(svgStr, 'xmlns', 'SVG string must contain an xmlns declaration');
    assert.include(svgStr, 'http://www.w3.org/2000/svg', 'must reference the SVG namespace');
  });

  test('all appended elements appear in serialized output', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);
    visitor.currentState = {
      fill: createMockColor(255, 0, 0, 255, '#ff0000'),
      stroke: null,
      strokeWeight: 0,
      transform: new DOMMatrix()
    };

    // Append a circle and a rect explicitly
    visitor.visitEllipsePrimitive({ x: 0, y: 0, w: 40, h: 40 });
    visitor.visitRectPrimitive({ x: 50, y: 50, w: 30, h: 20 });

    const svgStr = visitor.buildSVG();
    assert.include(svgStr, '<circle', 'circle must appear in serialized SVG');
    assert.include(svgStr, '<rect', 'rect must appear in serialized SVG');
  });

  test('serialized SVG contains correct width and height attributes', function () {
    const pInst = createPInst();
    const visitor = createVisitor(pInst);

    const svgStr = visitor.buildSVG();
    assert.include(svgStr, 'width="600"');
    assert.include(svgStr, 'height="600"');
  });
});
