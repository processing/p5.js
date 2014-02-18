// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 8-2: Two Car objects

var myCar0;
var myCar1; // Two objects!

function setup() {
  createCanvas(600,400);
  myCar0 = new Car(50,0,100,2); // Parameters go inside the parentheses when the object is constructed.
  myCar1 = new Car(200,0,200,1);
};

function draw() {
  background(39, 120, 255);
  myCar0.move();
  myCar0.display();
  myCar1.move();
  myCar1.display();
};

function Car(tempC, tempXpos, tempYpos, tempXspeed) { // Even though there are multiple objects, we still only need one class. No matter how many cookies we make, only one cookie cutter is needed.Isn’t object-oriented programming swell?
  this.c = tempC;
  this.xpos = tempXpos;
  this.ypos = tempYpos;
  this.xspeed = tempXspeed;
}

Car.prototype.display = function() {
  stroke(0);
  fill(this.c);
  rectMode(CENTER);
  rect(this.xpos,this.ypos,50,20);
};

Car.prototype.move = function() {
  this.xpos = this.xpos + this.xspeed;
  if (this.xpos > width + 25) {
    this.xpos = -25;
  }
};