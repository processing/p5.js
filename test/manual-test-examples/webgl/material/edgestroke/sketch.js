/**
 * webgl wireframe example
 *
 */

function setup() {
  createCanvas(640, 640, WEBGL);
  setAttributes('antialias', true);
}


function draw() {
   background(100,100,240);

  //  stroke(0);
  //fill(0);
  stroke(0);
  //rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.015);
  fill(255);
  plane(175);
  //sphere(150);
  stroke(0);
  translate(0, 0, 0.1);
  noFill(0);
  plane(174);

  translate(0, 0, -0.2);
  noFill(0);
  plane(174);

  // translate(150, 10);
}

//
// Issues:
// Lines aren't always expanded correctly; only one of the two triangles is drawn.
// Solution: make sure there are always two triangles generated per line.
