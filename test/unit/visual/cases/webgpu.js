import { vi } from 'vitest';
import p5 from '../../../../src/app';
import { visualSuite, visualTest } from '../visualTest';
import rendererWebGPU from '../../../../src/webgpu/p5.RendererWebGPU';

p5.registerAddon(rendererWebGPU);

visualSuite('WebGPU', function() {
  visualSuite('Shaders', function() {
    visualTest('The color shader runs successfully', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background('white');
      for (const [i, color] of ['red', 'lime', 'blue'].entries()) {
        p5.push();
        p5.rotate(p5.TWO_PI * (i / 3));
        p5.fill(color);
        p5.translate(15, 0);
        p5.noStroke();
        p5.circle(0, 0, 20);
        p5.pop();
      }
      screenshot();
    });

    visualTest('The stroke shader runs successfully', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background('white');
      for (const [i, color] of ['red', 'lime', 'blue'].entries()) {
        p5.push();
        p5.rotate(p5.TWO_PI * (i / 3));
        p5.translate(15, 0);
        p5.stroke(color);
        p5.strokeWeight(2);
        p5.circle(0, 0, 20);
        p5.pop();
      }
      screenshot();
    });

    visualTest('The material shader runs successfully', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      p5.background('white');
      p5.ambientLight(50);
      p5.directionalLight(100, 100, 100, 0, 1, -1);
      p5.pointLight(155, 155, 155, 0, -200, 500);
      p5.specularMaterial(255);
      p5.shininess(300);
      for (const [i, color] of ['red', 'lime', 'blue'].entries()) {
        p5.push();
        p5.rotate(p5.TWO_PI * (i / 3));
        p5.fill(color);
        p5.translate(15, 0);
        p5.noStroke();
        p5.sphere(10);
        p5.pop();
      }
      screenshot();
    });

    visualTest('Shader hooks can be used', async function(p5, screenshot) {
      await p5.createCanvas(50, 50, p5.WEBGPU);
      const myFill = p5.baseMaterialShader().modify({
        'Vertex getWorldInputs': `(inputs: Vertex) {
          var result = inputs;
          result.position.y += 10.0 * sin(inputs.position.x * 0.25);
          return result;
        }`,
      });
      const myStroke = p5.baseStrokeShader().modify({
        'StrokeVertex getWorldInputs': `(inputs: StrokeVertex) {
          var result = inputs;
          result.position.y += 10.0 * sin(inputs.position.x * 0.25);
          return result;
        }`,
      });
      p5.background('black');
      p5.shader(myFill);
      p5.strokeShader(myStroke);
      p5.fill('red');
      p5.stroke('white');
      p5.strokeWeight(5);
      p5.circle(0, 0, 30);
      screenshot();
    });

    // TODO: turns out textures are only available in the next animation frame!
    // need to figure out a workaround before uncommenting this test.
    /*visualTest('Textures in the material shader work', async function(p5, screenshot) {
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

      screenshot();
    });*/
  });
});
