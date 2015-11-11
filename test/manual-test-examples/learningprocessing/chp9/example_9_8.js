// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-8: A snake following the mouse

// Declare two arrays.
var xpos = []; 
var ypos = [];

function setup(){
  createCanvas(200,200);
  
  smooth();
  // Initialize all elements of each array to zero.
  for (var i = 0; i < 50; i ++ ) {
    xpos[i] = 0; 
    ypos[i] = 0;
  }
}

function draw(){
  background(255);
  
  // Shift array values
  for (var i = 0; i < xpos.length-1; i ++ ) {
    // Shift all elements down one spot. 
    // xpos[0] = xpos[1], xpos[1] = xpos = [2], and so on. Stop at the second to last element.
    xpos[i] = xpos[i+1];
    ypos[i] = ypos[i+1];
  }
  
  // New location
  xpos[xpos.length-1] = mouseX; // Update the last spot in the array with the mouse location.
  ypos[ypos.length-1] = mouseY;
  
  // Draw everything
  for (var i = 0; i < xpos.length; i ++ ) {
     // Draw an ellipse for each element in the arrays. 
     // Color and size are tied to the loop's counter: i.
    noStroke();
    fill(255-i*5);
    ellipse(xpos[i],ypos[i],i,i);
  }
}