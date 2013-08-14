// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 5-5: Button as switch
var button = false;

var x = 50;
var y = 50;
var w = 100;
var h = 75;

var setup = function() {
  createGraphics(200,200); 
};

var draw = function() {
  if (button) {
    background(255);
    stroke(0);
  } else {
    background(0);
    stroke(255);
  }
  
  fill(175);
  rect(x,y,w,h);
};

// When the mouse is pressed, the state of the button is toggled.   
// Try moving this code to draw() like in the rollover example.  What goes wrong?
var mousePressed = function() {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    button = !button;
  }  
};






