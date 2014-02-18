// bouncing color

var r = 0;
var velocity = 1;

function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(255);

  // Add the current speed to the x location
  r = r + velocity;

  // Remember, || means "or."
  if ((r > 256) || (r < 0)) {
    
    // If the object reaches either edge, multiply speed by -1 to turn it around.
    velocity = velocity * -1;
  }

  // Display circle with r value
  fill(r, 0, 0);

  // Try using r as alpha value
  fill(255, 0, 0, r);
  ellipse(width/2,height/2,80,80);
};