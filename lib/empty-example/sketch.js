function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(0);
  // translate(width/2, height/2);

  // specularColor(255, 255, 255);
  // directionalLight(127, 127, 127, cos(frameCount * 0.1), 1, -1);

  ambientLight(255, 255, 255);

  fill(0, 0, 255);
  // emissiveMaterial(255, 0, 0);
  // ambientMaterial(0, 0, 255);
  // specularMaterial(0, 0, 255);
  // shininess(32);
  sphere(100);
}


// function setup() {
//   createCanvas(400, 400, WEBGL);
//   noStroke();
// }

// function draw() {
//   background(0);
//   directionalLight(127, 127, 127, cos(frameCount * 0.1), 1, -1);
//   sphere(100);
// }
