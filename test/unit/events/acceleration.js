/*suite.only('Acceleration Events', function() {
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

  let deviceMotionEvent1 = new DeviceMotionEvent('devicemotion', {
    acceleration: { x: 10, y: 20, z: 30 }
  });
  let deviceMotionEvent2 = new DeviceMotionEvent('devicemotion', {
    acceleration: { x: 20, y: 40, z: 10 }
  });
  let deviceOrientationEvent1 = new DeviceOrientationEvent('deviceorientation', {
    alpha: 10,
    beta: 45,
    gamma: 90
  });
  let deviceOrientationEvent2 = new DeviceOrientationEvent('deviceorientation', {
    alpha: 15,
    beta: 30,
    gamma: 180
  });

  suite('acceleration', function() {
    test('accelerationX should be 20', function() {
      window.dispatchEvent(deviceMotionEvent1);
      assert.strictEqual(myp5.accelerationX, 20);
    });
    test('accelerationY should be 40', function() {
      window.dispatchEvent(deviceMotionEvent1);
      assert.strictEqual(myp5.accelerationY, 40);
    });
    test('accelerationZ should be 60', function() {
      window.dispatchEvent(deviceMotionEvent1);
      assert.strictEqual(myp5.accelerationZ, 60);
    });
  });

  suite('previous acceleration', function() {
    test('pAccelerationX should be 20', function() {
      window.dispatchEvent(deviceMotionEvent1);
      window.dispatchEvent(deviceMotionEvent2);
      assert.strictEqual(myp5.pAccelerationX, 20);
    });
    test('pAccelerationY should be 40', function() {
      window.dispatchEvent(deviceMotionEvent1);
      window.dispatchEvent(deviceMotionEvent2);
      assert.strictEqual(myp5.pAccelerationY, 40);
    });
    test('pAccelerationZ should be 60', function() {
      window.dispatchEvent(deviceMotionEvent1);
      window.dispatchEvent(deviceMotionEvent2);
      assert.strictEqual(myp5.pAccelerationZ, 60);
    });
  });

  suite('rotation', function() {
    test('rotationX should be 45', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      assert.strictEqual(myp5.rotationX, 45);
    });
    test('rotationY should be 90', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      assert.strictEqual(myp5.rotationY, 90);
    });
    test('rotationZ should be 10', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      assert.strictEqual(myp5.rotationZ, 10);
    });
  });

  suite('previous rotation', function() {
    test('pRotationX should be 45', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      window.dispatchEvent(deviceOrientationEvent2);
      assert.strictEqual(myp5.pRotationX, 45);
    });
    test('pRotationY should be 90', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      window.dispatchEvent(deviceOrientationEvent2);
      assert.strictEqual(myp5.pRotationY, 90);
    });
    test('pRotationZ should be 10', function() {
      window.dispatchEvent(deviceOrientationEvent1);
      window.dispatchEvent(deviceOrientationEvent2);
      assert.strictEqual(myp5.pRotationZ, 10);
    });
  });

  suite('deviceTurned', function() {
    test('deviceTurned must run when device is turned more than 90 degrees', function() {
      let count = 0;
      myp5.deviceTurned = function() {
        count += 1;
      };
      window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 100 }));
      assert.strictEqual(count, 1);
    });

    test('turnAxis should be X', function() {
      let count = 0;
      myp5.deviceTurned = function() {
        if (myp5.turnAxis == 'X')
          count += 1;
      };
      window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 10 }));
      assert.strictEqual(count, 1);
    });
  });
}); */
