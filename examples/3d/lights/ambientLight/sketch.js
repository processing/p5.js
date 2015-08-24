function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);

  camera(0, 0, 400);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);

  ambientLight(150);

  ambientMaterial(250);
  sphere(50, 64);
}