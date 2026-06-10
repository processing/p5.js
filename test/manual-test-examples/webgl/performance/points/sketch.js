class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 5));
    this.acc = createVector();
  }
  update  () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  show  () {
    vertex(this.pos.x, this.pos.y);
  }

  attracted  (target) {
    var force = p5.Vector.sub(target, this.pos);
    var dsquared = force.magSq();
    dsquared = constrain(dsquared, 25, 500);
    var G = 10;
    var strength = G / dsquared;
    force.setMag(strength);
    this.acc.add(force);
  }

}

var attractor_1;
var attractor_2;
var attractor_3;
var attractor_4;
var particles = [];

function setup() {
  background(51);
  createCanvas(800, 600, WEBGL);

  for (var i = 0; i < 5000; i++) {
    particles.push(new Particle(0, 0));
  }

  attractor_1 = createVector(-150, 0);
  attractor_2 = createVector(150, 0);
  attractor_3 = createVector(0, -150);
  attractor_4 = createVector(0, 150);

  stroke(255);
}

function draw() {
  background(51);
  strokeWeight(6);
  point(attractor_1.x, attractor_1.y);
  point(attractor_2.x, attractor_2.y);
  point(attractor_3.x, attractor_3.y);
  point(attractor_4.x, attractor_4.y);

  strokeWeight(1);

  beginShape(POINTS);
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.attracted(attractor_1);
    particle.attracted(attractor_2);
    particle.attracted(attractor_3);
    particle.attracted(attractor_4);
    particle.update();
    particle.show();
  }
  endShape();
}
