var img;
var sz = 100;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  img = loadImage("assets/UV_Grid_Sm.jpg");
  sz = .25 * min(width, height);
}

function draw(){
  background(255);

  randomSeed(1);

  texture(img);
  rotateZ(random(0, 2 * PI) + frameCount * 0.01);
  beginShape(TRIANGLES);
  vertex(-sz, -sz, 0, 0, 0);
  vertex( sz, -sz, 0, 1, 0);
  vertex( sz,  sz, 0, 1, 1);
  vertex( sz,  sz, 0, 1, 1);
  vertex(-sz,  sz, 0, 0, 1);
  vertex(-sz, -sz, 0, 0, 0);
  endShape();
}