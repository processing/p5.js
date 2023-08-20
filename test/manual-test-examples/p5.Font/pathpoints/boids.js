// adapted from Shiffman's The Nature of Code
// http://natureofcode.com

class Boid {
  constructor(target) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(width / 2, height / 2);

    this.r = 3.0;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force

    this.theta =
      p5.Vector.fromAngle(radians(target.alpha)).heading() + radians(90);
    this.target = createVector(target.x, target.y);
    this.arrived = false;
    this.hidden = true;
  }
  place (x, y) {
    this.position = createVector(mouseX, mouseY);
    this.velocity = p5.Vector.sub(
      createVector(mouseX, mouseY),
      createVector(pmouseX, pmouseY)
    );
    this.hidden = false;
  }

  run (boids) {
    if (this.hidden)
      return;

    if (flock.assemble) {
      this.arrive(this.target);
    } else {
      this.flock(boids);
    }
    this.update();
    this.borders();
    this.render();
  }

  applyForce (force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock (boids) {
    var sep = this.separate(boids); // Separation
    var ali = this.align(boids); // Alignment
    var coh = this.cohesion(boids); // Cohesion

    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  update () {
    if (flock.assemble &&
        !this.arrived &&
        this.target.dist(this.position) < 1) {
      this.arrived = true;
      this.velocity = p5.Vector.fromAngle(this.theta + radians(90));
    } else {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  }

  seek (target) {
    var desired = p5.Vector.sub(target, this.position);
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render () {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    fill(255);
    noStroke();
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  // Wraparound
  borders () {
    if (this.position.x < -this.r)
      this.position.x = width + this.r;
    if (this.position.y < -this.r)
      this.position.y = height + this.r;
    if (this.position.x > width + this.r)
      this.position.x = -this.r;
    if (this.position.y > height + this.r)
      this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate (boids) {
    var desiredseparation = 25.0;
    var steer = createVector(0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align (boids) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      var steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion (boids) {
    var neighbordist = 50;
    var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    var num = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].position); // Add location
        num++;
      }
    }
    if (num > 0) {
      return this.seek(sum.div(num)); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }

  arrive (target) {
    // A vector pointing from the location to the target
    var desired = p5.Vector.sub(target, this.position), d = desired.mag();

    // Scale with arbitrary damping within 100 pixels
    desired.setMag(d < 100 ? map(d, 0, 100, 0, this.maxspeed) : this.maxspeed);

    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }

}

function mouseOnScreen() {
  return mouseX && mouseX <= width && mouseY && mouseY <= height;
}

class Flock {
  constructor() {
    this.count = 0;
    this.boids = [];
    this.assemble = false;
  }
  arrived() {
    var i;
    if (arguments.length) {
      for (i = 0; i < this.boids.length; i++)
        this.boids[i].arrived = arguments[0];
      if (!arguments[0]) this.count = 0;
    } else {
      for (i = 0; i < this.boids.length; i++)
        if (!this.boids[i].arrived) return false;
      return true;
    }
  }

  run() {
    this.assemble = this.count === flock.boids.length;

    if (!this.assemble && mouseOnScreen())
      this.boids[this.count++].place(mouseX, mouseY);

    for (var i = 0; i < this.boids.length; i++) this.boids[i].run(this.boids);
  }
}
