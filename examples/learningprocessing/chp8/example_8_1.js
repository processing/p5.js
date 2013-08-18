// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 8-1: A Car class and a Car object

var myCar; // Declare car object as a globle variable.

var setup = function() {
  createGraphics(200,200);
  // Initialize Car object
  myCar = new Car(); // Initialize car object in setup() by calling constructor.
}

var draw = function() {
  background(255);
  // Operate Car object.
  myCar.move(); // Operate the car object in draw( ) by calling object methods using the dots syntax.
  myCar.display();
}

var Car = { // Define a class below the rest of the program.
  var c; // Variables.
  var xpos;
  var ypos;
  var xspeed;

  Car() { // A constructor.
    c = color(175);
    xpos = width/2;
    ypos = height/2;
    xspeed = 1;
  }

  var display = function() { // Function.
    // The car is just a square
    rectMode(CENTER);
    stroke(0);
    fill(c);
    rect(xpos,ypos,20,10);
  }

  var move = function() { // Function.
    xpos = xpos + xspeed;
    if (xpos > width) {
      xpos = 0;
    }
  }
}