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
        p5.loadModel('unit/assets/octa-color.obj', model => {
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
        p5.loadModel('unit/assets/cube.obj', model => {
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
        const tex = await new Promise(resolve => p5.loadImage('unit/assets/cat.jpg', resolve));
        const cube = await new Promise(resolve => p5.loadModel('unit/assets/cube-textures.obj', resolve));
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
});
