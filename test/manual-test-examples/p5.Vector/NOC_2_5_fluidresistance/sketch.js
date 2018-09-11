// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Forces (Gravity and Fluid Resistence) with Vectors

// Demonstration of multiple force acting on bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"

// Five moving bodies
const movers = [];

// Liquid
let liquid;

function setup() {
  // Must be before createGraphics
  const text = createP('click mouse to reset');

  createCanvas(640, 360);
  reset();
  // Create liquid object
  liquid = new Liquid(0, height / 2, width, height / 2, 0.1);

  // Here we call methods of each element to set the position and id, try changing these values.
  text.position(10, 365);
}

function draw() {
  background(127);

  // Draw water
  liquid.display();

  for (let i = 0; i < movers.length; i++) {
    // Is the Mover in the liquid?
    if (liquid.contains(movers[i])) {
      // Calculate drag force
      const dragForce = liquid.calculateDrag(movers[i]);
      // Apply drag force to Mover
      movers[i].applyForce(dragForce);
    }

    // Gravity is scaled by mass here!
    const gravity = createVector(0, 0.1 * movers[i].mass);
    // Apply gravity
    movers[i].applyForce(gravity);

    // Update and display
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
}

// Not working???
function mousePressed() {
  reset();
}

// Restart all the Mover objects randomly
function reset() {
  for (let i = 0; i < 9; i++) {
    movers[i] = new Mover(random(0.5, 3), 40 + i * 70, 0);
  }
}
