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

    visualTest('Camera settings on framebuffers reset after push/pop', function(p5, screenshot) {
      p5.createCanvas(100, 100, p5.WEBGL);
      p5.setAttributes({ antialias: true });
      const fbo = p5.createFramebuffer();

      p5.background(220);
      p5.imageMode(p5.CENTER);

      fbo.begin();
      p5.push();
      p5.ortho();
      p5.translate(0, -25);
      for (let i = -1; i <= 1; i++) {
        p5.push();
        p5.translate(i * 35, 0);
        p5.box(25, 25, 150);
        p5.pop();
      }
      p5.pop();


      p5.push();
      p5.translate(0, 25);
      for (let i = -1; i <= 1; i++) {
        p5.push();
        p5.translate(i * 35, 0);
        p5.box(25, 25, 150);
        p5.pop();
      }
      p5.pop();

      fbo.end();
      p5.image(fbo, 0, 0);
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
        const setupSketch = (p5) => {
          p5.createCanvas(50, 50, mode === 'webgl' ? p5.WEBGL : p5.P2D);
          if (mode === 'webgl') p5.translate(-p5.width/2, -p5.height/2);
          p5.clear();
          p5.noStroke();
          p5.fill('red');
          p5.circle(20, 20, 15);
          if (mode === 'webgl') {
            p5.beginShape(p5.QUAD_STRIP);
            p5.fill('cyan');
            p5.vertex(35, 35);
            p5.vertex(45, 35);
            p5.fill('blue');
            p5.vertex(35, 45);
            p5.vertex(45, 45);
            p5.endShape();
          } else {
            p5.push();
            const grad = p5.drawingContext.createLinearGradient(35, 35, 35, 45);
            grad.addColorStop(0, 'cyan');
            grad.addColorStop(1, 'blue');
            p5.drawingContext.fillStyle = grad;
            p5.rect(35, 35, 10, 10);
            p5.pop();
          }
        };

        visualTest('It can apply GRAY', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.GRAY);
          screenshot();
        });
        visualTest('It can apply INVERT', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.INVERT);
          screenshot();
        });
        visualTest('It can apply THRESHOLD', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.THRESHOLD);
          screenshot();
        });
        visualTest('It can apply THRESHOLD with a value', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.THRESHOLD, 0.8);
          screenshot();
        });
        visualTest('It can apply POSTERIZE', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.THRESHOLD);
          screenshot();
        });
        visualTest('It can apply POSTERIZE with a value', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.THRESHOLD, 2);
          screenshot();
        });
        visualTest('It can apply BLUR', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.BLUR, 5);
          screenshot();
        });
        visualTest('It can apply BLUR with a value', function(p5, screenshot) {
          setupSketch(p5);
          p5.filter(p5.BLUR, 10);
          screenshot();
        });
        visualTest('It can apply ERODE (4x)', function(p5, screenshot) {
          setupSketch(p5);
          for (let i = 0; i < 4; i++) p5.filter(p5.ERODE);
          screenshot();
        });
        visualTest('It can apply DILATE (4x)', function(p5, screenshot) {
          setupSketch(p5);
          for (let i = 0; i < 4; i++) p5.filter(p5.DILATE);
          screenshot();
        });
      });
    }

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

    visualTest('loadMaterialShader', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const materialShader = await p5.loadMaterialShader('/unit/assets/testMaterial.js');

      p5.noStroke();
      p5.shader(materialShader);
      p5.plane(p5.width, p5.height);
      screenshot();
    });

    visualTest('loadFilterShader', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);

      // Create a scene to filter (red and green stripes)
      p5.background(255);
      p5.noStroke();
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          p5.fill(255, 0, 0); // Red
        } else {
          p5.fill(0, 255, 0); // Green
        }
        p5.rect(-p5.width/2 + i * 10, -p5.height/2, 10, p5.height);
      }

      // Apply the filter shader (should swap red and green channels)
      const filterShader = await p5.loadFilterShader('/unit/assets/testFilter.js');
      p5.filter(filterShader);
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

    visualTest('text renders correctly after geometry with many indices', async (p5, screenshot) => {
      p5.createCanvas(100, 100, p5.WEBGL);
      const font = await p5.loadFont(
        '/unit/assets/Inconsolata-Bold.ttf'
      );

      p5.background(255);
      p5.noStroke();

      p5.textFont(font);
      p5.textSize(20);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Test 1', 0, -20);

      // Draw a sphere which has many more indices than text
      p5.fill(200, 200, 255);
      p5.sphere(30);

      p5.clearDepth();

      // Draw text - should bind its own index buffer
      p5.fill(0);
      p5.text('Test 2', 0, 20);

      screenshot();
    });
  });

  visualSuite('texture()', () => {
    visualTest('on a rect', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = await p5.loadImage('/unit/assets/cat.jpg');
      p5.texture(tex);
      p5.rect(-20, -20, 40, 40);
      screenshot();
    });

    visualTest('on a rect with rounded corners', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = await p5.loadImage('/unit/assets/cat.jpg');
      p5.texture(tex);
      p5.rect(-20, -20, 40, 40, 10);
      screenshot();
    });
  });

  visualSuite('textures in p5.strands', () => {
    visualTest('uniformTexture() works', async (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const tex = await p5.loadImage('/unit/assets/cat.jpg');
      const shader = p5.baseMaterialShader().modify(() => {
        const texUniform = p5.uniformTexture(() => tex)
        p5.getPixelInputs((inputs) => {
          inputs.color = p5.getTexture(texUniform, inputs.texCoord);
          return inputs;
        });
      }, { p5, tex });
      p5.shader(shader);
      p5.rect(-20, -20, 40, 40);
      screenshot();
    });

    visualTest('getTexture in vertex shaders', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const positionData = p5.createFramebuffer({
        width: 3,
        height: 1,
        density: 1,
        antialias: false,
        format: p5.FLOAT,
        textureFiltering: p5.NEAREST
      });
      positionData.loadPixels();
      for (let i = 0; i < 3; i++) {
        positionData.pixels[i * 4] = i / 3;
        positionData.pixels[i * 4 + 1] = 0;
        positionData.pixels[i * 4 + 2] = 0;
        positionData.pixels[i * 4 + 3] = 1;
      }
      positionData.updatePixels();
      const sh = p5.baseMaterialShader().modify(() => {
        const data = p5.uniformTexture(() => positionData);
        p5.getWorldInputs((inputs) => {
          const angle = p5.getTexture(data, [p5.instanceID()/3, 0]).r * p5.TWO_PI;
          inputs.position.xy += [p5.cos(angle) * 10, p5.sin(angle) * 10];
          return inputs;
        });
      }, { p5, positionData });
      const instance = p5.buildGeometry(() => p5.sphere(3));

      p5.noStroke();
      p5.fill('red');
      p5.shader(sh);
      p5.model(instance, 3);
      screenshot();
    });
  });

  visualSuite("Image Based Lighting", function () {
    const shinesses = [50, 150];
    for (const shininess of shinesses) {
      visualTest(
        `${shininess < 100 ? 'low' : 'high'} shininess`,
        async function (p5, screenshot) {
          p5.createCanvas(100, 100, p5.WEBGL);

          // Load the environment map
          const env = await p5.loadImage('/unit/assets/spheremap.jpg');
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

          screenshot();
        },
        { timeout: 2000 }
      );
    }
  });

  visualSuite('instanced randering', async () => {
    visualTest('can draw in a grid with floor()', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const shader = p5.baseMaterialShader().modify(() => {
        p5.getWorldInputs((inputs) => {
          const id = p5.instanceID();
          const gridSize = 5;
          const row = p5.floor(id / gridSize);
          const col = id - row * gridSize;
          const blockInnerSize = 10;
          const x = (col - gridSize / 2.0) * blockInnerSize + blockInnerSize/2;
          const y = (gridSize / 2.0 - row) *  blockInnerSize - blockInnerSize/2;
          inputs.position += [x, y, 0];
          return inputs;
        });
      }, { p5 });
      p5.shader(shader);
      const obj = p5.buildGeometry(() => p5.circle(0, 0, 6))
      p5.noStroke();
      p5.fill(0);
      p5.shader(shader);
      p5.model(obj, 25);
      screenshot();
    });

    visualTest('can draw in a grid with int()', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      const shader = p5.baseMaterialShader().modify(() => {
        p5.getWorldInputs((inputs) => {
          const id = p5.instanceID();
          const gridSize = 5;
          const row = p5.int(id / gridSize);
          const col = id - row * gridSize;
          const blockInnerSize = 10;
          const x = (col - gridSize / 2.0) * blockInnerSize + blockInnerSize/2;
          const y = (gridSize / 2.0 - row) *  blockInnerSize - blockInnerSize/2;
          inputs.position += [x, y, 0];
          return inputs;
        });
      }, { p5 });
      p5.shader(shader);
      const obj = p5.buildGeometry(() => p5.circle(0, 0, 6))
      p5.noStroke();
      p5.fill(0);
      p5.shader(shader);
      p5.model(obj, 25);
      screenshot();
    });
  });

  visualSuite('p5.strands', () => {
    visualTest('it recovers from p5.strands errors', (p5, screenshot) => {
      p5.createCanvas(50, 50, p5.WEBGL);
      try {
        p5.baseMaterialShader().modify(() => {
          undefined.someMethod(); // This will throw an error
        });
      } catch (e) {}
      p5.background('red');
      p5.circle(p5.noise(0), p5.noise(0), 20);
      screenshot();
    });

    visualTest('uses width/height in getFinalColor', (p5, screenshot) => {
      let firstShader;
      function firstShaderCallback() {
        getFinalColor((color) => {
          color = [width / 60, height / 60, 0, 1];
          return color;
        });
      }
      p5.createCanvas(60, 60, p5.WEBGL);
      p5.pixelDensity(1);
      firstShader = p5.baseColorShader().modify(firstShaderCallback);
      p5.background(0);
      p5.shader(firstShader);
      p5.noStroke();
      p5.plane(20, 20);
      screenshot();
    });

    visualSuite('auto-return for shader hooks', () => {
      visualTest('auto-returns input struct when return is omitted', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getWorldInputs((inputs) => {
            inputs.position.x += 10;
            // No explicit return - should auto-return inputs
          });
        }, { p5 });
        p5.background(255);
        p5.noStroke();
        p5.shader(shader);
        p5.sphere(20);
        screenshot();
      });

      visualTest('explicit return still works', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getWorldInputs((inputs) => {
            inputs.position.x += 10;
            return inputs; // Explicit return should still work
          });
        }, { p5 });
        p5.background(255);
        p5.noStroke();
        p5.shader(shader);
        p5.sphere(20);
        screenshot();
      });

      visualTest('auto-return works with getObjectInputs', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getObjectInputs((inputs) => {
            inputs.position.x += 0.25;
            // No explicit return
          });
        }, { p5 });
        p5.background(255);
        p5.lights();
        p5.fill('red');
        p5.noStroke();
        p5.rotateY(p5.PI / 2);
        p5.camera(-800, 0, 0, 0, 0, 0);
        p5.shader(shader);
        p5.sphere(20);
        screenshot();
      });

      visualTest('auto-return works with getCameraInputs', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getCameraInputs((inputs) => {
            inputs.position.x += 10;
            // No explicit return
          });
        }, { p5 });
        p5.background(255);
        p5.lights();
        p5.fill('red');
        p5.noStroke();
        p5.rotateY(p5.PI / 2);
        p5.camera(-800, 0, 0, 0, 0, 0);
        p5.shader(shader);
        p5.sphere(20);
        screenshot();
      });

      visualTest('auto-return preserves multiple property modifications', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getWorldInputs((inputs) => {
            inputs.position.x += 5;
            inputs.position.y += 5;
            inputs.normal.x += 0.5;
            inputs.normal = p5.normalize(inputs.normal);
            // No explicit return - all modifications should be preserved
          });
        }, { p5 });
        p5.background(255);
        p5.lights();
        p5.fill('red');
        p5.noStroke();
        p5.shader(shader);
        p5.sphere(20);
        screenshot();
      });

      visualTest('auto-return works with getPixelInputs', (p5, screenshot) => {
        p5.createCanvas(50, 50, p5.WEBGL);
        const shader = p5.baseMaterialShader().modify(() => {
          p5.getPixelInputs((inputs) => {
            inputs.color = p5.vec4(1.0, 0.0, 0.0, 1.0); // Red
            // No explicit return
          });
        }, { p5 });
        p5.background(255);
        p5.noStroke();
        p5.shader(shader);
        p5.circle(0, 0, 40);
        screenshot();
      });
    });
  });

  visualSuite('background()', function () {
    visualTest('background(image) works in WEBGL', function (p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);

      const g = p5.createGraphics(50, 50);
      g.background(255, 0, 0);
      g.fill(0);
      g.noStroke();
      g.circle(25, 25, 20);

      p5.background(0, 0, 255);
      p5.background(g);

      screenshot();
    });
  });

  visualSuite('Transforms', function() {
    visualTest('translate() moves shapes in x and y axes', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(200);
      p5.noStroke();

      // Red circle at origin
      p5.fill('red');
      p5.circle(0, 0, 10);

      // Green circle translated by (15, 0)
      p5.push();
      p5.translate(15, 0);
      p5.fill('green');
      p5.circle(0, 0, 10);
      p5.pop();

      // Blue circle translated by (0, 15)
      p5.push();
      p5.translate(0, 15);
      p5.fill('blue');
      p5.circle(0, 0, 10);
      p5.pop();

      screenshot();
    });

    visualTest('rotate() rotates shapes around z-axis', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(200);
      p5.noStroke();
      p5.fill('red');
      p5.rectMode(p5.CENTER);
      p5.rotate(p5.PI / 4);
      p5.rect(0, 0, 30, 30);
      screenshot();
    });

    visualTest('scale() uniformly scales shapes', function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      p5.background(200);
      p5.noStroke();
      p5.fill('red');

      // Unscaled circle
      p5.circle(-12, 0, 20);

      // Scaled circle (half size)
      p5.push();
      p5.translate(12, 0);
      p5.scale(0.5);
      p5.circle(0, 0, 20);
      p5.pop();

      screenshot();
    });
  });

  visualSuite('media assets', function() {
    visualTest('drawing gifs', async function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      const gif = await p5.loadImage('/test/unit/assets/nyan_cat.gif');
      p5.imageMode(p5.CENTER);
      p5.image(gif, 0, 0);
      screenshot();
    });

    visualTest('drawing gifs after a time delay', async function(p5, screenshot) {
      p5.createCanvas(50, 50, p5.WEBGL);
      const gif = await p5.loadImage('/test/unit/assets/nyan_cat.gif');
      p5.imageMode(p5.CENTER);
      p5.image(gif, 0, 0);
      p5.clear()
      // Simulate waiting for successive draw calls
      p5._lastRealFrameTime += 300;
      p5.image(gif, 0, 0);
      screenshot();
    });
  });

  visualSuite('Tessellation', function() {
    visualTest('Handles nearly identical consecutive vertices', function(p5, screenshot) {
      p5.createCanvas(400, 400, p5.WEBGL);
      
      const contours = [
        [
          [-3.8642425537109375, -6.120738636363637, 0],
          [3.2025188099254267, -6.120738636363637, 0],
          [3.2025188099254267, -4.345170454545455, 0],
          [-3.8642425537109375, -4.345170454545455, 0],
          [-3.8642425537109375, -6.120738636363637, 0]
        ],
        [
          [-1.8045834628018462, 4.177556818181818, 0],
          [-1.8045834628018462, -9.387784090909093, 0],
          [0.29058699174360836, -9.387784090909093, 0],
          [0.2905869917436083, 3.609374411367136, 0],
          [0.31044303036623855, 4.068235883781435, 0],
          [0.38522861430307975, 4.522728865422799, 0],
          [0.548044378107245, 4.941051136363637, 0],
          [0.8364672032828204, 5.2932224887960775, 0],
          [1.2227602871981542, 5.526988636363637, 0],
          [1.6572258237923885, 5.634502949876295, 0],
          [2.101666537198154, 5.669034090909091, 0],
          [2.6695604948237173, 5.633568761673102, 0],
          [3.0249619917436084, 5.5625, 0],
          [3.4510983553799726, 7.4446022727272725, 0],
          [2.8568950819856695, 7.613138889205699, 0],
          [2.3751340936529037, 7.676962586830456, 0],
          [1.8892600236717598, 7.693181792704519, 0],
          [1.2922705720786674, 7.649533731133848, 0],
          [0.7080836288276859, 7.519788939617751, 0],
          [0.14854153719815422, 7.311434659090909, 0],
          [-0.38643934048179873, 7.00959666478984, 0],
          [-0.858113258144025, 6.61653855366859, 0],
          [-1.25415732643821, 6.1484375, 0],
          [-1.5108595282965422, 5.697682732328092, 0],
          [-1.6824918355513252, 5.207533878495854, 0],
          [-1.7762971052870198, 4.695933154267308, 0],
          [-1.8045834628018462, 4.177556818181818, 0]
        ]
      ];
      
      p5.background('red');
      p5.push();
      p5.stroke(0);
      p5.fill('#EEE');
      p5.scale(15);
      p5.beginShape();
      for (const contour of contours) {
        p5.beginContour();
        for (const v of contour) {
          p5.vertex(...v);
        }
        p5.endContour();
      }
      p5.endShape();

      p5.stroke(0, 255, 0);
      p5.strokeWeight(5);
      p5.beginShape(p5.POINTS);
      for (const contour of contours) {
        for (const v of contour) {
          p5.vertex(...v);
        }
      }
      p5.endShape();
      p5.pop();

      screenshot();
    });
  });
});
