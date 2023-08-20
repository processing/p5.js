suite('p5.Texture', function() {
  var myp5;
  var texImg1;
  var texImg2;
  var texImg3;
  var imgElementNotPowerOfTwo;
  var imgElementPowerOfTwo;
  var canvas;

  if (!window.Modernizr.webgl) {
    //assert(false, 'could not run gl tests');
    return;
  }

  setup(function(done) {
    myp5 = new p5(function(p) {
      p.preload = function() {
        // texImg2 must have powerOfTwo dimensions
        texImg2 = p.loadImage('unit/assets/target.gif');
        // texImg3 must NOT have powerOfTwo dimensions
        texImg3 = p.loadImage('unit/assets/nyan_cat.gif');
        // texture object isn't created until it's used for something:
        //p.box(70, 70, 70);
      };
      p.setup = function() {
        canvas = p.createCanvas(100, 100, p.WEBGL);
        texImg1 = p.createGraphics(2, 2, p.WEBGL);
        new Promise(resolve => {
          p.createImg(texImg2.canvas.toDataURL(), '', 'anonymous', el => {
            el.size(50, 50);
            imgElementPowerOfTwo = el;
            p.texture(imgElementPowerOfTwo);
            resolve();
          });
        }).then(() => new Promise(resolve => {
          p.createImg(texImg3.canvas.toDataURL(), '', 'anonymous', el => {
            el.size(50, 50);
            imgElementNotPowerOfTwo = el;
            p.texture(imgElementNotPowerOfTwo);
            resolve();
          });
        })).then(() => {
          p.texture(texImg1);
          done();
        });
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var testTextureSet = function(src) {
    test('Light shader set after texture()', function() {
      var lightShader = myp5._renderer._getLightShader();
      var selectedShader = myp5._renderer._getRetainedFillShader();
      assert(
        lightShader === selectedShader,
        "_renderer's retain mode shader was not light shader " +
          'after call to texture()'
      );
    });

    var tex = myp5._renderer.getTexture(src);
    assert(tex !== undefined, 'texture was undefined');
    assert(tex instanceof p5.Texture, 'texture was not a p5.Texture object');
    assert(tex.src === src, 'texture did not have expected image as source');
  };

  suite('p5.Texture', function() {
    test('Create and cache a single texture with p5.Image', function() {
      testTextureSet(texImg1);
    });
    test('Create and cache multiple p5.Image textures', function() {
      myp5.texture(texImg2);
      testTextureSet(texImg2);
      // other image was made into a texture in setup, should still be there!
      //testTextureSet(texImg1);
    });
    test('Set filter mode to linear', function() {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setInterpolation(myp5.LINEAR, myp5.LINEAR);
      assert.deepEqual(tex.glMinFilter, myp5._renderer.GL.LINEAR);
      assert.deepEqual(tex.glMagFilter, myp5._renderer.GL.LINEAR);
    });
    test('Set filter mode to nearest', function() {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setInterpolation(myp5.NEAREST, myp5.NEAREST);
      assert.deepEqual(tex.glMinFilter, myp5._renderer.GL.NEAREST);
      assert.deepEqual(tex.glMagFilter, myp5._renderer.GL.NEAREST);
    });
    test('Set wrap mode to clamp', function() {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.CLAMP, myp5.CLAMP);
      assert.deepEqual(tex.glWrapS, myp5._renderer.GL.CLAMP_TO_EDGE);
      assert.deepEqual(tex.glWrapT, myp5._renderer.GL.CLAMP_TO_EDGE);
    });
    test('Set wrap mode to repeat', function() {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      assert.deepEqual(tex.glWrapS, myp5._renderer.GL.REPEAT);
      assert.deepEqual(tex.glWrapT, myp5._renderer.GL.REPEAT);
    });
    test('Set wrap mode to mirror', function() {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.MIRROR, myp5.MIRROR);
      assert.deepEqual(tex.glWrapS, myp5._renderer.GL.MIRRORED_REPEAT);
      assert.deepEqual(tex.glWrapT, myp5._renderer.GL.MIRRORED_REPEAT);
    });
    test('Set wrap mode REPEAT if src dimensions is powerOfTwo', function() {
      const tex = myp5._renderer.getTexture(imgElementPowerOfTwo);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      assert.deepEqual(tex.glWrapS, myp5._renderer.GL.REPEAT);
      assert.deepEqual(tex.glWrapT, myp5._renderer.GL.REPEAT);
    });
    test(
      'Set default wrap mode REPEAT if WEBGL2 and src dimensions != powerOfTwo',
      function() {
        const tex = myp5._renderer.getTexture(imgElementNotPowerOfTwo);
        tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
        assert.deepEqual(tex.glWrapS, myp5._renderer.GL.REPEAT);
        assert.deepEqual(tex.glWrapT, myp5._renderer.GL.REPEAT);
      }
    );
    test(
      'Set default wrap mode CLAMP if WEBGL1 and src dimensions != powerOfTwo',
      function() {
        myp5.setAttributes({ version: 1 });
        const tex = myp5._renderer.getTexture(imgElementNotPowerOfTwo);
        tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
        assert.deepEqual(tex.glWrapS, myp5._renderer.GL.CLAMP_TO_EDGE);
        assert.deepEqual(tex.glWrapT, myp5._renderer.GL.CLAMP_TO_EDGE);
      }
    );
    test('Set textureMode to NORMAL', function() {
      myp5.textureMode(myp5.NORMAL);
      assert.deepEqual(myp5._renderer.textureMode, myp5.NORMAL);
    });
    test('Set textureMode to IMAGE', function() {
      myp5.textureMode(myp5.IMAGE);
      assert.deepEqual(myp5._renderer.textureMode, myp5.IMAGE);
    });
    test('Set global wrap mode to clamp', function() {
      myp5.textureWrap(myp5.CLAMP);
      var tex1 = myp5._renderer.getTexture(texImg1);
      var tex2 = myp5._renderer.getTexture(texImg2);
      assert.deepEqual(tex1.glWrapS, myp5._renderer.GL.CLAMP_TO_EDGE);
      assert.deepEqual(tex1.glWrapT, myp5._renderer.GL.CLAMP_TO_EDGE);
      assert.deepEqual(tex2.glWrapS, myp5._renderer.GL.CLAMP_TO_EDGE);
      assert.deepEqual(tex2.glWrapT, myp5._renderer.GL.CLAMP_TO_EDGE);
    });
    test('Set global wrap mode to repeat', function() {
      myp5.textureWrap(myp5.REPEAT);
      var tex1 = myp5._renderer.getTexture(texImg1);
      var tex2 = myp5._renderer.getTexture(texImg2);
      assert.deepEqual(tex1.glWrapS, myp5._renderer.GL.REPEAT);
      assert.deepEqual(tex1.glWrapT, myp5._renderer.GL.REPEAT);
      assert.deepEqual(tex2.glWrapS, myp5._renderer.GL.REPEAT);
      assert.deepEqual(tex2.glWrapT, myp5._renderer.GL.REPEAT);
    });
    test('Set global wrap mode to mirror', function() {
      myp5.textureWrap(myp5.MIRROR);
      var tex1 = myp5._renderer.getTexture(texImg1);
      var tex2 = myp5._renderer.getTexture(texImg2);
      assert.deepEqual(tex1.glWrapS, myp5._renderer.GL.MIRRORED_REPEAT);
      assert.deepEqual(tex1.glWrapT, myp5._renderer.GL.MIRRORED_REPEAT);
      assert.deepEqual(tex2.glWrapS, myp5._renderer.GL.MIRRORED_REPEAT);
      assert.deepEqual(tex2.glWrapT, myp5._renderer.GL.MIRRORED_REPEAT);
    });
    test('Handles changes to p5.Image size', function() {
      const tex = myp5._renderer.getTexture(texImg2);
      expect(tex.width).to.equal(texImg2.width);
      expect(tex.height).to.equal(texImg2.height);
      texImg2.resize(texImg2.width * 2, texImg2.height * 2);
      tex.update();
      expect(tex.width).to.equal(texImg2.width);
      expect(tex.height).to.equal(texImg2.height);
    });
    test('Handles changes to p5.Graphics size', function() {
      const tex = myp5._renderer.getTexture(texImg1);
      expect(tex.width).to.equal(texImg1.width);
      expect(tex.height).to.equal(texImg1.height);
      texImg1.resizeCanvas(texImg1.width * 2, texImg1.height * 2);
      tex.update();
      expect(tex.width).to.equal(texImg1.width);
      expect(tex.height).to.equal(texImg1.height);
    });
    test('Handles changes to p5.Renderer size', function() {
      const tex = texImg1._renderer.getTexture(canvas);
      expect(tex.width).to.equal(canvas.width);
      expect(tex.height).to.equal(canvas.height);
      myp5.resizeCanvas(canvas.width / 2, canvas.height / 2);
      tex.update();
      expect(tex.width).to.equal(canvas.width);
      expect(tex.height).to.equal(canvas.height);
    });
  });
});
