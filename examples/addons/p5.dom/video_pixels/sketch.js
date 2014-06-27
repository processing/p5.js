var fingers;

function setup() {
  createCanvas(220, 220);
  fingers = createVideo("fingers.mov");
  fingers.play();
  fingers.loop();
  fingers.hide();
}

function draw() {
  background(150);
  fingers.loadPixels();
  for (var i=0; i<fingers.pixels.length/2; i++) {
    fingers.pixels[i][3] = random(255);
  }
  fingers.updatePixels();
  video(fingers,10,10, 200, 200);
}