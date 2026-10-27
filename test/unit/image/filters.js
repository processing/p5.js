import { mockP5, mockP5Prototype } from '../../js/mocks';
import { vi } from 'vitest';
import image from '../../../src/image/image';
import p5Image from '../../../src/image/p5.Image';

suite('Filters', function () {
  var myp5;
  let img;

  beforeEach(function () {
    image(mockP5, mockP5Prototype);
    p5Image(mockP5, mockP5Prototype);

    myp5 = Object.create(mockP5);
    Object.assign(myp5, mockP5Prototype);

    img = myp5.createImage(120, 20);
    img.pixelDensity(1);
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      img.pixels[i] = 120;
      img.pixels[i + 1] = 20;
      img.pixels[i + 2] = 40;
      img.pixels[i + 3] = 225;
    }

img.updatePixels();

    Object.assign(myp5, {
      THRESHOLD: 'threshold',
      GRAY: 'gray',
      OPAQUE: 'opaque',
      INVERT: 'invert'
    });
  });

  afterEach(function () {
    vi.clearAllMocks();
  });

  test('threshold filter. less than threshold', function () {
    img.filter(myp5.THRESHOLD);
    img.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(img.pixels[i], 0);
      assert.strictEqual(img.pixels[i + 1], 0);
      assert.strictEqual(img.pixels[i + 2], 0);
    }
  });

  test('threshold filter. greater than threshold', function () {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, [211, 228, 250, 255]);
      }
    }
    img.updatePixels();
    img.filter(myp5.THRESHOLD);
    img.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(img.pixels[i], 255);
      assert.strictEqual(img.pixels[i + 1], 255);
      assert.strictEqual(img.pixels[i + 2], 255);
    }
  });

  test('gray filter', function () {
    img.filter(myp5.GRAY);
    img.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(img.pixels[i], img.pixels[i + 1]); // r, g, b values should be equal for gray
      assert.strictEqual(img.pixels[i + 1], img.pixels[i + 2]);
    }
  });

  test('opaque filter', function () {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, [120, 20, 40, 10]);
      }
    }
    img.updatePixels();
    img.filter(myp5.OPAQUE);
    img.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(img.pixels[i + 3], 255); // 'a' value should be 255 after OPAQUE filter
    }
  });

  test('invert filter', function () {
    img.filter(myp5.INVERT);
    img.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(img.pixels[i], 135);
      assert.strictEqual(img.pixels[i + 1], 235);
      assert.strictEqual(img.pixels[i + 2], 215);
    }
  });
});
