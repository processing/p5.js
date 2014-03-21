// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-12: 200 Zoog objects in an array

// The only difference between this example and the previous chapter (Example 8-3) 
// is the use of an array for multiple Zoog objects.
var zoogies = [];

function setup(){
  createCanvas(400,400);
  smooth();
  for (var i = 0; i < 200; i ++ ) {
    zoogies[i] = new Zoog(random(width),random(height),30,30,8);
  }
}

function draw(){
  background(255); // Draw a black background
  for (var i = 0; i < zoogies.length; i ++ ) {
    zoogies[i].display();
    zoogies[i].jiggle();
  }
}


function Zoog(tempX, tempY, tempW, tempH, tempEyeSize) {
  // Zoog's variables
  this.x = tempX;
  this.y = tempY;
  this.w = tempW;
  this.h = tempH;
  this.eyeSize = tempEyeSize;
}

// Move Zoog
Zoog.prototype.jiggle = function() { // For simplicity we have also removed the “speed” argument from the jiggle() function. Try adding it back in as an exercise.
  // Change the location
  this.x = this.x + random(-1,1);
  this.y = this.y + random(-1,1);
  // Constrain Zoog to window
  this.x = constrain(this.x,0,width);
  this.y = constrain(this.y,0,height);
};

// Display Zoog
Zoog.prototype.display = function() {
  // Set ellipses and rects to CENTER mode
  ellipseMode(CENTER);
  rectMode(CENTER);  
  // Draw Zoog's arms with a for loop
  for (var i = this.y-this.h/3; i < this.y + this.h/2; i += 10) {
    stroke(0);
    line(this.x-this.w/4, i, this.x + this.w/4, i);
  }
  // Draw Zoog's body
  stroke(0);
  fill(175);
  rect(this.x, this.y, this.w/6, this.h);
  // Draw Zoog's head
  stroke(0);
  fill(255);
  ellipse(this.x, this.y - this.h, this.w, this.h);
  // Draw Zoog's eyes
  fill(0);
  ellipse(this.x - this.w/3, this.y - this.h, this.eyeSize, this.eyeSize*2);
  ellipse(this.x + this.w/3, this.y - this.h, this.eyeSize, this.eyeSize*2);
  // Draw Zoog's legs
  stroke(0);
  line(this.x - this.w/12, this.y + this.h/2, this.x-this.w/4, this.y + this.h/2 + 10);
  line(this.x + this.w/12, this.y + this.h/2, this.x + this.w/4, this.y + this.h/2 + 10);
};
