function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(0);

  var locY = (mouseY / height - 0.5) * (-2);
  var locX = (mouseX / width - 0.5) *2;

  ambientLight(50);
  pointLight(250, 250, 250, locX, locY, 0);

  ambientMaterial(250);
  sphere(50, 64);
}