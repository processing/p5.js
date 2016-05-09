var sketch0 = function( p ) {

  var v;
  var h1;

  p.setup = function() {
    p.createCanvas(400, 400);

    h1 = p.createElement('h1', 'press a key');
    h1.position(40, 250);
    h1.mousePressed(function() {
      v.pause();
      h1.html('press a key');
    });

    v = p.createVideo('../fingers.mov');
    v.hide();
  };

  p.draw = function() {
    p.background(30, 100, 200);
    p.image(v, 30, 30, 200, 200);
  };

  p.keyPressed = function() {
    v.loop();
    h1.html('click here to pause');
  };

  p.mousePressed = function() {
    console.log('press')
  }

  p.mouseReleased = function() {
    console.log('released')
  }

};

var myp5_0 = new p5(sketch0, 'div0');




