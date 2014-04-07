// Check which mouse button is pressed

var s = function(sketch) {

  sketch.setup = function() {
    sketch.createCanvas(600, 600);
    sketch.noStroke();
    sketch.fill(0);
  };

  sketch.draw = function() {
    sketch.background(204);

    // mouseButton - black, white, gray
    if (sketch.isMousePressed() == true) {
      if (sketch.mouseButton == sketch.LEFT) {
        sketch.fill(0); // Black
      } else if (sketch.mouseButton == sketch.RIGHT) {
        sketch.fill(255); // White
      }
    } else {
      sketch.fill(126); // Gray
    }

    sketch.rect(150, 150, 300, 300);
  };

}

var myp5 = new p5(s);