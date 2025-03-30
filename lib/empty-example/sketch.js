// Click on the canvas to begin detecting key presses.

let value = 0;

function setup() {
  createCanvas(100, 100);

  describe(
    'A gray square with a black square at its center. The inner square turns white when the user presses and releases the left arrow key. It turns black when the user presses and releases the right arrow key.'
  );
}

function draw() {
  background(200);

  // Style the square.
  fill(value);

  // Draw the square.
  square(25, 25, 50);
}

// Toggle the background color when the user releases an arrow key.
function keyReleased() {
  if (keyCode === 37) {
    value = 255;
  } else if (keyCode === 39) {
    value = 0;
  }
  // Uncomment to prevent any default behavior.
  // return false;
}