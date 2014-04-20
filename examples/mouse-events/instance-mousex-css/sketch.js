

var sketch = function(s) {
  s.setup = function() {
    s.createCanvas(300,300);
    s.background(200);
  }
  s.draw = function() {
    s.ellipse(s.mouseX, s.mouseY, 50, 50);
  }
};

var p = new p5(sketch, 'canvas1');

