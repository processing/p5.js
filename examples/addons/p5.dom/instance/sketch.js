var s0 = function( sketch ) {

  var v;
  var h1;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);

    h1 = sketch.createH1('press a key');
    h1.position(40, 250);
    h1.mousePressed(function() {
      v.pause();
      h1.html('press a key');
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
    h1.html('click to pause');
  };


};

var myp5_0 = new p5(s0, 'div0');




