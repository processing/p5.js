var s0 = function( sketch ) {

  var v;
  var h1;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);

    h1 = sketch.createElement('h1', 'press a key');
    h1.position(40, 250);
    h1.mousePressed(function() {
      v.pause();
      h1.html('press a key');
    });

    v = sketch.createVideo('../fingers.mov');
    v.hide();
  };

  sketch.draw = function() {
    sketch.background(30, 100, 200);
    sketch.image(v, 30, 30, 200, 200);
  };

  sketch.keyPressed = function() {
    v.loop();
    h1.html('click here to pause');
  };

  sketch.mousePressed = function() {
    console.log('press')
  }

  sketch.mouseReleased = function() {
    console.log('released')
  }

};

var myp5_0 = new p5(s0, 'div0');




