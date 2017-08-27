/**
 * webgl wireframe example
 *
 */

var switcher = false;

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

  //translate(0,0,-100);
  if(switcher) {
    rotateX(frameCount * 0.005);
    rotateY(frameCount * 0.015);
  }
  // rotateZ(frameCount * 0.015);
  fill(255);
  // cylinder(149);
  // sphere(149);
  // plane(149);
  // box(149);
  // triangle(0,200,200,200,200,0);
  // ellipse(0,0,150,150)
  // rect(0,0,150,150)
  quad(0,0,0,200,200,200,200,0);
  //cone(101);
  //sphere(150);
  stroke(0);
  //translate(0, 0, 0.1);
  noFill(0);
  // cylinder(150);
  // sphere(150);
  // plane(150);
  // box(150);
  // triangle(0,201,201,201,201,0);
  // ellipse(0,0,151,151)
  // rect(0,0,151,151)
  quad(0,0,0,201,201,201,201,0);
  //cone(100);
  // translate(0, 0, -0.2);
  // noFill(0);
  // plane(174);

  // translate(150, 10);
}

function mousePressed() {
  switcher = !switcher;
}
