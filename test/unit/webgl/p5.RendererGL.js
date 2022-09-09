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
      var dirDiffuseColors = myp5._renderer.directionalLightDiffuseColors.slice();
      var dirSpecularColors = myp5._renderer.directionalLightSpecularColors.slice();
      var dirLightDirections = myp5._renderer.directionalLightDirections.slice();
      myp5.push();
      myp5.directionalLight(0, 0, 255, 0, 10, 5);
      assert.notEqual(
        dirDiffuseColors,
        myp5._renderer.directionalLightDiffuseColors
      );
      assert.notEqual(
        dirSpecularColors,
        myp5._renderer.directionalLightSpecularColors
      );
      assert.notEqual(
        dirLightDirections,
        myp5._renderer.directionalLightDirections
      );
      myp5.pop();
      assert.deepEqual(
        dirDiffuseColors,
        myp5._renderer.directionalLightDiffuseColors
      );
      assert.deepEqual(
        dirSpecularColors,
        myp5._renderer.directionalLightSpecularColors
      );
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
      var pointDiffuseColors = myp5._renderer.pointLightDiffuseColors.slice();
      var pointSpecularColors = myp5._renderer.pointLightSpecularColors.slice();
      var pointLocs = myp5._renderer.pointLightPositions.slice();
      myp5.push();
      myp5.pointLight(0, 0, 255, 0, 10, 5);
      assert.notEqual(
        pointDiffuseColors,
        myp5._renderer.pointLightDiffuseColors
      );
      assert.notEqual(
        pointSpecularColors,
        myp5._renderer.pointLightSpecularColors
      );
      assert.notEqual(pointLocs, myp5._renderer.pointLightPositions);
      myp5.pop();
      assert.deepEqual(
        pointDiffuseColors,
        myp5._renderer.pointLightDiffuseColors
      );
      assert.deepEqual(
        pointSpecularColors,
        myp5._renderer.pointLightSpecularColors
      );
      assert.deepEqual(pointLocs, myp5._renderer.pointLightPositions);
      done();
    });

    test('push/pop and specularColor() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.specularColor(255, 0, 0);
      var specularColors = myp5._renderer.specularColors.slice();
      myp5.push();
      myp5.specularColor(0, 0, 255);
      assert.notEqual(specularColors, myp5._renderer.specularColors);
      myp5.pop();
      assert.deepEqual(specularColors, myp5._renderer.specularColors);
      done();
    });

    test('push/pop and spotLight() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.spotLight(255, 0, 255, 1, 2, 3, 0, 1, 0, Math.PI / 4, 7);
      let spotLightDiffuseColors = myp5._renderer.spotLightDiffuseColors.slice();
      let spotLightSpecularColors = myp5._renderer.spotLightSpecularColors.slice();
      let spotLightPositions = myp5._renderer.spotLightPositions.slice();
      let spotLightDirections = myp5._renderer.spotLightDirections.slice();
      let spotLightAngle = myp5._renderer.spotLightAngle.slice();
      let spotLightConc = myp5._renderer.spotLightConc.slice();
      myp5.push();
      myp5.spotLight(255, 0, 0, 2, 2, 3, 1, 0, 0, Math.PI / 3, 8);
      assert.notEqual(
        spotLightDiffuseColors,
        myp5._renderer.spotLightDiffuseColors
      );
      assert.notEqual(
        spotLightSpecularColors,
        myp5._renderer.spotLightSpecularColors
      );
      assert.notEqual(spotLightPositions, myp5._renderer.spotLightPositions);
      assert.notEqual(spotLightDirections, myp5._renderer.spotLightDirections);
      assert.notEqual(spotLightAngle, myp5._renderer.spotLightAngle);
      assert.notEqual(spotLightConc, myp5._renderer.spotLightConc);
      myp5.pop();
      assert.deepEqual(
        spotLightDiffuseColors,
        myp5._renderer.spotLightDiffuseColors
      );
      assert.deepEqual(
        spotLightSpecularColors,
        myp5._renderer.spotLightSpecularColors
      );
      assert.deepEqual(spotLightPositions, myp5._renderer.spotLightPositions);
      assert.deepEqual(spotLightDirections, myp5._renderer.spotLightDirections);
      assert.deepEqual(spotLightAngle, myp5._renderer.spotLightAngle);
      assert.deepEqual(spotLightConc, myp5._renderer.spotLightConc);
      done();
    });

    test('push/pop and noLights() works', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.ambientLight(0, 0, 200);
      var ambColors = myp5._renderer.ambientLightColors.slice();
      myp5.push();
      myp5.ambientLight(0, 200, 0);
      var ambPopColors = myp5._renderer.ambientLightColors.slice();
      myp5.noLights();
      assert.notEqual(ambColors, myp5._renderer.ambientLightColors);
      assert.notEqual(ambPopColors, myp5._renderer.ambientLightColors);
      myp5.pop();
      assert.deepEqual(ambColors, myp5._renderer.ambientLightColors);
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

  suite('GL Renderer clear()', function() {
    var pg;
    var pixel;
    test('webgl graphics background draws into webgl canvas', function(done) {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      myp5.background(0, 255, 255, 255);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      pg.background(0);
      myp5.image(pg, -myp5.width / 2, -myp5.height / 2);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [0, 0, 0, 255]);
      done();
    });

    test('transparent GL graphics with GL canvas', function(done) {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      myp5.background(0, 255, 255);
      pg.clear();
      myp5.image(pg, -myp5.width / 2, -myp5.height / 2);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [0, 0, 0, 255]);
      done();
    });

    test('clear color with rgba arguments', function(done) {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      myp5.clear(1, 0, 0, 1);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [255, 0, 0, 255]);
      pg = myp5.createGraphics(50, 50, myp5.WEBGL);
      pg.clear(1, 0, 0, 1);
      pixel = pg.get(0, 0);
      assert.deepEqual(pixel, [255, 0, 0, 255]);
      done();
    });

    test('semi-transparent GL graphics with GL canvas', function(done) {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      myp5.background(0, 255, 255);
      pg.background(100, 100, 100, 100);
      myp5.image(pg, -myp5.width / 2, -myp5.height / 2);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [100, 100, 100, 255]);
      done();
    });

    test('webgl graphics background draws into 2D canvas', function(done) {
      myp5.createCanvas(50, 50);
      myp5.background(0, 255, 255, 255);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      pg.background(0);
      myp5.image(pg, 0, 0);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [0, 0, 0, 255]);
      done();
    });

    test('transparent GL graphics with 2D canvas', function(done) {
      myp5.createCanvas(50, 50);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      myp5.background(0, 255, 255);
      pg.clear();
      myp5.image(pg, 0, 0);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [0, 0, 0, 255]);
      done();
    });

    test('semi-transparent GL graphics with 2D canvas', function(done) {
      myp5.createCanvas(50, 50);
      pg = myp5.createGraphics(25, 50, myp5.WEBGL);
      myp5.background(0, 255, 255);
      pg.background(100, 100, 100, 100);
      myp5.image(pg, 0, 0);
      pixel = myp5.get(0, 0);
      assert.deepEqual(pixel, [100, 100, 100, 255]);
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
      assert.deepEqual([122, 0, 122, 255], mixAndReturn(myp5.ADD, 0));
      assert.deepEqual([0, 0, 255, 255], mixAndReturn(myp5.REPLACE, 255));
      assert.deepEqual([133, 255, 133, 255], mixAndReturn(myp5.SUBTRACT, 255));
      assert.deepEqual([255, 0, 255, 255], mixAndReturn(myp5.SCREEN, 0));
      assert.deepEqual([0, 255, 0, 255], mixAndReturn(myp5.EXCLUSION, 255));
      assert.deepEqual([0, 0, 0, 255], mixAndReturn(myp5.MULTIPLY, 255));
      assert.deepEqual([255, 0, 255, 255], mixAndReturn(myp5.LIGHTEST, 0));
      assert.deepEqual([0, 0, 0, 255], mixAndReturn(myp5.DARKEST, 255));
      done();
    });

    test('blendModes match 2D mode', function(done) {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.setAttributes({ alpha: true });
      const ref = myp5.createGraphics(myp5.width, myp5.height);
      ref.translate(ref.width / 2, ref.height / 2); // Match WebGL mode

      const testBlend = function(target, colorA, colorB, mode) {
        target.clear();
        target.push();
        target.background(colorA);
        target.blendMode(mode);
        target.noStroke();
        target.fill(colorB);
        target.rectMode(target.CENTER);
        target.rect(0, 0, target.width, target.height);
        target.pop();
        return target.get(0, 0);
      };

      const assertSameIn2D = function(colorA, colorB, mode) {
        const refColor = testBlend(myp5, colorA, colorB, mode);
        const webglColor = testBlend(ref, colorA, colorB, mode);
        if (refColor[3] === 0) {
          assert.equal(webglColor[3], 0);
        } else {
          assert.deepEqual(
            refColor,
            webglColor,
            `Blending ${colorA} with ${colorB} using ${mode}`
          );
        }
      };

      const red = '#F53';
      const blue = '#13F';
      assertSameIn2D(red, blue, myp5.BLEND);
      assertSameIn2D(red, blue, myp5.ADD);
      assertSameIn2D(red, blue, myp5.DARKEST);
      assertSameIn2D(red, blue, myp5.LIGHTEST);
      assertSameIn2D(red, blue, myp5.EXCLUSION);
      assertSameIn2D(red, blue, myp5.MULTIPLY);
      assertSameIn2D(red, blue, myp5.SCREEN);
      assertSameIn2D(red, blue, myp5.REPLACE);
      assertSameIn2D(red, blue, myp5.REMOVE);
      done();
    });

    test('blendModes are included in push/pop', function(done) {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.blendMode(myp5.MULTIPLY);
      myp5.push();
      myp5.blendMode(myp5.ADD);
      assert.equal(myp5._renderer.curBlendMode, myp5.ADD, 'Changed to ADD');
      myp5.pop();
      assert.equal(
        myp5._renderer.curBlendMode,
        myp5.MULTIPLY,
        'Resets to MULTIPLY'
      );
      done();
    });
  });

  suite('BufferDef', function() {
    test('render buffer properties are correctly set', function(done) {
      var renderer = myp5.createCanvas(10, 10, myp5.WEBGL);

      myp5.fill(255);
      myp5.stroke(255);
      myp5.triangle(0, 0, 1, 0, 0, 1);

      var buffers = renderer.retainedMode.geometry['tri'];

      assert.isObject(buffers);
      assert.isDefined(buffers.indexBuffer);
      assert.isDefined(buffers.indexBufferType);
      assert.isDefined(buffers.vertexBuffer);
      assert.isDefined(buffers.lineNormalBuffer);
      assert.isDefined(buffers.lineVertexBuffer);
      assert.isDefined(buffers.vertexBuffer);

      assert.equal(buffers.vertexCount, 3);
      assert.equal(buffers.lineVertexCount, 18);

      done();
    });
  });

  suite('tint() in WEBGL mode', function() {
    test('default tint value is set and not null', function() {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      assert.deepEqual(myp5._renderer._tint, [255, 255, 255, 255]);
    });

    test('tint value is modified correctly when tint() is called', function() {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.tint(0, 153, 204, 126);
      assert.deepEqual(myp5._renderer._tint, [0, 153, 204, 126]);
      myp5.tint(100, 120, 140);
      assert.deepEqual(myp5._renderer._tint, [100, 120, 140, 255]);
      myp5.tint('violet');
      assert.deepEqual(myp5._renderer._tint, [238, 130, 238, 255]);
      myp5.tint(100);
      assert.deepEqual(myp5._renderer._tint, [100, 100, 100, 255]);
      myp5.tint(100, 126);
      assert.deepEqual(myp5._renderer._tint, [100, 100, 100, 126]);
      myp5.tint([100, 126, 0, 200]);
      assert.deepEqual(myp5._renderer._tint, [100, 126, 0, 200]);
      myp5.tint([100, 126, 0]);
      assert.deepEqual(myp5._renderer._tint, [100, 126, 0, 255]);
      myp5.tint([100]);
      assert.deepEqual(myp5._renderer._tint, [100, 100, 100, 255]);
      myp5.tint([100, 126]);
      assert.deepEqual(myp5._renderer._tint, [100, 100, 100, 126]);
      myp5.tint(myp5.color(255, 204, 0));
      assert.deepEqual(myp5._renderer._tint, [255, 204, 0, 255]);
    });

    test('tint should be reset after draw loop', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.setup = function() {
            p.createCanvas(100, 100, myp5.WEBGL);
          };
          p.draw = function() {
            if (p.frameCount === 2) {
              resolve(p._renderer._tint);
            }
            p.tint(0, 153, 204, 126);
          };
        });
      }).then(function(_tint) {
        assert.deepEqual(_tint, [255, 255, 255, 255]);
      });
    });
  });

  suite('beginShape() in WEBGL mode', function() {
    test('QUADS mode converts into triangles', function(done) {
      var renderer = myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.textureMode(myp5.NORMAL);
      renderer.beginShape(myp5.QUADS);
      renderer.fill(255, 0, 0);
      renderer.normal(0, 1, 2);
      renderer.vertex(0, 0, 0, 0, 0);
      renderer.fill(0, 255, 0);
      renderer.normal(3, 4, 5);
      renderer.vertex(0, 1, 1, 0, 1);
      renderer.fill(0, 0, 255);
      renderer.normal(6, 7, 8);
      renderer.vertex(1, 0, 2, 1, 0);
      renderer.fill(255, 0, 255);
      renderer.normal(9, 10, 11);
      renderer.vertex(1, 1, 3, 1, 1);

      renderer.fill(255, 0, 0);
      renderer.normal(12, 13, 14);
      renderer.vertex(2, 0, 4, 0, 0);
      renderer.fill(0, 255, 0);
      renderer.normal(15, 16, 17);
      renderer.vertex(2, 1, 5, 0, 1);
      renderer.fill(0, 0, 255);
      renderer.normal(18, 19, 20);
      renderer.vertex(3, 0, 6, 1, 0);
      renderer.fill(255, 0, 255);
      renderer.normal(21, 22, 23);
      renderer.vertex(3, 1, 7, 1, 1);
      renderer.endShape();

      const expectedVerts = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 2],

        [0, 0, 0],
        [1, 0, 2],
        [1, 1, 3],

        [2, 0, 4],
        [2, 1, 5],
        [3, 0, 6],

        [2, 0, 4],
        [3, 0, 6],
        [3, 1, 7]
      ];
      assert.equal(
        renderer.immediateMode.geometry.vertices.length,
        expectedVerts.length
      );
      expectedVerts.forEach(function([x, y, z], i) {
        assert.equal(renderer.immediateMode.geometry.vertices[i].x, x);
        assert.equal(renderer.immediateMode.geometry.vertices[i].y, y);
        assert.equal(renderer.immediateMode.geometry.vertices[i].z, z);
      });

      const expectedUVs = [
        [0, 0],
        [0, 1],
        [1, 0],

        [0, 0],
        [1, 0],
        [1, 1],

        [0, 0],
        [0, 1],
        [1, 0],

        [0, 0],
        [1, 0],
        [1, 1]
      ].flat();
      assert.deepEqual(renderer.immediateMode.geometry.uvs, expectedUVs);

      const expectedColors = [
        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1],

        [1, 0, 0, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1],

        [1, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1, 1],

        [1, 0, 0, 1],
        [0, 0, 1, 1],
        [1, 0, 1, 1]
      ].flat();
      assert.deepEqual(
        renderer.immediateMode.geometry.vertexColors,
        expectedColors
      );

      const expectedNormals = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 1, 2],
        [6, 7, 8],
        [9, 10, 11],

        [12, 13, 14],
        [15, 16, 17],
        [18, 19, 20],

        [12, 13, 14],
        [18, 19, 20],
        [21, 22, 23]
      ];
      assert.equal(
        renderer.immediateMode.geometry.vertexNormals.length,
        expectedNormals.length
      );
      expectedNormals.forEach(function([x, y, z], i) {
        assert.equal(renderer.immediateMode.geometry.vertexNormals[i].x, x);
        assert.equal(renderer.immediateMode.geometry.vertexNormals[i].y, y);
        assert.equal(renderer.immediateMode.geometry.vertexNormals[i].z, z);
      });

      done();
    });

    test('QUADS mode makes edges for quad outlines', function(done) {
      var renderer = myp5.createCanvas(10, 10, myp5.WEBGL);
      renderer.beginShape(myp5.QUADS);
      renderer.vertex(0, 0);
      renderer.vertex(0, 1);
      renderer.vertex(1, 0);
      renderer.vertex(1, 1);

      renderer.vertex(2, 0);
      renderer.vertex(2, 1);
      renderer.vertex(3, 0);
      renderer.vertex(3, 1);
      renderer.endShape();

      assert.equal(renderer.immediateMode.geometry.edges.length, 8);
      done();
    });

    test('QUAD_STRIP mode makes edges for strip outlines', function(done) {
      var renderer = myp5.createCanvas(10, 10, myp5.WEBGL);
      renderer.beginShape(myp5.QUAD_STRIP);
      renderer.vertex(0, 0);
      renderer.vertex(0, 1);
      renderer.vertex(1, 0);
      renderer.vertex(1, 1);
      renderer.vertex(2, 0);
      renderer.vertex(2, 1);
      renderer.vertex(3, 0);
      renderer.vertex(3, 1);
      renderer.endShape();

      // Two full quads (2 * 4) plus two edges connecting them
      assert.equal(renderer.immediateMode.geometry.edges.length, 10);
      done();
    });
  });
});
