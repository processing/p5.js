/**
 * webgl texture mode example
 */
var img;
var theta = 0;

function preload() {
  img = loadImage('assets/UV_Grid_Sm.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(220);
  noStroke();

  texture(img);

  push();
  translate(-200, 0, 0);
  textureMode(NORMAL);
  beginShape();
  vertex(-100, -100, 0, 0);
  vertex(100, -100, 1, 0);
  vertex(100, 100, 1, 1);
  vertex(-100, 100, 0, 1);
  endShape();
  pop();

  push();
  translate(200, 0, 0);
  textureMode(IMAGE);
  beginShape();
  vertex(-100, -100, 0, 0);
  vertex(100, -100, img.width, 0);
  vertex(100, 100, img.width, img.height);
  vertex(-100, 100, 0, img.height);
  endShape();
  pop();
}
