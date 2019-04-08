var img;
var sz = 100;

function preload() {
  img = loadImage('assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
}

function draw() {
  background(255);

  // 2 args
  fill(255, 0, 0);
  push();
  translate(-3 / 8 * width, 0);
  beginShape(TRIANGLES);
  vertex(-sz, -sz);
  vertex(sz, -sz);
  vertex(sz, sz);
  vertex(sz, sz);
  vertex(-sz, sz);
  vertex(-sz, -sz);
  endShape();
  pop();

  // 3 args
  fill(0, 0, 255);
  push();
  translate(-1 / 8 * width, 0);
  beginShape(TRIANGLES);
  vertex(-sz, -sz, 0);
  vertex(sz, -sz, 0);
  vertex(sz, sz, 0);
  vertex(sz, sz, 0);
  vertex(-sz, sz, 0);
  vertex(-sz, -sz, 0);
  endShape();
  pop();

  // 4 args
  texture(img);
  push();
  translate(1 / 8 * width, 0);
  beginShape(TRIANGLES);
  vertex(-sz, -sz, 0, 0);
  vertex(sz, -sz, 1, 0);
  vertex(sz, sz, 1, 1);
  vertex(sz, sz, 1, 1);
  vertex(-sz, sz, 0, 1);
  vertex(-sz, -sz, 0, 0);
  endShape();
  pop();

  // 5 args
  texture(img);
  push();
  translate(3 / 8 * width, 0);
  beginShape(TRIANGLES);
  vertex(-sz, -sz, 0, 0, 0);
  vertex(sz, -sz, 0, 1, 0);
  vertex(sz, sz, 0, 1, 1);
  vertex(sz, sz, 0, 1, 1);
  vertex(-sz, sz, 0, 0, 1);
  vertex(-sz, -sz, 0, 0, 0);
  endShape();
  pop();
}
