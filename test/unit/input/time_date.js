suite('time and date', function() {

    var result;

    suite('p5.prototype.year', function() {
      var year = p5.prototype.year;
      suite('year()', function() {
        test('should be a function', function() {
            assert.ok(year);
            assert.typeOf(year, 'function');
        });
        test('should return this year', function() {
            result = year();
            var jsYear = new Date().getFullYear();
            assert.equal(result, jsYear);
        });
      });
    });


    suite('p5.prototype.day', function() {
      var day = p5.prototype.day;
      suite('day()', function() {
        test('should be a function', function() {
            assert.ok(day);
            assert.typeOf(day, 'function');
        });
        test('should return todays day', function() {
            var jsDay = new Date().getDate();
            result = day();
            assert.equal(result, jsDay);
        });
      });
    });

    suite('p5.prototype.month', function() {
      var month = p5.prototype.month;
      suite('month()', function() {
        test('should be a function', function() {
            assert.ok(month);
            assert.typeOf(month, 'function');
        });
        test('should return today\'s month', function() {
            result = month();
            var jsMonth = new Date().getMonth() + 1;
            assert.equal(result, jsMonth);
        });
      });
    });

    suite('p5.prototype.hour', function() {
      var hour = p5.prototype.hour;
      suite('hour()', function() {
        test('should be a function', function() {
            assert.ok(hour);
            assert.typeOf(hour, 'function');
        });
        test('should return this hour', function() {
            var jsHour = new Date().getHours();
            result = hour();
            assert.equal(result, jsHour);
        });
      });
    });

    suite('p5.prototype.second', function() {
      var second = p5.prototype.second;
      suite('second()', function() {
        test('should be a function', function() {
            assert.ok(second);
            assert.typeOf(second, 'function');
        });
        test('should return this second', function() {
            var jsSecond = new Date().getSeconds();
            result = second();
            assert.equal(result, jsSecond); //(Math.abs(jsSecond - result), '==', 0, 'everything is ok'); // in my testing, found this might be off by 1 second
        });
      });
    });

    suite('p5.prototype.minute', function() {
      var minute = p5.prototype.minute;
      suite('minute()', function() {
        test('should be a function', function() {
            assert.ok(minute);
            assert.typeOf(minute, 'function');
        });
        test('should return a number that is this minute', function() {
            var jsMinute = new Date().getMinutes();
            result = minute();
            assert.isNumber(result);
            assert.isNumber(jsMinute);
            assert.equal(result, jsMinute);
        });
      });
    });


    suite('p5.prototype.millis', function() {
      var runningTime = 1000;
      var p5mock = {_startTime: new Date().getTime() - runningTime};
      var millis = p5.prototype.millis;
      var result = millis.call(p5mock);
      suite('millis()', function() {
        test('should be a function', function() {
            assert.ok(millis);
            assert.typeOf(millis, 'function');
        });
        test('result should be a number', function() {
            assert.isNumber(result);
        });
        test('result should be ' + runningTime, function() {
            assert.closeTo(result, runningTime, 1, 'everything is ok');
        });
         test('result should be > newResult', function() {
            var newResult = millis.call(p5mock);
            assert.operator(newResult, '>', result, 'everything is ok');
        });
      });
    });




});
