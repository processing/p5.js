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
  video(fingers,10,10, 200, 200);
  loadPixels();
  for (var i=0; i<pixels.length; i++) {
    pixels[i][3] = random(255);
  }
  updatePixels();
}