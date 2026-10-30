import p5 from '../../../src/app.js';
import '../../js/chai_helpers';

suite('color/Instances', function () {
  let sketches = [];

  // Creates a sketch and waits for its setup to run.
  async function createSketch(configure) {
    return new Promise(resolve => {
      const sketch = new p5(p => {
        p.setup = () => {
          p.createCanvas(10, 10);
          configure?.(p);
          resolve(p);
        };
      });
      sketches.push(sketch);
    });
  }

  // Removes a sketch ahead of the cleanup after each test.
  async function removeSketch(sketch) {
    sketches = sketches.filter(s => s !== sketch);
    await sketch.remove();
  }

  afterEach(async function () {
    await Promise.all(sketches.map(sketch => sketch.remove()));
    sketches = [];
  });

  suite('ranges of the sketch that made the color', function () {
    test('red(), green(), blue() and alpha() use the sketch that calls them', async function () {
      const unit = await createSketch(p => p.colorMode(p.RGB, 1));
      // Created later, so it used to decide the ranges of every sketch.
      const standard = await createSketch();

      const c = unit.color(0.5, 0.25, 0.75, 0.125);
      assert.approximately(unit.red(c), 0.5, 1e-6);
      assert.approximately(unit.green(c), 0.25, 1e-6);
      assert.approximately(unit.blue(c), 0.75, 1e-6);
      assert.approximately(unit.alpha(c), 0.125, 1e-6);

      const d = standard.color(255, 0, 51, 255);
      assert.equal(standard.red(d), 255);
      assert.equal(standard.green(d), 0);
      assert.equal(standard.blue(d), 51);
      assert.equal(standard.alpha(d), 255);
    });

    test('red(), green(), blue() and alpha() use their own ranges in a p5.Graphics', async function () {
      const sketch = await createSketch();
      const g = sketch.createGraphics(10, 10);
      g.colorMode(g.RGB, 1);

      const c = g.color(0.5, 0.25, 0.75, 0.125);
      assert.approximately(g.red(c), 0.5, 1e-6);
      assert.approximately(g.green(c), 0.25, 1e-6);
      assert.approximately(g.blue(c), 0.75, 1e-6);
      assert.approximately(g.alpha(c), 0.125, 1e-6);

      // The sketch is unaffected by the colorMode() of its graphics buffer.
      assert.equal(sketch.red(sketch.color(255, 0, 0)), 255);
    });

    test('red(), green() and blue() keep the RGB ranges in other color modes', async function () {
      const sketch = await createSketch(p => {
        p.colorMode(p.RGB, 100);
        p.colorMode(p.HSB, 360, 100, 100, 1);
      });

      const c = sketch.color(0, 100, 100);
      assert.approximately(sketch.red(c), 100, 0.5);
      assert.approximately(sketch.green(c), 0, 0.5);
      assert.approximately(sketch.blue(c), 0, 0.5);
    });

    test('setRed(), setGreen(), setBlue() and setAlpha() use the sketch that made the color', async function () {
      const unit = await createSketch(p => p.colorMode(p.RGB, 1));
      const standard = await createSketch();

      // array() gives the channels from 0 to 1 whatever the colorMode() is.
      const c = unit.color(0, 0, 0, 0);
      c.setRed(0.5);
      c.setGreen(0.25);
      c.setBlue(0.75);
      c.setAlpha(0.125);
      assert.arrayApproximately(c.array(), [0.5, 0.25, 0.75, 0.125], 1e-6);

      const d = standard.color(0, 0, 0, 0);
      d.setRed(255);
      d.setGreen(51);
      d.setBlue(102);
      d.setAlpha(204);
      assert.arrayApproximately(d.array(), [1, 0.2, 0.4, 0.8], 1e-6);
    });

    test('setAlpha() uses the alpha range of the color mode', async function () {
      const sketch = await createSketch(p => p.colorMode(p.HSB));

      const c = sketch.color(200, 50, 80);
      c.setAlpha(0.5);
      assert.arrayApproximately(
        c.array(),
        sketch.color(200, 50, 80, 0.5).array(),
        1e-6
      );

      sketch.colorMode(sketch.HSL, 360, 100, 100, 255);
      const d = sketch.color(200, 50, 80);
      d.setAlpha(51);
      assert.approximately(d.array()[3], 0.2, 1e-6);
    });

    test('setRed(), setGreen() and setBlue() use the RGB ranges in other color modes', async function () {
      const sketch = await createSketch(p => {
        p.colorMode(p.RGB, 100);
        p.colorMode(p.HSB, 360, 100, 100, 1);
      });

      const c = sketch.color(0, 0, 0);
      c.setRed(100);
      c.setGreen(50);
      assert.approximately(c.array()[0], 1, 1e-6);
      assert.approximately(c.array()[1], 0.5, 1e-6);
    });

    test('setters use the ranges of a p5.Graphics for its colors', async function () {
      const sketch = await createSketch();
      const g = sketch.createGraphics(10, 10);
      g.colorMode(g.RGB, 1);

      const c = g.color(0, 0, 0);
      c.setRed(0.5);
      assert.approximately(c.array()[0], 0.5, 1e-6);
    });

    test('colors from lerpColor() use the ranges of the sketch', async function () {
      const unit = await createSketch(p => p.colorMode(p.RGB, 1));
      await createSketch();

      const mixed = unit.lerpColor(
        unit.color(0, 0, 0),
        unit.color(1, 1, 1),
        0.5
      );
      mixed.setRed(0.25);
      assert.approximately(mixed.array()[0], 0.25, 1e-6);
    });

    test('setters accept an explicit range', async function () {
      const sketch = await createSketch();

      const c = sketch.color(0, 0, 0);
      c.setRed(50, 100);
      assert.approximately(c.array()[0], 0.5, 1e-6);
    });
  });

  suite('sketches and the shared p5.Color prototype', function () {
    const methods = [
      'setRed',
      'setGreen',
      'setBlue',
      'setAlpha',
      '_getRed',
      '_getGreen',
      '_getBlue',
      '_getAlpha',
      '_getHue',
      '_getSaturation',
      '_getBrightness',
      '_getLightness'
    ];

    test('creating more sketches does not wrap its methods again', async function () {
      await createSketch();
      const before = methods.map(method => p5.Color.prototype[method]);

      await createSketch();
      await createSketch();

      methods.forEach((method, i) => {
        assert.strictEqual(
          p5.Color.prototype[method],
          before[i],
          `${method} was replaced`
        );
      });
    });

    test('colors do not keep a removed sketch alive', async function () {
      const sketch = await createSketch();
      const c = sketch.color(255, 0, 0);
      assert.strictEqual(
        c._getOwnerMaxes(),
        sketch._renderer.states.colorMaxes
      );

      await removeSketch(sketch);
      assert.isUndefined(c._getOwnerMaxes());
    });

    test('colors can still be converted to JSON', async function () {
      const sketch = await createSketch();
      const c = sketch.color(255, 0, 0);

      assert.doesNotThrow(() => JSON.stringify(c));
    });

    test('colors still work after their sketch is removed', async function () {
      const sketch = await createSketch(p => p.colorMode(p.RGB, 1));
      const c = sketch.color(0.5, 0.25, 0.75);
      await removeSketch(sketch);

      // Without a sketch the setters fall back to the default 0 to 1 range.
      c.setRed(1);
      assert.approximately(c._getRed(), 1, 1e-6);
      assert.approximately(c._getGreen(), 0.25, 1e-6);
    });
  });
});
