suite('Acceleration Events', function() {
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

  let deviceOrientationEvent1 = new DeviceOrientationEvent(
    'deviceorientation',
    {
      alpha: 10,
      beta: 45,
      gamma: 90
    }
  );

  let deviceOrientationEvent2 = new DeviceOrientationEvent(
    'deviceorientation',
    {
      alpha: 15,
      beta: 30,
      gamma: 180
    }
  );

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

  suite('deviceMoved', function() {
    test('deviceMoved must run when device is moved more than the threshold value', function() {
      let count = 0;
      myp5.deviceMoved = function() {
        count += 1;
      };
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 10 } })
      );
      assert.strictEqual(count, 1);
    });

    test('deviceMoved should not run when device is moved less than the threshold value', function() {
      let count = 0;
      myp5.deviceMoved = function() {
        count += 1;
      };
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 0.1 } })
      );
      //deviceMoved should not run since move threshold is by default 0.5
      assert.strictEqual(count, 0);
    });

    test('p5.prototype.setMoveThreshold', function() {
      let count = 0;
      myp5.deviceMoved = function() {
        count += 1;
      };
      myp5.setMoveThreshold(0.1);
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 0.1 } })
      );
      //deviceMoved should run since move threshold is set to 0.1 now
      assert.strictEqual(count, 1);
    });
  });

  suite('deviceTurned', function() {
    test('deviceTurned must run when device is turned more than 90 degrees', function() {
      let count = 0;
      myp5.deviceTurned = function() {
        count += 1;
      };
      window.dispatchEvent(
        new DeviceOrientationEvent('deviceorientation', { beta: 5 })
      );
      window.dispatchEvent(
        new DeviceOrientationEvent('deviceorientation', { beta: 100 })
      );
      assert.strictEqual(count, 1);
    });

    test('turnAxis should be X', function() {
      let count = 0;
      myp5.deviceTurned = function() {
        if (myp5.turnAxis === 'X') count += 1;
      };
      window.dispatchEvent(
        new DeviceOrientationEvent('deviceorientation', { beta: 5 })
      );
      window.dispatchEvent(
        new DeviceOrientationEvent('deviceorientation', { beta: 100 })
      );
      assert.strictEqual(count, 1);
    });
  });

  suite('deviceShaken', function() {
    test('deviceShaken must run when device acceleration is more than the threshold value', function() {
      let count = 0;
      myp5.deviceShaken = function() {
        count += 1;
      };
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 5, y: 15 } })
      );
      assert.strictEqual(count, 1);
    });

    test('deviceMoved should not run when device acceleration is less than the threshold value', function() {
      let count = 0;
      myp5.deviceShaken = function() {
        count += 1;
      };
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 10 } })
      );
      //deviceMoved should not run since shake threshold is by default 30
      assert.strictEqual(count, 0);
    });

    test('p5.prototype.setShakeThreshold', function() {
      let count = 0;
      myp5.deviceShaken = function() {
        count += 1;
      };
      myp5.setShakeThreshold(10);
      window.dispatchEvent(
        new DeviceMotionEvent('devicemotion', { acceleration: { x: 10 } })
      );
      //deviceMoved should run since shake threshold is set to 10 now
      assert.strictEqual(count, 1);
    });
  });
});
