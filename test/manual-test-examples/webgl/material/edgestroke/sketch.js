/**
 * webgl wireframe example
 *
 */

function setup() {
  createCanvas(640, 640, WEBGL);
}


function draw() {
   background(255);
  fill(0);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);
  sphere(150);
  translate(200, 0);
  box(100);
  // translate(150, 10);
}

//
// Issues:
// Lines aren't always expanded correctly; only one of the two triangles is drawn.
// Solution: make sure there are always two triangles generated per line.
