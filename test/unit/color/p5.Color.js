import { mockP5, mockP5Prototype } from '../../js/mocks';
import creatingReading from '../../../src/color/creating_reading';
import setting from '../../../src/color/setting';
import { Color } from '../../../src/color/p5.Color';
import p5Color from '../../../src/color/p5.Color';

suite('p5.Color', function() {
  beforeAll(() => {
    creatingReading(mockP5, mockP5Prototype);
    setting(mockP5, mockP5Prototype);
    p5Color(mockP5, mockP5Prototype, {});
  });

  var c;

  suite('p5.prototype.color(r,g,b)', function() {
    beforeEach(function() {
      c = mockP5Prototype.color(255, 0, 102);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 1);
    });
  });

  suite('p5.prototype.color(r,g,b,a)', function() {
    beforeEach(function() {
      c = mockP5Prototype.color(255, 0, 102, 204);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 0.8);
    });
  });

  // NOTE: suite for all signatures

  suite('p5.prototype.color(string)', function(){
    suite('#rgb', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('#f06');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('#rgba', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('#f066');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 0.4);
      });
    });

    suite('#rrggbb', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('#ff0066');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('#rrggbbaa', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('#f01dab1e');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [240, 29, 171].map(c => c/255));
        assert.equal(c._color.alpha, 30/255);
      });
    });

    suite('rgb(r,g,b)', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('rgb(255,0,102)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('rgb(r%,g%,b%)', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('rgb(100%, 0%, 40%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('rgba(r,g,b,a)', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('rgba(255,0,102,0.8)');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 0.8);
      });
    });

    suite('rgba(r%,g%,b%,a)', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('rgba(100.0%,0.0%,40%,0.8)');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [1, 0, 0.4]);
        assert.equal(c._color.alpha, 0.8);
      });
    });

    suite('hsl(h, s%, l%)', function(){
      beforeEach(function() {
        c = mockP5Prototype.color('hsl(336, 100%, 50%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });
      test('should correctly set RGBA property', function() {
        // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
        // assert.deepEqual(c.color.coords, [336, 100, 50]);
        assert.equal(+c._color.coords[0], 336);
        assert.equal(c._color.coords[1], 100);
        assert.equal(c._color.coords[2], 50);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('hsla(h, s%, l%, a)', function() {
      beforeEach(function() {
        c = mockP5Prototype.color('hsla(336, 100%, 50%, 0.8)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });
      test('should correctly set RGBA property', function() {
        // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
        // assert.deepEqual(c.color.coords, [336, 100, 50]);
        assert.equal(+c._color.coords[0], 336);
        assert.equal(c._color.coords[1], 100);
        assert.equal(c._color.coords[2], 50);
        assert.equal(c._color.alpha, 0.8);
      });
    });

    suite('hsb(h, s%, b%)', function() {
      beforeEach(function() {
        c = mockP5Prototype.color('hsb(336, 100%, 100%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });
      test('should correctly set RGBA property', function() {
        // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
        // assert.deepEqual(c.color.coords, [336, 100, 100]);
        assert.equal(+c._color.coords[0], 336);
        assert.equal(c._color.coords[1], 100);
        assert.equal(c._color.coords[2], 100);
        assert.equal(c._color.alpha, 1);
      });
    });

    suite('hsba(h, s%, b%, a)', function() {
      beforeEach(function() {
        c = mockP5Prototype.color('hsba(336, 100%, 100%, 0.8)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });
      test('should correctly set RGBA property', function() {
        // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
        // assert.deepEqual(c.color.coords, [336, 100, 50]);
        assert.equal(+c._color.coords[0], 336);
        assert.equal(c._color.coords[1], 100);
        assert.equal(c._color.coords[2], 100);
        assert.equal(c._color.alpha, 0.8);
      });
    });

    suite('named colors', function() {
      beforeEach(function() {
        c = mockP5Prototype.color('papayawhip');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c._color.coords, [255, 239, 213].map(c => c/255));
        assert.equal(c._color.alpha, 1);
      });
    });

    // NOTE: previously returns a white color
    suite.todo('invalid string');
  });

  suite('p5.prototype.color([])', function() {
    beforeEach(function() {
      c = mockP5Prototype.color([255, 0, 102]);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 1);
    });
  });

  // color level setters
  suite('in default mode', function() {
    test('can be modified with alpha setter', function() {
      let cc = mockP5Prototype.color(255, 0, 102, 204);
      assert.deepEqual(cc._color.coords, [1, 0, 0.4]);
      assert.equal(cc._color.alpha, 0.8);
      cc.setAlpha(98/255);
      assert.deepEqual(cc._color.coords, [1, 0, 0.4]);
      assert.equal(cc._color.alpha, 98/255);
    });

    test('can be modified with rgb setters', function() {
      var cc = mockP5Prototype.color(255, 0, 102, 204);
      assert.deepEqual(cc._color.coords, [1, 0, 0.4]);
      assert.equal(cc._color.alpha, 0.8);
      cc.setRed(98/255);
      assert.deepEqual(cc._color.coords, [98/255, 0, 0.4]);
      assert.equal(cc._color.alpha, 0.8);
      cc.setGreen(44/255);
      assert.deepEqual(cc._color.coords, [98/255, 44/255, 0.4]);
      assert.equal(cc._color.alpha, 0.8);
      cc.setBlue(244/255);
      assert.deepEqual(cc._color.coords, [98/255, 44/255, 244/255]);
      assert.equal(cc._color.alpha, 0.8);
    });
  });

  // Color Mode
  suite('p5.Color in RGB mode with custom range', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB, 1);
      c = mockP5Prototype.color(1, 0, 0.4, 0.8);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly get RGBA property', function() {
      assert.equal(c._getRed(), 1);
      assert.equal(c._getGreen(), 0);
      assert.equal(c._getBlue(), 0.4);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), '#ff0066cc');
    });

    test('should correctly get RGBA property after overwrite', function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB, 255, 255, 255, 255);
      assert.equal(c._getRed(), 255/255);
      assert.equal(c._getGreen(), 0/255);
      assert.equal(c._getBlue(), 102/255);
      assert.equal(c._getAlpha(), 204/255);
    });
  });

  suite('p5.Color in HSL mode', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      c = mockP5Prototype.color(336, 100, 50);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [336, 100, 50]);
      assert.equal(c._color.alpha, 1);
    });

    test('can be modified with alpha setter', function() {
      let cc = mockP5Prototype.color(336, 100, 50);
      cc.setAlpha(0.73);
      assert.deepEqual(cc._color.coords, [336, 100, 50]);
      assert.equal(cc._color.alpha, 0.73);
    });

    test('can be modified with rgb setters', function() {
      let cc = mockP5Prototype.color(336, 100, 50);
      assert.deepEqual(cc._color.coords, [336, 100, 50]);
      assert.equal(cc._color.alpha, 1);

      // TODO: separately check these values are correct (not in test here)
      cc.setRed(98/255);
      assert.closeTo(cc._color.coords[0], 297, 1);
      assert.closeTo(cc._color.coords[1], 100, 1);
      assert.closeTo(cc._color.coords[2], 20, 1);
      assert.equal(cc._color.alpha, 1);

      cc.setGreen(44/255);
      assert.closeTo(cc._color.coords[0], 295, 1);
      assert.closeTo(cc._color.coords[1], 39, 1);
      assert.closeTo(cc._color.coords[2], 28, 1);
      assert.equal(cc._color.alpha, 1);

      cc.setBlue(244/255);
      assert.closeTo(cc._color.coords[0], 256, 1);
      assert.closeTo(cc._color.coords[1], 90, 1);
      assert.closeTo(cc._color.coords[2], 56, 1);
      assert.equal(cc._color.alpha, 1);
    });
  });

  suite('p5.Color in HSL mode with Alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      c = mockP5Prototype.color(336, 100, 50, 0.8);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [336, 100, 50]);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly get hue/saturation/lightness/alpha', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });
  });

  suite('p5.Color in HSL mode with custom range', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL, 100, 200, 300, 10);
      c = mockP5Prototype.color(93.33, 200, 150, 8);
    });

    test('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.5);
    });

    test('should correctly convert to RGBA', function() {
      assert.closeTo(c._color.coords[0], 336, 1);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 50);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'hsl(335.99 100% 50% / 0.8)');
    });

    test('can be modified with alpha setter', function() {
      let cc = mockP5Prototype.color(93.33, 200, 150, 8);
      cc.setAlpha(0.73);
      assert.closeTo(cc._color.coords[0], 336, 1);
      assert.equal(cc._color.coords[1], 100);
      assert.equal(cc._color.coords[2], 50);
      assert.equal(cc._color.alpha, 0.73);
    });

    test('can be modified with rgb setters', function() {
      let cc = mockP5Prototype.color(93.33, 200, 150, 8);
      assert.closeTo(c._color.coords[0], 336, 1);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 50);
      assert.equal(c._color.alpha, 0.8);

      cc.setRed(98/255);
      assert.closeTo(cc._color.coords[0], 297, 1);
      assert.closeTo(cc._color.coords[1], 100, 1);
      assert.closeTo(cc._color.coords[2], 20, 1);
      assert.equal(cc._color.alpha, 0.8);

      cc.setGreen(44/255);
      assert.closeTo(cc._color.coords[0], 295, 1);
      assert.closeTo(cc._color.coords[1], 39, 1);
      assert.closeTo(cc._color.coords[2], 28, 1);
      assert.equal(cc._color.alpha, 0.8);

      cc.setBlue(244/255);
      assert.closeTo(cc._color.coords[0], 256, 1);
      assert.closeTo(cc._color.coords[1], 90, 1);
      assert.closeTo(cc._color.coords[2], 56, 1);
      assert.equal(cc._color.alpha, 0.8);
    });
  });

  suite('p5.Color in HSL mode with RGB string', function() {
    // NOTE: will still create a sRGB color in this case
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL, 360, 100, 100, 1);
      c = mockP5Prototype.color('rgba(255, 0, 102, 0.8)');
    });

    test.todo('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255, 0, 102, 0.8)');
    });
  });

  suite('p5.Color in HSL mode with HSL string', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL, 360, 100, 100, 1);
      c = mockP5Prototype.color('hsla(336, 100%, 50%, 0.8)');
    });

    test.todo('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
      // assert.deepEqual(c.color.coords, [336, 100, 50]);
      assert.equal(+c._color.coords[0], 336);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 50);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'hsla(336, 100%, 50%, 0.8)');
    });
  });

  suite('p5.Color in HSL mode with HSB string', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL, 360, 100, 100, 1);
      c = mockP5Prototype.color('hsba(336, 100%, 100%, 0.8)');
    });

    test.todo('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      // NOTE: 0.5.2 of color.js uses `new Number` which is corrected in future version
      // assert.deepEqual(c.color.coords, [336, 100, 50]);
      assert.equal(+c._color.coords[0], 336);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 100);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'hsba(336, 100%, 100%, 0.8)');
    });
  });

  suite('p5.Color in HSB mode', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      c = mockP5Prototype.color(336, 100, 100);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [336, 100, 100]);
      assert.equal(c._color.alpha, 1);
    });

    test('can be modified with alpha setter', function() {
      var cc = mockP5Prototype.color(336, 100, 100);
      cc.setAlpha(0.73);
      assert.deepEqual(cc._color.coords, [336, 100, 100]);
      assert.equal(cc._color.alpha, 0.73);
    });

    test('can be modified with rgb setters', function() {
      var cc = mockP5Prototype.color(336, 100, 100);
      assert.deepEqual(cc._color.coords, [336, 100, 100]);
      assert.equal(cc._color.alpha, 1);

      cc.setRed(98/255);
      assert.closeTo(cc._color.coords[0], 297, 1);
      assert.closeTo(cc._color.coords[1], 100, 1);
      assert.closeTo(cc._color.coords[2], 40, 1);
      assert.equal(cc._color.alpha, 1);

      cc.setGreen(44/255);
      assert.closeTo(cc._color.coords[0], 295, 1);
      assert.closeTo(cc._color.coords[1], 56, 1);
      assert.closeTo(cc._color.coords[2], 40, 1);
      assert.equal(cc._color.alpha, 1);

      cc.setBlue(244/255);
      assert.closeTo(cc._color.coords[0], 256, 1);
      assert.closeTo(cc._color.coords[1], 81, 1);
      assert.closeTo(cc._color.coords[2], 95, 1);
      assert.equal(cc._color.alpha, 1);
    });
  });

  suite('p5.Color in HSB mode with Alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      c = mockP5Prototype.color(336, 100, 100, 0.8);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c._color.coords, [336, 100, 100]);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly get hue/saturation/brightness/alpha', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });
  });

  suite('p5.Color in HSB mode with custom range', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB, 100, 200, 300, 10);
      c = mockP5Prototype.color(93.33, 200, 300, 8);
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.5);
    });

    test('should correctly convert to RGBA', function() {
      assert.closeTo(c._color.coords[0], 336, 1);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 100);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgb(100% 0% 40.02% / 0.8)');
    });
  });

  suite('p5.Color in HSB mode with RGB string', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB, 360, 100, 100, 1);
      c = mockP5Prototype.color('rgba(255, 0, 102, 0.8)');
    });

    test.todo('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c._color.coords, [1, 0, 0.4]);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255, 0, 102, 0.8)');
    });
  });

  suite('p5.Color in HSB mode with HSB string', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB, 360, 100, 100, 1);
      c = mockP5Prototype.color('hsba(336, 100%, 100%, 0.8)');
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.equal(+c._color.coords[0], 336);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 100);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'hsba(336, 100%, 100%, 0.8)');
    });
  });

  suite('p5.Color in HSB mode with HSL string', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB, 360, 100, 100, 1);
      c = mockP5Prototype.color('hsla(336, 100%, 50%, 0.8)');
    });

    test.todo('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.equal(+c._color.coords[0], 336);
      assert.equal(c._color.coords[1], 100);
      assert.equal(c._color.coords[2], 50);
      assert.equal(c._color.alpha, 0.8);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'hsla(336, 100%, 50%, 0.8)');
    });
  });

  suite('p5.Color in RGB mode with grayscale value', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
      c = mockP5Prototype.color(100);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c._color.coords, [100/255, 100/255, 100/255]);
      assert.equal(c._color.alpha, 1);
    });
  });

  suite('p5.Color in RGB mode with grayscale value and alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
      c = mockP5Prototype.color(100, 70);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c._color.coords, [100/255, 100/255, 100/255]);
      assert.equal(c._color.alpha, 70/255);
    });
  });

  suite('p5.Color in HSB mode with grayscale value', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      c = mockP5Prototype.color(39.3);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set color coordinates', function() {
      assert.deepEqual(c._color.coords, [0, 0, 39.3]);
      assert.equal(c._color.alpha, 1);
    });
  });

  suite('p5.Color in HSB mode with grayscale value and alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      c = mockP5Prototype.color(39.3, 0.275);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c._color.coords, [0, 0, 39.3]);
      assert.equal(c._color.alpha, 0.275);
    });
  });

  suite('p5.Color in HSL mode with grayscale value', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      c = mockP5Prototype.color(39.3);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c._color.coords, [0, 0, 39.3]);
      assert.equal(c._color.alpha, 1);
    });
  });

  suite('p5.Color in HSL mode with grayscale value and alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      c = mockP5Prototype.color(39.3, 0.275);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c._color.coords, [0, 0, 39.3]);
      assert.equal(c._color.alpha, 0.275);
    });
  });

  suite.todo('p5.Color.prototype.toString', function() {
    // var colorStr;

    // beforeEach(function() {
    //   mockP5Prototype.colorMode(mockP5Prototype.RGB, 255, 255, 255, 255);
    //   c = mockP5Prototype.color(128, 0, 128, 128);
    //   colorStr = c.toString();
    // });

    // NOTE: need some tests here
  });
});
