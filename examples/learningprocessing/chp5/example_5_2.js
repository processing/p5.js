// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 5-2: More conditionals

// Three variables for the background color.
var r = 0;
var b = 0;
var g = 0;

function setup(){
  createCanvas(200,200);
};

function draw(){
  // Color the background and draw lines to divide the window in quadrants.
  background(r,g,b);  
  stroke(0);
  line(width/2,0,width/2,height);
  line(0,height/2,width,height/2);
  
  // If the mouse is on the right hand side of the window, increase red.  
  // Otherwise, it is on the left hand side and decrease red.
  if (mouseX > width/2) {
    r = r + 1; 
  } else {
    r = r - 1;
  }
  
  // If the mouse is on the bottom of the window, increase blue.  
  // Otherwise, it is on the top and decrease blue.
  if (mouseY > height/2) {
    b = b + 1; 
  } else {
    b = b - 1; 
  }
  
  // If the mouse is pressed (using the system variable mousePressed)
  if (isMousePressed()) {
    g = g + 1; 
  } else {
    g = g - 1; 
  }  
  
  // Constrain all color values to between 0 and 255.
  r = constrain(r,0,255);
  g = constrain(g,0,255);
  b = constrain(b,0,255);
};




