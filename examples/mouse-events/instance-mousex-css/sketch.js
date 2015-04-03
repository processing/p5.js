

var sketch = function(p) {
  p.setup = function() {
    p.createCanvas(300,300);
    p.background(200);
  }
  p.draw = function() {
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  }
};

var myp5 = new p5(sketch, 'canvas1');

