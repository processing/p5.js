suite('', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.normal', function() {
    test('should be a function', function() {
      assert.ok(myp5.normal);
      assert.typeOf(myp5.normal, 'function');
    });
    test('missing param #1', function() {
      assert.validationError(function() {
        myp5.normal(10);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.normal('a', 1);
      });
    });
    test('accepts numeric arguments', function() {
      assert.doesNotThrow(
        function() {
          myp5.normal(0, 1, 0);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('accepts vector argument', function() {
      assert.doesNotThrow(
        function() {
          myp5.normal(myp5.createVector(0, 1, 0));
        },
        Error,
        'got unwanted exception'
      );
    });
  });
});
