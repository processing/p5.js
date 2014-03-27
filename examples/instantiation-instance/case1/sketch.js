// CASE 1: node specified, node is a CANVAS ELEMENT ID
// p5 will attach to canvas node specified.

var s = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
  };

  sketch.draw = function() {
    sketch.background(gray);
    sketch.rect(sketch.width/2, sketch.height/2, 200, 200);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }

};

var sketch = new p5(s, 'p5-canvas');