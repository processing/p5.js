function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fill(255);
  textSize(20);
  text("Press any arrow key and check console for warning", 40, height / 2);
}

function draw() {
  if (typeof keyCode === 'undefined') return; // avoid error before first key press

  if (keyCode === LEFT_ARROW) {
    background(255, 0, 0);
  } else if (keyCode === RIGHT_ARROW) {
    background(0, 255, 0);
  } else if (keyCode === UP_ARROW) {
    background(0, 0, 255);
  } else if (keyCode === DOWN_ARROW) {
    background(255, 255, 0);
  }
}

