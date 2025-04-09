import p5 from '../../../src/app.js';

suite('p5.Shader', function() {
  var myp5;

  beforeAll(function() {
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

  afterAll(function() {
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
      ];

      testShader(
        'Immediate Mode Shader',
        myp5._renderer._getColorShader(),
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
      var immediateColorShader = myp5._renderer._getColorShader();
      var selectedRetainedShader = myp5._renderer._getFillShader();
      var selectedImmediateShader = myp5._renderer._getFillShader();

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
      var selectedRetainedShader = myp5._renderer._getFillShader();
      var selectedImmediateShader = myp5._renderer._getFillShader();
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
      var selectedRetainedShader = myp5._renderer._getFillShader();
      var selectedImmediateShader = myp5._renderer._getFillShader();
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
      var selectedRetainedShader = myp5._renderer._getFillShader();
      var selectedImmediateShader = myp5._renderer._getFillShader();
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
      var selectedRetainedShader = myp5._renderer._getFillShader();
      var selectedImmediateShader = myp5._renderer._getFillShader();
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
      var s = myp5._renderer.states.userFillShader;

      s.setUniform('uMaterialColor', []);
      s.setUniform('uLightingDirection', []);
    });

    test('Able to set shininess', function() {
      assert.deepEqual(myp5._renderer.states._useShininess, 1);
      myp5.shininess(50);
      assert.deepEqual(myp5._renderer.states._useShininess, 50);
    });

    test('Shader is reset after resetShader is called', function() {
      myp5.shader(myp5._renderer._getColorShader());
      var prevShader = myp5._renderer.states.userFillShader;
      assert.isTrue(prevShader !== null);

      myp5.resetShader();
      var curShader = myp5._renderer.states.userFillShader;
      assert.isTrue(curShader === null);
    });

    suite('Hooks', function() {
      let myShader;

      beforeEach(function() {
        myShader = myp5.createShader(
          `
            precision highp float;

            attribute vec3 aPosition;
            attribute vec2 aTexCoord;
            attribute vec4 aVertexColor;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying vec2 vTexCoord;
            varying vec4 vVertexColor;

            void main() {
                // Apply the camera transform
                vec4 viewModelPosition =
                  uModelViewMatrix *
                  vec4(aPosition, 1.0);

                // Tell WebGL where the vertex goes
                gl_Position =
                  uProjectionMatrix *
                  viewModelPosition;

                // Pass along data to the fragment shader
                vTexCoord = aTexCoord;
                vVertexColor = aVertexColor;
            }
          `,
          `
            precision highp float;

            varying vec2 vTexCoord;
            varying vec4 vVertexColor;

            void main() {
              // Tell WebGL what color to make the pixel
              gl_FragColor = HOOK_getVertexColor(vVertexColor);
            }
          `,
          {
            fragment: {
              'vec4 getVertexColor': '(vec4 color) { return color; }'
            }
          }
        );
      });

      test('available hooks show up in inspectHooks()', function() {
        const logs = [];
        const myLog = (...data) => logs.push(data.join(', '));
        const oldLog = console.log;
        console.log = myLog;
        myShader.inspectHooks();
        console.log = oldLog;
        expect(logs.join('\n')).to.match(/vec4 getVertexColor/);
      });

      test('unfilled hooks do not have an AUGMENTED_HOOK define', function() {
        const modified = myShader.modify({});
        expect(modified.fragSrc()).not.to.match(/#define AUGMENTED_HOOK_getVertexColor/);
      });

      test('filled hooks do have an AUGMENTED_HOOK define', function() {
        const modified = myShader.modify({
          'vec4 getVertexColor': `(vec4 c) {
            return vec4(1., 0., 0., 1.);
          }`
        });
        expect(modified.fragSrc()).to.match(/#define AUGMENTED_HOOK_getVertexColor/);
      });
    });

    test('framebuffer textures are unbound when you draw to the framebuffer', function() {
      const sh = myp5.baseMaterialShader().modify({
        uniforms: {
          'sampler2D myTex': null,
        },
        'vec4 getFinalColor': `(vec4 c) {
          return getTexture(myTex, vec2(0.,0.));
        }`
      });
      const fbo = myp5.createFramebuffer();

      myp5.shader(sh);
      sh.setUniform('myTex', fbo);

      fbo.draw(() => myp5.background('red'));

      sh.setUniform('myTex', fbo);
      myp5.noStroke();
      myp5.plane(myp5.width, myp5.height);
      assert.deepEqual(myp5.get(0, 0), [255, 0, 0, 255]);
    });
  });

  suite('hookTypes', function() {
    test('Produces expected types on baseFilterShader()', function() {
      const types = myp5.baseFilterShader().hookTypes('vec4 getColor');
      assert.deepEqual(types, {
        name: 'getColor',
        returnType: {
          typeName: 'vec4',
          qualifiers: [],
          properties: undefined,
        },
        parameters: [
          {
            name: 'inputs',
            type: {
              typeName: 'FilterInputs',
              qualifiers: [],
              properties: [
                {
                  name: 'texCoord',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                  }
                },
                {
                  name: 'canvasSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                  }
                },
                {
                  name: 'texelSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                  }
                },
              ],
            }
          },
          {
            name: 'canvasContent',
            type: {
              typeName: 'sampler2D',
              qualifiers: ['in'],
              properties: undefined,
            }
          }
        ]
      });
    });
  });
});
