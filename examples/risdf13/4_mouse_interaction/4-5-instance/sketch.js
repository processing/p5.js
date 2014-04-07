var s = function(sketch) {

  var dragX, dragY, moveX, moveY;

  sketch.setup = function() {
    sketch.createCanvas(600, 600);
    sketch.smooth();
    sketch.noStroke();
  };

  sketch.draw = function() {
    sketch.background(255);
    sketch.fill(0);
    sketch.ellipse(dragX, dragY, 100, 100); // Black circle
    sketch.fill(153);
    sketch.ellipse(moveX, moveY, 100, 100); // Gray circle
  };

  sketch.mouseMoved = function() { // Move gray circle
    moveX = sketch.mouseX;
    moveY = sketch.mouseY;
  };

  sketch.mouseDragged = function() { // Move black circle
    dragX = sketch.mouseX;
    dragY = sketch.mouseY;
  };

}

var myp5 = new p5(s);