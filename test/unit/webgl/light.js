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

    test('specularColor is initialised and set properly', function() {
      assert.deepEqual(myp5._renderer.specularColors, [1, 1, 1]);
      assert.deepEqual(myp5._renderer.pointLightSpecularColors, []);
      assert.deepEqual(myp5._renderer.directionalLightSpecularColors, []);
      myp5.specularColor(255, 0, 0);
      assert.deepEqual(myp5._renderer.specularColors, [1, 0, 0]);
      myp5.pointLight(255, 0, 0, 1, 0, 0);
      myp5.directionalLight(255, 0, 0, 0, 0, 0);
      assert.deepEqual(myp5._renderer.pointLightSpecularColors, [1, 0, 0]);
      assert.deepEqual(myp5._renderer.directionalLightSpecularColors, [
        1,
        0,
        0
      ]);
    });
  });
});
