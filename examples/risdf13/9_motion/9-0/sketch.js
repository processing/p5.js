// looping ball

var x = 0;
var velocity = 10;

function setup() {
  createCanvas(600, 400);
  noStroke();
  
  // try changing the frame rate
  // setFrameRate(1);
};

function draw() {
  background(200, 0, 80);

  // Add the current speed to the x location
  x = x + velocity;

  // Remember, || means "or."
  if (x > width) {
    
    // If the object reaches the right edge, place it back on the left.
    x = 0;
  }

  // Display circle at x location
  fill(175);
  ellipse(x,100,80, 80);
};