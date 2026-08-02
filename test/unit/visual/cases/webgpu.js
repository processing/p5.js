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
          inputs.position += (p5.instanceIndex - 1) * 15
          return inputs;
        });
      }, { p5 });
      p5.noStroke();
      p5.fill(0);
      p5.shader(shader);
      p5.model(model, 3);
      await screenshot();
    });

    visualTest('Strands tutorial', async function(p5, screenshot) {
      // From Luke Plowden's Intro to Strands tutorial
      // https://beta.p5js.org/tutorials/intro-to-p5-strands/

      function starShaderCallback({ p5 }) {
        const time = p5.uniformFloat(() => p5.millis());
        const skyRadius = p5.uniformFloat(90);

        function rand2(st) {
          return p5.sin((st.x + st.y) * 123.456);
        }

        function semiSphere() {
          let id = p5.instanceIndex;
          let theta = rand2([id, 0.1234])  * p5.TWO_PI + time / 100000;
          let phi = rand2([id, 3.321]) * p5.PI + time / 50000;

          let r = skyRadius;
          r *= p5.sin(phi);
          let x = r * p5.sin(phi) * p5.cos(theta);
          let y = r * 1.5 * p5.cos(phi);
          let z = r * p5.sin(phi) * p5.sin(theta);
          return [x, y, z];
        }

        p5.getWorldInputs((inputs) => {
          inputs.position += semiSphere();
          return inputs;
        });

        p5.getObjectInputs((inputs) => {
          let size = 1 + 0.5 * p5.sin(time * 0.002 + p5.instanceIndex);
          inputs.position *= size;
          return inputs;
        });
      }

      function pixelateShaderCallback({ p5 }) {
        const pixelCountX = p5.uniformFloat(() => 100);

        p5.getColor((inputs, canvasContent) => {
          const aspectRatio = inputs.canvasSize.x / inputs.canvasSize.y;
          const pixelSize = [pixelCountX, pixelCountX / aspectRatio];

          let coord = inputs.texCoord;
          coord = p5.floor(coord * pixelSize) / pixelSize;

          let col = p5.getTexture(canvasContent, coord);
          return col//[coord, 0, 1];
        });
      }

      function bloomShaderCallback({ p5, originalImage }) {
        const preBlur = p5.uniformTexture(() => originalImage);

        getColor((input, canvasContent) => {
          const blurredCol = p5.getTexture(canvasContent, input.texCoord);
          const originalCol = p5.getTexture(preBlur, input.texCoord);

          const intensity = p5.max(originalCol, 0.1) * 12.2;

          const bloom = originalCol + blurredCol * intensity;
          return [bloom.rgb, 1];
        });
      }

      await p5.createCanvas(200, 200, p5.WEBGPU);
      const stars = p5.buildGeometry(() => p5.sphere(4, 4, 2))
      const originalImage = p5.createFramebuffer();

      function fresnelShaderCallback({ p5 }) {
        const fresnelPower = p5.uniformFloat(2);
        const fresnelBias = p5.uniformFloat(-0.1);
        const fresnelScale = p5.uniformFloat(2);

        p5.getCameraInputs((inputs) => {
          let n = p5.normalize(inputs.normal);
          let v = p5.normalize(-inputs.position);
          let base = 1.0 - p5.dot(n, v);
          let fresnel = fresnelScale * p5.pow(base, fresnelPower) + fresnelBias;
          let col = p5.mix([0, 0, 0], [1, .5, .7], fresnel);
          inputs.color = [col, 1];
          return inputs;
        });
      }

      const starShader = p5.baseMaterialShader().modify(starShaderCallback, { p5 });
      const starStrokeShader = p5.baseStrokeShader().modify(starShaderCallback, { p5 })
      const fresnelShader = p5.baseColorShader().modify(fresnelShaderCallback, { p5 });
      const bloomShader = p5.baseFilterShader().modify(bloomShaderCallback, { p5, originalImage });
      const pixelateShader = p5.baseFilterShader().modify(pixelateShaderCallback, { p5 });

      originalImage.begin();
      p5.background(0);

      p5.push()
      p5.strokeWeight(2)
      p5.stroke(255,0,0)
      p5.fill(255,100, 150)
      p5.strokeShader(starStrokeShader)
      p5.shader(starShader);
      p5.model(stars, 100);
      p5.pop()

      p5.push()
      p5.shader(fresnelShader)
      p5.noStroke()
      p5.sphere(30);
      p5.filter(pixelateShader);
      p5.pop()

      originalImage.end();

      p5.imageMode(p5.CENTER)
      p5.image(originalImage, 0, 0)

      p5.filter(p5.BLUR, 5)
      p5.filter(bloomShader);

      await screenshot();
    });

    visualTest('filter shaders with flat API', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      p5.noStroke();
      p5.fill(0);
      p5.circle(0, 0, 20);
      const invert = p5.buildFilterShader(({ p5 }) => {
        p5.filterColor.begin();
        const regular = p5.getTexture(
          p5.filterColor.canvasContent,
          p5.filterColor.texCoord
        );
        const inverted = [1 - regular.rgb, regular.a];
        p5.filterColor.set(inverted);
        p5.filterColor.end();
      }, { p5 });
      p5.filter(invert);
      await screenshot();
    });

    visualTest('filter shaders can sample a texture inside a conditional branch', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      p5.noStroke();
      p5.fill(0);
      p5.circle(0, 0, 20);
      // This shader only samples the texture for pixels in the left half of the
      // canvas, exercising getTexture() inside a non-uniform conditional
      const conditionalInvert = p5.buildFilterShader(({ p5 }) => {
        p5.filterColor.begin();
        if (p5.filterColor.texCoord.x < 0.5) {
          const col = p5.getTexture(
            p5.filterColor.canvasContent,
            p5.filterColor.texCoord
          );
          p5.filterColor.set([1 - col.rgb, col.a]);
        } else {
          p5.filterColor.set([0, 0, 1, 1]);
        }
        p5.filterColor.end();
      }, { p5 });
      p5.filter(conditionalInvert);
      await screenshot();
    });

    visualTest('instanceID in fragment hook colors instances (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const numInstances = 4;
      const shader = p5.baseMaterialShader().modify(() => {
        // Vertex hook: position instances in a horizontal row
        p5.getWorldInputs((inputs) => {
          const id = p5.instanceIndex;
          const spacing = 12;
          const offset = (id - (numInstances - 1) / 2.0) * spacing;
          inputs.position.x += offset;
          return inputs;
        });
        // Fragment hook: color each instance based on instanceID
        p5.getFinalColor((color) => {
          const id = p5.instanceIndex;
          const t = id / (numInstances - 1.0);
          color = [t, t, t, 1];
          return color;
        });
      }, { p5, numInstances });
      p5.background(128);
      p5.noStroke();
      p5.shader(shader);
      const obj = p5.buildGeometry(() => p5.circle(0, 0, 10));
      p5.model(obj, numInstances);
      await screenshot();
    });

    visualTest('instances() API draws multiple spaced primitives (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const count = 5;
      const shader = p5.baseMaterialShader().modify(() => {
        p5.getWorldInputs((inputs) => {
          let spacing = p5.width / count;
          inputs.position.x += (p5.instanceIndex - (count - 1) / 2.0) * spacing;
          return inputs;
        });
      }, { p5, count });
      p5.background(220);
      p5.lights();
      p5.noStroke();
      p5.fill('red');
      p5.shader(shader);
      p5.instances(count).sphere(7);
      await screenshot();
    });

    visualTest('instances() API draws multiple spaced 2D rects (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const count = 3;
      const shader = p5.baseMaterialShader().modify(() => {
        p5.getWorldInputs(inputs => {
          let spacing = p5.width / count;
          inputs.position.x += (p5.instanceIndex - (count - 1) / 2.0) * spacing;
          return inputs;
        });
      }, { p5, count });
      p5.background(220);
      p5.noStroke();
      p5.fill('blue');
      p5.shader(shader);
      p5.instances(count).rect(-5, -5, 10, 10);
      await screenshot();
    });

    visualTest('instances() API draws instanced lines and points (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const count = 3;
      const spaceFn = () => {
        p5.getWorldInputs(inputs => {
          let spacing = p5.width / count;
          inputs.position.x += (p5.instanceIndex - (count - 1) / 2.0) * spacing;
          return inputs;
        });
      };
      const matShader = p5.buildMaterialShader(spaceFn, { p5, count });
      const strShader = p5.buildStrokeShader(spaceFn, { p5, count });
      p5.background(220);
      p5.stroke(0);
      p5.strokeWeight(3);
      p5.shader(matShader);
      p5.strokeShader(strShader);
      p5.instances(count).line(0, -15, 0, 0, 15, 0);
      p5.instances(count).point(0, 0, 0);
      await screenshot();
    });

    visualTest('instances() API draws instanced curves (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const count = 3;
      const spaceFn = () => {
        p5.getWorldInputs(inputs => {
          let spacing = p5.width / count;
          inputs.position.x += (p5.instanceIndex - (count - 1) / 2.0) * spacing;
          return inputs;
        });
      };
      const matShader = p5.buildMaterialShader(spaceFn, { p5, count });
      const strShader = p5.buildStrokeShader(spaceFn, { p5, count });
      p5.background(220);
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.noFill();
      p5.shader(matShader);
      p5.strokeShader(strShader);
      p5.instances(count).bezier(-5, -5, 0, -2, 5, 0, 2, -5, 0, 5, 5, 0);
      p5.instances(count).spline(-5, 5, 0, -2, -5, 0, 2, 5, 0, 5, -5, 0);
      await screenshot();
    });

    visualTest('random() colors a basic shader (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const shader = p5.baseColorShader().modify(() => {
        p5.randomSeed(12);
        p5.getFinalColor((color) => {
          const value = p5.random(0.2, 0.9);
          color = [value, value, value, 1];
          return color;
        });
      }, { p5 });
      p5.background(0);
      p5.noStroke();
      p5.shader(shader);
      p5.plane(50, 50);
      await screenshot();
    });

    visualTest('random() in a fragment loop averages to gray (WebGPU)', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const shader = p5.baseMaterialShader().modify(() => {
        p5.randomSeed(7);
        p5.getPixelInputs(inputs => {
          let sum = p5.float(0.0);
          for (let i = 0; i < 20; i++) {
            sum = sum + p5.random();
          }
          const avg = sum / 20;
          inputs.color = [avg, avg, avg, 1.0];
          return inputs;
        });
      }, { p5 });

      p5.background(0);
      p5.noStroke();
      p5.shader(shader);
      p5.plane(50, 50);
      await screenshot();
    });

    visualTest('hook returning a fresh struct (not the struct argument) applies modifications', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const shader = p5.baseMaterialShader().modify(() => {
        p5.worldInputs.begin();
        p5.worldInputs.set({
          position: p5.worldInputs.position.add([10, 0, 0]),
          normal: p5.worldInputs.normal,
          texCoord: p5.worldInputs.texCoord,
          color: [1, 0, 0, 1],
        });
        p5.worldInputs.end();
      }, { p5 });
      p5.background(0);
      p5.noStroke();
      p5.shader(shader);
      p5.plane(20, 20);
      await screenshot();
    });
  });

  visualTest('randomGaussian() colors a basic shader (WebGPU)', async function(p5, screenshot) {
  await p5.createCanvas(50, 50, p5.WEBGPU);
  const shader = p5.baseColorShader().modify(() => {
    p5.randomSeed(12);
    p5.getFinalColor((color) => {
      const value = p5.randomGaussian(0.5, 0.1);
      color = [value, value, value, 1];
      return color;
    });
  }, { p5 });
  p5.background(0);
  p5.noStroke();
  p5.shader(shader);
  p5.plane(50, 50);
  await screenshot();
});

visualTest('randomGaussian() in a fragment loop averages to the mean (WebGPU)', async function(p5, screenshot) {
  await p5.createCanvas(50, 50, p5.WEBGPU);
  const shader = p5.baseMaterialShader().modify(() => {
    p5.randomSeed(7);
    p5.getPixelInputs(inputs => {
      let sum = p5.float(0.0);
      for (let i = 0; i < 20; i++) {
        sum = sum + p5.randomGaussian(0.5, 0.2);
      }
      const avg = sum / 20;
      inputs.color = [avg, avg, avg, 1.0];
      return inputs;
    });
  }, { p5 });
  p5.background(0);
  p5.noStroke();
  p5.shader(shader);
  p5.plane(50, 50);
  await screenshot();
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
      "Framebuffer with depth disabled",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        const fbo = p5.createFramebuffer({ width: 50, height: 50, depth: false });

        fbo.draw(() => {
          p5.background(0, 0, 200);
          p5.fill(255, 200, 0);
          p5.noStroke();
          p5.circle(0, 0, 30);
        });

        p5.background(50);
        p5.texture(fbo);
        p5.noStroke();
        p5.plane(50, 50);

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

  visualSuite("Rendering attributes", function () {
    visualTest(
      "noSmooth() does not crash and disables antialiasing",
      async function (p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);
        await p5.noSmooth();
        p5.background(0);
        p5.fill(255);
        p5.noStroke();
        p5.circle(0, 0, 30);
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

  visualSuite('transformation', function() {
    visualTest('outside of push() and pop()', async function (p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(200);
      p5.rotateY(p5.PI * 0.1);
      p5.box(30);
      await screenshot();
    });
  });

  visualSuite('Compute shaders', function() {
    visualTest(
      'Storage buffer (float array) can be read in a vertex shader for instanced rendering',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Positions for 3 spheres: (-15,0), (0,0), (15,0)
        const positions = p5.createStorage([-15, 0, 0, 0, 15, 0]);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const posData = p5.uniformStorage();
          p5.getWorldInputs((inputs) => {
            const idx = p5.instanceIndex;
            inputs.position.x += posData[idx * 2];
            inputs.position.y += posData[idx * 2 + 1];
            return inputs;
          });
        }, { p5 });
        sphereShader.setUniform('posData', positions);

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 3);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader writes float values to storage buffer, vertex shader reads them',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Start with zeros; compute shader will write [20, -10]
        const offset = p5.createStorage(2);

        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage();
          buf[0] = 20;
          buf[1] = -10;
        }, { p5 });
        computeShader.setUniform('buf', offset);
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage();
          p5.getWorldInputs((inputs) => {
            inputs.position.x += buf[0];
            inputs.position.y += buf[1];
            return inputs;
          });
        }, { p5 });
        sphereShader.setUniform('buf', offset);

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader reads and transforms float array values',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Initialize with [10, 0] - compute will double x to get [20, 0]
        const buf = p5.createStorage([10, 0]);

        const computeShader = p5.buildComputeShader(() => {
          const data = p5.uniformStorage();
          data[0] = data[0] * 2;
        }, { p5 });
        computeShader.setUniform('data', buf);
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const data = p5.uniformStorage();
          p5.getWorldInputs((inputs) => {
            inputs.position.x += data[0];
            inputs.position.y += data[1];
            return inputs;
          });
        }, { p5 });
        sphereShader.setUniform('data', buf);

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );


    visualTest(
      'Struct storage buffer fields can be read in a vertex shader for instanced rendering',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Three particles at known positions: left, center, right
        const particles = p5.createStorage([
          { position: [-15, 0] },
          { position: [0,   0] },
          { position: [15,  0] },
        ]);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const p = buf[p5.instanceIndex].position;
            inputs.position.x += p.x;
            inputs.position.y += p.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 3);

        await screenshot();
      }
    );

    visualTest(
      'Struct storage buffer fields can use p5.Vector values',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Three particles at known positions: left, center, right
        const particles = p5.createStorage([
          { position: p5.createVector(-15, 0) },
          { position: p5.createVector(0,   0) },
          { position: p5.createVector(15,  0) },
        ]);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const p = buf[p5.instanceIndex].position;
            inputs.position.x += p.x;
            inputs.position.y += p.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 3);

        await screenshot();
      }
    );

    visualTest(
      'Struct storage buffer fields can be read using an inline schema template',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Same layout as above but schema is declared inline rather than via the buffer
        const particles = p5.createStorage([
          { position: [-15, 0] },
          { position: [0,   0] },
          { position: [15,  0] },
        ]);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', { position: [0, 0] });
          p5.getWorldInputs((inputs) => {
            const p = buf[p5.instanceIndex].position;
            inputs.position.x += p.x;
            inputs.position.y += p.y;
            return inputs;
          });
        }, { p5 });
        sphereShader.setUniform('buf', particles);

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 3);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader writes to struct storage fields, vertex shader reads them',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0] },
        ]);

        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          buf[p5.index.x].position = [15, -10];
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader reads and updates struct fields (position += velocity)',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0], velocity: [15, -10] },
        ]);

        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          buf[idx].position = buf[idx].position + buf[idx].velocity;
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader updates struct fields via intermediate struct variable',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0], velocity: [15, -10] },
        ]);

        // Store the struct element proxy in a variable and assign through it
        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          const entry = buf[idx];
          entry.position = entry.position + entry.velocity;
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader updates struct fields via intermediate field variable',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0], velocity: [15, -10] },
        ]);

        // Store a field value in an intermediate variable, update it, write it back
        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          let pos = buf[idx].position;
          pos = pos + buf[idx].velocity;
          buf[idx].position = pos;
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader writes a whole struct element as an object literal',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0], velocity: [15, -10] },
        ]);

        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          let pos = buf[idx].position;
          let vel = buf[idx].velocity;
          pos = pos + vel;
          buf[idx] = { position: pos, velocity: vel };
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader assigns to a swizzle of a struct vector field',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [15, 10] },
        ]);

        // Negate position.y via swizzle assignment
        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          buf[idx].position.y *= -1;
        }, { p5, particles });
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );

    visualTest(
      'Compute shader assigns to a swizzle of a struct vector field inside an if statement',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        const particles = p5.createStorage([
          { position: [0, 0], velocity: [5, 5] },
        ]);

        // Move by velocity, then negate velocity.y if position.y > 0.
        // After 1st run: position=[5,5], velocity=[5,-5].
        // After 2nd run: position=[10,0], velocity=[5,-5].
        const computeShader = p5.buildComputeShader(() => {
          const buf = p5.uniformStorage('buf', particles);
          const idx = p5.index.x;
          buf[idx].position += buf[idx].velocity;
          if (buf[idx].position.y > 0) {
            buf[idx].velocity.y *= -1;
          }
        }, { p5, particles });
        p5.compute(computeShader, 1);
        p5.compute(computeShader, 1);

        const sphereShader = p5.baseMaterialShader().modify(() => {
          const buf = p5.uniformStorage('buf', particles);
          p5.getWorldInputs((inputs) => {
            const pos = buf[0].position;
            inputs.position.x += pos.x;
            inputs.position.y += pos.y;
            return inputs;
          });
        }, { p5, particles });

        const geo = p5.buildGeometry(() => p5.sphere(5));
        p5.background(200);
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.shader(sphereShader);
        p5.model(geo, 1);

        await screenshot();
      }
    );
  });

  visualSuite('2D Shapes', function() {
    visualTest('TRIANGLE_FAN with per-vertex fills', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      p5.beginShape(p5.TRIANGLE_FAN);
      p5.fill('red');
      p5.vertex(0, 0);
      const n = 10;
      const r = 20;
      p5.fill('blue');
      for (let i = 0; i <= n; i++) {
        const angle = i/n * p5.TWO_PI;
        p5.vertex(r*p5.cos(angle), r*p5.sin(angle));
      }
      p5.endShape();
      await screenshot();
    });

    visualTest('TRIANGLE_FAN in p5.Geometry with per-vertex fills', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      const geom = p5.buildGeometry(() => {
        p5.beginShape(p5.TRIANGLE_FAN);
        p5.fill('red');
        p5.vertex(0, 0);
        const n = 10;
        const r = 20;
        p5.fill('blue');
        for (let i = 0; i <= n; i++) {
          const angle = i/n * p5.TWO_PI;
          p5.vertex(r*p5.cos(angle), r*p5.sin(angle));
        }
        p5.endShape();
      });
      p5.model(geom);
      await screenshot();
    });

    visualTest('TRIANGLE_STRIP with per-vertex fills', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      p5.beginShape(p5.TRIANGLE_STRIP);
      const n = 6;
      for (let i = 0; i < n; i++) {
        p5.fill(i % 2 === 0 ? 'red' : 'blue');
        p5.vertex(p5.map(i, 0, n - 1, -20, 20), i % 2 === 0 ? -10 : 10);
      }
      p5.endShape();
      await screenshot();
    });

    visualTest('TRIANGLE_STRIP in p5.Geometry with per-vertex fills', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background(255);
      const geom = p5.buildGeometry(() => {
        p5.beginShape(p5.TRIANGLE_STRIP);
        const n = 6;
        for (let i = 0; i < n; i++) {
          p5.fill(i % 2 === 0 ? 'red' : 'blue');
          p5.vertex(p5.map(i, 0, n - 1, -20, 20), i % 2 === 0 ? -10 : 10);
        }
        p5.endShape();
      });
      p5.model(geom);
      await screenshot();
    });
  });

  visualSuite('Feedback', function() {
    visualTest(
      'Drawing accumulates across frames when background is set in setup',
      async function(p5, screenshot) {
        await p5.createCanvas(50, 50, p5.WEBGPU);

        // Set an initial background before the draw loop starts.
        // This should persist into the first draw frame.
        p5.background('red');

        return new Promise(resolve => {
          let frame = 0;
          p5.draw = function() {
            // Draw circles without clearing, so they accumulate
            p5.noStroke();
            p5.fill('blue');
            p5.circle(-15 + frame * 15, 0, 10);
            frame++;
            if (frame >= 3) {
              p5.noLoop();
              screenshot().then(resolve);
            }
          };
          p5.loop();
        });
      }
    );
  });
});
