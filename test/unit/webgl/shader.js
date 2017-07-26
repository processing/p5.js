suite('Shader', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    //assert(false, 'could not run gl tests');
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        p.pointLight(250, 250, 250, 100, 100, 0);
        p.ambientMaterial(250);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('Shader', function() {
    test('Shader Cache', function()
    {
      /*
      //exists doesn't seem to work?
      assert.exists(myp5._renderer.curShader,
        'Shader is in use');
      */
      assert(myp5._renderer.curShader !== null &&
        myp5._renderer.curShader !== undefined,
        'Shader is not in use or has not been cached');
    });
    test('Uniform Cache', function() {

      var uniforms = myp5._renderer.curShader.uniforms;
      assert(uniforms !== null &&
        uniforms !== undefined,
        'Shader uniforms have not been cached');

      assert(Object.keys(uniforms).length > 0,
        'Shader uniforms have not been cached');
    });
    test('Light Shader', function() {
      var shader =
        myp5._renderer.setShader(myp5._renderer._getLightShader());

      assert(shader !== null &&
        shader === myp5._renderer._getLightShader(),
        'Light Shader was returned from p5.RendererGL.setShader');

      assert(myp5._renderer.curShader !== null &&
        myp5._renderer.curShader === myp5._renderer._getLightShader(),
        'Light Shader was not set as renderer\'s curShader in setShader');

      var uniforms = shader.uniforms;

      // generally, check that uniforms were loaded
      assert(uniforms !== null &&
        uniforms !== undefined,
        'Light Shader uniforms have not been cached');

      assert(Object.keys(uniforms).length > 0,
        'Light Shader uniforms have not been cached');

      // check for specific uniforms known to be in Light Shader
      assert(uniforms.uModelViewMatrix !== undefined,
        'Light Shader did not have uModelViewMatrix uniform');
    });
    test('Color Shader', function() {
      var shader =
        myp5._renderer.setShader(myp5._renderer._getColorShader());

      assert(shader !== null &&
        shader === myp5._renderer._getColorShader(),
        'Color Shader was returned from p5.RendererGL.setShader');

      assert(myp5._renderer.curShader !== null &&
        myp5._renderer.curShader === myp5._renderer._getColorShader(),
        'Color Shader was not set as renderer\'s curShader in setShader');

      var uniforms = shader.uniforms;

      // generally, check that uniforms were loaded
      assert(uniforms !== null &&
        uniforms !== undefined,
        'Color Shader uniforms have not been cached');

      assert(Object.keys(uniforms).length > 0,
        'Color Shader uniforms have not been cached');

      // check for specific uniforms known to be in Light Shader
      assert(uniforms.uModelViewMatrix !== undefined,
        'Color Shader did not have uModelViewMatrix uniform');
    });
  });
});
