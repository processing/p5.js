// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 5-7: "Bouncing" color

// Two variables for color.
var c1 = 0;      
var c2 = 255;    

// Start by incrementing c1.
var c1dir = 0.1;  
// Start by decrementing c2.
var c2dir = -0.1; 

function setup(){
  createCanvas(200,200);
};

function draw(){
  noStroke();
  
  // Draw rectangle on left
  fill(c1,0,c2);
  rect(0,0,100,200);

  // Draw rectangle of right
  fill(c2,0,c1);
  rect(100,0,100,200);

  // Adjust color values
  c1 = c1 + c1dir;
  c2 = c2 + c2dir;
  
  // Instead of reaching the edge of a window, these variables reach the "edge" of color:  
  // 0 for no color and 255 for full color.  
  // When this happens, just like with the bouncing ball, the direction is reversed.

  // Reverse direction of color change 
  if (c1 < 0 || c1 > 255) {
    c1dir *= -1;
  }

  if (c2 < 0 || c2 > 255) {
    c2dir *= -1;
  }
};







