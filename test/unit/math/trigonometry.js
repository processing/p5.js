
suite('Trigonometry', function() {

  var theta =  0.5;
  var RADIANS = 'radians';
  var DEGREES = 'degrees';
  var p5mock = { settings:{} };
  p5mock.radians = p5.prototype.radians;

  var handleDegreesAndRadians = function(func) {

    test('should handle degrees', function() {
      p5mock.settings.angleMode = DEGREES;
      var degToRad = p5mock.radians(theta);
      assert.equal(Math[func](degToRad), p5.prototype[func].call(p5mock, theta));
    });

    test('should handle radians', function() {
      p5mock.settings.angleMode = RADIANS;
      assert.equal(Math[func](theta), p5.prototype[func].call(p5mock, theta));
    });
  };

  suite('p5.prototype.angleMode', function() {
    test('should set constant to DEGREES', function() {
      p5.prototype.angleMode.call(p5mock, DEGREES);
      assert.equal(p5mock.settings.angleMode, 'degrees');
    });

    test('should set constant to RADIANS', function() {
      p5.prototype.angleMode.call(p5mock, RADIANS);

      assert.equal(p5mock.settings.angleMode, 'radians');
    });

    test('should always be RADIANS or DEGREES', function() {
      p5.prototype.angleMode.call(p5mock, 'wtflolzkk');
      assert.equal(p5mock.settings.angleMode, 'radians');
    });
  });

  suite('p5.prototype.degrees', function() {
    test('should return the same angle', function() {
      p5mock.settings.angleMode = DEGREES;
      assert.equal(p5.prototype.degrees.call(p5mock, theta), theta);
    });

    test('should return the angle in radians', function() {
      p5mock.settings.angleMode = RADIANS;
      var angleInRad = 360*theta/(2*Math.PI); // This is degToRad conversion
      assert.equal(p5.prototype.degrees.call(p5mock, theta), angleInRad);
    });
  });

  suite('p5.prototype.radians', function() {
    test('should return the same angle', function() {
      p5mock.settings.angleMode = RADIANS;
      assert.equal(p5.prototype.radians.call(p5mock, theta), theta);
    });

    test('should return the angle in degrees', function() {
      p5mock.settings.angleMode = DEGREES;
      var angleInDeg = 2*Math.PI*theta/360; // This is RadToDeg conversion
      assert.equal(p5.prototype.radians.call(p5mock, theta), angleInDeg);
    });
  });

  suite('p5.prototype.asin', function() {
    handleDegreesAndRadians('asin');
  });

  suite('p5.prototype.atan', function() {
    handleDegreesAndRadians('atan');
  });

  suite('p5.prototype.acos', function() {
    handleDegreesAndRadians('acos');
  });

  suite('p5.prototype.sin', function() {
    handleDegreesAndRadians('sin');
  });

  suite('p5.prototype.cos', function() {
    handleDegreesAndRadians('cos');
  });

  suite('p5.prototype.tan', function() {
    handleDegreesAndRadians('tan');
  });


  suite('p5.prototype.atan2', function() {
    test('should handle degrees', function() {
      p5mock.settings.angleMode = DEGREES;
      var degToRad = p5mock.radians(theta);

      assert.equal(Math.atan2(degToRad, degToRad), p5.prototype.atan2.apply(p5mock, [theta, theta]));
    });

    test('should handle radians', function() {
      p5mock.settings.angleMode = RADIANS;
      assert.equal(Math.atan2(theta, theta), p5.prototype.atan2.apply(p5mock, [theta, theta]));
    });
  });


});
