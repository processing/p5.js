function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);

  camera(0, 0, 400);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);

  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) *2;

  ambientLight(50);
  pointLight(250, 250, 250, -70, 70, 0);
  pointLight(250, 250, 250, locX, locY, 0);

  ambientMaterial(250);
  sphere(50, 64);
}