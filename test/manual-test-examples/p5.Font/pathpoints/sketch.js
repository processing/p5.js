// Adapted from Dan Shiffman's 'The Nature
// of Code': http://natureofcode.com

var flock;

function setup() {
  createCanvas(500, 300);

  flock = new Flock();

  loadFont('../opentype/AvenirNextLTPro-Demi.otf', function(f) {
    var points = f.textToPoints('p5.js', 80, 185, 150);
    for (var k = 0; k < points.length; k++) {
      flock.boids.push(new Boid(points[k]));
    }
  });
}

function draw() {
  var c = flock.count / flock.boids.length;
  background(c * 237, 34, 93);
  flock.run();
}

function mouseReleased() {
  if (flock.arrived()) flock.arrived(false);
}
