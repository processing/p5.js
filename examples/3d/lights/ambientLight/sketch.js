function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(0);

  ambientLight(150);

  ambientMaterial(250);
  sphere(50, 64);
}