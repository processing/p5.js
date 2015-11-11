// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// An object for a draggable attractive body in our world

var Attractor = function() {
  this.position = createVector(width/2, height/2);
  this.mass = 20;
  this.G = 1;
  this.dragOffset = createVector(0, 0);
  this.dragging = false;
  this.rollover = false;
};

Attractor.prototype.calculateAttraction = function(m) {
  // Calculate direction of force
  var force = p5.Vector.sub(this.position, m.position);
  // Distance between objects       
  var distance = force.mag();
  // Limiting the distance to eliminate "extreme" results for very close or very far objects                            
  distance = constrain(distance, 5, 25);
  // Normalize vector (distance doesn't matter here, we just want this vector for direction)                                  
  force.normalize();
  // Calculate gravitional force magnitude  
  var strength = (this.G * this.mass * m.mass) / (distance * distance);
  // Get force vector --> magnitude * direction
  force.mult(strength);
  return force;
};

// Method to display
Attractor.prototype.display = function() {
  ellipseMode(CENTER);
  strokeWeight(4);
  stroke(0);
  if (this.dragging) {
    fill(50);
  } else if (this.rollover) {
    fill(100);
  } else {
    fill(175, 200);
  }
  ellipse(this.position.x, this.position.y, this.mass*2, this.mass*2);
};

  // The methods below are for mouse interaction
Attractor.prototype.handleClick = function(mx, my) {
  var d = dist(mx, my, this.position.x, this.position.y);
  if (d < this.mass) {
    this.dragging = true;
    this.dragOffset.x = this.position.x - mx;
    this.dragOffset.y = this.position.y - my;
  }
};

Attractor.prototype.handleHover = function(mx, my) {
  var d = dist(mx, my, this.position.x, this.position.y);
  if (d < this.mass) {
    this.rollover = true;
  } else {
    this.rollover = false;
  }
};

Attractor.prototype.stopDragging = function() {
  this.dragging = false;
};

Attractor.prototype.handleDrag = function(mx, my) {
  if (this.dragging) {
    this.position.x = mx + this.dragOffset.x;
    this.position.y = my + this.dragOffset.y;
  }
};
