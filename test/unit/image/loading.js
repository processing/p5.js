/**
 * Expects an image file and a p5 instance with an image file loaded and drawn
 * and checks that they are exactly the same. Sends result to the callback.
 */
var testImageRender = function(file, sketch) {
  sketch.loadPixels();
  var p = sketch.pixels;
  var ctx = sketch;

  sketch.clear();

  return new Promise(function(resolve, reject) {
    sketch.loadImage(file, resolve, reject);
  }).then(function(img) {
    ctx.image(img, 0, 0);

    ctx.loadPixels();
    var n = 0;
    for (var i = 0; i < p.length; i++) {
      var diff = Math.abs(p[i] - ctx.pixels[i]);
      n += diff;
    }
    var same = n === 0 && ctx.pixels.length === p.length;
    return same;
  });
};

suite('loading images', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var imagePath = 'unit/assets/cat.jpg';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  test('should call successCallback when image loads', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(imagePath, resolve, reject);
    }).then(function(pImg) {
      assert.ok(pImg, 'cat.jpg loaded');
      assert.isTrue(pImg instanceof p5.Image);
    });
  });

  test('should call failureCallback when unable to load image', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(
        'invalid path',
        function(pImg) {
          reject('Entered success callback.');
        },
        resolve
      );
    }).then(function(event) {
      assert.equal(event.type, 'error');
      assert.isTrue(p5._friendlyFileLoadError.called);
    });
  });

  test('should draw image with defaults', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/cat.jpg', resolve, reject);
    }).then(function(img) {
      myp5.image(img, 0, 0);
      return testImageRender('unit/assets/cat.jpg', myp5).then(function(res) {
        assert.isTrue(res);
      });
    });
  });

  test('static image should not have gifProperties', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/cat.jpg', resolve, reject);
    }).then(function(img) {
      assert.isTrue(img.gifProperties === null);
    });
  });

  test('single frame GIF should not have gifProperties', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/target_small.gif', resolve, reject);
    }).then(function(img) {
      assert.isTrue(img.gifProperties === null);
    });
  });

  test('first frame of GIF should be painted after load', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/white_black.gif', resolve, reject);
    }).then(function(img) {
      assert.deepEqual(img.get(0, 0), [255, 255, 255, 255]);
    });
  });

  var backgroundColor = [135, 206, 235, 255];
  var blue = [0, 0, 255, 255];
  var transparent = [0, 0, 0, 0];
  test('animated gifs work with no disposal', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/dispose_none.gif', resolve, reject);
    }).then(function(img) {
      // Frame 0 shows the background
      assert.deepEqual(img.get(7, 12), backgroundColor);
      // Frame 1 draws on top of the background
      img.setFrame(1);
      assert.deepEqual(img.get(7, 12), blue);
      // Frame 2 does not erase untouched parts of frame 2
      img.setFrame(2);
      assert.deepEqual(img.get(7, 12), blue);
    });
  });

  test('animated gifs work with background disposal', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/dispose_background.gif', resolve, reject);
    }).then(function(img) {
      // Frame 0 shows the background
      assert.deepEqual(img.get(7, 12), backgroundColor);
      // Frame 1 draws on top of the background
      img.setFrame(1);
      assert.deepEqual(img.get(7, 12), blue);
      // Frame 2 erases the content added in frame 2
      img.setFrame(2);
      assert.deepEqual(img.get(7, 12), transparent);
    });
  });

  test('animated gifs work with previous disposal', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/dispose_previous.gif', resolve, reject);
    }).then(function(img) {
      // Frame 0 shows the background
      assert.deepEqual(img.get(7, 12), backgroundColor);
      // Frame 1 draws on top of the background
      img.setFrame(1);
      assert.deepEqual(img.get(7, 12), blue);
      // Frame 2 returns the content added in frame 2 to its previous value
      img.setFrame(2);
      assert.deepEqual(img.get(7, 12), backgroundColor);
    });
  });

  /* TODO: make this resilient to platform differences in image resizing.
  test('should draw cropped image', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/target.gif', resolve, reject);
    }).then(function(img) {
      myp5.image(img, 0, 0, 6, 6, 5, 5, 6, 6);
      return testImageRender('unit/assets/target_small.gif', myp5).then(
        function(res) {
          assert.isTrue(res);
        }
      );
    });
  });
  */

  // Test loading image in preload() with success callback
  test('Test in preload() with success callback');
  test('Test in setup() after preload()');
  // These tests don't work correctly (You can't use suite and test like that)
  // they simply get added at the root level.
  var mySketch = function(this_p5) {
    var myImage;
    this_p5.preload = function() {
      suite('Test in preload() with success callback', function() {
        test('Load asynchronously and use success callback', function(done) {
          myImage = this_p5.loadImage('unit/assets/cat.jpg', function() {
            assert.ok(myImage);
            done();
          });
        });
      });
    };

    this_p5.setup = function() {
      suite('setup() after preload() with success callback', function() {
        test('should be loaded if preload() finished', function(done) {
          assert.isTrue(myImage instanceof p5.Image);
          assert.isTrue(myImage.width > 0 && myImage.height > 0);
          done();
        });
      });
    };
  };
  new p5(mySketch, null, false);

  // Test loading image in preload() without success callback
  mySketch = function(this_p5) {
    var myImage;
    this_p5.preload = function() {
      myImage = this_p5.loadImage('unit/assets/cat.jpg');
    };

    this_p5.setup = function() {
      suite('setup() after preload() without success callback', function() {
        test('should be loaded now preload() finished', function(done) {
          assert.isTrue(myImage instanceof p5.Image);
          assert.isTrue(myImage.width > 0 && myImage.height > 0);
          done();
        });
      });
    };
  };
  new p5(mySketch, null, false);
});

suite('loading animated gif images', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var imagePath = 'unit/assets/nyan_cat.gif';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  test('should call successCallback when image loads', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(imagePath, resolve, reject);
    }).then(function(pImg) {
      assert.ok(pImg, 'nyan_cat.gif loaded');
      assert.isTrue(pImg instanceof p5.Image);
    });
  });

  test('should call failureCallback when unable to load image', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(
        'invalid path',
        function(pImg) {
          reject('Entered success callback.');
        },
        resolve
      );
    }).then(function(event) {
      assert.equal(event.type, 'error');
      assert.isTrue(p5._friendlyFileLoadError.called);
    });
  });

  test('should construct gifProperties correctly after preload', function() {
    var mySketch = function(this_p5) {
      var gifImage;
      this_p5.preload = function() {
        suite('Test in preload() with success callback', function() {
          test('Load asynchronously and use success callback', function(done) {
            gifImage = this_p5.loadImage(imagePath, function() {
              assert.ok(gifImage);
              done();
            });
          });
        });
      };

      this_p5.setup = function() {
        suite('setup() after preload() with success callback', function() {
          test('should be loaded if preload() finished', function(done) {
            assert.isTrue(gifImage instanceof p5.Image);
            assert.isTrue(gifImage.width > 0 && gifImage.height > 0);
            done();
          });
          test('gifProperties should be correct after preload', function done() {
            assert.isTrue(gifImage instanceof p5.Image);
            var nyanCatGifProperties = {
              displayIndex: 0,
              loopCount: 0,
              loopLimit: null,
              numFrames: 6,
              playing: true,
              timeDisplayed: 0
            };
            assert.isTrue(gifImage.gifProperties !== null);
            for (var prop in nyanCatGifProperties) {
              assert.deepEqual(
                gifImage.gifProperties[prop],
                nyanCatGifProperties[prop]
              );
            }
            assert.deepEqual(
              gifImage.gifProperties.numFrames,
              gifImage.gifProperties.frames.length
            );
            for (var i = 0; i < gifImage.gifProperties.numFrames; i++) {
              assert.isTrue(
                gifImage.gifProperties.frames[i].image instanceof ImageData
              );
              assert.isTrue(gifImage.gifProperties.frames[i].delay === 100);
            }
          });
          test('should be able to modify gifProperties state', function() {
            assert.isTrue(gifImage.gifProperties.timeDisplayed === 0);
            gifImage.pause();
            assert.isTrue(gifImage.gifProperties.playing === false);
            gifImage.play();
            assert.isTrue(gifImage.gifProperties.playing === true);
            gifImage.setFrame(2);
            assert.isTrue(gifImage.gifProperties.displayIndex === 2);
            gifImage.reset();
            assert.isTrue(gifImage.gifProperties.displayIndex === 0);
            assert.isTrue(gifImage.gifProperties.timeDisplayed === 0);
          });
        });
      };
    };
    new p5(mySketch, null, false);
  });
});

suite('displaying images', function() {
  var myp5;
  var pImg;
  var imagePath = 'unit/assets/cat-with-hole.png';
  var chanNames = ['red', 'green', 'blue', 'alpha'];

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myp5.pixelDensity(1);
        myp5.loadImage(
          imagePath,
          function(img) {
            pImg = img;
            myp5.resizeCanvas(pImg.width, pImg.height);
            done();
          },
          function() {
            throw new Error('Error loading image');
          }
        );
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  function checkTint(tintColor) {
    myp5.loadPixels();
    pImg.loadPixels();
    for (var i = 0; i < myp5.pixels.length; i += 4) {
      var x = (i / 4) % myp5.width;
      var y = Math.floor(i / 4 / myp5.width);
      for (var chan = 0; chan < tintColor.length; chan++) {
        var inAlpha = 1;
        var outAlpha = 1;
        if (chan < 3) {
          // The background of the canvas is black, so after applying the
          // image's own alpha + the tint alpha to its color channels, we
          // should arrive at the same color that we see on the canvas.
          inAlpha = tintColor[3] / 255;
          outAlpha = pImg.pixels[i + 3] / 255;

          // Applying the tint involves un-multiplying the alpha of the source
          // image, which causes a bit of loss of precision. I'm allowing a
          // loss of 10 / 255 in this test.
          assert.approximately(
            myp5.pixels[i + chan],
            pImg.pixels[i + chan] *
              (tintColor[chan] / 255) *
              outAlpha *
              inAlpha,
            10,
            'Tint output for the ' +
              chanNames[chan] +
              ' channel of pixel (' +
              x +
              ', ' +
              y +
              ') should be equivalent to multiplying the image value by tint fraction'
          );
        }
      }
    }
  }

  test('tint() with color', function() {
    assert.ok(pImg, 'image loaded');
    var tintColor = [150, 100, 50, 255];
    myp5.clear();
    myp5.background(0);
    myp5.tint(tintColor[0], tintColor[1], tintColor[2], tintColor[3]);
    myp5.image(pImg, 0, 0);

    checkTint(tintColor);
  });

  test('tint() with alpha', function() {
    assert.ok(pImg, 'image loaded');
    var tintColor = [255, 255, 255, 100];
    myp5.clear();
    myp5.background(0);
    myp5.tint(tintColor[0], tintColor[1], tintColor[2], tintColor[3]);
    myp5.image(pImg, 0, 0);

    checkTint(tintColor);
  });

  test('tint() with color and alpha', function() {
    assert.ok(pImg, 'image loaded');
    var tintColor = [255, 100, 50, 100];
    myp5.clear();
    myp5.background(0);
    myp5.tint(tintColor[0], tintColor[1], tintColor[2], tintColor[3]);
    myp5.image(pImg, 0, 0);

    checkTint(tintColor);
  });
});

suite('displaying images that use fit mode', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('CONTAIN when source image is larger than destination', function() {
    let src = myp5.createImage(400, 1000);
    sinon.spy(myp5._renderer, 'image');
    myp5.image(src, 0, 0, 300, 400, 0, 0, 400, 1000, myp5.CONTAIN);
    assert(myp5._renderer.image.calledOnce);
    assert.equal(myp5._renderer.image.getCall(0).args[7], 400 / (1000 / 400)); //  dw
    assert.equal(myp5._renderer.image.getCall(0).args[8], 1000 / (1000 / 400)); // dh
  });

  test('CONTAIN when source image is smaller than destination', function() {
    let src = myp5.createImage(40, 90);
    sinon.spy(myp5._renderer, 'image');
    myp5.image(src, 0, 0, 300, 500, 0, 0, 400, 1000, myp5.CONTAIN);
    assert(myp5._renderer.image.calledOnce);
    assert.equal(myp5._renderer.image.getCall(0).args[7], 40 / (90 / 500)); //  dw
    assert.equal(myp5._renderer.image.getCall(0).args[8], 90 / (90 / 500)); // dh
  });

  test('COVER when source image is larger than destination', function() {
    let src = myp5.createImage(400, 1000);
    sinon.spy(myp5._renderer, 'image');
    myp5.image(src, 0, 0, 300, 400, 0, 0, 400, 1000, myp5.COVER);
    const r = Math.max(300 / 400, 400 / 1000);
    assert(myp5._renderer.image.calledOnce);
    assert.equal(myp5._renderer.image.getCall(0).args[3], 300 / r); //  sw
    assert.equal(myp5._renderer.image.getCall(0).args[4], 400 / r); // sh
  });

  test('COVER when source image is smaller than destination', function() {
    let src = myp5.createImage(20, 100);
    sinon.spy(myp5._renderer, 'image');
    myp5.image(src, 0, 0, 300, 400, 0, 0, 20, 100, myp5.COVER);
    const r = Math.max(300 / 20, 400 / 100);
    assert(myp5._renderer.image.calledOnce);
    assert.equal(myp5._renderer.image.getCall(0).args[3], 300 / r); //  sw
    assert.equal(myp5._renderer.image.getCall(0).args[4], 400 / r); // sh
  });
});
