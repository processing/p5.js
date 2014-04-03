
suite('Trigonometry', function() {

  var theta =  90;
  var x = 0;
  var y = 1;
  var ratio = 0.5;
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

 var ahandleDegreesAndRadians = function(func) {
    test('should handle degrees', function() {
      p5mock.settings.angleMode = DEGREES;
      assert.equal(p5.prototype.degrees(Math[func](ratio)), p5.prototype[func].call(p5mock, ratio));
    });

    test('should handle radians', function() {
      p5mock.settings.angleMode = RADIANS;
      assert.equal(Math[func](ratio), p5.prototype[func].call(p5mock, ratio));
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
    test('should return the angle in radians when angleMode is DEGREES', function() {
      p5mock.settings.angleMode = DEGREES;
      var angleInRad = 360*theta/(2*Math.PI); // This is degToRad conversion
      assert.equal(p5.prototype.degrees.call(p5mock, theta), angleInRad);
    });

    test('should return the angle in radians when angleMode is RADIANS', function() {
      p5mock.settings.angleMode = RADIANS;
      var angleInRad = 360*theta/(2*Math.PI); // This is degToRad conversion
      assert.equal(p5.prototype.degrees.call(p5mock, theta), angleInRad);
    });
  });

  suite('p5.prototype.radians', function() {
    test('should return the angle in degrees when angleMode is RADIANS', function() {
      p5mock.settings.angleMode = RADIANS;
      var angleInDeg = 2*Math.PI*theta/360; // This is RadToDeg conversion
      assert.equal(p5.prototype.radians.call(p5mock, theta), angleInDeg);
    });

    test('should return the angle in degrees when angleMode is DEGREES', function() {
      p5mock.settings.angleMode = DEGREES;
      var angleInDeg = 2*Math.PI*theta/360; // This is RadToDeg conversion
      assert.equal(p5.prototype.radians.call(p5mock, theta), angleInDeg);
    });
  });

  suite('p5.prototype.asin', function() {
    ahandleDegreesAndRadians('asin');
  });

  suite('p5.prototype.atan', function() {
    ahandleDegreesAndRadians('atan');
  });

  suite('p5.prototype.acos', function() {
    ahandleDegreesAndRadians('acos');
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
      assert.equal(p5.prototype.degrees.call(p5mock,Math.atan2(y, x)), p5.prototype.atan2.apply(p5mock, [y, x]));
    });

    test('should handle radians', function() {
      p5mock.settings.angleMode = RADIANS;
      assert.equal(Math.atan2(y, x), p5.prototype.atan2.apply(p5mock, [y, x]));
    });
  });


});
