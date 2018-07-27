suite('p5.Camera', function() {
  var myp5;
  var myCam;
  var delta = 0.001;

  // copy of p5.Vector.prototype.angleBetween...
  var angleBetween = function(a1, a2, a3, b1, b2, b3) {
    var dotProd = a1 * b1 + a2 * b2 + a3 * b3;
    var dotmagmag =
      dotProd /
      (Math.sqrt(a1 * a1 + a2 * a2 + a3 * a3) *
        Math.sqrt(b1 * b1 + b2 * b2 + b3 * b3));
    // Mathematically speaking: the dotmagmag variable will be between -1 and 1
    // inclusive. Practically though it could be slightly outside this range due
    // to floating-point rounding issues. This can make Math.acos return NaN.
    //
    // Solution: we'll clamp the value to the -1,1 range
    var angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
    return angle;
  };

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        myCam = p.createCamera();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('createCamera()', function() {
    test('creates a p5.Camera object', function() {
      var myCam2 = myp5.createCamera();
      assert.instanceOf(myCam2, p5.Camera);
    });

    test('createCamera attaches p5.Camera to renderer', function() {
      var myCam2 = myp5.createCamera();
      assert.deepEqual(myCam2, myp5._renderer._curCamera);
    });
  });

  suite('Rotation', function() {
    test('Pan() back and forth should result in similar centerXYZ', function() {
      var originalCenterXYZ = {
        x: myCam.centerX,
        y: myCam.centerY,
        z: myCam.centerZ
      };
      for (let i = 0; i < 20; i++) {
        myCam.pan(1);
        myCam.pan(-1);
      }
      assert.closeTo(myCam.centerX, originalCenterXYZ.x, delta);
      assert.closeTo(myCam.centerY, originalCenterXYZ.y, delta);
      assert.closeTo(myCam.centerZ, originalCenterXYZ.z, delta);
    });

    test('Tilt() back and forth should result in similar centerXYZ', function() {
      var originalCenterXYZ = {
        x: myCam.centerX,
        y: myCam.centerY,
        z: myCam.centerZ
      };
      for (let i = 0; i < 20; i++) {
        myCam.tilt(1);
        myCam.tilt(-1);
      }

      assert.closeTo(myCam.centerX, originalCenterXYZ.x, delta);
      assert.closeTo(myCam.centerY, originalCenterXYZ.y, delta);
      assert.closeTo(myCam.centerZ, originalCenterXYZ.z, delta);
    });
  });

  suite('Position / Orientation', function() {
    test('Camera() sets eye, center, and up XYZ properties', function() {
      myCam.camera(1, 1, 1, 2, 2, 2, 0, 0, 1);
      assert.strictEqual(myCam.eyeX, 1);
      assert.strictEqual(myCam.eyeY, 1);
      assert.strictEqual(myCam.eyeZ, 1);
      assert.strictEqual(myCam.centerX, 2);
      assert.strictEqual(myCam.centerY, 2);
      assert.strictEqual(myCam.centerZ, 2);
      assert.strictEqual(myCam.upX, 0);
      assert.strictEqual(myCam.upY, 0);
      assert.strictEqual(myCam.upZ, 1);
    });

    test('LookAt() should set centerXYZ without changing eyeXYZ or upXYZ', function() {
      var vals = {
        eyeX: myCam.eyeX,
        eyeY: myCam.eyeY,
        eyeZ: myCam.eyeZ,
        upX: myCam.upX,
        upY: myCam.upY,
        upZ: myCam.upZ
      };
      myCam.lookAt(23, 23, 23);
      assert.strictEqual(myCam.centerX, 23);
      assert.strictEqual(myCam.centerY, 23);
      assert.strictEqual(myCam.centerZ, 23);
      assert.strictEqual(myCam.eyeX, vals.eyeX);
      assert.strictEqual(myCam.eyeY, vals.eyeY);
      assert.strictEqual(myCam.eyeZ, vals.eyeZ);
      assert.strictEqual(myCam.upX, vals.upX);
      assert.strictEqual(myCam.upY, vals.upY);
      assert.strictEqual(myCam.upZ, vals.upZ);
    });

    test('Move() back and forth should result in similar eyeXYZ', function() {
      var originalEyeXYZ = {
        x: myCam.eyeX,
        y: myCam.eyeY,
        z: myCam.eyeZ
      };

      for (let i = 0; i < 20; i++) {
        var myVec = {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        };
        myCam.move(myVec.x, myVec.y, myVec.z);
        myCam.move(-1 * myVec.x, -1 * myVec.y, -1 * myVec.z);
      }
      assert.closeTo(myCam.eyeX, originalEyeXYZ.x, delta);
      assert.closeTo(myCam.eyeY, originalEyeXYZ.y, delta);
      assert.closeTo(myCam.eyeZ, originalEyeXYZ.z, delta);
    });

    test('SetPosition() should set eyeXYZ', function() {
      var pos = Math.random();

      myCam.setPosition(pos, pos, pos);

      assert.strictEqual(myCam.eyeX, pos);
      assert.strictEqual(myCam.eyeY, pos);
      assert.strictEqual(myCam.eyeZ, pos);
    });
  });

  suite('Projection', function() {
    suite('ortho()', function() {
      test('ortho() sets renderer uPMatrix', function() {
        myCam.ortho(-10, 10, -10, 10, 0, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });

      test('ortho() sets projection matrix correctly', function() {
        // control array needs to match Float32Array type of
        // p5.Camera projMatrix's mat4 array for deepEqual to work
        //prettier-ignore
        var control = new Float32Array(
                      [1,  0,  0, 0,
                       0, -1,  0, 0,
                       0,  0, -1, 0,
                      -0, -0, -1, 1]);

        myCam.ortho(-1, 1, -1, 1, 0, 2);

        assert.deepEqual(myCam.projMatrix.mat4, control);
      });

      // test('ortho() with all 0 parameters', function() {
      //   myCam.ortho(0, 0, 0, 0, 0, 0);
      //   assert.deepEqual(myCam.projMatrix.mat4, control);
      // });
    });
    suite('perspective()', function() {
      test('perspective() sets renderer uPMatrix', function() {
        myCam.perspective(Math.PI / 3.0, 1, 1, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });
      test('perspective() sets projection matrix correctly', function() {
        // control array needs to match Float32Array type of
        // p5.Camera projMatrix's mat4 array for deepEqual to work
        //prettier-ignore
        var control = new Float32Array(
                      [1,  0,   0,  0,
                       0, -1,   0,  0,
                       0,  0,  -3, -1,
                       0,  0, -40,  0]);

        myCam.perspective(Math.PI / 2, 1, 10, 20);

        assert.deepEqual(myCam.projMatrix.mat4, control);
      });
    });
  });

  suite('Helper Functions', function() {
    test('copy() returns a new p5.Camera object', function() {
      var newCam = myCam.copy();
      assert.instanceOf(newCam, p5.Camera);

      assert.equal(newCam.cameraFOV, myCam.cameraFOV);
      assert.equal(newCam.aspectRatio, myCam.aspectRatio);
      assert.equal(newCam.eyeX, myCam.eyeX);
      assert.equal(newCam.eyeY, myCam.eyeY);
      assert.equal(newCam.eyeZ, myCam.eyeZ);
      assert.equal(newCam.centerX, myCam.centerX);
      assert.equal(newCam.centerY, myCam.centerY);
      assert.equal(newCam.centerZ, myCam.centerZ);
      assert.equal(newCam.cameraNear, myCam.cameraNear);
      assert.equal(newCam.cameraFar, myCam.cameraFar);

      assert.equal(newCam.cameraType, myCam.cameraType);

      assert.deepEqual(newCam.cameraMatrix.mat4, myCam.cameraMatrix.mat4);
      assert.deepEqual(newCam.projMatrix.mat4, myCam.projMatrix.mat4);
      // assert.deepEqual(newCam, myCam);
    });

    test('_getLocalAxes() returns three normalized, orthogonal vectors', function() {
      var local = myCam._getLocalAxes();

      // assert that returned values are numbers
      for (let j = 0; j < 3; j++) {
        assert.typeOf(local.x[j], 'number');
        assert.typeOf(local.y[j], 'number');
        assert.typeOf(local.z[j], 'number');
      }

      // assert vectors are normalized
      assert.equal(
        Math.sqrt(
          local.x[0] * local.x[0] +
            local.x[1] * local.x[1] +
            local.x[2] * local.x[2]
        ),
        1
      );
      assert.equal(
        Math.sqrt(
          local.y[0] * local.y[0] +
            local.y[1] * local.y[1] +
            local.y[2] * local.y[2]
        ),
        1
      );
      assert.equal(
        Math.sqrt(
          local.z[0] * local.z[0] +
            local.z[1] * local.z[1] +
            local.z[2] * local.z[2]
        ),
        1
      );

      // assert vectors are orthogonal to one another using angleBetween
      // function from p5.Vector:
      var angleXY = angleBetween(
        local.x[0],
        local.x[1],
        local.x[2],
        local.y[0],
        local.y[1],
        local.y[2]
      );
      var angleYZ = angleBetween(
        local.z[0],
        local.z[1],
        local.z[2],
        local.y[0],
        local.y[1],
        local.y[2]
      );
      var angleXZ = angleBetween(
        local.x[0],
        local.x[1],
        local.x[2],
        local.z[0],
        local.z[1],
        local.z[2]
      );
      assert.closeTo(angleXY, Math.PI / 2, delta);
      assert.closeTo(angleYZ, Math.PI / 2, delta);
      assert.closeTo(angleXZ, Math.PI / 2, delta);
    });
  });

  suite('RendererGL Current Camera', function() {
    test('_isActive() returns true for a camera created with createCamera(),\
     and false for another p5.Camera', function() {
      var myCam2 = myp5.createCamera();
      assert.isTrue(myCam2._isActive());
      assert.isFalse(myCam._isActive());
    });
    test('setCamera() correctly sets RendererGL current camera', function() {
      var myCam2 = myp5.createCamera();
      var myCam3 = myp5.createCamera();
      myp5.setCamera(myCam2);
      assert.deepEqual(myCam2, myp5._renderer._curCamera);
      myp5.setCamera(myCam3);
      assert.deepEqual(myCam3, myp5._renderer._curCamera);
      myp5.setCamera(myCam);
      assert.deepEqual(myCam, myp5._renderer._curCamera);
    });
  });
});
