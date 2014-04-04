var sketch = function(s) {
  
  console.log(this); // 'this' is the current sketch
  //var s = this;
  
  var loc;
  var velocity;
  
  s.setup = function() {
    
    console.log(this);
    
    s.createCanvas(400, 400);
    loc = PVector(100, 100);
    velocity = s.PVector(2.5, 5);
    s.fill(255,0,255);
    s.noStroke();
    s.strokeWeight = 10;
    //console.log(velocity);
  };
  
  s.draw = function() {
    s.background(255);
    loc.add(velocity);
    if ((loc.x > 400) || (loc.x < 0)) {
      velocity.x = velocity.x * -1;
    }
    if ((loc.y > 400) || (loc.y < 0)) {
      velocity.y = velocity.y * -1;
    }
    s.ellipse(loc.x, loc.y, 24, 24);
  };

};



window.onload = function() {
  var containerNode = document.getElementById('p5-container');
  var myp5 = p5(sketch, containerNode);
  console.log('myp5 instanceof p5 === ' + (myp5 instanceof p5));
};
