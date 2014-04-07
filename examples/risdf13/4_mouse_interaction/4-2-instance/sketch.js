// mouse events - mousePressed(), mouseReleased(), mouseMoved(), mouseDragged()
// runs once each time unlike mousepressed

var s = function(sketch) {
  var gray = 0;

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
  };

  sketch.draw = function() {
    sketch.background(gray);
  };

  sketch.mousePressed = function() {
    gray += 20;
  };
}

var myp5 = new p5(s);