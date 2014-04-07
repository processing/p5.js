// Check if mouse is pressed

var s = function(sketch) {

  sketch.setup = function() {
    sketch.createCanvas(600, 600);
    sketch.noStroke();
    sketch.fill(0);
  };

  sketch.draw = function() {
    sketch.background(204);

    if (sketch.isMousePressed() == true) {
      sketch.fill(255); // White
    } else {
      sketch.fill(0); // Black
    }

    sketch.rect(150, 150, 300, 300);
  };

}

var myp5 = new p5(s);