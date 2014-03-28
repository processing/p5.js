suite('time and date', function() {

    var result;
    var today = new Date();

    suite('p5.prototype.day', function() {
      var day = p5.prototype.day;
      var dd = today.getDate();
      suite('day()', function() {
        test('should be a function', function() {
            assert.ok(day);
            assert.typeOf(day, 'function');
        });
        test('should return todays date', function() {
            result = day();
            assert.equal(result, dd);
        });
      });
    });

    suite('p5.prototype.month', function() {
      var month = p5.prototype.month;
      var mm = today.getMonth() + 1;
      suite('month()', function() {
        test('should be a function', function() {
            assert.ok(month);
            assert.typeOf(month, 'function');
        });
        test('should return todays date', function() {
            result = month();
            assert.equal(result, mm);
        });
      });
    });


});