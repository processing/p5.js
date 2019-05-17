let teapot;

function preload() {
  teapot = loadModel('./colored.stl');
}

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(200);
  scale(100);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  normalMaterial();
  model(teapot);
}
