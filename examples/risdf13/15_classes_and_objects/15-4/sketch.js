// Array of objects

// Ported by Lauren McCarthy

// Example 8-3
var cars = [];

function setup() {
  createCanvas(600,400);

  for (var i=0; i<10; i++) {
    cars[i] = new Car(random(255), random(width), random(height), random(10));
  }
};

function draw() {
  background(220, 100, 190);
  for (var i=0; i<cars.length; i++) {
    cars[i].move();
    cars[i].display();
  }
};

// Car class
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