var s0 = function( sketch ) {

  var v;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);

    var h1 = sketch.createH1('pause');
    h1.position(250, 50);
    h1.mousePressed(function() {
      v.pause();
    });

    v = sketch.createVideo('fingers.mov');
    v.hide();
    v.loop();
  };

  sketch.draw = function() {
    sketch.background(30, 100, 200);
    sketch.video(v, 30, 30, 200, 200);
  };

  sketch.keyPressed = function() {
    v.play();
  };


};

var myp5_0 = new p5(s0, 'div0');




