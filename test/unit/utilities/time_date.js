import { mockP5, mockP5Prototype } from '../../js/mocks';
import timeDate from '../../../src/utilities/time_date';

suite('time and date', function() {
  beforeAll(function() {
    timeDate(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.year', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.year);
      assert.typeOf(mockP5Prototype.year, 'function');
    });

    test('should return this year', function() {
      const result = mockP5Prototype.year();
      var jsYear = new Date().getFullYear();
      assert.equal(result, jsYear);
    });
  });

  suite('p5.prototype.day', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.day);
      assert.typeOf(mockP5Prototype.day, 'function');
    });

    test('should return todays day', function() {
      var jsDay = new Date().getDate();
      const result = mockP5Prototype.day();
      assert.equal(result, jsDay);
    });
  });

  suite('p5.prototype.month', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.month);
      assert.typeOf(mockP5Prototype.month, 'function');
    });

    test("should return today's month", function() {
      const result = mockP5Prototype.month();
      var jsMonth = new Date().getMonth() + 1;
      assert.equal(result, jsMonth);
    });
  });

  suite('p5.prototype.hour', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.hour);
      assert.typeOf(mockP5Prototype.hour, 'function');
    });

    test('should return this hour', function() {
      var jsHour = new Date().getHours();
      const result = mockP5Prototype.hour();
      assert.equal(result, jsHour);
    });
  });

  suite('p5.prototype.second', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.second);
      assert.typeOf(mockP5Prototype.second, 'function');
    });

    test('should return this second', function() {
      var jsSecond = new Date().getSeconds();
      const result = mockP5Prototype.second();
      assert.equal(result, jsSecond); //(Math.abs(jsSecond - result), '==', 0, 'everything is ok'); // in my testing, found this might be off by 1 second
    });
  });

  suite('p5.prototype.minute', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.minute);
      assert.typeOf(mockP5Prototype.minute, 'function');
    });

    test('should return a number that is this minute', function() {
      var jsMinute = new Date().getMinutes();
      const result = mockP5Prototype.minute();
      assert.isNumber(result);
      assert.isNumber(jsMinute);
      assert.equal(result, jsMinute);
    });
  });

  suite('p5.prototype.millis', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.millis);
      assert.typeOf(mockP5Prototype.millis, 'function');
    });

    test('result should be a number', function() {
      assert.isNumber(mockP5Prototype.millis());
    });

    // TODO: need to move internal state to module
    test.todo('result should be greater than running time', function() {
      var runningTime = 50;
      var init_date = window.performance.now();
      // wait :\
      while (window.performance.now() - init_date <= runningTime) {
        /* no-op */
      }
      assert.operator(mockP5Prototype.millis(), '>', runningTime, 'everything is ok');
    });

    test.todo('result should be > newResult', function() {
      var runningTime = 50;
      var init_date = Date.now();
      const result = mockP5Prototype.millis();
      // wait :\
      while (Date.now() - init_date <= runningTime) {
        /* no-op */
      }
      const newResult = mockP5Prototype.millis();
      assert.operator(newResult, '>', result, 'everything is ok');
    });
  });
});
