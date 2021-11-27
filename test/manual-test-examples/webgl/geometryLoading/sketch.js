let teapot;
let tinted;
let obj;

function preload() {
  tinted = loadModel('../assets/model-bin.stl');
  teapot = loadModel('../assets/teapot-ascii.stl');
  obj = loadModel('../../../unit/assets/teapot.obj');
}

function setup() {
  createCanvas(1000, 500, WEBGL);
  noStroke();
  normalMaterial();
}

function draw() {
  background(200);

  translate(-300, 0, 0);
  push();
  scale(20);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  model(teapot);
  pop();

  translate(300, 0, 0);
  push();
  scale(50);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  model(tinted);
  pop();

  translate(300, 0, 0);
  push();
  scale(40);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  model(obj);
  pop();
}
