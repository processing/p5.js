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
  push();
  //translate(0,0,-500);
   rotateX(frameCount * 0.005);
   rotateY(frameCount * 0.015);
  // rotateZ(frameCount * 0.015);
  fill(255);
  rect(0,0,174,175);
  //cone(101);
  //sphere(150);
  stroke(0);
  //translate(0, 0, 0.1);
  noFill(0);
  rect(0,0,174,174);
  //cone(100);
  pop();
  // translate(0, 0, -0.2);
  // noFill(0);
  // plane(174);

  // translate(150, 10);
}

//
// Issues:
// Lines aren't always expanded correctly; only one of the two triangles is drawn.
// Solution: make sure there are always two triangles generated per line.
//dirAdd,dirSub,dirAdd,dirSub,dirSub,dirAdd