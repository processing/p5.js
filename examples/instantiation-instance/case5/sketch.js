// CASE 3: alternate syntax
// Canvas is auto-generated and appended to body.

var sketch = new p5(function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
    sketch.background(gray);
  };

  sketch.draw = function() {
    sketch.rect(sketch.width/2, sketch.height/2, 200, 200);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }

});