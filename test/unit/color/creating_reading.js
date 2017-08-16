suite('color/CreatingReading', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  var fromColor;
  var toColor;
  var c;
  var val;

  suite('p5.prototype.alpha', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
    });
    test('alpha(): no friendly-err-msg I', function() {
      assert.doesNotThrow(function() {
        var string = 'magenta';
        c = myp5.color(string);
        val = myp5.alpha(c);
        assert.equal(val, 255);
      },
        Error, 'got unwanted exception');
    });
    test('alpha(): no friendly-err-msg II', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('hsba(160, 100%, 50%, 0.5)');
        val = myp5.alpha(c);
        assert.equal(val, 127.5);
      },
        Error, 'got unwanted exception');
    });
    test('alpha(): wrong param type at #0', function() {
      assert.doesNotThrow(function() {
        c = 20;
        val = myp5.alpha(c);
      },
        Error, 'got unwanted exception');
    });
  });

  suite('p5.prototype.red, green, blue', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
    });
    test('red(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('hsl(126, 100%, 60%)');
        val = myp5.red(c);
        expect(Math.abs(val-51)).to.be.at.most(2); // max approx err 2
      },
        Error, 'got unwanted exception');
    });
    test('green(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('hsl(126, 100%, 60%)');
        val = myp5.green(c);
        assert.equal(val, 255);
      },
        Error, 'got unwanted exception');
    });
    test('blue(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('hsl(126, 100%, 60%)');
        val = myp5.blue(c);
        expect(Math.abs(val-70)).to.be.at.most(2); // max approx err 2
      },
        Error, 'got unwanted exception');
    });
  });

  suite('p5.prototype.hue, brightness, lightness, saturation', function() {
    setup(function() {
      myp5.colorMode(myp5.HSL);
    });
    test('hue(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('#7fffd4');
        val = myp5.hue(c);
        expect(Math.abs(val-160)).to.be.at.most(2); // max approx err 2
      },
        Error, 'got unwanted exception');
    });
    test('brightness(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('#7fffd4');
        val = myp5.brightness(c);
        assert.equal(val, 100);
      },
        Error, 'got unwanted exception');
    });
    test('lightness(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('#7fffd4');
        val = myp5.lightness(c);
        expect(Math.abs(val-75)).to.be.at.most(2); // max approx err 2
      },
        Error, 'got unwanted exception');
    });
    test('saturation(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
        c = myp5.color('#7fffd4');
        val = myp5.saturation(c);
        assert.equal(val, 100);
      },
        Error, 'got unwanted exception');
    });
  });

  suite('p5.prototype.lerpColor', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32);
      toColor = myp5.color(72, 61, 139);
    });
    test('should correctly get lerp colors in RGB', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [170, 131, 67, 255]);
      assert.deepEqual(interB.levels, [122, 96, 103, 255]);
    });
    test('should correctly get lerp colors in HSL', function() {
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [66, 190, 44, 255]);
      assert.deepEqual(interB.levels, [53, 164, 161, 255]);
    });
    test('should correctly get lerp colors in HSB', function() {
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [69, 192, 47, 255]);
      assert.deepEqual(interB.levels, [56, 166, 163, 255]);
    });
    test('should not extrapolate', function() {
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 255]);
      assert.deepEqual(interB.levels, [72, 61, 139, 255]);
    });
    test('lerpColor(): missing param #2', function() {
      assert.doesNotThrow(function() {
        myp5.lerpColor(fromColor, toColor);
      },
        Error, 'got unwanted exception');
    });
  });
  suite('p5.prototype.lerpColor with alpha', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32, 49);
      toColor = myp5.color(72, 61, 139, 200);
    });
    test('should correctly get lerp colors in RGB with alpha', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [170, 131, 67, 99]);
      assert.deepEqual(interB.levels, [122, 96, 103, 149]);
    });
    test('should correctly get lerp colors in HSL with alpha', function() {
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [66, 190, 44, 99]);
      assert.deepEqual(interB.levels, [53, 164, 161, 149]);
    });
    test('should correctly get lerp colors in HSB with alpha', function() {
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [69, 192, 47, 99]);
      assert.deepEqual(interB.levels, [56, 166, 163, 149]);
    });
    test('should not extrapolate', function() {
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 49]);
      assert.deepEqual(interB.levels, [72, 61, 139, 200]);
    });
  });
});
