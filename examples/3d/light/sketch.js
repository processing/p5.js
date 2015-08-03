function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250);
  translate(0, 0, -800);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  ambientLight(102, 102, 102);
  directionalLight(150, 102, 126, -0.25, -0.25, -1);
  ambientMaterial(100, 120, 120);
  box(60, 60, 60);
}