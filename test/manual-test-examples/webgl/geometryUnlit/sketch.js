let rowHeight = 100;
// To add a test, raise this number by the number of rows that you wish to add
// then add your test at the bottom of draw()
const numberOfRows = 5;
let columnWidth;
let margins = 200;
const uniqueGeometry = 6;
let img;

function preload() {
  img = loadImage('../assets/cat.jpg');
}

function setup() {
  createCanvas(windowWidth, rowHeight * numberOfRows, WEBGL);
  columnWidth = (width - margins) / 6;
}

var theta = 0;

function draw() {
  background(150, 150, 150, 255);

  //default fill and stroke
  translate(0, -rowHeight * 2, 0);
  push();
  drawGeometryRow();
  pop();

  // normalMaterial
  translate(0, rowHeight, 0);
  push();
  normalMaterial();
  drawGeometryRow();
  pop();

  //stroke + noFill
  translate(0, rowHeight, 0);
  push();
  stroke(255, 0, 255);
  strokeWeight(0.5);
  noFill();
  drawGeometryRow();
  pop();

  // noStroke + fill
  translate(0, rowHeight, 0);
  push();
  fill(100, 255, 100);
  noStroke();
  drawGeometryRow();
  pop();

  // texture
  translate(0, rowHeight, 0);
  push();
  texture(img);
  noStroke();
  drawGeometryRow();
  pop();

  // To add test, copy-paste the following lines and uncomment
  // translate(0, rowHeight, 0);
  // push();
  // Add your lighting and material conditions here :-)
  // drawGeometryRow();
  // pop();

  theta += 0.05;
}

function drawGeometryRow(callInMiddle) {
  currentX = -columnWidth * (uniqueGeometry / 2);
  translate(currentX, 0, 0);
  drawObject(() => {
    plane(25);
  });

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    box(25, 25, 25);
  });

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    cylinder(25, 25);
  });

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    cone(25, 25);
  });

  if (typeof callInMiddle === 'function') {
    callInMiddle();
  }

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    torus(25, 10);
  });

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    sphere(25);
  });

  translate(columnWidth, 0, 0);
  currentX += columnWidth;
  drawObject(() => {
    rect(0, 0, 25, 25);
  });
}

function drawObject(geom) {
  push();
  _rotate();
  geom();
  pop();
}

function _rotate() {
  rotateZ(theta * mouseX * 0.001);
  rotateX(theta * mouseX * 0.001);
  rotateY(theta * mouseX * 0.001);
}
