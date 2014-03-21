// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 6-9: Simple while loop with interactivity

function setup(){
  createCanvas(255,255);
};

function draw(){
  background(0);

  // Start with i as 0
  var i = 0;

  // While i is less than the width of the window
  while (i < width) {
    noStroke();
    // The distance between the current rectangle and the mouse is equal to the absolute value of the difference between i and mouseX.
    var distance = abs(mouseX - i); 
    // That distance is used to fill the color of a rectangle at horizontal location i.
    fill(distance);
    rect(i,0,10,height);
    // Increase i by 10
    i += 10;
  }
};