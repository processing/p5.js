/* global opentype: false */

suite('Fonts', function() {

  var p5Font,
    loadFont = p5.prototype.loadFont;

  suite('loadFont() with preload', function() {

    test('opentype should be defined', function() {
      assert.typeOf(opentype, 'object');
    });

    test('loadFont should be a function', function() {
      assert.ok(loadFont);
      assert.typeOf(loadFont, 'function');
    });

    test('loadFont() should wait for load before calling setup', function() {
      window.preload = function() {
        console.log('PRELOAD');
        p5Font = loadFont('../examples/p5.Font/acmesa.ttf');
        assert.notOK(p5Font);
      }();
      window.setup = function() {
        console.log('SETUP');
        assert.isTrue(p5Font instanceof p5.Font);
        assert.isObject(p5Font);
        assert.isObject(p5Font.font);
        done();
      }
    });
  });

  var loadFont = p5.prototype.loadFont;

  //console.log("p5.preload", Object.keys(p5.prototype._preloadMethods));

  //suite('loadFont() with preload', function() {});

  return;
  suite('loadFont() with callback', function() {

    test('should call success-callback with object when font loads',
      function(done) {
        loadFont('../examples/p5.Font/acmesa.ttf',
          function(p5Font) {
            assert.isTrue(p5Font instanceof p5.Font);
            assert.isObject(p5Font);
            assert.isObject(p5Font.font);
            done();
          },
          function(event) {
            assert.ok(false);
            done();
          });
      }
    );

    test('should call error-callback when font fails to load', function(done) {
      loadFont('invalid-path',
        function(result) {
          assert.ok(false);
          done();
        },
        function(err) {
          assert.ok(err);
          //assert.isTrue(p5._friendlyFileLoadError.called);
          done();
        }
      );
    });
  });

});
