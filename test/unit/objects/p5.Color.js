suite('p5.Color', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });
  var c;

  suite('p5.prototype.color(r,g,b)', function() {
    setup(function() {
      c = myp5.color(10, 20, 30);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [149, 170, 30, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 20);
      assert.equal(c.getBlue(), 30);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 149);
      assert.equal(c.getSaturation(), 170);
      assert.equal(c.getBrightness(), 30);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,20,30,1)');
    });
  });

  suite('p5.prototype.color("#rgb")', function() {
    setup(function() {
      c = myp5.color('#859');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [136, 85, 153, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [202, 113, 153, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 136);
      assert.equal(c.getGreen(), 85);
      assert.equal(c.getBlue(), 153);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 202);
      assert.equal(c.getSaturation(), 113);
      assert.equal(c.getBrightness(), 153);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(136,85,153,1)');
    });
  });

  suite('p5.prototype.color("#rrggbb")', function() {
    setup(function() {
      c = myp5.color('#0A508C');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 80, 140, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [147, 237, 140, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 80);
      assert.equal(c.getBlue(), 140);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 147);
      assert.equal(c.getSaturation(), 237);
      assert.equal(c.getBrightness(), 140);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,80,140,1)');
    });
  });

  suite('p5.prototype.color("rgb(r,g,b)")', function() {
    setup(function() {
      c = myp5.color('rgb(10,80,140)');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 80, 140, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [147, 237, 140, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 80);
      assert.equal(c.getBlue(), 140);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 147);
      assert.equal(c.getSaturation(), 237);
      assert.equal(c.getBrightness(), 140);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,80,140,1)');
    });
  });

  suite('p5.prototype.color("rgb(r%,g%,b%)")', function() {
    setup(function() {
      c = myp5.color('rgb(4%,31.5%,55%)');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 80, 140, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [147, 237, 140, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 80);
      assert.equal(c.getBlue(), 140);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 147);
      assert.equal(c.getSaturation(), 237);
      assert.equal(c.getBrightness(), 140);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,80,140,1)');
    });
  });

  suite('p5.prototype.color("rgba(r,g,b,a)")', function() {
    setup(function() {
      c = myp5.color('rgba(10,80,140,0.8)');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 80, 140, 204]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [147, 237, 140, 204] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 80);
      assert.equal(c.getBlue(), 140);
      assert.equal(c.getAlpha(), 204);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 147);
      assert.equal(c.getSaturation(), 237);
      assert.equal(c.getBrightness(), 140);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,80,140,0.8)');
    });
  });

  suite('p5.prototype.color("rgba(r%,g%,b%,a)")', function() {
    setup(function() {
      c = myp5.color('rgba(4%,31.5%,55%,0.6)');
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 80, 140, 153]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [147, 237, 140, 153] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 80);
      assert.equal(c.getBlue(), 140);
      assert.equal(c.getAlpha(), 153);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 147);
      assert.equal(c.getSaturation(), 237);
      assert.equal(c.getBrightness(), 140);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,80,140,0.6)');
    });
  });

  suite('p5.prototype.color(r,g,b,a)', function() {
    setup(function() {
      c = myp5.color(10, 20, 30, 51);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 51]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [149, 170, 30, 51] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 20);
      assert.equal(c.getBlue(), 30);
      assert.equal(c.getAlpha(), 51);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 149);
      assert.equal(c.getSaturation(), 170);
      assert.equal(c.getBrightness(), 30);
      assert.equal(c.getAlpha(), 51);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,20,30,0.2)');
    });
  });

  suite('p5.prototype.color([])', function() {
    setup(function() {
      c = myp5.color([10, 20, 30]);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });
  });

  suite('new p5.Color in HSB mode', function() {
    setup(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(149, 170, 30, 255);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [149, 170, 30, 255]);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,20,30,1)');
    });
  });

  suite('new p5.Color with Base 1 colors', function() {
    var base_1_rgba = [0.2, 0.4, 0.6, 0.5];
    var base_255_rgba = [51, 102, 153, 127.5];

    setup(function() {
      myp5.colorMode(myp5.RGB, 1);
      c = myp5.color.apply(myp5, base_1_rgba);
    });

    test('should correctly set RGBA', function() {
      assert.deepEqual(c.rgba, base_255_rgba);
    });

    test('should correctly convert to HSB', function() {
      assert.deepEqual(c.hsba, p5.ColorUtils.rgbaToHSBA(base_255_rgba));
    });

    test('should correctly set color string', function() {
      assert.equal(c.toString(), 'rgba(51,102,153,0.5)');
    });
  });

  suite('p5.Color._patterns', function() {

    it('CSS Color Regular Expression patterns object is defined', function() {
      assert.isObject(p5.Color._patterns);
    });

    suite('.HEX3', function() {
      var HEX3;

      setup(function() {
        HEX3 = p5.Color._patterns.HEX3;
      });

      test('should match Hex color codes of format #xxx', function() {
        assert.isTrue(HEX3.test('#000'), 'works for numeric hex values');
        assert.isTrue(HEX3.test('#fff'), 'works for letter hex values');
        assert.isTrue(HEX3.test('#f00'), 'works for alphanumeric hex values');
        assert.isTrue(HEX3.test('#f0e'), 'works for another alphanumeric value');
      });

      test('should parse out the component values', function() {
        var values = HEX3.exec('#f0a');
        assert.equal(values.join('|'), '#f0a|f|0|a');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(HEX3.test('#cat'), 'does not match invalid hex');
        assert.isFalse(HEX3.test('#000000'), 'does not match hex-6');
        assert.isFalse(HEX3.test('rgb(0,0,0)'), 'does not match rgb()');
        assert.isFalse(HEX3.test('orange'), 'does not match keywords');
      });

    });

    suite('.HEX6', function() {
      var HEX6;

      setup(function() {
        HEX6 = p5.Color._patterns.HEX6;
      });

      test('should match Hex color codes of format #RGB', function() {
        assert.isTrue(HEX6.test('#000000'), 'works for numeric hex values');
        assert.isTrue(HEX6.test('#ffffff'), 'works for alphabetic hex values');
        assert.isTrue(HEX6.test('#a1a1a1'), 'works for alphanumeric hex values');
        assert.isTrue(HEX6.test('#14ffa8'), 'works for another alphanumeric value');
      });

      test('should parse out the component values', function() {
        var values = HEX6.exec('#a3a1b9');
        assert.equal(values.join('|'), '#a3a1b9|a3|a1|b9');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(HEX6.test('#zzztop'), 'does not match invalid hex');
        assert.isFalse(HEX6.test('#000'), 'does not match hex-3');
        assert.isFalse(HEX6.test('rgb(0,0,0)'), 'does not match rgb()');
        assert.isFalse(HEX6.test('orange'), 'does not match keywords');
      });

    });

    suite('.RGB', function() {
      var RGB;

      setup(function() {
        RGB = p5.Color._patterns.RGB;
      });

      test('should match color strings of format rgb(R,G,B)', function() {
        // Exhaustive testing of spacing variations within RGB format is
        // prohibitive: spot check a set of representative values
        assert.isTrue(RGB.test('rgb(255,255,255)'));
        assert.isTrue(RGB.test('rgb(0,0,0)'));
        assert.isTrue(RGB.test('rgb(0,100 ,0)'));
        assert.isTrue(RGB.test('rgb( 100,255,255)'));
        assert.isTrue(RGB.test('rgb(0, 50,0)'));
        assert.isTrue(RGB.test('rgb(0,100, 0)'));
        assert.isTrue(RGB.test('rgb( 255, 255, 255)'));
        assert.isTrue(RGB.test('rgb(0, 0, 0)'));
        assert.isTrue(RGB.test('rgb(0,255, 10 )'));
      });

      test('should not match decimal R, G or B values', function() {
        assert.isFalse(RGB.test('rgb(100.5, 40, 3)'), 'decimal R value');
        assert.isFalse(RGB.test('rgb(100, 40.00009, 3)'), 'decimal G value');
        assert.isFalse(RGB.test('rgb(100, 40, 3.14159265)'), 'decimal B value');
        assert.isFalse(RGB.test('rgb(.9, 40, 3, 1.0)'), 'decimal without leading 0');
      });

      test('should parse out the component values', function() {
        var values = RGB.exec('rgb(139, 0, 138)');
        assert.equal(values.join('|'), 'rgb(139, 0, 138)|139|0|138');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(RGB.test('#000000'), 'does not match hex-6');
        assert.isFalse(RGB.test('rgba(0, 0, 0, 1)'), 'does not match rgba()');
        assert.isFalse(RGB.test('orange'), 'does not match keywords');
        assert.isFalse(RGB.test('skip a beat'), 'does not match non-color strings');
        assert.isFalse(RGB.test('rgba(,0,0)'), 'does not match missing values');
        assert.isFalse(RGB.test('rgba(0 0 100)'), 'does not match missing commas');
      });

    });

    suite('.RGB_PERCENT', function() {
      var RGB_PERCENT;

      setup(function() {
        RGB_PERCENT = p5.Color._patterns.RGB_PERCENT;
      });

      test('should match color strings of format rgb(R%,G%,B%)', function() {
        // Exhaustive testing of spacing variations within RGB format is
        // prohibitive: spot check a set of representative values
        assert.isTrue(RGB_PERCENT.test('rgb(100%,100%,100%)'));
        assert.isTrue(RGB_PERCENT.test('rgb(0%,0%,0% )'));
        assert.isTrue(RGB_PERCENT.test('rgb(0%,50%  ,  0%)'));
        assert.isTrue(RGB_PERCENT.test('rgb( 50%,100% ,.9%)'), 'B% without leading 0');
        assert.isTrue(RGB_PERCENT.test('rgb(10%, 50%,0%)'));
        assert.isTrue(RGB_PERCENT.test('rgb(0%,50%, 0%)'));
        assert.isTrue(RGB_PERCENT.test('rgb( 10.90%, 12%, 100%)'), 'decimal R%');
        assert.isTrue(RGB_PERCENT.test('rgb(0%, 0%, 0%)'));
        assert.isTrue(RGB_PERCENT.test('rgb(0%,87%, 10%)'));
      });

      test('should match decimal R, G or B values', function() {
        assert.isTrue(RGB_PERCENT.test('rgb(90.5%, 40%, 3%)'), 'decimal R value');
        assert.isTrue(RGB_PERCENT.test('rgb(90%, 40.00009%, 3%)'), 'decimal G value');
        assert.isTrue(RGB_PERCENT.test('rgb(90%, 40%, 3.14159265%)'), 'decimal B value');
        assert.isTrue(RGB_PERCENT.test('rgb(90%, 40%, .9%)'), 'decimal without leading 0');
      });

      test('should parse out the component values', function() {
        var values = RGB_PERCENT.exec('rgb(0%, 54%, 55%)');
        assert.equal(values.join('|'), 'rgb(0%, 54%, 55%)|0|54|55');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(RGB_PERCENT.test('#000000'), 'does not match hex-6');
        assert.isFalse(RGB_PERCENT.test('rgba(0, 0, 0, 1)'), 'does not match rgba()');
        assert.isFalse(RGB_PERCENT.test('orange'), 'does not match keyword');
        assert.isFalse(RGB_PERCENT.test('rgb(A%,B%,C%)'), 'does not match non-numeric percents');
        assert.isFalse(RGB_PERCENT.test('skip a beat'), 'does not match non-color strings');
        assert.isFalse(RGB_PERCENT.test('rgb(,0%,0%)'), 'does not match missing values');
        assert.isFalse(RGB_PERCENT.test('rgb(0% 0% 100%)'), 'does not match missing commas');
      });

    });

    suite('.RGBA', function() {
      var RGBA;

      setup(function() {
        RGBA = p5.Color._patterns.RGBA;
      });

      test('should match color strings of format rgba(R,G,B,A)', function() {
        // Exhaustive testing of spacing variations within RGBA format is
        // prohibitive: spot check a set of representative values
        assert.isTrue(RGBA.test('rgba(255,255,255,1)'), 'white');
        assert.isTrue(RGBA.test('rgba(0,0,0,1)'), 'black');
        assert.isTrue(RGBA.test('rgba(0,100,0, 0.5)'), 'transparent green');
        assert.isTrue(RGBA.test('rgba( 100,255 ,255, 0)'), 'transparent');
        assert.isTrue(RGBA.test('rgba(0, 0,255, 0.1515236)'), 'almost transparent blue');
        assert.isTrue(RGBA.test('rgba(100,100, 0, 0.75)'), 'translucent green-brown');
        assert.isTrue(RGBA.test('rgba( 255, 255, 255, .9)'), 'almost opaque white');
        assert.isTrue(RGBA.test('rgba(0, 0, 0, 1)'), 'black (spacing variant)');
        assert.isTrue(RGBA.test('rgba(255,0, 10 , 0.33)'), 'transparent pink');
      });

      test('should not match decimal R, G or B values', function() {
        assert.isFalse(RGBA.test('rgba(100.5, 40, 3, 1.0)'), 'decimal R value');
        assert.isFalse(RGBA.test('rgba(100, 40.00009, 3, 1.0)'), 'decimal G value');
        assert.isFalse(RGBA.test('rgba(100, 40, 3.14159265, 1.0)'), 'decimal B value');
        assert.isFalse(RGBA.test('rgba(.9, 40, 3, 1.0)'), 'decimal without leading 0');
      });

      test('should parse out the component values', function() {
        var values = RGBA.exec('rgba(139, 0, 138, 0.5)');
        assert.equal(values.join('|'), 'rgba(139, 0, 138, 0.5)|139|0|138|0.5');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(RGBA.test('#000000'), 'does not match hex-6');
        assert.isFalse(RGBA.test('rgb(0, 0, 0)'), 'does not match rgb()');
        assert.isFalse(RGBA.test('orange'), 'does not match keywords');
        assert.isFalse(RGBA.test('skip a beat'), 'does not match non-color strings');
        assert.isFalse(RGBA.test('rgba(,0,0,1)'), 'does not match missing values');
        assert.isFalse(RGBA.test('rgba(0 0 100 1)'), 'does not match missing commas');
      });

    });

    suite('.RGBA_PERCENT', function() {
      var RGBA_PERCENT;

      setup(function() {
        RGBA_PERCENT = p5.Color._patterns.RGBA_PERCENT;
      });

      test('should match color strings of format rgba(R%,G%,B%,A)', function() {
        // Exhaustive testing of spacing variations within RGBA format is
        // prohibitive: spot check a set of representative values
        assert.isTrue(RGBA_PERCENT.test('rgba(100%,10.9%,100%,1)'), 'decimal G%');
        assert.isTrue(RGBA_PERCENT.test('rgba(0%,0%,0%,1)'));
        assert.isTrue(RGBA_PERCENT.test('rgba(0%,50%,0%, 0.5)'));
        assert.isTrue(RGBA_PERCENT.test('rgba( 50%,.9% ,100%, 0)'), 'G% without leading 0');
        assert.isTrue(RGBA_PERCENT.test('rgba(10%, 50%,0%, 0.2515236)'));
        assert.isTrue(RGBA_PERCENT.test('rgba(0%,50%, 0%, 0.75)'));
        assert.isTrue(RGBA_PERCENT.test('rgba( 100%, 12%, 100%, .9)'), 'opacity without leading 0');
        assert.isTrue(RGBA_PERCENT.test('rgba(0%, 0%, 0%, 1)'));
        assert.isTrue(RGBA_PERCENT.test('rgba(0%,87%, 10% , 0.3)'));
      });

      test('should match decimal R, G or B values', function() {
        assert.isTrue(RGBA_PERCENT.test('rgba(90.5%, 40%, 3%, 0.45)'), 'decimal R value');
        assert.isTrue(RGBA_PERCENT.test('rgba(90%, 40.00009%, 3%, 0.45)'), 'decimal G value');
        assert.isTrue(RGBA_PERCENT.test('rgba(90%, 40%, 3.14159265%, 0.45)'), 'decimal B value');
        assert.isTrue(RGBA_PERCENT.test('rgba(90%, 40%, .9%, 0.45)'), 'decimal without leading 0');
      });

      test('should parse out the component values', function() {
        var values = RGBA_PERCENT.exec('rgba(0%, 54%, 55%, 0.5)');
        assert.equal(values.join('|'), 'rgba(0%, 54%, 55%, 0.5)|0|54|55|0.5');
      });

      test('should not match invalid formats or other strings', function() {
        assert.isFalse(RGBA_PERCENT.test('#000000'), 'does not match hex-6');
        assert.isFalse(RGBA_PERCENT.test('rgb(0, 0, 0)'), 'does not match rgb()');
        assert.isFalse(RGBA_PERCENT.test('orange'), 'does not match keywords');
        assert.isFalse(RGBA_PERCENT.test('rgba(A%,B%,C%,1)'), 'does not match non-numeric percents');
        assert.isFalse(RGBA_PERCENT.test('skip a beat'), 'does not match non-color strings');
        assert.isFalse(RGBA_PERCENT.test('rgba(,0%,0%,1)'), 'does not match missing values');
        assert.isFalse(RGBA_PERCENT.test('rgba(0% 0% 100%, 1)'), 'does not match missing commas');
      });

    });

  });
});
