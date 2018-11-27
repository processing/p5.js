function setup() {
  createCanvas(480, 480);
}

function draw() {
  background(255);

  if (keyIsPressed) {
    if (keyCode === UP_ARROW) {
      background(255, 0, 0); // red
    }
    if (keyCode === RIGHT_ARROW) {
      background(255, 255, 0); // yellow
    }
    if (keyCode === DOWN_ARROW) {
      background(0, 255, 0); // green
    }
    if (keyCode === LEFT_ARROW) {
      background(0, 0, 255); // blue
    }
  }
}
