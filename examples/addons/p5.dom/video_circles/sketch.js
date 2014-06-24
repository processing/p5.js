var fingers;

function setup() {
  createCanvas(320, 240);
  fingers = createVideo("fingers.mov", "fingers.webm");
  fingers.play();
  fingers.loop();
  fingers.hide();
  noStroke();
  fill(0);
}

function draw() {
  video(fingers, 0, 0, 320, 240);
  loadPixels();
  background(255);
  var stepSize = round(constrain(mouseX / 8, 6, 32));
  for (var y=0; y<height; y+=stepSize) {
    for (var x=0; x<width; x+=stepSize) {
      var i = y * width + x;
      var darkness = (255 - pixels[i][0]) / 255;
      var radius = stepSize * darkness;
      ellipse(x, y, radius, radius);
    }
  }
}