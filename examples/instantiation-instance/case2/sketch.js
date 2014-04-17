// CASE 2: node specified, node is a CANVAS ELEMENT
// A canvas with p5 attached will be inserted inside of it.
var s = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
    console.log(sketch.DEGREES);
  };

  sketch.draw = function() {
    sketch.background(gray);
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }
  
};

window.onload = function() {
  var canvasNode = document.getElementById( 'p5-canvas' );
  var myp5 = new p5(s, canvasNode);
};