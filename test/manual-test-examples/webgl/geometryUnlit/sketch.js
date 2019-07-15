let columnHeight = 100;
let rowWidth;
let margins = 200;
let img;

function preload() {
  img = loadImage('../assets/cat.jpg');
}

function setup() {
  createCanvas(windowWidth, 600, WEBGL);
  rowWidth = (width - margins) / 6;
}

var theta = 0;

function draw() {
  background(150, 150, 150, 255);

  translate(0, -columnHeight * 2, 0);
  push();
  drawGeometry();
  pop();

  translate(0, columnHeight, 0);
  push();
  normalMaterial();
  drawGeometry();
  pop();

  translate(0, columnHeight, 0);
  push();
  stroke(255, 0, 255);
  strokeWeight(0.5);
  noFill();
  drawGeometry();
  pop();

  translate(0, columnHeight, 0);
  push();
  fill(100, 255, 100);
  noStroke();
  drawGeometry();
  pop();

  translate(0, columnHeight, 0);
  push();
  texture(img);
  noStroke();
  drawGeometry();
  pop();
  theta += 0.05;
}

function drawGeometry() {
  translate(-rowWidth * 2.5, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  plane(25);
  pop();
  translate(rowWidth, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  box(25, 25, 25);
  pop();
  translate(rowWidth, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cylinder(25, 25);
  pop();
  translate(rowWidth, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  cone(25, 25);
  pop();
  translate(rowWidth, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  torus(25, 10);
  pop();
  translate(rowWidth, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
  sphere(25);
  pop();
}
