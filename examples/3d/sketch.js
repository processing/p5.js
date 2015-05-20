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
  //push()
  translate(-3.0, 0.0, -10.0);
  //pop()

  stroke(0, 0, 0, 0);
  push();
  rotateX(theta);
  //line(0, 0, 0, mouseX, mouseY, 0);
  plane(1, 2);
  pop();

  translate(3, 0, 0);
  push();
  rotateY(theta);
  //cube(1,1,1);
  plane(1,1);
  pop();

  theta += 0.1;
  translate(3, 0, 0);
  push();
  rotateZ(theta);
  triangle();
  pop();

}