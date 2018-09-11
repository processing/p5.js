// CASE 1: no node specified, createCanvas called
// Canvas is generated and appended to body.

const sketch = function(p) {
  let gray = 0;

  p.setup = function() {
    p.createCanvas(400, 400);
  };

  p.draw = function() {
    p.background(gray);
    p.rect(p.width / 2, p.height / 2, 50, 50);
  };

  p.mousePressed = function() {
    gray += 10;
  };
};

const myp5 = new p5(sketch);
