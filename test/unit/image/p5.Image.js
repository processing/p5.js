import p5 from '../../../src/app.js';

suite('p5.Image', function () {
  var myp5;

  beforeAll(function () {
    new p5(function (p) {
      p.setup = function () {
        myp5 = p;
      };
    });
  });

  afterAll(function () {
    myp5.remove();
  });

  suite('p5.prototype.createImage', function () {
    test('it creates an image', function () {
      let img = myp5.createImage(10, 17);
      assert.isObject(img);
    });
  });

  suite('p5.Image', function () {
    test('it has necessary properties', function () {
      let img = new p5.Image(100, 100);
      assert.property(img, 'width');
      assert.property(img, 'height');
      assert.property(img, 'canvas');
      assert.property(img, 'loadPixels');
      assert.property(img, 'pixels');
      assert.property(img, 'updatePixels');
    });

    test('height and width are correct', function () {
      let img = new p5.Image(100, 100);
      myp5.pixelDensity(1);
      assert.strictEqual(img.width, 100);
      assert.strictEqual(img.height, 100);
    });
  });

  suite('p5.Image.prototype.resize', function () {
    test('it should resize the image', function () {
      let img = myp5.createImage(10, 17);
      myp5.pixelDensity(1);
      img.resize(10, 30);
      assert.strictEqual(img.width, 10);
      assert.strictEqual(img.height, 30);
    });
  });

  suite('p5.Image.prototype.copy', function () {
    test('it copies correctly to destination with pixel density > 1', function () {
      let src = myp5.createImage(50, 50);
      src.loadPixels();
      for (let i = 0; i < src.pixels.length; i += 4) {
        src.pixels[i] = 255;
        src.pixels[i + 3] = 255;
      }
      src.updatePixels();

      let dst = myp5.createImage(100, 100);
      dst.pixelDensity(2);
      // dst.width is 50, dst.height is 50, dst.canvas is 100x100
      dst.copy(src, 0, 0, 50, 50, 0, 0, 50, 50);

      // (35, 35) maps to physical (70, 70), which without the fix was outside
      // the unscaled 50x50 copy region on the 100x100 canvas.
      let col = dst.get(35, 35);
      assert.strictEqual(col[0], 255, 'red channel at (35, 35)');
      assert.strictEqual(col[3], 255, 'alpha channel at (35, 35)');
    });

    test('it copies correctly when both source and destination have pixel density > 1', function () {
      let src = myp5.createImage(50, 50);
      src.pixelDensity(2);
      src.loadPixels();
      for (let i = 0; i < src.pixels.length; i += 4) {
        src.pixels[i] = 255;
        src.pixels[i + 3] = 255;
      }
      src.updatePixels();

      let dst = myp5.createImage(100, 100);
      dst.pixelDensity(2);
      dst.copy(src, 0, 0, 25, 25, 0, 0, 50, 50);

      let col = dst.get(35, 35);
      assert.strictEqual(col[0], 255, 'red channel at (35, 35)');
      assert.strictEqual(col[3], 255, 'alpha channel at (35, 35)');
    });
  });

  suite('p5.Image.prototype.blend', function () {
    test('it blends correctly to destination with pixel density > 1', function () {
      let src = myp5.createImage(50, 50);
      src.loadPixels();
      for (let i = 0; i < src.pixels.length; i += 4) {
        src.pixels[i] = 255;
        src.pixels[i + 3] = 255;
      }
      src.updatePixels();

      let dst = myp5.createImage(100, 100);
      dst.pixelDensity(2);
      dst.blend(src, 0, 0, 50, 50, 0, 0, 50, 50, myp5.BLEND);

      let col = dst.get(35, 35);
      assert.strictEqual(col[0], 255, 'red channel at (35, 35)');
      assert.strictEqual(col[3], 255, 'alpha channel at (35, 35)');
    });
  });

  suite.todo('p5.Image.prototype.mask', function () {
    for (const density of [1, 2]) {
      test(`it should mask the image at pixel density ${density}`, function () {
        let img = myp5.createImage(10, 10);
        img.pixelDensity(density);
        img.loadPixels();
        for (let i = 0; i < img.height; i++) {
          for (let j = 0; j < img.width; j++) {
            let alpha = i < 5 ? 255 : 0;
            img.set(i, j, myp5.color(0, 0, 0, alpha));
          }
        }
        img.updatePixels();

        let mask = myp5.createImage(10, 10);
        mask.pixelDensity(density);
        mask.loadPixels();
        for (let i = 0; i < mask.width; i++) {
          for (let j = 0; j < mask.height; j++) {
            let alpha = j < 5 ? 255 : 0;
            mask.set(i, j, myp5.color(0, 0, 0, alpha));
          }
        }
        mask.updatePixels();

        img.mask(mask);
        img.loadPixels();
        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            let alpha = i < 5 && j < 5 ? 255 : 0;
            assert.strictEqual(img.get(i, j)[3], alpha);
          }
        }
      });
    }

    test('it should mask images of different density', function () {
      let img = myp5.createImage(10, 10);
      img.pixelDensity(1);
      img.loadPixels();
      for (let i = 0; i < img.height; i++) {
        for (let j = 0; j < img.width; j++) {
          let alpha = i < 5 ? 255 : 0;
          img.set(i, j, myp5.color(0, 0, 0, alpha));
        }
      }
      img.updatePixels();

      let mask = myp5.createImage(20, 20);
      mask.loadPixels();
      for (let i = 0; i < mask.width; i++) {
        for (let j = 0; j < mask.height; j++) {
          let alpha = j < 10 ? 255 : 0;
          mask.set(i, j, myp5.color(0, 0, 0, alpha));
        }
      }
      mask.updatePixels();
      mask.pixelDensity(2);

      img.mask(mask);
      img.loadPixels();
      for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
          let alpha = i < 5 && j < 5 ? 255 : 0;
          assert.strictEqual(img.get(i, j)[3], alpha);
        }
      }
    });

    test('it should mask images from createGraphics', function () {
      myp5.createCanvas(10, 10);
      myp5.pixelDensity(2);
      let img = myp5.createGraphics(10, 10);
      img.noStroke();
      img.rect(0, 0, 10, 10);
      let mask = myp5.createGraphics(10, 10);
      mask.noStroke();
      mask.rect(0, 0, 5, 5);
      let masked = img.get();
      masked.mask(mask.get());

      for (let i = 0; i < masked.width; i++) {
        for (let j = 0; j < masked.height; j++) {
          let alpha = i < 5 && j < 5 ? 255 : 0;
          assert.strictEqual(masked.get(i, j)[3], alpha);
        }
      }
    });

    test('it should mask the animated gif image', function () {
      const imagePath = 'unit/assets/nyan_cat.gif';
      return new Promise(function (resolve, reject) {
        myp5.loadImage(imagePath, resolve, reject);
      }).then(function (img) {
        let mask = myp5.createImage(img.width, img.height);
        mask.loadPixels();
        for (let i = 0; i < mask.width; i++) {
          for (let j = 0; j < mask.height; j++) {
            const alpha = j < img.height / 2 ? 255 : 0;
            mask.set(i, j, myp5.color(0, 0, 0, alpha));
          }
        }
        mask.updatePixels();

        img.mask(mask);
        img.loadPixels();
        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            const alpha = j < img.height / 2 ? 255 : 0;
            assert.strictEqual(img.get(i, j)[3], alpha);
          }
        }
        for (
          frameIndex = 0;
          frameIndex < img.gifProperties.numFrames;
          frameIndex++
        ) {
          const frameData = img.gifProperties.frames[frameIndex].image.data;
          for (let i = 0; i < img.width; i++) {
            for (let j = 0; j < img.height; j++) {
              const index = 4 * (i + j * img.width) + 3;
              const alpha = j < img.height / 2 ? 255 : 0;
              assert.strictEqual(frameData[index], alpha);
            }
          }
        }
      });
    });
  });

  suite.todo('p5.Graphics.get()', function () {
    for (const density of [1, 2]) {
      test(`width and height match at pixel density ${density}`, function () {
        const g = myp5.createGraphics(10, 10);
        g.pixelDensity(density);
        g.rect(2, 2, 5, 5);

        const img = g.get();
        assert.equal(g.width, img.width);
        assert.equal(g.height, img.height);
        assert.equal(g.pixelDensity(), img.pixelDensity());

        g.loadPixels();
        img.loadPixels();
        assert.deepEqual([...g.pixels], [...img.pixels]);
      });
    }
  });
});
