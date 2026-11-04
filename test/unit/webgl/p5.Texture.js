import p5 from '../../../src/app.js';

suite('p5.Texture', function () {
  var myp5;
  var texImg1;
  var texImg2;
  var texImg3;
  var imgElementNotPowerOfTwo;
  var imgElementPowerOfTwo;
  var canvas;
  let prevPixelRatio;

  beforeEach(function () {
    prevPixelRatio = window.devicePixelRatio;
    window.devicePixelRatio = 1;
    return new Promise(done => {
      myp5 = new p5(function (p) {
        p.setup = async function () {
          canvas = p.createCanvas(100, 100, p.WEBGL);
          p.pixelDensity(1);
          texImg1 = p.createGraphics(2, 2, p.WEBGL);
          texImg2 = await p.loadImage('test/unit/assets/target.gif');
          texImg3 = await p.loadImage('test/unit/assets/nyan_cat.gif');
          new Promise(resolve => {
            p.createImg(texImg2.canvas.toDataURL(), '', 'anonymous', el => {
              el.size(50, 50);
              imgElementPowerOfTwo = el;
              p.texture(imgElementPowerOfTwo);
              resolve();
            });
          })
            .then(
              () =>
                new Promise(resolve => {
                  p.createImg(
                    texImg3.canvas.toDataURL(),
                    '',
                    'anonymous',
                    el => {
                      el.size(50, 50);
                      imgElementNotPowerOfTwo = el;
                      p.texture(imgElementNotPowerOfTwo);
                      resolve();
                    }
                  );
                })
            )
            .then(() => {
              p.texture(texImg1);
              done();
            });
        };
      });
    });
  });

  afterEach(function () {
    window.devicePixelRatio = prevPixelRatio;
    myp5.remove();
  });

  var testTextureSet = function (src) {
    var lightShader = myp5._renderer._getLightShader();
    var selectedShader = myp5._renderer._getFillShader();
    console.log('first');
    assert(
      lightShader === selectedShader,
      "_renderer's retain mode shader was not light shader " +
        'after call to texture()'
    );
    console.log('second');
    var tex = myp5._renderer.getTexture(src);
    console.log('third');
    assert(tex !== undefined, 'texture was undefined');
    assert(tex instanceof p5.Texture, 'texture was not a p5.Texture object');
    assert(tex.src === src, 'texture did not have expected image as source');
  };

  suite('p5.Texture', function () {
    let texParamSpy;
    beforeEach(() => {
      texParamSpy = vi.spyOn(myp5._renderer.GL, 'texParameteri');
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    test('Create and cache a single texture with p5.Image', function () {
      testTextureSet(texImg1);
    });
    test('Create and cache multiple p5.Image textures', function () {
      myp5.texture(texImg2);
      testTextureSet(texImg2);
      // other image was made into a texture in setup, should still be there!
      //testTextureSet(texImg1);
    });
    test('Set filter mode to linear', function () {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setInterpolation(myp5.LINEAR, myp5.LINEAR);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_MIN_FILTER,
        myp5._renderer.GL.LINEAR
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_MAG_FILTER,
        myp5._renderer.GL.LINEAR
      );
    });
    test('Set filter mode to nearest', function () {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setInterpolation(myp5.NEAREST, myp5.NEAREST);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_MIN_FILTER,
        myp5._renderer.GL.NEAREST
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_MAG_FILTER,
        myp5._renderer.GL.NEAREST
      );
    });
    test('Set wrap mode to clamp', function () {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.CLAMP, myp5.CLAMP);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
    });
    test('Set wrap mode to repeat', function () {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.REPEAT
      );
    });
    test('Set wrap mode to mirror', function () {
      var tex = myp5._renderer.getTexture(texImg2);
      tex.setWrapMode(myp5.MIRROR, myp5.MIRROR);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
    });
    test('Set wrap mode REPEAT if src dimensions is powerOfTwo', function () {
      const tex = myp5._renderer.getTexture(imgElementPowerOfTwo);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.REPEAT
      );
    });
    test('Set default wrap mode REPEAT if WEBGL2 and src dimensions != powerOfTwo', function () {
      const tex = myp5._renderer.getTexture(imgElementNotPowerOfTwo);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.REPEAT
      );
    });
    test('Set default wrap mode CLAMP if WEBGL1 and src dimensions != powerOfTwo', function () {
      myp5.setAttributes({ version: 1 });
      texParamSpy = vi.spyOn(myp5._renderer.GL, 'texParameteri');
      const tex = myp5._renderer.getTexture(imgElementNotPowerOfTwo);
      tex.setWrapMode(myp5.REPEAT, myp5.REPEAT);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
    });
    test('Set textureMode to NORMAL', function () {
      myp5.textureMode(myp5.NORMAL);
      assert.deepEqual(myp5._renderer.states.textureMode, myp5.NORMAL);
    });
    test('Set textureMode to IMAGE', function () {
      myp5.textureMode(myp5.IMAGE);
      assert.deepEqual(myp5._renderer.states.textureMode, myp5.IMAGE);
    });
    test('Set global wrap mode to clamp', function () {
      myp5.textureWrap(myp5.CLAMP);
      myp5._renderer.getTexture(texImg1);
      myp5._renderer.getTexture(texImg2);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.CLAMP_TO_EDGE
      );
    });
    test('Set global wrap mode to repeat', function () {
      myp5.textureWrap(myp5.REPEAT);
      myp5._renderer.getTexture(texImg1);
      myp5._renderer.getTexture(texImg2);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.REPEAT
      );
    });
    test('Set global wrap mode to mirror', function () {
      myp5.textureWrap(myp5.MIRROR);
      myp5._renderer.getTexture(texImg1);
      myp5._renderer.getTexture(texImg2);
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_S,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
      expect(texParamSpy).toHaveBeenCalledWith(
        myp5._renderer.GL.TEXTURE_2D,
        myp5._renderer.GL.TEXTURE_WRAP_T,
        myp5._renderer.GL.MIRRORED_REPEAT
      );
    });
    test('Handles changes to p5.Image size', function () {
      const tex = myp5._renderer.getTexture(texImg2);
      expect(tex.width).to.equal(texImg2.width);
      expect(tex.height).to.equal(texImg2.height);
      texImg2.resize(texImg2.width * 2, texImg2.height * 2);
      tex.update();
      expect(tex.width).to.equal(texImg2.width);
      expect(tex.height).to.equal(texImg2.height);
    });
    test('Keeps the same texture when the p5.Image size changes', function () {
      const tex = myp5._renderer.getTexture(texImg2);
      texImg2.resize(texImg2.width * 2, texImg2.height * 2);
      expect(myp5._renderer.getTexture(texImg2)).to.equal(tex);
    });
    test('Handles changes to p5.Graphics size', function () {
      const tex = myp5._renderer.getTexture(texImg1);
      expect(tex.width).to.equal(texImg1.width);
      expect(tex.height).to.equal(texImg1.height);
      texImg1.resizeCanvas(texImg1.width * 2, texImg1.height * 2);
      tex.update();
      expect(tex.width).to.equal(texImg1.width);
      expect(tex.height).to.equal(texImg1.height);
    });
    test('Reads from the video element when video upload is supported', function () {
      const video = myp5.createVideo('');
      const tex = myp5._renderer.getTexture(video);
      expect(tex._getTextureDataFromSource()).to.equal(video.elt);
    });
    test('Reads from a canvas when video upload is not supported', function () {
      const video = myp5.createVideo('');
      const tex = myp5._renderer.getTexture(video);
      vi.spyOn(myp5._renderer, 'supportsVideoUpload').mockReturnValue(false);
      expect(tex._getTextureDataFromSource()).to.equal(video.canvas);
    });
    test('Handles changes to p5.Renderer size', function () {
      const tex = texImg1._renderer.getTexture(canvas);
      expect(tex.width).to.equal(canvas.width);
      expect(tex.height).to.equal(canvas.height);
      myp5.resizeCanvas(canvas.width / 2, canvas.height / 2);
      tex.update();
      expect(tex.width).to.equal(canvas.width);
      expect(tex.height).to.equal(canvas.height);
    });
  
    suite('textureWrap() object setter (#9164)', function () {
      test('getter returns the current modes as {x, y}', function () {
        myp5.textureWrap(myp5.REPEAT, myp5.MIRROR);
        assert.deepEqual(myp5.textureWrap(), {
          x: myp5.REPEAT,
          y: myp5.MIRROR
        });
      });

      test('passing the getter result back preserves both modes', function () {
        myp5.textureWrap(myp5.REPEAT, myp5.MIRROR);
        myp5.textureWrap(myp5.textureWrap());
        assert.deepEqual(myp5.textureWrap(), {
          x: myp5.REPEAT,
          y: myp5.MIRROR
        });
      });

      test('a supplied object sets the two directions independently', function () {
        myp5.textureWrap({ x: myp5.REPEAT, y: myp5.MIRROR });
        assert.equal(myp5._renderer.states.textureWrapX, myp5.REPEAT);
        assert.equal(myp5._renderer.states.textureWrapY, myp5.MIRROR);
      });

      test('accepts an object with no prototype', function () {
        // The FES param validator throws on a null-prototype object because
        // buildTypeMismatchMessage() calls toString() on the argument. Disable
        // it here so this test exercises textureWrap() rather than the FES.
        const prev = p5.disableFriendlyErrors;
        p5.disableFriendlyErrors = true;
        try {
          const modes = Object.create(null);
          modes.x = myp5.REPEAT;
          modes.y = myp5.MIRROR;
          myp5.textureWrap(modes);
          assert.equal(myp5._renderer.states.textureWrapY, myp5.MIRROR);
        } finally {
          p5.disableFriendlyErrors = prev;
        }
      });

      test('textureWrap(null) does not throw', function () {
        assert.doesNotThrow(() => myp5.textureWrap(null));
      });

      test('the y mode reaches WebGL after a round trip', function () {
        myp5.textureWrap(myp5.REPEAT, myp5.MIRROR);
        myp5.textureWrap(myp5.textureWrap());
        myp5._renderer.getTexture(texImg1);
        expect(texParamSpy).toHaveBeenCalledWith(
          myp5._renderer.GL.TEXTURE_2D,
          myp5._renderer.GL.TEXTURE_WRAP_T,
          myp5._renderer.GL.MIRRORED_REPEAT
        );
      });

      test('warns once for an unrecognised wrap mode', function () {
        const fesSpy = vi.spyOn(p5, '_friendlyError');
        myp5.textureWrap('not-a-mode');
        myp5.textureWrap('also-not-a-mode');
        expect(fesSpy).toHaveBeenCalledTimes(1);
        fesSpy.mockRestore();
      });
    });
  });
});
