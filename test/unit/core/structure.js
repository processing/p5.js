suite('Structure', function() {
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

  suite('p5.prototype.loop and p5.prototype.noLoop', function() {
    test('noLoop should stop', function() {
      return new Promise(function(resolve, reject) {
        var c0 = myp5.frameCount;
        myp5.noLoop();
        myp5.draw = function() {
          var c1 = myp5.frameCount;
          // Allow one final draw to run
          if (c1 > c0 + 1) {
            reject('Entered draw');
          }
        };
        setTimeout(resolve, 100);
      });
    });

    test('loop should restart', function() {
      return new Promise(function(resolve, reject) {
        var c0 = myp5.frameCount;
        myp5.noLoop();
        myp5.draw = function() {
          var c1 = myp5.frameCount;
          // Allow one final draw to run
          if (c1 > c0 + 1) {
            reject('Entered draw');
          }
        };
        setTimeout(resolve, 100);
      }).then(function() {
        return new Promise(function(resolve, reject) {
          myp5.draw = resolve;
          myp5.loop();
          setTimeout(function() {
            reject('Failed to restart draw.');
          }, 100);
        });
      });
    });
  });

  suite('p5.prototype.push and p5.prototype.pop', function() {
    function getRenderState() {
      var state = {};
      for (var key in myp5._renderer) {
        var value = myp5._renderer[key];
        if (
          typeof value !== 'function' &&
          key !== '_cachedFillStyle' &&
          key !== '_cachedStrokeStyle'
        ) {
          state[key] = value;
        }
      }
      return state;
    }

    function assertCanPreserveRenderState(work) {
      var originalState = getRenderState();
      myp5.push();
      work();
      myp5.pop();
      assert.deepEqual(getRenderState(), originalState);
    }

    test('leak no state after fill()', function() {
      myp5.noFill();
      assertCanPreserveRenderState(function() {
        myp5.fill('red');
      });
    });

    test('leak no state after noFill()', function() {
      myp5.fill('red');
      assertCanPreserveRenderState(function() {
        myp5.noFill();
      });
    });

    test('leak no state after stroke()', function() {
      myp5.noStroke();
      assertCanPreserveRenderState(function() {
        myp5.stroke('red');
      });
    });

    test('leak no state after noStroke()', function() {
      myp5.stroke('red');
      assertCanPreserveRenderState(function() {
        myp5.noStroke();
      });
    });

    test('leak no state after tint()', function() {
      myp5.noTint();
      assertCanPreserveRenderState(function() {
        myp5.tint(255, 0, 0);
      });
    });

    test('leak no state after noTint()', function() {
      myp5.tint(255, 0, 0);
      assertCanPreserveRenderState(function() {
        myp5.noTint();
      });
    });

    test('leak no state after strokeWeight()', function() {
      myp5.strokeWeight(1);
      assertCanPreserveRenderState(function() {
        myp5.strokeWeight(10);
      });
    });

    test('leak no state after strokeCap()', function() {
      myp5.strokeCap(myp5.ROUND);
      assertCanPreserveRenderState(function() {
        myp5.strokeCap(myp5.SQUARE);
      });
    });

    test('leak no state after strokeJoin()', function() {
      myp5.strokeJoin(myp5.BEVEL);
      assertCanPreserveRenderState(function() {
        myp5.strokeJoin(myp5.MITER);
      });
    });

    test('leak no state after imageMode()', function() {
      myp5.imageMode(myp5.CORNER);
      assertCanPreserveRenderState(function() {
        myp5.imageMode(myp5.CENTER);
      });
    });

    test('leak no state after rectMode()', function() {
      myp5.rectMode(myp5.CORNER);
      assertCanPreserveRenderState(function() {
        myp5.rectMode(myp5.CENTER);
      });
    });

    test('leak no state after ellipseMode()', function() {
      myp5.ellipseMode(myp5.CORNER);
      assertCanPreserveRenderState(function() {
        myp5.ellipseMode(myp5.CENTER);
      });
    });

    test('leak no state after colorMode()', function() {
      myp5.colorMode(myp5.HSB);
      assertCanPreserveRenderState(function() {
        myp5.colorMode(myp5.RGB);
      });
    });

    test('leak no state after textAlign()', function() {
      myp5.textAlign(myp5.RIGHT, myp5.BOTTOM);
      assertCanPreserveRenderState(function() {
        myp5.textAlign(myp5.CENTER, myp5.CENTER);
      });
    });

    test('leak no state after textFont()', function() {
      myp5.textFont('Georgia');
      assertCanPreserveRenderState(function() {
        myp5.textFont('Helvetica');
      });
    });

    test('leak no state after textStyle()', function() {
      myp5.textStyle(myp5.ITALIC);
      assertCanPreserveRenderState(function() {
        myp5.textStyle(myp5.BOLD);
      });
    });

    test('leak no state after textSize()', function() {
      myp5.textSize(12);
      assertCanPreserveRenderState(function() {
        myp5.textSize(16);
      });
    });

    test('leak no state after textLeading()', function() {
      myp5.textLeading(20);
      assertCanPreserveRenderState(function() {
        myp5.textLeading(30);
      });
    });
  });

  suite('p5.prototype.redraw', function() {
    var iframe;

    teardown(function() {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    test('resets the rendering matrix between frames', function() {
      return new Promise(function(resolve, reject) {
        myp5.draw = function() {
          myp5.background(0);
          myp5.stroke(255);
          myp5.point(10, 10);
          if (myp5.get(10, 10)[0] === 0) {
            reject(new Error("Drawing matrix doesn't appear to be reset"));
          }
          myp5.rotate(10);
        };
        myp5.redraw(10);
        resolve();
      });
    });

    test('instance redraw is independent of window', function() {
      // callback for p5 instance mode.
      // It does not call noLoop so redraw will be called many times.
      // Redraw is not supposed to call window.draw even though no draw is defined in cb
      function cb(s) {
        s.setup = function() {
          setTimeout(window.afterSetup, 1000);
        };
      }
      return new Promise(function(resolve) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            '<script>',
            'globalDraws = 0;',
            'function setup() { noLoop(); }',
            'function draw() { window.globalDraws++; }',
            'new p5(' + cb.toString() + ');',
            '</script>'
          ].join('\n')
        );
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        var win = iframe.elt.contentWindow;
        assert.strictEqual(win.globalDraws, 1);
      });
    });
  });

  suite('loop', function() {
    testSketchWithPromise('loop in setup does not call draw', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.setup = function() {
        sketch.loop();
        resolve();
      };

      sketch.draw = function() {
        reject(new Error('Entered draw during loop()'));
      };
    });

    testSketchWithPromise('loop in draw does not call draw', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.draw = function() {
        if (sketch.frameCount > 1) {
          reject(new Error('re-entered draw during loop() call'));
        }
        sketch.loop();
        resolve();
      };
    });
  });
});
