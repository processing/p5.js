// CASE 2: node specified, node is a DIV ELEMENT ID
// A canvas with p5 attached will be inserted inside of it.
var s = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
  };

  sketch.draw = function() {
    sketch.background(gray);
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }
  
};

var myp5 = new p5(s, 'p5-container');