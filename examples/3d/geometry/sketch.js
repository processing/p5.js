function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

var theta = 0;

function draw(){
  background(255, 255, 255, 255);

  translate(-120, 0, -170);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  plane(100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  box(100, 100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cylinder(100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cone(100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  torus(100, 20);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  sphere(100, 100);
  pop();
  theta += 0.05;
}