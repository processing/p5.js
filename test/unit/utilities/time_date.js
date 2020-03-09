suite('time and date', function() {
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

  var result;

  suite('p5.prototype.year', function() {
    test('should be a function', function() {
      assert.ok(myp5.year);
      assert.typeOf(myp5.year, 'function');
    });

    test('should return this year', function() {
      result = myp5.year();
      var jsYear = new Date().getFullYear();
      assert.equal(result, jsYear);
    });
  });

  suite('p5.prototype.day', function() {
    test('should be a function', function() {
      assert.ok(myp5.day);
      assert.typeOf(myp5.day, 'function');
    });

    test('should return todays day', function() {
      var jsDay = new Date().getDate();
      result = myp5.day();
      assert.equal(result, jsDay);
    });
  });

  suite('p5.prototype.month', function() {
    test('should be a function', function() {
      assert.ok(myp5.month);
      assert.typeOf(myp5.month, 'function');
    });

    test("should return today's month", function() {
      result = myp5.month();
      var jsMonth = new Date().getMonth() + 1;
      assert.equal(result, jsMonth);
    });
  });

  suite('p5.prototype.hour', function() {
    test('should be a function', function() {
      assert.ok(myp5.hour);
      assert.typeOf(myp5.hour, 'function');
    });

    test('should return this hour', function() {
      var jsHour = new Date().getHours();
      result = myp5.hour();
      assert.equal(result, jsHour);
    });
  });

  suite('p5.prototype.second', function() {
    test('should be a function', function() {
      assert.ok(myp5.second);
      assert.typeOf(myp5.second, 'function');
    });

    test('should return this second', function() {
      var jsSecond = new Date().getSeconds();
      result = myp5.second();
      assert.equal(result, jsSecond); //(Math.abs(jsSecond - result), '==', 0, 'everything is ok'); // in my testing, found this might be off by 1 second
    });
  });

  suite('p5.prototype.minute', function() {
    test('should be a function', function() {
      assert.ok(myp5.minute);
      assert.typeOf(myp5.minute, 'function');
    });

    test('should return a number that is this minute', function() {
      var jsMinute = new Date().getMinutes();
      result = myp5.minute();
      assert.isNumber(result);
      assert.isNumber(jsMinute);
      assert.equal(result, jsMinute);
    });
  });

  suite('p5.prototype.millis', function() {
    test('should be a function', function() {
      assert.ok(myp5.millis);
      assert.typeOf(myp5.millis, 'function');
    });

    test('result should be a number', function() {
      assert.isNumber(myp5.millis());
    });

    test('result should be greater than running time', function() {
      var runningTime = 50;
      var init_date = window.performance.now();
      // wait :\
      while (window.performance.now() - init_date < runningTime) {
        /* no-op */
      }
      assert.operator(myp5.millis(), '>', runningTime, 'everything is ok');
    });

    test('result should be > newResult', function() {
      var runningTime = 50;
      var init_date = Date.now();
      var result = myp5.millis();
      // wait :\
      while (Date.now() - init_date < runningTime) {
        /* no-op */
      }
      var newResult = myp5.millis();
      assert.operator(newResult, '>', result, 'everything is ok');
    });
  });
});
