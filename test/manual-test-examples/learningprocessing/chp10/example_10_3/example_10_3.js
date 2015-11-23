// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 10-3: Bouncing ball with intersection

// Two ball variables
var ball1;
var ball2;

function setup(){
  createCanvas(400,400);
  smooth();
  
  // Initialize balls
  ball1 = new Ball(64);
  ball2 = new Ball(32);
};

function draw(){
  background(255);
  // Move and display balls
  ball1.move();
  ball2.move();
  
  if (ball1.intersect(ball2)) { // New! An object can have a function that takes another object as an argument. This is one way to have objects communicate. In this case they are checking to see if they intersect.
    ball1.highlight();
    ball2.highlight();
  }
  
  ball1.display();
  ball2.display();
};
