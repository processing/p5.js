let teapot;

function preload() {
  teapot = loadModel('./teapot-ascii.stl');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(200);
  scale(20);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  normalMaterial();
  model(teapot);
}
