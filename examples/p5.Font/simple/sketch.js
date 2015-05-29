
var textSketch = function(p) {

  var font;

  p.preload = function() {
    font = p.loadFont("../acmesa.ttf");
  };

  p.setup = function() {
    p.createCanvas(240, 160);
    //p.ellipse(20,20,50,70);
    p.textFont(font);
    p.textSize(20);
    p.text("Default Text", 50, 80);
  };

};


new p5(textSketch, 'textSketch');
