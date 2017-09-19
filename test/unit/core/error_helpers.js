suite('Error Helpers', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p){
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });


  // unit tests for validateParameters
  suite('validateParameters: Numbers + optional Constant', function(){
    test('arc(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('arc',
            [1, 1, 10.5, 10, 0, Math.PI, 'pie']);
        },
        Error, 'got unwanted exception');
    });
    test('arc(): missing param #4, #5', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('arc',
            [1, 1, 10.5, 10]);
        },
        Error, 'got unwanted exception');
    });
    test('arc(): wrong param type at #0', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('arc',
            ['1', 1, 10.5, 10, 0, Math.PI, 'pie']);
        },
        Error, 'got unwanted exception');
    });
  });

  suite('validateParameters: Numbers + optional Constant', function(){
    test('rect(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('rect',
            [1, 1, 10.5, 10]);
        },
        Error, 'got unwanted exception');
    });
    test('rect(): missing param #3', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('rect',
            [1, 1, 10.5]);
        },
        Error, 'got unwanted exception');
    });
    test('rect(): wrong param type at #0', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('rect',
            ['1', 1, 10.5, 10, 0, Math.PI]);
        },
        Error, 'got unwanted exception');
    });
  });

  suite('validateParameters: class, multi-types + optional Numbers', function(){
    test('ambientLight(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          var c = myp5.color(255, 204, 0);
          myp5._validateParameters('ambientLight', [c]);
        },
        Error, 'got unwanted exception');
    });
  });

  suite('validateParameters: multi-format', function(){
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('color', [65]);
        },
        Error, 'got unwanted exception');
    });
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('color', [65, 0.5]);
        },
        Error, 'got unwanted exception');
    });
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(function() {
          myp5._validateParameters('color', [255, 204, 0]);
        },
        Error, 'got unwanted exception');
    });
  });

  suite('helpForMisusedAtTopLevelCode', function() {
    var help = function(msg) {
      var log = [];
      var logger = function(msg) {
        log.push(msg);
      };

      myp5._helpForMisusedAtTopLevelCode({message: msg}, logger);
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
        help('\'smooth\' is undefined'),
        /Did you just try to use p5\.js\'s smooth\(\) function\?/
      );
    });

    test('help for variables is shown', function() {
      assert.match(
        help('\'focused\' is undefined'),
        /Did you just try to use p5\.js\'s focused variable\?/
      );
    });
  });
});
