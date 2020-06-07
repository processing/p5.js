suite('Environment', function() {
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

  suite('p5.frameCount', function() {
    test('starts at zero', function() {
      return new Promise(function(resolve, reject) {
        // Has to use a custom p5 to hook setup correctly
        new p5(function(p) {
          p.setup = function() {
            if (p.frameCount !== 0) {
              reject('frameCount is not 0 in setup');
            }
          };
          p.draw = function() {
            if (p.frameCount === 1) {
              resolve();
            }
          };
        });
      });
    });
    test('matches draw calls', function() {
      return new Promise(function(resolve, reject) {
        var frames = myp5.frameCount;
        var start = myp5.frameCount;
        myp5.draw = function() {
          try {
            frames += 1;
            assert.equal(myp5.frameCount, frames);
            if (frames === start + 5) {
              // Test 5 seperate redraws
              myp5.noLoop();
              setTimeout(myp5.redraw.bind(myp5), 10);
              setTimeout(myp5.redraw.bind(myp5), 20);
              setTimeout(myp5.redraw.bind(myp5), 30);
              setTimeout(myp5.redraw.bind(myp5), 40);
              setTimeout(myp5.redraw.bind(myp5), 50);
            } else if (frames === start + 10) {
              // Test loop resuming
              myp5.loop();
            } else if (frames === start + 15) {
              // Test queuing multiple redraws
              myp5.noLoop();
              setTimeout(myp5.redraw.bind(myp5, 5), 10);
            } else if (frames === start + 20) {
              resolve();
            }
            assert.equal(myp5.frameCount, frames);
          } catch (err) {
            reject(err);
          }
        };
      });
    });
  });

  suite('p5.prototype.focused', function() {
    test('it should return true on focus', function() {
      window.dispatchEvent(new Event('focus'));
      assert.strictEqual(myp5.focused, true);
    });

    test('it should return true on blur', function() {
      window.dispatchEvent(new Event('blur'));
      assert.strictEqual(myp5.focused, false);
    });
  });

  suite('p5.prototype.cursor', function() {
    test('should change cursor to cross', function() {
      myp5.cursor(myp5.CROSS);
      assert.strictEqual(myp5._curElement.elt.style.cursor, 'crosshair');
    });
  });

  suite('p5.prototype.noCursor', function() {
    test('should change cursor to none', function() {
      myp5.noCursor();
      assert.strictEqual(myp5._curElement.elt.style.cursor, 'none');
    });
  });

  suite('p5.prototype.frameRate', function() {
    test('returns 0 on first draw call', function() {
      assert.strictEqual(myp5.frameRate(), 0);
    });

    test('returns current frame rate after first draw call', function() {
      return new Promise(function(resolve, reject) {
        new p5(function(p) {
          p.draw = function() {
            if (p.frameCount === 2 && p.frameRate() > 0) {
              resolve();
              p.remove();
            }
          };
        });
      });
    });

    test('wrong param type. throws error.', function() {
      assert.validationError(function() {
        myp5.frameRate('a');
      });
    });

    test('p5.prototype.getFrameRate', function() {
      assert.strictEqual(myp5.getFrameRate(), 0);
    });
  });

  suite('Canvas dimensions', function() {
    test('p5.prototype.width', function() {
      myp5.createCanvas(20, 30);
      assert.strictEqual(myp5.width, 20);
    });

    test('p5.prototype.height', function() {
      myp5.createCanvas(20, 30);
      assert.strictEqual(myp5.height, 30);
    });
  });

  suite('p5.prototype.pixelDensity', function() {
    test('returns the pixel density', function() {
      assert.isNumber(myp5.pixelDensity());
    });

    test('sets the pixel density', function() {
      myp5.pixelDensity(2);
      assert.strictEqual(myp5.pixelDensity(), 2);
    });

    test('wrong param type. throws validationError.', function() {
      assert.validationError(function() {
        myp5.pixelDensity('a');
      });
    });
  });

  suite('p5.prototype.displayDensity', function() {
    test('returns the pixel density of the display', function() {
      assert.isNumber(myp5.displayDensity());
    });

    test('pixelDensity does not change display density', function() {
      let pd = myp5.displayDensity();
      myp5.pixelDensity(pd + 1);
      assert.isNumber(myp5.displayDensity(), pd);
    });
  });

  suite('p5.prototype.lazyLog', function() {
    test('clear lazyLog cache', function() {
      let a = 5;
      let b = 10;
      myp5.lazyLog(a, 'a');
      myp5.lazyLog(b, 'b');
      assert.strictEqual(myp5.lazyLog(), false);
      assert.strictEqual(myp5.lazyLog(a, 'a'), true);
    });

    test('lazyLog new, changed, and unchanged variables', function() {
      myp5.lazyLog();
      let a = 5;
      let b = 10;
      assert.strictEqual(myp5.lazyLog(a, 'a'), true);
      assert.strictEqual(myp5.lazyLog(b, 'b'), true);
      a = a ^ b;
      b = a ^ b;
      a = a ^ b;
      assert.strictEqual(myp5.lazyLog(a, 'a'), true);
      assert.strictEqual(myp5.lazyLog(b, 'b'), true);
      assert.strictEqual(myp5.lazyLog(a, 'a'), false);
      assert.strictEqual(myp5.lazyLog(b, 'b'), false);
    });

    test('log periodically', function() {
      myp5.lazyLog();
      let a = 5;
      let b = 10;
      let logA = 0;
      let logB = 0;
      for (let i = 0; i < 25; i++) {
        if (myp5.lazyLog(a, 'a', 20)) {
          logA++;
        }
        if (myp5.lazyLog(b, 'b', 5)) {
          logB++;
        }
      }
      assert.equal(logA, 2);
      assert.equal(logB, 5);
    });
  });
});
