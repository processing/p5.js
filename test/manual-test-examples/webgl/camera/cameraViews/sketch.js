let orthoP5 = new p5(sketch => {
  let x = 100;
  let y = 100;
  let width, height;

  sketch.setup = function() {
    sketch.createCanvas(
      sketch.windowWidth,
      sketch.windowHeight / 2,
      sketch.WEBGL
    );
    width = sketch.width;
    height = sketch.height;
    sketch.ortho(-width / 2, width / 2, height / 2, -height / 2, -500, 10000);
  };

  sketch.draw = function() {
    sketch.background(0);
    sketch.rotateX(sketch.map(sketch.mouseY, 0, height, 0, sketch.PI));
    sketch.rotateY(sketch.map(sketch.mouseX, 0, width, 0, sketch.PI));
    sketch.normalMaterial();
    for (let i = -5; i < 6; i++) {
      for (let j = -5; j < 6; j++) {
        sketch.push();
        sketch.translate(i * 100, 0, j * 100);
        sketch.box(20);
        sketch.pop();
      }
    }
  };
});

let perspP5 = new p5(sketch => {
  sketch.setup = function() {
    sketch.createCanvas(
      sketch.windowWidth,
      sketch.windowHeight / 2,
      sketch.WEBGL
    );
    let fov = sketch.PI / 3.0;
    let cameraZ = sketch.height / 2.0 / sketch.tan(fov / 2.0);
    sketch.perspective(
      fov,
      sketch.width / sketch.height,
      cameraZ * 0.1,
      cameraZ * 10
    );
  };

  sketch.draw = function() {
    sketch.background(0);
    sketch.rotateX(sketch.map(sketch.mouseY, 0, sketch.height, 0, sketch.PI));
    sketch.rotateY(sketch.map(sketch.mouseX, 0, sketch.width, 0, sketch.PI));
    sketch.normalMaterial();
    for (let i = -5; i < 6; i++) {
      for (let j = -5; j < 6; j++) {
        sketch.push();
        sketch.translate(i * 100, 0, j * 100);
        sketch.sphere(20);
        sketch.pop();
      }
    }
  };
});
