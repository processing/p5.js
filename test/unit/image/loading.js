import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import loadingDisplaying from '../../../src/image/loading_displaying';
import image from '../../../src/image/p5.Image';

import p5 from '../../../src/app.js';
import { vi } from 'vitest';

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
  const imagePath = '/test/unit/assets/cat.jpg';
  const singleFrameGif = '/test/unit/assets/target_small.gif';
  const animatedGif = '/test/unit/assets/white_black.gif';
  const nyanCatGif = '/test/unit/assets/nyan_cat.gif';
  const disposeNoneGif = '/test/unit/assets/dispose_none.gif';
  const disposeBackgroundGif = '/test/unit/assets/dispose_background.gif';
  const disposePreviousGif = '/test/unit/assets/dispose_previous.gif';
  const invalidFile = '404file';

  beforeAll(async function() {
    loadingDisplaying(mockP5, mockP5Prototype);
    image(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadImage(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadImage(invalidFile, () => {
        reject('Success callback executed');
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadImage(imagePath, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, err => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns an object with correct data', async () => {
    const pImg = await mockP5Prototype.loadImage(imagePath);
    assert.ok(pImg, 'cat.jpg loaded');
    assert.isTrue(pImg instanceof mockP5.Image);
  });

  test('passes an object with correct data to success callback', async () => {
    await mockP5Prototype.loadImage(imagePath, pImg => {
      assert.ok(pImg, 'cat.jpg loaded');
      assert.isTrue(pImg instanceof mockP5.Image);
    });
  });

  // TODO: this is more of an integration test, possibly delegate to visual test
  // test('should draw image with defaults', function() {
  //   return new Promise(function(resolve, reject) {
  //     myp5.loadImage('unit/assets/cat.jpg', resolve, reject);
  //   }).then(function(img) {
  //     myp5.image(img, 0, 0);
  //     return testImageRender('unit/assets/cat.jpg', myp5).then(function(res) {
  //       assert.isTrue(res);
  //     });
  //   });
  // });

  test('static image should not have gifProperties', async () => {
    const img = await mockP5Prototype.loadImage(imagePath);
    assert.isNull(img.gifProperties);
  });

  test('single frame GIF should not have gifProperties', async () => {
    const img = await mockP5Prototype.loadImage(singleFrameGif);
    assert.isNull(img.gifProperties);
  });

  test('first frame of GIF should be painted after load', async () => {
    const img = await mockP5Prototype.loadImage(animatedGif);
    assert.deepEqual(img.get(0, 0), [255, 255, 255, 255]);
  });

  // test('animated gifs animate correctly', function() {
  //   const wait = function(ms) {
  //     return new Promise(function(resolve) {
  //       setTimeout(resolve, ms);
  //     });
  //   };
  //   let img;
  //   return new Promise(function(resolve, reject) {
  //     img = myp5.loadImage('unit/assets/nyan_cat.gif', resolve, reject);
  //   }).then(function() {
  //     assert.equal(img.gifProperties.displayIndex, 0);
  //     myp5.image(img, 0, 0);

  //     // This gif has frames that are around for 100ms each.
  //     // After 100ms has elapsed, the display index should
  //     // increment when we draw the image.
  //     return wait(100);
  //   }).then(function() {
  //     return new Promise(function(resolve) {
  //       window.requestAnimationFrame(resolve);
  //     });
  //   }).then(function() {
  //     myp5.image(img, 0, 0);
  //     assert.equal(img.gifProperties.displayIndex, 1);
  //   });
  // });

  const backgroundColor = [135, 206, 235, 255];
  const blue = [0, 0, 255, 255];
  const transparent = [0, 0, 0, 0];
  test('animated gifs work with no disposal', async () => {
    const img = await mockP5Prototype.loadImage(disposeNoneGif);
    // Frame 0 shows the background
    assert.deepEqual(img.get(7, 12), backgroundColor);
    // Frame 1 draws on top of the background
    img.setFrame(1);
    assert.deepEqual(img.get(7, 12), blue);
    // Frame 2 does not erase untouched parts of frame 2
    img.setFrame(2);
    assert.deepEqual(img.get(7, 12), blue);
  });

  test('animated gifs work with background disposal', async () => {
    const img = await mockP5Prototype.loadImage(disposeBackgroundGif);
    // Frame 0 shows the background
    assert.deepEqual(img.get(7, 12), backgroundColor);
    // Frame 1 draws on top of the background
    img.setFrame(1);
    assert.deepEqual(img.get(7, 12), blue);
    // Frame 2 erases the content added in frame 2
    img.setFrame(2);
    assert.deepEqual(img.get(7, 12), transparent);
  });

  test('animated gifs work with previous disposal', async () => {
    const img = await mockP5Prototype.loadImage(disposePreviousGif);
    // Frame 0 shows the background
    assert.deepEqual(img.get(7, 12), backgroundColor);
    // Frame 1 draws on top of the background
    img.setFrame(1);
    assert.deepEqual(img.get(7, 12), blue);
    // Frame 2 returns the content added in frame 2 to its previous value
    img.setFrame(2);
    assert.deepEqual(img.get(7, 12), backgroundColor);
  });

  // /* TODO: make this resilient to platform differences in image resizing.
  // test('should draw cropped image', function() {
  //   return new Promise(function(resolve, reject) {
  //     myp5.loadImage('unit/assets/target.gif', resolve, reject);
  //   }).then(function(img) {
  //     myp5.image(img, 0, 0, 6, 6, 5, 5, 6, 6);
  //     return testImageRender('unit/assets/target_small.gif', myp5).then(
  //       function(res) {
  //         assert.isTrue(res);
  //       }
  //     );
  //   });
  // });
  // */

  test('should construct gifProperties correctly after preload', async () => {
    const gifImage = await mockP5Prototype.loadImage(nyanCatGif);
    assert.isTrue(gifImage instanceof p5.Image);

    const nyanCatGifProperties = {
      displayIndex: 0,
      loopCount: 0,
      loopLimit: null,
      numFrames: 6,
      playing: true,
      timeDisplayed: 0
    };
    assert.isTrue(gifImage.gifProperties !== null);
    for (let prop in nyanCatGifProperties) {
      assert.deepEqual(
        gifImage.gifProperties[prop],
        nyanCatGifProperties[prop]
      );
    }
    assert.deepEqual(
      gifImage.gifProperties.numFrames,
      gifImage.gifProperties.frames.length
    );
    for (let i = 0; i < gifImage.gifProperties.numFrames; i++) {
      assert.isTrue(
        gifImage.gifProperties.frames[i].image instanceof ImageData
      );
      assert.isTrue(gifImage.gifProperties.frames[i].delay === 100);
    }

    assert.equal(gifImage.gifProperties.timeDisplayed, 0);
    gifImage.pause();
    assert.isFalse(gifImage.gifProperties.playing);
    gifImage.play();
    assert.isTrue(gifImage.gifProperties.playing);
    gifImage.setFrame(2);
    assert.equal(gifImage.gifProperties.displayIndex, 2);
    gifImage.reset();
    assert.equal(gifImage.gifProperties.displayIndex, 0);
    assert.equal(gifImage.gifProperties.timeDisplayed, 0);
  });
});

suite.todo('displaying images', function() {
  var myp5;
  var pImg;
  var imagePath = 'unit/assets/cat-with-hole.png';
  var chanNames = ['red', 'green', 'blue', 'alpha'];

  beforeAll(async function() {
    new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          myp5.pixelDensity(1);
          myp5.loadImage(
            imagePath,
            function(img) {
              pImg = img;
              myp5.resizeCanvas(pImg.width, pImg.height);
              resolve();
            },
            function() {
              throw new Error('Error loading image');
            }
          );
        };
      });
    });
  });

  afterAll(function() {
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
  var myp5, imageSpy;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  beforeEach(() => {
    imageSpy = vi.spyOn(myp5._renderer, 'image');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('CONTAIN when source image is larger than destination', function() {
    let src = myp5.createImage(400, 1000);
    myp5.image(src, 0, 0, 300, 400, 0, 0, 400, 1000, myp5.CONTAIN);
    expect(imageSpy)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        400 / (1000 / 400),
        1000 / (1000 / 400)
      );
  });

  test('CONTAIN when source image is smaller than destination', function() {
    let src = myp5.createImage(40, 90);
    myp5.image(src, 0, 0, 300, 500, 0, 0, 400, 1000, myp5.CONTAIN);
    expect(imageSpy)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        40 / (90 / 500),
        90 / (90 / 500)
      );
  });

  test('COVER when source image is larger than destination', function() {
    let src = myp5.createImage(400, 1000);
    myp5.image(src, 0, 0, 300, 400, 0, 0, 400, 1000, myp5.COVER);
    const r = Math.max(300 / 400, 400 / 1000);
    expect(imageSpy)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.any(Number),
        300 / r,
        400 / r,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
  });

  test('COVER when source image is smaller than destination', function() {
    let src = myp5.createImage(20, 100);
    myp5.image(src, 0, 0, 300, 400, 0, 0, 20, 100, myp5.COVER);
    const r = Math.max(300 / 20, 400 / 100);
    expect(imageSpy)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.any(Number),
        300 / r,
        400 / r,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
  });
});
