import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('Vertex', function() {
  var myp5;

  beforeEach(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterEach(function() {
    vi.restoreAllMocks();
    myp5.remove();
  });

  suite('p5.prototype.beginShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.beginShape);
      assert.typeOf(myp5.beginShape, 'function');
    });
  });

  suite('p5.prototype.bezierVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.bezierVertex);
      assert.typeOf(myp5.bezierVertex, 'function');
    });
  });

  suite('p5.prototype.splineVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.splineVertex);
      assert.typeOf(myp5.splineVertex, 'function');
    });
  });

  suite('p5.prototype.endShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.endShape);
      assert.typeOf(myp5.endShape, 'function');
    });
  });

  suite('p5.prototype.vertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.vertex);
      assert.typeOf(myp5.vertex, 'function');
    });
  });

  suite('path segment batching', function() {
    test('consecutive line vertices batch into one segment', function() {
      myp5.createCanvas(50, 50);
      myp5.beginShape();
      for (let i = 0; i < 5; i++) {
        myp5.vertex(i * 10, 5);
      }
      const primitives = myp5._renderer.currentShape.contours[0].primitives;
      // one anchor plus one polyline segment holding the remaining vertices
      assert.equal(primitives.length, 2);
      assert.equal(primitives[1].vertexCount, 4);
      myp5.endShape();
    });

    test('endShape(CLOSE) keeps the closing vertex in its own segment', function() {
      myp5.createCanvas(50, 50);
      myp5.beginShape();
      myp5.vertex(0, 0);
      myp5.vertex(10, 0);
      myp5.vertex(10, 10);
      myp5.endShape(myp5.CLOSE);
      const primitives = myp5._renderer.currentShape.contours[0].primitives;
      // anchor + batched polyline + separate closing segment
      assert.equal(primitives.length, 3);
      assert.equal(primitives[1].vertexCount, 2);
      assert.isFalse(primitives[1].isClosing);
      assert.equal(primitives[2].vertexCount, 1);
      assert.isTrue(primitives[2].isClosing);
    });

    test('line vertices after a spline segment start a new segment', function() {
      myp5.createCanvas(50, 50);
      myp5.beginShape();
      myp5.vertex(0, 0);
      myp5.splineVertex(10, 0);
      myp5.vertex(20, 0);
      myp5.vertex(30, 0);
      const primitives = myp5._renderer.currentShape.contours[0].primitives;
      // anchor + spline segment + one batched polyline segment
      assert.equal(primitives.length, 3);
      assert.equal(primitives[2].vertexCount, 2);
      myp5.endShape();
    });

    test('beginContour() batches independently per contour', function() {
      myp5.createCanvas(50, 50);
      myp5.beginShape();
      myp5.vertex(0, 0);
      myp5.vertex(40, 0);
      myp5.vertex(40, 40);
      myp5.beginContour();
      myp5.vertex(10, 10);
      myp5.vertex(20, 10);
      myp5.vertex(20, 20);
      myp5.endContour();
      const contours = myp5._renderer.currentShape.contours;
      assert.equal(contours.length, 2);
      assert.equal(contours[0].primitives.length, 2);
      assert.equal(contours[0].primitives[1].vertexCount, 2);
      assert.equal(contours[1].primitives.length, 2);
      assert.equal(contours[1].primitives[1].vertexCount, 2);
      myp5.endShape();
    });

    test('non-PATH shapes keep using primitive capacity', function() {
      myp5.createCanvas(50, 50);
      myp5.beginShape(myp5.TRIANGLES);
      for (let i = 0; i < 6; i++) {
        myp5.vertex(i * 5, i * 5);
      }
      const primitives = myp5._renderer.currentShape.contours[0].primitives;
      assert.equal(primitives.length, 2);
      assert.equal(primitives[0].vertexCount, 3);
      assert.equal(primitives[1].vertexCount, 3);
      myp5.endShape();
    });
  });
});
