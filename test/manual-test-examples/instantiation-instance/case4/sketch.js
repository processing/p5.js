// CASE 2: node specified, node is a DIV ELEMENT
// A canvas with p5 attached will be inserted inside of it.

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

window.onload = function() {
  const containerNode = document.getElementById('p5-container');
  const myp5 = new p5(sketch, containerNode);
};
