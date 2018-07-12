suite('p5.Camera', function() {
  var myp5;
  var myCam;

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
      assert.closeTo(myCam.centerX, originalCenterXYZ.x, 0.001);
      assert.closeTo(myCam.centerY, originalCenterXYZ.y, 0.001);
      assert.closeTo(myCam.centerZ, originalCenterXYZ.z, 0.001);
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
      assert.closeTo(myCam.centerX, originalCenterXYZ.x, 0.001);
      assert.closeTo(myCam.centerY, originalCenterXYZ.y, 0.001);
      assert.closeTo(myCam.centerZ, originalCenterXYZ.z, 0.001);
    });
  });

  suite('Position / Orientation', function() {
    test('Camera() sets eye, center, and up XYZ properties', function() {
      myCam.camera(100, 100, 100, 200, 200, 200, 0, 0, 1);
      assert.equal(myCam.eyeX, 100);
      assert.equal(myCam.eyeY, 100);
      assert.equal(myCam.eyeZ, 100);
      assert.equal(myCam.centerX, 200);
      assert.equal(myCam.centerY, 200);
      assert.equal(myCam.centerZ, 200);
      assert.equal(myCam.upX, 0);
      assert.equal(myCam.upY, 0);
      assert.equal(myCam.upZ, 1);
    });

    test('LookAt() should set centerXYZ', function() {
      myCam.lookAt(23, 23, 23);
      assert.equal(myCam.centerX, 23);
      assert.equal(myCam.centerY, 23);
      assert.equal(myCam.centerZ, 23);
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
      assert.closeTo(myCam.eyeX, originalEyeXYZ.x, 0.001);
      assert.closeTo(myCam.eyeY, originalEyeXYZ.y, 0.001);
      assert.closeTo(myCam.eyeZ, originalEyeXYZ.z, 0.001);
    });

    test('SetPosition() should set eyeXYZ', function() {
      var pos = Math.random();

      myCam.setPosition(pos, pos, pos);

      assert.equal(myCam.eyeX, pos);
      assert.equal(myCam.eyeY, pos);
      assert.equal(myCam.eyeZ, pos);
    });
  });

  suite('Projection', function() {
    test('ortho() sets renderer uPMatrix', function() {
      myCam.ortho(-10, 10, -10, 10, 0, 100);

      for (let i = 0; i < myCam.projMatrix.mat4.length; i++) {
        assert.equal(myCam.projMatrix.mat4[i], myp5._renderer.uPMatrix.mat4[i]);
      }
    });

    test('perspective() sets renderer uPMatrix', function() {
      myCam.perspective(Math.PI / 3.0, 1, 1, 100);

      for (let i = 0; i < myCam.projMatrix.mat4.length; i++) {
        assert.equal(myCam.projMatrix.mat4[i], myp5._renderer.uPMatrix.mat4[i]);
      }
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
