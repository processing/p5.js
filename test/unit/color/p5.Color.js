import p5 from '../../../src/app.js';

suite('p5.Color', function() {
  var myp5;

  beforeEach(async function() {
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
  });

  var c;

  suite('p5.prototype.color(r,g,b)', function() {
    beforeEach(function() {
      c = myp5.color(255, 0, 102);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.color.coords, [1, 0, 0.4]);
      assert.equal(c.color.alpha, 1);
    });
  });

  suite('p5.prototype.color(r,g,b,a)', function() {
    beforeEach(function() {
      c = myp5.color(255, 0, 102, 204);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.color.coords, [1, 0, 0.4]);
      assert.equal(c.color.alpha, 0.8);
    });
  });

  // NOTE: suite for all signatures

  suite('p5.prototype.color(string)', function(){
    suite('#rgb', function(){
      beforeEach(function() {
        c = myp5.color('#f06');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('#rgba', function(){
      beforeEach(function() {
        c = myp5.color('#f066');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 0.4);
      });
    });

    suite('#rrggbb', function(){
      beforeEach(function() {
        c = myp5.color('#ff0066');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('#rrggbbaa', function(){
      beforeEach(function() {
        c = myp5.color('#f01dab1e');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [240, 29, 171].map(c => c/255));
        assert.equal(c.color.alpha, 30/255);
      });
    });

    suite('rgb(r,g,b)', function(){
      beforeEach(function() {
        c = myp5.color('rgb(255,0,102)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('rgb(r%,g%,b%)', function(){
      beforeEach(function() {
        c = myp5.color('rgb(100%, 0%, 40%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('rgba(r,g,b,a)', function(){
      beforeEach(function() {
        c = myp5.color('rgba(255,0,102,0.8)');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 0.8);
      });
    });

    suite('rgba(r%,g%,b%,a)', function(){
      beforeEach(function() {
        c = myp5.color('rgba(100.0%,0.0%,40%,0.8)');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 0.8);
      });
    });

    suite('hsl(h, s%, l%)', function(){
      beforeEach(function() {
        c = myp5.color('hsl(336, 100%, 50%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });
      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('hsla(h, s%, l%, a)', function() {
      beforeEach(function() {
        c = myp5.color('hsla(336, 100%, 50%, 0.8)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });
      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 0.8);
      });
    });

    suite('hsb(h, s%, b%)', function() {
      beforeEach(function() {
        c = myp5.color('hsb(336, 100%, 100%)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });
      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 1);
      });
    });

    suite('hsba(h, s%, b%, a)', function() {
      beforeEach(function() {
        c = myp5.color('hsba(336, 100%, 100%, 0.8)');
      });
      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });
      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [1, 0, 0.4]);
        assert.equal(c.color.alpha, 0.8);
      });
    });

    suite('named colors', function() {
      beforeEach(function() {
        c = myp5.color('papayawhip');
      });

      test('should create instance of p5.Color', function() {
        assert.instanceOf(c, p5.Color);
      });

      test('should correctly set RGBA property', function() {
        assert.deepEqual(c.color.coords, [255, 239, 213].map(c => c/255));
        assert.equal(c.color.alpha, 1);
      });
    });

    // NOTE: previously returns a white color
    suite('invalid string');
  });

  suite('p5.prototype.color([])', function() {
    beforeEach(function() {
      c = myp5.color([255, 0, 102]);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.color.coords, [1, 0, 0.4]);
      assert.equal(c.color.alpha, 1);
    });
  });

  // color level setters
  suite('in default mode', function() {
    test('can be modified with alpha setter', function() {
      var cc = myp5.color(255, 0, 102, 204);
      assert.deepEqual(cc.levels, [255, 0, 102, 204]);
      cc.setAlpha(98);
      assert.deepEqual(cc.levels, [255, 0, 102, 98]);
    });
    test('can be modified with rgb setters', function() {
      var cc = myp5.color(255, 0, 102, 204);
      assert.deepEqual(cc.levels, [255, 0, 102, 204]);
      cc.setRed(98);
      assert.deepEqual(cc.levels, [98, 0, 102, 204]);
      cc.setGreen(44);
      assert.deepEqual(cc.levels, [98, 44, 102, 204]);
      cc.setBlue(244);
      assert.deepEqual(cc.levels, [98, 44, 244, 204]);
    });
  });

  // Color Mode
  suite('p5.Color in RGB mode with custom range', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB, 1);
      c = myp5.color(1, 0, 0.4, 0.8);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly get RGBA property', function() {
      assert.equal(c._getRed(), 1);
      assert.equal(c._getGreen(), 0);
      assert.equal(c._getBlue(), 0.4);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });

    test('should correctly get RGBA property after overwrite', function() {
      myp5.colorMode(myp5.RGB, 255, 255, 255, 255);
      assert.equal(c._getRed(), 255);
      assert.equal(c._getGreen(), 0);
      assert.equal(c._getBlue(), 102);
      assert.equal(c._getAlpha(), 204);
    });
  });

  suite('p5.Color in HSL mode', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL);
      c = myp5.color(336, 100, 50);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 255]);
    });
    test('can be modified with alpha setter', function() {
      var cc = myp5.color(336, 100, 50);
      cc.setAlpha(0.73);
      assert.deepEqual(cc.levels, [255, 0, 102, 186]);
    });
    test('can be modified with rgb setters', function() {
      var cc = myp5.color(336, 100, 50);
      assert.deepEqual(cc.levels, [255, 0, 102, 255]);
      cc.setRed(98);
      assert.deepEqual(cc.levels, [98, 0, 102, 255]);
      cc.setGreen(44);
      assert.deepEqual(cc.levels, [98, 44, 102, 255]);
      cc.setBlue(244);
      assert.deepEqual(cc.levels, [98, 44, 244, 255]);
    });
  });

  suite('p5.Color in HSL mode with Alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL);
      c = myp5.color(336, 100, 50, 0.8);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
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
      myp5.colorMode(myp5.HSL, 100, 200, 300, 10);
      c = myp5.color(93.33, 200, 150, 8);
    });

    test('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 93, 0.5);
      assert.approximately(c._getSaturation(), 200, 0.5);
      assert.approximately(c._getLightness(), 150, 0.5);
      assert.approximately(c._getAlpha(), 8, 0.5);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });

    test('can be modified with alpha setter', function() {
      var cc = myp5.color(93.33, 200, 150, 8);
      cc.setAlpha(7.3);
      assert.deepEqual(cc.levels, [255, 0, 102, 186]);
    });
    test('can be modified with rgb setters', function() {
      var cc = myp5.color(93.33, 200, 150, 8);
      assert.deepEqual(cc.levels, [255, 0, 102, 204]);
      cc.setRed(98);
      assert.deepEqual(cc.levels, [98, 0, 102, 204]);
      cc.setGreen(44);
      assert.deepEqual(cc.levels, [98, 44, 102, 204]);
      cc.setBlue(244);
      assert.deepEqual(cc.levels, [98, 44, 244, 204]);
    });
  });

  suite('p5.Color in HSL mode with RGB string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
      c = myp5.color('rgba(255, 0, 102, 0.8)');
    });

    test('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSL mode with HSL string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
      c = myp5.color('hsla(336, 100%, 50%, 0.8)');
    });

    test('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSL mode with HSB string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
      c = myp5.color('hsba(336, 100%, 100%, 0.8)');
    });

    test('should correctly get HSLA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getLightness(), 50, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSB mode', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(336, 100, 100);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 255]);
    });
    test('can be modified with alpha setter', function() {
      var cc = myp5.color(336, 100, 100);
      cc.setAlpha(0.73);
      assert.deepEqual(cc.levels, [255, 0, 102, 186]);
    });
    test('can be modified with rgb setters', function() {
      var cc = myp5.color(336, 100, 100);
      assert.deepEqual(cc.levels, [255, 0, 102, 255]);
      cc.setRed(98);
      assert.deepEqual(cc.levels, [98, 0, 102, 255]);
      cc.setGreen(44);
      assert.deepEqual(cc.levels, [98, 44, 102, 255]);
      cc.setBlue(244);
      assert.deepEqual(cc.levels, [98, 44, 244, 255]);
    });
  });

  suite('p5.Color in HSB mode with Alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(336, 100, 100, 0.8);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
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
      myp5.colorMode(myp5.HSB, 100, 200, 300, 10);
      c = myp5.color(93.33, 200, 300, 8);
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 93, 0.5);
      assert.approximately(c._getSaturation(), 200, 0.5);
      assert.approximately(c._getBrightness(), 300, 0.5);
      assert.approximately(c._getAlpha(), 8, 0.5);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSB mode with RGB string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
      c = myp5.color('rgba(255, 0, 102, 0.8)');
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSB mode with HSB string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
      c = myp5.color('hsba(336, 100%, 100%, 0.8)');
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in HSB mode with HSL string', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
      c = myp5.color('hsla(336, 100%, 50%, 0.8)');
    });

    test('should correctly get HSBA property', function() {
      assert.approximately(c._getHue(), 336, 0.5);
      assert.approximately(c._getSaturation(), 100, 0.5);
      assert.approximately(c._getBrightness(), 100, 0.5);
      assert.approximately(c._getAlpha(), 0.8, 0.05);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.levels, [255, 0, 102, 204]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,0,102,0.8)');
    });
  });

  suite('p5.Color in RGB mode with grayscale value', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
      c = myp5.color(100);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 255]);
    });
  });

  suite('p5.Color in RGB mode with grayscale value and alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
      c = myp5.color(100, 70);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 70]);
    });
  });

  suite('p5.Color in HSB mode with grayscale value', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(39.3);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 255]);
    });
  });

  suite('p5.Color in HSB mode with grayscale value and alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(39.3, 0.275);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 70]);
    });
  });

  suite('p5.Color in HSL mode with grayscale value', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL);
      c = myp5.color(39.3);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 255]);
    });
  });

  suite('p5.Color in HSL mode with grayscale value and alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL);
      c = myp5.color(39.3, 0.275);
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGB levels', function() {
      assert.deepEqual(c.levels, [100, 100, 100, 70]);
    });
  });

  suite('p5.Color.prototype.toString', function() {
    var colorStr;

    beforeEach(function() {
      myp5.colorMode(myp5.RGB, 255, 255, 255, 255);
      c = myp5.color(128, 0, 128, 128);
      colorStr = c.toString();
    });

    // NOTE: need some tests here
  });
});
