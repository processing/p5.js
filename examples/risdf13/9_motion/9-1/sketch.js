// bouncing ball

var x = 0;
var velocity = 1;

function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(200, 0, 80);

  // Add the current speed to the x location
  x = x + velocity;

  // Remember, || means "or."
  if ((x > width) || (x < 0)) {
    
    // If the object reaches either edge, multiply speed by -1 to turn it around.
    velocity = velocity * -1;
  }

  // Display circle at x location
  fill(175);
  ellipse(x,100,80,80);
};