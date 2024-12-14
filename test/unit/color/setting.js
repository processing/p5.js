import p5 from '../../../src/app.js';

import { vi } from 'vitest';
import { mockP5, mockP5Prototype } from '../../js/mocks';
import creatingReading from '../../../src/color/creating_reading';
import setting from '../../../src/color/setting';

// NOTE: Require ESM compatible libtess
suite('color/Setting', function() {
  let myp5; // sketch without WEBGL Mode
  let my3D; // sketch with WEBGL mode

  beforeAll(() => {
    creatingReading(mockP5, mockP5Prototype);
    setting(mockP5, mockP5Prototype);
    // mockP5Prototype.states = {
    //   colorMode: 'rgb',
    //   colorMaxes: {
    //     rgb: [255, 255, 255, 255],
    //     hsb: [360, 100, 100, 1],
    //     hsl: [360, 100, 100, 1]
    //   }
    // }
  });

  afterAll(() => {
    delete mockP5Prototype._colorMaxes;
  });

  beforeEach(async function() {
    await new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          p.createCanvas(100, 100, p.WEBGL);
          my3D = p;
          resolve();
        };
      });
    });

    await new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          resolve();
        };
      });
    });
  });

  afterEach(function() {
    myp5.remove();
    my3D.remove();
  });

  suite('p5.prototype.erase', function() {
    beforeEach(() => {
      mockP5Prototype._renderer = {
        erase: vi.fn(),
        states: {
          colorMode: 'rgb',
          colorMaxes: {
            rgb: [255, 255, 255, 255],
            hsb: [360, 100, 100, 1],
            hsl: [360, 100, 100, 1]
          }
        }
      }
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    test('should be a function', function() {
      assert.ok(mockP5Prototype.erase);
    });

    test('should call the renderer erase method with default arguments', function() {
      mockP5Prototype.erase();
      expect(mockP5Prototype._renderer.erase).toHaveBeenCalledWith(255, 255);
    });

    // TODO: test in renderer
    test.todo('should set renderer to erasing state');
    test.todo('should cache renderer fill', function() {
      myp5.fill(255, 0, 0);
      const fillStyle = myp5.drawingContext.fillStyle;
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedFillStyle, fillStyle);
    });

    test.todo('should cache renderer stroke', function() {
      myp5.stroke(255, 0, 0);
      const strokeStyle = myp5.drawingContext.strokeStyle;
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedStrokeStyle, strokeStyle);
    });

    test.todo('should cache renderer blend', function() {
      myp5.blendMode(myp5.SCREEN);
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedBlendMode, myp5.SCREEN);
    });

    test.todo('should set fill strength', function() {
      myp5.erase(125);
      assert.equal(
        myp5.color(myp5.drawingContext.fillStyle).array,
        myp5.color(255, 125).array
      );
    });

    test.todo('should set stroke strength', function() {
      myp5.erase(255, 50);
      assert.equal(
        myp5.color(myp5.drawingContext.strokeStyle).array,
        myp5.color(255, 50).array
      );
    });
  });

  suite('p5.RendererGL.prototype.erase', function() {
    test('should set renderer to erasing state', function() {
      my3D.erase();
      assert.isTrue(my3D._renderer._isErasing);
    });

    test.todo('should cache renderer fill', function() {
      my3D.fill(255, 0, 0);
      const curFillColor = my3D._renderer.states.curFillColor;
      my3D.erase();
      assert.deepEqual(my3D._renderer._cachedFillStyle, curFillColor);
    });

    test.todo('should cache renderer stroke', function() {
      my3D.stroke(255, 0, 0);
      const strokeStyle = my3D._renderer.states.curStrokeColor;
      my3D.erase();
      assert.deepEqual(my3D._renderer._cachedStrokeStyle, strokeStyle);
    });

    test('should cache renderer blend', function() {
      my3D.blendMode(my3D.SCREEN);
      my3D.erase();
      assert.deepEqual(my3D._renderer.preEraseBlend, my3D.SCREEN);
    });

    test('should set fill strength', function() {
      my3D.erase(125);
      assert.deepEqual(my3D._renderer.states.curFillColor, [1, 1, 1, 125 / 255]);
    });

    test('should set stroke strength', function() {
      my3D.erase(255, 50);
      assert.deepEqual(my3D._renderer.states.curStrokeColor, [1, 1, 1, 50 / 255]);
    });

    test('should set default values when no arguments', function() {
      my3D.erase();
      assert.deepEqual(my3D._renderer.states.curFillColor, [1, 1, 1, 1]);
      assert.deepEqual(my3D._renderer.states.curStrokeColor, [1, 1, 1, 1]);
    });
  });

  suite('p5.prototype.noErase', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.noErase);
    });

    test('should turn off renderer erasing state', function() {
      myp5.erase();
      myp5.noErase();
      assert.isFalse(myp5._renderer._isErasing);
    });

    test.todo('should restore cached renderer fill', function() {
      myp5.fill(255, 0, 0);
      const fillStyle = myp5.drawingContext.fillStyle;
      myp5.erase();
      myp5.noErase();
      assert.deepEqual(myp5.drawingContext.fillStyle, fillStyle);
    });

    test.todo('should restore cached renderer stroke', function() {
      myp5.stroke(255, 0, 0);
      const strokeStyle = myp5.drawingContext.strokeStyle;
      myp5.erase();
      myp5.noErase();
      assert.deepEqual(myp5.drawingContext.strokeStyle, strokeStyle);
    });
  });

  suite('p5.RendererGL.prototype.noErase', function() {
    test('should turn off renderer erasing state', function() {
      my3D.erase();
      my3D.noErase();
      assert.isFalse(my3D._renderer._isErasing);
    });

    test.todo('should restore cached renderer fill', function() {
      my3D.fill(255, 0, 0);
      const fillStyle = my3D._renderer.states.curFillColor.slice();
      my3D.erase();
      my3D.noErase();
      assert.deepEqual([1, 0, 0, 1], fillStyle);
    });

    test.todo('should restore cached renderer stroke', function() {
      my3D.stroke(255, 0, 0);
      const strokeStyle = my3D._renderer.states.curStrokeColor.slice();
      my3D.erase();
      my3D.noErase();
      assert.deepEqual([1, 0, 0, 1], strokeStyle);
    });
  });

  suite('p5.prototype.colorMode', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.colorMode);
    });

    test('should set mode to RGB', function() {
      console.log(mockP5Prototype);
      mockP5Prototype.colorMode('rgb');
      assert.equal(mockP5Prototype._renderer.states.colorMode, 'rgb');
    });

    test('should correctly set color RGB maxes', function() {
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['rgb'], [255, 255, 255, 255]);
      mockP5Prototype.colorMode('rgb', 1, 1, 1);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['rgb'], [1, 1, 1, 255]);
      mockP5Prototype.colorMode('rgb', 1);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['rgb'], [1, 1, 1, 1]);
      mockP5Prototype.colorMode('rgb', 255, 255, 255, 1);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['rgb'], [255, 255, 255, 1]);
      mockP5Prototype.colorMode('rgb', 255);
    });

    test('should set mode to HSL', function() {
      mockP5Prototype.colorMode('hsl');
      assert.equal(mockP5Prototype._renderer.states.colorMode, 'hsl');
    });

    test('should correctly set color HSL maxes', function() {
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsl'], [360, 100, 100, 1]);
      mockP5Prototype.colorMode('hsl', 255, 255, 255);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsl'], [255, 255, 255, 1]);
      mockP5Prototype.colorMode('hsl', 360);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsl'], [360, 360, 360, 360]);
      mockP5Prototype.colorMode('hsl', 360, 100, 100, 1);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsl'], [360, 100, 100, 1]);
    });

    test('should set mode to HSB', function() {
      mockP5Prototype.colorMode('hsb');
      assert.equal(mockP5Prototype._renderer.states.colorMode, 'hsb');
    });

    test('should correctly set color HSB maxes', function() {
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsb'], [360, 100, 100, 1]);
      mockP5Prototype.colorMode('hsb', 255, 255, 255);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsb'], [255, 255, 255, 1]);
      mockP5Prototype.colorMode('hsb', 360);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsb'], [360, 360, 360, 360]);
      mockP5Prototype.colorMode('hsb', 360, 100, 100, 1);
      assert.deepEqual(mockP5Prototype._renderer.states.colorMaxes['hsb'], [360, 100, 100, 1]);
    });
  });

  suite('p5.Color components', function() {
    test('setRed() correctly sets red component', function() {
      mockP5Prototype.colorMode('rgb', 255);
      const c = mockP5Prototype.color(0, 162, 205, 255);
      c.setRed(100/255);
      assert.equal(mockP5Prototype.red(c), 100/255);
      assert.equal(mockP5Prototype.green(c), 162/255);
      assert.equal(mockP5Prototype.blue(c), 205/255);
      assert.equal(mockP5Prototype.alpha(c), 255/255);
    });

    test('setGreen() correctly sets green component', function() {
      mockP5Prototype.colorMode('rgb', 255);
      const c = mockP5Prototype.color(0, 162, 205, 255);
      c.setGreen(100/255);
      assert.equal(mockP5Prototype.red(c), 0);
      assert.equal(mockP5Prototype.green(c), 100/255);
      assert.equal(mockP5Prototype.blue(c), 205/255);
      assert.equal(mockP5Prototype.alpha(c), 255/255);
    });

    test('setBlue() correctly sets blue component', function() {
      mockP5Prototype.colorMode('rgb', 255);
      const c = mockP5Prototype.color(0, 162, 205, 255);
      c.setBlue(100/255);
      assert.equal(mockP5Prototype.red(c), 0);
      assert.equal(mockP5Prototype.green(c), 162/255);
      assert.equal(mockP5Prototype.blue(c), 100/255);
      assert.equal(mockP5Prototype.alpha(c), 255/255);
    });

    test('setAlpha correctly sets alpha component', function() {
      mockP5Prototype.colorMode('rgb', 255);
      const c = mockP5Prototype.color(0, 162, 205, 255);
      c.setAlpha(100/255);
      assert.equal(mockP5Prototype.red(c), 0/255);
      assert.equal(mockP5Prototype.green(c), 162/255);
      assert.equal(mockP5Prototype.blue(c), 205/255);
      assert.equal(mockP5Prototype.alpha(c), 100/255);
    });

    test('changing the red/green/blue/alpha components should clear the cached HSL/HSB values', function() {
      mockP5Prototype.colorMode('rgb', 255);
      const c = mockP5Prototype.color(0, 162, 205, 255);

      // create HSL/HSB values
      mockP5Prototype.lightness(c);
      mockP5Prototype.brightness(c);
      c.setRed(100/255);
      assert(!c.hsba);
      assert(!c.hsla);

      mockP5Prototype.lightness(c);
      mockP5Prototype.brightness(c);
      c.setGreen(100/255);
      assert(!c.hsba);
      assert(!c.hsla);

      mockP5Prototype.lightness(c);
      mockP5Prototype.brightness(c);
      c.setBlue(100/255);
      assert(!c.hsba);
      assert(!c.hsla);

      mockP5Prototype.lightness(c);
      mockP5Prototype.brightness(c);
      c.setAlpha(100/255);
      assert(!c.hsba);
      assert(!c.hsla);
    });
  });
});
