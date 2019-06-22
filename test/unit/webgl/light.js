suite('light', function() {
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

  suite('Light', function() {
    test('lightFalloff is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.constantAttenuation, 1);
      assert.deepEqual(myp5._renderer.linearAttenuation, 0);
      assert.deepEqual(myp5._renderer.quadraticAttenuation, 0);
      myp5.lightFalloff(2, 3, 4);
      assert.deepEqual(myp5._renderer.constantAttenuation, 2);
      assert.deepEqual(myp5._renderer.linearAttenuation, 3);
      assert.deepEqual(myp5._renderer.quadraticAttenuation, 4);
    });
  });
});
