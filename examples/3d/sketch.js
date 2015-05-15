function setup() {
  //@todo need to implement default for 4th parameter {bool}
  //so that if user wants to write createCanvas(800,160,'webgl')
  //webgl context gets initialized properly
  // createCanvas(displayWidth,displayHeight); //2d context
  createCanvas(displayWidth, displayHeight, 'webgl');
}

var theta = 0;

function draw() {
  background(0, 255, 0, 255);

  translate(-1.5, 0.0, -5.0);

  stroke(0, 0, 0, 0);
  rotateX(theta);
  line(0, 0, 0, mouseX, mouseY, 0);

  quad(0, 0, 0, 100, 0, 0, 0, 100, 0, 100, 100, 0);

  translate(3, 0, 0);
  rotateX(theta);
  triangle(
    200.0, 0.0, 100.0,
    100.0, 20.0, 100.0,
    300.0, 20.0, 100.0);

  theta += 0.1;
  translate(3, 0, 0);
  rotateX(theta);
  triangle(
    200.0, 0.0, 100.0,
    100.0, 20.0, 100.0,
    300.0, 20.0, 100.0);

}