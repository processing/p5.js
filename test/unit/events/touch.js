suite('Touch Events', function() {
  let myp5;

  let canvas;
  let touchObj1;
  let touchObj2;
  let touchEvent1;
  let touchEvent2;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        canvas = myp5._curElement.elt;
        touchObj1 = new Touch({
          target: canvas,
          clientX: 100,
          clientY: 100,
          identifier: 36
        });
        touchObj2 = new Touch({
          target: canvas,
          clientX: 200,
          clientY: 200,
          identifier: 35
        });
        touchEvent1 = new TouchEvent('touchmove', {
          touches: [touchObj1, touchObj2]
        });
        touchEvent2 = new TouchEvent('touchmove', {
          touches: [touchObj2]
        });
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.touches', function() {
    test('should be an empty array', function() {
      assert.deepEqual(myp5.touches, []);
    });

    test('should be an array of multiple touches', function() {
      window.dispatchEvent(touchEvent1);
      assert.strictEqual(myp5.touches.length, 2);
    });

    test('should contain the touch registered', function() {
      window.dispatchEvent(touchEvent2);
      assert.strictEqual(myp5.touches[0].id, 35);
    });
  });

  suite('touchStarted', function() {
    test('touchStarted should be fired when a touch is registered', function() {
      let count = 0;
      myp5.touchStarted = function() {
        count += 1;
      };
      window.dispatchEvent(new TouchEvent('touchstart'));
      assert.strictEqual(count, 1);
    });

    test('should be fired when a touch starts over the element', function() {
      let count = 0;
      let div = myp5.createDiv();
      let divTouchStarted = function() {
        count += 1;
      };
      div.touchStarted(divTouchStarted);
      div.elt.dispatchEvent(new TouchEvent('touchstart'));
      assert.strictEqual(count, 1);
    });

    test('touchStarted functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.touchStarted = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new TouchEvent('touchstart'));
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result;
      assert.deepEqual(counts, [1, 1]);
    });
  });

  suite('touchMoved', function() {
    test('touchMoved should be fired when a touchmove is registered', function() {
      let count = 0;
      myp5.touchMoved = function() {
        count += 1;
      };
      window.dispatchEvent(touchEvent2);
      assert.strictEqual(count, 1);
    });

    test('should be fired when a touchmove is registered over the element', function() {
      let count = 0;
      let div = myp5.createDiv();
      let divTouchMoved = function() {
        count += 1;
      };
      div.touchMoved(divTouchMoved);
      div.elt.dispatchEvent(touchEvent2);
      assert.strictEqual(count, 1);
    });

    test('touchMoved functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.touchMoved = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(touchEvent2);
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result;
      assert.deepEqual(counts, [1, 1]);
    });
  });

  suite('touchEnded', function() {
    test('touchEnded must run when a touch is registered', function() {
      let count = 0;
      myp5.touchEnded = function() {
        count += 1;
      };
      window.dispatchEvent(new TouchEvent('touchend'));
      assert.strictEqual(count, 1);
    });

    test('should be fired when a touch starts over the element', function() {
      let count = 0;
      let div = myp5.createDiv();
      let divTouchEnded = function() {
        count += 1;
      };
      div.touchEnded(divTouchEnded);
      div.elt.dispatchEvent(new TouchEvent('touchend'));
      assert.strictEqual(count, 1);
    });

    test('touchEnded functions on multiple instances must run once', async function() {
      let sketchFn = function(sketch, resolve, reject) {
        let count = 0;
        sketch.touchEnded = function() {
          count += 1;
        };

        sketch.finish = function() {
          resolve(count);
        };
      };
      let sketches = parallelSketches([sketchFn, sketchFn]); //create two sketches
      await sketches.setup; //wait for all sketches to setup
      window.dispatchEvent(new TouchEvent('touchend'));
      sketches.end(); //resolve all sketches by calling their finish functions
      let counts = await sketches.result;
      assert.deepEqual(counts, [1, 1]);
    });
  });
});
