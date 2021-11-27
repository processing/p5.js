let angle, px, py;
let img;
const sz = 25;

function preload() {
  img = loadImage('../assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  setAttributes('antialias', true);
  textureMode(NORMAL);
  fill(63, 81, 181);
  strokeWeight(2);
}

function draw() {
  background(250);

  line(-width / 2, -180, 0, width / 2, -180, 0);

  ngon(5, -200, 0, 120);
  ngon(8, 0, 0, 120);
  ngon(11, 200, 0, 120);

  drawQuads(180);
}

function ngon(n, x, y, d) {
  beginShape(TESS);
  for (let i = 0; i < n + 1; i++) {
    angle = TWO_PI / n * i;
    px = x + sin(angle) * d / 2;
    py = y - cos(angle) * d / 2;
    vertex(px, py);
  }
  for (i = 0; i < n + 1; i++) {
    angle = TWO_PI / n * i;
    px = x + sin(angle) * d / 4;
    py = y - cos(angle) * d / 4;
    vertex(px, py);
  }
  endShape();
}

function drawQuads(y) {
  // 2 args
  push();
  fill(255, 0, 0);
  translate(-3 / 8 * width, y);
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
  push();
  fill(0, 0, 255);
  translate(-1 / 8 * width, y);
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
  push();
  texture(img);
  translate(1 / 8 * width, y);
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
  push();
  texture(img);
  translate(3 / 8 * width, y);
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
