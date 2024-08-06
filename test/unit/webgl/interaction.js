import p5 from '../../../src/app.js';

suite('Interaction', function() {
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

  suite('p5.prototype.orbitControl', function() {
    test('should be a function', function() {
      assert.ok(myp5.orbitControl);
      assert.typeOf(myp5.orbitControl, 'function');
    });
    test('missing params. no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.orbitControl();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.debugMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.debugMode);
      assert.typeOf(myp5.debugMode, 'function');
    });
    test('missing params. no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.debugMode();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.noDebugMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.noDebugMode);
      assert.typeOf(myp5.noDebugMode, 'function');
    });
  });
});
