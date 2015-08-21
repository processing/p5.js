function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

var theta = 0;

function draw(){
  background(255, 255, 255, 255);
  camera(width/2, 0, 800);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);
  normalMaterial();
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  plane(80, 80);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  box(80, 80, 80);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cylinder(80, 80);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cone(80, 80);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  torus(80, 20);
  pop();
  translate(250, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  sphere(80, 80);
  pop();
  theta += 0.05;
}