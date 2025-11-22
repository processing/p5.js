import p5 from '../../../src/app.js';
import rendererWebGPU from "../../../src/webgpu/p5.RendererWebGPU";

p5.registerAddon(rendererWebGPU);

suite('WebGPU p5.Shader', function() {
  var myp5;

  beforeAll(function() {
    window.IS_MINIFIED = true;
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, 'webgpu');
        p.pointLight(250, 250, 250, 100, 100, 0);
        p.ambientMaterial(250);
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('p5.strands', () => {
    test('does not break when arrays are in uniform callbacks', async () => {
      await myp5.createCanvas(5, 5, myp5.WEBGPU);
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
      test('handle simple if statement with true condition', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });

      test('handle simple if statement with simpler assignment', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });

      test('handle simple if statement with false condition', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });

      test('handle if-else statement', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0, 5); // Red channel should be ~0 (black)
        assert.approximately(pixelColor[1], 0, 5); // Green channel should be ~0
        assert.approximately(pixelColor[2], 0, 5); // Blue channel should be ~0
      });

      test('handle multiple variable assignments in if statement', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 0, 5);   // Blue channel should be ~0
      });

      test('handle modifications after if statement', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });

      test('handle modifications after if statement in both branches', async () => {
        await myp5.createCanvas(100, 50, myp5.WEBGPU);
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
        const leftPixel = await myp5.get(25, 25);
        assert.approximately(leftPixel[0], 102, 5); // 0.4 * 255 ≈ 102
        // Check right side (true condition)
        const rightPixel = await myp5.get(75, 25);
        assert.approximately(rightPixel[0], 127, 5); // 0.5 * 255 ≈ 127
      });

      test('handle if-else-if chains', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });

      test('handle if-else-if chains in the else branch', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 0, 5);
        assert.approximately(pixelColor[1], 0, 5);
        assert.approximately(pixelColor[2], 0, 5);
      });

      test('handle conditional assignment in if-else-if chains', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5);
        assert.approximately(pixelColor[1], 255, 5);
        assert.approximately(pixelColor[2], 255, 5);
      });

      test('handle nested if statements', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });

      // Keep one direct API test for completeness
      test('handle direct StrandsIf API usage', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255 (white)
        assert.approximately(pixelColor[1], 255, 5); // Green channel should be 255
        assert.approximately(pixelColor[2], 255, 5); // Blue channel should be 255
      });

      test('handle direct StrandsIf ElseIf API usage', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // Red channel should be ~127 (gray)
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 127, 5); // Blue channel should be ~127
      });
    });

    suite('for loop statements', () => {
      test('handle simple for loop with known iteration count', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle swizzle assignments in loops', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle for loop with variable as loop bound', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 127, 5);
        assert.approximately(pixelColor[2], 127, 5);
      });

      test('handle for loop modifying multiple variables', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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

        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 255, 5); // 1.0 * 255 = 255
        assert.approximately(pixelColor[2], 0, 5);   // 0.0 * 255 = 0
      });

      test('handle for loop with conditional inside', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle nested for loops', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle complex nested for loops with multiple phi assignments', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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

        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 204, 5); // 0.8 * 255 ≈ 204
        assert.approximately(pixelColor[1], 191, 5); // 0.75 * 255 ≈ 191
        assert.approximately(pixelColor[2], 0, 5);
      });

      test('handle nested for loops with state modification between loops', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 77, 5); // 0.3 * 255 ≈ 77
        assert.approximately(pixelColor[1], 77, 5);
        assert.approximately(pixelColor[2], 77, 5);
      });

      test('handle for loop using loop variable in calculations', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 153, 5); // 0.6 * 255 ≈ 153
        assert.approximately(pixelColor[1], 153, 5);
        assert.approximately(pixelColor[2], 153, 5);
      });

      // Keep one direct API test for completeness
      test('handle direct StrandsFor API usage', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
        assert.approximately(pixelColor[1], 127, 5);
        assert.approximately(pixelColor[2], 127, 5);
      });

      test('handle for loop with break statement', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 127, 5); // 0.5 * 255 ≈ 127
      });
    });

    suite('passing data between shaders', () => {
      test.only('handle passing a value from a vertex hook to a fragment hook', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        console.log(testShader.vertSrc())

        myp5.background(0, 0, 255); // Make the background blue to tell it apart
        myp5.noStroke();
        myp5.shader(testShader);
        myp5.plane(myp5.width, myp5.height);

        // The middle should have position 0,0 which translates to black
        const midColor = await myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = await myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value from a vertex hook to a fragment hook with swizzle assignment', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const midColor = await myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = await myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value from a vertex hook to a fragment hook as part of hook output', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const midColor = await myp5.get(49, 49);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner (shifted +25,25) should have position 1,1 which translates to yellow
        const cornerColor = await myp5.get(25, 25);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });

      test('handle passing a value between fragment hooks only', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const centerColor = await myp5.get(25, 25);
        assert.approximately(centerColor[0], 0, 5);   // Red component
        assert.approximately(centerColor[1], 0, 5);   // Green component
        assert.approximately(centerColor[2], 255, 5); // Blue component
      });

      test('handle passing a value from a vertex hook to a fragment hook using shared*', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        const midColor = await myp5.get(25, 25);
        assert.approximately(midColor[0], 0, 5);
        assert.approximately(midColor[1], 0, 5);
        assert.approximately(midColor[2], 0, 5);

        // The corner should have position 1,1 which translates to yellow
        const cornerColor = await myp5.get(0, 0);
        assert.approximately(cornerColor[0], 255, 5);
        assert.approximately(cornerColor[1], 255, 5);
        assert.approximately(cornerColor[2], 0, 5);
      });
    });

    suite.todo('filter shader hooks', () => {
      test('handle getColor hook with non-struct return type', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        assert.approximately(pixelColor[0], 255, 5); // Red channel should be 255
        assert.approximately(pixelColor[1], 127, 5); // Green channel should be ~127
        assert.approximately(pixelColor[2], 0, 5);   // Blue channel should be 0
      });

      test('simple vector multiplication in filter shader', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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

      test('handle complex filter shader with for loop and vector operations', async () => {
        await myp5.createCanvas(50, 50, myp5.WEBGPU);

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
        const pixelColor = await myp5.get(25, 25);
        // Just verify it ran without crashing - exact color will depend on sampling
        assert.isNumber(pixelColor[0]);
        assert.isNumber(pixelColor[1]);
        assert.isNumber(pixelColor[2]);
      });
    });

    suite.todo('noise()', () => {
      for (let i = 1; i <= 3; i++) {
        test(`works with ${i}D vectors`, async () => {
          expect(async () => {
            await myp5.createCanvas(50, 50, myp5.WEBGPU);
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

        test(`works with ${i}D positional arguments`, async () => {
          expect(async () => {
            await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
        test(`Does not work in ${i}D`, async () => {
          expect(async () => {
            await myp5.createCanvas(50, 50, myp5.WEBGPU);
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

        test(`Does not work in ${i}D with positional arguments`, async () => {
          expect(async () => {
            await myp5.createCanvas(50, 50, myp5.WEBGPU);
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
  });
});
