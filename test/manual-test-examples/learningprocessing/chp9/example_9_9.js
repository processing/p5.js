// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-9: An array of Car objects

var cars = []; // An array for Car objects

function setup(){
  createCanvas(200,200);
  smooth();
  for (var i = 0; i < 100; i++ ) { // Initialize each Car using a for loop.
    cars[i] = new Car(i*2,0,i*2,i/20.0); 
  }
}

function draw(){
  background(255);
  for (var i = 0; i < cars.length; i++ ) { // Run each Car using a for loop.
    cars[i].move();
    cars[i].display();
  }
}


// The Car class does not change whether we are making one car, 100 cars or 1,000 cars!
function Car(c, xpos, ypos, xspeed) { 
  this.c = c;
  this.xpos = xpos;
  this.ypos = ypos;
  this.xspeed = xspeed;
}

Car.prototype.display = function() {
  rectMode(CENTER);
  stroke(0);
  fill(this.c);
  rect(this.xpos,this.ypos,20,10);
};

Car.prototype.move = function() {
  this.xpos = this.xpos + this.xspeed;
  if (this.xpos > width) {
    this.xpos = 0;
  }
};
