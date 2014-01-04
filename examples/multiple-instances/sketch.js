// Creating and drawing to more than one canvas.
(function(){

  function sketchProc1(p) {

    p.setup = function() {
      p.canvas = p.createGraphics(200, 200);
      p.canvas.position(50, 50);
    };

    p.draw = function() {
      p.context(p.canvas);
      p.background(120, 180, 200);
      p.ellipse(p.width / 2, p.height / 2, 100, 100);
    };

  }

  function sketchProc2(p) {

    p.setup = function() {
      p.canvas = p.createGraphics(600, 400);
      p.canvas.position(300, 50);
    };

    p.draw = function() {
      p.context(p.canvas);
      p.background(50, 120, 80);
      p.rect(p.width / 4, p.height / 4, p.width / 2, p.height / 2);
    };

  }

  var p = new Processing(null, sketchProc1);
  var q = new Processing(null, sketchProc2);

}());