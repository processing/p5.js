/**
 * webgl wireframe example
 *
 */
function setup() {
  createCanvas(600, 400, WEBGL);
}

function draw() {
  background(100);

  push();
  noFill();
  translate(-150, -100, 0);
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(70);
  pop();

  push();
  fill(0,0,200);
  translate(150, 100, 0);
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(70);
  pop();
}