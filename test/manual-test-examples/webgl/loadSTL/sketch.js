let teapot;
let colored;

function preload() {
  colored = loadModel('../assets/model-bin.stl');
  teapot = loadModel('../assets/teapot-ascii.stl');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(200);

  push();
  translate(-300, 0, 0);
  scale(15);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  normalMaterial();
  model(teapot);
  pop();

  push();
  translate(300, 0, 0);
  scale(90);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  normalMaterial();
  model(colored);
  pop();
}
