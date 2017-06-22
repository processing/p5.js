suite('Error Helpers', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });
  var c;

  // unit tests for validateNumParameters
  suite('validateNumParameters', function(){
    test('catch if some inputs are missing',function(){
      var result = p5.prototype._validateNumParameters('func',[1,1,1,1]);
      assert.isFalse(result[0]);
      assert.equal(result[1],'INIT_VALNUMPAR_FAIL');
    });
  });
  suite('validate numeric parameters (all Number type)', function() {
    test('four number inputs', function() {
      var result = p5.prototype._validateNumParameters('func',[1,1,1,1],4);
      assert.isTrue(result[0]);
    });
    test('undefined parameter', function() {
      var num;
      var result = p5.prototype._validateNumParameters('func',[1,num,1,1],4);
      assert.isFalse(result[0]);
      assert.equal(result[1],'EMPTY_VAR');
      assert.equal(result[2],1);
    });
    test('string parameter', function() {
      var num = 'string';
      var result = p5.prototype._validateNumParameters('func',[1,num,1,1],4);
      assert.isFalse(result[0]);
      assert.equal(result[1],'WRONG_TYPE');
      assert.equal(result[2],1);
    });
    test('array parameter', function() {
      var num = ['value', 'value', 'value'];
      var result = p5.prototype._validateNumParameters('func',[1,num,1,1],4);
      assert.isFalse(result[0]);
      assert.equal(result[1],'WRONG_TYPE');
      assert.equal(result[2],1);
    });
    test('boolean parameter', function() {
      var num = false;
      var result = p5.prototype._validateNumParameters('func',[1,num,1,1],4);
      assert.isFalse(result[0]);
      assert.equal(result[1],'WRONG_TYPE');
      assert.equal(result[2],1);
    });
    setup(function() {
      c = myp5.color(255, 0, 102);
    });
    test('p5 defined object', function() {
      var result = p5.prototype._validateNumParameters('func',[1,c,1,1],4);
      assert.isFalse(result[0]);
      assert.equal(result[1],'WRONG_TYPE');
      assert.equal(result[2],1);
    });
  });

  suite('helpForMisusedAtTopLevelCode', function() {
    var help = function(msg) {
      var log = [];
      var logger = function(msg) {
        log.push(msg);
      };

      p5.prototype._helpForMisusedAtTopLevelCode({message: msg}, logger);
      assert.equal(log.length, 1);
      return log[0];
    };

    test('help for constants is shown', function() {
      assert.match(
        help('\'HALF_PI\' is undefined'),
        /Did you just try to use p5\.js\'s HALF_PI constant\?/
      );
    });

    test('help for functions is shown', function() {
      assert.match(
        help('\'random\' is undefined'),
        /Did you just try to use p5\.js\'s random\(\) function\?/
      );
    });

    test('help for variables is shown', function() {
      assert.match(
        help('\'mouseX\' is undefined'),
        /Did you just try to use p5\.js\'s mouseX variable\?/
      );
    });
  });
});
