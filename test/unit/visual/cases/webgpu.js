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
});
