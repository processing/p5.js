// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 4-5: Using system variables
var setup = function() {
  createGraphics(200,200);
  smooth();
}

var draw = function() {
  background(100);
  stroke(255);
  // frameCount is used to color a rectangle.
  fill(frameCount / 2);
  rectMode(CENTER);
  // The rectangle will always be in the middle of the window 
  // if it is located at (width/2, height/2).
  rect(width/2,height/2,mouseX+10,mouseY+10);
}

var keyPressed = function() {
  println(key);
}
