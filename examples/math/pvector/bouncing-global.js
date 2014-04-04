var loc; // ATTENTION! 'location' is a property of window! use 'loc' instead
var velocity = PVector(2.5, 5);

setup = function() {
  createCanvas(400, 400);
  background(0, 0, 255);
  loc = PVector(100, 100);
  //velocity = PVector(2.5, 5);
  fill(255, 0, 255);
  noStroke();
  strokeWeight = 10;
  //console.log(velocity);
};

draw = function() {
  background(255);
  loc.add(velocity);
  if ((loc.x > 400) || (loc.x < 0)) {
    velocity.x = velocity.x * -1;
  }
  if ((loc.y > 400) || (loc.y < 0)) {
    velocity.y = velocity.y * -1;
  }
  ellipse(loc.x, loc.y, 24, 24);
};