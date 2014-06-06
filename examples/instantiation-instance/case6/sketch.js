var s0 = function( sketch ) {

  var gray = 0;
  var h = 10; 

  sketch.setup = function() {
    var cnv = sketch.createCanvas(400, 400);
    cnv.mousePressed(increaseH);
    sketch.rectMode(sketch.CENTER);
    sketch.print("both gray values should change, rect in sketch0 should change only when clicking on canvas0");
  };

  sketch.draw = function() {
    sketch.background(gray);
    sketch.rect(sketch.width/2, sketch.height/2, h, h);
  };

  sketch.mousePressed = function() {
    gray += 10;
  };

  sketch.mouseMoved = function() {
    sketch.print("sketch0 x:"+sketch.mouseX+" y:"+sketch.mouseY);
  };

  function increaseH() {
    h += 5;
  }
};

var myp5_0 = new p5(s0, 'div0');





var s1 = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
  };

  sketch.draw = function() {
    sketch.background(255, 0, 100);
    sketch.fill(gray);
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  };

  sketch.mousePressed = function() {
    gray += 10;
  };

  sketch.mouseMoved = function() {
    console.log("sketch1 x:"+sketch.mouseX+" y:"+sketch.mouseY);
  };

  sketch.mouseReleased = function() {
    console.log("mouseReleased");
  };

  sketch.keyPressed = function() {
    console.log("keyPressed");
  };

  sketch.mouseDragged = function() {
    console.log("mouseDragged");
  };
};


var myp5_1 = new p5(s1, 'div1');

