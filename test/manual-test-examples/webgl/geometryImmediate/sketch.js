let angle, px, py;
let img;
const sz = 25;
let stripColors = [];

function preload() {
  img = loadImage('../assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  setAttributes('antialias', true);
  textureMode(NORMAL);
  fill(63, 81, 181);
  strokeWeight(2);

  for (let i = 0; i < 12; i++) {
    stripColors.push([random(255), random(255), random(255)]);
  }
}

function draw() {
  background(250);

  // Reference: TRIANGLE_STRIP
  push();
  translate(-width / 3, -240);
  drawStrip(TRIANGLE_STRIP);
  pop();

  // Test 1: QUADS
  push();
  translate(0, -240);
  drawStrip(QUADS);
  pop();

  // Test 2: QUAD_STRIP
  push();
  translate(width / 3, -240);
  drawStrip(QUAD_STRIP);
  pop();

  line(-width / 2, -160, 0, width / 2, -160, 0);

  ngon(5, -200, 0, 120);
  ngon(8, 0, 0, 120);
  ngon(11, 200, 0, 120);

  drawQuads(180);
}

function drawStrip(mode) {
  rotate(PI / 2);
  scale(0.3);
  translate(0, -250);
  beginShape(mode);
  let vertexIndex = 0;
  for (let y = 0; y <= 500; y += 100) {
    let sides = [-1, 1];
    if (mode === QUADS && y % 200 !== 0) {
      // QUAD_STRIP and TRIANGLE_STRIP need the vertices of each shared side
      // ordered in the same way:
      // 0--2--4--6
      // |  |  |  | ⬇️
      // 1--3--5--7
      //
      // ...but QUADS orders vertices in a consisten CCW or CW manner around
      // each quad, meaning each side will be in the reverse order of the
      // previous:
      // 0--3  4--7
      // |  |  |  | 🔄
      // 1--2  5--6
      sides.reverse();
    }
    for (const side of sides) {
      fill(...stripColors[vertexIndex]);
      vertex(side * 40, y);
      vertexIndex++;
    }
  }
  endShape();
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
