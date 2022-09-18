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
    shaderObj.bindShader();
    testAttributes(shaderName, shaderObj.attributes, expectedAttributes);
    testUniforms(shaderName, shaderObj.uniforms, expectedUniforms);
    shaderObj.unbindShader();
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
        'uLightingDirection',
        'uDirectionalDiffuseColors',
        'uDirectionalSpecularColors',
        'uPointLightLocation',
        'uPointLightDiffuseColors',
        'uPointLightSpecularColors',
        'uSpotLightCount',
        'uSpotLightAngle',
        'uSpotLightConc',
        'uSpotLightDiffuseColors',
        'uSpotLightSpecularColors',
        'uSpotLightLocation',
        'uSpotLightDirection',
        'uSpecular',
        'uShininess',
        'uMaterialColor',
        'uSampler',
        'isTexture',
        'uConstantAttenuation',
        'uLinearAttenuation',
        'uQuadraticAttenuation'
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
      var expectedAttributes = ['aPosition', 'aVertexColor'];

      var expectedUniforms = [
        'uModelViewMatrix',
        'uProjectionMatrix',
        /*'uResolution',*/
        'uPointSize'
      ];

      testShader(
        'Immediate Mode Shader',
        myp5._renderer._getImmediateModeShader(),
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
    test('Color Shader is set after fill()', function() {
      myp5.fill(0);
      var retainedColorShader = myp5._renderer._getColorShader();
      var texLightShader = myp5._renderer._getLightShader();
      var immediateColorShader = myp5._renderer._getImmediateModeShader();
      var selectedRetainedShader = myp5._renderer._getRetainedFillShader();
      var selectedImmediateShader = myp5._renderer._getImmediateFillShader();

      // both color and light shader are valid, depending on
      // conditions set earlier.
      assert(
        retainedColorShader === selectedRetainedShader ||
          texLightShader === selectedRetainedShader,
        "_renderer's retain mode shader was not color shader after fill"
      );
      assert(
        immediateColorShader === selectedImmediateShader ||
          texLightShader === selectedImmediateShader,
        "_renderer's immediate mode shader was not color shader after fill"
      );
    });
    test('Normal Shader is set after normalMaterial()', function() {
      myp5.normalMaterial();
      var normalShader = myp5._renderer._getNormalShader();
      var selectedRetainedShader = myp5._renderer._getRetainedFillShader();
      var selectedImmediateShader = myp5._renderer._getRetainedFillShader();
      assert(
        normalShader === selectedRetainedShader,
        "_renderer's retain mode shader was not normal shader"
      );
      assert(
        normalShader === selectedImmediateShader,
        "_renderer's retain mode shader was not normal shader"
      );
    });
    test('Light shader set after ambientMaterial()', function() {
      var lightShader = myp5._renderer._getLightShader();
      myp5.ambientMaterial(128);
      var selectedRetainedShader = myp5._renderer._getRetainedFillShader();
      var selectedImmediateShader = myp5._renderer._getImmediateFillShader();
      assert(
        lightShader === selectedRetainedShader,
        "_renderer's retain mode shader was not light shader " +
          'after call to ambientMaterial()'
      );
      assert(
        lightShader === selectedImmediateShader,
        "_renderer's immediate mode shader was not light shader" +
          'after call to ambientMaterial()'
      );
    });
    test('Light shader set after specularMaterial()', function() {
      var lightShader = myp5._renderer._getLightShader();
      myp5.specularMaterial(128);
      var selectedRetainedShader = myp5._renderer._getRetainedFillShader();
      var selectedImmediateShader = myp5._renderer._getImmediateFillShader();
      assert(
        lightShader === selectedRetainedShader,
        "_renderer's retain mode shader was not light shader " +
          'after call to specularMaterial()'
      );
      assert(
        lightShader === selectedImmediateShader,
        "_renderer's immediate mode shader was not light shader " +
          'after call to specularMaterial()'
      );
    });
    test('Light shader set after emissiveMaterial()', function() {
      var lightShader = myp5._renderer._getLightShader();
      myp5.emissiveMaterial(128);
      var selectedRetainedShader = myp5._renderer._getRetainedFillShader();
      var selectedImmediateShader = myp5._renderer._getImmediateFillShader();
      assert(
        lightShader === selectedRetainedShader,
        "_renderer's retain mode shader was not light shader " +
          'after call to emissiveMaterial()'
      );
      assert(
        lightShader === selectedImmediateShader,
        "_renderer's immediate mode shader was not light shader " +
          'after call to emissiveMaterial()'
      );
    });

    test('Able to setUniform empty arrays', function() {
      myp5.shader(myp5._renderer._getLightShader());
      var s = myp5._renderer.userFillShader;

      s.setUniform('uMaterialColor', []);
      s.setUniform('uLightingDirection', []);
    });

    test('Able to set shininess', function() {
      assert.deepEqual(myp5._renderer._useShininess, 1);
      myp5.shininess(50);
      assert.deepEqual(myp5._renderer._useShininess, 50);
    });

    test('Shader is reset after resetShader is called', function() {
      myp5.shader(myp5._renderer._getColorShader());
      var prevShader = myp5._renderer.userFillShader;
      assert.isTrue(prevShader !== null);

      myp5.resetShader();
      var curShader = myp5._renderer.userFillShader;
      assert.isTrue(curShader === null);
    });

    test('isTextureShader returns true if there is a sampler', function() {
      var s = myp5._renderer._getLightShader();
      myp5.shader(s);
      assert.isTrue(s.isTextureShader());
    });

    test('isTextureShader returns false if there is no sampler', function() {
      var s = myp5._renderer._getColorShader();
      myp5.shader(s);
      assert.isFalse(s.isTextureShader());
    });

    test('isLightShader returns true if there are lighting uniforms', function() {
      var s = myp5._renderer._getLightShader();
      myp5.shader(s);
      assert.isTrue(s.isLightShader());
    });

    test('isLightShader returns false if there are no lighting uniforms', function() {
      var s = myp5._renderer._getPointShader();
      myp5.shader(s);
      assert.isFalse(s.isLightShader());
    });

    test('isNormalShader returns true if there is a normal attribute', function() {
      var s = myp5._renderer._getNormalShader();
      myp5.shader(s);
      assert.isTrue(s.isNormalShader());
    });

    test('isNormalShader returns false if there is no normal attribute', function() {
      var s = myp5._renderer._getPointShader();
      myp5.shader(s);
      assert.isFalse(s.isNormalShader());
    });

    test('isStrokeShader returns true if there is a stroke weight uniform', function() {
      var s = myp5._renderer._getLineShader();
      myp5.shader(s);
      assert.isTrue(s.isStrokeShader());
    });

    test('isStrokeShader returns false if there is no stroke weight uniform', function() {
      var s = myp5._renderer._getLightShader();
      myp5.shader(s);
      assert.isFalse(s.isStrokeShader());
    });
  });
});
