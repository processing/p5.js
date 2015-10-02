var myFont1, myFont2;

// Test loading font in preload() with success callback
var mySketch = function (this_p5) {
  this_p5.preload = function () {
    suite('Test in preload() with success callback', function () {
      test('Load asynchronously and use success callback', function (done) {
        myFont1 = this_p5.loadFont('../examples/p5.Font/acmesa.ttf', function () {
          assert.ok(myFont1);
          done();
        });
      });
    });
  };

  this_p5.setup = function () {
    suite('setup() after preload() with success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myFont1 instanceof p5.Font);
        assert.isObject(myFont1);
        assert.isObject(myFont1.font);
        done();
      });
    });
  };
};
new p5(mySketch, null, true);

// Test loading font in preload() without success callback
mySketch = function (this_p5) {
  this_p5.preload = function () {
    myFont2 = this_p5.loadFont('../examples/p5.Font/acmesa.ttf');
  };

  this_p5.setup = function () {
    suite('setup() after preload() without success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myFont2 instanceof p5.Font);
        assert.isObject(myFont2);
        assert.isObject(myFont2.font);
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
        loadFont('../examples/p5.Font/acmesa.ttf',
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
