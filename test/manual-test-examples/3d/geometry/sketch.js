function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  //cylinder(50, 50);
}

var theta = 0;

function draw(){
  background(255, 255, 255, 255);
  translate(-width/2, 0, 0);
  normalMaterial();
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  plane(50);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  box(50, 50, 50);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cylinder(50, 50);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cone(50, 50);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  torus(50, 10);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  sphere(50);
  pop();
  theta += 0.05;
}