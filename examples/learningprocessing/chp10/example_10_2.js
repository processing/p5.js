// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-2: Bouncing ball class

// Two ball variables
var ball1;
var ball2;

var setup = function() {
  createGraphics(400,400);
  smooth();
  
  // Initialize balls
  ball1 = new Ball(64);
  ball2 = new Ball(32);
};

var draw = function() {
  background(255);
  
  // Move and display balls
  ball1.move();
  ball2.move();
  ball1.display();
  ball2.display();
};



// Ball class
// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 10-2: Bouncing ball class

function Ball(tempR) {

  this.r = tempR;
  this.x = random(width);
  this.y = random(height);
  this.xspeed = random( - 5,5);
  this.yspeed = random( - 5,5);
}

Ball.prototype.move = function() {
  this.x += this.xspeed; // Increment x
  this.y += this.yspeed; // Increment y
  
  // Check horizontal edges
  if (this.x > width || this.x < 0) {
    this.xspeed *= - 1;
  }
  //Check vertical edges
  if (this.y > height || this.y < 0) {
    this.yspeed *= - 1;
  }
};

// Draw the ball
Ball.prototype.display = function() {
  stroke(0);
  fill(0,50);
  ellipse(this.x, this.y, this.r*2, this.r*2);
};

