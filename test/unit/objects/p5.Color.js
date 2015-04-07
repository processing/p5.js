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

    suite('spot check', function() {
      test('numeric hex values', function() {
        c = myp5.color('#000');
        assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      });

      test('alphabetic hex values', function() {
        c = myp5.color('#fff');
        assert.deepEqual(c.rgba, [255, 255, 255, 255]);
      });

      test('alphanumeric hex values', function() {
        c = myp5.color('#f00');
        assert.deepEqual(c.rgba, [255, 0, 0, 255]);
        c = myp5.color('#f0e');
        assert.deepEqual(c.rgba, [255, 0, 238, 255]);
      });
    });

    test('invalid hex values resolve to white', function() {
      c = myp5.color('#cat');
      assert.deepEqual(c.rgba, [255, 255, 255, 255]);
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

    suite('spot check', function() {
      test('numeric hex values', function() {
        c = myp5.color('#123456');
        assert.deepEqual(c.rgba, [18, 52, 86, 255]);
      });

      test('alphabetic hex values', function() {
        c = myp5.color('#abcdef');
        assert.deepEqual(c.rgba, [171, 205, 239, 255]);
      });

      test('alphanumeric hex values', function() {
        c = myp5.color('#a1a1a1');
        assert.deepEqual(c.rgba, [161, 161, 161, 255]);
        c = myp5.color('#14ffa8');
        assert.deepEqual(c.rgba, [20, 255, 168, 255]);
      });
    });

    test('invalid hex values resolve to white', function() {
      c = myp5.color('#zzztop');
      assert.deepEqual(c.rgba, [255, 255, 255, 255]);
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

    test('spot check variant spacing', function() {
      // Exhaustive testing of spacing variations within RGB format is
      // prohibitive: spot check a set of representative values
      c = myp5.color('rgb(0,0,0)');
      assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      c = myp5.color('rgb(0,100 ,0)');
      assert.deepEqual(c.rgba, [0, 100, 0, 255]);
      c = myp5.color('rgb( 100,255,137)');
      assert.deepEqual(c.rgba, [100, 255, 137, 255]);
      c = myp5.color('rgb(0, 50,0)');
      assert.deepEqual(c.rgba, [0, 50, 0, 255]);
      c = myp5.color('rgb(0,100, 0)');
      assert.deepEqual(c.rgba, [0, 100, 0, 255]);
      c = myp5.color('rgb( 111, 255, 57)');
      assert.deepEqual(c.rgba, [111, 255, 57, 255]);
      c = myp5.color('rgb(40, 0, 0)');
      assert.deepEqual(c.rgba, [40, 0, 0, 255]);
      c = myp5.color('rgb(0,255, 10 )');
      assert.deepEqual(c.rgba, [0, 255, 10, 255]);
    });

    test('invalid RGB values resolve to white', function() {
      c = myp5.color('rgb(100.5, 40, 3)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal R value');
      c = myp5.color('rgb(100, 40.00009, 3)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal G value');
      c = myp5.color('rgb(100, 40, 3.14159265)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal B value');
      c = myp5.color('rgb(.9, 40, 3, 1.0)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal without leading 0');
      c = myp5.color('skip a beat');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'non-color strings');
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

    test('spot check variant spacing', function() {
      // Exhaustive testing of spacing variations within RGB format is
      // prohibitive: spot check a set of representative values
      c = myp5.color('rgb(100%,70%,100%)');
      assert.deepEqual(c.rgba, [255, 178, 255, 255]);
      c = myp5.color('rgb(0%,0%,0% )');
      assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      c = myp5.color('rgb(0%,50%  ,  0%)');
      assert.deepEqual(c.rgba, [0, 127, 0, 255]);
      c = myp5.color('rgb(10%, 50%,0%)');
      assert.deepEqual(c.rgba, [25, 127, 0, 255]);
      c = myp5.color('rgb(0%,48%, 0%)');
      assert.deepEqual(c.rgba, [0, 122, 0, 255]);
      c = myp5.color('rgb(0%,    0%, 40%)');
      assert.deepEqual(c.rgba, [0, 0, 102, 255]);
      c = myp5.color('rgb(0%,87%, 10%)');
      assert.deepEqual(c.rgba, [0, 221, 25, 255]);
    });

    test('spot check decimal percentage values', function() {
      // Percentage values in CSS <color> identifiers are floats 0.0%-100.0%
      c = myp5.color('rgb( 50%,100% ,.9%)');
      assert.deepEqual(c.rgba, [127, 255, 2, 255], 'B% without leading 0');
      c = myp5.color('rgb( 9.90%, 12%, 50%)');
      assert.deepEqual(c.rgba, [25, 30, 127, 255], 'decimal R%');
    });

    test('invalid percentage values default to white', function() {
      c = myp5.color('rgb(50, 100%, 100%');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'mixed percentage and non-percentage input');
      c = myp5.color('rgb(,0%,0%)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'missing values');
      c = myp5.color('rgb(A%,B%,C%)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'non-numeric percentages');
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

    test('spot check variant spacing', function() {
      // Exhaustive testing of spacing variations within RGBA format is
      // prohibitive: spot check a set of representative values
      c = myp5.color('rgba(255,255,255,1)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255]);
      c = myp5.color('rgba(0,0,0,1)');
      assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      c = myp5.color('rgba(0,100,0,   0.5)');
      assert.deepEqual(c.rgba, [0, 100, 0, 127]);
      c = myp5.color('rgba(  100,255 ,255, 0)');
      assert.deepEqual(c.rgba, [100, 255, 255, 0]);
      c = myp5.color('rgba(0, 0,255, 0.1515236)');
      assert.deepEqual(c.rgba, [0, 0, 255, 38]);
      c = myp5.color('rgba(100,101, 0, 0.75)');
      assert.deepEqual(c.rgba, [100, 101, 0, 191]);
      c = myp5.color('rgba( 255, 255, 255, .9)');
      assert.deepEqual(c.rgba, [255, 255, 255, 229]);
      c = myp5.color('rgba(0, 0, 0, 1)');
      assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      c = myp5.color('rgba(255,0, 10 , 0.33)');
      assert.deepEqual(c.rgba, [255, 0, 10, 84]);
    });

    test('invalid RGBA values resolve to white', function() {
      c = myp5.color('rgba(100.5, 40, 3, 1.0)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal R% value');
      c = myp5.color('rgba(100, 40.00009, 3, 1.0)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal G% value');
      c = myp5.color('rgba(100, 40, 3.14159265, 1.0)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal B% value');
      c = myp5.color('rgba(.9, 40, 3, 1.0)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'decimal R% without leading 0');
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

    test('spot check variant spacing', function() {
      // Exhaustive testing of spacing variations within RGBA format is
      // prohibitive: spot check a set of representative values
      c = myp5.color('rgba(100%,10.9%,100%,1)');
      assert.deepEqual(c.rgba, [255, 27, 255, 255]);
      c = myp5.color('rgba(37%,     0%,0%,1)');
      assert.deepEqual(c.rgba, [94, 0, 0, 255]);
      c = myp5.color('rgba(0%,50%,0%, 0.5)');
      assert.deepEqual(c.rgba, [0, 127, 0, 127]);
      c = myp5.color('rgba( 50%,.9% ,100%, 0)');
      assert.deepEqual(c.rgba, [127, 2, 255, 0]);
      c = myp5.color('rgba(10%, 50%,0%, 0.2515236)');
      assert.deepEqual(c.rgba, [25, 127, 0, 64]);
      c = myp5.color('rgba(0%,50%, 0%, 0.75)');
      assert.deepEqual(c.rgba, [0, 127, 0, 191]);
      c = myp5.color('rgba( 100%, 12%, 100%, .9)');
      assert.deepEqual(c.rgba, [255, 30, 255, 229]);
      c = myp5.color('rgba(0%, 0%, 0%, 1)');
      assert.deepEqual(c.rgba, [0, 0, 0, 255]);
      c = myp5.color('rgba(0%,87%, 10% , 0.3)');
      assert.deepEqual(c.rgba, [0, 221, 25, 76]);

    });

    test('spot check decimal percentage values', function() {
      // Percentage values in CSS <color> identifiers are floats 0.0%-100.0%
      c = myp5.color('rgba(90.5%, 40%, 3%, 0.45)');
      assert.deepEqual(c.rgba, [230, 102, 7, 114], 'Decimal A% value');
      c = myp5.color('rgba(90%, 40.00009%, 3%, 0.45)');
      assert.deepEqual(c.rgba, [229, 102, 7, 114], 'Decimal G% value');
      c = myp5.color('rgba(90%, 40%, 3.14159265%, 0.45)');
      assert.deepEqual(c.rgba, [229, 102, 8, 114], 'Decimal B% value');
      c = myp5.color('rgba(90%, 40%, .9%, 0.45)');
      assert.deepEqual(c.rgba, [229, 102, 2, 114], 'Decimal B% without leading 0');
    });

    test('invalid RGBA percentage values resolve to white', function() {
      c = myp5.color('rgb(50,100%,100%,1');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'mixed percentage and non-percentage input');
      c = myp5.color('rgb(A%,B%,C%,0.5)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'non-numeric percentages');
      c = myp5.color('rgba(,50%,20%,1)');
      assert.deepEqual(c.rgba, [255, 255, 255, 255], 'missing values');
    });
  });

  suite('p5.prototype.color("svgnamedcolor")', function() {
    setup(function() {
      c = myp5.color('papayawhip');
    });

    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [255, 239, 213, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [26, 42, 255, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 255);
      assert.equal(c.getGreen(), 239);
      assert.equal(c.getBlue(), 213);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 26);
      assert.equal(c.getSaturation(), 42);
      assert.equal(c.getBrightness(), 255);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(255,239,213,1)');
    });

    test('spot check color keywords', function() {
      c = myp5.color('red');
      assert.deepEqual(c.rgba, [255, 0, 0, 255]);
      c = myp5.color('magenta');
      assert.deepEqual(c.rgba, [255, 0, 255, 255]);
      c = myp5.color('limegreen');
      assert.deepEqual(c.rgba, [50, 205, 50, 255]);
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
});
