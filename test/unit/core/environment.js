import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('Environment', function() {
  var myp5;

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
    test.todo('returns 0 on first draw call', function() {
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

    test.todo('p5.prototype.getFrameRate', function() {
      assert.strictEqual(myp5.getFrameRate(), 0);
    });

    suite.todo('drawing with target frame rates', function() {
      let clock;
      let prevRequestAnimationFrame;
      let nextFrameCallback = () => {};
      let controlledP5;

      beforeEach(function() {
        clock = vi.useFakeTimers(0);
        vi.spyOn(window.performance, 'now', Date.now);

        // Save the real requestAnimationFrame so we can restore it later
        prevRequestAnimationFrame = window.requestAnimationFrame;
        // Use a fake requestAnimationFrame that just stores a ref to the callback
        // so that we can call it manually
        window.requestAnimationFrame = function(cb) {
          nextFrameCallback = cb;
        };

        return new Promise(function(resolve) {
          controlledP5 = new p5(function(p) {
            p.setup = function() {
              p.createCanvas(10, 10);
              p.frameRate(60);
              p.loop();
              resolve(p);
            };

            p.draw = function() {};
          });
        });
      });

      afterEach(function() {
        // clock.restore();
        vi.restoreAllMocks();
        window.performance.now.restore();
        window.requestAnimationFrame = prevRequestAnimationFrame;
        nextFrameCallback = function() {};
        controlledP5.remove();
      });

      test('draw() is called at the correct frame rate given a faster display', function() {
        vi.spyOn(controlledP5, 'draw');

        clock.tick(1000 / 200); // Simulate a 200Hz refresh rate
        nextFrameCallback(); // trigger the next requestAnimationFrame
        assert(controlledP5.draw.notCalled, 'draw() should not be called before 1s/60');

        // Advance until 5ms before the next frame should render.
        // This should be within p5's threshold for rendering the frame.
        clock.tick(1000 / 60 - 1000 / 200 - 5);
        nextFrameCallback(); // trigger the next requestAnimationFrame
        assert(controlledP5.draw.calledOnce, 'one frame should have been drawn');
        // deltaTime should reflect real elapsed time
        assert.equal(controlledP5.deltaTime, 1000 / 60 - 5);

        // Advance enough time forward to be 1s/60 - 5ms from the last draw
        clock.tick(1000 / 60 - 5);
        nextFrameCallback(); // trigger the next requestAnimationFrame
        // Even though this is 1s/60 - 5ms from the last draw, the last frame came
        // in early, so we still shouldn't draw
        assert(controlledP5.draw.calledOnce, 'draw() should not be called before 1s/60 past the last target draw time');

        // Advance enough time forward to be 1s/60 from the last draw
        clock.tick(5);
        nextFrameCallback();
        assert(controlledP5.draw.calledTwice); // Now it should draw again!
        // deltaTime should reflect real elapsed time
        assert.equal(controlledP5.deltaTime, 1000 / 60);
      });
    });
  });

  suite('p5.prototype.getTargetFrameRate', function() {
    test('returns 60 on the first call', function() {
      assert.strictEqual(myp5.getTargetFrameRate(), 60);
    });

    test('returns set value of randomize integer', function() {
      let randVal = Math.floor(Math.random()*120);
      myp5.frameRate(randVal);
      assert.strictEqual(myp5.getTargetFrameRate(), randVal);
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

  suite('2D context test', function() {
    beforeEach(function() {
      myp5.createCanvas(100, 100);
    });

    test('worldToScreen for 2D context', function() {
      let worldPos = myp5.createVector(50, 50);
      let screenPos = myp5.worldToScreen(worldPos);
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 50, 0.1);
    });

    test('worldToScreen accepts numbers with translation in 2D', function() {
      myp5.push();
      myp5.translate(50, 50);
      let screenPos = myp5.worldToScreen(0, 0);
      myp5.pop();
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 50, 0.1);
    });

    test('worldToScreen with rotation in 2D', function() {
      myp5.push();
      myp5.translate(50, 50);
      myp5.rotate(myp5.PI / 2);
      let worldPos = myp5.createVector(10, 0);
      let screenPos = myp5.worldToScreen(worldPos);
      myp5.pop();
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 60, 0.1);
    });

    test('screenToWorld for 2D context', function() {
      let screenPos = myp5.createVector(50, 50);
      let worldPos = myp5.screenToWorld(screenPos);
      assert.closeTo(worldPos.x, 50, 0.1);
      assert.closeTo(worldPos.y, 50, 0.1);
    });

    test('screenToWorld accepts numbers with translation in 2D', function() {
      myp5.push();
      myp5.translate(50, 50);
      let worldPos = myp5.screenToWorld(50, 50);
      myp5.pop();
      assert.closeTo(worldPos.x, 0, 0.1);
      assert.closeTo(worldPos.y, 0, 0.1);
    });

    test('screenToWorld with rotation in 2D', function() {
      myp5.push();
      myp5.translate(50, 50);
      myp5.rotate(myp5.PI / 2);
      let screenPos = myp5.createVector(50, 60);
      let worldPos = myp5.screenToWorld(screenPos);
      myp5.pop();
      assert.closeTo(worldPos.x, 10, 0.1);
      assert.closeTo(worldPos.y, 0, 0.1);
    });

    test('screenToWorld is inverse of worldToScreen in 2D', function() {
      myp5.push();
      // Arbitrary rotation
      myp5.translate(10, 10);
      myp5.rotate(myp5.PI / 8);
      let origWorldPos = myp5.createVector(20, 20);
      let screenPos = myp5.worldToScreen(origWorldPos);
      let worldPos = myp5.screenToWorld(screenPos);
      myp5.pop();
      assert.closeTo(worldPos.x, origWorldPos.x, 0.1);
      assert.closeTo(worldPos.y, origWorldPos.y, 0.1);
    });
  });

  suite('3D context test', function() {
    beforeEach(function() {
      myp5.createCanvas(100, 100, myp5.WEBGL);
    });

    test('worldToScreen for 3D context', function() {
      let worldPos = myp5.createVector(0, 0, 0);
      let screenPos = myp5.worldToScreen(worldPos);
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 50, 0.1);
    });

    test('worldToScreen accepts numbers with translation in 3D', function() {
      myp5.push();
      myp5.translate(50, 50, 0);
      let screenPos = myp5.worldToScreen(0, 0, 0);
      myp5.pop();
      assert.closeTo(screenPos.x, 100, 0.1);
      assert.closeTo(screenPos.y, 100, 0.1);
    });

    test('worldToScreen with rotation in 3D around Y-axis', function() {
      myp5.push();
      myp5.rotateY(myp5.PI / 2);
      let worldPos = myp5.createVector(50, 0, 0);
      let screenPos = myp5.worldToScreen(worldPos);
      myp5.pop();
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 50, 0.1);
    });

    test('worldToScreen with rotation in 3D around Z-axis', function() {
      myp5.push();
      myp5.rotateZ(myp5.PI / 2);
      let worldPos = myp5.createVector(10, 0, 0);
      let screenPos = myp5.worldToScreen(worldPos);
      myp5.pop();
      assert.closeTo(screenPos.x, 50, 0.1);
      assert.closeTo(screenPos.y, 60, 0.1);
    });

    test('screenToWorld for 3D context', function() {
      let screenPos = myp5.createVector(50, 50);
      let worldPos = myp5.screenToWorld(screenPos);
      assert.closeTo(worldPos.x, 0, 0.1);
      assert.closeTo(worldPos.y, 0, 0.1);
      assert.closeTo(worldPos.z, 0, 0.1);
    });

    test('screenToWorld accepts numbers with translation in 3D', function() {
      myp5.push();
      myp5.translate(50, 50);
      let worldPos = myp5.screenToWorld(100, 100);
      myp5.pop();
      assert.closeTo(worldPos.x, 0, 0.1);
      assert.closeTo(worldPos.y, 0, 0.1);
    });

    test('screenToWorld with rotation in 3D around Y-axis', function() {
      myp5.push();
      myp5.rotateY(myp5.PI / 2);
      let screenPos = myp5.createVector(50, 50);
      let worldPos = myp5.screenToWorld(screenPos);
      myp5.pop();
      assert.closeTo(worldPos.y, 0, 0.1);
    });

    test('screenToWorld with rotation in 3D around Z-axis', function() {
      myp5.push();
      myp5.rotateZ(myp5.PI / 2);
      let screenPos = myp5.createVector(50, 60);
      let worldPos = myp5.screenToWorld(screenPos);
      myp5.pop();
      assert.closeTo(worldPos.x, 10, 0.1);
      assert.closeTo(worldPos.y, 0, 0.1);
    });

    test('screenToWorld is inverse of worldToScreen in 3D', function() {
      myp5.push();
      // Arbitrary rotation
      myp5.translate(10, 10);
      myp5.rotateX(myp5.PI / 3);
      myp5.rotateY(myp5.PI / 4);
      myp5.rotateZ(myp5.PI / 8);
      let origWorldPos = myp5.createVector(20, 20, 0);
      let screenPos = myp5.worldToScreen(origWorldPos);
      let worldPos = myp5.screenToWorld(screenPos);
      myp5.pop();
      assert.closeTo(worldPos.x, origWorldPos.x, 0.1);
      assert.closeTo(worldPos.y, origWorldPos.y, 0.1);
      assert.closeTo(worldPos.z, origWorldPos.z, 0.1);
    });
  });
});
