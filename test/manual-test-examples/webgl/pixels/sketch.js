/**
 * webgl loadPixels() and get() example
 */

var c;
var currentBackground = [255, 0, 100];

function setup() {
  createCanvas(500, 500, WEBGL);
}

function draw() {
  background(currentBackground);
  translate(150, 100, 0);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  fill(0, 0, 250);
  if (c) {
    texture(c);
  }
  box(75);
  pop();
}

function mousePressed() {
  c = get();
  currentBackground = [random(0, 255), random(0, 255), random(0, 255)];
}
