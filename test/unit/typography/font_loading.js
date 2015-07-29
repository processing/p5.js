suite('Fonts', function() {

  var loadFont = p5.prototype.loadFont;

  suite('loadFont() with preload', function() {

    test('loadFont should be a function', function() {
      assert.ok(loadFont);
      assert.typeOf(loadFont, 'function');
    });

    // TODO: actually test loading from within preload
  });

  suite('loadFont() with callback', function() {

    test('should call success-callback with object when font loads',
      function(done) {
        loadFont('../examples/p5.Font/acmesa.ttf',
          function(p5Font) {
            assert.isObject(p5Font);
            assert.isTrue(p5Font instanceof p5.Font);
            assert.isObject(p5Font.font);
            done();
          },
          function(err) {
            assert.isNull(err); // fail here
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
