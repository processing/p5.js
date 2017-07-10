/**
 * webgl loadPixels() example
 */

function setup() {
  createCanvas(500,500,WEBGL);
}

function draw() {

background(255, 0, 100);
translate(150, 100, 0);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  fill(0,0,250);
  box(75);
  pop();
}

function mousePressed() {
  loadPixels();
}