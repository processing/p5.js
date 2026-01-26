import p5 from '../../../src/app.js';
import { vi } from 'vitest';

const mockUserError = vi.fn();
vi.mock('../../../src/strands/strands_FES', () => ({
  userError: (...args) => {
    mockUserError(...args);
    const prefixedMessage = `[p5.strands ${args[0]}]: ${args[1]}`;
    throw new Error(prefixedMessage);
  },
  internalError: (msg) => { throw new Error(`[p5.strands internal error]: ${msg}`); }
}));

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
          properties: undefined,
          dataType: {
            baseType: 'float',
            dimension: 4,
            fnName: 'vec4',
            priority: 3
          }
        },
        parameters: [
          {
            name: 'inputs',
            type: {
              typeName: 'FilterInputs',
              qualifiers: [],
              dataType: null,
              properties: [
                {
                  name: 'texCoord',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                    dataType: {
                      baseType: 'float',
                      dimension: 2,
                      fnName: 'vec2',
                      priority: 3
                    }
                  }
                },
                {
                  name: 'canvasSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                    dataType: {
                      baseType: 'float',
                      dimension: 2,
                      fnName: 'vec2',
                      priority: 3
                    }
                  }
                },
                {
                  name: 'texelSize',
                  type: {
                    typeName: 'vec2',
                    qualifiers: [],
                    properties: undefined,
                    dataType: {
                      baseType: 'float',
                      dimension: 2,
                      fnName: 'vec2',
                      priority: 3
                    }
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
              properties: undefined,
              dataType: {
                baseType: 'sampler2D',
                dimension: 1,
                fnName: 'sampler2D',
                priority: -10
              }
            }
          }
        ]
      });
    });
  });
  suite('p5.strands', () => {
    test('handles named function callbacks', () => {
      myp5.createCanvas(5, 5, myp5.WEBGL);
      function myMaterial() {
        myp5.getPixelInputs(inputs => {
          inputs.color = [
            1,
            0,
            0,
            1
          ];
          return inputs;
        });
      }
      const myShader = myp5.baseMaterialShader().modify(myMaterial, { myp5 });
      expect(() => {
        myp5.shader(myShader);
        myp5.plane(myp5.width, myp5.height);
      }).not.toThrowError();
    });

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

    test('handle custom uniform names with automatic values', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      const testShader = myp5.baseMaterialShader().modify(() => {
        // Variable name is 'brightness' but uniform name is 'customBrightness'
        const brightness = myp5.uniformFloat('customBrightness', () => 0.8);
        myp5.getPixelInputs(inputs => {
          inputs.color = [brightness, brightness, brightness, 1.0];
          return inputs;
        });
      }, { myp5 });

      myp5.noStroke();
      myp5.shader(testShader);
      myp5.plane(myp5.width, myp5.height);

      // Check that the shader uses the automatic value (0.8)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 204, 5); // 0.8 * 255 = 204
      assert.approximately(pixelColor[1], 204, 5);
      assert.approximately(pixelColor[2], 204, 5);
    });

    test('handle custom uniform names with manual setUniform', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);
      const testShader = myp5.baseMaterialShader().modify(() => {
        // Variable name is 'brightness' but uniform name is 'customBrightness'
        const brightness = myp5.uniformFloat('customBrightness');
        myp5.getPixelInputs(inputs => {
          inputs.color = [brightness, brightness, brightness, 1.0];
          return inputs;
        });
      }, { myp5 });

      // Set the uniform using the custom name
      testShader.setUniform('customBrightness', 0.6);

      myp5.noStroke();
      myp5.shader(testShader);
      myp5.plane(myp5.width, myp5.height);

      // Check that the shader uses the manual value (0.6)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 153, 5); // 0.6 * 255 = 153
      assert.approximately(pixelColor[1], 153, 5);
      assert.approximately(pixelColor[2], 153, 5);
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
      test('handle simple if statement with condition that is not a swizzle', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const x = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.5); // initial gray
            if (x > 0.5) {
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
        // Check that the center pixel is black (else condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0, 5);
        assert.approximately(pixelColor[1], 0, 5);
        assert.approximately(pixelColor[2], 0, 5);
      });
      test('handle conditional assignment in if-else-if chains', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const val = myp5.uniformFloat(() => Math.PI * 8);
          myp5.getPixelInputs(inputs => {
            let shininess = 0
            let color = 0
            if (val > 5) {
              const elevation = myp5.sin(val)
              if (elevation > 0.4) {
                shininess = 0;
              } else if (elevation > 0.25) {
                shininess = 30;
              } else {
                color = 1;
                shininess = 100;
              }
            } else {
              shininess += 25;
            }
            inputs.shininess = shininess;
            inputs.color = [color, color, color, 1];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        // Check that the center pixel is 255 (hit nested else statement)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5);
        assert.approximately(pixelColor[1], 255, 5);
        assert.approximately(pixelColor[2], 255, 5);
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
      test('handle if statement with || (OR) operator', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let c = [1, 1, 1, 1];
            if (myp5.abs(inputs.texCoord.x - 0.5) > 0.2 || myp5.abs(inputs.texCoord.y - 0.5) > 0.2) {
              c = [1, 0, 0, 1];
            }
            inputs.color = c;
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        const centerPixel = myp5.get(25, 25);
        assert.approximately(centerPixel[0], 255, 5);
        assert.approximately(centerPixel[1], 255, 5);
        assert.approximately(centerPixel[2], 255, 5);
        const leftEdgePixel = myp5.get(5, 25);
        assert.approximately(leftEdgePixel[0], 255, 5);
        assert.approximately(leftEdgePixel[1], 0, 5);
        assert.approximately(leftEdgePixel[2], 0, 5);
        const topEdgePixel = myp5.get(25, 5);
        assert.approximately(topEdgePixel[0], 255, 5);
        assert.approximately(topEdgePixel[1], 0, 5);
        assert.approximately(topEdgePixel[2], 0, 5);
      });
      test('handle if statement with && (AND) operator', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let color = myp5.float(0.0);
            if (inputs.texCoord.x > 0.5 && inputs.texCoord.y > 0.5) {
              color = myp5.float(1.0);
            }
            inputs.color = [color, color, color, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);
        const bottomRightPixel = myp5.get(45, 45);
        assert.approximately(bottomRightPixel[0], 255, 5);
        assert.approximately(bottomRightPixel[1], 255, 5);
        assert.approximately(bottomRightPixel[2], 255, 5);
        const topLeftPixel = myp5.get(5, 5);
        assert.approximately(topLeftPixel[0], 0, 5);
        assert.approximately(topLeftPixel[1], 0, 5);
        assert.approximately(topLeftPixel[2], 0, 5);
        const topRightPixel = myp5.get(45, 5);
        assert.approximately(topRightPixel[0], 0, 5);
        assert.approximately(topRightPixel[1], 0, 5);
        assert.approximately(topRightPixel[2], 0, 5);
        const bottomLeftPixel = myp5.get(5, 45);
        assert.approximately(bottomLeftPixel[0], 0, 5);
        assert.approximately(bottomLeftPixel[1], 0, 5);
        assert.approximately(bottomLeftPixel[2], 0, 5);
      });
      test('handle struct property assignment in if-else branches', () => {
        myp5.createCanvas(100, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            if (inputs.texCoord.x > 0.5) {
              inputs.color = [1, 0, 0, 1];
            } else {
              inputs.color = [0, 0, 1, 1];
            }
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        const leftPixel = myp5.get(25, 25);
        assert.approximately(leftPixel[0], 0, 5);
        assert.approximately(leftPixel[1], 0, 5);
        assert.approximately(leftPixel[2], 255, 5);

        const rightPixel = myp5.get(75, 25);
        assert.approximately(rightPixel[0], 255, 5);
        assert.approximately(rightPixel[1], 0, 5);
        assert.approximately(rightPixel[2], 0, 5);
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

      test('handle comma-separated expressions with assignments', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        const testShader = myp5.baseMaterialShader().modify(() => {
          const condition = myp5.uniformFloat(() => 1.0); // true condition
          myp5.getPixelInputs(inputs => {
            let red = myp5.float(0.0);
            let green = myp5.float(0.0);
            let blue = myp5.float(0.0);

            if (condition > 0.5) {
              // Use comma-separated expressions with assignments
              red = myp5.float(1.0), green = myp5.float(0.5), blue = myp5.float(0.2);
            } else {
              red = myp5.float(0.0), green = myp5.float(0.0), blue = myp5.float(0.0);
            }

            inputs.color = [red, green, blue, 1.0];
            return inputs;
          });
        }, { myp5 });
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Check that the center pixel has the expected color (condition was true)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5);
        assert.approximately(pixelColor[1], 127, 5);
        assert.approximately(pixelColor[2], 51, 5);
      });

      test('handle early return in if-else branches', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            let value = 1;
            if (value > 0.5) {
              return [1, 0, 0, 1];
            } else {
              return [0, 1, 0, 1];
            }
          });
        }, { myp5 });

        myp5.background(255, 255, 255);
        myp5.filter(testShader);

        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5);
        assert.approximately(pixelColor[1], 0, 5);
        assert.approximately(pixelColor[2], 0, 5);
      });

      test('handle early return in if with content afterwards', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            let value = 1;
            if (value > 0.5) {
              return [1, 0, 0, 1];
            }

            let otherValue = 0.2;
            otherValue *= 2;
            return [otherValue, 0, 0, 1];
          });
        }, { myp5 });

        myp5.background(255, 255, 255);
        myp5.filter(testShader);

        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5);
        assert.approximately(pixelColor[1], 0, 5);
        assert.approximately(pixelColor[2], 0, 5);
      });

      test('handle false early return in if with content afterwards', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            let value = 1;
            if (value < 0.5) {
              return [1, 0, 0, 1];
            }

            let otherValue = 0.2;
            otherValue *= 2;
            return [otherValue, 0, 0, 1];
          });
        }, { myp5 });

        myp5.background(255, 255, 255);
        myp5.filter(testShader);

        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0.4 * 255, 5);
        assert.approximately(pixelColor[1], 0, 5);
        assert.approximately(pixelColor[2], 0, 5);
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

      test('handle for loop modifying multiple variables after minification', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let red = myp5.float(0.0);
            let green = myp5.float(0.0);

            for (let i = 0; i < 4; i++) {
              // Note the comma!
              red = red + 0.125,    // 4 * 0.125 = 0.5
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

      test('handle statements after for loop before return', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseMaterialShader().modify(() => {
          myp5.getPixelInputs(inputs => {
            let avg = myp5.vec3(0.0);
            let total = 0.0;

            // Simulate blur-like accumulation in for loop
            for (let i = 0; i < 3; i++) {
              const sample = myp5.vec3(0.2, 0.1, 0.3);
              const weight = 1.0;
              avg += weight * sample;
              total += weight;
            }

            const blended = avg / total;

            inputs.color = [blended.x, blended.y, blended.z, 1.0];
            return inputs;
          });
        }, { myp5 });

        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Expected result: (3 * [0.2, 0.1, 0.3]) / 3 = [0.2, 0.1, 0.3]
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 51, 5);  // 0.2 * 255 ≈ 51
        assert.approximately(pixelColor[1], 25, 5);  // 0.1 * 255 ≈ 25
        assert.approximately(pixelColor[2], 77, 5);  // 0.3 * 255 ≈ 77
      });

      test('handle nested loops with accumulator modified in inner loop', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            let aliveNeighbours = 0;

            for (let xOff = -1; xOff <= 1; xOff++) {
              for (let yOff = -1; yOff <= 1; yOff++) {
                if (xOff != 0 || yOff != 0) {
                  aliveNeighbours += 0.1;
                }
              }
            }

            // 8 neighbors (all except center): 8 * 0.1 = 0.8
            return [aliveNeighbours, aliveNeighbours, aliveNeighbours, 1];
          });
        }, { myp5 });

        myp5.background(255, 0, 0); // Red background
        myp5.filter(testShader);

        // Should be: 8 * 0.1 = 0.8
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 204, 5); // 0.8 * 255 ≈ 204
        assert.approximately(pixelColor[1], 204, 5);
        assert.approximately(pixelColor[2], 204, 5);
      });
    });

    suite('passing data between shaders', () => {
      test('handle passing a value from a vertex hook to a fragment hook', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        myp5.pixelDensity(1);

        const testShader = myp5.baseMaterialShader().modify(() => {
          let worldPos = myp5.varyingVec3();
          myp5.getWorldInputs((inputs) => {
            worldPos = inputs.position.xyz;
            return inputs;
          });
          myp5.getFinalColor((c) => {
            return [myp5.abs(worldPos / 25), 1];
          });
        }, { myp5 });

        myp5.background(0, 0, 255); // Make the background blue to tell it apart
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // The middle should have position 0,0 which translates to black
        const midColor = myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value from a vertex hook to a fragment hook with swizzle assignment', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        myp5.pixelDensity(1);

        const testShader = myp5.baseMaterialShader().modify(() => {
          let worldPos = myp5.varyingVec3();
          myp5.getWorldInputs((inputs) => {
            worldPos.xyz = inputs.position.xyz;
            return inputs;
          });
          myp5.getFinalColor((c) => {
            return [myp5.abs(worldPos / 25), 1];
          });
        }, { myp5 });

        myp5.background(0, 0, 255); // Make the background blue to tell it apart
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // The middle should have position 0,0 which translates to black
        const midColor = myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value from a vertex hook to a fragment hook as part of hook output', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        myp5.pixelDensity(1);

        const testShader = myp5.baseMaterialShader().modify(() => {
          let worldPos = myp5.varyingVec3();
          myp5.getWorldInputs((inputs) => {
            worldPos = inputs.position.xyz;
            inputs.position.xyz = worldPos + [25, 25, 0];
            return inputs;
          });
          myp5.getFinalColor((c) => {
            return [myp5.abs(worldPos / 25), 1];
          });
        }, { myp5 });

        myp5.background(0, 0, 255); // Make the background blue to tell it apart
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // The middle (shifted +25,25) should have position 0,0 which translates to black
        const midColor = myp5.get(49, 49);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner (shifted +25,25) should have position 1,1 which translates to yellow
        const cornerColor = myp5.get(25, 25);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value between fragment hooks only', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        myp5.pixelDensity(1);

        const testShader = myp5.baseMaterialShader().modify(() => {
          let processedNormal = myp5.sharedVec3();
          myp5.getPixelInputs((inputs) => {
            processedNormal = myp5.normalize(inputs.normal);
            return inputs;
          });
          myp5.getFinalColor((c) => {
            // Use the processed normal to create a color - should be [0, 0, 1] for plane facing camera
            return [myp5.abs(processedNormal), 1];
          });
        }, { myp5 });

        myp5.background(255, 0, 0); // Red background to distinguish from result
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // Normal of plane facing camera should be [0, 0, 1], so color should be [0, 0, 255]
        const centerColor = myp5.get(25, 25);
        assert.approximately(centerColor[0], 0, 5);   // Red component
        assert.approximately(centerColor[1], 0, 5);   // Green component
        assert.approximately(centerColor[2], 255, 5); // Blue component
      });

      test('handle passing a value from a vertex hook to a fragment hook using shared*', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);
        myp5.pixelDensity(1);

        const testShader = myp5.baseMaterialShader().modify(() => {
          let worldPos = myp5.sharedVec3();
          myp5.getWorldInputs((inputs) => {
            worldPos = inputs.position.xyz;
            return inputs;
          });
          myp5.getFinalColor((c) => {
            return [myp5.abs(worldPos / 25), 1];
          });
        }, { myp5 });

        myp5.background(0, 0, 255); // Make the background blue to tell it apart
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // The middle should have position 0,0 which translates to black
        const midColor = myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });
    });

    suite('filter shader hooks', () => {
      test('handle getColor hook with non-struct return type', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            // Simple test - just return a constant color
            return [1.0, 0.5, 0.0, 1.0]; // Orange color
          });
        }, { myp5 });

        // Create a simple scene to filter
        myp5.background(0, 0, 255); // Blue background

        // Apply the filter
        myp5.filter(testShader);

        // Check that the filter was applied (should be orange)
        const pixelColor = myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 0, 5);   // Blue channel should be 0
      });

      test('simple vector multiplication in filter shader', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          myp5.getColor((inputs, canvasContent) => {
            // Test simple scalar * vector operation
            const scalar = 0.5;
            const vector = [1, 2];
            const result = scalar * vector;
            return [result.x, result.y, 0, 1];
          });
        }, { myp5 });
      });

      test('handle complex filter shader with for loop and vector operations', () => {
        myp5.createCanvas(50, 50, myp5.WEBGL);

        const testShader = myp5.baseFilterShader().modify(() => {
          const r = myp5.uniformFloat(() => 3); // Small value for testing
          myp5.getColor((inputs, canvasContent) => {
            let sum = [0, 0, 0, 0];
            let samples = 1;

            for (let i = 0; i < r; i++) {
              samples++;
              sum += myp5.texture(canvasContent, inputs.texCoord + (i / r) * [
                myp5.sin(4 * myp5.PI * i / r),
                myp5.cos(4 * myp5.PI * i / r)
              ]);
            }

            return sum / samples;
          });
        }, { myp5 });

        // Create a simple scene to filter
        myp5.background(255, 0, 0); // Red background

        // Apply the filter
        myp5.filter(testShader);

        // The result should be some variation of the red background
        const pixelColor = myp5.get(25, 25);
        // Just verify it ran without crashing - exact color will depend on sampling
        assert.isNumber(pixelColor[0]);
        assert.isNumber(pixelColor[1]);
        assert.isNumber(pixelColor[2]);
      });
    });

    suite('noise()', () => {
      for (let i = 1; i <= 3; i++) {
        test(`works with ${i}D vectors`, () => {
          expect(() => {
            myp5.createCanvas(50, 50, myp5.WEBGL);
            const input = new Array(i).fill(10);
            const testShader = myp5.baseFilterShader().modify(() => {
              myp5.getColor(() => {
                return [myp5.noise(input), 0, 0, 1];
              });
            }, { myp5, input });
            myp5.shader(testShader);
            myp5.plane(10, 10);
          }).not.toThrowError();
        });

        test(`works with ${i}D positional arguments`, () => {
          expect(() => {
            myp5.createCanvas(50, 50, myp5.WEBGL);
            const input = new Array(i).fill(10);
            const testShader = myp5.baseFilterShader().modify(() => {
              myp5.getColor(() => {
                return [myp5.noise(...input), 0, 0, 1];
              });
            }, { myp5, input });
            myp5.shader(testShader);
            myp5.plane(10, 10);
          }).not.toThrowError();
        });
      }

      for (const i of [0, 4]) {
        test(`Does not work in ${i}D`, () => {
          expect(() => {
            myp5.createCanvas(50, 50, myp5.WEBGL);
            const input = new Array(i).fill(10);
            const testShader = myp5.baseFilterShader().modify(() => {
              myp5.getColor(() => {
                return [myp5.noise(input), 0, 0, 1];
              });
            }, { myp5, input });
            myp5.shader(testShader);
            myp5.plane(10, 10);
          }).toThrowError();
        });

        test(`Does not work in ${i}D with positional arguments`, () => {
          expect(() => {
            myp5.createCanvas(50, 50, myp5.WEBGL);
            const input = new Array(i).fill(10);
            const testShader = myp5.baseFilterShader().modify(() => {
              myp5.getColor(() => {
                return [myp5.noise(...input), 0, 0, 1];
              });
            }, { myp5, input });
            myp5.shader(testShader);
            myp5.plane(10, 10);
          }).toThrowError();
        });
      }
    });

    test('Can use begin/end API for hooks with result', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      const testShader = myp5.baseFilterShader().modify(() => {
        myp5.getColor.begin();
        myp5.getColor.set([1.0, 0.5, 0.0, 1.0]);
        myp5.getColor.end();
      }, { myp5 });

      // Create a simple scene to filter
      myp5.background(0, 0, 255); // Blue background

      // Apply the filter
      myp5.filter(testShader);

      // Check that the filter was applied (should be orange)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 255, 5);
      assert.approximately(pixelColor[1], 127, 5);
      assert.approximately(pixelColor[2], 0, 5);
    });

    test('Can use begin/end API for hooks with hook alias', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      const testShader = myp5.baseFilterShader().modify(() => {
        myp5.filterColor.begin();
        myp5.filterColor.set([1.0, 0.5, 0.0, 1.0]);
        myp5.filterColor.end();
      }, { myp5 });

      // Create a simple scene to filter
      myp5.background(0, 0, 255); // Blue background

      // Apply the filter
      myp5.filter(testShader);

      // Check that the filter was applied (should be orange)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 255, 5);
      assert.approximately(pixelColor[1], 127, 5);
      assert.approximately(pixelColor[2], 0, 5);
    });

    test('Can use begin/end API for hooks modifying inputs', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      const testShader = myp5.baseMaterialShader().modify(() => {
        myp5.getPixelInputs.begin();
        myp5.getPixelInputs.color = [1.0, 0.5, 0.0, 1.0];
        myp5.getPixelInputs.end();
      }, { myp5 });

      // Create a simple scene to filter
      myp5.background(0, 0, 255); // Blue background

      // Draw a fullscreen rectangle
      myp5.noStroke();
      myp5.fill('red')
      myp5.shader(testShader);
      myp5.plane(myp5.width, myp5.height);

      // Check that the filter was applied (should be orange)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 255, 5);
      assert.approximately(pixelColor[1], 127, 5);
      assert.approximately(pixelColor[2], 0, 5);
    });

    test('Can use begin/end API for hooks with struct access', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      const testShader = myp5.baseFilterShader().modify(() => {
        myp5.filterColor.begin();
        let c = myp5.getTexture(myp5.filterColor.canvasContent, myp5.filterColor.texCoord);
        c.r = 1;
        myp5.filterColor.set(c);
        myp5.filterColor.end();
      }, { myp5 });

      // Create a simple scene to filter
      myp5.background(0, 0, 255); // Blue background

      // Apply the filter
      myp5.filter(testShader);

      // Check that the filter was applied (should be magenta)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 255, 5);
      assert.approximately(pixelColor[1], 0, 5);
      assert.approximately(pixelColor[2], 255, 5);
    });

    test('Can use begin/end API for hooks with get* prefix removed', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      const testShader = myp5.baseMaterialShader().modify(() => {
        myp5.pixelInputs.begin();
        myp5.pixelInputs.color = [1.0, 0.5, 0.0, 1.0];
        myp5.pixelInputs.end();
      }, { myp5 });

      // Create a simple scene to filter
      myp5.background(0, 0, 255); // Blue background

      // Draw a fullscreen rectangle
      myp5.noStroke();
      myp5.fill('red')
      myp5.shader(testShader);
      myp5.plane(myp5.width, myp5.height);

      // Check that the filter was applied (should be orange)
      const pixelColor = myp5.get(25, 25);
      assert.approximately(pixelColor[0], 255, 5);
      assert.approximately(pixelColor[1], 127, 5);
      assert.approximately(pixelColor[2], 0, 5);
    });
  });

  suite('p5.strands error messages', () => {
    afterEach(() => {
      mockUserError.mockClear();
    });

    test('wrong type in struct hook shows actual type and expected properties', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      try {
        myp5.baseMaterialShader().modify(() => {
          myp5.getWorldInputs(() => [1, 2, 3, 4]); // vec4 instead of Vertex struct
        }, { myp5 });
      } catch (e) { /* expected */ }

      assert.isAbove(mockUserError.mock.calls.length, 0, 'FES.userError should have been called');
      const errMsg = mockUserError.mock.calls[0][1];
      assert.notInclude(errMsg, 'a undefined'); // #8444
      assert.include(errMsg, 'float4');
      assert.include(errMsg, 'getWorldInputs');
      assert.include(errMsg, 'Vertex');
      assert.include(errMsg, 'properties');
    });

    test('vector dimension mismatch shows actual and expected types', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      try {
        myp5.baseMaterialShader().modify(() => {
          myp5.getFinalColor((c) => [c.r, c.g, c.b]); // vec3 instead of vec4
        }, { myp5 });
      } catch (e) { /* expected */ }

      assert.isAbove(mockUserError.mock.calls.length, 0, 'FES.userError should have been called');
      const errMsg = mockUserError.mock.calls[0][1];
      assert.include(errMsg, 'float3');
      assert.include(errMsg, 'float4');
    });

    test('incomplete struct shows expected vs received properties', () => {
      myp5.createCanvas(50, 50, myp5.WEBGL);

      try {
        myp5.baseMaterialShader().modify(() => {
          myp5.getWorldInputs((inputs) => {
            return { position: inputs.position };
          });
        }, { myp5 });
      } catch (e) { /* expected */ }

      assert.isAbove(mockUserError.mock.calls.length, 0, 'FES.userError should have been called');
      const errMsg = mockUserError.mock.calls[0][1];
      assert.include(errMsg, 'Expected properties');
      assert.include(errMsg, 'Received properties');
    });
  });
});
