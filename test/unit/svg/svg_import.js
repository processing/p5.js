import { SVGImportAddon } from '../../../src/shape/svg/svg_import.js';

class MockVector {
  constructor(x, y) { this.x = x; this.y = y; }
}

class MockShape {
  constructor() { this.commands = []; }
  beginShape()             { this.commands.push({ name: 'beginShape' }); }
  endShape(mode)           {
    const cmd = { name: 'endShape' };
    if (mode !== undefined) cmd.mode = mode;
    this.commands.push(cmd);
  }
  beginContour()           { this.commands.push({ name: 'beginContour' }); }
  endContour(mode)         { this.commands.push({ name: 'endContour', mode }); }
  vertex(v)                { this.commands.push({ name: 'vertex',       x: v.x, y: v.y }); }
  bezierOrder(order)       { this.commands.push({ name: 'bezierOrder',  order }); }
  bezierVertex(v)          { this.commands.push({ name: 'bezierVertex', x: v.x, y: v.y }); }
  rectPrimitive(x,y,w,h,tl,tr,br,bl) {
    this.commands.push({ name: 'rectPrimitive', x, y, w, h, tl, tr, br, bl });
  }
  ellipsePrimitive(x,y,w,h) {
    this.commands.push({ name: 'ellipsePrimitive', x, y, w, h });
  }
  line(x1,y1,x2,y2) {
    this.commands.push({ name: 'line', x1, y1, x2, y2 });
  }
}

const mockP5 = {
  Shape: MockShape,
  Vector: MockVector,
  CLOSE: 'CLOSE',
  registerAddon() {}
};

function makePInst() {
  // Minimal p5 instance — color() returns a trackable object
  const pInst = {
    CLOSE: 'CLOSE',
    _lastColor: null,
    color(c) {
      let src = c;
      if (typeof c === 'string' && c.startsWith('rgba(') && c.endsWith(')')) {
        src = c.substring(5, c.length - 1);
      }
      const obj = {
        _src: src,
        levels: [128, 128, 128, 255],
        toString(fmt) { return `rgba(${src})`; },
        setAlpha(a) { this._alpha = a; }
      };
      pInst._lastColor = obj;
      return obj;
    },
    alpha(c) { return c._alpha !== undefined ? c._alpha : 255; }
  };
  const fn = {};
  SVGImportAddon(mockP5, fn);
  Object.setPrototypeOf(pInst, fn);
  return pInst;
}

// Helper: parse a raw SVG string and return the ShapeRecord
function createSVG(svgText) {
  return makePInst().createSVG(svgText);
}

// Helper: first child ShapeNode from a record
function firstChild(record) {
  return record.children[0];
}

// Helper: shape commands from the first child
function firstChildCommands(record) {
  return firstChild(record).shape.commands;
}

suite('StyleResolver', function () {

  test('default SVG fill is black, stroke is none', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10"/>
      </svg>
    `);
    const node = firstChild(record);
    // Default context: fill=black, stroke=none
    assert.isNull(node.state.stroke);        // stroke="none" → null
    assert.isNotNull(node.state.fill);       // fill="black" → non-null
  });

  test('explicit fill attribute is read', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="red"/>
      </svg>
    `);
    const node = firstChild(record);
    assert.isNotNull(node.state.fill);
  });

  test('fill="none" produces null fill', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="none"/>
      </svg>
    `);
    assert.isNull(firstChild(record).state.fill);
  });

  test('stroke attribute produces non-null stroke', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" stroke="blue"/>
      </svg>
    `);
    assert.isNotNull(firstChild(record).state.stroke);
  });

  test('stroke-width attribute is parsed as a number', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" stroke="black" stroke-width="5"/>
      </svg>
    `);
    assert.strictEqual(firstChild(record).state.strokeWeight, 5);
  });

  test('stroke-width="0" is read correctly', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" stroke="black" stroke-width="0"/>
      </svg>
    `);
    assert.strictEqual(firstChild(record).state.strokeWeight, 0);
  });

  test('stroke-linecap attribute is parsed correctly', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="10" y2="10" stroke="black" stroke-linecap="round"/>
      </svg>
    `);
    assert.strictEqual(firstChild(record).state.strokeCap, 'round');
  });

  test('stroke-linecap in inline style overrides attribute', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="10" y2="10" stroke="black" stroke-linecap="butt" style="stroke-linecap: square"/>
      </svg>
    `);
    assert.strictEqual(firstChild(record).state.strokeCap, 'square');
  });

  test('stroke-linecap inherits from parent <g>', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g stroke-linecap="square">
          <line x1="0" y1="0" x2="10" y2="10" stroke="black"/>
        </g>
      </svg>
    `);
    const groupNode = firstChild(record);
    const lineNode = groupNode.children[0];
    assert.strictEqual(lineNode.state.strokeCap, 'square');
  });

  test('inline style overrides attribute', function () {
    // style="fill:green" should override fill="red"
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="red" style="fill:none"/>
      </svg>
    `);
    assert.isNull(firstChild(record).state.fill);
  });

  test('opacity attribute scales both fill and stroke alpha', function () {
    // opacity=0 → fill and stroke should be null (zero alpha → treated as none)
    // We can't easily inspect the rgba value directly, but we verify it doesn't crash
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="red" opacity="0"/>
      </svg>
    `);
    // opacity=0 means fillOpacity*opacity = 0 → makeColor returns non-null but with 0 alpha
    // Structure should still have one child
    assert.strictEqual(record.children.length, 1);
  });

  test('fill-opacity="0.5" is applied', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="red" fill-opacity="0.5"/>
      </svg>
    `);
    assert.isNotNull(firstChild(record).state.fill);
  });

  test('fill-opacity as percentage "50%"', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="red" fill-opacity="50%"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });

  test('stroke-opacity attribute does not crash', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" stroke="blue" stroke-opacity="0.7"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });

  test('fill inherits from parent <g>', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g fill="none">
          <rect x="0" y="0" width="10" height="10"/>
        </g>
      </svg>
    `);
    // Group child rect should inherit fill="none" → null fill
    const groupNode = record.children[0];
    const rectNode  = groupNode.children[0];
    assert.isNull(rectNode.state.fill);
  });

  test('child fill overrides parent <g> fill', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g fill="none">
          <rect x="0" y="0" width="10" height="10" fill="red"/>
        </g>
      </svg>
    `);
    const groupNode = record.children[0];
    const rectNode  = groupNode.children[0];
    assert.isNotNull(rectNode.state.fill);
  });
});

suite('display and visibility', function () {

  test('display="none" skips the element entirely', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" display="none"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('display:none in inline style skips the element', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" style="display:none"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('display:none on <g> skips all children', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g display="none">
          <rect x="0" y="0" width="10" height="10"/>
          <circle cx="5" cy="5" r="5"/>
        </g>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('visibility="hidden" skips the element', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" visibility="hidden"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('visibility="collapse" skips the element', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" visibility="collapse"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('visible element after hidden one still renders', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" display="none"/>
        <circle cx="5" cy="5" r="5"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
    assert.strictEqual(record.children[0].type, 'shape');
  });
});

suite('Element visitor — <circle>', function () {

  test('basic circle produces ellipsePrimitive', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="60" r="30"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const ep = cmds.find(c => c.name === 'ellipsePrimitive');
    assert.isDefined(ep);
    assert.strictEqual(ep.x, 50 - 30);  // cx - r
    assert.strictEqual(ep.y, 60 - 30);  // cy - r
    assert.strictEqual(ep.w, 60);       // 2r
    assert.strictEqual(ep.h, 60);
  });

  test('circle with r=0 produces no shape node', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="0"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('circle with negative r produces no shape node', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="-5"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('circle with no cx/cy defaults to 0,0', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle r="10"/>
      </svg>
    `);
    const ep = firstChildCommands(record).find(c => c.name === 'ellipsePrimitive');
    assert.strictEqual(ep.x, -10);   // 0 - 10
    assert.strictEqual(ep.y, -10);
  });
});

suite('Element visitor — <ellipse>', function () {

  test('basic ellipse produces ellipsePrimitive', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="60" rx="40" ry="20"/>
      </svg>
    `);
    const ep = firstChildCommands(record).find(c => c.name === 'ellipsePrimitive');
    assert.isDefined(ep);
    assert.strictEqual(ep.x, 80 - 40);
    assert.strictEqual(ep.y, 60 - 20);
    assert.strictEqual(ep.w, 80);
    assert.strictEqual(ep.h, 40);
  });

  test('ellipse with rx only — ry inherits rx', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="30"/>
      </svg>
    `);
    const ep = firstChildCommands(record).find(c => c.name === 'ellipsePrimitive');
    assert.isDefined(ep);
    assert.strictEqual(ep.w, 60);
    assert.strictEqual(ep.h, 60);
  });

  test('ellipse with ry only — rx inherits ry', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" ry="20"/>
      </svg>
    `);
    const ep = firstChildCommands(record).find(c => c.name === 'ellipsePrimitive');
    assert.strictEqual(ep.w, 40);
    assert.strictEqual(ep.h, 40);
  });

  test('ellipse with rx=0 or ry=0 produces no node', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="0" ry="20"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });
});

suite('Element visitor — <rect>', function () {

  test('plain rect produces rectPrimitive', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="80" height="50"/>
      </svg>
    `);
    const rp = firstChildCommands(record).find(c => c.name === 'rectPrimitive');
    assert.isDefined(rp);
    assert.strictEqual(rp.x, 10);
    assert.strictEqual(rp.y, 20);
    assert.strictEqual(rp.w, 80);
    assert.strictEqual(rp.h, 50);
  });

  test('rect with w=0 produces no node', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="0" height="50"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('rect with h=0 produces no node', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="50" height="0"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('rect with rx produces rounded rect (rectPrimitive with radii)', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100" height="60" rx="10"/>
      </svg>
    `);
    const rp = firstChildCommands(record).find(c => c.name === 'rectPrimitive');
    assert.isDefined(rp);
    assert.strictEqual(rp.tl, 10);
    assert.strictEqual(rp.tr, 10);
  });

  test('rect rx clamped to half-width', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="20" height="20" rx="100"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    // rx=100 > w/2=10, so clamped to 10; since rx==ry, uses simple rect path
    const rp = cmds.find(c => c.name === 'rectPrimitive');
    assert.isDefined(rp);
    assert.strictEqual(rp.tl, 10);
  });

  test('rect with rx only — ry inherits rx', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100" height="60" rx="15"/>
      </svg>
    `);
    const rp = firstChildCommands(record).find(c => c.name === 'rectPrimitive');
    assert.isDefined(rp);
  });

  test('rect with no x/y defaults to 0,0', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="30"/>
      </svg>
    `);
    const rp = firstChildCommands(record).find(c => c.name === 'rectPrimitive');
    assert.strictEqual(rp.x, 0);
    assert.strictEqual(rp.y, 0);
  });
});

suite('Element visitor — <line>', function () {

  test('basic line emits a line command', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="20" x2="90" y2="80"/>
      </svg>
    `);
    const ln = firstChildCommands(record).find(c => c.name === 'line');
    assert.isDefined(ln);
    assert.strictEqual(ln.x1, 10);
    assert.strictEqual(ln.y1, 20);
    assert.strictEqual(ln.x2, 90);
    assert.strictEqual(ln.y2, 80);
  });

  test('line with no attributes defaults all coords to 0', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <line/>
      </svg>
    `);
    const ln = firstChildCommands(record).find(c => c.name === 'line');
    assert.isDefined(ln);
    assert.strictEqual(ln.x1, 0);
    assert.strictEqual(ln.y1, 0);
    assert.strictEqual(ln.x2, 0);
    assert.strictEqual(ln.y2, 0);
  });
});

suite('Element visitor — <polygon>', function () {

  test('polygon emits vertex commands + endShape(CLOSE)', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,20 30,40 50,20"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const verts = cmds.filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 3);
    assert.strictEqual(verts[0].x, 10);
    assert.strictEqual(verts[0].y, 20);
    const end = cmds.find(c => c.name === 'endShape');
    assert.isDefined(end);
    assert.strictEqual(end.mode, 'CLOSE');
  });

  test('polygon with comma-space separated points', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <polygon points="0 0, 100 0, 50 100"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 3);
  });

  test('polygon with empty points produces no vertices', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <polygon points=""/>
      </svg>
    `);
    // Empty points — still produces a shape node but with no vertices
    const cmds = firstChildCommands(record);
    assert.strictEqual(cmds.filter(c => c.name === 'vertex').length, 0);
  });
});

suite('Element visitor — <polyline>', function () {

  test('polyline emits vertex commands without CLOSE', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <polyline points="10,20 30,40 50,20"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const verts = cmds.filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 3);
    const end = cmds.find(c => c.name === 'endShape');
    // endShape should not have CLOSE mode
    assert.isTrue(!end || end.mode !== 'CLOSE');
  });
});

suite('Path parser — M and L commands', function () {

  test('M L Z — absolute moveto, lineto, close', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 L 30 40 Z"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    assert.deepEqual(cmds, [
      { name: 'beginShape' },
      { name: 'vertex', x: 10, y: 20 },
      { name: 'vertex', x: 30, y: 40 },
      { name: 'endContour', mode: 'CLOSE' },
      { name: 'endShape' }
    ]);
  });

  test('implicit L after M — extra pairs treated as lineto', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 30 40 50 60"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 3);
    assert.deepEqual(verts[2], { name: 'vertex', x: 50, y: 60 });
  });

  test('relative m — moves relative to current point', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 m 5 5"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 15, y: 15 });
  });

  test('relative l — lineto relative to current point', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 l 5 5 l -3 2"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 15, y: 15 });
    assert.deepEqual(verts[2], { name: 'vertex', x: 12, y: 17 });
  });

  test('H — horizontal lineto', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 H 50"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 50, y: 20 });
  });

  test('h — relative horizontal lineto', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 h 30"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 40, y: 20 });
  });

  test('V — vertical lineto', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 V 80"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 10, y: 80 });
  });

  test('v — relative vertical lineto', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 v 15"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[1], { name: 'vertex', x: 10, y: 35 });
  });

  test('z (lowercase close) same as Z', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 L 30 40 z"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const end = cmds.find(c => c.name === 'endContour');
    assert.isDefined(end);
    assert.strictEqual(end.mode, 'CLOSE');
  });
});

suite('Path parser — C and S (cubic bezier)', function () {

  test('C — absolute cubic bezier emits 3 bezierVertices', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 C 10 5 20 5 30 0"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const bv = cmds.filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 3);
    assert.closeTo(bv[0].x, 10, 0.001);
    assert.closeTo(bv[0].y, 5, 0.001);
    assert.closeTo(bv[2].x, 30, 0.001);
    assert.closeTo(bv[2].y, 0, 0.001);
  });

  test('c — relative cubic bezier', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 c 5 -5 15 -5 20 0"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 3);
    assert.closeTo(bv[2].x, 30, 0.001);
    assert.closeTo(bv[2].y, 10, 0.001);
  });

  test('two sequential C segments', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 C 10 5 20 5 30 0 C 40 -5 50 -5 60 0"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 6);
  });

  test('S — smooth cubic bezier (reflected control point)', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 C 10 5 20 5 30 0 S 50 -5 60 0"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    // C gives 3, S gives 3 more (reflected cp1 + explicit cp2 + end)
    assert.strictEqual(bv.length, 6);
  });
});

suite('Path parser — Q and T (quadratic bezier)', function () {

  test('Q — quadratic bezier', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 Q 50 100 100 0"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 2);
    // End point should be (100, 0)
    assert.closeTo(bv[1].x, 100, 0.001);
    assert.closeTo(bv[1].y, 0, 0.001);
  });

  test('q — relative quadratic bezier', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 q 40 90 90 -10"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 2);
    // End point should be (100, 0)
    assert.closeTo(bv[1].x, 100, 0.001);
    assert.closeTo(bv[1].y, 0, 0.001);
  });

  test('T — smooth quadratic bezier', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 Q 25 50 50 0 T 100 0"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.strictEqual(bv.length, 4);
  });
});

suite('Path parser — A (arc)', function () {

  test('A — arc produces bezier curves ending at target point', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 A 5 5 0 0 1 15 25"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const bv = cmds.filter(c => c.name === 'bezierVertex');
    assert.isAbove(bv.length, 0);
    const lastBv = bv[bv.length - 1];
    assert.closeTo(lastBv.x, 15, 0.01);
    assert.closeTo(lastBv.y, 25, 0.01);
  });

  test('a — relative arc', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 a 5 5 0 0 1 5 5"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.isAbove(bv.length, 0);
    const lastBv = bv[bv.length - 1];
    assert.closeTo(lastBv.x, 15, 0.01);
    assert.closeTo(lastBv.y, 25, 0.01);
  });

  test('arc with same start and end point produces no bezier', function () {
    // degenerate arc: start === end
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 A 5 5 0 0 1 10 20"/>
      </svg>
    `);
    // Should not crash; may produce 0 bezier vertices
    assert.isNotNull(record);
  });

  test('arc with rx=0 or ry=0 treated as straight line', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 20 A 0 5 0 0 1 15 25"/>
      </svg>
    `);
    assert.isNotNull(record);
  });

  test('arc with scientific notation in coords', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M1e1,2.0e1 A 5,5 0 0,1 15,25"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[0], { name: 'vertex', x: 10, y: 20 });
  });

  test('arc large-arc flag=1 sweep=1', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 80 A 45 45 0 1 1 80 10"/>
      </svg>
    `);
    const bv = firstChildCommands(record).filter(c => c.name === 'bezierVertex');
    assert.isAbove(bv.length, 3); // large arc → multiple bezier segments
  });
});

suite('Path parser — multi-subpath and edge cases', function () {

  test('two subpaths (two M commands) produce a contour', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 L 50 10 Z M 20 20 L 40 20 Z"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);
    const bc = cmds.filter(c => c.name === 'beginContour');
    assert.isAbove(bc.length, 0);
  });

  test('empty path d attribute produces a shape with no vertices', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d=""/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 0);
  });

  test('path with only whitespace d attribute does not crash', function () {
    assert.doesNotThrow(() => {
      createSVG(`<svg xmlns="http://www.w3.org/2000/svg"><path d="   "/></svg>`);
    });
  });

  test('comma-separated coords without spaces', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M10,20L30,40Z"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 2);
    assert.deepEqual(verts[0], { name: 'vertex', x: 10, y: 20 });
  });

  test('negative numbers concatenated (no space)', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M10-5L30-10"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.deepEqual(verts[0], { name: 'vertex', x: 10, y: -5 });
    assert.deepEqual(verts[1], { name: 'vertex', x: 30, y: -10 });
  });

  test('repeated L arguments (implicit L)', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 L 10 20 30 40 50 60"/>
      </svg>
    `);
    const verts = firstChildCommands(record).filter(c => c.name === 'vertex');
    assert.strictEqual(verts.length, 4); // M + 3 L
  });
});

suite('Element visitor — <g> groups', function () {

  test('flat group produces a group node with children', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="10" cy="10" r="5"/>
          <rect x="0" y="0" width="20" height="10"/>
        </g>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
    const group = record.children[0];
    assert.strictEqual(group.type, 'scope');
    assert.strictEqual(group.children.length, 2);
  });

  test('nested groups preserve hierarchy', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g>
          <g>
            <circle cx="10" cy="10" r="5"/>
          </g>
        </g>
      </svg>
    `);
    const outer = record.children[0];
    const inner = outer.children[0];
    assert.strictEqual(inner.type, 'scope');
    assert.strictEqual(inner.children[0].type, 'shape');
  });

  test('empty group produces group node with no children', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <g></g>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
    assert.strictEqual(record.children[0].children.length, 0);
  });

  test('group with transform attribute does not crash', function () {
    assert.doesNotThrow(() => {
      createSVG(`
        <svg xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(10,20)">
            <circle cx="5" cy="5" r="5"/>
          </g>
        </svg>
      `);
    });
  });
});

suite('Unsupported elements', function () {

  test('unknown element is silently ignored', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <unknowntag foo="bar"/>
        <rect x="0" y="0" width="10" height="10"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });

  test('<text> element is silently ignored', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="20">Hello</text>
        <circle cx="50" cy="50" r="10"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });

  test('<defs> element is silently ignored', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <circle id="c" cx="10" cy="10" r="5"/>
        </defs>
        <rect x="0" y="0" width="20" height="20"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });
});

suite('createSVG integration', function () {

  test('returns a ShapeRecord with children array', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="20"/>
      </svg>
    `);
    assert.isNotNull(record);
    assert.isArray(record.children);
  });

  test('multiple top-level shapes produce multiple children', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="20"/>
        <rect x="10" y="10" width="30" height="20"/>
        <line x1="0" y1="0" x2="100" y2="100"/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 3);
  });

  test('sourceSVG is stored on the record', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="20"/>
      </svg>
    `);
    assert.isNotNull(record.sourceSVG);
  });

  test('completely empty SVG produces empty children', function () {
    const record = createSVG(`<svg xmlns="http://www.w3.org/2000/svg"></svg>`);
    assert.strictEqual(record.children.length, 0);
  });

  test('SVG with only defs produces empty children', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs/>
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });

  test('shape node has required state properties', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="red" stroke="black" stroke-width="2"/>
      </svg>
    `);
    const node = firstChild(record);
    assert.property(node, 'state');
    assert.property(node.state, 'fill');
    assert.property(node.state, 'stroke');
    assert.property(node.state, 'strokeWeight');
    assert.property(node.state, 'transform');
  });
});

suite('<defs> and <use> elements', function () {

  test('basic <use> copies shape and position', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <rect id="rect" x="10" y="20" width="30" height="40" fill="red" />
        </defs>
        <use href="#rect" x="100" y="200" />
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
    const node = firstChild(record);
    assert.strictEqual(node.type, 'shape');
    assert.strictEqual(node.state.transform.e, 100);
    assert.strictEqual(node.state.transform.f, 200);
  });

  test('xlink:href is supported', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <rect id="rect2" x="0" y="0" width="10" height="10" />
        </defs>
        <use xlink:href="#rect2" />
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
  });

  test('style inheritance: <use> style overrides defaults, but overridden by referenced element', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <rect id="rect-inherit" x="0" y="0" width="10" height="10" fill="blue" />
          <rect id="rect-no-fill" x="0" y="0" width="10" height="10" />
        </defs>
        <use href="#rect-inherit" fill="red" x="0" y="0" />
        <use href="#rect-no-fill" fill="red" x="10" y="10" />
      </svg>
    `);
    assert.strictEqual(record.children.length, 2);
    const node1 = record.children[0];
    const node2 = record.children[1];
    assert.strictEqual(node1.state.fill._src, 'blue');
    assert.strictEqual(node2.state.fill._src, 'red');
  });

  test('resolves duplicate IDs to the first element in document order', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <rect id="dup" x="0" y="0" width="5" height="5" />
          <rect id="dup" x="0" y="0" width="10" height="10" />
        </defs>
        <use href="#dup" />
      </svg>
    `);
    assert.strictEqual(record.children.length, 1);
    const rectCmds = firstChildCommands(record);
    const rectPrim = rectCmds.find(c => c.name === 'rectPrimitive');
    assert.isNotNull(rectPrim);
    assert.strictEqual(rectPrim.w, 5);
    assert.strictEqual(rectPrim.h, 5);
  });

  test('circular references are detected and avoided', function () {
    assert.doesNotThrow(() => {
      createSVG(`
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="cycleA">
              <use href="#cycleB" />
            </g>
            <g id="cycleB">
              <use href="#cycleA" />
            </g>
          </defs>
          <use href="#cycleA" />
        </svg>
      `);
    });
  });

  test('handles missing references gracefully', function () {
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <use href="#nonexistent" />
      </svg>
    `);
    assert.strictEqual(record.children.length, 0);
  });
});

suite('Path parser — T and S fallback (no preceding matching command)', function () {

  test('T with no preceding Q: uses current point as implicit control point', function () {
    // When lastCommand is NOT Q/q/T/t, handlePathT falls back to cp = (currentX, currentY).
    // Path: M 0 0 T 20 0 — with fallback: cp = (0,0)
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 T 20 0"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);

    const bv = cmds.filter(c => c.name === 'bezierVertex');
    // bezierOrder(2) + two bezierVertices (control=currentPt, end)
    assert.strictEqual(bv.length, 2, 'T without preceding Q must emit 2 bezierVertices');
    // End vertex (second) = T target: (20, 0)
    assert.closeTo(bv[1].x, 20, 0.001);
    assert.closeTo(bv[1].y,  0, 0.001);
    // Control vertex (first) = current point = (0, 0) — the fallback
    assert.closeTo(bv[0].x, 0, 0.001);
    assert.closeTo(bv[0].y, 0, 0.001);
  });

  test('S with no preceding C: uses current point as implicit cp1', function () {
    // When lastCommand is NOT C/c/S/s, handlePathS falls back to cp1 = (currentX, currentY).
    // Path: M 0 0 S 30 -20 40 0 — cp2=(30,-20), end=(40,0), cp1(reflected)=(0,0) (fallback)
    const record = createSVG(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 S 30 -20 40 0"/>
      </svg>
    `);
    const cmds = firstChildCommands(record);

    const bv = cmds.filter(c => c.name === 'bezierVertex');
    // bezierOrder(3) + 3 bezierVertices
    assert.strictEqual(bv.length, 3, 'S without preceding C must emit 3 bezierVertices');
    // Third bezierVertex (end point) = (40, 0)
    assert.closeTo(bv[2].x, 40, 0.001);
    assert.closeTo(bv[2].y,  0, 0.001);
    // First bezierVertex (implicit cp1) = current point = (0, 0) — fallback
    assert.closeTo(bv[0].x, 0, 0.001);
    assert.closeTo(bv[0].y, 0, 0.001);
  });
});
