suite('p5.Camera', function() {
  var myp5;
  var myCam;
  var delta = 0.001;

  // returns values to test which have changed
  var getVals = function(cam) {
    return {
      ex: cam.eyeX,
      ey: cam.eyeY,
      ez: cam.eyeZ,
      cx: cam.centerX,
      cy: cam.centerY,
      cz: cam.centerZ,
      ux: cam.upX,
      uy: cam.upY,
      uz: cam.upZ
    };
  };

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        myCam = p.createCamera();
        // set camera defaults below according to current default values
        // all the 'expectedMatrix' matrices below are based on these defaults...
        myCam.camera(
          0,
          0,
          100 / 2.0 / Math.tan(Math.PI * 30.0 / 180.0),
          0,
          0,
          0,
          0,
          1,
          0
        );
        myCam.perspective(
          Math.PI / 3.0,
          1,
          myCam.eyeZ / 10.0,
          myCam.eyeZ * 10.0
        );
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
    test('Pan() with positive parameter sets correct matrix w/o changing\
     eyeXYZ or upXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        0.5403022766113281, -0, 0.8414710164070129, 0,
        0, 1, 0, 0,
        -0.8414710164070129, 0, 0.5403022766113281, 0,
        72.87352752685547, 0, -46.79154968261719, 1
      ]);

      myCam.pan(1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');

      assert.strictEqual(myCam.upX, orig.ux, 'up X pos changed');
      assert.strictEqual(myCam.upY, orig.uy, 'up Y pos changed');
      assert.strictEqual(myCam.upZ, orig.uz, 'up Z pos changed');
    });

    test('Pan() with negative parameter sets correct matrix w/o changing\
     eyeXYZ or upXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        0.5403022766113281, 0, -0.8414710164070129, 0,
        -0, 1, 0, 0,
        0.8414710164070129, 0, 0.5403022766113281, 0,
        -72.87352752685547, 0, -46.79154968261719, 1
      ]);

      myCam.pan(-1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');

      assert.strictEqual(myCam.upX, orig.ux, 'up X pos changed');
      assert.strictEqual(myCam.upY, orig.uy, 'up Y pos changed');
      assert.strictEqual(myCam.upZ, orig.uz, 'up Z pos changed');
    });
    test('Pan(0) sets correct matrix w/o changing eyeXYZ or upXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -86.6025390625, 1]);

      myCam.pan(0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');

      assert.strictEqual(myCam.upX, orig.ux, 'up X pos changed');
      assert.strictEqual(myCam.upY, orig.uy, 'up Y pos changed');
      assert.strictEqual(myCam.upZ, orig.uz, 'up Z pos changed');
    });

    test('Tilt() with positive parameter sets correct Matrix w/o \
    changing eyeXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 0.07073719799518585, -0.9974949955940247, 0,
        -0, 0.9974949955940247, 0.07073719799518585, 0,
        0, -86.3855972290039, -6.126020908355713, 1
      ]);

      myCam.tilt(1.5);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });

    test('Tilt() with negative parameter sets correct matrix w/o \
    changing eyeXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 0.07073719799518585, 0.9974949955940247, 0,
        0, -0.9974949955940247, 0.07073719799518585, 0,
        0, 86.3855972290039, -6.126020908355713, 1
      ]);

      myCam.tilt(-1.5);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });
    test('Tilt(0) sets correct matrix w/o changing eyeXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -86.6025390625, 1
      ]);

      myCam.tilt(0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });

    test('LookAt() should set centerXYZ without changing eyeXYZ or \
    upXYZ', function() {
      var orig = getVals(myCam);

      myCam.lookAt(10, 20, 30);

      assert.strictEqual(myCam.centerX, 10);
      assert.strictEqual(myCam.centerY, 20);
      assert.strictEqual(myCam.centerZ, 30);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');

      assert.strictEqual(myCam.upX, orig.ux, 'up X pos changed');
      assert.strictEqual(myCam.upY, orig.uy, 'up Y pos changed');
      assert.strictEqual(myCam.upZ, orig.uz, 'up Z pos changed');
    });
  });

  suite('Rotation with angleMode(DEGREES)', function() {
    setup(function() {
      myp5.push();
      myp5.angleMode(myp5.DEGREES);
    });

    teardown(function() {
      myp5.pop();
    });

    test('Pan() with positive parameter sets correct matrix w/o changing\
     eyeXYZ or upXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array([
        0.5403022766113281, -0, 0.8414710164070129, 0,
        0, 1, 0, 0,
        -0.8414710164070129, 0, 0.5403022766113281, 0,
        72.87352752685547, 0, -46.79154968261719, 1
      ]);

      myCam.pan(1 * 180 / Math.PI);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');

      assert.strictEqual(myCam.upX, orig.ux, 'up X pos changed');
      assert.strictEqual(myCam.upY, orig.uy, 'up Y pos changed');
      assert.strictEqual(myCam.upZ, orig.uz, 'up Z pos changed');
    });

    test('Tilt() with positive parameter sets correct Matrix w/o \
    changing eyeXYZ', function() {
      var orig = getVals(myCam);

      var expectedMatrix = new Float32Array(
        [1, 0, 0, 0,
          0, 0.07073719799518585, -0.9974949955940247, 0,
          -0, 0.9974949955940247, 0.07073719799518585, 0,
          0, -86.3855972290039, -6.126020908355713, 1]);

      myCam.tilt(1.5 * 180 / Math.PI);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });
  });

  suite('Position / Orientation', function() {
    suite('Camera()', function() {
      test('Camera() with positive parameters sets eye, center, and \
      up XYZ properties', function() {
        myCam.camera(1, 2, 3, 4, 5, 6, 0, 1, 0);

        assert.strictEqual(myCam.eyeX, 1);
        assert.strictEqual(myCam.eyeY, 2);
        assert.strictEqual(myCam.eyeZ, 3);

        assert.strictEqual(myCam.centerX, 4);
        assert.strictEqual(myCam.centerY, 5);
        assert.strictEqual(myCam.centerZ, 6);

        assert.strictEqual(myCam.upX, 0);
        assert.strictEqual(myCam.upY, 1);
        assert.strictEqual(myCam.upZ, 0);
      });
      test('Camera() with negative parameters sets eye, center, and \
      up XYZ properties', function() {
        myCam.camera(-1, -2, -3, -4, -5, -6, 0, -1, 0);

        assert.strictEqual(myCam.eyeX, -1);
        assert.strictEqual(myCam.eyeY, -2);
        assert.strictEqual(myCam.eyeZ, -3);

        assert.strictEqual(myCam.centerX, -4);
        assert.strictEqual(myCam.centerY, -5);
        assert.strictEqual(myCam.centerZ, -6);

        assert.strictEqual(myCam.upX, 0);
        assert.strictEqual(myCam.upY, -1);
        assert.strictEqual(myCam.upZ, 0);
      });
    });

    test('Move() with positive parameters sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -1, -2, -89.6025390625, 1
      ]);

      myCam.move(1, 2, 3);
      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('Move() with negative parameters sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 2, -83.6025390625, 1
      ]);

      myCam.move(-1, -2, -3);
      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('Move(0,0,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -86.6025390625, 1
      ]);

      myCam.move(0, 0, 0);
      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('SetPosition() with positive parameters sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -1, -2, -3, 1
      ]);

      myCam.setPosition(1, 2, 3);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('SetPosition() with negative parameters sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 2, 3, 1
      ]);

      myCam.setPosition(-1, -2, -3);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('SetPosition(0,0,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);

      myCam.setPosition(0, 0, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('_orbit(1,0,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        0.5403022766113281, -5.1525235865883254e-17, 0.8414709568023682, 0,
        0, 1, 6.123234262925839e-17, 0,
        -0.8414709568023682, -3.3083975336675e-17, 0.5403022766113281, 0,
        8.216248374992574e-7, -7.180680227154989e-23, -86.6025390625, 1
      ]);

      myCam._orbit(1, 0, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(0,1,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 0.5403022766113281, -0.8414709568023682, 0,
        -0, 0.8414709568023682, 0.5403022766113281, 0,
        0, -8.216248374992574e-7, -86.6025390625, 1
      ]);

      myCam._orbit(0, 1, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(0,0,1) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 6.123234262925839e-17, 0,
        0, -6.123234262925839e-17, 1, 0,
        0, 2.3139252783628976e-21, -866.025390625, 1
      ]);

      myCam._orbit(0, 0, 1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(-1,0,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        0.5403022766113281, 5.1525235865883254e-17, -0.8414709568023682, 0,
        -0, 1, 6.123234262925839e-17, 0,
        0.8414709568023682, -3.3083975336675e-17, 0.5403022766113281, 0,
        -8.216248374992574e-7, -7.180680227154989e-23, -86.6025390625, 1
      ]);

      myCam._orbit(-1, 0, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(0,-1,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 0.5403022766113281, 0.8414709568023682, 0,
        0, -0.8414709568023682, 0.5403022766113281, 0,
        0, 8.216248374992574e-7, -86.6025390625, 1
      ]);

      myCam._orbit(0, -1, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(0,0,-1) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 6.123234262925839e-17, 0,
        0, -6.123234262925839e-17, 1, 0,
        0, 2.3139253036064466e-23, -8.66025447845459, 1
      ]);

      myCam._orbit(0, 0, -1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit() does not force up vector to be parallel to y-axis', function() {
      // Check the shape of the camera matrix to make sure that the up vector
      // does not become (0,1,0) or (0,-1,0) after running _orbit()
      var expectedMatrix = new Float32Array([
        -0.2129584103822708, 0.9760860204696655, -0.04364387318491936, 0,
        -0.9770612716674805, -0.21274586021900177, 0.009512536227703094, 0,
        -0, 0.04466851428151131, 0.9990018606185913, 0,
        2.445493976210855e-7, -1.4983223195486062e-7, -866.025390625, 1
      ]);

      myCam.camera(100, 100, 100, 0, 0, 0, 0, 0, -1);
      myCam._orbit(1, 1, 1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('up vector of an arbitrary direction reverses by _orbit(0,PI,0)', function() {
      // Make sure the up vector is reversed by doing _orbit(0, Math.PI, 0)
      myCam.camera(100, 100, 100, 0, 0, 0, 1, 2, 3);
      const prevUpX = myCam.upX;
      const prevUpY = myCam.upY;
      const prevUpZ = myCam.upZ;
      myCam._orbit(0, Math.PI, 0);
      const currUpX = myCam.upX;
      const currUpY = myCam.upY;
      const currUpZ = myCam.upZ;

      expect(currUpX).to.be.closeTo(-prevUpX, 0.001);
      expect(currUpY).to.be.closeTo(-prevUpY, 0.001);
      expect(currUpZ).to.be.closeTo(-prevUpZ, 0.001);
    });
    test('_orbit() ensures myCam.upY switches direction (from 1 to -1) at camPhi <= 0', function() {
      // the following should produce the upY with inverted direction(from 1 to -1)
      // when camPhi changes from positive to negative or zero
      myCam._orbit(0, -Math.PI, 0);
      // upY should switch from 1(dPhi=0) to -1 (dPhi=-PI)
      // myCam.upY should be -1
      assert(myCam.upY === -1);
    });
    test('_orbit() ensures myCam.upY switches direction (from -1 to 1) at camPhi <= 0', function() {
      // the following should produce the upY with inverted direction(from -1 to 1)
      // when camPhi changes from negative to positive or zero
      myCam._orbit(0, -Math.PI, 0);
      myCam._orbit(0, Math.PI, 0);
      // upY should switch from -1(dPhi=-PI) to 1 (dPhi=PI)
      // myCam.upY should be 1
      assert(myCam.upY === 1);
    });
    test('_orbit() ensures myCam.upY switches direction (from 1 to -1) at camPhi >= PI', function() {
      // the following should produce the upY with inverted direction(from 1 to -1)
      // when camPhi reaches PI
      myCam._orbit(0, Math.PI, 0);
      // upY should switch from 1(dPhi=0) to -1 (dPhi=PI)
      // myCam.upY should be -1
      assert(myCam.upY === -1);
    });
    test('_orbit() ensures myCam.upY switches direction (from -1 to 1) at camPhi >= PI', function() {
      // the following should produce the upY with inverted direction(from -1 to 1)
      // when camPhi reaches PI
      myCam._orbit(0, Math.PI, 0);
      myCam._orbit(0, -Math.PI, 0);
      // upY should switch from -1(dPhi=PI) to 1 (dPhi=-PI)
      // myCam.upY should be 1
      assert(myCam.upY === 1);
    });
    test('_orbit() ensures camera can do multiple continuous 360deg rotations', function() {
      // the following should produce two camera objects having same properties.
      myCam._orbit(0, Math.PI, 0);
      var myCamCopy = myCam.copy();
      myCamCopy._orbit(0, Math.PI, 0);
      myCamCopy._orbit(0, Math.PI, 0);
      for (let i = 0; i < myCamCopy.cameraMatrix.mat4.length; i++) {
        expect(
          myCamCopy.cameraMatrix.mat4[i]).to.be.closeTo(
          myCam.cameraMatrix.mat4[i], 0.001);
      }
    });
    test('Returns to the origin after a 360° rotation regardless of the up vector', function() {
      // Even if the up vector is not (0,1,0) or (0,-1,0), _orbit() makes sure that
      // the camera returns to its original position when rotated 360 degrees vertically.
      myCam.camera(100, 100, 100, 0, 0, 0, 1, 2, 3);
      var myCamCopy = myCam.copy();
      // Performing 200 rotations of Math.PI*0.01 makes exactly one rotation.
      for (let i = 0; i < 200; i++) {
        myCamCopy._orbit(0, Math.PI * 0.01, 0);
      }
      for (let i = 0; i < myCamCopy.cameraMatrix.mat4.length; i++) {
        expect(
          myCamCopy.cameraMatrix.mat4[i]).to.be.closeTo(
          myCam.cameraMatrix.mat4[i], 0.001);
      }
    });
    test('_orbit() ensures radius > 0', function() {
      // the following should produce two camera objects having same properties.
      myCam._orbit(0, Math.PI, 0);
      var myCamCopy = myCam.copy();
      myCamCopy._orbit(0, 0, -100);
      myCam._orbit(0, 0, -250);
      assert.deepEqual(myCam.cameraMatrix.mat4, myCamCopy.cameraMatrix.mat4, 'deep equal is failing');
    });
    test('_orbitFree(1,0,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        0.5403022766113281, 0, -0.8414709568023682, 0,
        -0, 1, 0, 0,
        0.8414709568023682, 0, 0.5403022766113281, 0,
        -8.216248374992574e-7, 0, -86.6025390625, 1
      ]);

      myCam._orbitFree(1, 0, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbitFree(0,1,0) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, -2.8148363983860944e-17, -5.1525235865883254e-17, 0,
        -2.8148363983860944e-17, 0.5403022766113281, -0.8414709568023682, 0,
        5.1525235865883254e-17, 0.8414709568023682, 0.5403022766113281, 0,
        1.8143673340160988e-22, -8.216248374992574e-7, -86.6025390625, 1
      ]);

      myCam._orbitFree(0, 1, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbitFree(0,0,1) sets correct matrix', function() {
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -866.025390625, 1
      ]);

      myCam._orbitFree(0, 0, 1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('Rotate camera 360° with _orbitFree() returns it to its original position', function() {
      // Rotate the camera 360 degrees in any direction using _orbitFree()
      // and it will return to its original state.
      myCam.camera(100, 100, 100, 0, 0, 0, 1, 2, 3);
      var myCamCopy = myCam.copy();
      // Performing 200 rotations of Math.PI*0.01 makes exactly one rotation.
      // However, we test in a slightly slanted direction instead of parallel with axis.
      for (let i = 0; i < 200; i++) {
        myCamCopy._orbitFree(Math.PI * 0.006, Math.PI * 0.008, 0);
      }
      for (let i = 0; i < myCamCopy.cameraMatrix.mat4.length; i++) {
        expect(
          myCamCopy.cameraMatrix.mat4[i]).to.be.closeTo(
          myCam.cameraMatrix.mat4[i], 0.001);
      }
    });
  });

  suite('Projection', function() {
    suite('ortho()', function() {
      test('ortho() sets renderer uPMatrix', function() {
        myCam.ortho(-10, 10, -10, 10, 0, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });

      test('ortho() sets projection matrix correctly', function() {
        // expectedMatrix array needs to match Float32Array type of
        // p5.Camera projMatrix's mat4 array for deepEqual to work
        /* eslint-disable indent */
        var expectedMatrix = new Float32Array([
           1,  0,  0,  0,
           0, -1,  0,  0,
           0,  0, -1,  0,
          -0, -0, -1,  1
        ]);
        /* eslint-enable indent */

        myCam.ortho(-1, 1, -1, 1, 0, 2);

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('ortho() with no parameters specified (sets default)', function() {
        var expectedMatrix = new Float32Array([
          0.019999999552965164, 0, 0, 0,
          0, -0.019999999552965164, 0,0,
          0,0,-0.019999999552965164,0,
          -0,-0,-1,1
        ]);
        myCam.ortho();
        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('ortho() with sets cameraType to custom', function() {
        myCam.ortho();
        assert.deepEqual(myCam.cameraType, 'custom');
      });
    });
    suite('perspective()', function() {
      test('perspective() sets renderer uPMatrix', function() {
        myCam.perspective(Math.PI / 3.0, 1, 1, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });
      test('perspective() sets projection matrix correctly', function() {
        var expectedMatrix = new Float32Array([
          1,  0,   0,  0,
          0, -1,   0,  0,
          0,  0,  -3, -1,
          0,  0, -40,  0
        ]);

        myCam.perspective(Math.PI / 2, 1, 10, 20);

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('perspective() with no parameters specified (sets default)', function() {
        var expectedMatrix = new Float32Array([
          1.7320507764816284,0,0,0,
          0,-1.7320507764816284,0,0,
          0,0,-1.0202020406723022,-1,
          0,0,-17.49546241760254,0
        ]);

        myCam.perspective();

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('perspective() with no parameters sets cameraType to default', function() {
        myCam.perspective();
        assert.deepEqual(myCam.cameraType, 'default');
      });
    });
    suite('frustum()', function() {
      test('frustum() sets renderer uPMatrix', function() {
        myCam.frustum(-10, 10, -20, 20, -100, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });
      test('frustum() sets projection matrix correctly', function() {
        /* eslint-disable indent */
        var expectedMatrix = new Float32Array([
          -2,  0,  0,  0,
           0,  2,  0,  0,
           0,  0, -0, -1,
           0,  0,  2,  0
        ]);
        /* eslint-enable indent */

        myCam.frustum(-1, 1, -1, 1, -2, 2);

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('frustum() with no parameters specified (sets default)', function() {
        var expectedMatrix = new Float32Array([
          1.7320507764816284, 0, 0, 0,
          0, 1.7320507764816284, 0, 0,
          0, -0, -1.0202020406723022, -1,
          0, 0, -17.49546241760254, 0
        ]);

        myCam.frustum();

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('frustum() sets cameraType to custom', function() {
        myCam.frustum(-1, 1, -1, 1, -2, 2);
        assert.deepEqual(myCam.cameraType, 'custom');
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
    });

    test('_getLocalAxes() returns three normalized, orthogonal vectors', function() {
      var local = myCam._getLocalAxes();

      // assert that all returned values are numbers
      for (let j = 0; j < 3; j++) {
        assert.typeOf(local.x[j], 'number');
        assert.typeOf(local.y[j], 'number');
        assert.typeOf(local.z[j], 'number');
      }

      // create p5.Vectors for further assertions
      var vecX = myp5.createVector(local.x[0], local.x[1], local.x[2]);
      var vecY = myp5.createVector(local.y[0], local.y[1], local.y[2]);
      var vecZ = myp5.createVector(local.z[0], local.z[1], local.z[2]);

      // assert vectors are normalized
      assert.equal(vecX.mag(), 1, 'local X vector is not unit vector');
      assert.equal(vecY.mag(), 1, 'local Y vector is not unit vector');
      assert.equal(vecZ.mag(), 1, 'local Z vector is not unit vector');

      // Assert vectors are orthogonal
      assert.closeTo(
        vecX.angleBetween(vecY),
        Math.PI / 2,
        delta,
        'local X vector not orthogonal to local Y vector'
      );
      assert.closeTo(
        vecY.angleBetween(vecZ),
        Math.PI / 2,
        delta,
        'local Y vector not orthogonal to local Z vector'
      );
      assert.closeTo(
        vecX.angleBetween(vecZ),
        Math.PI / 2,
        delta,
        'local X vector not orthogonal to local Z vector'
      );
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
    test("Camera's Renderer is correctly set after setAttributes", function() {
      var myCam2 = myp5.createCamera();
      assert.deepEqual(myCam2, myp5._renderer._curCamera);
      myp5.setAttributes('antialias', true);
      assert.deepEqual(myCam2._renderer, myp5._renderer);
    });
  });
});
