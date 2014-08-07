var fingers;

function setup() {
  createCanvas(400, 400);
  fingers = createVideo("../fingers.mov");
  fingers.loop();
  fingers.hide();
}

function draw() {
  background(150);
  
  fingers.loadPixels();
  for (var i=0; i<fingers.pixels.length/2; i++) {
    fingers.pixels[i] = random(255);
  }
  fingers.updatePixels();

  image(fingers,10,10);
}