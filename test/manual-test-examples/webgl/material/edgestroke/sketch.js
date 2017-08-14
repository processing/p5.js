/**
 * webgl wireframe example
 *
 */

function setup() {
  createCanvas(300, 300, WEBGL);
}


function draw() {
   background(255);
  fill(0);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);
  box(150);
}
