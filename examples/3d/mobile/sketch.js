function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(250, 250, 250, 255);
  camera(0, 0, 400);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);
  normalMaterial();
  rotateX(accelerationX * 0.01);
  rotateY(accelerationY * 0.01);
  box(60, 60, 60); 
}