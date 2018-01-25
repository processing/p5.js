suite('color/Setting', function() {
  // p5 instance
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

  suite('p5.prototype.colorMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.colorMode);
    });

    test('should set mode to RGB', function() {
      myp5.colorMode(myp5.RGB);
      assert.equal(myp5._colorMode, myp5.RGB);
    });

    test('should correctly set color RGB maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [255, 255, 255, 255]);
      myp5.colorMode(myp5.RGB, 1, 1, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [1, 1, 1, 255]);
      myp5.colorMode(myp5.RGB, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [1, 1, 1, 1]);
      myp5.colorMode(myp5.RGB, 255, 255, 255, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.RGB], [255, 255, 255, 1]);
      myp5.colorMode(myp5.RGB, 255);
    });

    test('should set mode to HSL', function() {
      myp5.colorMode(myp5.HSL);
      assert.equal(myp5._colorMode, myp5.HSL);
    });

    test('should correctly set color HSL maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
      myp5.colorMode(myp5.HSL, 255, 255, 255);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [255, 255, 255, 1]);
      myp5.colorMode(myp5.HSL, 360);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 360, 360, 360]);
      myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
    });

    test('should set mode to HSB', function() {
      myp5.colorMode(myp5.HSB);
      assert.equal(myp5._colorMode, myp5.HSB);
    });

    test('should correctly set color HSB maxes', function() {
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
      myp5.colorMode(myp5.HSB, 255, 255, 255);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [255, 255, 255, 1]);
      myp5.colorMode(myp5.HSB, 360);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 360, 360, 360]);
      myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
      assert.deepEqual(myp5._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
    });
  });
});
