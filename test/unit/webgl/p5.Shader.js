import p5 from '../../../src/app.js';
suite('p5.Shader', function() {
  var myp5;
  beforeAll(function() {
    window.IS_MINIFIED = true;
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
        'uProjectionMatrix'
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
      test('anonymous function shaderModifier does not throw when parsed', function() {
        const callModify = () => myShader.modify(function() {});
        expect(callModify).not.toThrowError();
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
          'sampler2D myTex': null
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
          properties: undefined
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
                    properties: undefined
                  }
                },
                {
                  name: 'canvasSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined
                  }
                },
                {
                  name: 'texelSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined
                  }
                }
              ]
            }
          },
          {
            name: 'canvasContent',
            type: {
              typeName: 'sampler2D',
              qualifiers: ['in'],
              properties: undefined
            }
          }
        ]
      });
    });
  });
  suite('p5.strands', () => {
    test('does not break when arrays are in uniform callbacks', () => {
      myp5.createCanvas(5, 5, myp5.WEBGL);
      const myShader = myp5.baseMaterialShader().modify(() => {
        const size = myp5.uniformVector2(() => [myp5.width, myp5.height]);
        myp5.getPixelInputs(inputs => {
          inputs.color = [
            size / 1000,
            0,
            1
          ];
          return inputs;
        });
      }, { myp5 });
      expect(() => {
        myp5.shader(myShader);
        myp5.plane(myp5.width, myp5.height);
      }).not.toThrowError();
    });
    suite('if statement conditionals', () => {
      test('handle simple if statement with true condition', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.5); // initial gray
            if (condition > 0.5) {
              color = myp5.float(1.0); // set to white in if branch
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is white (condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });
      test('handle simple if statement with simpler assignment', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let color = 1; // initial gray
            if (condition > 0.5) {
              color = 1; // set to white in if branch
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is white (condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });
      test('handle simple if statement with false condition', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 0.0); // false condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.5); // initial gray
            if (condition > 0.5) {
              color = myp5.float(1.0); // set to white in if branch
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is gray (condition was false, original value kept)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });
      test('handle if-else statement', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 0.0); // false condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.5); // initial gray
            if (condition > 0.5) {
              color = myp5.float(1.0); // white for true
            } else {
              color = myp5.float(0.0); // black for false
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is black (else branch executed)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0, 5); // Red channel should be ~0 (black)
        assert.approximately(pixelColor[1], 0, 5); // Green channel should be ~0
        assert.approximately(pixelColor[2], 0, 5); // Blue channel should be ~0
      });
      test('handle multiple variable assignments in if statement', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let red = myp5.float(0.0);
            let green = myp5.float(0.0);
            let blue = myp5.float(0.0);
            if (condition > 0.5) {
              red = myp5.float(1.0);
              green = myp5.float(0.5);
              blue = myp5.float(0.0);
            }
            inputs.color = [red, green, blue, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel has the expected color (red=1.0, green=0.5, blue=0.0)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 0, 5);   // Blue channel should be ~0
      });
      test('handle modifications after if statement', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0); // start with black
            if (condition > 0.5) {
              color = myp5.float(1.0); // set to white in if branch
            } else {
              color = myp5.float(0.5); // set to gray in else branch
            }
            // Modify the color after the if statement
            color = color * 0.5; // Should result in 0.5 * 1.0 = 0.5 (gray)
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is gray (white * 0.5 = gray)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });
      test('handle modifications after if statement in both branches', () => {
        myp5.createCanvas(100, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            debugger
            const uv = inputs.texCoord;
            const condition = uv.x > 0.5; // left half false, right half true
            let color = myp5.float(0.0);
            if (condition) {
              color = myp5.float(1.0); // white on right side
            } else {
              color = myp5.float(0.8); // light gray on left side
            }
            // Multiply by 0.5 after the if statement
            color = color * 0.5;
            // Right side: 1.0 * 0.5 = 0.5 (medium gray)
            // Left side: 0.8 * 0.5 = 0.4 (darker gray)
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check left side (false condition)
        const leftPixel = myp5.get(25, 25);
        assert.approximately(leftPixel[0], 102, 5); // 0.4 * 255 ≈ 102
        // Check right side (true condition)
        const rightPixel = myp5.get(75, 25);
        assert.approximately(rightPixel[0], 127, 5); // 0.5 * 255 ≈ 127
      });
      test('handle if-else-if chains', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const value = myp5.uniformFloat(() => 0.5); // middle value
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0);
            if (value > 0.8) {
              color = myp5.float(1.0); // white for high values
            } else if (value > 0.3) {
              color = myp5.float(0.5); // gray for medium values
            } else {
              color = myp5.float(0.0); // black for low values
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is gray (medium condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });
      test('handle if-else-if chains in the else branch', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const value = myp5.uniformFloat(() => 0.2); // middle value
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0);
            if (value > 0.8) {
              color = myp5.float(1.0); // white for high values
            } else if (value > 0.3) {
              color = myp5.float(0.5); // gray for medium values
            } else {
              color = myp5.float(0.0); // black for low values
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is gray (medium condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 0, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 0, 5); // Blue channel should be ~127
      });
      test('handle nested if statements', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const outerCondition = myp5.uniformFloat(() => 1.0); // true
          const innerCondition = myp5.uniformFloat(() => 1.0); // true
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0);
            if (outerCondition > 0.5) {
              if (innerCondition > 0.5) {
                color = myp5.float(1.0); // white for both conditions true
              } else {
                color = myp5.float(0.5); // gray for outer true, inner false
              }
            } else {
              color = myp5.float(0.0); // black for outer false
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is white (both conditions were true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });
      // Keep one direct API test for completeness
      test('handle direct StrandsIf API usage', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const conditionValue = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.5); // initial gray
            const assignments = myp5.strandsIf(
              conditionValue.greaterThan(0),
              () => {
                let tmp = color.copy();
                tmp = myp5.float(1.0); // set to white in if branch
                return { color: tmp };
              }
            ).Else(() => {
              return { color: color }; // keep original in else branch
            });
            color = assignments.color;
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is white (condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });
      test('handle direct StrandsIf ElseIf API usage', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const value = myp5.uniformFloat(() => 0.5); // middle value
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0); // initial black
            const assignments = myp5.strandsIf(
              value.greaterThan(0.8),
              () => {
                let tmp = color.copy();
                tmp = myp5.float(1.0); // white for high values
                return { color: tmp };
              }
            ).ElseIf(
              value.greaterThan(0.3),
              () => {
                let tmp = color.copy();
                tmp = myp5.float(0.5); // gray for medium values
                return { color: tmp };
              }
            ).Else(() => {
              let tmp = color.copy();
              tmp = myp5.float(0.0); // black for low values
              return { color: tmp };
            });
            color = assignments.color;
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is gray (medium condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });
    });

    suite('for loop statements', () => {
      test('handle simple for loop with known iteration count', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0);

            for (let i = 0; i < 3; i++) {
              color = color + 0.1;
            }

            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should loop 3 times: 0.0 + 0.1 + 0.1 + 0.1 = 0.3
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle swizzle assignments in loops', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let color = [0, 0, 0, 1];

            for (let i = 0; i < 3; i++) {
              color.rgb += 0.1;
            }

            inputs.color = color;
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should loop 3 times: 0.0 + 0.1 + 0.1 + 0.1 = 0.3
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle for loop with variable as loop bound', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          const maxIterations = myp5.uniformInt(() => 2);

          myp5.getPixelInputs(inputs => {
            let result = myp5.float(0.0);

            for (let i = 0; i < maxIterations; i++) {
              result = result + 0.25;
            }

            inputs.color = [result, result, result, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should loop 2 times: 0.0 + 0.25 + 0.25 = 0.5
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 127, 5);
        assert.approximately(pixelColor[2], 127, 5);
      });

      test('handle for loop modifying multiple variables', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let red = myp5.float(0.0);
            let green = myp5.float(0.0);

            for (let i = 0; i < 4; i++) {
              red = red + 0.125;    // 4 * 0.125 = 0.5
              green = green + 0.25; // 4 * 0.25 = 1.0
            }

            inputs.color = [red, green, 0.0, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 255, 5); // 1.0 * 255 = 255
        assert.approximately(pixelColor[2], 0, 5);   // 0.0 * 255 = 0
      });

      test('handle for loop with conditional inside', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let sum = myp5.float(0.0);

            for (let i = 0; i < 5; i++) {
              if (i % 2 === 0) {
                sum = sum + 0.1; // Add on even iterations: 0, 2, 4
              }
            }

            inputs.color = [sum, sum, sum, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should add 0.1 three times (iterations 0, 2, 4): 3 * 0.1 = 0.3
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle nested for loops', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let total = myp5.float(0.0);

            for (let i = 0; i < 2; i++) {
              for (let j = 0; j < 3; j++) {
                total = total + 0.05; // 2 * 3 = 6 iterations
              }
            }

            inputs.color = [total, total, total, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should run 6 times: 6 * 0.05 = 0.3
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle complex nested for loops with multiple phi assignments', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let outerSum = myp5.float(0.0);
            let globalCounter = myp5.float(0.0);

            // Outer for loop modifying multiple variables
            for (let i = 0; i < 2; i++) {
              let innerSum = myp5.float(0.0);
              let localCounter = myp5.float(0.0);

              // Inner for loop also modifying multiple variables
              for (let j = 0; j < 2; j++) {
                innerSum = innerSum + 0.1;
                localCounter = localCounter + 1.0;
                globalCounter = globalCounter + 0.5; // This modifies outer scope
              }

              // Complex state modification between loops involving all variables
              innerSum = innerSum * localCounter; // 0.2 * 2.0 = 0.4
              outerSum = outerSum + innerSum;     // Add to outer sum
              globalCounter = globalCounter * 0.5; // Modify global again
            }

            // Final result should be: 2 iterations * 0.4 = 0.8 for outerSum
            // globalCounter: ((0 + 2*0.5)*0.5 + 2*0.5)*0.5 = ((1)*0.5 + 1)*0.5 = 1.5*0.5 = 0.75
            inputs.color = [outerSum, globalCounter, 0.0, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 204, 5); // 0.8 * 255 ≈ 204
        assert.approximately(pixelColor[1], 191, 5); // 0.75 * 255 ≈ 191
        assert.approximately(pixelColor[2], 0, 5);
      });

      test('handle nested for loops with state modification between loops', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let total = myp5.float(0.0);

            // Outer for loop
            for (let i = 0; i < 2; i++) {
              let innerSum = myp5.float(0.0);

              // Inner for loop
              for (let j = 0; j < 3; j++) {
                innerSum = innerSum + 0.1; // 3 * 0.1 = 0.3 per outer iteration
              }

              // State modification between inner and outer loop
              innerSum = innerSum * 0.5; // Multiply by 0.5: 0.3 * 0.5 = 0.15
              total = total + innerSum; // Add to total: 2 * 0.15 = 0.3
            }

            inputs.color = [total, total, total, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should be: 2 iterations * (3 * 0.1 * 0.5) = 2 * 0.15 = 0.3
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle for loop using loop variable in calculations', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let sum = myp5.float(0.0);

            for (let i = 1; i <= 3; i++) {
              sum = sum + (i * 0.1); // 1*0.1 + 2*0.1 + 3*0.1 = 0.6
            }

            inputs.color = [sum, sum, sum, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should be: 0.1 + 0.2 + 0.3 = 0.6
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 153, 5); // 0.6 * 255 ≈ 153
        assert.approximately(pixelColor[1], 153, 5);
        assert.approximately(pixelColor[2], 153, 5);
      });

      // Keep one direct API test for completeness
      test('handle direct StrandsFor API usage', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let accumulator = myp5.float(0.0);

            const loopResult = myp5.strandsFor(
              () => 0,
              (loopVar) => loopVar < 4,
              (loopVar) => loopVar + 1,
              (loopVar, vars) => {
                let newValue = vars.accumulator.copy();
                newValue = newValue + 0.125;
                return { accumulator: newValue };
              },
              { accumulator: accumulator.copy() },
            );

            accumulator = loopResult.accumulator;
            inputs.color = [accumulator, accumulator, accumulator, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should loop 4 times: 4 * 0.125 = 0.5
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 127, 5);
        assert.approximately(pixelColor[2], 127, 5);
      });

      test('handle for loop with break statement', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let color = 0;
            let maxIterations = 5;

            for (let i = 0; i < 100; i++) {
              if (i >= maxIterations) {
                break;
              }
              color = color + 0.1;
            }

            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Should break after 5 iterations: 5 * 0.1 = 0.5
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
      });
    });
  });
});
