function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);
  translate(0, 0, -400);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  ambientLight(100, 102, 2);
  directionalLight(150, 100, 126, 0.25, 0.25, 0.25);
  ambientMaterial(250);
  translate(-100,0,0);
  box(60, 60, 60);
  translate(300,0,0);
  ambientMaterial(250, 100, 250);
  sphere(60);
}