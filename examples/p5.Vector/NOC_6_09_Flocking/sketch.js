// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

var flock;

var text;

function setup() {
  text = createP("Drag the mouse to generate new boids.");
  text.position(10,365);

  createCanvas(640,360);
  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 125; i++) {
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
}

function draw() {
  background(51);
  flock.run();
  
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}

