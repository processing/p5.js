// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Ported by Lauren McCarthy

// Example 9-10: Interactive stripes

// An array of stripes
var stripes = [];

function setup(){
  createCanvas(200,200);
  
  // Initialize all Stripe objects
  for (var i = 0; i < 10; i ++ ) {
    stripes[i] = new Stripe();
  }
}

function draw(){
  
  background(100);
  // Move and display all Stripe objects
  for (var i = 0; i < stripes.length; i ++ ) {
    // Check if mouse is over the Stripe
    stripes[i].rollover(mouseX,mouseY); // Passing the mouse coordinates into an object.
    stripes[i].move();
    stripes[i].display();
  }
}



function Stripe() {
  // All stripes start at 0
  this.x = 0; // horizontal location of stripe
  // All stripes have a random positive speed
  this.speed = random(1); // speed of stripe
  this.w = random(10,30); // width of stripe
  // A boolean variable keeps track of the object's state.
  this.mouse = false; // state of stripe (mouse is over or not?)
}

// Draw stripe
Stripe.prototype.display = function() {
  
  // Boolean variable determines Stripe color.
  if (this.mouse) { 
    fill(255);
  } else {
    fill(255,100);
  }
  
  noStroke();
  rect(this.x, 0, this.w, height);
};

// Move stripe
Stripe.prototype.move = function() {
  this.x += this.speed;
  if (this.x > width + 20) this.x = -20;
};

// Check to see if point (mx,my) is inside the Stripe.
Stripe.prototype.rollover = function(mx, my) { 
  // Left edge is x, Right edge is x + w
  if (mx > this.x && mx < this.x + this.w) {
    this.mouse = true;
  } else {
    this.mouse = false;
  }
};