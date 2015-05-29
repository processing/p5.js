
suite('Trigonometry', function() {

  var theta =  90;
  var x = 0;
  var y = 1;
  var ratio = 0.5;
  var RADIANS = 'radians';
  var DEGREES = 'degrees';

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  var handleDegreesAndRadians = function(func) {

    test('should handle degrees', function() {
      myp5.angleMode(DEGREES);
      var degToRad = myp5.radians(theta);
      assert.equal(Math[func](degToRad), myp5[func](theta));
    });

    test('should handle radians', function() {
      myp5.angleMode(RADIANS);
      assert.equal(Math[func](theta), myp5[func](theta));
    });
  };

 var ahandleDegreesAndRadians = function(func) {
    test('should handle degrees', function() {
      myp5.angleMode(DEGREES);
      assert.equal(myp5.degrees(Math[func](ratio)), myp5[func](ratio));
    });

    test('should handle radians', function() {
      myp5.angleMode(RADIANS);
      assert.equal(Math[func](ratio), myp5[func](ratio));
    });
  };



  suite('p5.prototype.angleMode', function() {
    test('should set constant to DEGREES', function() {
      myp5.angleMode(DEGREES);
      assert.equal(myp5._angleMode, 'degrees');
    });

    test('should set constant to RADIANS', function() {
      myp5.angleMode(RADIANS);
      assert.equal(myp5._angleMode, 'radians');
    });

    test('should always be RADIANS or DEGREES', function() {
      myp5.angleMode('wtflolzkk');
      assert.equal(myp5._angleMode, 'radians');
    });
  });

  suite('p5.prototype.degrees', function() {
    test('should return the angle in radians when angleMode is DEGREES', function() {
      myp5.angleMode(DEGREES);
      var angleInRad = 360*theta/(2*Math.PI); // This is degToRad conversion
      assert.equal(myp5.degrees(theta), angleInRad);
    });

    test('should return the angle in radians when angleMode is RADIANS', function() {
      myp5.angleMode(RADIANS);
      var angleInRad = 360*theta/(2*Math.PI); // This is degToRad conversion
      assert.equal(myp5.degrees(theta), angleInRad);
    });
  });

  suite('p5.prototype.radians', function() {
    test('should return the angle in degrees when angleMode is RADIANS', function() {
      myp5.angleMode(RADIANS);
      var angleInDeg = 2*Math.PI*theta/360; // This is RadToDeg conversion
      assert.equal(myp5.radians(theta), angleInDeg);
    });

    test('should return the angle in degrees when angleMode is DEGREES', function() {
      myp5.angleMode(DEGREES);
      var angleInDeg = 2*Math.PI*theta/360; // This is RadToDeg conversion
      assert.equal(myp5.radians(theta), angleInDeg);
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
      myp5.angleMode(DEGREES);
      assert.equal(myp5.degrees(Math.atan2(y, x)), myp5.atan2(y, x));
    });

    test('should handle radians', function() {
      myp5.angleMode(RADIANS);
      assert.equal(Math.atan2(y, x), myp5.atan2(y, x));
    });
  });


});
