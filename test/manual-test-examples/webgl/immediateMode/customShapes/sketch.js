var angle, px, py;

function setup() {
  createCanvas(600, 600, WEBGL);
  setAttributes('antialias', true);
  fill(63, 81, 181);
  strokeWeight(2);
}

function ngon(n, x, y, d) {
  beginShape();
  for (var i = 0; i < n + 1; i++) {
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

function draw() {
  background(250);

  ngon(3, -200, -180, 120);
  ngon(4, -200, 0, 120);
  ngon(5, -200, 180, 120);
  ngon(6, 0, -180, 120);
  ngon(7, 0, 0, 120);
  ngon(8, 0, 180, 120);
  ngon(9, 200, -180, 120);
  ngon(10, 200, 0, 120);
  ngon(11, 200, 180, 120);
}
