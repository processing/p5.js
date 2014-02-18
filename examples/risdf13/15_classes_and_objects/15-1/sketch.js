// Getting Started with Processing
// Casey Reas

// Adapted by Lauren McCarthy

function JitterBug(tempX, tempY, tempDiameter) {
  this.x = tempX;
  this.y = tempY;
  this.diameter = tempDiameter;
  this.speed = 0.5;
}

JitterBug.prototype.move = function() {
  this.x += random(-this.speed, this.speed);
  this.y += random(-this.speed, this.speed);
};

JitterBug.prototype.display = function() {
  ellipse(this.x, this.y, this.diameter, this.diameter);
};

var bug, jit;  // Declare object

function setup() {
  createCanvas(600, 400);
  background(50, 89, 100);

  // Create object and pass in parameters
  bug = new JitterBug(width/2, height/2, 20);
  jit = new JitterBug(20, 20, 20);
};

function draw() {
  bug.move();
  bug.display();
  jit.move();
  jit.display();
};