var s = function(sketch) {

  var gray = 0;

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
    sketch.background(100, 200, 30);
    sketch.fill(0, 102);
    sketch.noStroke();
  };

  sketch.draw = function() {  // Empty draw() keeps the program running
  };

  sketch.mouseReleased = function() {
    sketch.rect(sketch.mouseX, sketch.mouseY, 33, 33);
  };
}

var myp5 = new p5(s);