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

      //prettier-ignore
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

      //prettier-ignore
      var expectedMatrix = new Float32Array([
        0.5403022766113281, 0, -0.8414710164070129, 0,
         -0, 1, 0, 0,
         0.8414710164070129, 0, 0.5403022766113281, 0,
         -72.87352752685547, 0, -46.79154968261719, 1]);

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

      //prettier-ignore
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

      //prettier-ignore
      var expectedMatrix = new Float32Array(
        [1, 0, 0, 0,
          0, 0.07073719799518585, -0.9974949955940247, 0,
          -0, 0.9974949955940247, 0.07073719799518585, 0,
          0, -86.3855972290039, -6.126020908355713, 1]);

      myCam.tilt(1.5);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });

    test('Tilt() with negative parameter sets correct matrix w/o \
    changing eyeXYZ', function() {
      var orig = getVals(myCam);

      //prettier-ignore
      var expectedMatrix = new Float32Array([
          1, 0, 0, 0,
          0, 0.07073719799518585, 0.9974949955940247, 0,
          0, -0.9974949955940247, 0.07073719799518585, 0,
          0, 86.3855972290039, -6.126020908355713, 1]);

      myCam.tilt(-1.5);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);

      assert.strictEqual(myCam.eyeX, orig.ex, 'eye X pos changed');
      assert.strictEqual(myCam.eyeY, orig.ey, 'eye Y pos changed');
      assert.strictEqual(myCam.eyeZ, orig.ez, 'eye Z pos changed');
    });
    test('Tilt(0) sets correct matrix w/o changing eyeXYZ', function() {
      var orig = getVals(myCam);

      //prettier-ignore
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -86.6025390625, 1]);

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

      //prettier-ignore
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

      //prettier-ignore
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
      //prettier-ignore
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
      //prettier-ignore
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
      //prettier-ignore
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -86.6025390625, 1]);

      myCam.move(0, 0, 0);
      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('SetPosition() with positive parameters sets correct matrix', function() {
      //prettier-ignore
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
      //prettier-ignore
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
      //prettier-ignore
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);

      myCam.setPosition(0, 0, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });

    test('_orbit(1,0,0) sets correct matrix', function() {
      //prettier-ignore
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
      //prettier-ignore
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
      //prettier-ignore
      var expectedMatrix = new Float32Array([
          1, 0, 0, 0,
          0, 1, 6.123234262925839e-17, 0,
          0, -6.123234262925839e-17, 1, 0,
          0, 2.3406442117928995e-22, -87.6025390625, 1
        ]);

      myCam._orbit(0, 0, 1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit(-1,0,0) sets correct matrix', function() {
      //prettier-ignore
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
      //prettier-ignore
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
      //prettier-ignore
      var expectedMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 6.123234262925839e-17, 0,
        0, -6.123234262925839e-17, 1, 0,
        0, 2.2872063954199937e-22, -85.6025390625, 1
      ]);

      myCam._orbit(0, 0, -1);

      assert.deepEqual(myCam.cameraMatrix.mat4, expectedMatrix);
    });
    test('_orbit() ensures altitude phi <= PI', function() {
      var myCamCopy = myCam.copy();

      // the following should produce the same values because phi is capped at PI
      myCamCopy._orbit(0, 10, 0);
      myCam._orbit(0, 20, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, myCamCopy.cameraMatrix.mat4);
    });
    test('_orbit() ensures altitude phi > 0', function() {
      var myCamCopy = myCam.copy();

      // the following should produce the same values because phi is restricted
      // to > 0
      myCamCopy._orbit(0, -10, 0);
      myCam._orbit(0, -20, 0);

      assert.deepEqual(myCam.cameraMatrix.mat4, myCamCopy.cameraMatrix.mat4);
    });
    test('_orbit() ensures radius > 0', function() {
      var myCamCopy = myCam.copy();

      // the following should produce the same values because radius is
      // restricted to > 0
      myCamCopy._orbit(0, 0, -200);
      myCam._orbit(0, 0, -300);

      assert.deepEqual(myCam.cameraMatrix.mat4, myCamCopy.cameraMatrix.mat4);
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
        //prettier-ignore
        var expectedMatrix = new Float32Array(
                      [1,  0,  0, 0,
                       0, -1,  0, 0,
                       0,  0, -1, 0,
                      -0, -0, -1, 1]);

        myCam.ortho(-1, 1, -1, 1, 0, 2);

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('ortho() with no parameters specified (sets default)', function() {
        //prettier-ignore
        var expectedMatrix = new Float32Array([
          0.019999999552965164, 0, 0, 0,
          0, -0.019999999552965164, 0,0,
          0,0,-0.019999999552965164,0,
          -0,-0,-1,1
        ]);
        myCam.ortho();
        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });
    });
    suite('perspective()', function() {
      test('perspective() sets renderer uPMatrix', function() {
        myCam.perspective(Math.PI / 3.0, 1, 1, 100);

        assert.deepEqual(myCam.projMatrix.mat4, myp5._renderer.uPMatrix.mat4);
      });
      test('perspective() sets projection matrix correctly', function() {
        //prettier-ignore
        var expectedMatrix = new Float32Array(
                      [1,  0,   0,  0,
                       0, -1,   0,  0,
                       0,  0,  -3, -1,
                       0,  0, -40,  0]);

        myCam.perspective(Math.PI / 2, 1, 10, 20);

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
      });

      test('perspective() with no parameters specified (sets default)', function() {
        // prettier-ignore
        var expectedMatrix = new Float32Array([
          1.7320507764816284,0,0,0,
          0,-1.7320507764816284,0,0,
          0,0,-1.0202020406723022,-1,
          0,0,-17.49546241760254,0
        ]);

        myCam.perspective();

        assert.deepEqual(myCam.projMatrix.mat4, expectedMatrix);
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
