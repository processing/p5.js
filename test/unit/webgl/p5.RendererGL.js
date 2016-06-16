suite('p5.RendererGL', function() {
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

  suite('createCanvas(w, h, WEBGL)', function() {
    test('creates a p5.RendererGL renderer', function() {
      assert.instanceOf(myp5._renderer, p5.RendererGL);
    });
  });
});

suite('p5.RendererGL.prototype._setUniform', function() {
  var setUniform = p5.RendererGL.prototype._setUniform;
  var uniforms = {};

  suite('_setUniform()', function() {
    test('parses floats', function() {
      uniforms = {};
      setUniform(uniforms, 'test', 1);
      assert.equal(uniforms.test.type, '1f');
    });

    test('parses ints (when explicitly specified)', function() {
      uniforms = {};
      setUniform(uniforms, 'test', 1, '1i');
      assert.equal(uniforms.test.type, '1i');
    });

    //TODO: test out the full list of supported uniform types
  });
});
