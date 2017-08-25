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
   ambientLight(100, 100, 100);
  //  stroke(0);
  //fill(0);
  stroke(0);
  push();
  //translate(0,0,-500);
   rotateX(frameCount * 0.005);
   rotateY(frameCount * 0.015);
  // rotateZ(frameCount * 0.015);
  fill(255);
  sphere(149);
  //cone(101);
  //sphere(150);
  stroke(0);
  //translate(0, 0, 0.1);
  noFill(0);
  sphere(150);
  //cone(100);
  pop();
  // translate(0, 0, -0.2);
  // noFill(0);
  // plane(174);

  // translate(150, 10);
}
