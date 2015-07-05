function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
  perspective(60 / 180 * Math.PI, windowWidth / windowHeight , 0.1, 100);
}

var theta = 0;

function draw(){
  background(0, 100, 200, 255);



  translate(-125, 0, -150);
  push();
  rotateZ(theta);
  rotateX(theta * 1.5);
  rotateY(theta * 0.5);
  plane(100,100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta);
  rotateX(theta * 1.5);
  rotateY(theta * 0.5);
  box(100,100,100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta);
  rotateX(theta);
  cylinder(100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta);
  rotateX(theta);
  cone(100, 100, 100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta);
  rotateX(theta);
  torus(100);
  pop();
  translate(50, 0, 0);
  push();
  rotateZ(theta);
  rotateX(theta);
  sphere(100, 100);
  pop();
  theta += 0.05;
}