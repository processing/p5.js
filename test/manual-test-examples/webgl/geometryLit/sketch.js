const columnHeight = 100;
const numberOfColumns = 8;
let rowWidth;
const margins = 200;
let img;

let x = 0;

function preload() {
  img = loadImage('../assets/cat.jpg');
}

function setup() {
  setAttributes('perPixelLighting', true);
  createCanvas(windowWidth, columnHeight * numberOfColumns, WEBGL);
  rowWidth = (width - margins) / 6;
}

let theta = 0;

function draw() {
  background(150, 150, 150, 255);
  let locY = mouseY - height / 2;
  let locX = mouseX - width / 2;

  // ambientMaterial + ambientLight
  translate(0, -columnHeight * (numberOfColumns / 2), 0);
  push();
  noStroke();
  ambientMaterial(200, 100, 100);
  ambientLight(255);
  drawGeometry();
  pop();

  //  similar effect achieved with emissiveMaterial
  translate(0, columnHeight, 0);
  push();
  noStroke();
  emissiveMaterial(200, 100, 100);
  drawGeometry();
  pop();

  // ambientLight + pointLight + specularMaterial with low shininess
  translate(0, columnHeight, 0);
  push();
  ambientLight(0, 0, 150);
  pointLight(200, 0, 0, 0, 0, 0);
  noStroke();
  specularMaterial(250);
  shininess(1);
  drawGeometry();
  pop();

  // ambientLight + directionalLight + specularMaterial with high shininess
  translate(0, columnHeight, 0);
  push();
  ambientLight(0, 0, 150);
  directionalLight(200, 0, 0, 0.5, 0, -1);
  noStroke();
  specularMaterial(250);
  shininess(10);
  drawGeometry();
  pop();

  // ambientLight + pointLight + fill with high lightFalloff
  translate(0, columnHeight, 0);
  push();
  ambientLight(100, 200, 100);
  pointLight(0, 0, 200, 0, 0, 0);
  noStroke();
  lightFalloff(1, 0, 0);
  drawGeometry();
  pop();

  // ambientLight + pointLight + fill with high lightFalloff
  translate(0, columnHeight, 0);
  push();
  ambientLight(100, 200, 100);
  pointLight(0, 0, 200, 0, 0, 0);
  noStroke();
  lightFalloff(0.1, 0, 0);
  drawGeometry();
  pop();

  translate(0, columnHeight, 0);
  push();
  ambientLight(255);
  directionalLight(200, 0, 0, 0.5, 0, -1);
  noStroke();
  texture(img);
  drawGeometry();
  pop();

  //test specular highlight
  noStroke();
  translate(0, columnHeight, 0);
  push();
  shininess(10);
  ambientLight(50);
  specularColor(250, 0, 0);
  pointLight(255, 0, 0, 0, -100, 100);
  specularColor(0, 250, 0);
  pointLight(0, 255, 0, 0, 100, 100);
  specularMaterial(255);
  drawGeometry();
  pop();

  theta += 0.05;
}

function drawGeometry() {
  translate(-rowWidth * 3, 0, 0);
  x = 0;
  push();
  _rotate();
  plane(25);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  box(25, 25, 25);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  cylinder(25, 25);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  cone(25, 25);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  torus(25, 10);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  sphere(25);
  pop();

  translate(rowWidth, 0, 0);
  x++;
  push();
  _rotate();
  rect(0, 0, 25, 25);
  pop();
}

function _rotate() {
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
}
