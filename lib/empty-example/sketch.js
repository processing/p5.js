function setup() {
  // put setup code here
  createCanvas(400, 400, WEBGL);
  background(0);
  colorMode(HSB, 100);
}

function draw() {
  // put drawing code here
  lights();
  
  fill(frameCount % 100, 100, 100);
  stroke(frameCount % 100, 100, 100);
  
  sphere(100);
}