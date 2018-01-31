suite('p5.Shader', function() {
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
        p.box();
      };
    });
  });

  var testUniforms = function(shaderName, uniforms, expectedUniforms) {
    // assert(expectedUniforms.length === Object.keys(uniforms).length,
    //   shaderName + ' expected ' + expectedUniforms.length + ' uniforms but has ' +
    //   Object.keys(uniforms).length);

    // test each one
    for (var i = 0; i < expectedUniforms.length; i++) {
      var uniform = uniforms[expectedUniforms[i]];
      assert(
        uniform !== undefined,
        shaderName + ' missing expectedUniform: ' + expectedUniforms[i]
      );
    }
  };

  var testAttributes = function(shaderName, attributes, expectedAttributes) {
    // assert(expectedAttributes.length === Object.keys(attributes).length,
    //   shaderName + ' expected ' + expectedAttributes.length +
    //   ' attributes but has ' + Object.keys(attributes).length);

    // test each one
    for (var i = 0; i < expectedAttributes.length; i++) {
      var attribute = attributes[expectedAttributes[i]];
      assert(
        attribute !== undefined,
        shaderName + ' missing expected attribute: ' + expectedAttributes[i]
      );
    }
  };

  var testShader = function(
    shaderName,
    shaderObj,
    expectedAttributes,
    expectedUniforms
  ) {
    myp5.shader(shaderObj);
    var s = myp5._renderer.curFillShader;

    assert(
      s !== null && s === shaderObj,
      shaderName + ' was returned from p5.RendererGL.shader'
    );

    assert(
      myp5._renderer.curFillShader !== null &&
        myp5._renderer.curFillShader === shaderObj,
      shaderName + " was not set as renderer's curFillShader in shader()"
    );

    testAttributes(shaderName, s.attributes, expectedAttributes);
    testUniforms(shaderName, s.uniforms, expectedUniforms);
  };

  teardown(function() {
    myp5.remove();
  });

  suite('Shader', function() {
    test('Light Shader', function() {
      var expectedAttributes = ['aPosition', 'aNormal', 'aTexCoord'];

      var expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uNormalMatrix',
        'uAmbientLightCount',
        'uDirectionalLightCount',
        'uPointLightCount',
        'uAmbientColor',
        'uDirectionalLightDirection',
        'uDirectionalLightColor',
        'uPointLightLocation',
        'uPointLightColor',
        'uSpecularPower',
        'uMaterialColor',
        'uSampler',
        'isTexture'
      ];

      testShader(
        'Light Shader',
        myp5._renderer._getLightShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Color Shader definition', function() {
      var expectedAttributes = ['aPosition'];

      var expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uMaterialColor'
      ];

      testShader(
        'Color Shader',
        myp5._renderer._getColorShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Immediate Mode Shader definition', function() {
      var expectedAttributes = ['aPosition', 'aMaterialColor'];

      var expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix'
        /*'uResolution',*/
        /*'uPointSize'*/
      ];

      testShader(
        'Immediate Mode Shader',
        myp5._renderer._getImmediateLightShader(),
        expectedAttributes,
        expectedUniforms
      );
    });
    test('Normal Shader definition', function() {
      var expectedAttributes = ['aPosition', 'aNormal'];

      var expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uNormalMatrix'
      ];

      testShader(
        'Normal Shader',
        myp5._renderer._getNormalShader(),
        expectedAttributes,
        expectedUniforms
      );
    });

    test('Able to setUniform empty arrays', function() {
      myp5.shader(myp5._renderer._getLightShader());
      var s = myp5._renderer.curFillShader;

      s.setUniform('uMaterialColor', []);
      s.setUniform('uLightingDirection', []);
    });
  });
});
