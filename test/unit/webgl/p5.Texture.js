suite('p5.Texture', function() {
  var myp5;
  var texImg1;
  var texImg2;

  if (!window.Modernizr.webgl) {
    //assert(false, 'could not run gl tests');
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        texImg1 = p.loadImage('unit/assets/nyan_cat.gif');
        texImg2 = p.loadImage('unit/assets/target.gif');
        p.texture(texImg1);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var testTextureSet = function(src) {
    assert(
      myp5._renderer.curFillShader === myp5._renderer._getLightShader(),
      'shader was not set to light + texture shader after ' +
        'calling texture()'
    );
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
    test('Set textureMode to NORMAL', function() {
      myp5.textureMode(myp5.NORMAL);
      assert.deepEqual(myp5._renderer.textureMode, myp5.NORMAL);
    });
    test('Set textureMode to IMAGE', function() {
      myp5.textureMode(myp5.IMAGE);
      assert.deepEqual(myp5._renderer.textureMode, myp5.IMAGE);
    });
  });
});
