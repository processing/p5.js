var sketch = function(s) {

  var location;
  var velocity;
  var width = window.innerWidth;
  var height = window.innerHeight;

  s.setup = function() {
    s.createCanvas(400, 400);
    location = new PVector(100, 100);
    velocity = new PVector(2.5, 5);
    s.fill(255,0,255);
    s.noStroke();
    s.strokeWeight = 10;
    //console.log(velocity);
  };

  s.draw = function() {
    s.background(255);
    location.add(velocity);
    if ((location.x > 400) || (location.x < 0)) {
      velocity.x = velocity.x * -1;
    }
    if ((location.y > 400) || (location.y < 0)) {
      velocity.y = velocity.y * -1;
    }
    s.ellipse(location.x, location.y, 24, 24);
  };

};

window.onload = function() {
  var containerNode = document.getElementById('p5-container');
  var myp5 = p5(sketch, containerNode);
  //console.log(myp5);
};