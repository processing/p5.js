suite('color/Setting', function() {
  let myp5; // sketch without WEBGL Mode
  let my3D; // sketch with WEBGL mode
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
    new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        my3D = p;
      };
    });
    done();
  });

  teardown(function() {
    myp5.remove();
    my3D.remove();
  });

  suite('p5.prototype.erase', function() {
    test('should be a function', function() {
      assert.ok(myp5.erase);
    });

    test('should set renderer to erasing state', function() {
      myp5.erase();
      assert.isTrue(myp5._renderer._isErasing);
    });

    test('should cache renderer fill', function() {
      myp5.fill(255, 0, 0);
      const fillStyle = myp5.drawingContext.fillStyle;
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedFillStyle, fillStyle);
    });

    test('should cache renderer stroke', function() {
      myp5.stroke(255, 0, 0);
      const strokeStyle = myp5.drawingContext.strokeStyle;
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedStrokeStyle, strokeStyle);
    });

    test('should cache renderer blend', function() {
      myp5.blendMode(myp5.SCREEN);
      myp5.erase();
      assert.deepEqual(myp5._renderer._cachedBlendMode, myp5.SCREEN);
    });

    test('should set fill strength', function() {
      myp5.erase(125);
      assert.equal(
        myp5.color(myp5.drawingContext.fillStyle).array,
        myp5.color(255, 125).array
      );
    });

    test('should set stroke strength', function() {
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

    test('should cache renderer fill', function() {
      my3D.fill(255, 0, 0);
      const curFillColor = my3D._renderer.curFillColor;
      my3D.erase();
      assert.deepEqual(my3D._renderer._cachedFillStyle, curFillColor);
    });

    test('should cache renderer stroke', function() {
      my3D.stroke(255, 0, 0);
      const strokeStyle = my3D._renderer.curStrokeColor;
      my3D.erase();
      assert.deepEqual(my3D._renderer._cachedStrokeStyle, strokeStyle);
    });

    test('should cache renderer blend', function() {
      my3D.blendMode(my3D.SCREEN);
      my3D.erase();
      assert.deepEqual(my3D._renderer._cachedBlendMode, my3D.SCREEN);
    });

    test('should set fill strength', function() {
      my3D.erase(125);
      assert.deepEqual(my3D._renderer.curFillColor, [1, 1, 1, 125 / 255]);
    });

    test('should set stroke strength', function() {
      my3D.erase(255, 50);
      assert.deepEqual(my3D._renderer.curStrokeColor, [1, 1, 1, 50 / 255]);
    });

    test('should set default values when no arguments', function() {
      my3D.erase();
      assert.deepEqual(my3D._renderer.curFillColor, [1, 1, 1, 1]);
      assert.deepEqual(my3D._renderer.curStrokeColor, [1, 1, 1, 1]);
    });
  });

  suite('p5.prototype.noErase', function() {
    test('should be a function', function() {
      assert.ok(myp5.noErase);
    });

    test('should turn off renderer erasing state', function() {
      myp5.erase();
      myp5.noErase();
      assert.isFalse(myp5._renderer._isErasing);
    });

    test('should restore cached renderer fill', function() {
      myp5.fill(255, 0, 0);
      const fillStyle = myp5.drawingContext.fillStyle;
      myp5.erase();
      myp5.noErase();
      assert.deepEqual(myp5.drawingContext.fillStyle, fillStyle);
    });

    test('should restore cached renderer stroke', function() {
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

    test('should restore cached renderer fill', function() {
      my3D.fill(255, 0, 0);
      const fillStyle = my3D._renderer.curFillColor.slice();
      my3D.erase();
      my3D.noErase();
      assert.deepEqual([1, 0, 0, 1], fillStyle);
    });

    test('should restore cached renderer stroke', function() {
      my3D.stroke(255, 0, 0);
      const strokeStyle = my3D._renderer.curStrokeColor.slice();
      my3D.erase();
      my3D.noErase();
      assert.deepEqual([1, 0, 0, 1], strokeStyle);
    });
  });

  suite('p5.prototype.colorMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.colorMode);
    });

    test('should set mode to RGB', function() {
      myp5.colorMode(myp5.RGB);
      assert.equal(myp5._colorMode, myp5.RGB);
    });

    test('should correctly set color RGB maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [255, 255, 255, 255]);
      myp5.colorMode(myp5.RGB, 1, 1, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [1, 1, 1, 255]);
      myp5.colorMode(myp5.RGB, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [1, 1, 1, 1]);
      myp5.colorMode(myp5.RGB, 255, 255, 255, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [255, 255, 255, 1]);
      myp5.colorMode(myp5.RGB, 255);
    });

    test('should set mode to HSL', function() {
      myp5.colorMode(myp5.HSL);
      assert.equal(myp5._colorMode, myp5.HSL);
    });

    test('should correctly set color HSL maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
      myp5.colorMode(myp5.HSL, 255, 255, 255);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [255, 255, 255, 1]);
      myp5.colorMode(myp5.HSL, 360);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 360, 360, 360]);
      myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
    });

    test('should set mode to HSB', function() {
      myp5.colorMode(myp5.HSB);
      assert.equal(myp5._colorMode, myp5.HSB);
    });

    test('should correctly set color HSB maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
      myp5.colorMode(myp5.HSB, 255, 255, 255);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [255, 255, 255, 1]);
      myp5.colorMode(myp5.HSB, 360);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 360, 360, 360]);
      myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
    });
  });

  suite('p5.Color components', function() {
    test('setRed() correctly sets red component', function() {
      myp5.colorMode(myp5.RGB, 255);
      const c = myp5.color(0, 162, 205, 255);
      c.setRed(100);
      assert.equal(myp5.red(c), 100);
      assert.equal(myp5.green(c), 162);
      assert.equal(myp5.blue(c), 205);
      assert.equal(myp5.alpha(c), 255);
    });

    test('setGreen() correctly sets green component', function() {
      myp5.colorMode(myp5.RGB, 255);
      const c = myp5.color(0, 162, 205, 255);
      c.setGreen(100);
      assert.equal(myp5.red(c), 0);
      assert.equal(myp5.green(c), 100);
      assert.equal(myp5.blue(c), 205);
      assert.equal(myp5.alpha(c), 255);
    });

    test('setBlue() correctly sets blue component', function() {
      myp5.colorMode(myp5.RGB, 255);
      const c = myp5.color(0, 162, 205, 255);
      c.setBlue(100);
      assert.equal(myp5.red(c), 0);
      assert.equal(myp5.green(c), 162);
      assert.equal(myp5.blue(c), 100);
      assert.equal(myp5.alpha(c), 255);
    });

    test('setAlpha correctly sets alpha component', function() {
      myp5.colorMode(myp5.RGB, 255);
      const c = myp5.color(0, 162, 205, 255);
      c.setAlpha(100);
      assert.equal(myp5.red(c), 0);
      assert.equal(myp5.green(c), 162);
      assert.equal(myp5.blue(c), 205);
      assert.equal(myp5.alpha(c), 100);
    });

    test('changing the red/green/blue/alpha components should clear the cached HSL/HSB values', function() {
      myp5.colorMode(myp5.RGB, 255);
      const c = myp5.color(0, 162, 205, 255);

      // create HSL/HSB values
      myp5.lightness(c);
      myp5.brightness(c);
      c.setRed(100);
      assert(!c.hsba);
      assert(!c.hsla);

      myp5.lightness(c);
      myp5.brightness(c);
      c.setGreen(100);
      assert(!c.hsba);
      assert(!c.hsla);

      myp5.lightness(c);
      myp5.brightness(c);
      c.setBlue(100);
      assert(!c.hsba);
      assert(!c.hsla);

      myp5.lightness(c);
      myp5.brightness(c);
      c.setAlpha(100);
      assert(!c.hsba);
      assert(!c.hsla);
    });
  });
});
