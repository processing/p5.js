/**
 * webgl wireframe example
 *
 */

var switcher = true;

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
  rotateX(frameCount * 0.015);
  rotateY(frameCount *0.015);
  //translate(0,0,-100);
  if(switcher) {
    rotateOnce();
  }
  // rotateZ(frameCount * 0.015);
  fill(255);
  // cylinder(149);
  // sphere(149);
  box(150);
  // box(149);
  // triangle(0,200,200,200,200,0);
  // ellipse(0,0,150,150)
  // rect(0,0,150,150)
  // quad(0,0,0,200,200,200,200,0);
  // cone(101);
  // sphere(150);
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
  // quad(0,0,0,201,201,201,201,0);
  // cone(100);
  // translate(0, 0, -0.2);
  // noFill(0);
  box(150);

  // translate(150, 10);
}

function rotateOnce()
{
    rotateX(100);
    rotateY(100);
    switcher = false;
}

function mousePressed() {
  switcher = !switcher;
}
