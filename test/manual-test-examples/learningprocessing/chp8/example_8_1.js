// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 8-1: A Car class and a Car object

var myCar; // Declare car object as a globle variable.

function setup(){
  createCanvas(200,200);
  // Initialize Car object
  myCar = new Car(); // Initialize car object in setup() by calling constructor.
};

function draw(){
  background(255);
  // Operate Car object.
  myCar.move(); // Operate the car object in draw( ) by calling object methods using the dots syntax.
  myCar.display();
};

 // Define a class below the rest of the program.
function Car() {
  this.c = 175;
  this.xpos = width/2;
  this.ypos = height/2;
  this.xspeed = 1;
}

Car.prototype.display = function() { // Function.
  // The car is just a square
  rectMode(CENTER);
  stroke(0);
  fill(this.c);
  rect(this.xpos,this.ypos,20,10);
};

Car.prototype.move = function() { // Function.
  this.xpos = this.xpos + this.xspeed;
  if (this.xpos > width) {
    this.xpos = 0;
  }
};