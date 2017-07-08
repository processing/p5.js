/**
 * webgl wireframe example
 *
 */
function setup() {
  createCanvas(600, 400, WEBGL);
}

function draw() {
  background(0);

  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) *2;

  ambientLight(100, 80, 80);
  pointLight(200, 200, 200, locX, locY, 0);

  push();
  stroke(0,200,0);
  noFill();
  translate(-150, -100, 0);
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(75);
  pop();

  translate(150, 100, 0);
  push();
  rotateZ(frameCount * 0.02);
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.02);
  fill(0,0,250);
  box(75);
  pop();
}