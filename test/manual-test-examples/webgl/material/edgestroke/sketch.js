/**
 * webgl stroking example
 *
 */

function setup() {
  createCanvas(windowWidth, 640, WEBGL);
  setAttributes('antialias', true);
}

function draw() {
  background(100, 100, 240);
  translate(-350, 0, 0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.015);
  noFill();
  stroke(255, 150, 150);
  sphere(150);
  pop();

  translate(350, 0, 0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.015);
  fill(100, 200, 150);
  stroke(200, 200, 255);
  sphere(150);
  pop();

  translate(350, 0, 0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.015);
  noStroke();
  sphere(150);
  pop();
}
