// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {
  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }
  run() {
    for (var i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }
  addBoid(b) {
    this.boids.push(b);
  }
}
