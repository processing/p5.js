function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  strokeWeight(0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

var theta = 0;

function draw() {
  theta += 0.05;

  background(255, 255, 255, 255);

  push();
  normalMaterial();
  translate(0, -height / 5, 0);
  drawGeometries();
  pop();

  push();
  fill(150, 150, 150);
  directionalLight(255, 255, 255, 1, 2, -3);
  drawGeometries();
  pop();

  push();
  fill(150, 150, 150, 100);
  translate(0, height / 5, 0);
  drawGeometries();
  pop();
}

function drawGeometries() {
  push();
  var w = width * 5 / 6;
  translate(-w / 2, 0, 0);

  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  plane(50);
  pop();
  translate(w / 5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  box(50, 50, 50);
  pop();
  translate(w / 5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cylinder(50, 50);
  pop();
  translate(w / 5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cone(50, 50);
  pop();
  translate(w / 5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  torus(50, 10);
  pop();
  translate(w / 5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  sphere(50);
  pop();
  pop();
}
