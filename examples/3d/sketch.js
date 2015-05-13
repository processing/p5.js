function setup() {
  //@todo need to implement default for 4th parameter {bool}
  //so that if user wants to write createCanvas(800,160,'webgl')
  //webgl context gets initialized properly
  // createCanvas(displayWidth,displayHeight); //2d context
  //createCanvas(300, 300, 'webgl');
  createCanvas(displayWidth, displayHeight, 'webgl');
}

function draw() {
  background(0, 255, 0, 255);
  stroke(0, 0, 0, 0);
  line(0, 0, 0, mouseX, mouseY, 0);

  quad(0, 0, 0, 100, 0, 0, 0, 100, 0, 100, 100, 0);
  // push()
  // rotateY(sin(theta));
  //translate(100, 100, 0);

  triangle(
    20.0, 0.0, 100.0,
    10.0, 20.0, 100.0,
    30.0, 20.0, 100.0);
  // triangle(
  //   300.0, -100.0, 10.0,
  //   200.0, 100.0, 10.0,
  //   400.0, 100.0, 10.0);
  // pop()

  // push();
  // translate(100, 100, 0);
  // rotateY();
  // sphere(20);
  // pop();
  //quad(-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, -0.5, 0.5, 0.0, 0.5, 0.5, 0.0);

}