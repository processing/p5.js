function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw(){
  background(0);

  translate(-width/4, 0, 0);

  ambientLight(50);
  pointLight(250, 250, 250, -70, 70, 0);

  basicMaterial(250);
  sphere();

  translate(250, 0, 0);

  normalMaterial(250);
  sphere();
  
  translate(250, 0, 0);

  ambientMaterial(250);
  sphere(50, 128);
  
  translate(250, 0, 0);

  specularMaterial(250);
  sphere(50, 128);
}