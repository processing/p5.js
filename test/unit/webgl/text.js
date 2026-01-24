suite('WebGL text', function() {
  if (!window.Modernizr.webgl) {
    return;
  }

  test('text renders with a loaded font in WEBGL', async function() {
    const fontFile = 'manual-test-examples/p5.Font/Inconsolata-Bold.ttf';
    await promisedSketch(function(sketch, resolve, reject) {
      let font;
      sketch.preload = function() {
        font = sketch.loadFont(fontFile, function() {}, reject);
      };
      sketch.setup = function() {
        sketch.createCanvas(100, 100, sketch.WEBGL);
        sketch.pixelDensity(1);
        sketch.translate(-50, -50);
        sketch.background(255);
        sketch.fill(0);
        sketch.textFont(font);
        sketch.textSize(24);
        sketch.text('Test', 20, 60);
        sketch.loadPixels();

        let hasNonWhitePixels = false;
        for (let i = 0; i < sketch.pixels.length; i += 4) {
          if (sketch.pixels[i] < 255) {
            hasNonWhitePixels = true;
            break;
          }
        }
        assert.isTrue(hasNonWhitePixels, 'Text should render visible pixels');
        resolve();
      };
    });
  });

  test('noFill() prevents text rendering', async function() {
    const fontFile = 'manual-test-examples/p5.Font/Inconsolata-Bold.ttf';
    await promisedSketch(function(sketch, resolve, reject) {
      let font;
      sketch.preload = function() {
        font = sketch.loadFont(fontFile, function() {}, reject);
      };
      sketch.setup = function() {
        sketch.createCanvas(100, 100, sketch.WEBGL);
        sketch.pixelDensity(1);
        sketch.translate(-50, -50);
        sketch.background(255);
        sketch.noFill();
        sketch.textFont(font);
        sketch.textSize(24);
        sketch.text('Test', 20, 60);
        sketch.loadPixels();

        let allWhite = true;
        for (let i = 0; i < sketch.pixels.length; i += 4) {
          if (sketch.pixels[i] !== 255 ||
              sketch.pixels[i+1] !== 255 ||
              sketch.pixels[i+2] !== 255) {
            allWhite = false;
            break;
          }
        }
        assert.isTrue(allWhite, 'Text should not render with noFill()');
        resolve();
      };
    });
  });

  test('fill color consistency between 2D and WEBGL', async function() {
    const fontFile = 'manual-test-examples/p5.Font/Inconsolata-Bold.ttf';

    const getPixelAt = async function(mode, x, y) {
      return await promisedSketch(function(sketch, resolve, reject) {
        let font;
        sketch.preload = function() {
          font = sketch.loadFont(fontFile, function() {}, reject);
        };
        sketch.setup = function() {
          sketch.createCanvas(100, 100, mode);
          sketch.pixelDensity(1);
          sketch.background(255);

          if (mode === p5.WEBGL) {
            sketch.translate(-50, -50);
          }

          sketch.fill(255, 0, 0);
          sketch.textFont(font);
          sketch.textSize(48);
          sketch.text('A', 20, 60);

          const pixel = sketch.get(x, y);
          resolve(pixel);
        };
      });
    };

    const pixel2D = await getPixelAt(p5.P2D, 35, 45);
    const pixelWebGL = await getPixelAt(p5.WEBGL, 35, 45);

    assert.isAbove(pixel2D[0], 200, '2D red channel should be high');
    assert.isAbove(pixelWebGL[0], 200, 'WebGL red channel should be high');
    assert.isBelow(pixel2D[1], 50, '2D green channel should be low');
    assert.isBelow(pixelWebGL[1], 50, 'WebGL green channel should be low');
  });

  test('textSize() affects rendered output in WEBGL', async function() {
    const fontFile = 'manual-test-examples/p5.Font/Inconsolata-Bold.ttf';

    const countNonWhitePixels = async function(size) {
      return await promisedSketch(function(sketch, resolve, reject) {
        let font;
        sketch.preload = function() {
          font = sketch.loadFont(fontFile, function() {}, reject);
        };
        sketch.setup = function() {
          sketch.createCanvas(100, 100, sketch.WEBGL);
          sketch.pixelDensity(1);
          sketch.translate(-50, -50);
          sketch.background(255);
          sketch.fill(0);
          sketch.textFont(font);
          sketch.textSize(size);
          sketch.text('A', 20, 60);
          sketch.loadPixels();

          let count = 0;
          for (let i = 0; i < sketch.pixels.length; i += 4) {
            if (sketch.pixels[i] < 255) count++;
          }
          resolve(count);
        };
      });
    };

    const smallCount = await countNonWhitePixels(12);
    const largeCount = await countNonWhitePixels(48);

    assert.isAbove(largeCount, smallCount, 'Larger textSize should render more pixels');
  });
});