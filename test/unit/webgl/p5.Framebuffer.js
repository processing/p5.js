suite('p5.Framebuffer', function() {
  let myp5;

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

  suite('formats and channels', function() {
    function testWithConfiguration(
      version,
      format,
      channels,
      antialias,
      depth
    ) {
      test(
        `framebuffers work with WebGL ${version}, ${format} ${channels} ${depth || 'no'} depth ${antialias ? ' antialiased' : ''}`,
        function() {
          myp5.createCanvas(10, 10, myp5.WEBGL);
          myp5.setAttributes({ version });

          // Draw a box to the framebuffer
          const fbo = myp5.createFramebuffer({
            format,
            channels,
            antialias,
            depth: depth !== null,
            depthFormat: depth
          });
          fbo.draw(() => {
            myp5.background(255);
            myp5.noStroke();
            myp5.fill('red');
            myp5.box(5, 5, 5);
          });

          // Draw the framebuffer to the canvas
          myp5.background(0);
          myp5.noStroke();
          myp5.texture(fbo);
          myp5.plane(myp5.width, -myp5.height);

          // Make sure it drew
          assert.deepEqual(
            myp5.get(0, 0),
            [255, 255, 255, 255]
          );
          assert.deepEqual(
            myp5.get(5, 5),
            [255, 0, 0, 255]
          );
        }
      );
    }

    const versions = [1, 2];
    const formats = ['unsigned-byte', 'float', 'half-float'];
    const channelOptions = ['rgba', 'rgb'];
    const antialiasOptions = [true, false];
    const depthOptions = ['unsigned-int', 'float', null];
    for (const version of versions) {
      for (const format of formats) {
        for (const channels of channelOptions) {
          for (const antialias of antialiasOptions) {
            for (const depth of depthOptions) {
              testWithConfiguration(
                version,
                format,
                channels,
                antialias,
                depth
              );
            }
          }
        }
      }
    }
  });

  suite('sizing', function() {
    test('auto-sized framebuffers change size with their canvas', function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.pixelDensity(1);
      const fbo = myp5.createFramebuffer();
      const oldTexture = fbo.color.rawTexture();
      expect(fbo.width).to.equal(10);
      expect(fbo.height).to.equal(10);
      expect(fbo.density).to.equal(1);

      myp5.resizeCanvas(5, 15);
      myp5.pixelDensity(2);
      expect(fbo.width).to.equal(5);
      expect(fbo.height).to.equal(15);
      expect(fbo.density).to.equal(2);

      // The texture should be recreated
      expect(fbo.color.rawTexture()).not.to.equal(oldTexture);
    });

    test('manually-sized framebuffers do not change size with their canvas', function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.pixelDensity(3);
      const fbo = myp5.createFramebuffer({ width: 20, height: 20, density: 1 });
      const oldTexture = fbo.color.rawTexture();
      expect(fbo.width).to.equal(20);
      expect(fbo.height).to.equal(20);
      expect(fbo.density).to.equal(1);

      myp5.resizeCanvas(5, 15);
      myp5.pixelDensity(2);
      expect(fbo.width).to.equal(20);
      expect(fbo.height).to.equal(20);
      expect(fbo.density).to.equal(1);

      // The texture should not be recreated
      expect(fbo.color.rawTexture()).to.equal(oldTexture);
    });

    suite('resizing', function() {
      let fbo;
      let oldTexture;
      setup(function() {
        myp5.createCanvas(10, 10, myp5.WEBGL);
        myp5.pixelDensity(1);
        fbo = myp5.createFramebuffer();
        oldTexture = fbo.color.rawTexture();

        fbo.resize(5, 15);
        fbo.pixelDensity(2);
      });

      test('framebuffers can be resized', function() {
        expect(fbo.width).to.equal(5);
        expect(fbo.height).to.equal(15);
        expect(fbo.density).to.equal(2);

        // The texture should be recreated
        expect(fbo.color.rawTexture()).not.to.equal(oldTexture);
      });

      test('resizing a framebuffer turns off auto-sizing', function() {
        oldTexture = fbo.color.rawTexture();

        myp5.resizeCanvas(20, 20);
        myp5.pixelDensity(3);

        expect(fbo.width).to.equal(5);
        expect(fbo.height).to.equal(15);
        expect(fbo.density).to.equal(2);

        // The texture should not be recreated
        expect(fbo.color.rawTexture()).to.equal(oldTexture);
      });
    });
  });

  suite('rendering', function() {
    function setupAndReturnFramebuffer() {
      myp5.createCanvas(10, 10, myp5.WEBGL);

      // Draw a box to the framebuffer
      const fbo = myp5.createFramebuffer();
      fbo.draw(() => {
        myp5.background(255);
        myp5.noStroke();
        myp5.fill('red');
        myp5.box(5, 5, 5);
      });

      return fbo;
    }

    test('rendering works with fbo.color as a texture', function() {
      const fbo = setupAndReturnFramebuffer();

      // Draw the framebuffer to the canvas
      myp5.background(0);
      myp5.noStroke();
      myp5.texture(fbo.color);
      myp5.plane(myp5.width, -myp5.height);

      assert.deepEqual(
        myp5.get(5, 5),
        [255, 0, 0, 255]
      );
    });

    test('rendering works with fbo as a texture', function() {
      const fbo = setupAndReturnFramebuffer();

      // Draw the framebuffer to the canvas
      myp5.background(0);
      myp5.noStroke();
      myp5.texture(fbo);
      myp5.plane(myp5.width, -myp5.height);

      assert.deepEqual(
        myp5.get(5, 5),
        [255, 0, 0, 255]
      );
    });

    test('rendering works with fbo.depth as a texture', function() {
      const fbo = setupAndReturnFramebuffer();

      // Draw the framebuffer to the canvas
      myp5.background(0);
      myp5.noStroke();
      myp5.texture(fbo.depth);
      myp5.plane(myp5.width, -myp5.height);

      // Just check the red channel, other channels might vary across browsers
      assert.equal(myp5.get(5, 5)[0], 232);
    });
  });

  test('Framebuffers work on p5.Graphics', function() {
    myp5.createCanvas(10, 10);
    const graphic = myp5.createGraphics(10, 10, myp5.WEBGL);

    // Draw a box to the framebuffer
    const fbo = graphic.createFramebuffer();
    fbo.draw(() => {
      graphic.background(255);
      graphic.noStroke();
      graphic.fill('red');
      graphic.box(5, 5, 5);
    });

    // Draw the framebuffer to the graphic
    graphic.background(0);
    graphic.noStroke();
    graphic.texture(fbo);
    graphic.plane(graphic.width, -graphic.height);

    // Make sure it drew
    assert.deepEqual(
      graphic.get(0, 0),
      [255, 255, 255, 255]
    );
    assert.deepEqual(
      graphic.get(5, 5),
      [255, 0, 0, 255]
    );
  });

  suite('remove()', function() {
    test('remove() cleans up textures', function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      const fbo = myp5.createFramebuffer();
      const numTextures = myp5._renderer.textures.size;
      fbo.remove();
      expect(myp5._renderer.textures.size).to.equal(numTextures - 2);
    });

    test(
      'remove() cleans up textures when the framebuffer has no depth',
      function() {
        myp5.createCanvas(10, 10, myp5.WEBGL);
        const fbo = myp5.createFramebuffer({ depth: false });
        const numTextures = myp5._renderer.textures.size;
        fbo.remove();
        expect(myp5._renderer.textures.size).to.equal(numTextures - 1);
      }
    );
  });

  suite('defaultCamera', function() {
    let fbo;
    setup(function() {
      myp5.createCanvas(10, 10, myp5.WEBGL);
      myp5.pixelDensity(1);
      fbo = myp5.createFramebuffer({ width: 5, height: 15 });
    });

    suite('the default camera', function() {
      test('it uses the aspect ratio of the framebuffer', function() {
        expect(fbo.defaultCamera.aspectRatio).to.equal(5 / 15);
        expect(fbo.defaultCamera.cameraFOV).to.be.closeTo(
          2.0 * Math.atan(15 / 2 / 800),
          0.01
        );
        const z = -800;
        const expectedCameraMatrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, z, 1
        ];
        for (let i = 0; i < expectedCameraMatrix.length; i++) {
          expect(fbo.defaultCamera.cameraMatrix.mat4[i])
            .to.be.closeTo(expectedCameraMatrix[i], 0.01);
        }
      });

      test('it updates the aspect ratio after resizing', function() {
        fbo.resize(20, 10);
        expect(fbo.defaultCamera.aspectRatio).to.equal(2);
        expect(fbo.defaultCamera.cameraFOV).to.be.closeTo(
          2.0 * Math.atan(10 / 2 / 800),
          0.01
        );
        const z = -800;
        const expectedCameraMatrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, z, 1
        ];
        for (let i = 0; i < expectedCameraMatrix.length; i++) {
          expect(fbo.defaultCamera.cameraMatrix.mat4[i])
            .to.be.closeTo(expectedCameraMatrix[i], 0.01);
        }
      });
    });
  });

  suite('get()', function() {
    test('get(x, y) loads a pixel', function() {
      myp5.createCanvas(20, 20, myp5.WEBGL);
      const fbo = myp5.createFramebuffer();
      fbo.draw(() => {
        myp5.noStroke();

        myp5.push();
        myp5.translate(-myp5.width/2, -myp5.height/2);
        myp5.fill('red');
        myp5.sphere(5);
        myp5.pop();

        myp5.push();
        myp5.translate(myp5.width/2, myp5.height/2);
        myp5.fill('blue');
        myp5.sphere(5);
        myp5.pop();
      });

      assert.deepEqual(fbo.get(0, 0), [255, 0, 0, 255]);
      assert.deepEqual(fbo.get(10, 10), [0, 0, 0, 0]);
      assert.deepEqual(fbo.get(19, 19), [0, 0, 255, 255]);
    });

    test('get() creates a p5.Image with equivalent pixels', function() {
      myp5.createCanvas(20, 20, myp5.WEBGL);
      const fbo = myp5.createFramebuffer();
      fbo.draw(() => {
        myp5.noStroke();

        myp5.push();
        myp5.translate(-myp5.width/2, -myp5.height/2);
        myp5.fill('red');
        myp5.sphere(5);
        myp5.pop();

        myp5.push();
        myp5.translate(myp5.width/2, myp5.height/2);
        myp5.fill('blue');
        myp5.sphere(5);
        myp5.pop();
      });
      const img = fbo.get();

      fbo.loadPixels();
      img.loadPixels();

      expect(img.width).to.equal(fbo.width);
      expect(img.height).to.equal(fbo.height);
      for (let i = 0; i < img.pixels.length; i++) {
        expect(img.pixels[i]).to.be.closeTo(fbo.pixels[i], 1);
      }
    });

    test('get() creates a p5.Image with 1x pixel density', function() {
      const mainCanvas = myp5.createCanvas(20, 20, myp5.WEBGL);
      myp5.pixelDensity(2);
      const fbo = myp5.createFramebuffer();
      fbo.draw(() => {
        myp5.noStroke();
        myp5.background(255);

        myp5.push();
        myp5.translate(-myp5.width/2, -myp5.height/2);
        myp5.fill('red');
        myp5.sphere(5);
        myp5.pop();

        myp5.push();
        myp5.translate(myp5.width/2, myp5.height/2);
        myp5.fill('blue');
        myp5.sphere(5);
        myp5.pop();
      });
      const img = fbo.get();
      const p2d = myp5.createGraphics(20, 20);
      p2d.pixelDensity(1);
      myp5.image(fbo, -10, -10);
      p2d.image(mainCanvas, 0, 0);

      fbo.loadPixels();
      img.loadPixels();
      p2d.loadPixels();

      expect(img.width).to.equal(fbo.width);
      expect(img.height).to.equal(fbo.height);
      expect(img.pixels.length).to.equal(fbo.pixels.length / 4);
      // The pixels should be approximately the same in the 1x image as when we
      // draw the framebuffer onto a 1x canvas
      for (let i = 0; i < img.pixels.length; i++) {
        expect(img.pixels[i]).to.be.closeTo(p2d.pixels[i], 2);
      }
    });
  });

  test(
    'loadPixels works in arbitrary order for multiple framebuffers',
    function() {
      myp5.createCanvas(20, 20, myp5.WEBGL);
      const fbo1 = myp5.createFramebuffer();
      const fbo2 = myp5.createFramebuffer();

      fbo1.loadPixels();
      fbo2.loadPixels();
      for (let i = 0; i < fbo1.pixels.length; i += 4) {
        // Set everything red
        fbo1.pixels[i] = 255;
        fbo1.pixels[i + 1] = 0;
        fbo1.pixels[i + 2] = 0;
        fbo1.pixels[i + 3] = 255;
      }
      for (let i = 0; i < fbo2.pixels.length; i += 4) {
        // Set everything blue
        fbo2.pixels[i] = 0;
        fbo2.pixels[i + 1] = 0;
        fbo2.pixels[i + 2] = 255;
        fbo2.pixels[i + 3] = 255;
      }
      fbo2.updatePixels();
      fbo1.updatePixels();

      myp5.imageMode(myp5.CENTER);

      myp5.clear();
      myp5.image(fbo1, 0, 0);
      assert.deepEqual(myp5.get(0, 0), [255, 0, 0, 255]);

      myp5.clear();
      myp5.image(fbo2, 0, 0);
      assert.deepEqual(myp5.get(0, 0), [0, 0, 255, 255]);
    }
  );

  test('Strokes work on and off of framebuffers', function() {
    myp5.createCanvas(20, 20, myp5.WEBGL);
    const fbo = myp5.createFramebuffer();

    const drawCircle = () => {
      myp5.clear();
      myp5.noFill();
      myp5.stroke(0);
      myp5.strokeWeight(20);
      myp5.beginShape();
      for (let i = 0; i < 20; i++) {
        const angle = i/20*myp5.TWO_PI;
        myp5.vertex(
          100 * myp5.cos(angle),
          // Add an offset to make sure results don't get flipped
          100 * myp5.sin(angle) - 50
        );
      }
      myp5.endShape(myp5.CLOSE);
    };

    fbo.draw(drawCircle);
    fbo.loadPixels();
    const fboPixels = [...fbo.pixels];

    drawCircle();
    myp5.loadPixels();
    const mainPixels = [...myp5.pixels];

    assert.deepEqual(fboPixels, mainPixels);
  });

  suite('nesting', function() {
    for (const antialias of [false, true]) {
      suite(`with antialiasing ${antialias ? 'on' : 'off'}`, function() {
        let fbo1;
        let fbo2;
        setup(function() {
          myp5.createCanvas(10, 10, myp5.WEBGL);
          myp5.pixelDensity(1);
          fbo1 = myp5.createFramebuffer({ antialias });
          fbo2 = myp5.createFramebuffer({ antialias });
        });

        test('one can nest active framebuffers', function() {
          fbo1.begin();
          myp5.fill('red');
          myp5.circle(0, 0, 10);

          fbo2.begin();
          myp5.fill('blue');
          myp5.circle(0, 0, 10);
          fbo2.end();

          fbo1.end();

          assert.deepEqual(fbo1.get(5, 5), [255, 0, 0, 255]);
          assert.deepEqual(fbo2.get(5, 5), [0, 0, 255, 255]);
        });

        test('end() in the wrong order throws an error', function() {
          expect(function() {
            fbo1.begin();
            fbo2.begin();
            fbo1.end();
            fbo2.end();
          }).to.throw(/another Framebuffer is active/);
        });

        test('one can read a nested framebuffer', function() {
          myp5.imageMode(myp5.CENTER);

          fbo1.begin();
          myp5.fill('red');
          myp5.circle(0, 0, 10);

          fbo2.begin();
          myp5.image(fbo1, 0, 0);
          fbo2.end();

          fbo1.end();

          assert.deepEqual(fbo1.get(5, 5), [255, 0, 0, 255]);
          assert.deepEqual(fbo2.get(5, 5), [255, 0, 0, 255]);
        });
      });
    }
  });

  suite('texture filtering', function() {
    test('can create a framebuffer that uses NEAREST texture filtering',
      function() {
        myp5.createCanvas(10, 10, myp5.WEBGL);
        const fbo = myp5.createFramebuffer({
          textureFiltering: myp5.NEAREST
        });

        assert.equal(
          fbo.color.framebuffer.colorP5Texture.glMinFilter, fbo.gl.NEAREST
        );
        assert.equal(
          fbo.color.framebuffer.colorP5Texture.glMagFilter, fbo.gl.NEAREST
        );
      });
    test('can create a framebuffer that uses LINEAR texture filtering',
      function() {
        myp5.createCanvas(10, 10, myp5.WEBGL);
        // LINEAR should be the default
        const fbo = myp5.createFramebuffer({});

        assert.equal(
          fbo.color.framebuffer.colorP5Texture.glMinFilter, fbo.gl.LINEAR
        );
        assert.equal(
          fbo.color.framebuffer.colorP5Texture.glMagFilter, fbo.gl.LINEAR
        );
      });
  });
});
