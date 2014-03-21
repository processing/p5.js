// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 7-4: Using a function that returns a value, distance

function setup(){
  createCanvas(200,200);
};

function draw(){
  background(0);
  stroke(0);
  // Top left square
  fill(distance(0,0,mouseX,mouseY)); // Our distance function is used to calculate a brightness value for each quadrant. 
                                     // We could use the built-in function dist() instead, but we are learning how to write our own functions.
  rect(0,0,width/2 - 1,height/2 - 1);
  // Top right square
  fill(distance(width,0,mouseX,mouseY));
  rect(width/2,0,width/2 - 1,height/2 - 1);
  // Bottom left square
  fill(distance(0,height,mouseX,mouseY));
  rect(0,height/2,width/2 - 1,height/2 - 1);
  // Bottom right square
  fill(distance(width,height,mouseX,mouseY));
  rect(width/2,height/2,width/2 - 1,height/2 - 1);
};

var distance = function(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  var d = sqrt(dx*dx + dy*dy);
  return d;
};