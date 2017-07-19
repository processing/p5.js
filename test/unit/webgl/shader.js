suite('Shader', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
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
        'Shader uniforms have not been chaced');
    });
  });
});
