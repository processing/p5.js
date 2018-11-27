/**
 * webgl wireframe example
 *
 */

var teapot;

function preload() {
  teapot = loadModel('../wireframe/assets/teapot.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);
  push();
  stroke(100, 100, 200);
  noFill();
  scale(2, 2, 2);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  model(teapot);
  pop();

  for (var i = -10; i < 10; i++) {
    push();
    stroke(0, 200, 0);
    noFill();
    translate(i * 140, -200, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    torus(40);
    pop();

    push();
    stroke(0, 200, 100);
    translate(i * 140, -100, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40);
    pop();

    push();
    fill(0, 0, 200);
    translate(i * 140, 200, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40);
    pop();

    push();
    translate(i * 140, 100, 100);
    fill(100, 200, 100);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    box(40);
    pop();
  }
}
