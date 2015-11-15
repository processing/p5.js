// Test loading font in preload() with success callback
var mySketch = function (this_p5) {
  var myFont;
  this_p5.preload = function () {
    suite('Test in preload() with success callback', function () {
      test('Load asynchronously and use success callback', function (done) {
        myFont = this_p5.loadFont('manual-test-examples/p5.Font/acmesa.ttf', function () {
          assert.ok(myFont);
          done();
        });
      });
    });
  };

  this_p5.setup = function () {
    suite('setup() after preload() with success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myFont instanceof p5.Font);
        assert.isObject(myFont);
        assert.isObject(myFont.font);
        done();
      });
    });
  };
};
new p5(mySketch, null, true);

// Test loading font in preload() without success callback
mySketch = function (this_p5) {
  var myFont;
  this_p5.preload = function () {
    myFont = this_p5.loadFont('manual-test-examples/p5.Font/acmesa.ttf');
  };

  this_p5.setup = function () {
    suite('setup() after preload() without success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myFont instanceof p5.Font);
        assert.isObject(myFont);
        assert.isObject(myFont.font);
        done();
      });
    });
  };
};
new p5(mySketch, null, true);

suite('Fonts outside preload()', function () {

  var loadFont = p5.prototype.loadFont;

  test('loadFont should be a function', function () {
    assert.ok(loadFont);
    assert.typeOf(loadFont, 'function');
  });

  suite('loadFont() with callback', function () {

    test('should call success-callback with object when font loads',
      function (done) {
        loadFont('manual-test-examples/p5.Font/acmesa.ttf',
          function (p5Font) {
            assert.isObject(p5Font);
            assert.isTrue(p5Font instanceof p5.Font);
            assert.isObject(p5Font.font);
            done();
          },
          function (err) {
            assert.isNull(err); // fail here
            done();
          });
      }
    );

    test('should call error-callback when font fails to load', function (done) {
      loadFont('invalid-path',
        function () {
          assert.ok(false);
          done();
        },
        function (err) {
          assert.ok(err);
          done();
        }
      );
    });
  });
});
