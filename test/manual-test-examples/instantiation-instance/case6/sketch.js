var sketch0 = function( p ) {

  var gray = 0;
  var h = 10; 

  p.setup = function() {
    var cnv = p.createCanvas(400, 400);
    cnv.mousePressed(increaseH);
    p.rectMode(p.CENTER);
    p.print("both gray values should change, rect in sketch0 should change only when clicking on canvas0");
  };

  p.draw = function() {
    p.background(gray);
    p.rect(p.width/2, p.height/2, h, h);
  };

  p.mousePressed = function() {
    gray += 10;
  };

  p.mouseMoved = function() {
    p.print("sketch0 x:"+p.mouseX+" y:"+p.mouseY);
  };

  function increaseH() {
    h += 5;
  }
};

var myp5_0 = new p5(sketch0, 'div0');





var sketch1 = function( p ) {

  var gray = 0; 

  p.setup = function() {
    p.createCanvas(400, 400);
  };

  p.draw = function() {
    p.background(255, 0, 100);
    p.fill(gray);
    p.rect(p.width/2, p.height/2, 50, 50);
  };

  p.mousePressed = function() {
    gray += 10;
  };

  p.mouseMoved = function() {
    console.log("sketch1 x:"+p.mouseX+" y:"+p.mouseY);
  };

  p.mouseReleased = function() {
    console.log("mouseReleased");
  };

  p.keyPressed = function() {
    console.log("keyPressed");
  };

  p.mouseDragged = function() {
    console.log("mouseDragged");
  };
};


var myp5_1 = new p5(sketch1, 'div1');

