let angle, px, py;
let img;
const sz = 25;

function preload() {
  img = loadImage('../assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  setAttributes('antialias', true);
  fill(63, 81, 181);
  strokeWeight(2);
  noLoop();
}

function draw() {
  background(250);

  // Reference: TRIANGLE_STRIP
  push();
  translate(-width / 4, -250);
  drawQuads(TRIANGLE_STRIP);
  pop();

  // Test 1: QUADS
  push();
  translate(0, -250);
  drawQuads(QUADS);
  pop();

  // Test 2: QUAD_STRIP
  push();
  translate(width / 4, -250);
  drawQuads(QUAD_STRIP);
  pop();
}

function drawQuads(mode) {
  beginShape(mode);
  for (let y = 0; y <= 500; y += 100) {
    for (const side of [-1, 1]) {
      fill(random(255), random(255), random(255));
      vertex(side * 40, y);
    }
  }
  endShape();
}
