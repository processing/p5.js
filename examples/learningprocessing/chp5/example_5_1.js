// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 5-1: Conditionals

// Variables
var r = 150;
var g = 0;
var b = 0;

function setup(){
  createCanvas(200,200);
};

function draw(){
  // Draw stuff
  background(r,g,b);  
  stroke(255);
  line(width/2,0,width/2,height);


  // If the mouse is on the right side of the screen is equivalent to 
  // "if mouseX is greater than width divided by 2."
  if(mouseX > width/2) {
    r = r + 1; 
  } else {
    r = r - 1;
  }

  // If r is greater than 255, set it back to 255.  
  // If r is less than 0, set it back to 0.
  if (r > 255) {
    r = 255; 
  } else if (r < 0) {
    r = 0; 
  }
};


