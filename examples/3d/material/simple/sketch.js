function setup(){
  createCanvas(windowWidth, windowHeight, 'webgl');
}

function draw(){
  background(0);

  camera(width/4, 0, 600);
  perspective(60 / 180 * Math.PI, width/height, 0.1, 100);

  ambientLight(50);
  pointLight(250, 250, 250, -70, 70, 0);

  basicMaterial(250);
  sphere();

  translate(250, 0, 0);

  normalMaterial(250);
  sphere();
  
  translate(250, 0, 0);

  ambientMaterial(250);
  sphere();
  
  translate(250, 0, 0);

  specularMaterial(250);
  sphere(50, 64);
}