suite('p5.RendererGL', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {};
      p.draw = function() {};
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('createCanvas(w, h, WEBGL)', function() {
    test('creates a p5.RendererGL renderer', function() {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      assert.instanceOf(myp5._renderer, p5.RendererGL);
    });
  });

  suite('default stroke shader', function() {
    test('check activate and deactivating fill and stroke', function(done) {
      myp5.noStroke();
      assert(
        !myp5._renderer._doStroke,
        'stroke shader still active after noStroke()'
      );
      assert.isTrue(
        myp5._renderer._doFill,
        'fill shader deactivated by noStroke()'
      );
      myp5.stroke(0);
      myp5.noFill();
      assert(
        myp5._renderer._doStroke,
        'stroke shader not active after stroke()'
      );
      assert.isTrue(
        !myp5._renderer._doFill,
        'fill shader still active after noFill()'
      );
      done();
    });
  });

  suite('push() and pop() work in WEBGL Mode', function() {
    test('push/pop and translation works as expected in WEBGL Mode', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      var modelView = myp5._renderer.uMVMatrix.copy();
      myp5.push();
      myp5.rotateX(Math.random(0, 100));
      myp5.translate(20, 100, 5);
      assert.notEqual(modelView.mat4, myp5._renderer.uMVMatrix.mat4);
      myp5.pop();
      assert.deepEqual(modelView.mat4, myp5._renderer.uMVMatrix.mat4);
      done();
    });

    test('push/pop and directionalLight() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      var dirColors = myp5._renderer.directionalLightColors.slice();
      var dirLightDirections = myp5._renderer.directionalLightDirections.slice();
      myp5.push();
      myp5.directionalLight(0, 0, 255, 0, 10, 5);
      assert.notEqual(dirColors, myp5._renderer.directionalLightColors);
      assert.notEqual(
        dirLightDirections,
        myp5._renderer.directionalLightDirections
      );
      myp5.pop();
      assert.deepEqual(dirColors, myp5._renderer.directionalLightColors);
      assert.deepEqual(
        dirLightDirections,
        myp5._renderer.directionalLightDirections
      );
      done();
    });

    test('push/pop and ambientLight() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.ambientLight(100, 0, 100);
      myp5.ambientLight(0, 0, 200);
      var ambColors = myp5._renderer.ambientLightColors.slice();
      myp5.push();
      myp5.ambientLight(0, 0, 0);
      assert.notEqual(ambColors, myp5._renderer.ambientLightColors);
      myp5.pop();
      assert.deepEqual(ambColors, myp5._renderer.ambientLightColors);
      done();
    });

    test('push/pop and pointLight() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.pointLight(255, 0, 0, 0, 0, 0);
      var pointColors = myp5._renderer.pointLightColors.slice();
      var pointLocs = myp5._renderer.pointLightPositions.slice();
      myp5.push();
      myp5.pointLight(0, 0, 255, 0, 10, 5);
      assert.notEqual(pointColors, myp5._renderer.pointLightColors);
      assert.notEqual(pointLocs, myp5._renderer.pointLightPositions);
      myp5.pop();
      assert.deepEqual(pointColors, myp5._renderer.pointLightColors);
      assert.deepEqual(pointLocs, myp5._renderer.pointLightPositions);
      done();
    });

    test('push/pop and pointLight() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.pointLight(255, 0, 0, 0, 0, 0);
      var pointColors = myp5._renderer.pointLightColors.slice();
      var pointLocs = myp5._renderer.pointLightPositions.slice();
      myp5.push();
      myp5.pointLight(0, 0, 255, 0, 10, 5);
      assert.notEqual(pointColors, myp5._renderer.pointLightColors);
      assert.notEqual(pointLocs, myp5._renderer.pointLightPositions);
      myp5.pop();
      assert.deepEqual(pointColors, myp5._renderer.pointLightColors);
      assert.deepEqual(pointLocs, myp5._renderer.pointLightPositions);
      done();
    });

    test('push/pop and texture() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      var tex1 = myp5.createGraphics(1, 1);
      myp5.texture(tex1);
      assert.equal(tex1, myp5._renderer._tex);
      myp5.push();
      var tex2 = myp5.createGraphics(2, 2);
      myp5.texture(tex2);
      assert.equal(tex2, myp5._renderer._tex);
      assert.notEqual(tex1, myp5._renderer._tex);
      myp5.pop();
      assert.equal(tex1, myp5._renderer._tex);
      done();
    });

    test('push/pop and shader() works with fill', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      var fillShader1 = myp5._renderer._getLightShader();
      var fillShader2 = myp5._renderer._getColorShader();
      myp5.shader(fillShader1);
      assert.equal(fillShader1, myp5._renderer.userFillShader);
      myp5.push();
      myp5.shader(fillShader2);
      assert.equal(fillShader2, myp5._renderer.userFillShader);
      assert.notEqual(fillShader1, myp5._renderer.userFillShader);
      myp5.pop();
      assert.equal(fillShader1, myp5._renderer.userFillShader);
      done();
    });

    test('push/pop builds/unbuilds stack properly', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      var col1 = myp5.color(255, 0, 0);
      var col2 = myp5.color(0, 255, 0);
      for (var i = 0; i < 10; i++) {
        myp5.push();
        if (i % 2 === 0) {
          myp5.fill(col1);
        } else {
          myp5.fill(col2);
        }
      }
      for (var j = i; j > 0; j--) {
        if (j % 2 === 0) {
          assert.deepEqual(col2._array, myp5._renderer.curFillColor);
        } else {
          assert.deepEqual(col1._array, myp5._renderer.curFillColor);
        }
        myp5.pop();
      }
      assert.isTrue(myp5._styles.length === 0);
      done();
    });
  });

  suite('loadpixels()', function() {
    test('loadPixels color check', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.background(0, 100, 0);
      myp5.loadPixels();
      var pixels = myp5.pixels;
      assert.deepEqual(pixels[1], 100);
      assert.deepEqual(pixels[3], 255);
      done();
    });

    test('get() singlePixel color and size, with loadPixels', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.background(100, 115, 100);
      myp5.loadPixels();
      var img = myp5.get(0, 0);
      assert.isTrue(img[1] === 115);
      assert.isTrue(img.length === 4);
      done();
    });
  });

  suite('get()', function() {
    var img;
    test('get() size check', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      img = myp5.get();
      assert.deepEqual(img.width, myp5.width);
      done();
    });

    test('get() can create p5.Image', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      assert.isTrue(img instanceof p5.Image);
      done();
    });

    test('get() singlePixel color and size', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.background(100, 115, 100);
      img = myp5.get(0, 0);
      assert.isTrue(img[1] === 115);
      assert.isTrue(img.length === 4);
      myp5.loadPixels();
      img = myp5.get(0, 0);
      assert.isTrue(img[1] === 115);
      assert.isTrue(img.length === 4);
      done();
    });
  });

  suite('blendMode()', function() {
    var testBlend = function(mode, intended) {
      myp5.blendMode(mode);
      assert.deepEqual(intended, myp5._renderer.curBlendMode);
    };

    test('blendMode sets _curBlendMode correctly', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      testBlend(myp5.ADD, myp5.ADD);
      testBlend(myp5.REPLACE, myp5.REPLACE);
      testBlend(myp5.SUBTRACT, myp5.SUBTRACT);
      testBlend(myp5.SCREEN, myp5.SCREEN);
      testBlend(myp5.EXCLUSION, myp5.EXCLUSION);
      testBlend(myp5.MULTIPLY, myp5.MULTIPLY);
      testBlend(myp5.LIGHTEST, myp5.LIGHTEST);
      testBlend(myp5.DARKEST, myp5.DARKEST);
      done();
    });

    test('blendMode doesnt change when mode unavailable in 3D', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.blendMode(myp5.DARKEST);
      testBlend(myp5.BURN, myp5.DARKEST);
      testBlend(myp5.DODGE, myp5.DARKEST);
      testBlend(myp5.SOFT_LIGHT, myp5.DARKEST);
      testBlend(myp5.HARD_LIGHT, myp5.DARKEST);
      testBlend(myp5.OVERLAY, myp5.DARKEST);
      done();
    });

    var mixAndReturn = function(mode, bgCol) {
      myp5.background(bgCol);
      myp5.blendMode(mode);
      myp5.fill(255, 0, 0, 122);
      myp5.plane(10);
      myp5.fill(0, 0, 255, 122);
      myp5.plane(10);
      return myp5.get(5, 5);
    };

    test('blendModes change pixel colors as expected', function(done) {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.noStroke();
      assert.deepEqual([133, 69, 191, 255], mixAndReturn(myp5.ADD, 255));
      assert.deepEqual([0, 0, 255, 255], mixAndReturn(myp5.REPLACE, 255));
      assert.deepEqual([133, 255, 133, 255], mixAndReturn(myp5.SUBTRACT, 255));
      assert.deepEqual([255, 0, 255, 255], mixAndReturn(myp5.SCREEN, 0));
      assert.deepEqual([0, 255, 0, 255], mixAndReturn(myp5.EXCLUSION, 255));
      assert.deepEqual([0, 0, 0, 255], mixAndReturn(myp5.MULTIPLY, 255));
      assert.deepEqual([255, 0, 255, 255], mixAndReturn(myp5.LIGHTEST, 0));
      assert.deepEqual([0, 0, 0, 255], mixAndReturn(myp5.DARKEST, 255));
      done();
    });
  });
});
