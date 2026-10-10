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

  suite('p5.Image.prototype.pixelDensity', function () {
    test('it sets and gets pixel density', function () {
      const img = myp5.createImage(100, 100);
      assert.strictEqual(img.pixelDensity(), 1);
      img.pixelDensity(2);
      assert.strictEqual(img.pixelDensity(), 2);
      assert.strictEqual(img.width, 50);
      assert.strictEqual(img.height, 50);
      assert.strictEqual(img.canvas.width, 100);
      assert.strictEqual(img.canvas.height, 100);
    });

    test('repeated calls are idempotent and can be restored', function () {
      const img = myp5.createImage(100, 100);
      img.pixelDensity(2);
      assert.strictEqual(img.width, 50);
      assert.strictEqual(img.height, 50);

      // Calling again should not divide dimensions further
      img.pixelDensity(2);
      assert.strictEqual(img.width, 50);
      assert.strictEqual(img.height, 50);

      // Resetting to 1 restores original logical dimensions
      img.pixelDensity(1);
      assert.strictEqual(img.width, 100);
      assert.strictEqual(img.height, 100);
    });

    test('setting non-positive density defaults to 1', function () {
      const img = myp5.createImage(100, 100);
      img.pixelDensity(0);
      assert.strictEqual(img.pixelDensity(), 1);
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

    test('it should resize backing canvas with pixel density > 1', function () {
      const img = myp5.createImage(100, 100);
      img.pixelDensity(2);
      assert.strictEqual(img.width, 50);
      assert.strictEqual(img.height, 50);

      img.resize(40, 60);
      assert.strictEqual(img.width, 40);
      assert.strictEqual(img.height, 60);
      assert.strictEqual(img.canvas.width, 80);
      assert.strictEqual(img.canvas.height, 120);
    });

    test('it allows get() and set() across full logical dimensions after resize with high pixel density', function () {
      const img = myp5.createImage(100, 100);
      img.pixelDensity(2);
      img.resize(50, 50);

      const red = myp5.color(255, 0, 0, 255);
      img.set(30, 30, red);
      img.updatePixels();

      const pixel = img.get(30, 30);
      assert.strictEqual(pixel[0], 255);
      assert.strictEqual(pixel[1], 0);
      assert.strictEqual(pixel[2], 0);
      assert.strictEqual(pixel[3], 255);
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

  suite('p5.Image.prototype.copy', function () {
    function solidImage(w, h, density, col) {
      const img = myp5.createImage(w, h);
      img.pixelDensity(density);
      img.loadPixels();
      for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
          img.set(i, j, col);
        }
      }
      img.updatePixels();
      return img;
    }

    function assertAllPixels(img, rgba) {
      for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
          assert.deepEqual(img.get(i, j), rgba);
        }
      }
    }

    test('it copies into the destination area at pixel density 1', function () {
      const src = solidImage(10, 10, 1, myp5.color(0, 255, 0));
      const dst = solidImage(10, 10, 1, myp5.color(255, 0, 0));
      dst.copy(src, 0, 0, 10, 10, 0, 0, 10, 10);
      assertAllPixels(dst, [0, 255, 0, 255]);
    });

    test('it scales the destination coordinates when the destination pixel density is above 1', function () {
      const src = solidImage(10, 10, 1, myp5.color(0, 255, 0));
      const dst = solidImage(10, 10, 2, myp5.color(255, 0, 0));
      assert.strictEqual(dst.width, 5);
      assert.strictEqual(dst.height, 5);
      dst.copy(src, 0, 0, 5, 5, 0, 0, 5, 5);
      // The whole logical 5x5 destination should be covered, not just the
      // top-left physical pixels.
      assertAllPixels(dst, [0, 255, 0, 255]);
    });

    test('it scales the destination coordinates for a fractional destination region', function () {
      const src = solidImage(10, 10, 1, myp5.color(0, 255, 0));
      const dst = solidImage(10, 10, 2, myp5.color(255, 0, 0));
      dst.copy(src, 0, 0, 4, 4, 1, 1, 4, 4);
      // Logical pixel (4, 4) maps to physical (8, 8), which is only covered
      // when the destination is scaled.
      assert.deepEqual(dst.get(4, 4), [0, 255, 0, 255]);
      // Corners outside the copied region stay red.
      assert.deepEqual(dst.get(0, 0), [255, 0, 0, 255]);
    });
  });

  suite('p5.Image.prototype.blend', function () {
    test('it scales the destination coordinates when the destination pixel density is above 1', function () {
      const src = myp5.createImage(10, 10);
      src.loadPixels();
      for (let i = 0; i < src.width; i++) {
        for (let j = 0; j < src.height; j++) {
          src.set(i, j, myp5.color(0, 255, 0));
        }
      }
      src.updatePixels();

      const dst = myp5.createImage(10, 10);
      dst.pixelDensity(2);
      dst.loadPixels();
      for (let i = 0; i < dst.width; i++) {
        for (let j = 0; j < dst.height; j++) {
          dst.set(i, j, myp5.color(255, 0, 0));
        }
      }
      dst.updatePixels();

      dst.blend(src, 0, 0, 5, 5, 0, 0, 5, 5, myp5.NORMAL);
      for (let i = 0; i < dst.width; i++) {
        for (let j = 0; j < dst.height; j++) {
          assert.deepEqual(dst.get(i, j), [0, 255, 0, 255]);
        }
      }
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
