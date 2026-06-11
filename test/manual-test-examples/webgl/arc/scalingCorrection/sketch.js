var a, b;
var w, h;
var theta = 0;
var phi = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  setAttributes('antialias', true);
  strokeWeight(2);
}

function draw() {
  background(230);

  // Draws dividers between rotating quadrants.
  stroke(237, 34, 93);
  a = 425 * cos(theta);
  b = 425 * sin(theta);
  line(-a, -b, a, b);
  line(-b, a, b, -a);

  // Should draw a growing/shrinking ellipse with alternating colour in
  // each quadrant.
  w = 300 + 250 * cos(phi);
  h = 300 + 250 * sin(phi);
  noStroke();
  fill(255);
  arc(0, 0, w, h, theta, theta + PI / 2);
  arc(0, 0, w, h, theta + PI, theta + 3 * PI / 2);
  fill(200);
  arc(0, 0, w, h, theta + PI / 2, theta + PI);
  arc(0, 0, w, h, theta + 3 * PI / 2, theta);

  theta += 0.01;
  phi += 0.0123;
}
