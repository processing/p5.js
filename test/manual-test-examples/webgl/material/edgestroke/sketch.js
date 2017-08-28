/**
 * webgl wireframe example
 *
 */
var img;
var switcher = true;

function setup() {
  createCanvas(windowWidth, 640, WEBGL);
  setAttributes('antialias', true);
  img = loadImage('../../assets/cat.jpg')
}


function draw() {
  background(100,100,240);
  //  pointLight(100, 100, 100);
  // //  stroke(0);
  // //fill(0);
  // stroke(255,255,255,100);

  translate(-350,0,0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount *0.015);
  noFill();
  stroke(255,150,150);
  sphere(150);
  pop();

  translate(350,0,0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount *0.015);
  fill(100,200,150);
  stroke(200,200,255);
  sphere(150);
  pop();

  translate(350,0,0);
  push();
  rotateX(frameCount * 0.015);
  rotateY(frameCount *0.015);
  noStroke();
  sphere(150);
  pop();

  // translate(150, 10);
}
