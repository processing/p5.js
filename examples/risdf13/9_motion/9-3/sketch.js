// bouncing size

var diameter = 0;
var velocity = 1;

function setup() {
  createCanvas(600, 400);
  noStroke();
};

function draw() {
  background(255);

  // Add the current speed to the x location
  diameter = diameter + velocity;

  // Remember, || means "or."
  if ((diameter > height/2) || (diameter < 0)) {
    
    // If the object reaches either edge, multiply speed by -1 to turn it around.
    velocity = velocity * -1;
  }

  // Display circle with diameter
  fill(255, 0, 0);
  ellipse(width/2,height/2,diameter, diameter);
};