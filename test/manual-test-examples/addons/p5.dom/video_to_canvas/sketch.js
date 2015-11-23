var fingers;

function setup() {
  createCanvas(400, 400);
  fingers = createVideo("../fingers.mov");
  fingers.loop();
  fingers.hide();
}

function draw() {
  background(150);
  image(fingers,10,10);
}