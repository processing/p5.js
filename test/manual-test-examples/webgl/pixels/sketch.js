/**
 * webgl loadPixels() and get() example
 */

var c;

function setup() {
  createCanvas(500,500,WEBGL);
}

function draw() {
  pointLight(200,200,200,0,0,0);
  background(255, 0, 100);
  translate(150, 100, 0);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  fill(0,0,250);
  if(c)
  {
    texture(c);
  }
  box(75);
  pop();
}

function mousePressed() {
  c = get();
}