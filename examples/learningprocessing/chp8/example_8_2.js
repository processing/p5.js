// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 8-2: Two Car objects

var myCar1;
var myCar2; // Two objects!

function setup(){
  createCanvas(200,200);
  myCar1 = new Car([255,0,0],0,100,2); // Parameters go inside the parentheses when the object is constructed.
  myCar2 = new Car([0,0,255],0,10,1);
}

function draw(){
  background(255);
  myCar1.move();
  myCar1.display();
  myCar2.move();
  myCar2.display();
}

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
  rect(this.xpos,this.ypos,20,10);
};

Car.prototype.move = function() {
  this.xpos = this.xpos + this.xspeed;
  if (this.xpos > width) {
    this.xpos = 0;
  }
};