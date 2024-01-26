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

  visualSuite('3D Model rendering', function() {
    visualTest('OBJ model with MTL file displays diffuse colors correctly', function(p5, screenshot) {
      let model;

      p5.preload = function() {
        model = p5.loadModel('../../assets/octa-color.obj');
      };

      p5.setup = function() {
        p5.createCanvas(400, 400, p5.WEBGL);
      };

      p5.draw = function() {
        p5.background(200);
        p5.rotateX(p5.frameCount * 0.01);
        p5.rotateY(p5.frameCount * 0.01);
        p5.model(model);
        if(p5.frameCount === 10){
          screenshot();
          p5.noLoop();
        }
      };
    });
  });
});
