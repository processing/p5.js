import p5 from '../../../src/app.js';

suite('Set/get properties', function() {

  let p = new p5(function (sketch) {
    sketch.setup = function () { };
    sketch.draw = function () { };
  });

  /*beforeEach(function () {
    myp5 = new p5(function (p) {
      p.setup = function () { };
      p.draw = function () { };
    });
  });
  afterEach(function () {
    myp5.remove();
  });*/

  let getters = {
    fill: new p5.Color([100, 200, 50]),
    stroke: new p5.Color([200, 100, 50, 100]),
    tint: new p5.Color([100, 140, 50]),

    rectMode: p.CENTER,
    colorMode: p.HSB,
    blendMode: 'source-over',
    imageMode: p.CORNER,
    ellipseMode: p.CORNER,
    angleMode: p.DEGREES,

    strokeWeight: 6,
    strokeCap: p.ROUND,
    strokeJoin: p.MITER,
    pixelDensity: 1,
    cursor: 'pointer',

    bezierOrder: 2,
    splineProperties: { ends: p.EXCLUDE, tightness: -5 },

    textureMode: p.IMAGE, // 3D only
    textureWrap: { x: p.REPEAT, y: p.MIRROR }, // 3D only

    textAlign: { horizontal: p.CENTER, vertical: p.CENTER },
    textLeading: 18,
    textFont: 'arial',
    textSize: 1,
    textStyle: 1,
    textWrap: p.WORD,
    textDirection: 1,
    textWeight: 1

    // rotate: p.PI, see #8278
    // translate: { x: 1, y: 2 },
    // scale: { x: 1, y: 2 },
    // background: new p5.Color([100, 100, 50]),

  };

  Object.keys(getters).forEach(prop => {
    let arg = getters[prop];
    test(`${prop}()`, function() {

      // setter
      if (typeof arg === 'object' && !(arg instanceof p5.Color)) {
        p[prop](...Object.values(arg)); // set with object
      }
      else if (Array.isArray(arg)) {
        p[prop](...arg); // set with array
      }
      else {
        p[prop](arg); // set with primitive or p5.Color
      }
      // getter
      assert.strictEqual(p[prop]().toString(), arg.toString(), `${arg.toString()}`);
    });
  });
});
