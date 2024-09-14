import p5 from '../../../src/app.js';

suite('', function() {
  var myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('p5.prototype.normal', function() {
    test('should be a function', function() {
      assert.ok(myp5.normal);
      assert.typeOf(myp5.normal, 'function');
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
