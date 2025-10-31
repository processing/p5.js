import { vi, afterEach } from 'vitest';
import { visualSuite, visualTest } from '../visualTest';

visualSuite('WebGL', function() {
  visualSuite('Camera', function() {
    visualTest('2D objects maintain correct size', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.noStroke();
      p5.fill('red');
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, p5.width/2, p5.height/2);
      screenshot();
    });

    visualTest('Custom camera before and after resize', function(p5, screenshot) {
      p5.createCanvas(25, 50, p5.WEBGL);
      const cam = p5.createCamera();
      p5.setCamera(cam);
      cam.setPosition(-10, -10, 800);
      p5.strokeWeight(4);
      p5.box(20);
      screenshot();

      p5.resizeCanvas(50, 25);
      p5.box(20);
      screenshot();
    });
  });

  visualSuite('filter', function() {
    visualTest('On the main canvas', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.noStroke();
      p5.fill('red');
      p5.circle(0, 0, 20);
      p5.filter(p5.GRAY);
      screenshot();
    });

    visualTest('On a framebuffer', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      const fbo = p5.createFramebuffer({ antialias: true });
      fbo.begin();
      p5.noStroke();
      p5.fill('red');
      p5.circle(0, 0, 20);
      p5.filter(p5.GRAY);
      fbo.end();
      p5.imageMode(p5.CENTER);
      p5.image(fbo, 0, 0);
      screenshot();
    });

    visualTest('On a framebuffer of a different size from the canvas', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      const fbo = p5.createFramebuffer({ antialias: true, width: 25, height: 100 });
      fbo.begin();
      p5.background('blue');
      p5.fill('red');
      p5.circle(0, 0, 20);
      p5.filter(p5.BLUR, 3);
      fbo.end();
      p5.imageMode(p5.CENTER);
      p5.image(fbo, 0, 0);
      screenshot();
    });

    visualTest(
      'On a framebuffer sized differently from the main canvas',
      function(p5, screenshot) {
        p5.createCanvas(50, 50, p5.WEBGL);
        const fbo = p5.createFramebuffer({
          width: 26,
          height: 26,
          antialias: true
        });
        fbo.begin();
        p5.noStroke();
        p5.fill('red');
        p5.circle(0, 0, 20);
        p5.filter(p5.GRAY);
        fbo.end();
        p5.imageMode(p5.CENTER);
        p5.image(fbo, 0, 0);
        screenshot();
      }
    );

    for (const mode of ['webgl', '2d']) {
      visualSuite(`In ${mode} mode`, function() {
        visualTest('It can use filter shader hooks', function(p5, screenshot) {
          p5.createCanvas(50, 50, mode === 'webgl' ? p5.WEBGL : p5.P2D);

          const s = p5.baseFilterShader().modify({
            'vec4 getColor': `(FilterInputs inputs, in sampler2D content) {
              vec4 c = getTexture(content, inputs.texCoord);
              float avg = (c.r + c.g + c.b) / 3.0;
              return vec4(avg, avg, avg, c.a);
            }`
          });

          if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
          p5.background(255);
          p5.fill('red');
          p5.noStroke();
          p5.circle(15, 15, 20);
          p5.circle(30, 30, 20);
          p5.filter(s);
          screenshot();
        });
      });
    }

    for (const mode of ['webgl', '2d']) {
      visualSuite(`In ${mode} mode`, function() {
        visualTest('It can combine multiple filter passes', function(p5, screenshot) {
          p5.createCanvas(50, 50, mode === 'webgl' ? p5.WEBGL : p5.P2D);
          if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
          p5.background(255);
          p5.fill(0);
          p5.noStroke();
          p5.circle(15, 15, 20);
          p5.circle(30, 30, 20);
          p5.filter(p5.BLUR, 5);
          p5.filter(p5.THRESHOLD);
          screenshot();
        });
      });
    }
  });

  visualSuite('Lights', function() {
    visualTest('Fill color and default ambient material', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.noStroke();
      p5.lights();
      p5.fill('red');
      p5.sphere(20);
      screenshot();
    });
  });

  visualSuite('3DModel', function() {
    visualTest('OBJ model with MTL file displays diffuse colors correctly', function(p5, screenshot) {
      return new Promise(resolve => {
        p5.createCanvas(50, 50, p5.WEBGL);
        p5.loadModel('/unit/assets/octa-color.obj', model => {
          p5.background(255);
          p5.rotateX(10 * 0.01);
          p5.rotateY(10 * 0.01);
          model.normalize();
          p5.model(model);
          screenshot();
          resolve();
        });
      });
    });
    visualTest('Object with no colors takes on fill color', function(p5, screenshot) {
      return new Promise(resolve => {
        p5.createCanvas(50, 50, p5.WEBGL);
        p5.loadModel('/unit/assets/cube.obj', model => {
          p5.background(255);
          p5.fill('blue'); // Setting a fill color
          p5.rotateX(p5.frameCount * 0.01);
          p5.rotateY(p5.frameCount * 0.01);
          model.normalize();
          p5.model(model);
          screenshot();
          resolve();
        });
      });
    });
    visualTest(
      'Object with different texture coordinates per use of vertex keeps the coordinates intact',
      async function(p5, screenshot) {
        p5.createCanvas(50, 50, p5.WEBGL);
        const tex = await p5.loadImage('/unit/assets/cat.jpg');
        const cube = await new Promise(resolve => p5.loadModel('/unit/assets/cube-textures.obj', resolve));
        cube.normalize();
        p5.background(255);
        p5.texture(tex);
        p5.rotateX(p5.PI / 4);
        p5.rotateY(p5.PI / 4);
        p5.scale(80/400);
        p5.model(cube);
        screenshot();
      }
    );
  });

  visualSuite('vertexProperty', function(){
    const vertSrc = `#version 300 es
    precision mediump float;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    in vec3 aPosition;
    in vec3 aCol;
    out vec3 vCol;
    void main(){
      vCol = aCol;
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }`;
    const fragSrc = `#version 300 es
      precision mediump float;
      in vec3 vCol;
      out vec4 outColor;
      void main(){
        outColor = vec4(vCol, 1.0);
      }`;
    visualTest(
      'on PATH shape mode', function(p5, screenshot) {
        p5.createCanvas(50, 50, p5.WEBGL);
        p5.background('white');
        const myShader = p5.createShader(vertSrc, fragSrc);
        p5.shader(myShader);
        p5.beginShape(p5.PATH);
        p5.noStroke();
        for (let i = 0; i < 20; i++){
          let x = 20 * p5.sin(i/20*p5.TWO_PI);
          let y = 20 * p5.cos(i/20*p5.TWO_PI);
          p5.vertexProperty('aCol', [x/20, -y/20, 0]);
          p5.vertex(x, y);
        }
        p5.endShape();
        screenshot();
      }
    );
    visualTest(
      'on QUADS shape mode', function(p5, screenshot) {
        p5.createCanvas(50, 50, p5.WEBGL);
        p5.background('white');
        const myShader = p5.createShader(vertSrc, fragSrc);
        p5.shader(myShader);
        p5.beginShape(p5.QUADS);
        p5.noStroke();
        p5.translate(-25,-25);
        for (let i = 0; i < 5; i++){
          for (let j = 0; j < 5; j++){
            let x1 = i * 10;
            let x2 = x1 + 10;
            let y1 = j * 10;
            let y2 = y1 + 10;
            p5.vertexProperty('aCol', [1, 0, 0]);
            p5.vertex(x1, y1);
            p5.vertexProperty('aCol', [0, 0, 1]);
            p5.vertex(x2, y1);
            p5.vertexProperty('aCol', [0, 1, 1]);
            p5.vertex(x2, y2);
            p5.vertexProperty('aCol', [1, 1, 1]);
            p5.vertex(x1, y2);
          }
        }
        p5.endShape();
        screenshot();
      }
    );
    visualTest(
      'on buildGeometry outputs containing 3D primitives', function(p5, screenshot) {
        p5.createCanvas(50, 50, p5.WEBGL);
        p5.background('white');
        const myShader = p5.createShader(vertSrc, fragSrc);
        p5.shader(myShader);
        const shape = p5.buildGeometry(() => {
          p5.push();
          p5.translate(15,-10,0);
          p5.sphere(5);
          p5.pop();
          p5.beginShape(p5.TRIANGLES);
          p5.vertexProperty('aCol', [1,0,0]);
          p5.vertex(-5, 5, 0);
          p5.vertexProperty('aCol', [0,1,0]);
          p5.vertex(5, 5, 0);
          p5.vertexProperty('aCol', [0,0,1]);
          p5.vertex(0, -5, 0);
          p5.endShape(p5.CLOSE);
          p5.push();
          p5.translate(-15,10,0);
          p5.box(10);
          p5.pop();
        });
        p5.model(shape);
        screenshot();
      }
    );
  });

  visualSuite('ShaderFunctionality', function() {
    visualTest('FillShader', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const img = await p5.loadImage('/unit/assets/cat.jpg');
      const fillShader = p5.createShader(
        `
      attribute vec3 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 1.0);
      }
      `,
        `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
      `
      );
      p5.shader(fillShader);
      p5.lights();
      p5.texture(img);
      p5.noStroke();
      p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height);
      screenshot();
    });

    visualTest('StrokeShader', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      // Create a stroke shader with a fading effect based on distance
      const strokeshader = p5.baseStrokeShader().modify({
        'Inputs getPixelInputs': `(Inputs inputs) {
        float opacity = 1.0 - smoothstep(
          0.0,
          15.0,
          length(inputs.position - inputs.center)
        );
        inputs.color *= opacity;
        return inputs;
      }`
      });

      p5.strokeShader(strokeshader);
      p5.strokeWeight(15);
      p5.line(
        -p5.width / 3,
        p5.sin(0.2) * p5.height / 4,
        p5.width / 3,
        p5.sin(1.2) * p5.height / 4
      );
      screenshot();
    });

    visualTest('ImageShader', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const img = await p5.loadImage('/unit/assets/cat.jpg');
      const imgShader = p5.createShader(
        `
      precision mediump float;
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      void main() {
        vTexCoord = aTexCoord;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
      }
      `,
        `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform sampler2D uTexture;

      void main() {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        gl_FragColor = texColor * vec4(1.5, 0.5, 0.5, 1.0);
      }
      `
      );

      p5.imageShader(imgShader);
      imgShader.setUniform('uTexture', img);
      p5.noStroke();
      p5.image(img, -p5.width / 2, -p5.height / 2, p5.width, p5.height);
      screenshot();
    });
  });

  visualSuite('Strokes', function() {
    visualTest('Strokes do not cut into fills in ortho mode', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(220);
      p5.stroke(8);
      p5.ortho();
      p5.rotateX(p5.PI/4);
      p5.rotateY(p5.PI/4);
      p5.box(30);
      screenshot();
    });
  });

  visualSuite('Opacity', function() {
    visualTest('Basic colors have opacity applied correctly', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(255);
      p5.fill(255, 100, 100, 100);
      p5.circle(0, 0, 50);
      screenshot();
    });

    visualTest('Colors have opacity applied correctly when lights are used', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(255);
      p5.ambientLight(255);
      p5.fill(255, 100, 100, 100);
      p5.circle(0, 0, 50);
      screenshot();
    });

    visualTest('Colors in shader hooks have opacity applied correctly', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const myShader = p5.baseMaterialShader().modify({
        'Inputs getPixelInputs': `(Inputs inputs) {
          inputs.color = vec4(1., 0.4, 0.4, 100./255.);
          return inputs;
        }`
      });
      p5.background(255);
      p5.shader(myShader);
      p5.circle(0, 0, 50);
      screenshot();
    });

    visualTest('Colors in textures have opacity applied correctly', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = p5.createFramebuffer();
      tex.draw(() => p5.background(255, 100, 100, 100));
      p5.background(255);
      p5.texture(tex);
      p5.circle(0, 0, 50);
      screenshot();
    });

    visualTest('Colors in tinted textures have opacity applied correctly', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = p5.createFramebuffer();
      tex.draw(() => p5.background(255, 100, 100, 255));
      p5.background(255);
      p5.texture(tex);
      p5.tint(255, 100);
      p5.circle(0, 0, 50);
      screenshot();
    });
  });

  visualSuite('Hooks coordinate spaces', () => {
    for (const base of ['baseMaterialShader', 'baseColorShader', 'baseNormalShader']) {
      visualSuite(base, () => {
        visualTest('Object space', (p5, screenshot) => {
          p5.createCanvas(50, 50, p5.WEBGL);
          const myShader = p5[base]().modify({
            'Vertex getObjectInputs': `(Vertex inputs) {
              inputs.position.x += 0.25;
              inputs.normal.x += 0.5 * sin(inputs.position.y * 2.);
              inputs.normal = normalize(inputs.normal);
              return inputs;
            }`
          });
          p5.background(255);
          p5.lights();
          p5.fill('red');
          p5.noStroke();
          p5.rotateY(p5.PI/2);
          p5.camera(-800, 0, 0, 0, 0, 0);
          p5.shader(myShader);
          p5.sphere(20);
          screenshot();
        });

        visualTest('World space', (p5, screenshot) => {
          p5.createCanvas(50, 50, p5.WEBGL);
          const myShader = p5[base]().modify({
            'Vertex getWorldInputs': `(Vertex inputs) {
              inputs.position.x += 10.;
              inputs.normal.x += 0.5 * sin(inputs.position.y * 2.);
              inputs.normal = normalize(inputs.normal);
              return inputs;
            }`
          });
          p5.background(255);
          p5.lights();
          p5.fill('red');
          p5.noStroke();
          p5.rotateY(p5.PI/2);
          p5.camera(-800, 0, 0, 0, 0, 0);
          p5.shader(myShader);
          p5.sphere(20);
          screenshot();
        });

        visualTest('Camera space', (p5, screenshot) => {
          p5.createCanvas(50, 50, p5.WEBGL);
          const myShader = p5[base]().modify({
            'Vertex getCameraInputs': `(Vertex inputs) {
              inputs.position.x += 10.;
              inputs.normal.x += 0.5 * sin(inputs.position.y * 2.);
              inputs.normal = normalize(inputs.normal);
              return inputs;
            }`
          });
          p5.background(255);
          p5.lights();
          p5.fill('red');
          p5.noStroke();
          p5.rotateY(p5.PI/2);
          p5.camera(-800, 0, 0, 0, 0, 0);
          p5.shader(myShader);
          p5.sphere(20);
          screenshot();
        });

        visualTest('Combined vs split matrices', (p5, screenshot) => {
          p5.createCanvas(50, 50, p5.WEBGL);
          for (const space of ['Object', 'World', 'Camera']) {
            const myShader = p5[base]().modify({
              [`Vertex get${space}Inputs`]: `(Vertex inputs) {
                  // No-op
                  return inputs;
                }`
            });
            p5.background(255);
            p5.push();
            p5.lights();
            p5.fill('red');
            p5.noStroke();
            p5.translate(20, -10, 5);
            p5.rotate(p5.PI * 0.1);
            p5.camera(-800, 0, 0, 0, 0, 0);
            p5.shader(myShader);
            p5.box(30);
            p5.pop();
            screenshot();
          }
        });
      });
    }
  });

  visualSuite('textToModel', () => {
    visualTest('Flat', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.textSize(20);
      const geom = font.textToModel('p5*js', 0, 0, {
        sampleFactor: 2
      });
      geom.normalize();
      p5.background(255);
      p5.normalMaterial();
      p5.rotateX(p5.PI*0.1);
      p5.rotateY(p5.PI*0.1);
      p5.scale(50/200);
      p5.model(geom);
      screenshot();
    });

    visualTest('Extruded', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );
      p5.textSize(20);
      const geom = font.textToModel('p5*js', 0, 0, {
        extrude: 10,
        sampleFactor: 2
      });
      geom.normalize();
      p5.background(255);
      p5.normalMaterial();
      p5.rotateX(p5.PI*0.1);
      p5.rotateY(p5.PI*0.1);
      p5.scale(50/200);
      p5.model(geom);
      screenshot();
    });
  });

  visualSuite('erase()', () => {
    visualTest('on the main canvas', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(0);
      p5.fill('red');
      p5.rect(-20, -20, 40, 40);
      p5.erase();
      p5.circle(0, 0, 10);
      p5.noErase();
      screenshot();
    });

    visualTest('on a framebuffer', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(0);
      const fbo = p5.createFramebuffer();
      fbo.begin();
      p5.fill('red');
      p5.rect(-20, -20, 40, 40);
      p5.erase();
      p5.circle(0, 0, 10);
      p5.noErase();
      fbo.end();
      p5.imageMode(p5.CENTER);
      p5.image(fbo, 0, 0);
      screenshot();
    });
  });

  visualSuite('buildGeometry()', () => {
    visualTest('can draw models', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);

      const sphere = p5.buildGeometry(() => {
        p5.scale(0.25);
        p5.sphere();
      });

      const geom = p5.buildGeometry(() => {
        p5.model(sphere);
      });

      p5.background(255);
      p5.lights();
      p5.model(geom);
      screenshot();
    });

    visualTest('only fills set in buildGeometry are kept', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);

      const geom = p5.buildGeometry(() => {
        p5.push();
        p5.translate(-p5.width*0.2, 0);
        p5.scale(0.15);
        p5.sphere();
        p5.pop();

        p5.push();
        p5.fill('red');
        p5.translate(p5.width*0.2, 0);
        p5.scale(0.15);
        p5.sphere();
        p5.pop();
      });

      p5.fill('blue');
      p5.noStroke();
      p5.model(geom);
      screenshot();
    });
  });

  visualSuite('font data', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    visualTest('glyph resource allocation does not corrupt textures', async (p5, screenshot) => {
      p5.createCanvas(100, 100, p5.WEBGL);
      vi.spyOn(p5._renderer, 'maxCachedGlyphs').mockReturnValue(6);

      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );

      p5.textFont(font);
      p5.clear();
      p5.textSize(10);
      p5.textAlign(p5.LEFT, p5.TOP);
      for (let i = 0; i < 100; i++) {
        const x = -p5.width/2 + (i % 10) * 10;
        const y = -p5.height/2 + p5.floor(i / 10) * 10;
        p5.text(String.fromCharCode(33 + i), x, y);
      }

      screenshot();
    });
  });

  visualSuite('texture()', () => {
    visualTest('on a rect', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = await p5.loadImage('/unit/assets/cat.jpg');
      p5.texture(tex);
      p5.texture(tex);
      p5.rect(-20, -20, 40, 40);
      screenshot();
    });

    visualTest('on a rect with rounded corners', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = await p5.loadImage('/unit/assets/cat.jpg');
      p5.texture(tex);
      p5.texture(tex);
      p5.rect(-20, -20, 40, 40, 10);
      screenshot();
    });
  });

  visualSuite('Tessellation', function() {
    visualTest('Handles nearly identical consecutive vertices', function(p5, screenshot) {
      p5.createCanvas(100, 100, p5.WEBGL);
      p5.pixelDensity(1);
      p5.background(255);
      p5.fill(0);
      p5.noStroke();

      // Contours with nearly identical consecutive vertices (as can occur with textToContours)
      // Outer contour
      p5.beginShape();
      p5.vertex(-30, -30, 0);
      p5.vertex(30, -30, 0);
      p5.vertex(30, 30, 0);
      p5.vertex(-30, 30, 0);

      // Inner contour (hole) with nearly identical vertices
      p5.beginContour();
      p5.vertex(-10, -10, 0);
      p5.vertex(-10, 10, 0);
      // This vertex has x coordinate almost equal to previous (10.00000001 vs 10)
      p5.vertex(10.00000001, 10, 0);
      p5.vertex(10, -10, 0);
      p5.endContour();

      p5.endShape(p5.CLOSE);

      screenshot();
    });
  });
});
