import { vi } from "vitest";
import p5 from "../../../../src/app";
import { visualSuite, visualTest } from "../visualTest";
import rendererWebGPU from "../../../../src/webgpu/p5.RendererWebGPU";

p5.registerAddon(rendererWebGPU);

visualSuite("WebGPU", function () {
  visualSuite("Shaders", function () {
    visualTest(
      "The color shader runs successfully",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        p5.background("white");
        for (const [i, color] of ["red", "lime", "blue"].entries()) {
          p5.push();
          p5.rotate(p5.TWO_PI * (i / 3));
          p5.fill(color);
          p5.translate(15, 0);
          p5.noStroke();
          p5.circle(0, 0, 20);
          p5.pop();
        }
        await screenshot();
      },
    );

    visualTest(
      "The stroke shader runs successfully",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        p5.background("white");
        for (const [i, color] of ["red", "lime", "blue"].entries()) {
          p5.push();
          p5.rotate(p5.TWO_PI * (i / 3));
          p5.translate(15, 0);
          p5.stroke(color);
          p5.strokeWeight(2);
          p5.circle(0, 0, 20);
          p5.pop();
        }
        await screenshot();
      },
    );

    visualTest(
      "The material shader runs successfully",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        p5.background("white");
        p5.ambientLight(50);
        p5.directionalLight(100, 100, 100, 0, 1, -1);
        p5.pointLight(155, 155, 155, 0, -200, 500);
        p5.specularMaterial(255);
        p5.shininess(300);
        for (const [i, color] of ["red", "lime", "blue"].entries()) {
          p5.push();
          p5.rotate(p5.TWO_PI * (i / 3));
          p5.fill(color);
          p5.translate(15, 0);
          p5.noStroke();
          p5.sphere(10);
          p5.pop();
        }
        await screenshot();
      },
    );

    visualTest("Shader hooks can be used", async function (p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const myFill = p5.baseMaterialShader().modify({
        "Vertex getWorldInputs": `(inputs: Vertex) {
          var result = inputs;
          result.position.y += 10.0 * sin(inputs.position.x * 0.25);
          return result;
        }`,
      });
      const myStroke = p5.baseStrokeShader().modify({
        "StrokeVertex getWorldInputs": `(inputs: StrokeVertex) {
          var result = inputs;
          result.position.y += 10.0 * sin(inputs.position.x * 0.25);
          return result;
        }`,
      });
      p5.background("black");
      p5.shader(myFill);
      p5.strokeShader(myStroke);
      p5.fill("red");
      p5.stroke("white");
      p5.strokeWeight(5);
      p5.circle(0, 0, 30);
      await screenshot();
    });

    visualTest(
      "Textures in the material shader work",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        const tex = p5.createImage(50, 50);
        tex.loadPixels();
        for (let x = 0; x < tex.width; x++) {
          for (let y = 0; y < tex.height; y++) {
            const off = (x + y * tex.width) * 4;
            tex.pixels[off] = p5.round((x / tex.width) * 255);
            tex.pixels[off + 1] = p5.round((y / tex.height) * 255);
            tex.pixels[off + 2] = 0;
            tex.pixels[off + 3] = 255;
          }
        }
        tex.updatePixels();
        p5.texture(tex);
        p5.plane(p5.width, p5.height);

        await screenshot();
      },
    );

    visualTest('Instanced rendering', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const model = p5.buildGeometry(() => p5.sphere(5));
      const shader = p5.baseMaterialShader().modify(() => {
        p5.getWorldInputs((inputs) => {
          inputs.position += (p5.instanceID() - 1) * 15
          return inputs;
        });
      }, { p5 });
      p5.noStroke();
      p5.fill(0);
      p5.shader(shader);
      p5.model(model, 3);
      await screenshot();
    });
  });

  visualSuite('filters', function() {
    const setupSketch = async (p5) => {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.translate(-p5.width/2, -p5.height/2);
      p5.clear();
      p5.noStroke();
      p5.fill('red');
      p5.circle(20, 20, 15);
      p5.beginShape(p5.QUAD_STRIP);
      p5.fill('cyan');
      p5.vertex(35, 35);
      p5.vertex(45, 35);
      p5.fill('blue');
      p5.vertex(35, 45);
      p5.vertex(45, 45);
      p5.endShape();
    };

    visualTest('It can apply GRAY', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.GRAY);
      await screenshot();
    });
    visualTest('It can apply INVERT', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.INVERT);
      await screenshot();
    });
    visualTest('It can apply THRESHOLD', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.THRESHOLD);
      await screenshot();
    });
    visualTest('It can apply THRESHOLD with a value', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.THRESHOLD, 0.8);
      await screenshot();
    });
    visualTest('It can apply POSTERIZE', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.THRESHOLD);
      await screenshot();
    });
    visualTest('It can apply POSTERIZE with a value', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.THRESHOLD, 2);
      await screenshot();
    });
    visualTest('It can apply BLUR', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.BLUR, 5);
      await screenshot();
    });
    visualTest('It can apply BLUR with a value', async function(p5, screenshot) {
      await setupSketch(p5);
      p5.filter(p5.BLUR, 10);
      await screenshot();
    });
    visualTest('It can apply ERODE (4x)', async function(p5, screenshot) {
      await setupSketch(p5);
      for (let i = 0; i < 4; i++) p5.filter(p5.ERODE);
      await screenshot();
    });
    visualTest('It can apply DILATE (4x)', async function(p5, screenshot) {
      await setupSketch(p5);
      for (let i = 0; i < 4; i++) p5.filter(p5.DILATE);
      await screenshot();
    });
  });

  visualSuite("Canvas Resizing", function () {
    visualTest(
      "Main canvas drawing after resize",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        // Resize the canvas
        p5.resizeCanvas(30, 30);
        // Draw to the main canvas after resize
        p5.background(100, 0, 100);
        p5.fill(0, 255, 255);
        p5.noStroke();
        p5.circle(0, 0, 20);
        await screenshot();
      },
    );
  });

  visualSuite("Framebuffers", function () {
    visualTest(
      "Basic framebuffer draw to canvas",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        // Create a framebuffer
        const fbo = p5.createFramebuffer({ width: 25, height: 25 });

        // Draw to the framebuffer
        fbo.draw(() => {
          p5.background(255, 0, 0); // Red background
          p5.fill(0, 255, 0); // Green circle
          p5.noStroke();
          p5.circle(0, 0, 20);
        });

        // Draw the framebuffer to the main canvas
        p5.background(0, 0, 255); // Blue background
        p5.texture(fbo);
        p5.noStroke();
        p5.plane(25, 25);

        await screenshot();
      },
    );

    visualTest(
      "Framebuffer with different sizes",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        // Create two different sized framebuffers
        const fbo1 = p5.createFramebuffer({ width: 20, height: 20 });
        const fbo2 = p5.createFramebuffer({ width: 15, height: 15 });

        // Draw to first framebuffer
        fbo1.draw(() => {
          p5.background(255, 100, 100);
          p5.fill(255, 255, 0);
          p5.noStroke();
          p5.rect(-5, -5, 10, 10);
        });

        // Draw to second framebuffer
        fbo2.draw(() => {
          p5.background(100, 255, 100);
          p5.fill(255, 0, 255);
          p5.noStroke();
          p5.circle(0, 0, 10);
        });

        // Draw both to main canvas
        p5.background(50);
        p5.push();
        p5.translate(-12.5, -12.5);
        p5.texture(fbo1);
        p5.noStroke();
        p5.plane(20, 20);
        p5.pop();

        p5.push();
        p5.translate(12.5, 12.5);
        p5.texture(fbo2);
        p5.noStroke();
        p5.plane(15, 15);
        p5.pop();

        await screenshot();
      },
    );

    visualTest("Auto-sized framebuffer", async function (p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      // Create auto-sized framebuffer (should match canvas size)
      const fbo = p5.createFramebuffer();

      // Draw to the framebuffer
      fbo.draw(() => {
        p5.background(0);
        p5.translate(-fbo.width / 2, -fbo.height / 2)
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.noFill();
        // Draw a grid pattern to verify size
        for (let x = 0; x < 50; x += 10) {
          p5.line(x, 0, x, 50);
        }
        for (let y = 0; y < 50; y += 10) {
          p5.line(0, y, 50, y);
        }
        p5.fill(255, 0, 0);
        p5.noStroke();
        p5.circle(25, 25, 15);
      });

      // Draw the framebuffer to fill the main canvas
      p5.texture(fbo);
      p5.noStroke();
      p5.plane(50, 50);

      await screenshot();
    });

    visualTest(
      "Auto-sized framebuffer after canvas resize",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        // Create auto-sized framebuffer
        const fbo = p5.createFramebuffer();

        // Resize the canvas (framebuffer should auto-resize)
        p5.resizeCanvas(30, 30);

        // Draw to the framebuffer after resize
        fbo.draw(() => {
          p5.background(100, 0, 100);
          p5.translate(-fbo.width / 2, -fbo.height / 2)
          p5.fill(0, 255, 255);
          p5.noStroke();
          // Draw a shape that fills the new size
          p5.rect(5, 5, 20, 20);
          p5.fill(255, 255, 0);
          p5.circle(15, 15, 10);
        });

        // Draw the framebuffer to the main canvas
        p5.texture(fbo);
        p5.noStroke();
        p5.plane(30, 30);

        await screenshot();
      },
    );

    visualTest(
      "Fixed-size framebuffer after manual resize",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        // Create fixed-size framebuffer
        const fbo = p5.createFramebuffer({ width: 20, height: 20 });

        // Draw initial content
        fbo.draw(() => {
          p5.background(255, 200, 100);
          p5.fill(0, 100, 200);
          p5.noStroke();
          p5.circle(0, 0, 15);
        });

        // Manually resize the framebuffer
        fbo.resize(35, 25);

        // Draw new content to the resized framebuffer
        fbo.draw(() => {
          p5.background(200, 255, 100);
          p5.translate(-fbo.width / 2, -fbo.height / 2)
          p5.fill(200, 0, 100);
          p5.noStroke();
          // Draw content that uses the new size
          p5.rect(5, 5, 25, 15);
          p5.fill(0, 0, 255);
          p5.circle(17.5, 12.5, 8);
        });

        // Draw the resized framebuffer to the main canvas
        p5.background(50);
        p5.texture(fbo);
        p5.noStroke();
        p5.plane(35, 25);

        await screenshot();
      },
    );
  });

  visualSuite("Clipping", function () {
    visualTest(
      "Basic clipping with circles",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        p5.background("white");

        // Draw some circles that extend beyond the clipping area
        p5.fill("red");
        p5.noStroke();
        p5.circle(-15, -15, 25);
        p5.fill("green");
        p5.circle(15, -15, 25);
        p5.fill("blue");
        p5.circle(-15, 15, 25);
        p5.fill("yellow");
        p5.circle(15, 15, 25);

        // Apply clipping to a smaller rectangle in the center
        p5.push();
        p5.clip(() => {
          p5.rect(-12.5, -12.5, 25, 25);
        });

        // Draw more circles that should be clipped to the rectangle
        p5.fill("purple");
        p5.circle(-8, -8, 16);
        p5.fill("orange");
        p5.circle(8, 8, 16);
        p5.fill("cyan");
        p5.circle(0, 0, 12);

        p5.pop();

        await screenshot();
      },
    );
  });

  visualSuite('Typography', function () {
    visualSuite('textFont', function () {
      visualTest('with a font file in WebGPU', async function (p5, screenshot) {
        await p5.createCanvas(100, 100, p5.WEBGPU);
        const font = await p5.loadFont(
          'test/unit/assets/Inconsolata-Bold.ttf'
        );
        p5.textFont(font);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textSize(35);
        p5.text('p5*js', -p5.width / 2, -p5.height / 2 + 10, p5.width);
        await screenshot();
      });
    });

    visualSuite('textWeight', function () {
      visualTest('can control variable fonts from files in WebGPU', async function (p5, screenshot) {
        await p5.createCanvas(100, 100, p5.WEBGPU);
        const font = await p5.loadFont(
          'test/unit/assets/BricolageGrotesque-Variable.ttf'
        );
        for (let weight = 400; weight <= 800; weight += 100) {
          p5.push();
          p5.background(255);
          p5.translate(-p5.width/2, -p5.height/2);
          p5.textFont(font);
          p5.textAlign(p5.LEFT, p5.TOP);
          p5.textSize(35);
          p5.textWeight(weight);
          p5.text('p5*js', 0, 10, p5.width);
          p5.pop();
          await screenshot();
        }
      });
    });

    visualSuite('textAlign', function () {
      visualSuite('webgpu mode', () => {
        visualTest('all alignments with single word', async function (p5, screenshot) {
          const alignments = [
            { alignX: p5.LEFT, alignY: p5.TOP },
            { alignX: p5.CENTER, alignY: p5.TOP },
            { alignX: p5.RIGHT, alignY: p5.TOP },
            { alignX: p5.LEFT, alignY: p5.CENTER },
            { alignX: p5.CENTER, alignY: p5.CENTER },
            { alignX: p5.RIGHT, alignY: p5.CENTER },
            { alignX: p5.LEFT, alignY: p5.BOTTOM },
            { alignX: p5.CENTER, alignY: p5.BOTTOM },
            { alignX: p5.RIGHT, alignY: p5.BOTTOM }
          ];

          await p5.createCanvas(300, 300, p5.WEBGPU);
          p5.translate(-p5.width/2, -p5.height/2);
          p5.textSize(60);
          const font = await p5.loadFont(
            'test/unit/assets/Inconsolata-Bold.ttf'
          );
          p5.textFont(font);
          for (const alignment of alignments) {
            p5.background(255);
            p5.textAlign(alignment.alignX, alignment.alignY);
            const bb = p5.textBounds('Single Line', p5.width / 2, p5.height / 2);
            p5.push();
            p5.push()
            p5.noFill();
            p5.stroke('red');
            p5.rect(bb.x, bb.y, bb.w, bb.h);
            p5.pop()
            p5.fill(0)
            p5.text('Single Line', p5.width / 2, p5.height / 2);
            p5.pop();
            await screenshot();
          }
        });

        visualTest('all alignments with single line', async function (p5, screenshot) {
          const alignments = [
            { alignX: p5.LEFT, alignY: p5.TOP },
            { alignX: p5.CENTER, alignY: p5.TOP },
            { alignX: p5.RIGHT, alignY: p5.TOP },
            { alignX: p5.LEFT, alignY: p5.CENTER },
            { alignX: p5.CENTER, alignY: p5.CENTER },
            { alignX: p5.RIGHT, alignY: p5.CENTER },
            { alignX: p5.LEFT, alignY: p5.BOTTOM },
            { alignX: p5.CENTER, alignY: p5.BOTTOM },
            { alignX: p5.RIGHT, alignY: p5.BOTTOM }
          ];

          await p5.createCanvas(300, 300, p5.WEBGPU);
          p5.translate(-p5.width/2, -p5.height/2);
          p5.textSize(45);
          const font = await p5.loadFont(
            'test/unit/assets/Inconsolata-Bold.ttf'
          );
          p5.textFont(font);
          for (const alignment of alignments) {
            p5.background(255);
            p5.textAlign(alignment.alignX, alignment.alignY);
            p5.text('Single Line', p5.width / 2, p5.height / 2);
            const bb = p5.textBounds('Single Line', p5.width / 2, p5.height / 2);
            p5.push();
            p5.noFill();
            p5.stroke('red');
            p5.rect(bb.x, bb.y, bb.w, bb.h);
            p5.pop();
            await screenshot();
          }
        });

        visualTest('all alignments with multi-lines and wrap word',
          async function (p5, screenshot) {
            const alignments = [
              { alignX: p5.LEFT, alignY: p5.TOP },
              { alignX: p5.CENTER, alignY: p5.TOP },
              { alignX: p5.RIGHT, alignY: p5.TOP },
              { alignX: p5.LEFT, alignY: p5.CENTER },
              { alignX: p5.CENTER, alignY: p5.CENTER },
              { alignX: p5.RIGHT, alignY: p5.CENTER },
              { alignX: p5.LEFT, alignY: p5.BOTTOM },
              { alignX: p5.CENTER, alignY: p5.BOTTOM },
              { alignX: p5.RIGHT, alignY: p5.BOTTOM }
            ];

            await p5.createCanvas(150, 100, p5.WEBGPU);
            p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(20);
            p5.textWrap(p5.WORD);
            const font = await p5.loadFont(
              'test/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            for (const alignment of alignments) {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.strokeWeight(2);
              p5.stroke(200);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
              p5.text(
                'A really long text that should wrap automatically as it reaches the end of the box',
                xPos,
                yPos,
                boxWidth,
                boxHeight
              );
              const bb = p5.textBounds(
                'A really long text that should wrap automatically as it reaches the end of the box',
                xPos,
                yPos,
                boxWidth,
                boxHeight
              );
              p5.noFill();
              p5.stroke('red');
              p5.rect(bb.x, bb.y, bb.w, bb.h);
              p5.pop();

              await screenshot();
            }
          }
        );

        visualTest(
          'all alignments with multi-lines and wrap char',
          async function (p5, screenshot) {
            const alignments = [
              { alignX: p5.LEFT, alignY: p5.TOP },
              { alignX: p5.CENTER, alignY: p5.TOP },
              { alignX: p5.RIGHT, alignY: p5.TOP },
              { alignX: p5.LEFT, alignY: p5.CENTER },
              { alignX: p5.CENTER, alignY: p5.CENTER },
              { alignX: p5.RIGHT, alignY: p5.CENTER },
              { alignX: p5.LEFT, alignY: p5.BOTTOM },
              { alignX: p5.CENTER, alignY: p5.BOTTOM },
              { alignX: p5.RIGHT, alignY: p5.BOTTOM }
            ];

            await p5.createCanvas(150, 100, p5.WEBGPU);
            p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(19);
            p5.textWrap(p5.CHAR);
            const font = await p5.loadFont(
              'test/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            for (const alignment of alignments) {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.strokeWeight(2);
              p5.stroke(200);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
              p5.text(
                'A really long text that should wrap automatically as it reaches the end of the box',
                xPos,
                yPos,
                boxWidth,
                boxHeight
              );
              const bb = p5.textBounds(
                'A really long text that should wrap automatically as it reaches the end of the box',
                xPos,
                yPos,
                boxWidth,
                boxHeight
              );
              p5.noFill();
              p5.stroke('red');
              p5.rect(bb.x, bb.y, bb.w, bb.h);
              p5.pop();

              await screenshot();
            }
          }
        );

        visualTest(
          'all alignments with multi-line manual text',
          async function (p5, screenshot) {
            const alignments = [
              { alignX: p5.LEFT, alignY: p5.TOP },
              { alignX: p5.CENTER, alignY: p5.TOP },
              { alignX: p5.RIGHT, alignY: p5.TOP },
              { alignX: p5.LEFT, alignY: p5.CENTER },
              { alignX: p5.CENTER, alignY: p5.CENTER },
              { alignX: p5.RIGHT, alignY: p5.CENTER },
              { alignX: p5.LEFT, alignY: p5.BOTTOM },
              { alignX: p5.CENTER, alignY: p5.BOTTOM },
              { alignX: p5.RIGHT, alignY: p5.BOTTOM }
            ];

            await p5.createCanvas(150, 100, p5.WEBGPU);
            p5.translate(-p5.width/2, -p5.height/2);
            p5.textSize(20);

            const font = await p5.loadFont(
              'test/unit/assets/Inconsolata-Bold.ttf'
            );
            p5.textFont(font);

            let xPos = 20;
            let yPos = 20;
            const boxWidth = 100;
            const boxHeight = 60;

            for (const alignment of alignments) {
              p5.background(255);
              p5.push();
              p5.textAlign(alignment.alignX, alignment.alignY);

              p5.noFill();
              p5.stroke(200);
              p5.strokeWeight(2);
              p5.rect(xPos, yPos, boxWidth, boxHeight);

              p5.fill(0);
              p5.noStroke();
              p5.text('Line 1\nLine 2\nLine 3', xPos, yPos, boxWidth, boxHeight);
              const bb = p5.textBounds(
                'Line 1\nLine 2\nLine 3',
                xPos,
                yPos,
                boxWidth,
                boxHeight
              );
              p5.noFill();
              p5.stroke('red');
              p5.rect(bb.x, bb.y, bb.w, bb.h);
              p5.pop();

              await screenshot();
            }
          }
        );
      });
    });
  });

  visualSuite("Buffer Alignment", function () {
    visualTest(
      "buildGeometry with non-4-byte-aligned index buffer size",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        p5.randomSeed(1);
        p5.colorMode(p5.HSB, 360, 100, 100);

        // Create a geometry that will result in a non-4-byte-aligned buffer size
        // We want to create an odd number of triangles that results in
        // indices.length * indexType.BYTES_PER_ELEMENT not being divisible by 4
        const geom = p5.buildGeometry(() => {
          p5.noStroke();
          // Create 1323 triangles (3969 indices total)
          // With Uint16 indices (2 bytes each): 3969 * 2 = 7938 bytes
          // 7938 is not divisible by 4, we want to ensure the renderer
          // pads this to keep bytes aligned
          for (let i = 0; i < 1323; i++) {
            p5.fill(p5.random(360), 80, 90);
            p5.triangle(
              p5.random(-25, 25), p5.random(-25, 25),
              p5.random(-25, 25), p5.random(-25, 25),
              p5.random(-25, 25), p5.random(-25, 25)
            );
          }
        });

        p5.background(20);
        p5.model(geom);

        await screenshot();
      }
    );
  });

  visualSuite("Immediate Mode Buffer Reuse", function () {
    visualTest(
      "beginShape/endShape reuses buffers across frames",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Draw the same triangle in different positions across 3 frames
        // Each frame draws the same number of vertices (3) so that it
        // isn't FORCED to allocate new buffers, and should be trying
        // to reuse them.
        const positions = [
          { x: -15, y: -10 },  // Frame 1: left
          { x: 0, y: -10 },    // Frame 2: center
          { x: 15, y: -10 }    // Frame 3: right
        ];

        for (let frame = 0; frame < 3; frame++) {
          const pos = positions[frame];

          p5.background(200);
          p5.fill('red');
          p5.noStroke();

          // Draw triangle using immediate mode. This means it's using the
          // same geometry every frame. We expect to see different results
          // if it's correctly updating the buffers.
          p5.beginShape();
          p5.vertex(pos.x - 5, pos.y + 10);  // bottom-left
          p5.vertex(pos.x + 5, pos.y + 10);  // bottom-right
          p5.vertex(pos.x, pos.y);           // top
          p5.endShape(p5.CLOSE);

          await screenshot();
        }
      }
    );
  });

  visualSuite("Image Based Lighting", function () {
    const shinesses = [50, 150];
    for (const shininess of shinesses) {
      visualTest(
        `${shininess < 100 ? 'low' : 'high'} shininess`,
        async function (p5, screenshot) {
          await p5.createCanvas(100, 100, p5.WEBGPU);

          // Load the environment map
          const env = await p5.loadImage('test/unit/assets/spheremap.jpg');
          p5.clear();

          // Set up panorama background
          p5.panorama(env);

          // Set up image-based lighting
          p5.push();
          p5.imageLight(env);
          p5.ambientLight(10);

          // Configure materials
          p5.specularMaterial(255);
          p5.shininess(shininess);
          p5.metalness(100);
          p5.noStroke();

          // Draw a sphere in the center
          p5.fill('white');
          p5.sphere(25);

          p5.pop();

          await screenshot();
        },
        { timeout: 2000 }
      );
    }
  });
});
