// CASE 0: no node specified
// Canvas is auto-generated and appended to body.
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

var sketch = new p5(s);