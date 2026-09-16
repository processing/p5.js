import { SVGExportAddon } from '../../../src/shape/svg/svg_export.js';

// Setup mock p5.js environment for addon initialization
class MockPrimitiveVisitor {}

const mockP5 = {
  PrimitiveVisitor: MockPrimitiveVisitor,
  registerAddon() {}
};

const fn = {};
SVGExportAddon(mockP5, fn);

class MockShape {
  constructor(name) {
    this.name = name;
  }
  accept(visitor) {}
}

function createPInst() {
  const pInst = {
    width: 600,
    height: 600,
    _renderer: {
      states: {
        fillColor: 'red',
        strokeColor: 'black',
        strokeWeight: 1
      },
      strokeCap() {
        return 'butt';
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
      return {
        levels: [255, 0, 0, 255],
        toString() {
          return `rgba(${args.join(',') || '255,0,0,255'})`;
        }
      };
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

suite('ShapeRecorder', function() {
  test('should record basic hierarchy and nodes correctly', function() {
    const pInst = createPInst();
    
    let shape;
    const record = pInst.buildShape(() => {
      // Record background
      pInst.background(255, 200, 100);
      
      // Record a shape
      shape = new MockShape('ellipse1');
      pInst._renderer.drawShape(shape);
      
      // Record clear
      pInst.clear();
    });

    assert.strictEqual(record.data.type, 'scope');
    assert.strictEqual(record.data.children.length, 3);

    const bgNode = record.data.children[0];
    assert.strictEqual(bgNode.type, 'background');
    assert.isDefined(bgNode.color);

    const shapeNode = record.data.children[1];
    assert.strictEqual(shapeNode.type, 'shape');
    assert.strictEqual(shapeNode.shape, shape);
    assert.strictEqual(shapeNode.state.fill, 'red');

    const clearNode = record.data.children[2];
    assert.strictEqual(clearNode.type, 'clear');
  });

  test('should intercept push and pop to build nested ScopeNode hierarchy', function() {
    const pInst = createPInst();

    const record = pInst.buildShape(() => {
      pInst.push();
      
      const shape1 = new MockShape('shape1');
      pInst._renderer.drawShape(shape1);
      
      pInst.push();
      const shape2 = new MockShape('shape2');
      pInst._renderer.drawShape(shape2);
      pInst.pop();

      pInst.pop();
    });

    // Root scope
    assert.strictEqual(record.data.type, 'scope');
    assert.strictEqual(record.data.children.length, 1);

    // First push ScopeNode
    const scope1 = record.data.children[0];
    assert.strictEqual(scope1.type, 'scope');
    assert.strictEqual(scope1.children.length, 2);

    const shapeNode1 = scope1.children[0];
    assert.strictEqual(shapeNode1.type, 'shape');
    assert.strictEqual(shapeNode1.shape.name, 'shape1');

    // Second push ScopeNode
    const scope2 = scope1.children[1];
    assert.strictEqual(scope2.type, 'scope');
    assert.strictEqual(scope2.children.length, 1);

    const shapeNode2 = scope2.children[0];
    assert.strictEqual(shapeNode2.type, 'shape');
    assert.strictEqual(shapeNode2.shape.name, 'shape2');
  });

  test('should track matrix transforms in ShapeNode state without nested transform nodes', function() {
    const pInst = createPInst();

    const record = pInst.buildShape(() => {
      pInst.translate(100, 200);
      
      pInst.push();
      pInst.rotate(Math.PI / 2); // 90 deg
      const shape = new MockShape('rotated_shape');
      pInst._renderer.drawShape(shape);
      pInst.pop();
    });

    assert.strictEqual(record.data.type, 'scope');
    assert.strictEqual(record.data.children.length, 1); // Only the push ScopeNode is added to children

    const childScope = record.data.children[0];
    assert.strictEqual(childScope.type, 'scope');
    assert.strictEqual(childScope.children.length, 1);

    const shapeNode = childScope.children[0];
    assert.strictEqual(shapeNode.type, 'shape');
    assert.strictEqual(shapeNode.shape.name, 'rotated_shape');

    // Verify matrix in state has accumulated both translate and rotate
    const m = shapeNode.state.transform;
    assert.instanceOf(m, DOMMatrix);
    assert.strictEqual(m.e, 100);
    assert.strictEqual(m.f, 200);
    assert.closeTo(m.a, 0, 0.0001);
    assert.closeTo(m.b, 1, 0.0001);
    assert.closeTo(m.c, -1, 0.0001);
    assert.closeTo(m.d, 0, 0.0001);
  });

  test('should cleanup intercepted methods on stop', function() {
    const pInst = createPInst();

    // Preserve original references for verification
    const origDrawShape = pInst._renderer.drawShape;
    const origPush = pInst.push;
    const origPop = pInst.pop;
    const origTranslate = pInst.translate;

    pInst.buildShape(() => {
      // During buildShape, methods should be wrapped
      assert.notStrictEqual(pInst._renderer.drawShape, origDrawShape);
      assert.notStrictEqual(pInst.push, origPush);
      assert.notStrictEqual(pInst.pop, origPop);
      assert.notStrictEqual(pInst.translate, origTranslate);
    });

    // After buildShape finishes, functions should be restored
    assert.strictEqual(pInst._renderer.drawShape, origDrawShape);
    assert.strictEqual(pInst.push, origPush);
    assert.strictEqual(pInst.pop, origPop);
    assert.strictEqual(pInst.translate, origTranslate);
  });

  test('should cleanup intercepted methods on shape.end', function() {
    const pInst = createPInst();

    // Preserve original references for verification
    const origDrawShape = pInst._renderer.drawShape;
    const origPush = pInst.push;
    const origPop = pInst.pop;
    const origTranslate = pInst.translate;

    const shapeObj = pInst.createShape();
    shapeObj.begin();
    // During recording, methods should be wrapped
    assert.notStrictEqual(pInst._renderer.drawShape, origDrawShape);
    assert.notStrictEqual(pInst.push, origPush);
    assert.notStrictEqual(pInst.pop, origPop);
    assert.notStrictEqual(pInst.translate, origTranslate);

    shapeObj.end();

    // After shape.end, functions should be restored
    assert.strictEqual(pInst._renderer.drawShape, origDrawShape);
    assert.strictEqual(pInst.push, origPush);
    assert.strictEqual(pInst.pop, origPop);
    assert.strictEqual(pInst.translate, origTranslate);
  });

  test('should record reusable shapes nested via pInst.shape()', function() {
    const pInst = createPInst();
    
    // Add missing p5 methods required by CanvasReplay.applyState
    pInst.applyMatrix = () => {};
    pInst.fill = () => {};
    pInst.stroke = () => {};
    pInst.noFill = () => {};
    pInst.noStroke = () => {};
    pInst.strokeWeight = () => {};
    pInst.strokeCap = () => {};

    // Mock colors that have _getRGBA
    const mockColor = {
      _getRGBA() { return [255, 0, 0, 255]; }
    };
    pInst._renderer.states.fillColor = mockColor;
    pInst._renderer.states.strokeColor = mockColor;
    
    // Build first reusable shape
    const shapeA = new MockShape('shapeA');
    const reusable = pInst.buildShape(() => {
      pInst._renderer.drawShape(shapeA);
    });

    // Verify first buildShape recorded correctly
    assert.strictEqual(reusable.data.type, 'scope');
    assert.strictEqual(reusable.data.children.length, 1);
    assert.strictEqual(reusable.data.children[0].type, 'shape');
    assert.strictEqual(reusable.data.children[0].shape.name, 'shapeA');

    // Build outer shape that reuses the first shape via pInst.shape()
    const parentRecord = pInst.buildShape(() => {
      pInst.shape(reusable);
    });

    // Verify outer record contains nested scope representing the replayed shape
    assert.strictEqual(parentRecord.data.type, 'scope');
    assert.strictEqual(parentRecord.data.children.length, 1);
    
    const nestedScope = parentRecord.data.children[0];
    assert.strictEqual(nestedScope.type, 'scope');
    assert.strictEqual(nestedScope.children.length, 1);
    
    const replayedShapeNode = nestedScope.children[0];
    assert.strictEqual(replayedShapeNode.type, 'shape');
    assert.strictEqual(replayedShapeNode.shape.name, 'shapeA');
  });

  test('should handle buildShape called without a callback function', function() {
    const pInst = createPInst();

    // Call without arguments
    let record;
    assert.doesNotThrow(() => {
      record = pInst.buildShape();
    });

    assert.strictEqual(record.data.type, 'scope');
    assert.strictEqual(record.data.children.length, 0);
  });

  test('should record strokeCap state in shape node', function() {
    const pInst = createPInst();
    pInst._renderer.strokeCap = () => 'round';

    const record = pInst.buildShape(() => {
      const shape = new MockShape('line1');
      pInst._renderer.drawShape(shape);
    });

    assert.strictEqual(record.data.children.length, 1);
    const shapeNode = record.data.children[0];
    assert.strictEqual(shapeNode.type, 'shape');
    assert.strictEqual(shapeNode.state.strokeCap, 'round');
  });
});

suite('ShapeRecorder — scale interceptor', function() {

  test('single-arg scale(x) wires to TransformStack and accumulates uniform scale', function() {
    const pInst = createPInst();

    const record = pInst.buildShape(() => {
      pInst.scale(3);
      const shape = new MockShape('scaled_shape');
      pInst._renderer.drawShape(shape);
    });

    const shapeNode = record.data.children[0];
    assert.strictEqual(shapeNode.type, 'shape');
    const m = shapeNode.state.transform;
    // scale(3) → uniform: a=3, d=3
    assert.closeTo(m.a, 3, 0.0001, 'a (scaleX) should be 3');
    assert.closeTo(m.d, 3, 0.0001, 'd (scaleY) should be 3');
  });

  test('two-arg scale(x, y) wires to TransformStack and accumulates non-uniform scale', function() {
    const pInst = createPInst();

    const record = pInst.buildShape(() => {
      pInst.scale(2, 4);
      const shape = new MockShape('scaled_shape2');
      pInst._renderer.drawShape(shape);
    });

    const shapeNode = record.data.children[0];
    const m = shapeNode.state.transform;
    // scale(2, 4) → a=2, d=4
    assert.closeTo(m.a, 2, 0.0001, 'a (scaleX) should be 2');
    assert.closeTo(m.d, 4, 0.0001, 'd (scaleY) should be 4');
  });

  test('scale does not affect p5 instance after buildShape ends', function() {
    const pInst = createPInst();
    const origScale = pInst.scale;

    pInst.buildShape(() => {
      // inside: intercepted
      assert.notStrictEqual(pInst.scale, origScale);
    });

    // outside: restored
    assert.strictEqual(pInst.scale, origScale);
  });
});

suite('TransformStack', function() {
  test('should initialize with an identity matrix', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    assert.isDefined(tStack);
    assert.instanceOf(tStack.current, DOMMatrix);
    
    const m = tStack.current;
    assert.strictEqual(m.a, 1);
    assert.strictEqual(m.b, 0);
    assert.strictEqual(m.c, 0);
    assert.strictEqual(m.d, 1);
    assert.strictEqual(m.e, 0);
    assert.strictEqual(m.f, 0);
    shape.end();
  });

  test('push should clone the current matrix', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    tStack.translate(50, 100);
    
    tStack.push();
    assert.strictEqual(tStack.stack.length, 2);
    
    const m = tStack.current;
    assert.strictEqual(m.e, 50);
    assert.strictEqual(m.f, 100);
    
    // Modifying current should not affect parent in stack
    tStack.translate(20, 30);
    assert.strictEqual(tStack.current.e, 70);
    assert.strictEqual(tStack.stack[0].e, 50);
    shape.end();
  });

  test('pop should restore the previous matrix and not pop past root', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    tStack.translate(10, 20);
    
    tStack.push();
    tStack.translate(100, 200);
    assert.strictEqual(tStack.current.e, 110);
    
    tStack.pop();
    assert.strictEqual(tStack.current.e, 10);
    assert.strictEqual(tStack.stack.length, 1);
    
    // Pop when stack size is 1 should be a no-op
    tStack.pop();
    assert.strictEqual(tStack.current.e, 10);
    assert.strictEqual(tStack.stack.length, 1);
    shape.end();
  });

  test('translate should translate the matrix self', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    tStack.translate(15, 25);
    assert.strictEqual(tStack.current.e, 15);
    assert.strictEqual(tStack.current.f, 25);
    shape.end();
  });

  test('rotate should rotate the matrix self in degrees internally', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    // rotate is passed radians, converts to degrees inside rotateSelf
    // PI / 2 rad = 90 degrees
    tStack.rotate(Math.PI / 2);
    
    assert.closeTo(tStack.current.a, 0, 0.0001);
    assert.closeTo(tStack.current.b, 1, 0.0001);
    assert.closeTo(tStack.current.c, -1, 0.0001);
    assert.closeTo(tStack.current.d, 0, 0.0001);
    shape.end();
  });

  test('scale should scale with one or two arguments', function() {
    const pInst = createPInst();
    const shape = pInst.createShape();
    shape.begin();
    const tStack = shape.recorder.tStack;
    
    // Scale with one argument (uniform scaling)
    tStack.scale(2);
    assert.strictEqual(tStack.current.a, 2);
    assert.strictEqual(tStack.current.d, 2);
    
    tStack.push();
    // Scale with two arguments (non-uniform scaling)
    tStack.scale(3, 4);
    // Cumulative: 2 * 3 = 6, 2 * 4 = 8
    assert.strictEqual(tStack.current.a, 6);
    assert.strictEqual(tStack.current.d, 8);
    shape.end();
  });
});
